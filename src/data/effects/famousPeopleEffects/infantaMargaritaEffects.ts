import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Infanta Margarita, Duchess of Soria - Congenital Blindness (Light Perception Only)
 *
 * Born blind, after four years of medical interventions a specialist
 * determined she could see only "light and shadows and rarely something more."
 *
 * Technical Parameters:
 * 1. Heavy Gaussian blur (60-80px) - destroys form and detail
 * 2. Near-total desaturation (0-8%) - minimal color perception
 * 3. Moderate contrast reduction (15-25%) - preserves strongest light/dark transitions
 * 4. High brightness (160-190%) - perception skews toward light gray/white
 * 5. Semi-transparent fog overlay (60-75% opacity) - diffuse quality
 * 6. Fluctuating perception - slow oscillation (4-6s period, +/-8% variation)
 *
 * Compared to pure LP vision (Heather Hutchison), Margarita's perception
 * retains slightly more shadow differentiation - she can distinguish broad
 * light vs dark areas (e.g., a sunlit window vs a dark wall). No nystagmus.
 */
export const infantaMargaritaEffects: VisualEffect[] = [
  effect('margaritaLightPerceptionComplete', 'Light & Shadow Perception (Infanta Margarita)', 'Congenital light perception only vision. Heavy blur (60-80px) destroys all form and detail. Near-total desaturation strips color. Moderate contrast reduction preserves only the strongest light-vs-dark transitions. Brightness creates a light gray/white perception. She can perceive light and shadows - broad luminance regions register as vague light and dark gradients, but no shapes, faces, or text are visible.'),
];
