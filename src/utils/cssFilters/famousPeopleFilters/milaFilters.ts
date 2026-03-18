import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Mila Kunis' mild iritis and cataracts
 * Her condition is very mild - she can see the vast majority of her environment
 */
export const milaFilterConfigs: CSSFilterEffectConfig[] = [
  {
    // Complete vision - very mild effects, mostly normal vision
    effectId: 'milaCompleteVision',
    filters: i => [
      // Very subtle blur (only 1-3px)
      `blur(${i * 2}px)`,
      // Mild brightness increase for slight light sensitivity
      `brightness(${100 + i * 8}%)`,
      // Slight contrast reduction
      `contrast(${100 - i * 12}%)`,
      // Very subtle desaturation
      `saturate(${100 - i * 10}%)`,
    ],
  },
  {
    effectId: 'milaMildIritis',
    filters: i => [
      // Light sensitivity from iritis
      `brightness(${100 + i * 10}%)`,
      `contrast(${100 - i * 8}%)`,
    ],
  },
  {
    effectId: 'milaMildCataracts',
    filters: i => [
      // Very mild cataract haze
      `blur(${i * 1.5}px)`,
      `contrast(${100 - i * 10}%)`,
      `saturate(${100 - i * 8}%)`,
    ],
  },
  {
    effectId: 'milaLeftEyeOnly',
    filters: i => [
      // Minimal effect - right eye compensates well
      `contrast(${100 - i * 5}%)`,
    ],
  },
];
