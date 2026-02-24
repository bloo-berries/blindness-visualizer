import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Blindspot's Sonar Sense
 * Key visual characteristics:
 * - Monochrome blue-green palette (submarine sonar aesthetic)
 * - No color information - only depth/distance
 * - High contrast for edge detection (hard surfaces reflect strongly)
 * - Slight blur representing sonar resolution limits
 */
export const generateBlindspotFilters = (effects: VisualEffect[]): string => {
  const blindspotEffects = effects.filter(e =>
    e.id.startsWith('blindspot') && e.enabled
  );

  if (blindspotEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'blindspotSonarSenseComplete' && e.enabled);
  const depthMapping = effects.find(e => e.id === 'blindspotDepthMapping' && e.enabled);
  const edgeDetection = effects.find(e => e.id === 'blindspotEdgeDetection' && e.enabled);
  const sonarResolution = effects.find(e => e.id === 'blindspotSonarResolution' && e.enabled);

  // Complete Sonar Sense - monochrome depth-mapped vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Strip color - sonar provides no wavelength information
    filters.push(`saturate(${15 - i * 10}%)`);
    // Shift to blue-green monochrome (submarine sonar look)
    filters.push(`hue-rotate(${160 + i * 20}deg)`);
    // High contrast for edge detection (hard surfaces)
    filters.push(`contrast(${120 + i * 25}%)`);
    // Reduced brightness - sonar world is darker
    filters.push(`brightness(${75 - i * 15}%)`);
    // Slight blur representing resolution limits
    filters.push(`blur(${0.5 + i * 1}px)`);
  }

  // Depth mapping only
  if (depthMapping && !completeVision) {
    const i = depthMapping.intensity;
    filters.push(`saturate(${20 - i * 15}%)`);
    filters.push(`hue-rotate(${170 + i * 15}deg)`);
    filters.push(`brightness(${80 - i * 20}%)`);
  }

  // Edge detection emphasis
  if (edgeDetection && !completeVision) {
    const i = edgeDetection.intensity;
    filters.push(`contrast(${130 + i * 35}%)`);
    filters.push(`brightness(${90 - i * 10}%)`);
  }

  // Sonar resolution limits
  if (sonarResolution && !completeVision) {
    const i = sonarResolution.intensity;
    filters.push(`blur(${0.8 + i * 1.5}px)`);
    filters.push(`contrast(${110 + i * 15}%)`);
  }

  return filters.join(' ');
};
