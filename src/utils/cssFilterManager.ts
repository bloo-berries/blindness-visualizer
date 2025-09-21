import { VisualEffect } from '../types/visualEffects';
import { getColorVisionMatrix, isColorVisionCondition } from './colorVisionFilters';

// Identity matrix removed as it was unused

/**
 * Generates CSS filter string for color blindness effects using accurate Machado 2009 matrices
 */
const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  // Find the first enabled color vision condition using more efficient approach
  const colorVisionEffect = effects.find(e => isColorVisionCondition(e.id) && e.enabled);
  
  if (!colorVisionEffect) {
    return '';
  }

  // Get the accurate matrix for this condition
  const matrix = getColorVisionMatrix(colorVisionEffect.id, colorVisionEffect.intensity);
  
  // Convert 3x3 matrix to 4x5 CSS matrix format
  // CSS matrix format: matrix(r1, r2, r3, 0, 0, g1, g2, g3, 0, 0, b1, b2, b3, 0, 0, 0, 0, 0, 1, 0)
  const cssMatrix = [
    matrix[0], matrix[1], matrix[2], 0, 0,
    matrix[3], matrix[4], matrix[5], 0, 0,
    matrix[6], matrix[7], matrix[8], 0, 0,
    0, 0, 0, 1, 0
  ];
  
  return `matrix(${cssMatrix.join(', ')})`;
};

/**
 * Generates blur filter for nearsightedness and farsightedness
 */
const generateBlurFilter = (effects: VisualEffect[]): string => {
  // More efficient: check specific IDs directly
  const nearSighted = effects.find(e => e.id === 'nearSighted' && e.enabled);
  const farSighted = effects.find(e => e.id === 'farSighted' && e.enabled);
  const blurEffect = nearSighted || farSighted;
  return blurEffect ? `blur(${blurEffect.intensity * 10}px)` : '';
};

/**
 * Generates CSS filters for Galileo Galilei acute glaucoma effects
 */
const generateGalileoFilters = (effects: VisualEffect[]): string => {
  const galileoEffects = effects.filter(e => 
    e.id.startsWith('galileo') && e.enabled
  );
  
  if (galileoEffects.length === 0) return '';
  
  const filters: string[] = [];
  
  // Check for specific Galileo effects
  const acuteAttack = effects.find(e => e.id === 'galileoAcuteAttackMode' && e.enabled);
  const chronicProgression = effects.find(e => e.id === 'galileoChronicProgression' && e.enabled);
  const severeBlurring = effects.find(e => e.id === 'galileoSevereBlurring' && e.enabled);
  const redEyeEffect = effects.find(e => e.id === 'galileoRedEyeEffect' && e.enabled);
  const cornealHaziness = effects.find(e => e.id === 'galileoCornealHaziness' && e.enabled);
  const extremePhotophobia = effects.find(e => e.id === 'galileoExtremePhotophobia' && e.enabled);
  
  // Acute Attack Mode combines multiple effects
  if (acuteAttack) {
    // Severe blurring
    filters.push(`blur(${acuteAttack.intensity * 8}px)`);
    // Red tint from conjunctival injection
    filters.push(`sepia(${acuteAttack.intensity * 30}%) saturate(${100 + acuteAttack.intensity * 50}%)`);
    // Corneal haziness (brightness and contrast reduction)
    filters.push(`brightness(${100 - acuteAttack.intensity * 20}%) contrast(${100 - acuteAttack.intensity * 40}%)`);
    // Extreme photophobia (brightness increase for bright areas)
    filters.push(`brightness(${100 + acuteAttack.intensity * 30}%)`);
  }
  
  // Individual effects
  if (severeBlurring) {
    filters.push(`blur(${severeBlurring.intensity * 8}px)`);
  }
  
  if (redEyeEffect) {
    filters.push(`sepia(${redEyeEffect.intensity * 30}%) saturate(${100 + redEyeEffect.intensity * 50}%)`);
  }
  
  if (cornealHaziness) {
    filters.push(`brightness(${100 - cornealHaziness.intensity * 20}%) contrast(${100 - cornealHaziness.intensity * 40}%)`);
  }
  
  if (extremePhotophobia) {
    filters.push(`brightness(${100 + extremePhotophobia.intensity * 30}%)`);
  }
  
  // Chronic progression effects (simplified for CSS)
  if (chronicProgression) {
    // Progressive darkening and contrast reduction
    filters.push(`brightness(${100 - chronicProgression.intensity * 30}%) contrast(${100 - chronicProgression.intensity * 50}%)`);
    // Slight blur for vision deterioration
    filters.push(`blur(${chronicProgression.intensity * 2}px)`);
  }
  
  return filters.join(' ');
};

// Diplopia effects are now handled by the getDiplopiaOverlay function in Visualizer.tsx
// This provides true double vision effects using iframe duplication instead of CSS filters

// Note: Glaucoma is now handled by DOM overlays for accurate visual field loss patterns

/**
 * Generates complete CSS filter string for all effects
 */
export const generateCSSFilters = (effects: VisualEffect[], diplopiaSeparation: number = 1.0, diplopiaDirection: number = 0.0): string => {
  return [generateColorBlindnessFilter(effects), generateBlurFilter(effects), generateGalileoFilters(effects)]
    .filter(Boolean)
    .join(' ');
  // Note: Diplopia is handled by separate overlay system, not CSS filters
  // Note: Glaucoma is handled by DOM overlays, not CSS filters
};

/**
 * Generates base styles for media elements
 */
export const generateBaseStyles = (): React.CSSProperties => {
  return {
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
};
