import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Anselmo Ralph - Ocular Myasthenia Gravis
 *
 * Autoimmune neuromuscular disease affecting voluntary muscles,
 * particularly the eyelid muscles (ptosis), causing:
 * - Asymmetric eyelid droop (ptosis)
 * - Double vision (diplopia)
 * - Severe light sensitivity (photophobia)
 * - Blurred vision with halos
 * - Temporal fatigue - symptoms worsen throughout the day
 */
export const anselmoRalphEffects: VisualEffect[] = [
  effect('anselmoOcularMyastheniaPtosis', 'Ptosis - Eyelid Droop (Anselmo)', 'Asymmetric eyelid droop affecting the upper visual field. Creates a curtain-like obstruction that varies between eyes and worsens with fatigue. The left eye typically droops more than the right, reducing the visible field from above.'),
  effect('anselmoOcularMyastheniaDiplopia', 'Diplopia - Double Vision (Anselmo)', 'Extraocular muscle weakness causes misalignment between eyes, resulting in overlapping ghost images. The offset fluctuates as muscle fatigue varies, with vertical and horizontal displacement that changes throughout the day.'),
  effect('anselmoOcularMyastheniaPhotophobia', 'Photophobia - Light Sensitivity (Anselmo)', 'Severe sensitivity to bright light, especially camera flashes and direct sunlight. Bright areas bloom and overexpose, forcing involuntary eye closure. This is why Anselmo wears dark sunglasses as a coping mechanism, not a fashion statement.'),
  effect('anselmoOcularMyastheniaBlur', 'Blurred Vision with Halos (Anselmo)', 'Muscular fatigue affects focus control, causing intermittent blur. Light sources develop halos and glowing edges, particularly in low-light conditions. Vision clarity fluctuates with overall muscle fatigue.'),
  effect('anselmoOcularMyastheniaComplete', 'Complete Ocular Myasthenia (Anselmo)', 'Complete simulation of Anselmo Ralph\'s ocular myasthenia gravis, combining all symptoms: asymmetric ptosis (eyelid droop) creating curtain-like obstruction, diplopia (double vision) with fluctuating misalignment, severe photophobia causing bright areas to bloom and overexpose, and blurred vision with halos. Includes temporal fatigue cycle - symptoms worsen over time, then improve briefly during "rest" periods before cycling again.'),
];
