import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Galileo Galilei acute glaucoma effects
 */
export const generateGalileoFilters = (effects: VisualEffect[]): string => {
  const galileoEffects = effects.filter(e =>
    e.id.startsWith('galileo') && e.enabled
  );

  if (galileoEffects.length === 0) return '';

  const filters: string[] = [];

  const acuteAttack = effects.find(e => e.id === 'galileoAcuteAttackMode' && e.enabled);
  const chronicProgression = effects.find(e => e.id === 'galileoChronicProgression' && e.enabled);
  const severeBlurring = effects.find(e => e.id === 'galileoSevereBlurring' && e.enabled);
  const redEyeEffect = effects.find(e => e.id === 'galileoRedEyeEffect' && e.enabled);
  const cornealHaziness = effects.find(e => e.id === 'galileoCornealHaziness' && e.enabled);
  const extremePhotophobia = effects.find(e => e.id === 'galileoExtremePhotophobia' && e.enabled);

  if (acuteAttack) {
    filters.push(`blur(${acuteAttack.intensity * 8}px)`);
    filters.push(`sepia(${acuteAttack.intensity * 30}%) saturate(${100 + acuteAttack.intensity * 50}%)`);
    filters.push(`brightness(${100 - acuteAttack.intensity * 20}%) contrast(${100 - acuteAttack.intensity * 40}%)`);
    filters.push(`brightness(${100 + acuteAttack.intensity * 30}%)`);
  }

  if (severeBlurring) {
    filters.push(`blur(${severeBlurring.intensity * 8}px)`);
  }

  if (redEyeEffect) {
    filters.push(`sepia(${redEyeEffect.intensity * 30}%) saturate(${100 + redEyeEffect.intensity * 50}%)`);
  }

  if (cornealHaziness) {
    filters.push(`brightness(${100 - cornealHaziness.intensity * 20}%) contrast(${100 - cornealHaziness.intensity * 40}%)`);
  }

  if (extremePhotophobia) {
    filters.push(`brightness(${100 + extremePhotophobia.intensity * 30}%)`);
  }

  if (chronicProgression) {
    filters.push(`brightness(${100 - chronicProgression.intensity * 30}%) contrast(${100 - chronicProgression.intensity * 50}%)`);
    filters.push(`blur(${chronicProgression.intensity * 2}px)`);
  }

  return filters.join(' ');
};
