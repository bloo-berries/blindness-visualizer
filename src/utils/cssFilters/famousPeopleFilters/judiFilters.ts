import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Dame Judi Dench's AMD
 * Central vision loss but peripheral preserved - minimal global filters
 * "I can see your outline" - shapes visible, details lost
 */
export const generateJudiFilters = (effects: VisualEffect[]): string => {
  const judiEffects = effects.filter(e =>
    e.id.startsWith('judi') && e.enabled
  );

  if (judiEffects.length === 0) return '';

  const filters: string[] = [];

  const completeAMD = effects.find(e => e.id === 'judiAMDComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'judiCentralScotoma' && e.enabled);
  const faceLoss = effects.find(e => e.id === 'judiFaceBlindness' && e.enabled);
  const readingLoss = effects.find(e => e.id === 'judiReadingLoss' && e.enabled);

  // Complete AMD - minimal global filters, main effect is overlay-based central scotoma
  if (completeAMD) {
    const i = completeAMD.intensity;
    // Very slight overall contrast reduction (peripheral still functional)
    filters.push(`contrast(${100 - i * 8}%)`);
    // Minimal brightness adjustment
    filters.push(`brightness(${100 - i * 5}%)`);
    // Slight saturation loss in central area (handled by overlay)
    filters.push(`saturate(${100 - i * 12}%)`);
  }

  if (centralScotoma) {
    const i = centralScotoma.intensity;
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (faceLoss) {
    const i = faceLoss.intensity;
    // Face recognition requires central vision detail
    filters.push(`contrast(${100 - i * 8}%)`);
  }

  if (readingLoss) {
    const i = readingLoss.intensity;
    filters.push(`contrast(${100 - i * 6}%)`);
  }

  return filters.join(' ');
};
