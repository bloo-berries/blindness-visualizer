import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Toph Beifong's Seismic Sense
 *
 * Creates the base visual transformation:
 * - Desaturation (seismic sense has no color, only vibration data)
 * - Green/cyan tint (phosphor glow aesthetic)
 * - High contrast (clear differentiation of surfaces)
 * - Slight inversion (dark becomes the baseline)
 */
export const tophFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Seismic Sense
  {
    effectId: 'tophSeismicSenseComplete',
    filters: i => [
      // Near-complete desaturation (seismic sense has no color)
      `saturate(${10 - i * 8}%)`,
      // Shift hue toward green/cyan (phosphor aesthetic)
      `hue-rotate(${120 + i * 20}deg)`,
      // High contrast for clear surface definition
      `contrast(${120 + i * 40}%)`,
      // Reduce brightness (dark background aesthetic)
      `brightness(${40 + i * 20}%)`,
      // Sepia to warm the green slightly
      `sepia(${20 + i * 10}%)`,
    ],
  },
  // Wireframe vision (standalone)
  {
    effectId: 'tophWireframeVision',
    filters: i => [
      `saturate(${15 - i * 10}%)`,
      `hue-rotate(${110 + i * 25}deg)`,
      `contrast(${130 + i * 30}%)`,
      `brightness(${35 + i * 15}%)`,
    ],
    excludeWhenActive: ['tophSeismicSenseComplete'],
  },
  // Sand weakness: blur and reduce clarity (independent, no guard)
  {
    effectId: 'tophSandWeakness',
    filters: i => [
      // Sand weakness: blur and reduce clarity
      `blur(${8 + i * 12}px)`,
      `contrast(${60 - i * 20}%)`,
      `brightness(${50 - i * 15}%)`,
    ],
  },
];
