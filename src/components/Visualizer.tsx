import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../types/visualEffects';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { Download } from '@mui/icons-material';
import { generateEffectsDescription } from '../utils/effectsDescription';
import { createSceneManager } from '../utils/threeSceneManager';
import { createVisualizationMesh, updateShaderUniforms } from '../utils/shaderManager';
import { generateCSSFilters } from '../utils/cssFilterManager';
import { YOUTUBE_EMBED_URL, YOUTUBE_IFRAME_PROPS } from '../utils/appConstants';
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
}

const Visualizer: React.FC<VisualizerProps> = ({ effects, inputSource, diplopiaSeparation = 1.0, diplopiaDirection = 0.0, personName, personCondition, showComparison: propShowComparison, onToggleComparison }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Performance optimization instances
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const effectProcessor = useRef(new EffectProcessor());
  const overlayManager = useRef(new OverlayManager());
  const animationManager = useRef(AnimationManager.getInstance());

  // Helper function to avoid repeated effects.find() calls
  // const getEffect = useCallback((id: string) => effects.find(e => e.id === id), [effects]);

  // Enable comparison mode for famous people or when explicitly requested
  useEffect(() => {
    if (propShowComparison !== undefined) {
      // Use explicit prop when provided
      setShowComparison(propShowComparison);
    } else if (personName && personCondition) {
      // Auto-enable for famous people when no explicit prop
      setShowComparison(true);
    }
  }, [personName, personCondition, propShowComparison]);

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

    setIsLoading(true);
    setError(null);

    // Set up Three.js scene using utility
    const sceneManager = createSceneManager(containerRef.current);
    const { scene, camera, renderer, dispose } = sceneManager;

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
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
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
      // Monitor performance and throttle if needed
      optimizer.current.monitorPerformance();
      
      if (texture) {
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.tDiffuse.value = texture;
        
        // Only update shader uniforms if effects have changed
        const { changed } = effectProcessor.current.updateEffects(effects);
        if (changed) {
          updateShaderUniforms(material, effects, diplopiaSeparation, diplopiaDirection);
        }
      }
      
      renderer.render(scene, camera);
      
      // Use optimal frame rate based on condition count
      const frameRate = optimizer.current.getOptimalFrameRate(enabledEffectsCount);
      if (frameRate < 60) {
        setTimeout(() => requestAnimationFrame(animate), 1000 / frameRate - 16.67);
      } else {
        requestAnimationFrame(animate);
      }
    };
    animate();

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
  }, [inputSource, retryCount, diplopiaDirection, diplopiaSeparation, effects, texture]); // Recreate scene when input source changes or retry is triggered

  // Update shader uniforms when effects change (separate from scene creation)
  useEffect(() => {
    // Shader uniforms are updated in the animation loop, no need for separate effect
    // This prevents unnecessary re-renders and potential recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, diplopiaSeparation, diplopiaDirection, texture]);

  // Optimized effect state changes handling
  useEffect(() => {
    // Only process if effects have actually changed
    const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);
    
    if (!changed) return;
    
    // Create visual field overlays for YouTube and image content
    if (inputSource.type === 'youtube' || inputSource.type === 'image') {
      // For YouTube and image content, only create overlays for non-diplopia effects
      const nonDiplopiaEffects = enabledEffects.filter(e => 
        e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
      );
      
      if (nonDiplopiaEffects.length > 0 && containerRef.current) {
        // Use optimized overlay manager
        overlayManager.current.updateOverlays(nonDiplopiaEffects, containerRef.current);
      }
    }
    
    // Check if we need animation (for overlay-based effects)
    const needsAnimation = enabledEffects.some(e => 
      e.id === 'visualFloaters' || e.id === 'scotoma'
    );
    
    if (needsAnimation && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      // Animation is now handled by the unified animation manager
      // No need for separate animation loop here
    }
  }, [effects, inputSource.type]);

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
      
      // Only generate filters if there are effects to process
      if (nonDiplopiaEffects.length > 0) {
        const filters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
        return filters ? { ...baseStyle, filter: filters } : baseStyle;
      }
    }

    return baseStyle;
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection]);

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
      src: YOUTUBE_EMBED_URL,
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
  }, [inputSource.type, diplopiaSeparation, diplopiaDirection]);

  const getVisualizerDescription = () => generateEffectsDescription(effects, inputSource);

  // Render comparison view for famous people or general vision simulation
  if (showComparison && personName && personCondition) {
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
            {personName} - {personCondition}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Side-by-side comparison: Original video (left) vs. Vision simulation (right)
          </Typography>
        </Box>

        {/* Left side - Original video */}
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
          <div style={getEffectStyles()}>
            {inputSource.type === 'youtube' ? (
              <iframe
                {...YOUTUBE_IFRAME_PROPS}
                src={YOUTUBE_EMBED_URL}
                title="Vision simulation"
                style={{ width: '100%', height: '100%' }}
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
                <Typography>Visualization would appear here</Typography>
              </Box>
            )}
          </div>
          {getDiplopiaOverlay()}
        </Box>

        {/* Right side - Visualization */}
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