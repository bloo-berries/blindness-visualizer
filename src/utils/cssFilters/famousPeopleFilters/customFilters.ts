import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for custom famous people effects
 */
export const generateCustomFamousPeopleFilters = (effects: VisualEffect[]): string => {
  const customEffects = effects.filter(e =>
    (e.id === 'helenKellerBlindness' ||
     e.id === 'johnMiltonBlindness' ||
     e.id === 'louisBrailleBlindness' ||
     e.id === 'erikWeihenmayerRetinoschisis' ||
     e.id === 'marlaRunyanStargardt' ||
     e.id === 'joshuaMieleBlindness' ||
     e.id === 'davidPatersonBlindness' ||
     e.id === 'rayCharlesBlindness' ||
     e.id === 'stevieWonderROP' ||
     e.id === 'andreaBocelliBlindness' ||
     e.id === 'vedMehtaBlindness') && e.enabled
  );

  if (customEffects.length === 0) return '';

  const filters: string[] = [];

  const completeBlindnessEffects = customEffects.filter(e =>
    e.id === 'helenKellerBlindness' ||
    e.id === 'louisBrailleBlindness' ||
    e.id === 'joshuaMieleBlindness' ||
    e.id === 'rayCharlesBlindness' ||
    e.id === 'andreaBocelliBlindness' ||
    e.id === 'vedMehtaBlindness'
  );

  if (completeBlindnessEffects.length > 0) {
    filters.push(`brightness(0%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
    filters.push(`hue-rotate(0deg)`);
    filters.push(`sepia(100%)`);
  }

  const johnMiltonEffect = customEffects.find(e => e.id === 'johnMiltonBlindness');
  if (johnMiltonEffect) {
    filters.push(`brightness(${100 - johnMiltonEffect.intensity * 95}%)`);
    filters.push(`contrast(${100 - johnMiltonEffect.intensity * 90}%)`);
  }

  const stevieWonderEffect = customEffects.find(e => e.id === 'stevieWonderROP');
  if (stevieWonderEffect) {
    filters.push(`brightness(${100 - stevieWonderEffect.intensity * 98}%)`);
    filters.push(`contrast(${100 - stevieWonderEffect.intensity * 95}%)`);
  }

  const davidPatersonEffect = customEffects.find(e => e.id === 'davidPatersonBlindness');
  if (davidPatersonEffect) {
    filters.push(`blur(${davidPatersonEffect.intensity * 8}px)`);
    filters.push(`brightness(${100 - davidPatersonEffect.intensity * 70}%)`);
    filters.push(`contrast(${100 - davidPatersonEffect.intensity * 80}%)`);
  }

  const marlaRunyanEffect = customEffects.find(e => e.id === 'marlaRunyanStargardt');
  if (marlaRunyanEffect) {
    const intensity = marlaRunyanEffect.intensity;
    filters.push(`saturate(${100 - intensity * 40}%)`);
  }

  const erikWeihenmayerEffect = customEffects.find(e => e.id === 'erikWeihenmayerRetinoschisis');
  if (erikWeihenmayerEffect) {
    filters.push(`brightness(${100 - erikWeihenmayerEffect.intensity * 60}%)`);
    filters.push(`contrast(${100 - erikWeihenmayerEffect.intensity * 70}%)`);
  }

  return filters.join(' ');
};
