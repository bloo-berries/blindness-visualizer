import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, SxProps, Theme } from '@mui/material';
import ColorPreview from './ColorPreview';
import ColorVisionPreview from './ColorVisionPreview';
import { isColorTransformCondition, shouldShowColorPreview, getLayerPriority } from '../utils/colorTransformations';
import { isColorVisionCondition } from '../utils/colorVisionFilters';
import { getRenderStyles } from '../utils/renderStyles';
import { ConditionType } from '../types/visualEffects';

interface ConditionPreviewProps {
  type: ConditionType;
  intensity: number;
}

// Using a local image to avoid CORS issues
const REFERENCE_IMAGE = '/assets/images/garden-fallback.jpg'; // Updated to use the correct image path

// Update visual aura overlay with a more accurate representation
const VISUAL_AURA_OVERLAY = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Migraine-aura-aka-scintillating-scotoma-anecdoteal-depiction.png';
// We'll create CSS-based overlays for left and right auras instead of using external GIFs
// New specific overlays for left and right auras
const VISUAL_AURA_LEFT_OVERLAY = '/aura-left.gif'; // This path will be created later
const VISUAL_AURA_RIGHT_OVERLAY = '/aura-right.gif'; // This path will be created later

// Canvas size for visual snow animation
const SNOW_CANVAS_SIZE = 256;

const ConditionPreview: React.FC<ConditionPreviewProps> = ({ type, intensity }) => {
  const [auraPhase, setAuraPhase] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Indicate that these types need dynamic animation
  const isDynamicCondition = ['scotoma', 'visualAuraLeft', 'visualAuraRight', 'visualAura', 'visualSnow', 'visualFloaters', 'diabeticRetinopathy'].includes(type);

  // Load the source image only once
  useEffect(() => {
    // Create image element for preloading
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS
    img.src = REFERENCE_IMAGE;
    
    // Only set the image reference when it's fully loaded
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      
      // Always set the image source for the base image display
      setImageSrc(REFERENCE_IMAGE);
      
      // For color transform conditions, also apply the transformation
      if (isColorTransformCondition(type)) {
        // applyColorTransformation(); // No longer needed
      }
    };
    
    img.onerror = (e) => {
      console.error(`Failed to load the original image for ${type}:`, e);
      // Try fallback image
      img.src = '/assets/images/garden.png';
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
    // No longer needed since we're using CSS filters
    // The color transformations are now handled by CSS filters in the render
  }, [type, currentIntensity, imageLoaded]);

  // Add a useEffect for dynamic animation of scotoma and other dynamic conditions
  useEffect(() => {
    if (!isDynamicCondition) return;
    
    // Create an animation loop for dynamic conditions
    const animate = () => {
      if (type === 'scotoma' || type === 'visualFloaters') {
        setAuraPhase(prev => prev + 0.014); // Slowing down by 30%
      } else if (['visualAura', 'visualAuraLeft', 'visualAuraRight'].includes(type)) {
        setAuraPhase(prev => prev + 0.05);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Clean up animation frame on unmount or when condition changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, isDynamicCondition]);

  // Get CSS filter based on condition type and Braille Institute severity scales
  const getFilter = (type: ConditionType, intensity: number): string => {
    const i = Math.min(Math.max(intensity, 0), 1);
    
    // For color vision conditions, return empty string as they're handled by ColorVisionPreview
    if (isColorVisionCondition(type)) {
      return '';
    }
    
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
        return `
          brightness(${100 - i * 20}%)
          contrast(${100 - i * 15}%)
          saturate(${100 - i * 10}%)
          blur(${i * 1.5}px)
        `;
      case 'amd':
        return `
          brightness(${100 - i * 25}%)
          contrast(${100 - i * 20}%)
          saturate(${100 - i * 15}%)
        `;
      case 'diabeticRetinopathy':
        return `
          brightness(${100 - i * 10}%)
          contrast(${100 + i * 10}%)
          saturate(${100 - i * 5}%)
        `;
      case 'retinitisPigmentosa':
        return `
          brightness(${100 - i * 30}%)
          contrast(${100 - i * 25}%)
          saturate(${100 - i * 20}%)
        `;
      case 'stargardt':
        return `
          brightness(${100 - i * 20}%)
          contrast(${100 - i * 15}%)
          saturate(${100 - i * 10}%)
        `;
      case 'astigmatism':
        return `
          blur(${i * 2}px)
          brightness(${100 + i * 5}%)
        `;
      case 'nearSighted':
        return `
          blur(${i * 3}px)
          brightness(${100 + i * 3}%)
        `;
      case 'farSighted':
        return `
          blur(${i * 2.5}px)
          brightness(${100 + i * 2}%)
        `;
      case 'visualSnow':
        // Visual snow effect with stronger intensity-based adjustments
        return `
          brightness(${100 - i * 5}%)
          contrast(${100 + i * 15}%)
          saturate(${100 + i * 10}%)
          blur(${i * 0.5}px)
        `;
      case 'visualFloaters':
        return `
          brightness(${100 + i * 3}%)
          contrast(${100 + i * 5}%)
        `;
      case 'hallucinations':
        return `
          brightness(${100 + i * 10}%)
          contrast(${100 + i * 15}%)
          saturate(${100 + i * 20}%)
          hue-rotate(${i * 30}deg)
        `;
      case 'diplopiaMonocular':
      case 'diplopiaBinocular':
        return `
          brightness(${100 + i * 5}%)
          contrast(${100 + i * 3}%)
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
      case 'blindnessLeftEye':
        return {
          ...baseStyle,
          background: `linear-gradient(to right, rgba(0,0,0,${i * 0.9}) 0%, rgba(0,0,0,${i * 0.9}) 50%, transparent 50%)`,
          clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)'
        };
      case 'blindnessRightEye':
        return {
          ...baseStyle,
          background: `linear-gradient(to left, rgba(0,0,0,${i * 0.9}) 0%, rgba(0,0,0,${i * 0.9}) 50%, transparent 50%)`,
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
        };
      case 'hemianopiaLeft':
        return {
          ...baseStyle,
          background: `linear-gradient(to right, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 50%, transparent 50%)`,
          clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)'
        };
      case 'hemianopiaRight':
        return {
          ...baseStyle,
          background: `linear-gradient(to left, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 50%, transparent 50%)`,
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
        };
      case 'bitemporalHemianopia':
        return {
          ...baseStyle,
          background: `
            linear-gradient(to right, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 25%, transparent 25%),
            linear-gradient(to left, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 25%, transparent 25%)
          `
        };
      case 'quadrantanopiaRight':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,${i * 0.8}) 50%)`,
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)'
        };
      case 'quadrantanopiaInferior':
        return {
          ...baseStyle,
          background: `linear-gradient(to top, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 50%, transparent 50%)`,
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
        };
      case 'quadrantanopiaSuperior':
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.8}) 50%, transparent 50%)`,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)'
        };
      case 'scotoma':
        return {
          ...baseStyle,
          background: `radial-gradient(circle at 30% 40%, rgba(0,0,0,${i * 0.9}) 0%, rgba(0,0,0,${i * 0.9}) 15%, transparent 15%)`,
          animation: 'scotomaDrift 8s infinite'
        };
      default:
        return baseStyle;
    }
  };

  // Get render-safe styles for overlays that work with MUI Box
  const getLocalRenderStyles = (type: ConditionType, intensity: number): any => {
    return getRenderStyles(type, intensity, auraPhase);
  };

  // Get filter to use for the image
  const filterStyle = React.useMemo(
    () => getFilter(type, currentIntensity), 
    [type, currentIntensity, isDynamicCondition ? Date.now() : null]
  );
  
  // Get overlay style for the condition (for reference but not direct use in render)
  const overlayStyle = React.useMemo(
    () => getOverlayStyle(type, currentIntensity), 
    [type, currentIntensity, isDynamicCondition ? Date.now() : null]
  );

  // Get render-safe styles for MUI components
  const renderStyles = React.useMemo(
    () => getLocalRenderStyles(type, currentIntensity),
    [type, currentIntensity, isDynamicCondition ? auraPhase : null]
  );

  // Add custom class for condition type to help with debugging and specific CSS targeting
  const conditionClass = `condition-${type}`;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0,
        bgcolor: 'transparent',
        border: 'none',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'none', // Remove shadow for overlay cases
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
        },
        '@keyframes scotomaDrift': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -5px)' },
          '50%': { transform: 'translate(5px, 10px)' },
          '75%': { transform: 'translate(-5px, 5px)' },
          '100%': { transform: 'translate(0, 0)' }
        }
      }}
    >
      {/* Hidden canvas for color transformations */}
      {/* <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }} 
      /> */}

      <Box 
        ref={imageContainerRef}
        className={conditionClass}
        sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',  
          overflow: 'hidden',
          borderRadius: 1,
          backgroundColor: 'transparent',
        }}
      >
        {/* Base Image - Display for all conditions */}
        {imageSrc && (
          <Box
            component="img"
            src={imageSrc}
            alt={`${type} vision simulation`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              mixBlendMode: 'normal',
              filter: filterStyle, // Apply CSS filters to all conditions
            }}
          />
        )}

        {/* Effect Overlay - Applied for non-color-transform conditions only */}
        {!isColorTransformCondition(type) && (
          <Box
            sx={renderStyles}
          />
        )}

        {/* Color Vision Preview - Only for color vision conditions */}
        {isColorVisionCondition(type) && (
          <ColorVisionPreview 
            type={type} 
            intensity={currentIntensity} 
          />
        )}

        {/* Transformed Image - Only for other color transform conditions */}
        {isColorTransformCondition(type) && !isColorVisionCondition(type) && imageSrc && (
          <Box
            component="img"
            src={imageSrc}
            alt={`${type} vision simulation`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: getLayerPriority(type),
              mixBlendMode: 'normal',
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default ConditionPreview; 