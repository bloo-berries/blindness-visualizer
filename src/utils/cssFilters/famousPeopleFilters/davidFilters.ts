import { VisualEffect } from '../../../types/visualEffects';

// David Paterson - Hemispheric Vision Loss Filters
export const generateDavidFilters = (effects: VisualEffect[]): string => {
  const davidEffects = effects.filter(e =>
    e.id.startsWith('david') && e.enabled
  );

  if (davidEffects.length === 0) return '';

  const filters: string[] = [];
  // David's hemispheric effects are handled entirely by overlays
  return filters.join(' ');
};
