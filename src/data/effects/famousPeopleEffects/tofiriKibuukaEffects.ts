import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Tofiri Kibuuka - Progressive Degenerative Blindness (B1/T11 Classification)
 * Lost sight at age 13 due to degenerative disease in rural Uganda (1960)
 * Consistently classified B1/T11 (most severe visual impairment) throughout career
 * Most likely NLP or bare LP - navigated entirely through non-visual means
 */
export const tofiriKibuukaEffects: VisualEffect[] = [
  effect('tofiriNLP', 'No Light Perception (Tofiri Kibuuka)', 'Complete absence of visual input - uniform black at 100% opacity. No gradients, no glow, no variation. Represents the most likely scenario for Tofiri\'s B1/T11 classification where there is no functional vision whatsoever.'),
  effect('tofiriBareLightPerception', 'Bare Light Perception (Tofiri Kibuuka)', 'Near-total darkness with extremely subtle, diffuse, non-directional luminance shifts when strong light sources (sunlight, stadium floodlights) are present. Not enough to localize anything - only enough to sense "it is brighter here than it was a moment ago." No edges, no shapes, no color - just faint ambient warmth of light with no spatial meaning.'),
  effect('tofiriComplete', 'Complete B1/T11 Vision (Tofiri Kibuuka)', 'Complete simulation of Tofiri Kibuuka\'s vision after progressive degenerative blindness at age 13. Near-total darkness (98-100% opacity) with only the most subtle ambient luminance variation possible under bright light conditions. No spatial information, no edges, no shapes, no color - only the barest sense that light exists somewhere. He navigated Paralympic ski courses, marathon routes, and Mount Kilimanjaro through sound, touch, guide communication, spatial memory, and proprioception - with effectively zero visual input.'),
];
