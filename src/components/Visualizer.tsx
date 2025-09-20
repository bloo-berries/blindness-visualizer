import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../types/visualEffects';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { generateEffectsDescription } from '../utils/effectsDescription';
import { createSceneManager } from '../utils/threeSceneManager';
import { updateAnimatedOverlays } from '../utils/animatedOverlays';
import { createVisualizationMesh, updateShaderUniforms } from '../utils/shaderManager';
import { createVisualFieldOverlays } from '../utils/overlayManager';
import { generateCSSFilters } from '../utils/cssFilterManager';

interface VisualizerProps {
  effects: VisualEffect[];
  inputSource: InputSource;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
}

const DEMO_VIDEO_ID = 'KOc146R8sws';

const Visualizer: React.FC<VisualizerProps> = ({ effects, inputSource, diplopiaSeparation = 1.0, diplopiaDirection = 0.0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to avoid repeated effects.find() calls
  const getEffect = useCallback((id: string) => effects.find(e => e.id === id), [effects]);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError(null);

    // Set up Three.js scene using utility
    const sceneManager = createSceneManager(containerRef.current);
    const { scene, camera, renderer, dispose } = sceneManager;

    // Setup animation frame for dynamic effects
    let animationFrameId: number;
    
    // Function to update animated overlays using utility
    const updateOverlays = () => {
      // Cache effect lookups to avoid repeated finds
      const effectMap = new Map(effects.map(e => [e.id, e]));
      const scotoma = effectMap.get('scotoma');
      const visualFloaters = effectMap.get('visualFloaters');
      const visualSnow = effectMap.get('visualSnow');
      
      if (scotoma?.enabled) {
        const now = Date.now();
        const overlayElement = document.getElementById('visual-field-overlay-scotoma');
        if (overlayElement) {
          overlayElement.style.background = `
            radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
              rgba(0,0,0,${0.95 * scotoma.intensity}) 0%, 
              rgba(0,0,0,${0.85 * scotoma.intensity}) ${Math.max(5, 10 - scotoma.intensity * 5)}%,
              rgba(0,0,0,${0.5 * scotoma.intensity}) ${Math.max(10, 20 - scotoma.intensity * 10)}%,
              rgba(0,0,0,0) ${Math.max(20, 35 - scotoma.intensity * 15)}%
            )
          `;
        }
      }
      
      if (visualFloaters?.enabled) {
        const now = Date.now();
        const overlayElement = document.getElementById('visual-field-overlay-visualFloaters');
        
        if (overlayElement) {
          // Floater 1 - larger, stringy floater
          const floaterX1 = 30 + Math.sin(now/2000 * 0.3) * 25 + Math.sin(now/2000 * 0.2) * 10;
          const floaterY1 = 40 + Math.cos(now/2000 * 0.25) * 20;
          // Floater 2 - medium, circular floater
          const floaterX2 = 65 + Math.sin(now/2000 * 0.2 + 1) * 20;
          const floaterY2 = 50 + Math.cos(now/2000 * 0.3 + 2) * 25;
          // Floater 3 - small, quick-moving floater
          const floaterX3 = 50 + Math.sin(now/2000 * 0.4 + 3) * 30;
          const floaterY3 = 25 + Math.cos(now/2000 * 0.35 + 1) * 15;
          // Floater 4 - thin, string-like floater
          const floaterX4 = 45 + Math.sin(now/2000 * 0.15 + 2) * 15;
          const floaterY4 = 70 + Math.cos(now/2000 * 0.2 + 3) * 10;
          
          overlayElement.style.background = `
            /* String-like floater */
            radial-gradient(ellipse 25% 8% at ${floaterX1}% ${floaterY1}%, 
              rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
              rgba(0,0,0,${0.85 * visualFloaters.intensity}) 15%,
              rgba(0,0,0,${0.7 * visualFloaters.intensity}) 40%,
              rgba(0,0,0,0) 80%
            ),
            /* Round floater */
            radial-gradient(circle 8% at ${floaterX2}% ${floaterY2}%, 
              rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
              rgba(0,0,0,${0.85 * visualFloaters.intensity}) 40%,
              rgba(0,0,0,${0.6 * visualFloaters.intensity}) 70%,
              rgba(0,0,0,0) 100%
            ),
            /* Small dot floater */
            radial-gradient(circle 4% at ${floaterX3}% ${floaterY3}%, 
              rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
              rgba(0,0,0,${0.9 * visualFloaters.intensity}) 40%,
              rgba(0,0,0,${0.7 * visualFloaters.intensity}) 70%,
              rgba(0,0,0,0) 100%
            ),
            /* Thin stringy floater */
            radial-gradient(ellipse 20% 3% at ${floaterX4}% ${floaterY4}%, 
              rgba(0,0,0,${0.9 * visualFloaters.intensity}) 0%, 
              rgba(0,0,0,${0.8 * visualFloaters.intensity}) 40%,
              rgba(0,0,0,${0.6 * visualFloaters.intensity}) 70%,
              rgba(0,0,0,0) 100%
            )
          `;
          
          // Ensure the overlay is visible and properly styled
          overlayElement.style.mixBlendMode = 'multiply';
          overlayElement.style.opacity = Math.min(0.98, visualFloaters.intensity).toString();
          overlayElement.style.zIndex = '10';
          overlayElement.style.pointerEvents = 'none';
        } else {
          // If the overlay doesn't exist, try to create it
          const iframeContainer = document.querySelector('.visualizer-container');
          if (iframeContainer) {
            const newOverlay = document.createElement('div');
            newOverlay.id = 'visual-field-overlay-visualFloaters';
            newOverlay.style.position = 'absolute';
            newOverlay.style.top = '0';
            newOverlay.style.left = '0';
            newOverlay.style.right = '0';
            newOverlay.style.bottom = '0';
            newOverlay.style.pointerEvents = 'none';
            newOverlay.style.zIndex = '10';
            newOverlay.style.mixBlendMode = 'multiply';
            newOverlay.style.opacity = Math.min(0.98, visualFloaters.intensity).toString();
            iframeContainer.appendChild(newOverlay);
          }
        }
      }
      
      // Visual Snow is now handled by ControlPanel.tsx overlay generation
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateOverlays);
    };
    
    // Start animation if needed
    const needsAnimation = effects.some(e => 
      (e.id === 'scotoma' || e.id === 'visualFloaters' || e.id === 'retinitisPigmentosa') && e.enabled
    );
    
    if (needsAnimation) {
      animationFrameId = requestAnimationFrame(updateOverlays);
    }

    // Handle different input sources
    const setupMedia = async () => {
      try {
        if (inputSource.type === 'webcam') {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = mediaRef.current as HTMLVideoElement;
          video.srcObject = stream;
          await video.play();
          const videoTexture = new THREE.VideoTexture(video);
          setTexture(videoTexture);
        } else if (inputSource.type === 'image' && inputSource.url) {
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
          setTexture(imageTexture);
        } else if (inputSource.type === 'youtube') {
          // For YouTube, we'll use CSS filters instead of WebGL textures
          setTexture(null);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media');
        setIsLoading(false);
      }
    };

    setupMedia();

    // Create mesh for non-YouTube content using utility
    const mesh = createVisualizationMesh();
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (texture) {
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.tDiffuse.value = texture;
        updateShaderUniforms(material, effects, diplopiaSeparation, diplopiaDirection);
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (inputSource.type === 'webcam') {
        const currentMediaRef = mediaRef.current;
        if (currentMediaRef) {
          const video = currentMediaRef as HTMLVideoElement;
          const stream = video.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      }
      
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Use the dispose function from scene manager
      dispose();
    };
  }, [inputSource]); // Only recreate scene when input source changes

  // Update shader uniforms when effects change (separate from scene creation)
  useEffect(() => {
    // Shader uniforms are updated in the animation loop, no need for separate effect
    // This prevents unnecessary re-renders and potential recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, diplopiaSeparation, diplopiaDirection, texture]);

  // Get effect state changes to rerender
  useEffect(() => {
    // Create visual field overlays for YouTube content whenever effects change
    if (inputSource.type === 'youtube') {
      // For YouTube content, only create overlays for non-diplopia effects
      // Diplopia effects are handled by the getDiplopiaOverlay function
      const nonDiplopiaEffects = effects.filter(e => e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular');
      
      if (nonDiplopiaEffects.some(e => e.enabled)) {
        console.log('Creating visual field overlays for YouTube content with non-diplopia effects:', nonDiplopiaEffects);
        
        // Add a small delay to ensure the iframe is loaded
        const timer = setTimeout(() => {
          createVisualFieldOverlays(nonDiplopiaEffects);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
    
    // Check if we need animation
    const visualFloaters = getEffect('visualFloaters');
    const scotoma = getEffect('scotoma');
    
    const needsAnimation = 
      (visualFloaters && visualFloaters.enabled) || 
      (scotoma && scotoma.enabled);
    
    if (needsAnimation) {
      // Start animation if not already running
      let animationFrameId: number;
      
      const updateAnimatedEffects = () => {
        updateAnimatedOverlays(effects);
        animationFrameId = requestAnimationFrame(updateAnimatedEffects);
      };
      
      animationFrameId = requestAnimationFrame(updateAnimatedEffects);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [effects, inputSource.type, getEffect]);

  // Calculate CSS filters based on effects
  const getEffectStyles = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain'
    };

    if (inputSource.type === 'youtube') {
      const nonDiplopiaEffects = effects.filter(e => e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular');
      const filters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
      return filters ? { ...baseStyle, filter: filters } : baseStyle;
    }

    return baseStyle;
  };

  // Create diplopia overlay for YouTube content
  const getDiplopiaOverlay = () => {
    if (inputSource.type !== 'youtube') return null;

    const diplopiaMonocular = getEffect('diplopiaMonocular');
    const diplopiaBinocular = getEffect('diplopiaBinocular');
    const diplopia = diplopiaMonocular?.enabled ? diplopiaMonocular : diplopiaBinocular;
    
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
      width: "100%",
      height: "100%",
      src: `https://www.youtube.com/embed/${DEMO_VIDEO_ID}?si=0pCMD96TZDgBDRCM&autoplay=1&controls=0&enablejsapi=1`,
      title: `YouTube video player (${diplopiaMonocular?.enabled ? 'ghost' : 'second image'}) - ${Math.random().toString(36).substr(2, 9)}`,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      style: { width: "100%", height: "100%", border: "none", pointerEvents: "none" },
      frameBorder: "0"
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
        <iframe {...iframeProps} />
      </div>
    );
  };

  const getVisualizerDescription = () => generateEffectsDescription(effects, inputSource);

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
          <div style={getEffectStyles()}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?si=0pCMD96TZDgBDRCM&autoplay=1&controls=0&enablejsapi=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              frameBorder="0"
            />
          </div>
          {getDiplopiaOverlay()}
        </Box>
      )}
      
      {/* Text description for screen readers */}
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
        <Typography variant="h6">
          Visualization Description
        </Typography>
        <Typography>
          {getVisualizerDescription()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Visualizer; 