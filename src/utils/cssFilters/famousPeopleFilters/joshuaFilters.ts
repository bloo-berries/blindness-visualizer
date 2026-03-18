import { CSSFilterEffectConfig } from './filterConfig';

// Joshua Miele - Chemical Burn Complete Blindness Filters
export const joshuaFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'joshuaCompleteBlindness',
    filters: () => [
      `brightness(0%)`,
      `contrast(0%)`,
      `saturate(0%)`,
    ],
  },
  {
    effectId: 'joshuaEcholocation',
    filters: i => [
      `contrast(${100 + i * 50}%)`,
      `brightness(${100 + i * 20}%)`,
    ],
  },
  {
    effectId: 'joshuaTactileMaps',
    filters: i => [
      `contrast(${100 + i * 30}%)`,
      `brightness(${100 + i * 15}%)`,
    ],
  },
  {
    effectId: 'joshuaAudioLandscape',
    filters: i => [
      `contrast(${100 + i * 25}%)`,
      `brightness(${100 + i * 10}%)`,
    ],
  },
  {
    effectId: 'joshuaAccessibilityMode',
    filters: i => [
      `contrast(${100 + i * 40}%)`,
      `brightness(${100 + i * 20}%)`,
    ],
  },
  {
    effectId: 'joshuaSonification',
    filters: i => [
      `contrast(${100 + i * 35}%)`,
      `brightness(${100 + i * 15}%)`,
    ],
  },
];
