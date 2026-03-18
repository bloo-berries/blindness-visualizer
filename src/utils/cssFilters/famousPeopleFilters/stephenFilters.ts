import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Stephen Curry's Keratoconus
 * Directional blur can't be achieved with CSS filters alone, but we handle:
 * - Reduced contrast (light scatter)
 * - Diffuse haze
 * - Desaturated colors ("lacking punch")
 * Main visual effects handled by overlays and animated components
 */
export const stephenFilterConfigs: CSSFilterEffectConfig[] = [
  {
    // Complete keratoconus - combination of all effects
    effectId: 'stephenKeratoconusComplete',
    filters: i => [
      // Reduced contrast from irregular corneal surface scattering light
      `contrast(${100 - i * 25}%)`,
      // Slight brightness increase from light scatter
      `brightness(${100 + i * 8}%)`,
      // Colors "lack punch" - desaturated
      `saturate(${100 - i * 20}%)`,
      // Very subtle blur for the diffuse haze (main blur in overlays)
      `blur(${i * 1.5}px)`,
    ],
  },
  {
    effectId: 'stephenComaAberration',
    filters: i => [
      // Directional smear handled by overlays, but add slight blur
      `blur(${i * 1.2}px)`,
      `contrast(${100 - i * 15}%)`,
    ],
  },
  {
    effectId: 'stephenGhosting',
    filters: i => [
      // Ghosting creates "dirty" visual impression
      `contrast(${100 - i * 18}%)`,
      `brightness(${100 + i * 5}%)`,
    ],
  },
  {
    effectId: 'stephenIrregularHalos',
    filters: i => [
      // Light bleeding - increased brightness in highlights
      `brightness(${100 + i * 12}%)`,
      `contrast(${100 - i * 20}%)`,
    ],
  },
  {
    effectId: 'stephenWaviness',
    filters: i => [
      // Waviness creates visual "noise" - slight contrast reduction
      `contrast(${100 - i * 10}%)`,
    ],
  },
  {
    effectId: 'stephenReducedContrast',
    filters: i => [
      // "Blacks aren't as black, whites aren't as white"
      `contrast(${100 - i * 30}%)`,
      // "Faint milky film" - slight brightness increase
      `brightness(${100 + i * 10}%)`,
      // Colors lack saturation
      `saturate(${100 - i * 25}%)`,
    ],
  },
  {
    effectId: 'stephenAsymmetry',
    filters: i => [
      // Asymmetry creates visual dissonance - mild overall degradation
      `contrast(${100 - i * 12}%)`,
      `blur(${i * 0.8}px)`,
    ],
  },
];
