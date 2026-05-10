import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Tofiri Kibuuka's B1/T11 Blindness
 * Two variants supported:
 * - NLP (No Light Perception): Complete darkness, brightness 0%
 * - Bare LP: Near-total darkness (98-100% opacity) with extremely subtle
 *   ambient luminance variation - no spatial info, just "light exists somewhere"
 */
export const tofiriFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'tofiriNLP',
    filters: () => ['brightness(0%)', 'contrast(0%)', 'saturate(0%)'],
  },
  {
    effectId: 'tofiriComplete',
    filters: (i) => [
      `brightness(${2 + i * 3}%)`,
      `contrast(${5 - i * 3}%)`,
      'saturate(0%)',
      `blur(${80 + i * 40}px)`,
    ],
  },
  {
    effectId: 'tofiriBareLightPerception',
    filters: (i) => [
      `brightness(${2 + i * 3}%)`,
      `contrast(${5 - i * 3}%)`,
      'saturate(0%)',
      `blur(${80 + i * 40}px)`,
    ],
  },
];
