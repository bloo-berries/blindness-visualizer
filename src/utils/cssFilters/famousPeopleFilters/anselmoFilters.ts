import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Anselmo Ralph's Ocular Myasthenia Gravis
 *
 * Technical Parameters:
 * 1. Blur (2-8px) - muscular fatigue affects focus control
 * 2. Brightness (110-130%) - photophobia causes light sensitivity
 * 3. Contrast (85-95%) - slight contrast reduction from fatigue
 *
 * Note: Ptosis overlay and diplopia effects are handled separately
 */
export const anselmoFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Ocular Myasthenia Gravis simulation
  {
    effectId: 'anselmoOcularMyastheniaComplete',
    filters: i => [
      // Moderate blur from muscle fatigue affecting focus (2-8px)
      `blur(${2 + i * 6}px)`,
      // Increased brightness from photophobia (110-130%)
      `brightness(${110 + i * 20}%)`,
      // Slight contrast reduction (85-95%)
      `contrast(${95 - i * 10}%)`,
      // Slight saturation reduction from visual strain
      `saturate(${95 - i * 10}%)`,
    ],
  },
  // Photophobia only
  {
    effectId: 'anselmoOcularMyastheniaPhotophobia',
    filters: i => [
      // High brightness - light sensitivity
      `brightness(${115 + i * 25}%)`,
      // Slight contrast reduction
      `contrast(${92 - i * 8}%)`,
    ],
    excludeWhenActive: ['anselmoOcularMyastheniaComplete'],
  },
  // Blur only (from muscle fatigue)
  {
    effectId: 'anselmoOcularMyastheniaBlur',
    filters: i => [
      // Moderate blur from fatigue
      `blur(${2 + i * 6}px)`,
      // Slight brightness increase
      `brightness(${105 + i * 10}%)`,
    ],
    excludeWhenActive: ['anselmoOcularMyastheniaComplete'],
  },
  // Diplopia standalone - handled via CSS transform/overlay, minimal filter effect
  {
    effectId: 'anselmoOcularMyastheniaDiplopia',
    filters: i => [
      // Very slight blur to soften edges of ghost images
      `blur(${0.5 + i * 1.5}px)`,
    ],
    excludeWhenActive: ['anselmoOcularMyastheniaComplete'],
  },
  // Ptosis standalone - primarily handled by overlay, minimal filter
  {
    effectId: 'anselmoOcularMyastheniaPtosis',
    filters: i => [
      // Slight brightness reduction as light is partially blocked
      `brightness(${95 - i * 10}%)`,
    ],
    excludeWhenActive: ['anselmoOcularMyastheniaComplete'],
  },
];
