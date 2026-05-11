import { VisualEffect } from '../../types/visualEffects';
import { isColorVisionCondition, getColorVisionFilter, getColorVisionFilterData, isMobileBrowser } from '../colorVisionFilters';
import { getFirstEnabledEffect } from '../effectLookup';

/**
 * Generates CSS filter for color blindness effects with intensity scaling.
 *
 * Uses inline SVG feColorMatrix references (url("#cvd-xxx")) for accurate
 * Machado 2009 simulation on both desktop and mobile. Requires the companion
 * <ColorVisionFilterSVG> component to be rendered in the same subtree.
 *
 * Monochromacy uses pure CSS saturate()/contrast() which works everywhere.
 */
export const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  // Find the first enabled color vision condition using optimized lookup
  const colorVisionEffect = getFirstEnabledEffect(effects, e => isColorVisionCondition(e.id));

  if (!colorVisionEffect) {
    return '';
  }

  // Use inline SVG reference for accurate simulation on all platforms.
  // The inline <ColorVisionFilterSVG> component renders the <filter> definition.
  const filterData = getColorVisionFilterData(colorVisionEffect.id, colorVisionEffect.intensity);
  if (filterData) {
    // On desktop, also inject into document.body as backup
    if (!isMobileBrowser()) {
      getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
    }
    return `url("#${filterData.filterId}")`;
  }

  // Monochromacy or zero intensity — pure CSS filter string
  return getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
};
