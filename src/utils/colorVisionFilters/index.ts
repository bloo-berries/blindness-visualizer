/**
 * Accurate Color Vision Deficiency Simulation
 *
 * This module provides scientifically accurate color vision deficiency simulation
 * using Machado 2009 transformation matrices and proper CSS filter implementations.
 *
 * Desktop: Uses SVG feColorMatrix filters injected into the DOM for pixel-accurate
 * color transformation (Machado 2009 matrices in linearRGB space).
 *
 * Mobile: Uses inline SVG feColorMatrix via the <ColorVisionFilterSVG> component
 * rendered in the same subtree as the filtered element. This avoids the mobile
 * WebKit/Blink issue where body-injected SVG url("#id") references fail after
 * pushState navigation. The inline approach works reliably on iOS Safari 15+.
 *
 * Legacy CSS filter approximations (sepia, hue-rotate, saturate) are retained
 * in getMobileCSSFilter() but no longer used by default — they produced
 * inaccurate monochrome green/yellow tints instead of correct CVD simulation.
 */

import { ConditionType } from '../../types/visualEffects';
import { isMobileBrowser, getMobileCSSFilter } from './mobileDetection';
import { getColorVisionMatrix, blendWithIdentity } from './colorVisionMatrices';
import {
  applyDOMFilter,
  removeDOMFilter,
  getCurrentActiveFilterId,
  setCurrentActiveFilterId,
} from './domSvgManager';

// Re-export everything for backwards compatibility
export { _resetMobileDetection, isMobileBrowser, getMobileCSSFilter } from './mobileDetection';
export { getColorVisionMatrix, blendWithIdentity } from './colorVisionMatrices';
export { cleanupAllDOMFilters } from './domSvgManager';

/**
 * Generates CSS filter for color vision deficiency simulation.
 *
 * Desktop: Injects SVG <filter> elements into the DOM and returns url("#id")
 * references for pixel-accurate Machado 2009 simulation.
 *
 * Mobile: Returns pure CSS filter function approximations (sepia, hue-rotate,
 * saturate, brightness) because SVG url("#id") references do not work on
 * mobile WebKit/Blink regardless of SVG placement or URL format.
 */
export const getColorVisionFilter = (type: ConditionType, intensity: number = 1.0): string => {

  // For achromatopsia, use a simpler approach with saturate and contrast
  // (works on both desktop and mobile — pure CSS)
  if (type === 'monochromatic' || type === 'monochromacy') {
    // At 0% intensity, show normal color vision (no filter)
    if (intensity === 0) {
      return '';
    }
    // Clean up any active DOM filter when switching to monochromacy
    const activeId = getCurrentActiveFilterId();
    if (activeId) {
      removeDOMFilter(activeId);
      setCurrentActiveFilterId(null);
    }
    // Desaturation + reduced contrast + brightness reduction (photophobia) + slight blur (reduced acuity ~20/200)
    const filter = `saturate(${100 - intensity * 100}%) contrast(${100 - intensity * 15}%) brightness(${100 - intensity * 25}%) blur(${intensity * 1.5}px)`;
    return filter;
  }

  // For all other color vision conditions, ensure 0% intensity shows normal vision
  if (intensity === 0) {
    // Clean up any active DOM filter
    const activeId = getCurrentActiveFilterId();
    if (activeId) {
      removeDOMFilter(activeId);
      setCurrentActiveFilterId(null);
    }
    return '';
  }

  // Mobile: use pure CSS filter approximations (SVG url() doesn't work)
  if (isMobileBrowser()) {
    // Clean up any lingering DOM filter
    const activeId = getCurrentActiveFilterId();
    if (activeId) {
      removeDOMFilter(activeId);
      setCurrentActiveFilterId(null);
    }
    const cssFilter = getMobileCSSFilter(type, intensity);
    if (cssFilter) return cssFilter;
    // Fall through to SVG if no CSS approximation (shouldn't happen)
  }

  // Desktop: use SVG feColorMatrix for accurate simulation
  const fullMatrix = getColorVisionMatrix(type, 1.0);
  const blendedMatrix = blendWithIdentity(fullMatrix, intensity);

  return applyDOMFilter(type, blendedMatrix);
};

/**
 * Pure data function: returns filter ID and matrix values for a color vision
 * condition WITHOUT any DOM side effects. Used by React components to render
 * inline SVG filter definitions (required for mobile WebKit compatibility).
 */
export interface ColorVisionFilterData {
  filterId: string;
  matrixValues: string;
}

export const getColorVisionFilterData = (
  type: ConditionType,
  intensity: number = 1.0
): ColorVisionFilterData | null => {
  // Monochromacy uses pure CSS filters, no SVG needed
  if (type === 'monochromatic' || type === 'monochromacy') return null;
  if (intensity === 0) return null;

  const fullMatrix = getColorVisionMatrix(type, 1.0);
  const blended = blendWithIdentity(fullMatrix, intensity);

  const filterId = `cvd-${type}`;
  const matrixValues = [
    blended[0], blended[1], blended[2], 0, 0,
    blended[3], blended[4], blended[5], 0, 0,
    blended[6], blended[7], blended[8], 0, 0,
    0, 0, 0, 1, 0
  ].join(' ');

  return { filterId, matrixValues };
};

/**
 * Checks if a condition is a color vision deficiency type
 */
export const isColorVisionCondition = (type: ConditionType): boolean => {
  return [
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'monochromatic',
    'monochromacy'
  ].includes(type);
};

/**
 * Gets the description for a color vision condition
 */
export const getColorVisionDescription = (type: ConditionType): string => {
  const descriptions: Partial<Record<ConditionType, string>> = {
    protanopia: 'Complete red-blindness due to absence of L-cones. Reds appear dark or black, world perceived in blue-yellow spectrum.',
    deuteranopia: 'Complete green-blindness due to absence of M-cones. Major red-green confusion, colors appear as similar yellows/browns.',
    tritanopia: 'Complete blue-blindness due to absence of S-cones. Blue-green and yellow-pink confusion, extremely rare.',
    protanomaly: 'Partial red-weakness with shifted L-cone sensitivity. Varies from mild to near-protanopic severity.',
    deuteranomaly: 'Partial green-weakness with shifted M-cone sensitivity. Most common form of color vision deficiency.',
    tritanomaly: 'Partial blue-weakness with shifted S-cone sensitivity. Difficulty distinguishing blue-green and yellow-red.',
    monochromatic: 'Complete color blindness (achromatopsia). Pure grayscale vision with severe light sensitivity.',
    monochromacy: 'Complete color blindness (achromatopsia). Pure grayscale vision with severe light sensitivity.'
  };

  return descriptions[type] || 'Color vision deficiency simulation';
};

/**
 * Gets the prevalence information for a color vision condition
 */
export const getColorVisionPrevalence = (type: ConditionType): string => {
  const prevalence: Partial<Record<ConditionType, string>> = {
    protanopia: '1.0-1.3% of males, 0.02% of females',
    deuteranopia: '1-1.2% of males, <0.01% of females',
    tritanopia: '<0.01% of population',
    protanomaly: '1.0-1.3% of males, 0.02% of females',
    deuteranomaly: '6% of males, 0.2% of females',
    tritanomaly: '<0.01% of population',
    monochromatic: '1 in 30,000-50,000 individuals',
    monochromacy: '1 in 30,000-50,000 individuals'
  };

  return prevalence[type] || 'Unknown prevalence';
};
