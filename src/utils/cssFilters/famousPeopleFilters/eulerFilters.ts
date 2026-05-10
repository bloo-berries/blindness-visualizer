import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Leonhard Euler's Asymmetric Vision Loss
 * Key visual characteristics:
 * - Right eye: Complete black (dead from infection ~1738) - handled by overlay
 * - Left eye: Progressive cataract - milky blur, reduced contrast, desaturation, glare
 * - Uniform diffuse fog (not scotomas or field cuts)
 * - Glare sensitivity with halo artifacts
 * - End state: Milky white opacity (not sharp black like retinal damage)
 */
export const eulerFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete simulation (mid-to-late progression)
  // CSS filters affect the entire view - cataract effects for left eye
  // Right eye blackout handled by overlay
  {
    effectId: 'eulerComplete',
    filters: (i) => [
      `blur(${8 + i * 12}px)`,
      `contrast(${70 - i * 25}%)`,
      `brightness(${100 + i * 20}%)`,
      `saturate(${60 - i * 25}%)`,
      `sepia(${i * 15}%)`,
    ],
  },
  // Mid progression - moderate cataract
  {
    effectId: 'eulerMidProgression',
    filters: (i) => [
      `blur(${5 + i * 8}px)`,
      `contrast(${80 - i * 20}%)`,
      `brightness(${100 + i * 15}%)`,
      `saturate(${70 - i * 20}%)`,
      `sepia(${i * 10}%)`,
    ],
    excludeWhenActive: ['eulerComplete'],
  },
  // Late progression - severe cataract, near-opaque
  {
    effectId: 'eulerLateProgression',
    filters: (i) => [
      `blur(${15 + i * 20}px)`,
      `contrast(${50 - i * 35}%)`,
      `brightness(${110 + i * 40}%)`,
      `saturate(${40 - i * 30}%)`,
      `sepia(${i * 20}%)`,
    ],
    excludeWhenActive: ['eulerComplete'],
  },
  // Individual left eye cataract
  {
    effectId: 'eulerLeftEyeCataract',
    filters: (i) => [
      `blur(${6 + i * 10}px)`,
      `contrast(${75 - i * 25}%)`,
      `brightness(${105 + i * 15}%)`,
      `saturate(${65 - i * 25}%)`,
    ],
    excludeWhenActive: ['eulerComplete', 'eulerMidProgression', 'eulerLateProgression'],
  },
  // Glare sensitivity
  {
    effectId: 'eulerCataractGlare',
    filters: (i) => [
      `brightness(${110 + i * 30}%)`,
      `contrast(${85 - i * 30}%)`,
      `blur(${i * 3}px)`,
    ],
    excludeWhenActive: ['eulerComplete', 'eulerMidProgression', 'eulerLateProgression'],
  },
];
