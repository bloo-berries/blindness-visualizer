import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Joseph Plateau's Solar Retinopathy
 * Key visual characteristics:
 * - Central scotoma (handled by overlay)
 * - Blur increasing toward center (overall blur for CSS)
 * - Reduced brightness/contrast globally (progressive dimming)
 * - Desaturation from retinal damage
 * Progression: Early (preserved peripheral) -> Mid (dimming) -> Late (near-blind) -> Total
 */
export const plateauFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete simulation (mid-stage representation for educational value)
  {
    effectId: 'plateauComplete',
    filters: (i) => [
      `blur(${3 + i * 4}px)`,
      `brightness(${85 - i * 20}%)`,
      `contrast(${80 - i * 15}%)`,
      `saturate(${85 - i * 20}%)`,
    ],
  },
  // Early stage - minimal global effects, central scotoma via overlay
  {
    effectId: 'plateauEarlyStage',
    filters: (i) => [
      `blur(${1 + i * 2}px)`,
      `brightness(${95 - i * 10}%)`,
      `contrast(${95 - i * 10}%)`,
    ],
    excludeWhenActive: ['plateauComplete'],
  },
  // Mid stage - increasing global degradation
  {
    effectId: 'plateauMidStage',
    filters: (i) => [
      `blur(${3 + i * 4}px)`,
      `brightness(${80 - i * 20}%)`,
      `contrast(${75 - i * 20}%)`,
      `saturate(${80 - i * 25}%)`,
    ],
    excludeWhenActive: ['plateauComplete'],
  },
  // Late stage - severe degradation, near-blindness
  {
    effectId: 'plateauLateStage',
    filters: (i) => [
      `blur(${6 + i * 8}px)`,
      `brightness(${50 - i * 35}%)`,
      `contrast(${50 - i * 35}%)`,
      `saturate(${40 - i * 30}%)`,
    ],
    excludeWhenActive: ['plateauComplete'],
  },
  // Central scotoma mainly handled by overlay, mild blur for surrounding
  {
    effectId: 'plateauCentralScotoma',
    filters: (i) => [
      `blur(${i * 2}px)`,
    ],
    excludeWhenActive: ['plateauComplete', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
  },
  // Acuity loss
  {
    effectId: 'plateauAcuityLoss',
    filters: (i) => [
      `blur(${2 + i * 5}px)`,
      `contrast(${90 - i * 20}%)`,
    ],
    excludeWhenActive: ['plateauComplete', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
  },
  // Photopsia creates visual artifacts - slight brightness fluctuation
  {
    effectId: 'plateauPhotopsia',
    filters: (i) => [
      `brightness(${100 + i * 15}%)`,
      `contrast(${100 - i * 10}%)`,
    ],
    excludeWhenActive: ['plateauComplete', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
  },
  // Global dimming
  {
    effectId: 'plateauGlobalDimming',
    filters: (i) => [
      `brightness(${100 - i * 60}%)`,
      `contrast(${100 - i * 50}%)`,
      `saturate(${100 - i * 40}%)`,
    ],
    excludeWhenActive: ['plateauComplete', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
  },
];
