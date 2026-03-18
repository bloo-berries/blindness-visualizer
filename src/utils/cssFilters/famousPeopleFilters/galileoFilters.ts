import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Galileo Galilei's acute glaucoma effects
 */
export const galileoFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'galileoAcuteAttackMode',
    filters: i => [
      `blur(${i * 8}px)`,
      `sepia(${i * 30}%) saturate(${100 + i * 50}%)`,
      `brightness(${100 - i * 20}%) contrast(${100 - i * 40}%)`,
      `brightness(${100 + i * 30}%)`,
    ],
  },
  {
    effectId: 'galileoSevereBlurring',
    filters: i => [
      `blur(${i * 8}px)`,
    ],
  },
  {
    effectId: 'galileoRedEyeEffect',
    filters: i => [
      `sepia(${i * 30}%) saturate(${100 + i * 50}%)`,
    ],
  },
  {
    effectId: 'galileoCornealHaziness',
    filters: i => [
      `brightness(${100 - i * 20}%) contrast(${100 - i * 40}%)`,
    ],
  },
  {
    effectId: 'galileoExtremePhotophobia',
    filters: i => [
      `brightness(${100 + i * 30}%)`,
    ],
  },
  {
    effectId: 'galileoChronicProgression',
    filters: i => [
      `brightness(${100 - i * 30}%) contrast(${100 - i * 50}%)`,
      `blur(${i * 2}px)`,
    ],
  },
];
