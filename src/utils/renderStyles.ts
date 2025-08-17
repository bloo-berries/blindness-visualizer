import { SxProps, Theme } from '@mui/material';
import { ConditionType } from '../types/visualEffects';

/**
 * Gets the appropriate blend mode based on the condition type for better overlay combination
 * 
 * @param type - The condition type
 * @returns The CSS blend mode
 */
export const getBlendMode = (type: ConditionType): string => {
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

    case 'blindnessLeftEye':
    case 'blindnessRightEye':
    case 'hemianopiaLeft':
    case 'hemianopiaRight':
    case 'bitemporalHemianopia':
    case 'quadrantanopiaRight':
    case 'quadrantanopiaInferior':
    case 'quadrantanopiaSuperior':
    case 'scotoma':
    case 'tunnelVision':
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

/**
 * Gets the layer priority for different condition types
 * 
 * @param type - The condition type
 * @returns The z-index priority value
 */
export const getLayerPriority = (type: ConditionType): number => {
  // Prioritize specific condition types to ensure proper stacking
  // Field loss conditions should be below color/details conditions
  switch (type) {
    case 'blindnessLeftEye':
    case 'blindnessRightEye':
    case 'hemianopiaLeft':
    case 'hemianopiaRight':
    case 'bitemporalHemianopia':
    case 'quadrantanopiaRight':
    case 'quadrantanopiaInferior':
    case 'quadrantanopiaSuperior':
      return 1; // Lowest layer - field loss
    
    case 'scotoma':
    case 'glaucoma':
    case 'amd':
    case 'retinitisPigmentosa':
    case 'stargardt':
    case 'tunnelVision':
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

/**
 * Generates render-safe styles for overlays that work with MUI Box
 * 
 * @param type - The condition type
 * @param intensity - The intensity of the effect (0-1)
 * @param auraPhase - The current phase for animated effects
 * @returns MUI-compatible style object
 */
export const getRenderStyles = (
  type: ConditionType, 
  intensity: number, 
  auraPhase: number = 0
): SxProps<Theme> => {
  // Base styles that are type-safe
  const renderStyles: SxProps<Theme> = {
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
      
    case 'quadrantanopiaRight':
      renderStyles.background = `
        radial-gradient(circle at 0% 100%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${Math.max(25, 40 - i * 20)}%,
          rgba(0,0,0,${0.95 * i}) ${Math.max(45, 60 - i * 20)}%,
          rgba(0,0,0,${0.95 * i}) 100%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'blindnessLeftEye':
      renderStyles.background = `
        linear-gradient(to right, 
          rgba(0,0,0,${0.95 * i}) 0%, 
          rgba(0,0,0,${0.95 * i}) 50%, 
          rgba(0,0,0,0) 50%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'blindnessRightEye':
      renderStyles.background = `
        linear-gradient(to left, 
          rgba(0,0,0,${0.95 * i}) 0%, 
          rgba(0,0,0,${0.95 * i}) 50%, 
          rgba(0,0,0,0) 50%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'bitemporalHemianopia':
      renderStyles.background = `
        linear-gradient(to right, 
          rgba(0,0,0,${0.95 * i}) 0%, 
          rgba(0,0,0,${0.95 * i}) 25%, 
          rgba(0,0,0,0) 25%,
          rgba(0,0,0,0) 75%,
          rgba(0,0,0,${0.95 * i}) 75%, 
          rgba(0,0,0,${0.95 * i}) 100%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'quadrantanopiaInferior':
      renderStyles.background = `
        conic-gradient(from 0deg at 50% 50%, 
          rgba(0,0,0,${0.95 * i}) 0deg, 
          rgba(0,0,0,${0.95 * i}) 90deg, 
          rgba(0,0,0,0) 90deg, 
          rgba(0,0,0,0) 360deg
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'quadrantanopiaSuperior':
      renderStyles.background = `
        conic-gradient(from 0deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 90deg, 
          rgba(0,0,0,${0.95 * i}) 90deg, 
          rgba(0,0,0,${0.95 * i}) 180deg, 
          rgba(0,0,0,0) 180deg, 
          rgba(0,0,0,0) 360deg
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;

    case 'hemianopiaLeft':
      renderStyles.background = `
        linear-gradient(to right, 
          rgba(0,0,0,${0.95 * i}) 0%, 
          rgba(0,0,0,${0.95 * i}) 45%, 
          rgba(0,0,0,0) 50%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'hemianopiaRight':
      renderStyles.background = `
        linear-gradient(to left, 
          rgba(0,0,0,${0.95 * i}) 0%, 
          rgba(0,0,0,${0.95 * i}) 45%, 
          rgba(0,0,0,0) 50%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      break;
      
    case 'scotoma':
      // Create two separate blobs that move sporadically and more slowly
      const offsetX1 = 40 + Math.sin(auraPhase * 0.7) * 15 + Math.sin(auraPhase * 0.4) * 8;
      const offsetY1 = 45 + Math.cos(auraPhase * 0.5) * 12 + Math.cos(auraPhase * 0.8) * 6;
      const xRadius1 = Math.max(8, 16 - i * 6.4) * (1 + 0.3 * Math.sin(auraPhase * 0.3)) * 2.16;
      const yRadius1 = Math.max(12.8, 24 - i * 9.6) * (1 + 0.2 * Math.cos(auraPhase * 0.5)) * 2.16;
      
      const offsetX2 = 60 + Math.sin(auraPhase * 0.2 + 2) * 10 
                         + Math.sin(auraPhase * 0.4) * 8 
                         + Math.sin(auraPhase * 1.2) * 3;
      const offsetY2 = 55 + Math.cos(auraPhase * 0.25 + 1) * 12 
                         + Math.cos(auraPhase * 0.6) * 5
                         + Math.cos(auraPhase * 0.9) * 4;
      const xRadius2 = Math.max(6.4, 12.8 - i * 4.8) * (1 + 0.4 * Math.sin(auraPhase * 0.4)) * 2.16;
      const yRadius2 = Math.max(9.6, 19.2 - i * 8) * (1 + 0.3 * Math.cos(auraPhase * 0.6)) * 2.16;
      
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
      const floaterX1 = 30 + Math.sin(auraPhase * 0.3) * 25 + Math.sin(auraPhase * 0.2) * 10;
      const floaterY1 = 40 + Math.cos(auraPhase * 0.25) * 20;
      const floaterX2 = 65 + Math.sin(auraPhase * 0.2 + 1) * 20;
      const floaterY2 = 50 + Math.cos(auraPhase * 0.3 + 2) * 25;
      const floaterX3 = 50 + Math.sin(auraPhase * 0.4 + 3) * 30;
      const floaterY3 = 25 + Math.cos(auraPhase * 0.35 + 1) * 15;
      const floaterX4 = 45 + Math.sin(auraPhase * 0.15 + 2) * 15;
      const floaterY4 = 70 + Math.cos(auraPhase * 0.2 + 3) * 10;
      
      renderStyles.background = `
        radial-gradient(ellipse 20% 5% at ${floaterX1}% ${floaterY1}%, 
          rgba(0,0,0,0.85) 0%, 
          rgba(0,0,0,0.7) 15%,
          rgba(0,0,0,0.5) 40%,
          rgba(0,0,0,0) 80%
        ),
        radial-gradient(circle 5% at ${floaterX2}% ${floaterY2}%, 
          rgba(0,0,0,0.9) 0%, 
          rgba(0,0,0,0.7) 40%,
          rgba(0,0,0,0.4) 70%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 2.5% at ${floaterX3}% ${floaterY3}%, 
          rgba(0,0,0,0.95) 0%, 
          rgba(0,0,0,0.8) 40%,
          rgba(0,0,0,0.5) 70%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(ellipse 15% 2% at ${floaterX4}% ${floaterY4}%, 
          rgba(0,0,0,0.8) 0%, 
          rgba(0,0,0,0.6) 40%,
          rgba(0,0,0,0.4) 70%,
          rgba(0,0,0,0) 100%
        )
      `;
      renderStyles.opacity = i * 0.9;
      break;
      
    case 'visualSnow':
      // Visual Snow effect based on visionsimulations.com
      const snowIntensity = Math.min(i * 0.8, 0.6);
      const snowPhase = Date.now() * 0.001;
      
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
      
      renderStyles.background = `${noiseLayer1}, ${noiseLayer2}, ${noiseLayer3}`;
      renderStyles.opacity = snowIntensity;
      renderStyles.animation = 'visualSnowAnimation 8s infinite linear';
      break;
      
    case 'tunnelVision':
      // Tunnel Vision effect - progressive loss of peripheral vision
      const tunnelRadius = Math.max(10, 80 - i * 70);
      const tunnelBlur = i * 3;
      
      renderStyles.background = `
        radial-gradient(circle at center, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${tunnelRadius - 5}%,
          rgba(0,0,0,${0.1 * i}) ${tunnelRadius}%,
          rgba(0,0,0,${0.3 * i}) ${tunnelRadius + 5}%,
          rgba(0,0,0,${0.6 * i}) ${tunnelRadius + 10}%,
          rgba(0,0,0,${0.8 * i}) ${tunnelRadius + 15}%,
          rgba(0,0,0,${0.95 * i}) ${tunnelRadius + 20}%,
          rgba(0,0,0,${0.95 * i}) 100%
        )
      `;
      renderStyles.opacity = Math.min(0.95, i);
      renderStyles.filter = `blur(${tunnelBlur}px)`;
      break;
      
    default:
      // For other types, use default styles
      break;
  }

  return renderStyles;
};
