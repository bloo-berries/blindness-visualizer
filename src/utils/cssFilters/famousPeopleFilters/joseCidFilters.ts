import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Jose Cid's monocular vision condition
 *
 * Effects:
 * - Slight contrast reduction (monocular viewing reduces contrast sensitivity)
 */
export const joseCidFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'joseCidMonocularVision',
    filters: i => [
      // Slight contrast reduction for monocular vision
      // Monocular viewing reduces contrast sensitivity by approximately 5-10%
      `contrast(${1 - (i * 0.08)})`,
    ],
  },
];
