import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Abraham Nemeth's Congenital Dual-Attack Blindness
 * Key visual characteristics:
 * - Central scotoma (macular component) + peripheral constriction (RP component)
 * - Only a fragile mid-peripheral ring survives (if any)
 * - Heavy Gaussian blur globally - even surviving ring has poor resolution
 * - Severe desaturation and contrast loss
 * - Night blindness component
 * - End state: near-total darkness, functionally blind from birth
 */
export const nemethFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete dual-attack blindness - near-total darkness
  // Nemeth functioned as totally blind throughout life
  {
    effectId: 'nemethComplete',
    filters: (i) => [
      `brightness(${8 - i * 7}%)`,
      `contrast(${15 - i * 12}%)`,
      `saturate(${10 - i * 10}%)`,
      `blur(${40 + i * 30}px)`,
    ],
  },
  // Central scotoma - darkening toward center
  {
    effectId: 'nemethCentralScotoma',
    filters: (i) => [
      `brightness(${85 - i * 25}%)`,
      `contrast(${80 - i * 30}%)`,
      `blur(${i * 5}px)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
  // Peripheral constriction
  {
    effectId: 'nemethPeripheralConstriction',
    filters: (i) => [
      `brightness(${80 - i * 30}%)`,
      `contrast(${75 - i * 25}%)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
  // Mid-ring remnant - the only surviving vision
  {
    effectId: 'nemethMidRingRemnant',
    filters: (i) => [
      `blur(${15 + i * 20}px)`,
      `saturate(${40 - i * 30}%)`,
      `contrast(${60 - i * 30}%)`,
      `brightness(${70 - i * 30}%)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
  // Night blindness - dramatic darkening in low light
  {
    effectId: 'nemethNightBlindness',
    filters: (i) => [
      `brightness(${30 - i * 25}%)`,
      `contrast(${40 - i * 30}%)`,
      `saturate(${20 - i * 15}%)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
  // Severe global acuity loss
  {
    effectId: 'nemethAcuityLoss',
    filters: (i) => [
      `blur(${20 + i * 25}px)`,
      `contrast(${70 - i * 35}%)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
  // Partial ring vision (for educational purposes - what minimal vision might look like)
  {
    effectId: 'nemethPartialRing',
    filters: (i) => [
      `blur(${8 + i * 12}px)`,
      `saturate(${50 - i * 30}%)`,
      `contrast(${65 - i * 30}%)`,
      `brightness(${60 - i * 25}%)`,
    ],
    excludeWhenActive: ['nemethComplete'],
  },
];
