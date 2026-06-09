import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for custom famous people effects
 */

const completeBlindnessFilters = (): string[] => [
  'brightness(0%)',
];

export const customFamousPeopleFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete blindness effects - all share the same total darkness filter
  {
    effectId: 'helenKellerBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'louisBrailleBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'joshuaMieleBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'rayCharlesBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'andreaBocelliBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'vedMehtaBlindness',
    filters: completeBlindnessFilters,
  },
  {
    effectId: 'mollyBurkeBlindness',
    filters: () => [
      'brightness(5%)',
      'contrast(10%)',
      'blur(12px)',
    ],
  },
  // John Milton - progressive blindness
  {
    effectId: 'johnMiltonBlindness',
    filters: (i) => [
      `brightness(${100 - i * 95}%)`,
      `contrast(${100 - i * 90}%)`,
    ],
  },
  // Stevie Wonder - Retinopathy of Prematurity
  {
    effectId: 'stevieWonderROP',
    filters: (i) => [
      `brightness(${100 - i * 98}%)`,
      `contrast(${100 - i * 95}%)`,
    ],
  },
  // David Paterson - blindness
  {
    effectId: 'davidPatersonBlindness',
    filters: (i) => [
      `blur(${i * 8}px)`,
      `brightness(${100 - i * 70}%)`,
      `contrast(${100 - i * 80}%)`,
    ],
  },
  // Marla Runyan - Stargardt disease
  {
    effectId: 'marlaRunyanStargardt',
    filters: (i) => [
      `saturate(${100 - i * 40}%)`,
    ],
  },
  // Erik Weihenmayer - Retinoschisis
  {
    effectId: 'erikWeihenmayerRetinoschisis',
    filters: (i) => [
      `brightness(${100 - i * 60}%)`,
      `contrast(${100 - i * 70}%)`,
    ],
  },
];
