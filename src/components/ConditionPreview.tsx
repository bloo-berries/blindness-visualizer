import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Paper, SxProps, Theme } from '@mui/material';
import ColorPreview from './ColorPreview';

// Define and export the condition type
export type ConditionType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 
      'monochromacy' | 'monochromatic' | 'cataracts' | 'glaucoma' | 'amd' | 'diabeticRetinopathy' | 
      'astigmatism' | 'retinitisPigmentosa' | 'stargardt' | 'hemianopiaLeft' | 'hemianopiaRight' | 
      'quadrantanopia' | 'scotoma' | 'visualAura' | 'visualAuraLeft' | 'visualAuraRight' | 'visualSnow' | 'visualFloaters' | 'hallucinations' |
      'nearSighted' | 'farSighted' | 'diplopiaMonocular' | 'diplopiaBinocular';

interface ConditionPreviewProps {
  type: ConditionType;
  intensity: number;
}

// Using a local image to avoid CORS issues
const REFERENCE_IMAGE = '/garden-fallback.jpg'; // Swapped to use the former fallback as primary

// Update visual aura overlay with a more accurate representation
const VISUAL_AURA_OVERLAY = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Migraine-aura-aka-scintillating-scotoma-anecdoteal-depiction.png';
// We'll create CSS-based overlays for left and right auras instead of using external GIFs
// New specific overlays for left and right auras
const VISUAL_AURA_LEFT_OVERLAY = '/aura-left.gif'; // This path will be created later
const VISUAL_AURA_RIGHT_OVERLAY = '/aura-right.gif'; // This path will be created later

// Canvas size for visual snow animation
const SNOW_CANVAS_SIZE = 256;

// Helper function to check if condition should show color preview
const shouldShowColorPreview = (type: string): boolean => {
  return ![
    'amd',
    'retinitisPigmentosa',
    'glaucoma',
    'stargardt',
    'visualAura',
    'visualSnow',
    'astigmatism',
    'hemianopiaLeft',
    'hemianopiaRight',
    'quadrantanopia',
    'visualFloaters',
    'hallucinations',
    'scotoma',
    'nearSighted',
    'farSighted'
  ].includes(type);
};

// Helper function to check if condition requires canvas-based color transformation
const isColorTransformCondition = (type: string): boolean => {
  return [
    'protanomaly',
    'protanopia',
    'deuteranomaly',
    'deuteranopia',
    'tritanomaly',
    'tritanopia',
    'monochromatic',
    'monochromacy'
  ].includes(type);
};

// Color matrices for accurate color blindness simulation
// These are based on established color science algorithms
const ColorMatrices = {
  // Protanopia (red-blind) color matrix
  protanopia: [
    0.567, 0.433, 0, 0, 0,
    0.558, 0.442, 0, 0, 0,
    0, 0.242, 0.758, 0, 0,
    0, 0, 0, 1, 0
  ],
  // Deuteranopia (green-blind) color matrix
  deuteranopia: [
    0.625, 0.375, 0, 0, 0,
    0.7, 0.3, 0, 0, 0,
    0, 0.3, 0.7, 0, 0,
    0, 0, 0, 1, 0
  ],
  // Tritanopia (blue-blind) color matrix
  tritanopia: [
    0.95, 0.05, 0, 0, 0,
    0, 0.433, 0.567, 0, 0,
    0, 0.475, 0.525, 0, 0,
    0, 0, 0, 1, 0
  ]
};

const ConditionPreview: React.FC<ConditionPreviewProps> = ({ type, intensity }) => {
  const [auraPhase, setAuraPhase] = useState(0);
  const [snowPhase, setSnowPhase] = useState(0);
  const [visualSnowDataUrl, setVisualSnowDataUrl] = useState<string | null>(null);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);

  // Indicate that these types need dynamic animation
  const isDynamicCondition = ['scotoma', 'visualAuraLeft', 'visualAuraRight', 'visualAura', 'visualSnow', 'diabeticRetinopathy'].includes(type);

  // Add a visual snow background pattern directly in the component
  const getVisualSnowPattern = (intensity: number) => {
    const dataUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.8'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='22' cy='17' r='0.8'/%3E%3Ccircle cx='34' cy='10' r='0.9'/%3E%3Ccircle cx='48' cy='15' r='0.8'/%3E%3Ccircle cx='68' cy='18' r='0.7'/%3E%3Ccircle cx='86' cy='14' r='0.9'/%3E%3Ccircle cx='15' cy='27' r='0.6'/%3E%3Ccircle cx='28' cy='32' r='0.9'/%3E%3Ccircle cx='40' cy='28' r='0.7'/%3E%3Ccircle cx='55' cy='34' r='0.8'/%3E%3Ccircle cx='75' cy='28' r='0.7'/%3E%3Ccircle cx='88' cy='25' r='0.9'/%3E%3Ccircle cx='10' cy='45' r='1'/%3E%3Ccircle cx='25' cy='48' r='0.8'/%3E%3Ccircle cx='36' cy='42' r='0.9'/%3E%3Ccircle cx='50' cy='48' r='0.8'/%3E%3Ccircle cx='65' cy='42' r='0.7'/%3E%3Ccircle cx='80' cy='45' r='0.9'/%3E%3Ccircle cx='12' cy='65' r='0.7'/%3E%3Ccircle cx='30' cy='65' r='0.9'/%3E%3Ccircle cx='44' cy='60' r='0.7'/%3E%3Ccircle cx='58' cy='68' r='0.8'/%3E%3Ccircle cx='70' cy='62' r='0.7'/%3E%3Ccircle cx='86' cy='65' r='0.9'/%3E%3Ccircle cx='10' cy='80' r='1'/%3E%3Ccircle cx='25' cy='82' r='0.8'/%3E%3Ccircle cx='42' cy='82' r='0.9'/%3E%3Ccircle cx='55' cy='80' r='0.8'/%3E%3Ccircle cx='70' cy='82' r='0.7'/%3E%3Ccircle cx='88' cy='78' r='0.9'/%3E%3C/g%3E%3C/svg%3E")`;
    return dataUrl;
  };

  // Load the source image only once
  useEffect(() => {
    console.log(`Loading image for condition: ${type}`);
    // Create image element for preloading
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS
    img.src = REFERENCE_IMAGE;
    
    // Only set the image reference when it's fully loaded
    img.onload = () => {
      console.log(`Image loaded successfully for ${type}`);
      imageRef.current = img;
      setImageLoaded(true);
      setDebugMessage(`Image loaded: ${REFERENCE_IMAGE}`);
      
      // For non-color transform conditions, we still use the original image
      if (!isColorTransformCondition(type)) {
        setImageSrc(REFERENCE_IMAGE);
      } else {
        // For color transform conditions, apply the transformation once image is loaded
        applyColorTransformation();
      }
    };
    
    img.onerror = (e) => {
      console.error(`Failed to load the original image for ${type}:`, e);
      setDebugMessage(`Error loading image: ${e}`);
      // Try fallback image
      img.src = '/garden-flowers.jpg';
    };
    
    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [type]); // Update when type changes to ensure proper image loading

  // Smooth intensity transitions
  useEffect(() => {
    const transitionDuration = 300; // ms
    const startTime = Date.now();
    const startIntensity = currentIntensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      // Easing function for smooth transition
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCurrentIntensity(startIntensity + (intensity - startIntensity) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [intensity]);

  // Apply color transformation when condition type or intensity changes
  useEffect(() => {
    if (!isColorTransformCondition(type) || !imageLoaded) return;
    applyColorTransformation();
  }, [type, currentIntensity, imageLoaded]);

  // Apply color transformation using canvas and color matrices
  const applyColorTransformation = () => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) {
      return;
    }
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      // Make sure canvas is sized properly
      canvas.width = imageRef.current.width || 800;
      canvas.height = imageRef.current.height || 600;
      
      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      
      // Store original image data on first run
      if (!originalImageDataRef.current) {
        originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } else {
        // Restore original image before applying new effects
        ctx.putImageData(originalImageDataRef.current, 0, 0);
      }
      
      // Get the current image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Get the appropriate matrix for the condition
      let matrix;
      
      if (type === 'protanopia' || type === 'protanomaly') {
        matrix = ColorMatrices.protanopia;
      } else if (type === 'deuteranopia' || type === 'deuteranomaly') {
        matrix = ColorMatrices.deuteranopia;
      } else if (type === 'tritanopia' || type === 'tritanomaly') {
        matrix = ColorMatrices.tritanopia;
      } else if (type === 'monochromatic') {
        // For monochromatic, we'll use a grayscale approach with darkening
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          const adjustedGray = gray * (1 - 0.7 * currentIntensity);
          
          // Only apply the effect based on the intensity
          data[i] = data[i] * (1 - currentIntensity) + adjustedGray * currentIntensity;
          data[i + 1] = data[i + 1] * (1 - currentIntensity) + adjustedGray * currentIntensity;
          data[i + 2] = data[i + 2] * (1 - currentIntensity) + adjustedGray * currentIntensity;
        }
        
        ctx.putImageData(imageData, 0, 0);
        setImageSrc(canvas.toDataURL('image/jpeg'));
        return;
      } else if (type === 'monochromacy') {
        // Complete grayscale with intensity control
        for (let i = 0; i < data.length; i += 4) {
          // Calculate grayscale value using standard luminance formula
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          
          // Linear interpolation between original color and grayscale based on intensity
          data[i] = data[i] * (1 - currentIntensity) + gray * currentIntensity;
          data[i + 1] = data[i + 1] * (1 - currentIntensity) + gray * currentIntensity;
          data[i + 2] = data[i + 2] * (1 - currentIntensity) + gray * currentIntensity;
        }
        
        ctx.putImageData(imageData, 0, 0);
        setImageSrc(canvas.toDataURL('image/jpeg'));
        return;
      }
      
      if (!matrix) return;
      
      // Apply the color matrix transformation based on intensity
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Apply the matrix transformation based on intensity
        const newR = r * (1 - currentIntensity) + 
          (r * matrix[0] + g * matrix[1] + b * matrix[2]) * currentIntensity;
        const newG = g * (1 - currentIntensity) + 
          (r * matrix[5] + g * matrix[6] + b * matrix[7]) * currentIntensity;
        const newB = b * (1 - currentIntensity) + 
          (r * matrix[10] + g * matrix[11] + b * matrix[12]) * currentIntensity;
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }
      
      // Apply additional adjustments for -anomaly (partial) versions
      if (type === 'protanomaly' || type === 'deuteranomaly' || type === 'tritanomaly') {
        // For -anomaly conditions, reduce the effect to simulate partial color blindness
        const anomalyFactor = 0.7;
        for (let i = 0; i < data.length; i += 4) {
          const origR = originalImageDataRef.current.data[i];
          const origG = originalImageDataRef.current.data[i + 1];
          const origB = originalImageDataRef.current.data[i + 2];
          
          data[i] = data[i] * anomalyFactor + origR * (1 - anomalyFactor);
          data[i + 1] = data[i + 1] * anomalyFactor + origG * (1 - anomalyFactor);
          data[i + 2] = data[i + 2] * anomalyFactor + origB * (1 - anomalyFactor);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setImageSrc(canvas.toDataURL('image/jpeg'));
    } catch (err) {
      console.error("Error during color transformation:", err);
      // Fall back to using CSS filters in case of error
      setImageSrc(REFERENCE_IMAGE);
    }
  };

  // Generate visual snow texture
  const generateVisualSnowTexture = useCallback(() => {
    if (!snowCanvasRef.current) return;
    
    const canvas = snowCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, SNOW_CANVAS_SIZE, SNOW_CANVAS_SIZE);
    
    // Create random noise pattern - enhanced for higher intensities
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, SNOW_CANVAS_SIZE, SNOW_CANVAS_SIZE);
    
    // Control density and appearance with intensity
    // Base values that increase with intensity
    const intensityFactor = Math.min(Math.max(currentIntensity, 0), 1);
    const baseDotDensity = 0.3 + (intensityFactor * 0.3); // Higher density at higher intensity
    const dotDensity = baseDotDensity + Math.sin(snowPhase) * 0.05;
    const dotSize = 1.5 + (intensityFactor * 1.5); // Bigger dots at higher intensity
    const dotSpacing = Math.max(1, 3 - intensityFactor * 1.5); // Closer dots at higher intensity
    
    // Add white/light gray dots with intensity-based opacity
    const dotOpacity = 0.8 + (intensityFactor * 0.2); // Higher contrast dots at higher intensity
    ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity})`;
    
    for (let y = 0; y < SNOW_CANVAS_SIZE; y += dotSpacing) {
      for (let x = 0; x < SNOW_CANVAS_SIZE; x += dotSpacing) {
        // Random chance to draw a dot, influenced by the phase and intensity
        if (Math.random() < dotDensity) {
          const jitterX = Math.random() * 2;
          const jitterY = Math.random() * 2;
          ctx.fillRect(x + jitterX, y + jitterY, dotSize, dotSize);
        }
      }
    }
    
    // For higher intensities, add a second layer of larger, more sparse dots
    if (intensityFactor > 0.5) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + intensityFactor * 0.3})`;
      const largerDotDensity = 0.05 + (intensityFactor - 0.5) * 0.15; // Gradually increase with intensity
      const largerDotSize = 2.5 + (intensityFactor * 2); // Bigger dots at higher intensity
      
      for (let y = 0; y < SNOW_CANVAS_SIZE; y += 6) {
        for (let x = 0; x < SNOW_CANVAS_SIZE; x += 6) {
          if (Math.random() < largerDotDensity) {
            const jitterX = Math.random() * 3;
            const jitterY = Math.random() * 3;
            ctx.fillRect(x + jitterX, y + jitterY, largerDotSize, largerDotSize);
          }
        }
      }
    }
    
    setVisualSnowDataUrl(canvas.toDataURL('image/png'));
  }, [snowPhase, currentIntensity]);

  // Optimized visual aura animation
  useEffect(() => {
    if (type === 'visualAura') {
      let frameId: number;
      let lastTime = Date.now();
      const frameInterval = 200; // ms

      const animate = (currentTime: number) => {
        const elapsed = currentTime - lastTime;
        if (elapsed >= frameInterval) {
          setAuraPhase(prev => (prev + 1) % 8);
          lastTime = currentTime;
        }
        frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [type]);

  // Visual snow animation
  useEffect(() => {
    if (type === 'visualSnow') {
      let frameId: number;
      let lastTime = Date.now();
      // Adjust frame interval based on intensity - faster animation at higher intensities
      const intensityFactor = Math.min(Math.max(intensity, 0), 1);
      const frameInterval = Math.max(20, 50 - (intensityFactor * 30)); // ms - faster animation for higher intensity

      const animate = (currentTime: number) => {
        const elapsed = currentTime - lastTime;
        if (elapsed >= frameInterval) {
          // Faster phase changes at higher intensities
          const phaseIncrement = 0.2 + (intensityFactor * 0.3);
          setSnowPhase(prev => (prev + phaseIncrement) % (Math.PI * 2));
          lastTime = currentTime;
        }
        frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [type, intensity]);

  // Generate visual snow texture when phase changes
  useEffect(() => {
    if (type === 'visualSnow') {
      console.log('Generating visual snow texture, phase:', snowPhase);
      generateVisualSnowTexture();
    }
  }, [type, snowPhase, generateVisualSnowTexture]);

  // Add animation for dynamic conditions (scotoma, visual aura, etc.)
  useEffect(() => {
    // Check if the condition type requires continuous animation
    if (['scotoma', 'visualAura', 'visualSnow', 'diabeticRetinopathy'].includes(type)) {
      const animate = () => {
        // Force a re-render to update animated overlay positions
        setCurrentIntensity(prev => {
          // This trick forces React to see the value as changed even if it's the same
          const tiny = 0.00001;
          return Math.abs(prev - intensity) < tiny ? intensity + tiny : intensity;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [type, intensity]);

  // Get the CSS filter based on condition type and Braille Institute severity scales
  const getFilter = (type: string, intensity: number): string => {
    // Skip filter application for conditions using canvas-based transformation
    if (isColorTransformCondition(type)) {
      return '';
    }
    
    const i = Math.min(Math.max(intensity, 0), 1);
    
    switch (type) {
      case 'cataracts':
        // Enhanced cataract simulation with more realistic yellowing and clouding
        return `
          brightness(${100 + i * 15}%) 
          contrast(${100 - i * 30}%) 
          sepia(${i * 80}%) 
          blur(${i * 3}px)
          hue-rotate(${i * 20}deg)
          saturate(${100 + i * 20}%)
        `;
      case 'glaucoma':
        // More gradual tunnel vision effect with enhanced contrast
        return `
          brightness(${100 - i * 60}%) 
          contrast(${100 + i * 40}%)
          saturate(${100 + i * 30}%)
        `;
      case 'amd':
        // Enhanced central vision loss with more realistic distortion
        return `
          brightness(${100 - i * 50}%) 
          contrast(${100 + i * 30}%)
          blur(${i * 2}px)
          saturate(${100 + i * 20}%)
        `;
      case 'stargardt':
        // Enhanced Stargardt disease with more accurate central scotoma and preserved peripheral vision
        return `
          brightness(${100 - i * 70}%) 
          contrast(${100 + i * 20}%)
          blur(${i * 3}px)
          saturate(${100 - i * 70}%)
        `;
      case 'diabeticRetinopathy':
        // More realistic dark spots with enhanced contrast
        return `
          contrast(${100 + i * 40}%) 
          brightness(${100 - i * 40}%) 
          blur(${i * 2}px)
          saturate(${100 + i * 30}%)
        `;
      case 'astigmatism':
        // Enhanced astigmatism filter effects with starburst and streaking
        return `
          blur(${i * 2.5}px)
          brightness(${100 + i * 15}%)
          contrast(${100 + i * 25}%)
          saturate(${100 + i * 15}%)
          hue-rotate(${i * 5}deg)
        `;
      case 'retinitisPigmentosa':
        // Enhanced peripheral vision loss with progressing to severe tunnel vision
        // Cap at 90% effect to avoid complete vision loss at maximum intensity
        const effectIntensity = Math.min(i, 0.9);
        return `
          brightness(${100 - effectIntensity * 80}%) 
          contrast(${100 + effectIntensity * 50}%)
          saturate(${100 - effectIntensity * 70}%)
        `;
      case 'visualAura':
        // Enhanced scintillating scotoma animation (legacy support)
        return `
          brightness(${100 + Math.sin(auraPhase) * 15}%) 
          contrast(${100 + Math.cos(auraPhase) * 25}%)
          hue-rotate(${auraPhase * 30}deg)
          saturate(${100 + Math.sin(auraPhase) * 20}%)
        `;
      case 'visualAuraLeft':
        // Left-sided visual aura using CSS zigzag patterns
        return `
          linear-gradient(45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 60px, 
            transparent 60px
          ),
          linear-gradient(-45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 60px, 
            transparent 60px
          )
        `;
      case 'visualAuraRight':
        // Right-sided visual aura using CSS zigzag patterns
        return `
          linear-gradient(45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 60px, 
            transparent 60px
          ),
          linear-gradient(-45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 60px, 
            transparent 60px
          )
        `;
      case 'hemianopiaLeft':
        // Left half field loss
        return `
          brightness(${100 - i * 20}%) 
          contrast(${100 - i * 10}%)
        `;
      case 'hemianopiaRight':
        // Right half field loss
        return `
          brightness(${100 - i * 20}%) 
          contrast(${100 - i * 10}%)
        `;
      case 'quadrantanopia':
        // Upper right quadrant loss (most common form)
        return `
          brightness(${100 - i * 15}%) 
          contrast(${100 - i * 5}%)
        `;
      case 'scotoma':
        // Scotoma filter effects - slight darkening with blur
        return `
          brightness(${100 - i * 20}%) 
          contrast(${100 + i * 10}%)
          blur(${i * 1}px)
        `;
      case 'visualSnow':
        // Visual snow effect with stronger intensity-based adjustments
        return `
          brightness(${100 + i * 10}%) 
          contrast(${100 + i * 20}%)
          saturate(${100 - i * 15}%)
          url('/noise-pattern.svg#noise')
        `;
      case 'diplopiaMonocular':
        // Monocular diplopia - ghosting effect in one eye
        return `
          brightness(${100 + i * 10}%) 
          contrast(${100 + i * 15}%)
          saturate(${100 + i * 10}%)
        `;
      case 'diplopiaBinocular':
        // Binocular diplopia - double vision effect
        return `
          brightness(${100 + i * 5}%) 
          contrast(${100 + i * 10}%)
          saturate(${100 + i * 5}%)
        `;
      default:
        return '';
    }
  };

  // Get gradient overlay based on condition type and intensity
  const getOverlayStyle = (type: string, intensity: number): SxProps<Theme> => {
    const i = Math.min(Math.max(intensity, 0), 1);
    
    const baseStyle: SxProps<Theme> = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 1,
      transition: type === 'visualAura' ? 'none' : 'all 0.3s ease'
    };

    switch (type) {
      case 'amd':
        // Enhanced central scotoma with more realistic progression
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,${0.9 * i}) ${Math.max(0, 15 - i * 10)}%, 
              rgba(0,0,0,${0.7 * i}) ${Math.max(25, 40 - i * 15)}%,
              rgba(0,0,0,0) 60%
            )
          `,
          mixBlendMode: 'multiply'
        };
      case 'stargardt':
        // Enhanced Stargardt disease with more accurate central scotoma and preserved peripheral vision
        // At maximum intensity (100%), shows severe vision loss comparable to 95% intensity
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,${0.95 * i}) ${Math.max(0, 10 - i * 5)}%, 
              rgba(0,0,0,${0.9 * i}) ${Math.max(10, 20 - i * 10)}%,
              rgba(0,0,0,${0.85 * i}) ${Math.max(20, 40 - i * 20)}%,
              rgba(0,0,0,${0.8 * i}) ${Math.max(40, 70 - i * 30)}%,
              rgba(0,0,0,${Math.min(0.7 * i, 0.67)}) 80%
            )
          `,
          // Add a slight yellow/brown tint to simulate the color distortion commonly seen in Stargardt
          boxShadow: `inset 0 0 ${100 * i}px ${50 * i}px rgba(255, 230, 180, ${0.3 * i})`,
          mixBlendMode: 'multiply'
        };
      case 'glaucoma':
        // More gradual tunnel vision effect
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,0) ${Math.max(0, 35 - i * 30)}%, 
              rgba(0,0,0,${0.95 * i}) ${Math.max(45, 70 - i * 25)}%
            )
          `,
          mixBlendMode: 'multiply'
        };
      case 'retinitisPigmentosa':
        // Enhanced peripheral vision loss with severe tunnel vision but some central vision preserved
        // Cap at 90% effect to avoid near-complete blackout at maximum intensity
        const tunnelIntensity = Math.min(i, 0.9);
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,0) ${Math.max(0, 20 - tunnelIntensity * 18)}%, 
              rgba(0,0,0,${0.8 * tunnelIntensity}) ${Math.max(5, 25 - tunnelIntensity * 20)}%,
              rgba(0,0,0,${0.9 * tunnelIntensity}) ${Math.max(10, 35 - tunnelIntensity * 20)}%,
              rgba(0,0,0,${0.92 * tunnelIntensity}) 100%
            )
          `,
          mixBlendMode: 'multiply'
        };
      case 'cataracts':
        // More realistic clouding effect
        return {
          ...baseStyle,
          background: `
            linear-gradient(
              rgba(255, 248, 220, ${0.5 * i}),
              rgba(255, 248, 220, ${0.5 * i})
            ),
            radial-gradient(circle at center,
              rgba(255, 255, 255, ${0.3 * i}) 0%,
              transparent 70%
            )
          `,
          mixBlendMode: 'overlay'
        };
      case 'diabeticRetinopathy':
        // Enhanced scattered dark spots with larger blobs for severe cases
        return {
          ...baseStyle,
          background: [
            // Large central dark spot
            `radial-gradient(circle at ${50 + Math.sin(Date.now()/1200) * 10}% ${50 + Math.cos(Date.now()/1200) * 10}%,
              rgba(0,0,0,${0.7 * i}) 0%,
              rgba(0,0,0,${0.5 * i}) 10%,
              transparent 30%
            )`,
            // Additional large spots for severe cases
            `radial-gradient(circle at ${30 + Math.sin(Date.now()/1000) * 15}% ${70 + Math.cos(Date.now()/1000) * 15}%,
              rgba(0,0,0,${0.6 * i}) 0%,
              rgba(0,0,0,${0.4 * i}) 8%,
              transparent 25%
            )`,
            `radial-gradient(circle at ${70 + Math.cos(Date.now()/900) * 15}% ${30 + Math.sin(Date.now()/900) * 15}%,
              rgba(0,0,0,${0.65 * i}) 0%,
              rgba(0,0,0,${0.45 * i}) 10%,
              transparent 28%
            )`,
            // Original smaller spots
            `radial-gradient(circle at ${50 + Math.sin(Date.now()/1000) * 15}% ${50 + Math.cos(Date.now()/1000) * 15}%,
              rgba(0,0,0,${0.4 * i}) 0%,
              transparent 15%
            )`,
            `radial-gradient(circle at ${50 - Math.cos(Date.now()/1000) * 15}% ${50 - Math.sin(Date.now()/1000) * 15}%,
              rgba(0,0,0,${0.4 * i}) 0%,
              transparent 12%
            )`,
            `radial-gradient(circle at ${50 + Math.sin(Date.now()/800) * 20}% ${50 - Math.cos(Date.now()/800) * 20}%,
              rgba(0,0,0,${0.3 * i}) 0%,
              transparent 10%
            )`
          ].join(', '),
          mixBlendMode: 'multiply'
        };
      case 'visualAura':
        // Enhanced scintillating scotoma animation (legacy support)
        return {
          ...baseStyle,
          background: `url(${VISUAL_AURA_OVERLAY})`,
          backgroundSize: 'cover',
          opacity: i * 0.7,
          animation: 'scintillate 2s infinite',
          mixBlendMode: 'screen'
        };
      case 'visualAuraLeft':
        // Left-sided visual aura using CSS zigzag patterns
        return {
          ...baseStyle,
          background: `
            linear-gradient(45deg, 
              transparent 15px, 
              rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 15px, 
              rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 30px, 
              transparent 30px, 
              transparent 45px,
              rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 45px, 
              rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 60px, 
              transparent 60px
            ),
            linear-gradient(-45deg, 
              transparent 15px, 
              rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 15px, 
              rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 30px, 
              transparent 30px, 
              transparent 45px,
              rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 45px, 
              rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 60px, 
              transparent 60px
            )`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'left center',
          backgroundRepeat: 'repeat-y',
          clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
          opacity: 0.9,
          mixBlendMode: 'screen',
          animation: 'scintillateLeft 5s infinite'
        };
      case 'visualAuraRight':
        // Right-sided visual aura using CSS zigzag patterns
        return {
          ...baseStyle,
          background: `
          linear-gradient(45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.5 * i * (1 + Math.sin(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.7 * i * (1 + Math.sin(auraPhase))}) 60px, 
            transparent 60px
          ),
          linear-gradient(-45deg, 
            transparent 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 15px, 
            rgba(255, 255, 255, ${0.6 * i * (1 + Math.cos(auraPhase))}) 30px, 
            transparent 30px, 
            transparent 45px,
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 45px, 
            rgba(255, 255, 255, ${0.8 * i * (1 + Math.cos(auraPhase))}) 60px, 
            transparent 60px
          )`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'right center',
          backgroundRepeat: 'repeat-y',
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
          opacity: 0.9,
          mixBlendMode: 'screen',
          animation: 'scintillateRight 5s infinite'
        };
      case 'astigmatism':
        // Enhanced astigmatism simulation with light streaking, starburst, and lens flare effects
        return {
          ...baseStyle,
          background: [
            // Enhanced starburst effect
            `radial-gradient(circle at center,
              rgba(255, 255, 255, ${0.5 * i}) 0%,
              rgba(255, 255, 255, ${0.3 * i}) 15%,
              transparent 60%
            )`,
            // Lens flare effects
            `radial-gradient(circle at 45% 45%,
              rgba(255, 255, 255, ${0.4 * i}) 0%,
              rgba(255, 255, 255, ${0.2 * i}) 10%,
              transparent 30%
            )`,
            `radial-gradient(circle at 55% 55%,
              rgba(255, 255, 255, ${0.35 * i}) 0%,
              rgba(255, 255, 255, ${0.15 * i}) 8%,
              transparent 25%
            )`,
            // Light streaks with softer edges
            `linear-gradient(90deg,
              transparent 0%,
              rgba(255, 255, 255, ${0.3 * i}) 45%,
              rgba(255, 255, 255, ${0.3 * i}) 55%,
              transparent 100%
            )`,
            `linear-gradient(0deg,
              transparent 0%,
              rgba(255, 255, 255, ${0.3 * i}) 45%,
              rgba(255, 255, 255, ${0.3 * i}) 55%,
              transparent 100%
            )`,
            // Diagonal streaks for enhanced starburst
            `linear-gradient(45deg,
              transparent 0%,
              rgba(255, 255, 255, ${0.25 * i}) 45%,
              rgba(255, 255, 255, ${0.25 * i}) 55%,
              transparent 100%
            )`,
            `linear-gradient(-45deg,
              transparent 0%,
              rgba(255, 255, 255, ${0.25 * i}) 45%,
              rgba(255, 255, 255, ${0.25 * i}) 55%,
              transparent 100%
            )`
          ].join(', '),
          mixBlendMode: 'screen',
          opacity: 0.75
        };
      case 'hemianopiaLeft':
        // Left half field loss
        return {
          ...baseStyle,
          background: `
            linear-gradient(to right, 
              rgba(0,0,0,${0.95 * i}) 0%, 
              rgba(0,0,0,${0.95 * i}) 45%, 
              rgba(0,0,0,0) 50%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(0.95, i) // Limit maximum opacity to allow some visibility
        };
      case 'hemianopiaRight':
        // Right half field loss
        return {
          ...baseStyle,
          background: `
            linear-gradient(to left, 
              rgba(0,0,0,${0.95 * i}) 0%, 
              rgba(0,0,0,${0.95 * i}) 45%, 
              rgba(0,0,0,0) 50%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(0.95, i) // Limit maximum opacity to allow some visibility
        };
      case 'quadrantanopia':
        // Upper right quadrant loss (most common form)
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at 0% 100%, 
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0) ${Math.max(25, 40 - i * 20)}%,
              rgba(0,0,0,${0.95 * i}) ${Math.max(45, 60 - i * 20)}%,
              rgba(0,0,0,${0.95 * i}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(0.95, i) // Limit maximum opacity to allow some visibility
        };
      case 'scotoma':
        // Central blind spot that moves slightly - make movement speed depend on time for smoother animation
        const now = Date.now();
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
              rgba(0,0,0,${0.95 * i}) 0%, 
              rgba(0,0,0,${0.85 * i}) ${Math.max(5, 10 - i * 5)}%,
              rgba(0,0,0,${0.5 * i}) ${Math.max(10, 20 - i * 10)}%,
              rgba(0,0,0,0) ${Math.max(20, 35 - i * 15)}%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(0.95, i) // Limit maximum opacity to allow some visibility
        };
      case 'visualSnow':
        // Enhanced visual snow overlay using SVG-based noise pattern with intensity-based parameters
        // Dynamically adjust the fractalNoise parameters based on intensity
        const baseFreq = 0.65 + (i * 0.2); // Increase noise frequency with intensity
        const numOctaves = Math.round(3 + (i * 2)); // More noise detail at higher intensities
        const snowOpacity = 0.7 + (i * 0.25); // More visible at higher intensities (max 0.95)
        
        return {
          ...baseStyle,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          opacity: Math.min(snowOpacity, 0.95), // Cap at 0.95 for visibility
          mixBlendMode: i > 0.6 ? 'soft-light' : 'overlay', // Stronger blend mode at higher intensities
          animation: 'visualSnowAnimation 15s linear infinite',
          // Add a second layer of noise for higher intensities
          ...(i > 0.5 && {
            boxShadow: `inset 0 0 0 2000px rgba(255, 255, 255, ${0.1 * i})`,
          })
        };
      case 'diplopiaMonocular':
        // Monocular diplopia - ghosting effect with slight offset
        return {
          ...baseStyle,
          background: `
            linear-gradient(
              rgba(255, 255, 255, ${0.3 * i}),
              rgba(255, 255, 255, ${0.3 * i})
            )
          `,
          transform: `translateX(${i * 10}px)`,
          mixBlendMode: 'screen',
          opacity: Math.min(0.7, i)
        };
      case 'diplopiaBinocular':
        // Binocular diplopia - double vision with horizontal separation
        return {
          ...baseStyle,
          background: `
            linear-gradient(
              rgba(255, 255, 255, ${0.4 * i}),
              rgba(255, 255, 255, ${0.4 * i})
            )
          `,
          transform: `translateX(${i * 20}px)`,
          mixBlendMode: 'screen',
          opacity: Math.min(0.8, i)
        };
      default:
        return baseStyle;
    }
  };

  // Memoize filter and overlay styles to prevent unnecessary recalculations, 
  // but allow dynamic updates for animated conditions
  const filterStyle = React.useMemo(
    () => getFilter(type, currentIntensity), 
    [type, currentIntensity, isDynamicCondition ? Date.now() : null]
  );
  const overlayStyle = React.useMemo(
    () => getOverlayStyle(type, currentIntensity), 
    [type, currentIntensity, isDynamicCondition ? Date.now() : null]
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        '@keyframes scintillate': {
          '0%': { filter: 'hue-rotate(0deg) brightness(1)' },
          '50%': { filter: 'hue-rotate(180deg) brightness(1.2)' },
          '100%': { filter: 'hue-rotate(360deg) brightness(1)' }
        },
        '@keyframes visualSnowAnimation': {
          '0%': { backgroundPosition: '0% 0%', opacity: 1 },
          '25%': { backgroundPosition: '100% 0%', opacity: 1.05 },
          '50%': { backgroundPosition: '100% 100%', opacity: 1 },
          '75%': { backgroundPosition: '0% 100%', opacity: 0.95 },
          '100%': { backgroundPosition: '0% 0%', opacity: 1 }
        }
      }}
    >
      {shouldShowColorPreview(type) && (
        <Box sx={{ mb: 2 }}>
          <ColorPreview type={type as any} intensity={currentIntensity} />
        </Box>
      )}

      {/* Hidden canvas for color transformations */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }} 
      />
      
      {/* Hidden canvas for visual snow generation */}
      <canvas
        ref={snowCanvasRef}
        width={SNOW_CANVAS_SIZE}
        height={SNOW_CANVAS_SIZE}
        style={{ display: 'none' }}
      />

      <Box 
        ref={imageContainerRef}
        sx={{ 
          position: 'relative',
          width: '100%',
          height: '300px',  // Explicit height instead of paddingTop ratio
          overflow: 'hidden',
          borderRadius: 1,
          backgroundColor: 'background.paper',
          border: debugMessage ? '1px dashed red' : 'none',
        }}
      >
        {/* Always show the base image explicitly */}
        <Box
          component="img"
          src={REFERENCE_IMAGE}  // Always use reference image directly
          alt="Colorful garden with diverse flowers"
          onLoad={() => console.log(`Base image rendered for ${type}`)}
          onError={(e) => {
            console.error(`Image failed to load for ${type}:`, e);
            // Use a simpler fallback image as backup
            (e.target as HTMLImageElement).src = '/garden-flowers.jpg';
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'transform, filter',
            zIndex: 1,
            filter: isColorTransformCondition(type) ? '' : filterStyle,
            display: 'block', // Explicitly force display
          }}
        />

        {/* Effect Overlay - Applied for all non-color-transform conditions */}
        {!isColorTransformCondition(type) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              ...overlayStyle,
              willChange: 'transform, opacity, filter',
              zIndex: 2,
              pointerEvents: 'none', // Prevent overlay from blocking image interactions
            }}
          />
        )}

        {/* Transformed Image - Only for color transform conditions */}
        {isColorTransformCondition(type) && imageSrc && (
          <Box
            component="img"
            src={imageSrc}
            alt="Color transformed vision"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 3,
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default ConditionPreview; 