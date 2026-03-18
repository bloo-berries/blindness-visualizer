import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Lucy Edwards' incontinentia pigmenti effects
 */
export const lucyFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'lucyCompleteVision',
    filters: i => [
      `blur(${i * 60}px)`,
      `brightness(${100 - i * 70}%) contrast(${100 - i * 80}%)`,
      `saturate(${100 - i * 60}%) sepia(${i * 50}%)`,
      `hue-rotate(${i * 20}deg)`,
    ],
  },
  {
    effectId: 'lucyFrostedGlass',
    filters: i => [
      `blur(${i * 50}px)`,
      `brightness(${100 - i * 60}%) contrast(${100 - i * 75}%)`,
      `saturate(${100 - i * 50}%) sepia(${i * 40}%)`,
    ],
  },
  {
    effectId: 'lucyHeavyBlur',
    filters: i => [
      `blur(${i * 55}px)`,
      `brightness(${100 - i * 50}%) contrast(${100 - i * 70}%)`,
    ],
  },
  {
    effectId: 'lucyDesaturation',
    filters: i => [
      `saturate(${100 - i * 70}%)`,
      `sepia(${i * 45}%) hue-rotate(${i * 15}deg)`,
      `brightness(${100 - i * 30}%)`,
    ],
  },
  {
    effectId: 'lucyLightDiffusion',
    filters: i => [
      `brightness(${100 - i * 40}%)`,
      `contrast(${100 - i * 60}%)`,
      `saturate(${100 - i * 50}%) sepia(${i * 30}%)`,
    ],
  },
  {
    effectId: 'lucyTextureOverlay',
    filters: i => [
      `blur(${i * 30}px)`,
      `brightness(${100 - i * 50}%) contrast(${100 - i * 70}%)`,
      `saturate(${100 - i * 60}%) sepia(${i * 35}%)`,
    ],
  },
];
