import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Claude Monet's cataracts effects
 */
export const monetFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'monetCataractsProgression',
    filters: i => [
      `contrast(${100 - i * 75}%)`,
      `brightness(${100 - i * 35}%)`,
      `sepia(${i * 50}%) saturate(${100 + i * 70}%)`,
      `hue-rotate(${i * 25}deg)`,
      `blur(${i * 5}px)`,
    ],
  },
  {
    effectId: 'monetCataractsFog',
    filters: i => [
      `contrast(${100 - i * 80}%)`,
      `brightness(${100 - i * 30}%)`,
      `blur(${i * 4}px)`,
    ],
  },
  {
    effectId: 'monetColorDistortion',
    filters: i => [
      `sepia(${i * 55}%)`,
      `saturate(${100 + i * 80}%)`,
      `hue-rotate(${i * 30}deg)`,
      `contrast(${100 - i * 35}%)`,
    ],
  },
  {
    effectId: 'monetProgressiveLoss',
    filters: i => [
      `blur(${i * 4}px)`,
      `contrast(${100 - i * 60}%)`,
      `brightness(${100 - i * 30}%)`,
    ],
  },
];
