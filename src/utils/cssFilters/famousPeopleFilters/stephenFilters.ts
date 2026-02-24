import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Stephen Curry's Keratoconus
 * Directional blur can't be achieved with CSS filters alone, but we handle:
 * - Reduced contrast (light scatter)
 * - Diffuse haze
 * - Desaturated colors ("lacking punch")
 * Main visual effects handled by overlays and animated components
 */
export const generateStephenFilters = (effects: VisualEffect[]): string => {
  const stephenEffects = effects.filter(e =>
    e.id.startsWith('stephen') && e.enabled
  );

  if (stephenEffects.length === 0) return '';

  const filters: string[] = [];

  const completeKeratoconus = effects.find(e => e.id === 'stephenKeratoconusComplete' && e.enabled);
  const comaAberration = effects.find(e => e.id === 'stephenComaAberration' && e.enabled);
  const ghosting = effects.find(e => e.id === 'stephenGhosting' && e.enabled);
  const irregularHalos = effects.find(e => e.id === 'stephenIrregularHalos' && e.enabled);
  const waviness = effects.find(e => e.id === 'stephenWaviness' && e.enabled);
  const reducedContrast = effects.find(e => e.id === 'stephenReducedContrast' && e.enabled);
  const asymmetry = effects.find(e => e.id === 'stephenAsymmetry' && e.enabled);

  // Complete keratoconus - combination of all effects
  if (completeKeratoconus) {
    const i = completeKeratoconus.intensity;
    // Reduced contrast from irregular corneal surface scattering light
    filters.push(`contrast(${100 - i * 25}%)`);
    // Slight brightness increase from light scatter
    filters.push(`brightness(${100 + i * 8}%)`);
    // Colors "lack punch" - desaturated
    filters.push(`saturate(${100 - i * 20}%)`);
    // Very subtle blur for the diffuse haze (main blur in overlays)
    filters.push(`blur(${i * 1.5}px)`);
  }

  if (comaAberration) {
    const i = comaAberration.intensity;
    // Directional smear handled by overlays, but add slight blur
    filters.push(`blur(${i * 1.2}px)`);
    filters.push(`contrast(${100 - i * 15}%)`);
  }

  if (ghosting) {
    const i = ghosting.intensity;
    // Ghosting creates "dirty" visual impression
    filters.push(`contrast(${100 - i * 18}%)`);
    filters.push(`brightness(${100 + i * 5}%)`);
  }

  if (irregularHalos) {
    const i = irregularHalos.intensity;
    // Light bleeding - increased brightness in highlights
    filters.push(`brightness(${100 + i * 12}%)`);
    filters.push(`contrast(${100 - i * 20}%)`);
  }

  if (waviness) {
    const i = waviness.intensity;
    // Waviness creates visual "noise" - slight contrast reduction
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (reducedContrast) {
    const i = reducedContrast.intensity;
    // "Blacks aren't as black, whites aren't as white"
    filters.push(`contrast(${100 - i * 30}%)`);
    // "Faint milky film" - slight brightness increase
    filters.push(`brightness(${100 + i * 10}%)`);
    // Colors lack saturation
    filters.push(`saturate(${100 - i * 25}%)`);
  }

  if (asymmetry) {
    const i = asymmetry.intensity;
    // Asymmetry creates visual dissonance - mild overall degradation
    filters.push(`contrast(${100 - i * 12}%)`);
    filters.push(`blur(${i * 0.8}px)`);
  }

  return filters.join(' ');
};
