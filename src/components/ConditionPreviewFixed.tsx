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
            rgba(0,0,0,${0.9 * i * 1.4}) ${Math.max(0, 15 - i * 14)}%, 
            rgba(0,0,0,${0.7 * i * 1.4}) ${Math.max(25, 40 - i * 21)}%,
            rgba(0,0,0,0) 84%
          )
        `;
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
    [type, currentIntensity, isDynamicCondition ? Date.now() : null]
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
        {/* Image and overlay are both absolutely positioned and clipped to this container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: 1,
          }}
        >
          {/* Base image always rendered */}
          <Box
            component="img"
            src={REFERENCE_IMAGE}
            alt="Base reference image"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1,
              zIndex: 1,
            }}
          />
          {/* Effect Overlay - Applied for all non-color-transform conditions */}
          {!isColorTransformCondition(type) && (
            <Box
              sx={{
                ...renderStyles,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: 1,
                zIndex: 2,
              }}
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
                borderRadius: 1,
                zIndex: 2,
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ConditionPreview; 