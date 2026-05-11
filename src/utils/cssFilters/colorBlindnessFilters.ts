import { VisualEffect } from '../../types/visualEffects';
import { isColorVisionCondition, getColorVisionFilter } from '../colorVisionFilters';
import { getFirstEnabledEffect } from '../effectLookup';

/**
 * Generates CSS filter for color blindness effects with intensity scaling.
 *
 * Delegates to getColorVisionFilter() which handles mobile/desktop branching:
 * - Desktop: SVG feColorMatrix via DOM injection for accurate Machado 2009 simulation
 * - Mobile: Calibrated CSS filter approximations (saturate, sepia, hue-rotate, contrast)
 * - Monochromacy: Pure CSS saturate()/contrast() on all platforms
 */
export const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  const colorVisionEffect = getFirstEnabledEffect(effects, e => isColorVisionCondition(e.id));

  if (!colorVisionEffect) {
    return '';
  }

  return getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
};
