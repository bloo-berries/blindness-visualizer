import { VisualEffect } from '../../../types/visualEffects';

// Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Filters
export const generateMinkaraFilters = (effects: VisualEffect[]): string => {
  const minkaraEffects = effects.filter(e =>
    e.id.startsWith('minkara') && e.enabled
  );

  if (minkaraEffects.length === 0) return '';

  const filters: string[] = [];

  const endStageComplete = effects.find(e => e.id === 'minkaraEndStageComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'minkaraCentralScotoma' && e.enabled);
  const ringScotoma = effects.find(e => e.id === 'minkaraRingScotoma' && e.enabled);
  const peripheralIslands = effects.find(e => e.id === 'minkaraPeripheralIslands' && e.enabled);
  const photophobia = effects.find(e => e.id === 'minkaraPhotophobia' && e.enabled);
  const achromatopsia = effects.find(e => e.id === 'minkaraAchromatopsia' && e.enabled);
  const nightBlindness = effects.find(e => e.id === 'minkaraNightBlindness' && e.enabled);
  const chemistryMode = effects.find(e => e.id === 'minkaraChemistryMode' && e.enabled);

  if (endStageComplete) {
    filters.push(`contrast(${100 - endStageComplete.intensity * 40}%)`);
    filters.push(`brightness(${100 - endStageComplete.intensity * 30}%)`);
    filters.push(`saturate(0%)`);
    filters.push(`blur(${endStageComplete.intensity * 5}px)`);
  }

  if (centralScotoma) {
    filters.push(`contrast(${100 - centralScotoma.intensity * 50}%)`);
    filters.push(`brightness(${100 - centralScotoma.intensity * 40}%)`);
  }

  if (ringScotoma) {
    filters.push(`contrast(${100 - ringScotoma.intensity * 30}%)`);
    filters.push(`brightness(${100 - ringScotoma.intensity * 20}%)`);
  }

  if (peripheralIslands) {
    filters.push(`contrast(${100 - peripheralIslands.intensity * 60}%)`);
    filters.push(`brightness(${100 - peripheralIslands.intensity * 50}%)`);
  }

  if (photophobia) {
    filters.push(`brightness(${100 + photophobia.intensity * 200}%)`);
    filters.push(`contrast(${100 + photophobia.intensity * 300}%)`);
    filters.push(`blur(${photophobia.intensity * 10}px)`);
  }

  if (achromatopsia) {
    filters.push(`saturate(0%)`);
    filters.push(`contrast(${100 - achromatopsia.intensity * 20}%)`);
  }

  if (nightBlindness) {
    filters.push(`brightness(${100 - nightBlindness.intensity * 80}%)`);
    filters.push(`contrast(${100 - nightBlindness.intensity * 60}%)`);
  }

  if (chemistryMode) {
    filters.push(`contrast(${100 + chemistryMode.intensity * 20}%)`);
    filters.push(`brightness(${100 + chemistryMode.intensity * 10}%)`);
  }

  return filters.join(' ');
};
