import { VisualEffect } from '../../../types/visualEffects';

// Marla Runyan - Stargardt Disease Filters
export const generateMarlaFilters = (effects: VisualEffect[]): string => {
  const marlaEffects = effects.filter(e =>
    e.id.startsWith('marla') && e.enabled
  );

  if (marlaEffects.length === 0) return '';

  const filters: string[] = [];
  // Marla's Stargardt effects are handled entirely by overlays to preserve peripheral clarity
  return filters.join(' ');
};
