import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../types/visualEffects';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { Download } from '@mui/icons-material';
import { generateEffectsDescription } from '../utils/effectsDescription';
import { createSceneManager } from '../utils/threeSceneManager';
import { createVisualizationMesh, updateShaderUniforms } from '../utils/shaderManager';
import { generateCSSFilters } from '../utils/cssFilterManager';
import { YOUTUBE_EMBED_URL, YOUTUBE_IFRAME_PROPS, getFamousPersonVideoUrl } from '../utils/appConstants';
import { saveVisionSimulation } from '../utils/screenshotCapture';
import { PerformanceOptimizer, EffectProcessor, OverlayManager, AnimationManager } from '../utils/performanceOptimizer';

interface VisualizerProps {
  effects: VisualEffect[];
  inputSource: InputSource;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  personName?: string;
  personCondition?: string;
  showComparison?: boolean;
  onToggleComparison?: () => void;
  isFamousPeopleMode?: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ effects, inputSource, diplopiaSeparation = 1.0, diplopiaDirection = 0.0, personName, personCondition, showComparison: propShowComparison, onToggleComparison, isFamousPeopleMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationContainerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showComparison, setShowComparison] = useState(propShowComparison || false);

  // Update local showComparison state when prop changes
  useEffect(() => {
    console.log('Visualizer: propShowComparison changed to:', propShowComparison, 'isFamousPeopleMode:', isFamousPeopleMode);
    if (propShowComparison !== undefined) {
      // Use explicit prop when provided
      setShowComparison(propShowComparison);
    } else if (isFamousPeopleMode && personName && personCondition) {
      // Auto-enable for famous people when no explicit prop
      setShowComparison(true);
    }
  }, [personName, personCondition, propShowComparison, isFamousPeopleMode]);

  // Performance optimization instances
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const effectProcessor = useRef(new EffectProcessor());
  const overlayManager = useRef(new OverlayManager());
  const animationManager = useRef(AnimationManager.getInstance());

  // Helper function to avoid repeated effects.find() calls
  // const getEffect = useCallback((id: string) => effects.find(e => e.id === id), [effects]);

  // Enable comparison mode for famous people or when explicitly requested

  // Retry camera access
  const handleRetryCamera = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  }, []);

  // Save screenshot handler
  const handleSaveScreenshot = useCallback(async () => {
    if (!containerRef.current) {
      setSaveMessage('Error: Could not find visualizer container');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await saveVisionSimulation(
        containerRef.current,
        effects,
        inputSource.type,
        diplopiaSeparation,
        diplopiaDirection
      );
      setSaveMessage('Screenshot saved successfully!');
    } catch (error) {
      console.error('Failed to save screenshot:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save screenshot');
    } finally {
      setIsSaving(false);
    }
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection]);

  // Keyboard shortcut for saving (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!isSaving && !isLoading) {
          handleSaveScreenshot();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveScreenshot, isSaving, isLoading]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Don't set up Three.js if we're in comparison mode
    if (showComparison) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Set up Three.js scene using utility
    console.log('Creating Three.js scene for container:', containerRef.current);
    const sceneManager = createSceneManager(containerRef.current);
    const { scene, camera, renderer, dispose } = sceneManager;
    console.log('Three.js scene created successfully:', { scene, camera, renderer });

    // Capture current ref values to avoid stale closure issues in cleanup
    const currentAnimationManager = animationManager.current;
    const currentOverlayManager = overlayManager.current;

    // Optimized animation setup using performance manager
    const enabledEffectsCount = effects.filter(e => e.enabled).length;
    const needsAnimation = effects.some(e => 
      (e.id === 'scotoma' || e.id === 'visualFloaters' || e.id === 'retinitisPigmentosa') && e.enabled
    );
    
    // Create optimized animation callback
    const updateOverlays = () => {
      // Only update if effects have changed
      const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);
      
      if (changed && containerRef.current) {
        // Update overlays efficiently
        overlayManager.current.updateOverlays(enabledEffects, containerRef.current);
      }
      
      // Update animated overlays
      overlayManager.current.updateAnimatedOverlays(enabledEffects);
    };
    
    // Add animation callback to unified manager
    if (needsAnimation && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      animationManager.current.addCallback(updateOverlays);
    }

    // Handle different input sources
    const setupMedia = async () => {
      try {
        if (inputSource.type === 'webcam') {
          // Camera feature is disabled - show error message
          setError('Camera feature is currently disabled. This is a premium feature coming soon.');
          setIsLoading(false);
          return;
          
        } else if (inputSource.type === 'image' && inputSource.url) {
          console.log('Loading image texture from URL:', inputSource.url);
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
          console.log('Image texture loaded successfully:', imageTexture);
          setTexture(imageTexture);
          setIsLoading(false);
        } else if (inputSource.type === 'youtube') {
          // For YouTube, we'll use CSS filters instead of WebGL textures
          setTexture(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Media setup error:', err);
        
        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and refresh the page.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera and try again.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera is already in use by another application. Please close other camera applications and try again.');
          } else if (err.name === 'OverconstrainedError') {
            setError('Camera constraints cannot be satisfied. Trying with basic settings...');
            // Try again with basic constraints
            try {
              const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
              streamRef.current = basicStream;
              const video = mediaRef.current as HTMLVideoElement;
              video.srcObject = basicStream;
              await video.play();
              const videoTexture = new THREE.VideoTexture(video);
              setTexture(videoTexture);
              setIsLoading(false);
              return;
            } catch (basicErr) {
              setError('Failed to access camera with basic settings. Please check your camera permissions.');
            }
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('Failed to load media');
        }
        setIsLoading(false);
      }
    };

    setupMedia();

    // Create mesh for non-YouTube content using utility
    const mesh = createVisualizationMesh();
    scene.add(mesh);

    // Optimized animation loop with performance monitoring
    const animate = () => {
      // Stop animation if we're in comparison mode
      if (showComparison) {
        return;
      }
      
      // Monitor performance and throttle if needed
      optimizer.current.monitorPerformance();
      
      if (mesh && texture) {
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.tDiffuse.value = texture;
        console.log('Applied texture to shader material:', texture);
        
        // Only update shader uniforms if effects have changed
        const { changed } = effectProcessor.current.updateEffects(effects);
        if (changed) {
          updateShaderUniforms(material, effects, diplopiaSeparation, diplopiaDirection);
        }
        
        renderer.render(scene, camera);
      } else {
        // Only log this if we're actually in Three.js mode (not comparison mode)
        if (!showComparison) {
          console.log('Three.js: No mesh or texture available for rendering');
        }
      }
      
      // Use optimal frame rate based on condition count
      const frameRate = optimizer.current.getOptimalFrameRate(enabledEffectsCount);
      if (frameRate < 60) {
        setTimeout(() => requestAnimationFrame(animate), 1000 / frameRate - 16.67);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    // Only start animation loop if not in comparison mode
    if (!showComparison) {
      animate();
    }

    // Cleanup
    return () => {
      if (inputSource.type === 'webcam') {
        // Camera feature is disabled - no cleanup needed
        return;
      }
      
      // Remove animation callback from unified manager
      currentAnimationManager.removeCallback(updateOverlays);
      
      // Clear overlays
      currentOverlayManager.clearOverlays();
      
      // Use the dispose function from scene manager
      dispose();
    };
  }, [inputSource, retryCount, diplopiaDirection, diplopiaSeparation, effects, texture, showComparison]); // Recreate scene when input source changes or retry is triggered

  // Update shader uniforms when effects change (separate from scene creation)
  useEffect(() => {
    // Shader uniforms are updated in the animation loop, no need for separate effect
    // This prevents unnecessary re-renders and potential recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, diplopiaSeparation, diplopiaDirection, texture]);

  // Optimized effect state changes handling
  useEffect(() => {
    console.log('Visualizer useEffect triggered:', {
      effectsCount: effects.length,
      enabledEffects: effects.filter(e => e.enabled).length,
      enabledEffectIds: effects.filter(e => e.enabled).map(e => e.id),
      inputSourceType: inputSource.type,
      showComparison,
      isFamousPeopleMode
    });
    
    // Only process if effects have actually changed
    const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);
    
    console.log('Effect processor result:', {
      changed,
      enabledEffectsCount: enabledEffects.length,
      enabledEffectIds: enabledEffects.map(e => e.id)
    });
    
    // Force overlay update when transitioning to comparison view or when effects are enabled
    const hasEnabledEffects = enabledEffects.length > 0;
    const shouldUpdateOverlays = changed || (hasEnabledEffects && showComparison);
    
    if (!shouldUpdateOverlays) {
      console.log('Effects unchanged and not in comparison mode, skipping overlay update');
      return;
    }
    
    console.log('Proceeding with overlay update:', {
      changed,
      hasEnabledEffects,
      showComparison,
      shouldUpdateOverlays
    });
    
    // Create visual field overlays for YouTube and image content
    if (inputSource.type === 'youtube' || inputSource.type === 'image') {
      // For YouTube and image content, only create overlays for non-diplopia effects
      const nonDiplopiaEffects = enabledEffects.filter(e => 
        e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
      );
      
      console.log('Non-diplopia effects for overlay:', {
        count: nonDiplopiaEffects.length,
        effects: nonDiplopiaEffects.map(e => e.id)
      });
      
      if (nonDiplopiaEffects.length > 0) {
        // Use simulation container for comparison mode, main container for other modes
        const targetContainer = showComparison && simulationContainerRef.current 
          ? simulationContainerRef.current 
          : containerRef.current;
        
        console.log('Overlay update debug:', {
          showComparison,
          simulationContainerRef: simulationContainerRef.current,
          containerRef: containerRef.current,
          targetContainer,
          targetContainerId: targetContainer?.id,
          targetContainerClass: targetContainer?.className,
          nonDiplopiaEffects: nonDiplopiaEffects.map(e => e.id)
        });
        
        if (targetContainer) {
          // Use optimized overlay manager
          console.log('Calling overlayManager.updateOverlays with:', {
            effects: nonDiplopiaEffects,
            targetContainer
          });
          overlayManager.current.updateOverlays(nonDiplopiaEffects, targetContainer);
        } else {
          console.log('No target container found for overlay update');
        }
      } else {
        console.log('No non-diplopia effects to process');
      }
    } else {
      console.log('Not YouTube or image input, skipping overlay creation');
    }
    
    // Check if we need animation (for overlay-based effects)
    const needsAnimation = enabledEffects.some(e => 
      e.id === 'visualFloaters' || e.id === 'scotoma'
    );
    
    if (needsAnimation && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      // Animation is now handled by the unified animation manager
      // No need for separate animation loop here
    }
  }, [effects, inputSource.type, showComparison, isFamousPeopleMode]);

  // Optimized CSS filter calculation with caching
  const getEffectStyles = useCallback(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain'
    };

    if (inputSource.type === 'youtube') {
      // Use optimized effect processor to get enabled effects
      const { enabledEffects } = effectProcessor.current.updateEffects(effects);
      const nonDiplopiaEffects = enabledEffects.filter(e => 
        e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
      );
      
      console.log('getEffectStyles - CSS filter generation:', {
        enabledEffectsCount: enabledEffects.length,
        enabledEffectIds: enabledEffects.map(e => e.id),
        nonDiplopiaEffectsCount: nonDiplopiaEffects.length,
        nonDiplopiaEffectIds: nonDiplopiaEffects.map(e => e.id)
      });
      
      // Only generate filters if there are effects to process
      if (nonDiplopiaEffects.length > 0) {
        const filters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
        console.log('Generated CSS filters:', filters);
        return filters ? { ...baseStyle, filter: filters } : baseStyle;
      }
    }

    console.log('getEffectStyles - returning base style (no filters)');
    return baseStyle;
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection]);

  // Get appropriate video URL based on context
  const getVideoUrl = useCallback(() => {
    if (isFamousPeopleMode && personName && personCondition) {
      // Use famous person specific video URL
      return getFamousPersonVideoUrl();
    }
    // Use standard video URL for regular simulator
    return YOUTUBE_EMBED_URL;
  }, [personName, personCondition, isFamousPeopleMode]);


  // Optimized diplopia overlay generation
  const getDiplopiaOverlay = useCallback(() => {
    if (inputSource.type !== 'youtube') return null;

    // Use optimized effect processor for faster lookups
    const diplopiaMonocular = effectProcessor.current.getEffect('diplopiaMonocular');
    const diplopiaBinocular = effectProcessor.current.getEffect('diplopiaBinocular');
    
    // Only create diplopia overlay if one of the diplopia conditions is actually enabled
    const diplopia = diplopiaMonocular?.enabled ? diplopiaMonocular : 
                     diplopiaBinocular?.enabled ? diplopiaBinocular : null;
    
    if (!diplopia) return null;

    // Calculate offset based on direction
    const baseOffset = diplopia.intensity * (diplopiaMonocular?.enabled ? 15 : 20);
    const totalOffset = baseOffset * diplopiaSeparation;
    const [offsetX, offsetY] = diplopiaDirection < 0.33 
      ? [totalOffset, 0] 
      : diplopiaDirection < 0.66 
        ? [0, totalOffset * 0.5] 
        : [totalOffset * 0.7, totalOffset * 0.35];

    const iframeProps: React.IframeHTMLAttributes<HTMLIFrameElement> = {
      ...YOUTUBE_IFRAME_PROPS,
      src: getVideoUrl(),
      title: `YouTube video player (${diplopiaMonocular?.enabled ? 'ghost' : 'second image'}) - ${Math.random().toString(36).substr(2, 9)}`,
      style: { ...YOUTUBE_IFRAME_PROPS.style, pointerEvents: "none" }
    };

    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
        width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1001,
        opacity: diplopiaMonocular?.enabled ? 0.3 + diplopia.intensity * 0.2 : 0.5,
        filter: diplopiaMonocular?.enabled ? 'blur(2px)' : undefined,
        mixBlendMode: diplopiaMonocular?.enabled ? 'multiply' : undefined
      }}>
        <iframe {...iframeProps} title="Vision Simulator" />
      </div>
    );
  }, [inputSource.type, diplopiaSeparation, diplopiaDirection, getVideoUrl]);

  const getVisualizerDescription = () => generateEffectsDescription(effects, inputSource);

  // Render comparison view for famous people or general vision simulation
  console.log('Comparison view check:', {
    showComparison,
    personName,
    personCondition,
    isFamousPeopleMode,
    shouldShowComparison: showComparison
  });
  
  if (showComparison) {
    return (
      <Box className="comparison-container" sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}>
        {/* Comparison Header */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {isFamousPeopleMode && personName && personCondition 
              ? `${personName} - ${personCondition}` 
              : 'Vision Condition Simulation - Multiple Vision Conditions'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Side-by-side comparison: Vision simulation (left) vs. Original video (right)
          </Typography>
        </Box>

        {/* Left side - Simulation video */}
        <Box sx={{ 
          position: 'absolute',
          left: 0,
          top: '60px',
          width: '50%',
          height: 'calc(100% - 60px)',
          borderRight: '2px solid #fff'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            zIndex: 1001,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Simulation
          </Box>
          <div ref={simulationContainerRef} style={getEffectStyles()}>
            {inputSource.type === 'youtube' ? (
              <div style={{ 
                width: '100%', 
                height: '100%',
                position: 'relative',
                // Apply SVG filters for color vision conditions (same as selection page)
                filter: (() => {
                  const { enabledEffects } = effectProcessor.current.updateEffects(effects);
                  const colorVisionEffect = enabledEffects.find(e => 
                    ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                  );
                  
                  if (colorVisionEffect) {
                    console.log('Applying SVG filter for iframe:', colorVisionEffect.id);
                    const filterMap: { [key: string]: string } = {
                      'protanopia': 'url(#protanopia)',
                      'deuteranopia': 'url(#deuteranopia)',
                      'tritanopia': 'url(#tritanopia)',
                      'protanomaly': 'url(#protanomaly)',
                      'deuteranomaly': 'url(#deuteranomaly)',
                      'tritanomaly': 'url(#tritanomaly)',
                      'monochromacy': 'url(#monochromacy)',
                      'monochromatic': 'url(#monochromacy)'
                    };
                    return filterMap[colorVisionEffect.id] || 'none';
                  }
                  
                  // Apply other CSS filters (blur, etc.) for non-color-vision effects
                  const otherEffects = enabledEffects.filter(e => 
                    !['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                  );
                  
                  if (otherEffects.length > 0) {
                    const { enabledEffects: nonColorEffects } = effectProcessor.current.updateEffects(otherEffects);
                    const nonDiplopiaEffects = nonColorEffects.filter(e => 
                      e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
                    );
                    
                    if (nonDiplopiaEffects.length > 0) {
                      const filters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
                      return filters || 'none';
                    }
                  }
                  
                  return 'none';
                })()
              }}>
                <iframe
                  {...YOUTUBE_IFRAME_PROPS}
                  src={getVideoUrl()}
                  title="Vision simulation"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : inputSource.type === 'image' && inputSource.url ? (
              <div style={{ 
                width: '100%', 
                height: '100%',
                position: 'relative',
                // Apply SVG filters for color vision conditions (same as selection page)
                filter: (() => {
                  const { enabledEffects } = effectProcessor.current.updateEffects(effects);
                  const colorVisionEffect = enabledEffects.find(e => 
                    ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                  );
                  
                  if (colorVisionEffect) {
                    console.log('Applying SVG filter for uploaded image:', colorVisionEffect.id);
                    const filterMap: { [key: string]: string } = {
                      'protanopia': 'url(#protanopia)',
                      'deuteranopia': 'url(#deuteranopia)',
                      'tritanopia': 'url(#tritanopia)',
                      'protanomaly': 'url(#protanomaly)',
                      'deuteranomaly': 'url(#deuteranomaly)',
                      'tritanomaly': 'url(#tritanomaly)',
                      'monochromacy': 'url(#monochromacy)',
                      'monochromatic': 'url(#monochromacy)'
                    };
                    return filterMap[colorVisionEffect.id] || 'none';
                  }
                  
                  // Apply other CSS filters (blur, etc.) for non-color-vision effects
                  const otherEffects = enabledEffects.filter(e => 
                    !['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                  );
                  
                  if (otherEffects.length > 0) {
                    const { enabledEffects: nonColorEffects } = effectProcessor.current.updateEffects(otherEffects);
                    const nonDiplopiaEffects = nonColorEffects.filter(e => 
                      e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
                    );
                    
                    if (nonDiplopiaEffects.length > 0) {
                      const filters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
                      return filters || 'none';
                    }
                  }
                  
                  return 'none';
                })()
              }}>
                <img
                  src={inputSource.url}
                  alt="Uploaded with vision simulation"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Typography>Simulation content would appear here</Typography>
              </Box>
            )}
          </div>
          {getDiplopiaOverlay()}
        </Box>

        {/* Right side - Original video */}
        <Box sx={{ 
          position: 'absolute',
          right: 0,
          top: '60px',
          width: '50%',
          height: 'calc(100% - 60px)'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 1001,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Original
          </Box>
          {inputSource.type === 'youtube' ? (
            <iframe
              {...YOUTUBE_IFRAME_PROPS}
              src={YOUTUBE_EMBED_URL}
              title="Original YouTube video"
              style={{ width: '100%', height: '100%' }}
            />
          ) : inputSource.type === 'image' && inputSource.url ? (
            <img
              src={inputSource.url}
              alt="Original uploaded"
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Typography>Original content would appear here</Typography>
            </Box>
          )}
        </Box>

        {/* Toggle button */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <Button
            variant="contained"
            onClick={onToggleComparison || (() => setShowComparison(false))}
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
            }}
          >
            View Full Simulation
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="visualizer-container" sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '600px',
      '@keyframes visualSnowAnimation': {
        '0%': { backgroundPosition: '0% 0%', opacity: 1 },
        '25%': { backgroundPosition: '100% 0%', opacity: 1.05 },
        '50%': { backgroundPosition: '100% 100%', opacity: 1 },
        '75%': { backgroundPosition: '0% 100%', opacity: 0.95 },
        '100%': { backgroundPosition: '0% 0%', opacity: 1 }
      }
    }}>
      {isLoading && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%' 
          }}
          role="status"
          aria-label="Loading visualization"
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Loading visualization...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert 
          severity="error"
          aria-live="assertive"
          action={
            inputSource.type === 'webcam' && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetryCamera}
                disabled={isLoading}
              >
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}
      
      <div 
        ref={containerRef}
        role="img" 
        aria-label={getVisualizerDescription()}
        style={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: inputSource.type === 'youtube' ? 'none' : 'block'
        }}
      >
        {inputSource.type === 'webcam' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            style={{ display: 'none' }}
          />
        ) : inputSource.type === 'image' ? (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            style={{ display: 'none' }}
            src={inputSource.url}
            alt="Uploaded content for visualization"
          />
        ) : null}
      </div>

      {inputSource.type === 'youtube' && (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* Message for sighted users about complete blindness simulation */}
          {effects.some(e => e.id === 'completeBlindness' && e.enabled) && (
            <Box sx={{ 
              position: 'absolute', 
              top: 10, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'center',
              maxWidth: '90%'
            }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                🎵 Audio is playing - The complete blackness you see is the correct visualization of complete blindness
              </Typography>
            </Box>
          )}
          <div style={getEffectStyles()}>
            <iframe
              {...YOUTUBE_IFRAME_PROPS}
              src={YOUTUBE_EMBED_URL}
              title="YouTube video player"
            />
          </div>
          {getDiplopiaOverlay()}
        </Box>
      )}
      
      {/* Save button and description */}
      <Box 
        className="visualizer-description" 
        sx={{ 
          mt: 2,
          p: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
          backgroundColor: '#f9f9f9'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Visualization Description
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showComparison && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onToggleComparison || (() => setShowComparison(true))}
                disabled={isLoading}
              >
                Show Comparison
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Download />}
              onClick={handleSaveScreenshot}
              disabled={isSaving || isLoading}
              className="save-button"
              sx={{ minWidth: 140 }}
              title="Save your vision simulation result (Ctrl+S or Cmd+S)"
            >
              {isSaving ? 'Saving...' : 'Save Result'}
            </Button>
          </Box>
        </Box>
        <Typography>
          {getVisualizerDescription()}
        </Typography>
      </Box>

      {/* Save message snackbar */}
      <Snackbar
        open={!!saveMessage}
        autoHideDuration={4000}
        onClose={() => setSaveMessage(null)}
        message={saveMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Visualizer; 