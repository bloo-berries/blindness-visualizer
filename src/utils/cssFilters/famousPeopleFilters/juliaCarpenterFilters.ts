import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Julia Carpenter's Psychic Web Vision
 *
 * Technical Parameters:
 * 1. Desaturation (10-20%) — strips natural color
 * 2. Moderate dimming (60-75% brightness) — overlay provides the void
 * 3. Slight contrast boost (120-140%) — web strands pop
 * 4. Red hue shift (340deg) — crimson/magenta tones
 * 5. Light sepia (10-20%) — warm red-black undertone
 */
export const generateJuliaCarpenterFilters = (effects: VisualEffect[]): string => {
  const juliaEffect = effects.find(
    e => e.id === 'juliaCarpenterPsychicWebComplete' && e.enabled
  );

  if (!juliaEffect) return '';

  const i = juliaEffect.intensity;
  const filters: string[] = [];

  // Desaturation — strips natural color for psychic overlay
  filters.push(`saturate(${20 - i * 10}%)`);
  // Moderate dimming — overlay provides the dark void
  filters.push(`brightness(${75 - i * 15}%)`);
  // Slight contrast boost — web strands pop
  filters.push(`contrast(${120 + i * 20}%)`);
  // Red hue shift — crimson/magenta tones
  filters.push(`hue-rotate(340deg)`);
  // Light sepia — warm red-black undertone
  filters.push(`sepia(${10 + i * 10}%)`);

  return filters.join(' ');
};
