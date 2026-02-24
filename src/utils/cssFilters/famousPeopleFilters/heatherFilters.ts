import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Heather Hutchison's Light Perception Only Vision
 * Key visual characteristics:
 * - Extreme Gaussian blur (80-120px+) - nothing resolves to form
 * - No color - saturation stripped to near-zero
 * - Very low contrast - only brightness variation
 * - Near-total opacity handled by animated overlay
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
    // Strip all color - LP vision doesn't resolve wavelength
    filters.push('saturate(0%)');
    // Very low contrast - only brightness variation matters
    filters.push(`contrast(${20 - i * 15}%)`);
    // Reduced brightness overall
    filters.push(`brightness(${30 - i * 15}%)`);
  }

  // Near-total opacity (standalone)
  if (nearTotalOpacity && !completeVision) {
    const i = nearTotalOpacity.intensity;
    filters.push(`brightness(${25 - i * 20}%)`);
    filters.push(`contrast(${15 - i * 10}%)`);
  }

  // Diffuse light blobs (standalone)
  if (diffuseLightBlobs && !completeVision) {
    const i = diffuseLightBlobs.intensity;
    filters.push(`blur(${80 + i * 40}px)`);
    filters.push(`contrast(${25 - i * 15}%)`);
  }

  // No color (standalone)
  if (noColor && !completeVision) {
    filters.push('saturate(0%)');
  }

  return filters.join(' ');
};
