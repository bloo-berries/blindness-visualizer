import { VisualEffect } from '../../../types/visualEffects';

// Joshua Miele - Chemical Burn Complete Blindness Filters
export const generateJoshuaFilters = (effects: VisualEffect[]): string => {
  const joshuaEffects = effects.filter(e =>
    e.id.startsWith('joshua') && e.enabled
  );

  if (joshuaEffects.length === 0) return '';

  const filters: string[] = [];

  const completeBlindness = effects.find(e => e.id === 'joshuaCompleteBlindness' && e.enabled);
  const echolocation = effects.find(e => e.id === 'joshuaEcholocation' && e.enabled);
  const tactileMaps = effects.find(e => e.id === 'joshuaTactileMaps' && e.enabled);
  const audioLandscape = effects.find(e => e.id === 'joshuaAudioLandscape' && e.enabled);
  const accessibilityMode = effects.find(e => e.id === 'joshuaAccessibilityMode' && e.enabled);
  const sonification = effects.find(e => e.id === 'joshuaSonification' && e.enabled);

  if (completeBlindness) {
    filters.push(`brightness(0%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  if (echolocation) {
    filters.push(`contrast(${100 + echolocation.intensity * 50}%)`);
    filters.push(`brightness(${100 + echolocation.intensity * 20}%)`);
  }

  if (tactileMaps) {
    filters.push(`contrast(${100 + tactileMaps.intensity * 30}%)`);
    filters.push(`brightness(${100 + tactileMaps.intensity * 15}%)`);
  }

  if (audioLandscape) {
    filters.push(`contrast(${100 + audioLandscape.intensity * 25}%)`);
    filters.push(`brightness(${100 + audioLandscape.intensity * 10}%)`);
  }

  if (accessibilityMode) {
    filters.push(`contrast(${100 + accessibilityMode.intensity * 40}%)`);
    filters.push(`brightness(${100 + accessibilityMode.intensity * 20}%)`);
  }

  if (sonification) {
    filters.push(`contrast(${100 + sonification.intensity * 35}%)`);
    filters.push(`brightness(${100 + sonification.intensity * 15}%)`);
  }

  return filters.join(' ');
};
