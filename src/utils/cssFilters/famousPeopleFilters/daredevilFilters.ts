import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Daredevil's Radar Sense
 * Key visual characteristics:
 * - Transparent red tint over the scene (like the comics)
 * - Scene remains visible through the red filter
 * - Subtle desaturation to emphasize the red overlay
 * - Main red effect comes from the animated overlay using multiply blend
 */
export const daredevilFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Radar Sense - subtle filter to complement the overlay
  {
    effectId: 'daredevilRadarSenseComplete',
    filters: i => [
      // Slight desaturation to let the red overlay dominate
      `saturate(${70 - i * 20}%)`,
      // Subtle contrast boost
      `contrast(${105 + i * 10}%)`,
      // Slight brightness adjustment
      `brightness(${95 + i * 5}%)`,
      // Slight blur for the "radar sense" softness
      `blur(${1 + i * 1.5}px)`,
    ],
  },
  // Red monochrome only (stronger effect)
  {
    effectId: 'daredevilRedMonochrome',
    filters: i => [
      `saturate(${60 - i * 30}%)`,
      `contrast(${110 + i * 15}%)`,
    ],
    excludeWhenActive: ['daredevilRadarSenseComplete'],
  },
];
