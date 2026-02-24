import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Leonhard Euler's Asymmetric Vision Loss
 * Key visual characteristics:
 * - Right eye: Complete black (dead from infection ~1738) - handled by overlay
 * - Left eye: Progressive cataract - milky blur, reduced contrast, desaturation, glare
 * - Uniform diffuse fog (not scotomas or field cuts)
 * - Glare sensitivity with halo artifacts
 * - End state: Milky white opacity (not sharp black like retinal damage)
 */
export const generateEulerFilters = (effects: VisualEffect[]): string => {
  const eulerEffects = effects.filter(e =>
    e.id.startsWith('euler') && e.enabled
  );

  if (eulerEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'eulerComplete' && e.enabled);
  const midProgression = effects.find(e => e.id === 'eulerMidProgression' && e.enabled);
  const lateProgression = effects.find(e => e.id === 'eulerLateProgression' && e.enabled);
  const leftEyeCataract = effects.find(e => e.id === 'eulerLeftEyeCataract' && e.enabled);
  const cataractGlare = effects.find(e => e.id === 'eulerCataractGlare' && e.enabled);

  // Complete simulation (mid-to-late progression)
  // CSS filters affect the entire view - cataract effects for left eye
  // Right eye blackout handled by overlay
  if (completeVision) {
    const i = completeVision.intensity;
    // Milky/foggy blur - looking through frosted glass
    filters.push(`blur(${8 + i * 12}px)`);
    // Washed-out contrast
    filters.push(`contrast(${70 - i * 25}%)`);
    // Elevated brightness from milky cataract (white fog, not darkness)
    filters.push(`brightness(${100 + i * 20}%)`);
    // Color desaturation
    filters.push(`saturate(${60 - i * 25}%)`);
    // Slight sepia for warm milky quality
    filters.push(`sepia(${i * 15}%)`);
  }

  // Mid progression - moderate cataract
  if (midProgression && !completeVision) {
    const i = midProgression.intensity;
    filters.push(`blur(${5 + i * 8}px)`);
    filters.push(`contrast(${80 - i * 20}%)`);
    filters.push(`brightness(${100 + i * 15}%)`);
    filters.push(`saturate(${70 - i * 20}%)`);
    filters.push(`sepia(${i * 10}%)`);
  }

  // Late progression - severe cataract, near-opaque
  if (lateProgression && !completeVision) {
    const i = lateProgression.intensity;
    // Dense milky white fog
    filters.push(`blur(${15 + i * 20}px)`);
    filters.push(`contrast(${50 - i * 35}%)`);
    // High brightness - milky white, not black
    filters.push(`brightness(${110 + i * 40}%)`);
    filters.push(`saturate(${40 - i * 30}%)`);
    filters.push(`sepia(${i * 20}%)`);
  }

  // Individual left eye cataract
  if (leftEyeCataract && !completeVision && !midProgression && !lateProgression) {
    const i = leftEyeCataract.intensity;
    filters.push(`blur(${6 + i * 10}px)`);
    filters.push(`contrast(${75 - i * 25}%)`);
    filters.push(`brightness(${105 + i * 15}%)`);
    filters.push(`saturate(${65 - i * 25}%)`);
  }

  // Glare sensitivity
  if (cataractGlare && !completeVision && !midProgression && !lateProgression) {
    const i = cataractGlare.intensity;
    // Bright areas bloom outward
    filters.push(`brightness(${110 + i * 30}%)`);
    filters.push(`contrast(${85 - i * 30}%)`);
    filters.push(`blur(${i * 3}px)`);
  }

  return filters.join(' ');
};
