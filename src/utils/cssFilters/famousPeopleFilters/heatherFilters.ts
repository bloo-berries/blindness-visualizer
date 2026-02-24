import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Heather Hutchison's Light Perception Only Vision
 *
 * Technical Parameters:
 * 1. Extreme Gaussian blur (80-120px) - destroys all edge, form, detail
 * 2. Near-total desaturation (0-5%) - functional absence of color
 * 3. Severe contrast reduction (10-20%) - shadows/midtones collapse
 * 4. High brightness (180%+) - "washed-out white" perception
 *
 * Note: The white fog overlay is handled by the animated overlay system
 */
export const generateHeatherFilters = (effects: VisualEffect[]): string => {
  const heatherEffects = effects.filter(e =>
    e.id.startsWith('heather') && e.enabled
  );

  if (heatherEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'heatherLightPerceptionComplete' && e.enabled);
  const nearTotalOpacity = effects.find(e => e.id === 'heatherNearTotalOpacity' && e.enabled);
  const diffuseLightBlobs = effects.find(e => e.id === 'heatherDiffuseLightBlobs' && e.enabled);
  const noColor = effects.find(e => e.id === 'heatherNoColor' && e.enabled);

  // Complete Light Perception vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Extreme blur - nothing resolves to form (80-120px range)
    filters.push(`blur(${80 + i * 40}px)`);
    // Strip all color - LP vision doesn't resolve wavelength (0-5% saturation)
    filters.push(`saturate(${5 - i * 5}%)`);
    // Severe contrast reduction (10-20% range)
    filters.push(`contrast(${20 - i * 10}%)`);
    // High brightness - "washed-out white" perception (180%+)
    filters.push(`brightness(${180 + i * 40}%)`);
  }

  // Near-total opacity (standalone)
  if (nearTotalOpacity && !completeVision) {
    const i = nearTotalOpacity.intensity;
    filters.push(`brightness(${180 + i * 30}%)`);
    filters.push(`contrast(${20 - i * 10}%)`);
  }

  // Diffuse light blobs (standalone)
  if (diffuseLightBlobs && !completeVision) {
    const i = diffuseLightBlobs.intensity;
    filters.push(`blur(${80 + i * 40}px)`);
    filters.push(`contrast(${20 - i * 10}%)`);
    filters.push(`brightness(${160 + i * 30}%)`);
  }

  // No color (standalone)
  if (noColor && !completeVision) {
    filters.push('saturate(0%)');
  }

  return filters.join(' ');
};
