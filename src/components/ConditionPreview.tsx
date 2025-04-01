import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, SxProps, Theme } from '@mui/material';
import ColorPreview from './ColorPreview';

interface ConditionPreviewProps {
  type: string;
  intensity: number;
}

// Using a local image to avoid CORS issues
const REFERENCE_IMAGE = '/garden-fallback.jpg'; // Swapped to use the former fallback as primary

// Visual aura animation frames
const VISUAL_AURA_OVERLAY = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Migraine-aura-aka-scintillating-scotoma-anecdoteal-depiction.png';

// Helper function to check if condition should show color preview
const shouldShowColorPreview = (type: string): boolean => {
  return ![
    'amd',
    'retinitisPigmentosa',
    'glaucoma',
    'stargardt',
    'visualAura',
    'astigmatism',
    'hemianopiaLeft',
    'hemianopiaRight',
    'quadrantanopia',
    'scotoma'
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
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

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

  // Add animation for dynamic conditions (scotoma, visual aura, etc.)
  useEffect(() => {
    // Check if the condition type requires continuous animation
    if (['scotoma', 'visualAura', 'diabeticRetinopathy'].includes(type)) {
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
        // Enhanced Stargardt Disease simulation with more severe central vision loss
        return `
          brightness(${100 - i * 70}%) 
          contrast(${100 + i * 30}%)
          blur(${i * 3}px)
          saturate(${100 - i * 50}%)
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
        // Enhanced peripheral vision loss with progressing to near-complete blindness
        return `
          brightness(${100 - i * 90}%) 
          contrast(${100 + i * 50}%)
          saturate(${100 - i * 80}%)
        `;
      case 'visualAura':
        // Enhanced scintillating scotoma effect
        return `
          brightness(${100 + Math.sin(auraPhase) * 15}%) 
          contrast(${100 + Math.cos(auraPhase) * 25}%)
          hue-rotate(${auraPhase * 30}deg)
          saturate(${100 + Math.sin(auraPhase) * 20}%)
        `;
      case 'hemianopiaLeft':
      case 'hemianopiaRight':
        // Hemianopia filter effects - slight darkening and reduced contrast
        return `
          brightness(${100 - i * 20}%) 
          contrast(${100 - i * 10}%)
        `;
      case 'quadrantanopia':
        // Quadrantanopia filter effects - similar to hemianopia but less intense
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
        // Enhanced Stargardt disease with more severe central vision loss progressing to near-complete blindness
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,${0.95 * i}) ${Math.max(0, 20 - i * 5)}%, 
              rgba(0,0,0,${0.85 * i}) ${Math.max(25, 50 - i * 10)}%,
              rgba(0,0,0,${0.5 * i}) ${Math.max(50, 80 - i * 10)}%,
              rgba(0,0,0,0) 95%
            )
          `,
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
        // Enhanced peripheral vision loss with extreme narrowing at high intensities - near complete blindness at 100%
        return {
          ...baseStyle,
          background: `
            radial-gradient(circle at center, 
              rgba(0,0,0,0) ${Math.max(0, 20 - i * 18)}%, 
              rgba(0,0,0,${0.8 * i}) ${Math.max(5, 25 - i * 20)}%,
              rgba(0,0,0,${0.95 * i}) ${Math.max(10, 35 - i * 20)}%,
              rgba(0,0,0,${0.98 * i}) 100%
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
        // Enhanced scintillating scotoma animation
        return {
          ...baseStyle,
          background: `url(${VISUAL_AURA_OVERLAY})`,
          backgroundSize: 'cover',
          opacity: i * 0.7,
          animation: 'scintillate 2s infinite',
          mixBlendMode: 'screen',
          transform: `rotate(${auraPhase * 30}deg) scale(${1 + Math.sin(auraPhase) * 0.08})`
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
      default:
        return baseStyle;
    }
  };

  // Memoize filter and overlay styles to prevent unnecessary recalculations, 
  // but allow dynamic updates for animated conditions
  const isDynamicCondition = ['scotoma', 'visualAura', 'diabeticRetinopathy'].includes(type);
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

      {/* Debug output - Only displayed during development */}
      {debugMessage && (
        <Box sx={{ mt: 1, fontSize: '10px', color: 'text.secondary' }}>
          {debugMessage}
        </Box>
      )}
    </Paper>
  );
};

export default ConditionPreview; 