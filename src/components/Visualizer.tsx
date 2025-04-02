import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../App';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface VisualizerProps {
  effects: VisualEffect[];
  inputSource: InputSource;
}

const DEMO_VIDEO_ID = 'KOc146R8sws';

const Visualizer: React.FC<VisualizerProps> = ({ effects, inputSource }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError(null);

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Setup animation frame for dynamic effects
    let animationFrameId: number;
    
    // Function to update animated overlays
    const updateAnimatedOverlays = () => {
      const scotoma = effects.find(e => e.id === 'scotoma');
      const visualFloaters = effects.find(e => e.id === 'visualFloaters');
      
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
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateAnimatedOverlays);
    };
    
    // Start animation if needed
    const needsAnimation = effects.some(e => 
      (e.id === 'scotoma' || e.id === 'visualFloaters') && e.enabled
    );
    
    if (needsAnimation) {
      animationFrameId = requestAnimationFrame(updateAnimatedOverlays);
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

    // Create geometry and material for non-YouTube content
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        protanopiaIntensity: { value: 0.0 },
        deuteranopiaIntensity: { value: 0.0 },
        tritanopiaIntensity: { value: 0.0 },
        protanomalyIntensity: { value: 0.0 },
        deuteranomalyIntensity: { value: 0.0 },
        tritanomalyIntensity: { value: 0.0 },
        blurIntensity: { value: 0.0 },
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
        uniform float protanopiaIntensity;
        uniform float deuteranopiaIntensity;
        uniform float tritanopiaIntensity;
        uniform float protanomalyIntensity;
        uniform float deuteranomalyIntensity;
        uniform float tritanomalyIntensity;
        uniform float blurIntensity;
        varying vec2 vUv;

        vec3 applyProtanopia(vec3 color) {
          return vec3(
            0.567 * color.r + 0.433 * color.g + 0.000 * color.b,
            0.558 * color.r + 0.442 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.242 * color.g + 0.758 * color.b
          );
        }

        vec3 applyDeuteranopia(vec3 color) {
          return vec3(
            0.625 * color.r + 0.375 * color.g + 0.000 * color.b,
            0.700 * color.r + 0.300 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.300 * color.g + 0.700 * color.b
          );
        }

        vec3 applyTritanopia(vec3 color) {
          return vec3(
            0.950 * color.r + 0.050 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.433 * color.g + 0.567 * color.b,
            0.000 * color.r + 0.475 * color.g + 0.525 * color.b
          );
        }

        vec3 applyProtanomaly(vec3 color) {
          return vec3(
            0.817 * color.r + 0.183 * color.g + 0.000 * color.b,
            0.333 * color.r + 0.667 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.125 * color.g + 0.875 * color.b
          );
        }

        vec3 applyDeuteranomaly(vec3 color) {
          return vec3(
            0.800 * color.r + 0.200 * color.g + 0.000 * color.b,
            0.258 * color.r + 0.742 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.142 * color.g + 0.858 * color.b
          );
        }

        vec3 applyTritanomaly(vec3 color) {
          return vec3(
            0.967 * color.r + 0.033 * color.g + 0.000 * color.b,
            0.000 * color.r + 0.733 * color.g + 0.267 * color.b,
            0.000 * color.r + 0.183 * color.g + 0.817 * color.b
          );
        }

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 color = texel.rgb;
          
          // Apply color blindness effects
          if (protanopiaIntensity > 0.0) {
            color = mix(color, applyProtanopia(color), protanopiaIntensity);
          }
          if (deuteranopiaIntensity > 0.0) {
            color = mix(color, applyDeuteranopia(color), deuteranopiaIntensity);
          }
          if (tritanopiaIntensity > 0.0) {
            color = mix(color, applyTritanopia(color), tritanopiaIntensity);
          }
          if (protanomalyIntensity > 0.0) {
            color = mix(color, applyProtanomaly(color), protanomalyIntensity);
          }
          if (deuteranomalyIntensity > 0.0) {
            color = mix(color, applyDeuteranomaly(color), deuteranomalyIntensity);
          }
          if (tritanomalyIntensity > 0.0) {
            color = mix(color, applyTritanomaly(color), tritanomalyIntensity);
          }

          // Apply blur effect
          if (blurIntensity > 0.0) {
            vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
            vec4 blur = vec4(0.0);
            float total = 0.0;
            
            for(float x = -4.0; x <= 4.0; x++) {
              for(float y = -4.0; y <= 4.0; y++) {
                float weight = 1.0 / (1.0 + x * x + y * y);
                blur += texture2D(tDiffuse, vUv + vec2(x, y) * pixelSize * blurIntensity) * weight;
                total += weight;
              }
            }
            
            color = mix(color, blur.rgb, blurIntensity);
          }
          
          gl_FragColor = vec4(color, texel.a);
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
        
        // Update effect uniforms based on current state
        const protanopia = effects.find(e => e.id === 'protanopia');
        if (protanopia) {
          material.uniforms.protanopiaIntensity.value = protanopia.enabled ? protanopia.intensity : 0;
        }

        const deuteranopia = effects.find(e => e.id === 'deuteranopia');
        if (deuteranopia) {
          material.uniforms.deuteranopiaIntensity.value = deuteranopia.enabled ? deuteranopia.intensity : 0;
        }

        const tritanopia = effects.find(e => e.id === 'tritanopia');
        if (tritanopia) {
          material.uniforms.tritanopiaIntensity.value = tritanopia.enabled ? tritanopia.intensity : 0;
        }

        const protanomaly = effects.find(e => e.id === 'protanomaly');
        if (protanomaly) {
          material.uniforms.protanomalyIntensity.value = protanomaly.enabled ? protanomaly.intensity : 0;
        }

        const deuteranomaly = effects.find(e => e.id === 'deuteranomaly');
        if (deuteranomaly) {
          material.uniforms.deuteranomalyIntensity.value = deuteranomaly.enabled ? deuteranomaly.intensity : 0;
        }

        const tritanomaly = effects.find(e => e.id === 'tritanomaly');
        if (tritanomaly) {
          material.uniforms.tritanomalyIntensity.value = tritanomaly.enabled ? tritanomaly.intensity : 0;
        }

        const nearSighted = effects.find(e => e.id === 'nearSighted');
        if (nearSighted) {
          material.uniforms.blurIntensity.value = nearSighted.enabled ? nearSighted.intensity : 0;
        }
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
  }, [inputSource, effects]);

  // Get effect state changes to rerender
  useEffect(() => {
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
        // Update Visual Floaters
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
            overlayElement.style.opacity = Math.min(0.98, visualFloaters.intensity).toString();
          }
        }
        
        // Update Scotoma
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
        
        animationFrameId = requestAnimationFrame(updateAnimatedEffects);
      };
      
      animationFrameId = requestAnimationFrame(updateAnimatedEffects);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [effects]);

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
      const protanopia = effects.find(e => e.id === 'protanopia');
      const deuteranopia = effects.find(e => e.id === 'deuteranopia');
      const tritanopia = effects.find(e => e.id === 'tritanopia');
      const protanomaly = effects.find(e => e.id === 'protanomaly');
      const deuteranomaly = effects.find(e => e.id === 'deuteranomaly');
      const tritanomaly = effects.find(e => e.id === 'tritanomaly');
      const nearSighted = effects.find(e => e.id === 'nearSighted');
      
      let filters = [];
      
      if (protanopia?.enabled) {
        filters.push(`grayscale(${protanopia.intensity * 0.5})`);
        filters.push(`sepia(${protanopia.intensity * 0.5})`);
      }
      
      if (deuteranopia?.enabled) {
        filters.push(`grayscale(${deuteranopia.intensity * 0.5})`);
        filters.push(`sepia(${deuteranopia.intensity * 0.5})`);
      }
      
      if (tritanopia?.enabled) {
        filters.push(`grayscale(${tritanopia.intensity * 0.5})`);
        filters.push(`sepia(${tritanopia.intensity * 0.5})`);
      }
      
      if (protanomaly?.enabled) {
        filters.push(`grayscale(${protanomaly.intensity * 0.5})`);
        filters.push(`sepia(${protanomaly.intensity * 0.5})`);
      }
      
      if (deuteranomaly?.enabled) {
        filters.push(`grayscale(${deuteranomaly.intensity * 0.5})`);
        filters.push(`sepia(${deuteranomaly.intensity * 0.5})`);
      }
      
      if (tritanomaly?.enabled) {
        filters.push(`grayscale(${tritanomaly.intensity * 0.5})`);
        filters.push(`sepia(${tritanomaly.intensity * 0.5})`);
      }
      
      if (nearSighted?.enabled) {
        filters.push(`blur(${nearSighted.intensity * 10}px)`);
      }
      
      if (filters.length > 0) {
        style.filter = filters.join(' ');
      }
      
      // Add visual field effects with overlays
      const quadrantanopia = effects.find(e => e.id === 'quadrantanopia');
      const hemianopiaLeft = effects.find(e => e.id === 'hemianopiaLeft');
      const hemianopiaRight = effects.find(e => e.id === 'hemianopiaRight');
      const scotoma = effects.find(e => e.id === 'scotoma');
      const visualAura = effects.find(e => e.id === 'visualAura');
      const visualAuraLeft = effects.find(e => e.id === 'visualAuraLeft');
      const visualAuraRight = effects.find(e => e.id === 'visualAuraRight');
      const visualFloaters = effects.find(e => e.id === 'visualFloaters');
      
      // Get the iframe container for adding overlays
      const iframeContainer = document.querySelector('.visualizer-container');
      
      // Remove all existing overlays first
      const existingOverlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
      existingOverlays.forEach(overlay => overlay.remove());
      
      // Helper function to create and add overlay
      const createOverlay = (id: string, backgroundStyle: string, blendMode: string, opacity: string) => {
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10';
        overlay.style.background = backgroundStyle;
        overlay.style.mixBlendMode = blendMode;
        overlay.style.opacity = opacity;
        
        if (iframeContainer) {
          iframeContainer.appendChild(overlay);
        }
      };
      
      // Create overlays for each enabled effect
      if (quadrantanopia?.enabled) {
        createOverlay(
          'visual-field-overlay-quadrantanopia',
          `radial-gradient(circle at 0% 100%, 
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) ${Math.max(25, 40 - quadrantanopia.intensity * 20)}%,
            rgba(0,0,0,${0.95 * quadrantanopia.intensity}) ${Math.max(45, 60 - quadrantanopia.intensity * 20)}%,
            rgba(0,0,0,${0.95 * quadrantanopia.intensity}) 100%
          )`,
          'multiply',
          Math.min(0.95, quadrantanopia.intensity).toString()
        );
      }
      
      if (hemianopiaLeft?.enabled) {
        createOverlay(
          'visual-field-overlay-hemianopiaLeft',
          `linear-gradient(to right, 
            rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 0%, 
            rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 45%, 
            rgba(0,0,0,0) 50%
          )`,
          'multiply',
          Math.min(0.95, hemianopiaLeft.intensity).toString()
        );
      }
      
      if (hemianopiaRight?.enabled) {
        createOverlay(
          'visual-field-overlay-hemianopiaRight',
          `linear-gradient(to left, 
            rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 0%, 
            rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 45%, 
            rgba(0,0,0,0) 50%
          )`,
          'multiply',
          Math.min(0.95, hemianopiaRight.intensity).toString()
        );
      }
      
      if (scotoma?.enabled) {
        const now = Date.now();
        createOverlay(
          'visual-field-overlay-scotoma',
          `radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
            rgba(0,0,0,${0.95 * scotoma.intensity}) 0%, 
            rgba(0,0,0,${0.85 * scotoma.intensity}) ${Math.max(5, 10 - scotoma.intensity * 5)}%,
            rgba(0,0,0,${0.5 * scotoma.intensity}) ${Math.max(10, 20 - scotoma.intensity * 10)}%,
            rgba(0,0,0,0) ${Math.max(20, 35 - scotoma.intensity * 15)}%
          )`,
          'multiply',
          Math.min(0.95, scotoma.intensity).toString()
        );
      }
      
      if (visualFloaters?.enabled) {
        const now = Date.now();
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
        
        // Create a separate overlay element specifically for visual floaters
        const overlay = document.createElement('div');
        overlay.id = 'visual-field-overlay-visualFloaters';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10';
        
        // Set specific styles for visual floaters
        overlay.style.background = `
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
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.98, visualFloaters.intensity).toString();
        
        // Add overlay to the iframe container
        if (iframeContainer) {
          iframeContainer.appendChild(overlay);
        }
      }
      
      // Handle additional visual effects here for visualAura, visualAuraLeft, visualAuraRight
    }

    return style;
  };

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
    <Box className="visualizer-container" sx={{ position: 'relative', width: '100%', height: '600px' }}>
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