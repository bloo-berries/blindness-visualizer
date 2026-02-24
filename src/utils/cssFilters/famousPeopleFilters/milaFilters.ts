import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Mila Kunis' mild iritis and cataracts
 * Her condition is very mild - she can see the vast majority of her environment
 */
export const generateMilaFilters = (effects: VisualEffect[]): string => {
  const milaEffects = effects.filter(e =>
    e.id.startsWith('mila') && e.enabled
  );

  if (milaEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'milaCompleteVision' && e.enabled);
  const mildIritis = effects.find(e => e.id === 'milaMildIritis' && e.enabled);
  const mildCataracts = effects.find(e => e.id === 'milaMildCataracts' && e.enabled);
  const leftEyeOnly = effects.find(e => e.id === 'milaLeftEyeOnly' && e.enabled);

  // Complete vision - very mild effects, mostly normal vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Very subtle blur (only 1-3px)
    filters.push(`blur(${i * 2}px)`);
    // Mild brightness increase for slight light sensitivity
    filters.push(`brightness(${100 + i * 8}%)`);
    // Slight contrast reduction
    filters.push(`contrast(${100 - i * 12}%)`);
    // Very subtle desaturation
    filters.push(`saturate(${100 - i * 10}%)`);
  }

  if (mildIritis) {
    const i = mildIritis.intensity;
    // Light sensitivity from iritis
    filters.push(`brightness(${100 + i * 10}%)`);
    filters.push(`contrast(${100 - i * 8}%)`);
  }

  if (mildCataracts) {
    const i = mildCataracts.intensity;
    // Very mild cataract haze
    filters.push(`blur(${i * 1.5}px)`);
    filters.push(`contrast(${100 - i * 10}%)`);
    filters.push(`saturate(${100 - i * 8}%)`);
  }

  if (leftEyeOnly) {
    // Minimal effect - right eye compensates well
    const i = leftEyeOnly.intensity;
    filters.push(`contrast(${100 - i * 5}%)`);
  }

  return filters.join(' ');
};
