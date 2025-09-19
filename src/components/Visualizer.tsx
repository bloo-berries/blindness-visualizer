import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../types/visualEffects';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { generateEffectsDescription } from '../utils/effectsDescription';
import { createSceneManager, handleResize, createTextureFromMedia } from '../utils/threeSceneManager';
import { updateAnimatedOverlays } from '../utils/animatedOverlays';
import { createVisualizationMesh, updateShaderUniforms } from '../utils/shaderManager';
import { createVisualFieldOverlays, removeVisualFieldOverlays } from '../utils/overlayManager';
import { generateCSSFilters, generateBaseStyles } from '../utils/cssFilterManager';

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
      const scotoma = effects.find(e => e.id === 'scotoma');
      const visualFloaters = effects.find(e => e.id === 'visualFloaters');
      const visualSnow = effects.find(e => e.id === 'visualSnow');
      
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
      
      if (visualSnow?.enabled) {
        const now = Date.now();
        const snowIntensity = Math.min(visualSnow.intensity * 0.8, 0.6);
        const snowPhase = now * 0.001;
        
        const overlayElement = document.getElementById('visual-field-overlay-visualSnow');
        if (overlayElement) {
          // Generate multiple layers of noise with different patterns
          const noiseLayer1 = `
            radial-gradient(circle 0.5px at ${20 + Math.sin(snowPhase * 0.1) * 5}% ${30 + Math.cos(snowPhase * 0.1) * 5}%, 
              rgba(255,255,255,${snowIntensity * 0.3}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.3px at ${80 + Math.sin(snowPhase * 0.15) * 3}% ${40 + Math.cos(snowPhase * 0.15) * 3}%, 
              rgba(255,255,255,${snowIntensity * 0.4}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.4px at ${50 + Math.sin(snowPhase * 0.2) * 4}% ${70 + Math.cos(snowPhase * 0.2) * 4}%, 
              rgba(255,255,255,${snowIntensity * 0.35}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.2px at ${10 + Math.sin(snowPhase * 0.25) * 2}% ${60 + Math.cos(snowPhase * 0.25) * 2}%, 
              rgba(255,255,255,${snowIntensity * 0.5}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.6px at ${90 + Math.sin(snowPhase * 0.3) * 6}% ${20 + Math.cos(snowPhase * 0.3) * 6}%, 
              rgba(255,255,255,${snowIntensity * 0.25}) 0%, 
              rgba(255,255,255,0) 100%
            )
          `;
          
          const noiseLayer2 = `
            radial-gradient(circle 0.4px at ${35 + Math.sin(snowPhase * 0.12) * 4}% ${80 + Math.cos(snowPhase * 0.12) * 4}%, 
              rgba(255,255,255,${snowIntensity * 0.4}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.3px at ${75 + Math.sin(snowPhase * 0.18) * 3}% ${15 + Math.cos(snowPhase * 0.18) * 3}%, 
              rgba(255,255,255,${snowIntensity * 0.45}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.5px at ${25 + Math.sin(snowPhase * 0.22) * 5}% ${45 + Math.cos(snowPhase * 0.22) * 5}%, 
              rgba(255,255,255,${snowIntensity * 0.3}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.2px at ${85 + Math.sin(snowPhase * 0.28) * 2}% ${55 + Math.cos(snowPhase * 0.28) * 2}%, 
              rgba(255,255,255,${snowIntensity * 0.5}) 0%, 
              rgba(255,255,255,0) 100%
            )
          `;
          
          const noiseLayer3 = `
            radial-gradient(circle 0.3px at ${60 + Math.sin(snowPhase * 0.14) * 3}% ${25 + Math.cos(snowPhase * 0.14) * 3}%, 
              rgba(255,255,255,${snowIntensity * 0.35}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.4px at ${15 + Math.sin(snowPhase * 0.16) * 4}% ${75 + Math.cos(snowPhase * 0.16) * 4}%, 
              rgba(255,255,255,${snowIntensity * 0.4}) 0%, 
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(circle 0.2px at ${95 + Math.sin(snowPhase * 0.24) * 2}% ${35 + Math.cos(snowPhase * 0.24) * 2}%, 
              rgba(255,255,255,${snowIntensity * 0.5}) 0%, 
              rgba(255,255,255,0) 100%
            )
          `;
          
          overlayElement.style.background = `${noiseLayer1}, ${noiseLayer2}, ${noiseLayer3}`;
          overlayElement.style.opacity = snowIntensity.toString();
        }
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateOverlays);
    };
    
    // Start animation if needed
    const needsAnimation = effects.some(e => 
      (e.id === 'scotoma' || e.id === 'visualFloaters' || e.id === 'visualSnow' || e.id === 'retinitisPigmentosa') && e.enabled
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
        const video = mediaRef.current as HTMLVideoElement;
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [inputSource, effects, diplopiaSeparation, diplopiaDirection]);

  // Get effect state changes to rerender
  useEffect(() => {
    // Create visual field overlays for YouTube content whenever effects change
    if (inputSource.type === 'youtube') {
      console.log('Creating visual field overlays for YouTube content with effects:', effects);
      
      // Add a small delay to ensure the iframe is loaded
      const timer = setTimeout(() => {
        createVisualFieldOverlays(effects);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Check if we need animation
    const visualFloaters = effects.find(e => e.id === 'visualFloaters');
    const scotoma = effects.find(e => e.id === 'scotoma');
    
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
  }, [effects, inputSource.type]);

  // Calculate CSS filters based on effects
  const getEffectStyles = () => {
    const style: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '100%',
      maxHeight: '100%',
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    };

    if (inputSource.type === 'youtube') {
      const filters = generateCSSFilters(effects);
      if (filters) {
        style.filter = filters;
      }
    }

    return style;
  };

  // Helper function to generate a description of active effects
  const getVisualizerDescription = () => {
    return generateEffectsDescription(effects, inputSource);
  };

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
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?si=0pCMD96TZDgBDRCM&autoplay=1&controls=0&enablejsapi=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            style={getEffectStyles()}
            frameBorder="0"
          />
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