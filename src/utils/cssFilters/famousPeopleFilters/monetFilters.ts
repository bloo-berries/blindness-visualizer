import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Claude Monet's cataracts effects
 */
export const generateMonetFilters = (effects: VisualEffect[]): string => {
  const monetEffects = effects.filter(e =>
    e.id.startsWith('monet') && e.enabled
  );

  if (monetEffects.length === 0) return '';

  const filters: string[] = [];

  const cataractsProgression = effects.find(e => e.id === 'monetCataractsProgression' && e.enabled);
  const cataractsFog = effects.find(e => e.id === 'monetCataractsFog' && e.enabled);
  const colorDistortion = effects.find(e => e.id === 'monetColorDistortion' && e.enabled);
  const progressiveLoss = effects.find(e => e.id === 'monetProgressiveLoss' && e.enabled);

  if (cataractsProgression) {
    filters.push(`contrast(${100 - cataractsProgression.intensity * 75}%)`);
    filters.push(`brightness(${100 - cataractsProgression.intensity * 35}%)`);
    filters.push(`sepia(${cataractsProgression.intensity * 50}%) saturate(${100 + cataractsProgression.intensity * 70}%)`);
    filters.push(`hue-rotate(${cataractsProgression.intensity * 25}deg)`);
    filters.push(`blur(${cataractsProgression.intensity * 5}px)`);
  }

  if (cataractsFog) {
    filters.push(`contrast(${100 - cataractsFog.intensity * 80}%)`);
    filters.push(`brightness(${100 - cataractsFog.intensity * 30}%)`);
    filters.push(`blur(${cataractsFog.intensity * 4}px)`);
  }

  if (colorDistortion) {
    filters.push(`sepia(${colorDistortion.intensity * 55}%)`);
    filters.push(`saturate(${100 + colorDistortion.intensity * 80}%)`);
    filters.push(`hue-rotate(${colorDistortion.intensity * 30}deg)`);
    filters.push(`contrast(${100 - colorDistortion.intensity * 35}%)`);
  }

  if (progressiveLoss) {
    filters.push(`blur(${progressiveLoss.intensity * 4}px)`);
    filters.push(`contrast(${100 - progressiveLoss.intensity * 60}%)`);
    filters.push(`brightness(${100 - progressiveLoss.intensity * 30}%)`);
  }

  return filters.join(' ');
};
