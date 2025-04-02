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
  const isDynamicCondition = ['scotoma', 'visualAuraLeft', 'visualAuraRight', 'visualAura', 'visualSnow', 'visualFloaters', 'diabeticRetinopathy'].includes(type);

  // Add a visual snow background pattern directly in the component
  const getVisualSnowPattern = (intensity: number) => {
    const dataUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.8'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='22' cy='17' r='0.8'/%3E%3Ccircle cx='34' cy='10' r='0.9'/%3E%3Ccircle cx='48' cy='15' r='0.8'/%3E%3Ccircle cx='68' cy='18' r='0.7'/%3E%3Ccircle cx='86' cy='14' r='0.9'/%3E%3Ccircle cx='15' cy='27' r='0.6'/%3E%3Ccircle cx='28' cy='32' r='0.9'/%3E%3Ccircle cx='40' cy='28' r='0.7'/%3E%3Ccircle cx='55' cy='34' r='0.8'/%3E%3Ccircle cx='75' cy='28' r='0.7'/%3E%3Ccircle cx='88' cy='25' r='0.9'/%3E%3C/g%3E%3C/svg%3E")`;
    return dataUrl;
  };

  // Add a useEffect for dynamic animation of scotoma and other dynamic conditions
  useEffect(() => {
    if (!isDynamicCondition) return;
    
    // Create an animation loop for dynamic conditions
    const animate = () => {
      if (type === 'scotoma' || type === 'visualFloaters') {
        setAuraPhase(prev => prev + 0.014); // Slowing down by 30%
      } else if (['visualAura', 'visualAuraLeft', 'visualAuraRight'].includes(type)) {
        setAuraPhase(prev => prev + 0.05);
      } else if (type === 'visualSnow') {
        setSnowPhase(prev => prev + 1);
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

  // Rest of useEffects and functions...
  
  // Get CSS filter based on condition type and Braille Institute severity scales
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
      // More filter cases...  
      case 'visualSnow':
        // Visual snow effect with stronger intensity-based adjustments
        const baseFreq = 0.65 + (i * 0.2); // Increase noise frequency with intensity
        const numOctaves = Math.round(3 + (i * 2)); // More noise detail at higher intensities
        
        return `
          brightness(${100 - i * 5}%)
          contrast(${100 + i * 15}%)
          saturate(${100 + i * 10}%)
          blur(${i * 0.5}px)
        `;
      // More filter cases...
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

    // Switch statement for overlay styles...
    return baseStyle;
  };

  // Get the appropriate blend mode based on the condition type for better overlay combination
  const getBlendMode = (type: string): string => {
    switch (type) {
      case 'cataracts':
      case 'glaucoma':
      case 'amd':
      case 'stargardt':
      case 'retinitisPigmentosa':
        return 'multiply'; // Darken the underlying image
      
      case 'visualAura':
      case 'visualAuraLeft':
      case 'visualAuraRight':
      case 'visualSnow':
        return 'screen'; // Lighten the underlying image

      case 'hemianopiaLeft':
      case 'hemianopiaRight':
      case 'quadrantanopia':
      case 'scotoma':
      case 'visualFloaters':
        return 'multiply'; // Darken only portions
      
      case 'astigmatism':
        return 'overlay'; // Light streaks and lens effects
      
      case 'diplopiaMonocular':
      case 'diplopiaBinocular':
        return 'normal'; // Normal for double vision

      case 'diabeticRetinopathy':
        return 'multiply'; // Darken with spots
      
      default:
        return 'normal';
    }
  };

  // Add a condition to get the proper z-index ordering for better overlays
  const getLayerPriority = (type: string): number => {
    // Prioritize specific condition types to ensure proper stacking
    // Field loss conditions should be below color/details conditions
    switch (type) {
      case 'hemianopiaLeft':
      case 'hemianopiaRight':
      case 'quadrantanopia':
        return 1; // Lowest layer - field loss
      
      case 'scotoma':
      case 'glaucoma':
      case 'amd':
      case 'retinitisPigmentosa':
      case 'stargardt':
        return 2; // Second layer - focal loss
      
      case 'cataracts':
      case 'diabeticRetinopathy':
        return 3; // Third layer - overall degradation
        
      case 'visualSnow':
      case 'visualFloaters':
      case 'astigmatism':
        return 4; // Fourth layer - noise and distortion
        
      case 'visualAura':
      case 'visualAuraLeft':
      case 'visualAuraRight':
        return 5; // Fifth layer - transient visual effects
        
      case 'diplopiaMonocular':
      case 'diplopiaBinocular':
        return 6; // Top layer - double vision
      
      default:
        return 3;
    }
  };

  // Get render-safe styles for overlays that work with MUI Box
  const getRenderStyles = (type: string, intensity: number): any => {
    // Base styles that are type-safe
    const renderStyles: any = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      willChange: 'transform, opacity, filter',
      zIndex: getLayerPriority(type),
      pointerEvents: 'none',
      mixBlendMode: getBlendMode(type),
      transition: 'all 0.3s ease',
    };

    // Add type-specific styles
    const i = Math.min(Math.max(intensity, 0), 1);
    
    switch (type) {
      case 'amd':
        renderStyles.background = `
          radial-gradient(circle at center, 
            rgba(0,0,0,${0.9 * i}) ${Math.max(0, 15 - i * 10)}%, 
            rgba(0,0,0,${0.7 * i}) ${Math.max(25, 40 - i * 15)}%,
            rgba(0,0,0,0) 60%
          )
        `;
        break;
      case 'quadrantanopia':
        renderStyles.background = `
          radial-gradient(circle at 0% 100%, 
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) ${Math.max(25, 40 - i * 20)}%,
            rgba(0,0,0,${0.95 * i}) ${Math.max(45, 60 - i * 20)}%,
            rgba(0,0,0,${0.95 * i}) 100%
          )
        `;
        renderStyles.opacity = Math.min(0.95, i); // Limit maximum opacity to allow some visibility
        break;
      case 'hemianopiaLeft':
        renderStyles.background = `
          linear-gradient(to right, 
            rgba(0,0,0,${0.95 * i}) 0%, 
            rgba(0,0,0,${0.95 * i}) 45%, 
            rgba(0,0,0,0) 50%
          )
        `;
        renderStyles.opacity = Math.min(0.95, i); // Limit maximum opacity to allow some visibility
        break;
      case 'hemianopiaRight':
        renderStyles.background = `
          linear-gradient(to left, 
            rgba(0,0,0,${0.95 * i}) 0%, 
            rgba(0,0,0,${0.95 * i}) 45%, 
            rgba(0,0,0,0) 50%
          )
        `;
        renderStyles.opacity = Math.min(0.95, i); // Limit maximum opacity to allow some visibility
        break;
      case 'scotoma':
        // Create two separate blobs that move sporadically and more slowly
        // Primary blob - more oblong, non-uniform shape with slightly faster movement
        const offsetX1 = 40 + Math.sin(auraPhase * 0.7) * 15 + Math.sin(auraPhase * 0.4) * 8;
        const offsetY1 = 45 + Math.cos(auraPhase * 0.5) * 12 + Math.cos(auraPhase * 0.8) * 6;
        // Control elliptical shape with different x and y radiuses - increased by 35%
        const xRadius1 = Math.max(8, 16 - i * 6.4) * (1 + 0.3 * Math.sin(auraPhase * 0.3)) * 2.16;
        const yRadius1 = Math.max(12.8, 24 - i * 9.6) * (1 + 0.2 * Math.cos(auraPhase * 0.5)) * 2.16;
        
        // Secondary blob - more randomized movement pattern
        const offsetX2 = 60 + Math.sin(auraPhase * 0.2 + 2) * 10 
                           + Math.sin(auraPhase * 0.4) * 8 
                           + Math.sin(auraPhase * 1.2) * 3;
        const offsetY2 = 55 + Math.cos(auraPhase * 0.25 + 1) * 12 
                           + Math.cos(auraPhase * 0.6) * 5
                           + Math.cos(auraPhase * 0.9) * 4;
        // More irregular shape for second blob - increased by 35%
        const xRadius2 = Math.max(6.4, 12.8 - i * 4.8) * (1 + 0.4 * Math.sin(auraPhase * 0.4)) * 2.16;
        const yRadius2 = Math.max(9.6, 19.2 - i * 8) * (1 + 0.3 * Math.cos(auraPhase * 0.6)) * 2.16;
        
        // Create combined background with elliptical gradients for less uniform blobs
        renderStyles.background = `
          radial-gradient(ellipse ${xRadius1}% ${yRadius1}% at ${offsetX1}% ${offsetY1}%, 
            rgba(0,0,0,${0.95 * i}) 0%, 
            rgba(0,0,0,${0.85 * i}) ${Math.max(3, 7 - i * 4)}%,
            rgba(0,0,0,${0.6 * i}) ${Math.max(6, 14 - i * 8)}%,
            rgba(0,0,0,${0.3 * i}) ${Math.max(9, 18 - i * 9)}%,
            rgba(0,0,0,0) ${Math.max(12, 25 - i * 10)}%
          ),
          radial-gradient(ellipse ${xRadius2}% ${yRadius2}% at ${offsetX2}% ${offsetY2}%, 
            rgba(0,0,0,${0.92 * i}) 0%, 
            rgba(0,0,0,${0.82 * i}) ${Math.max(2, 6 - i * 3)}%,
            rgba(0,0,0,${0.5 * i}) ${Math.max(5, 12 - i * 7)}%,
            rgba(0,0,0,${0.25 * i}) ${Math.max(8, 15 - i * 7)}%,
            rgba(0,0,0,0) ${Math.max(10, 20 - i * 8)}%
          )
        `;
        renderStyles.opacity = Math.min(0.95, i);
        break;
      case 'visualAuraLeft':
        renderStyles.background = `
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
        renderStyles.backgroundSize = '60px 60px';
        renderStyles.backgroundPosition = 'left center';
        renderStyles.backgroundRepeat = 'repeat-y';
        renderStyles.clipPath = 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)';
        renderStyles.opacity = 0.9;
        renderStyles.animation = 'scintillateLeft 5s infinite';
        break;
      case 'visualAuraRight':
        renderStyles.background = `
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
        renderStyles.backgroundSize = '60px 60px';
        renderStyles.backgroundPosition = 'right center';
        renderStyles.backgroundRepeat = 'repeat-y';
        renderStyles.clipPath = 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)';
        renderStyles.opacity = 0.9;
        renderStyles.animation = 'scintillateRight 5s infinite';
        break;
      case 'visualFloaters':
        // Multiple small floaters moving across the visual field
        // Floater 1 - larger, stringy floater
        const floaterX1 = 30 + Math.sin(auraPhase * 0.3) * 25 + Math.sin(auraPhase * 0.2) * 10;
        const floaterY1 = 40 + Math.cos(auraPhase * 0.25) * 20;
        // Floater 2 - medium, circular floater
        const floaterX2 = 65 + Math.sin(auraPhase * 0.2 + 1) * 20;
        const floaterY2 = 50 + Math.cos(auraPhase * 0.3 + 2) * 25;
        // Floater 3 - small, quick-moving floater
        const floaterX3 = 50 + Math.sin(auraPhase * 0.4 + 3) * 30;
        const floaterY3 = 25 + Math.cos(auraPhase * 0.35 + 1) * 15;
        // Floater 4 - thin, string-like floater
        const floaterX4 = 45 + Math.sin(auraPhase * 0.15 + 2) * 15;
        const floaterY4 = 70 + Math.cos(auraPhase * 0.2 + 3) * 10;
        
        // Create multiple floaters with various shapes and sizes - made larger and more visible
        renderStyles.background = `
          /* String-like floater - made larger */
          radial-gradient(ellipse 20% 5% at ${floaterX1}% ${floaterY1}%, 
            rgba(0,0,0,0.85) 0%, 
            rgba(0,0,0,0.7) 15%,
            rgba(0,0,0,0.5) 40%,
            rgba(0,0,0,0) 80%
          ),
          /* Round floater - made larger */
          radial-gradient(circle 5% at ${floaterX2}% ${floaterY2}%, 
            rgba(0,0,0,0.9) 0%, 
            rgba(0,0,0,0.7) 40%,
            rgba(0,0,0,0.4) 70%,
            rgba(0,0,0,0) 100%
          ),
          /* Small dot floater - made more visible */
          radial-gradient(circle 2.5% at ${floaterX3}% ${floaterY3}%, 
            rgba(0,0,0,0.95) 0%, 
            rgba(0,0,0,0.8) 40%,
            rgba(0,0,0,0.5) 70%,
            rgba(0,0,0,0) 100%
          ),
          /* Thin stringy floater - made more pronounced */
          radial-gradient(ellipse 15% 2% at ${floaterX4}% ${floaterY4}%, 
            rgba(0,0,0,0.8) 0%, 
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.4) 70%,
            rgba(0,0,0,0) 100%
          )
        `;
        renderStyles.opacity = i * 0.9; // Increased opacity
        break;
      // Other cases would go here...
      default:
        // For other types, use default styles
        break;
    }

    return renderStyles;
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
    () => getRenderStyles(type, currentIntensity),
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
        }
      }}
    >
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
        {/* Effect Overlay - Applied for all non-color-transform conditions */}
        {!isColorTransformCondition(type) && (
          <Box
            sx={renderStyles}
          />
        )}

        {/* Transformed Image - Only for color transform conditions */}
        {isColorTransformCondition(type) && imageSrc && (
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