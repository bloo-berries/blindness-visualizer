import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Chirrut Îmwe's Force Perception
 *
 * Technical Parameters:
 * 1. Strong desaturation (8-15%) — muted, meditative palette
 * 2. Moderate darkness (45-60% brightness) — dim but not black
 * 3. Blue-cyan hue shift (190deg) — Force energy color
 * 4. Slight blur (2-4px) — soft, diffused awareness
 */
export const generateChirrutFilters = (effects: VisualEffect[]): string => {
  const chirrutEffect = effects.find(
    e => e.id === 'chirrutForcePerceptionComplete' && e.enabled
  );

  if (!chirrutEffect) return '';

  const i = chirrutEffect.intensity;
  const filters: string[] = [];

  // Strong desaturation — muted, meditative feel
  filters.push(`saturate(${15 - i * 7}%)`);
  // Moderate darkness — dim but not black
  filters.push(`brightness(${60 - i * 15}%)`);
  // Blue-cyan hue shift — Force energy wash
  filters.push(`hue-rotate(190deg)`);
  // Slight blur — soft awareness, not sharp vision
  filters.push(`blur(${2 + i * 2}px)`);

  return filters.join(' ');
};
