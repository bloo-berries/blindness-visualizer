import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Infanta Margarita's Light Perception Only Vision
 *
 * Technical Parameters:
 * 1. Heavy Gaussian blur (60-80px) - destroys form, edges, detail
 * 2. Near-total desaturation (0-8%) - minimal color perception
 * 3. Moderate contrast reduction (15-25%) - preserves strongest light/dark
 * 4. High brightness (160-190%) - perception skews toward light gray/white
 *
 * Slightly more shadow differentiation than pure LP (Heather Hutchison):
 * less extreme blur, less brightness, more contrast retained.
 */
export const margaritaFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'margaritaLightPerceptionComplete',
    filters: i => [
      // Heavy blur - destroys all form but slightly less extreme than pure LP
      `blur(${60 + i * 20}px)`,
      // Strip nearly all color (0-8% saturation)
      `saturate(${8 - i * 8}%)`,
      // Moderate contrast reduction - preserves strongest light/dark transitions
      `contrast(${25 - i * 10}%)`,
      // High brightness - perception skews light, but less washed-out than pure LP
      `brightness(${160 + i * 30}%)`,
    ],
  },
];
