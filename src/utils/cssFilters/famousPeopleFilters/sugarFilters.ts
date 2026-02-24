import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Sugar Ray Leonard's Retinal Detachment
 * Haziness, muted colors, slight contrast loss - the "dirty glass" effect
 */
export const generateSugarFilters = (effects: VisualEffect[]): string => {
  const sugarEffects = effects.filter(e =>
    e.id.startsWith('sugar') && e.enabled
  );

  if (sugarEffects.length === 0) return '';

  const filters: string[] = [];

  const completeDetachment = effects.find(e => e.id === 'sugarRetinalDetachmentComplete' && e.enabled);
  const haziness = effects.find(e => e.id === 'sugarHaziness' && e.enabled);
  const darkCurtain = effects.find(e => e.id === 'sugarDarkCurtain' && e.enabled);

  // Complete retinal detachment - overall haziness like dirty glass
  if (completeDetachment) {
    const i = completeDetachment.intensity;
    // Mild contrast reduction (vitreous clouding)
    filters.push(`contrast(${100 - i * 15}%)`);
    // Slight brightness reduction
    filters.push(`brightness(${100 - i * 8}%)`);
    // Muted colors
    filters.push(`saturate(${100 - i * 20}%)`);
    // Very subtle blur for the haze effect
    filters.push(`blur(${i * 0.5}px)`);
  }

  if (haziness) {
    const i = haziness.intensity;
    filters.push(`contrast(${100 - i * 18}%)`);
    filters.push(`saturate(${100 - i * 15}%)`);
    filters.push(`blur(${i * 0.8}px)`);
  }

  if (darkCurtain) {
    const i = darkCurtain.intensity;
    // Slight overall darkening
    filters.push(`brightness(${100 - i * 10}%)`);
  }

  return filters.join(' ');
};
