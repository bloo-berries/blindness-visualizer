import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Fujitora's Observation Haki Vision
 *
 * Technical Parameters:
 * 1. Desaturation (10-20%) — muted physical world
 * 2. Moderate dimming (60-75% brightness) — overlay provides the void
 * 3. Purple tint via hue-rotate (~270deg) — Haki energy color
 * 4. Slight contrast boost (120-140%) — sharper edges
 */
export const generateFujitoraFilters = (effects: VisualEffect[]): string => {
  const fujitoraEffect = effects.find(
    e => e.id === 'fujitoraObservationHakiComplete' && e.enabled
  );

  if (!fujitoraEffect) return '';

  const i = fujitoraEffect.intensity;
  const filters: string[] = [];

  // Desaturation — muted physical world beneath overlay
  filters.push(`saturate(${20 - i * 10}%)`);
  // Moderate dimming — overlay provides the dark void
  filters.push(`brightness(${75 - i * 15}%)`);
  // Purple/indigo tint — Haki energy color
  filters.push(`hue-rotate(270deg)`);
  // Slight contrast boost
  filters.push(`contrast(${120 + i * 20}%)`);

  return filters.join(' ');
};
