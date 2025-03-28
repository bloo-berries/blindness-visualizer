import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../App';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface VisualizerProps {
  effects: VisualEffect[];
  inputSource: InputSource;
}

const Visualizer: React.FC<VisualizerProps> = ({ effects, inputSource }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Handle different input sources
    const setupMedia = async () => {
      if (inputSource.type === 'webcam') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = mediaRef.current as HTMLVideoElement;
        video.srcObject = stream;
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        setTexture(videoTexture);
      } else if (inputSource.type === 'image' && inputSource.url) {
        const textureLoader = new THREE.TextureLoader();
        const imageTexture = await textureLoader.loadAsync(inputSource.url);
        setTexture(imageTexture);
      } else if (inputSource.type === 'youtube' && inputSource.url) {
        // Here you would need to implement YouTube video loading
        // You might want to use a library like react-youtube
        const video = mediaRef.current as HTMLVideoElement;
        // Implementation for YouTube video loading...
        const videoTexture = new THREE.VideoTexture(video);
        setTexture(videoTexture);
      }
    };

    setupMedia();

    // Create geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        colorBlindnessIntensity: { value: 0.0 },
        blurIntensity: { value: 0.0 },
        // ... other uniforms
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float colorBlindnessIntensity;
        uniform float blurIntensity;
        varying vec2 vUv;

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          
          // Apply effects based on uniforms
          // Implementation of visual effects...
          
          gl_FragColor = texel;
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (texture) {
        material.uniforms.tDiffuse.value = texture;
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
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [inputSource]);

  // Update shader uniforms when effects change
  useEffect(() => {
    // Update uniforms based on enabled effects and their intensities
  }, [effects]);

  // Helper function to generate a description of active effects
  const getVisualizerDescription = () => {
    const activeEffects = effects.filter(e => e.enabled);
    
    if (activeEffects.length === 0) {
      return `Visualization of ${inputSource.type} with no vision conditions applied.`;
    }
    
    const effectsDescription = activeEffects
      .map(e => `${e.name} at ${Math.round(e.intensity * 100)}% intensity`)
      .join(', ');
    
    return `Visualization of ${inputSource.type} with the following conditions applied: ${effectsDescription}.`;
  };

  return (
    <Box className="visualizer-container">
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
      >
        {inputSource.type === 'webcam' || inputSource.type === 'youtube' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            style={{ display: 'none' }}
          />
        ) : (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            style={{ display: 'none' }}
            src={inputSource.url}
            alt="Uploaded content for visualization"
          />
        )}
      </div>
      
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