import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Dame Judi Dench's AMD
 * Central vision loss but peripheral preserved - minimal global filters
 * "I can see your outline" - shapes visible, details lost
 */
export const judiFilterConfigs: CSSFilterEffectConfig[] = [
  {
    // Complete AMD - minimal global filters, main effect is overlay-based central scotoma
    effectId: 'judiAMDComplete',
    filters: i => [
      // Very slight overall contrast reduction (peripheral still functional)
      `contrast(${100 - i * 8}%)`,
      // Minimal brightness adjustment
      `brightness(${100 - i * 5}%)`,
      // Slight saturation loss in central area (handled by overlay)
      `saturate(${100 - i * 12}%)`,
    ],
  },
  {
    effectId: 'judiCentralScotoma',
    filters: i => [
      `contrast(${100 - i * 10}%)`,
    ],
  },
  {
    effectId: 'judiFaceBlindness',
    filters: i => [
      // Face recognition requires central vision detail
      `contrast(${100 - i * 8}%)`,
    ],
  },
  {
    effectId: 'judiReadingLoss',
    filters: i => [
      `contrast(${100 - i * 6}%)`,
    ],
  },
];
