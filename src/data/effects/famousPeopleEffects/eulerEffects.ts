import { VisualEffect } from '../../../types/visualEffects';

/**
 * Leonhard Euler - Asymmetric Progressive Blindness
 * Right eye: Complete blindness from infection (~1738) - total blackout
 * Left eye: Progressive cataract (1766-1771) - milky fog, glare, desaturation
 * End state: Near-total blindness, milky white opacity (not sharp black like retinal damage)
 */
export const eulerEffects: VisualEffect[] = [
  {
    id: 'eulerRightEyeBlind',
    name: 'Right Eye Blindness (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in right eye from infection (~1738, likely brucellosis). Total blackout on the right side - not blur or scotoma, but complete loss. The physical eye was also visibly misaligned with drooping eyelid.'
  },
  {
    id: 'eulerLeftEyeCataract',
    name: 'Left Eye Cataract (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive cataract in left eye discovered 1766. Milky/foggy blur like looking through frosted glass, with washed-out contrast, glare sensitivity, and color desaturation. Uniform diffuse fog, not scotomas or field cuts.'
  },
  {
    id: 'eulerCataractGlare',
    name: 'Cataract Glare Sensitivity (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Bright areas bleed outward with halo artifacts - classic cataract symptom. Light sources create expansive blooms that wash out surrounding detail. Glare is especially problematic in bright conditions.'
  },
  {
    id: 'eulerMidProgression',
    name: 'Mid-Progression (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Mid-stage (~1766-1770): Right eye completely blind (black), left eye experiencing moderate cataract with milky haze, reduced contrast, glare sensitivity, and color desaturation. Still able to see shapes and movement through the fog.'
  },
  {
    id: 'eulerLateProgression',
    name: 'Late Progression (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Late stage (~1771+): Right eye black, left eye nearly opaque from advanced cataract. Dense milky white fog with only bright light sources registering as diffuse glows. Dictated all work to assistants.'
  },
  {
    id: 'eulerComplete',
    name: 'Complete Asymmetric Blindness (Leonhard Euler)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Euler\'s asymmetric vision loss at mid-to-late progression. Right half of view is complete black (dead eye from 1738 infection). Left eye shows progressive cataract - milky/foggy blur like frosted glass, washed-out contrast, color desaturation, and glare halos around bright areas. The subjective experience is "trapped behind frosted glass" rather than sharp blackness.'
  }
];
