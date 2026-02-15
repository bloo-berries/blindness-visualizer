import { VisualEffect } from '../../types/visualEffects';
import { isColorVisionCondition, getColorVisionFilter } from '../colorVisionFilters';
import { getFirstEnabledEffect } from '../effectLookup';

/**
 * Generates CSS matrix filter for color blindness effects with intensity scaling
 * This replaces the static SVG filters to allow intensity-based severity adjustment
 */
export const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  // Find the first enabled color vision condition using optimized lookup
  const colorVisionEffect = getFirstEnabledEffect(effects, e => isColorVisionCondition(e.id));

  if (!colorVisionEffect) {
    return '';
  }

  // Use CSS matrix filters with intensity scaling instead of static SVG filters
  return getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
};
