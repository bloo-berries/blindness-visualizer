import { VisualEffect } from '../../../types/visualEffects';

/**
 * CSS filters for Jose Cid's monocular vision condition
 *
 * Effects:
 * - Slight contrast reduction (monocular viewing reduces contrast sensitivity)
 */
export const generateJoseCidFilters = (effects: VisualEffect[]): string => {
  const filters: string[] = [];

  const joseCidMonocular = effects.find(e => e.id === 'joseCidMonocularVision' && e.enabled);

  if (joseCidMonocular) {
    const intensity = joseCidMonocular.intensity;
    // Slight contrast reduction for monocular vision
    // Monocular viewing reduces contrast sensitivity by approximately 5-10%
    const contrastValue = 1 - (intensity * 0.08);
    filters.push(`contrast(${contrastValue})`);
  }

  return filters.join(' ');
};
