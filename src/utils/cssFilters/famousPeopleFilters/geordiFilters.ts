import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Geordi La Forge's VISOR Sense
 * Key visual characteristics:
 * - False-color thermal/spectral palette - remap to non-natural colors
 * - No true darkness - minimum brightness floor (0.15-0.2)
 * - Enhanced contrast for EM edge detection
 * - Chromatic shift away from natural greens/earth tones
 */
export const geordiFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete VISOR Sense - false-color spectral vision
  {
    effectId: 'geordiVisorSenseComplete',
    filters: i => [
      // Shift hue significantly - move away from natural colors
      // Rotate toward blue/violet/magenta spectrum (thermal palette)
      `hue-rotate(${180 + i * 40}deg)`,
      // Boost saturation for vibrant false-color effect
      `saturate(${130 + i * 40}%)`,
      // Increased contrast for edge enhancement / EM boundaries
      `contrast(${115 + i * 20}%)`,
      // Minimum brightness floor - no true darkness (violet floor)
      `brightness(${85 + i * 15}%)`,
      // Slight invert-like effect via sepia + hue for thermal look
      `sepia(${i * 15}%)`,
    ],
  },
  // Thermal spectrum effect (standalone)
  {
    effectId: 'geordiThermalSpectrum',
    filters: i => [
      // Dramatic hue shift to thermal colors
      `hue-rotate(${200 + i * 60}deg)`,
      `saturate(${140 + i * 50}%)`,
      `sepia(${i * 20}%)`,
    ],
    excludeWhenActive: ['geordiVisorSenseComplete'],
  },
  // EM enhancement (standalone)
  {
    effectId: 'geordiEMEnhancement',
    filters: i => [
      // High contrast for edge detection appearance
      `contrast(${120 + i * 30}%)`,
      `brightness(${105 + i * 15}%)`,
      `saturate(${120 + i * 30}%)`,
    ],
    excludeWhenActive: ['geordiVisorSenseComplete'],
  },
  // No true darkness (standalone)
  {
    effectId: 'geordiNoTrueDarkness',
    filters: i => [
      // Ensure minimum brightness floor
      `brightness(${115 + i * 25}%)`,
      // Lift shadows
      `contrast(${90 - i * 15}%)`,
    ],
    excludeWhenActive: ['geordiVisorSenseComplete'],
  },
];
