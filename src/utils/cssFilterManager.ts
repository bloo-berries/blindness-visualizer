import { VisualEffect } from '../types/visualEffects';
import { getColorVisionMatrix, isColorVisionCondition } from './colorVisionFilters';

// Identity matrix removed as it was unused

/**
 * Generates CSS filter string for color blindness effects using accurate Machado 2009 matrices
 */
const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  // Find the first enabled color vision condition
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
 * Generates blur filter for nearsightedness
 */
const generateBlurFilter = (effects: VisualEffect[]): string => {
  const nearSighted = effects.find(e => e.id === 'nearSighted');
  if (nearSighted?.enabled) {
    const blurAmount = nearSighted.intensity * 10; // Scale blur from 0-10px
    return `blur(${blurAmount}px)`;
  }
  return '';
};

// Note: Glaucoma is now handled by DOM overlays for accurate visual field loss patterns

/**
 * Generates complete CSS filter string for all effects
 */
export const generateCSSFilters = (effects: VisualEffect[]): string => {
  const filters: string[] = [];

  // Add color blindness filter
  const colorFilter = generateColorBlindnessFilter(effects);
  if (colorFilter) {
    filters.push(colorFilter);
  }

  // Add blur filter
  const blurFilter = generateBlurFilter(effects);
  if (blurFilter) {
    filters.push(blurFilter);
  }

  // Note: Glaucoma is handled by DOM overlays, not CSS filters

  return filters.join(' ');
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
