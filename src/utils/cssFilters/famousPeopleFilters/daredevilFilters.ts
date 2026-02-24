import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Daredevil's Radar Sense
 * Key visual characteristics:
 * - Transparent red tint over the scene (like the comics)
 * - Scene remains visible through the red filter
 * - Subtle desaturation to emphasize the red overlay
 * - Main red effect comes from the animated overlay using multiply blend
 */
export const generateDaredevilFilters = (effects: VisualEffect[]): string => {
  const daredevilEffects = effects.filter(e =>
    e.id.startsWith('daredevil') && e.enabled
  );

  if (daredevilEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'daredevilRadarSenseComplete' && e.enabled);
  const redMonochrome = effects.find(e => e.id === 'daredevilRedMonochrome' && e.enabled);

  // Complete Radar Sense - subtle filter to complement the overlay
  if (completeVision) {
    const i = completeVision.intensity;
    // Slight desaturation to let the red overlay dominate
    filters.push(`saturate(${70 - i * 20}%)`);
    // Subtle contrast boost
    filters.push(`contrast(${105 + i * 10}%)`);
    // Slight brightness adjustment
    filters.push(`brightness(${95 + i * 5}%)`);
    // Slight blur for the "radar sense" softness
    filters.push(`blur(${1 + i * 1.5}px)`);
  }

  // Red monochrome only (stronger effect)
  if (redMonochrome && !completeVision) {
    const i = redMonochrome.intensity;
    filters.push(`saturate(${60 - i * 30}%)`);
    filters.push(`contrast(${110 + i * 15}%)`);
  }

  return filters.join(' ');
};
