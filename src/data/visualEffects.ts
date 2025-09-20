import { ConditionType, VisualEffect } from '../types/visualEffects';

/**
 * Complete list of visual effects with descriptions
 * Extracted from VisionSimulator.tsx to improve maintainability
 */
export const VISUAL_EFFECTS: VisualEffect[] = [
  { 
    id: 'hemianopiaLeft',
    name: 'Homonymous Hemianopia (Left-field)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.'
  },
  { 
    id: 'hemianopiaRight',
    name: 'Homonymous Hemianopia (Right-field)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.'
  },
  { 
    id: 'quadrantanopiaRight',
    name: 'Homonymous Hemianopia (Right-field) + Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in one quarter (quadrant) of the visual field. Often caused by damage to specific parts of the brain that process vision. Affects spatial awareness and navigation.'
  },
  { 
    id: 'quadrantanopiaInferior',
    name: 'Homonymous Inferior Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the same lower quadrant of visual field in both eyes. Caused by damage to the superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.'
  },
  { 
    id: 'quadrantanopiaSuperior',
    name: 'Homonymous Superior Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the same upper quadrant of visual field in both eyes. Caused by damage to the inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.'
  },
  { 
    id: 'blindnessLeftEye',
    name: 'Complete Loss of Vision in Left Eye',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in the left eye. Caused by damage to the left optic nerve. Results in total loss of vision in the left eye while the right eye remains unaffected.'
  },
  { 
    id: 'blindnessRightEye',
    name: 'Complete Loss of Vision in Right Eye',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in the right eye. Caused by damage to the right optic nerve. Results in total loss of vision in the right eye while the left eye remains unaffected.'
  },
  { 
    id: 'bitemporalHemianopia',
    name: 'Bitemporal Hemianopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.'
  },
  { 
    id: 'scotoma',
    name: 'Central Scotoma',
    enabled: false,
    intensity: 1.0,
    description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.'
  },
  { 
    id: 'visualAura',
    name: 'Visual Aura',
    enabled: false,
    intensity: 1.0,
    description: 'Temporary visual disturbances that can precede migraines. May include flashing lights, zigzag patterns, or blind spots. Usually lasts 20-60 minutes before the headache begins.'
  },
  { 
    id: 'visualAuraLeft',
    name: 'Visual Aura (Left Side)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual aura affecting only the left side of the visual field. Common in migraine with aura, where visual disturbances appear on one side before spreading.'
  },
  { 
    id: 'visualAuraRight',
    name: 'Visual Aura (Right Side)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual aura affecting only the right side of the visual field. Common in migraine with aura, where visual disturbances appear on one side before spreading.'
  },
  { 
    id: 'visualSnow',
    name: 'Visual Snow',
    enabled: false,
    intensity: 1.0,
    description: 'A persistent visual disturbance where people see tiny, flickering dots across their entire visual field. Similar to the static noise on an old television. Can be constant or intermittent.'
  },
  { 
    id: 'visualFloaters',
    name: 'Visual Floaters (Myodesopsia)',
    enabled: false,
    intensity: 1.0,
    description: 'Shadows cast on the retina by debris floating in the vitreous humor. Includes cobweb/string floaters, dots/spots, ring floaters (Weiss Ring), and cloud/sheet floaters. Move with eye movement but lag behind, following fluid dynamics. Most visible against bright backgrounds, can interfere with reading and detailed tasks.'
  },
  { 
    id: 'hallucinations',
    name: 'Visual Hallucinations',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing things that are not actually present. Can be simple (lights, shapes) or complex (people, animals). Associated with various neurological conditions and medications.'
  },
  { 
    id: 'protanopia',
    name: 'Protanopia (Red-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.'
  },
  { 
    id: 'deuteranopia',
    name: 'Deuteranopia (Green-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.'
  },
  { 
    id: 'tritanopia',
    name: 'Tritanopia (Blue-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.'
  },
  { 
    id: 'protanomaly',
    name: 'Protanomaly (Red-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.'
  },
  { 
    id: 'deuteranomaly',
    name: 'Deuteranomaly (Green-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.'
  },
  { 
    id: 'tritanomaly',
    name: 'Tritanomaly (Blue-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.'
  },
  { 
    id: 'monochromacy',
    name: 'Monochromacy (Complete Color Blindness)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.'
  },
  { 
    id: 'monochromatic',
    name: 'Monochromatic Vision',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing only in shades of one color (usually blue). Different from complete color blindness as some color perception remains. Very rare condition.'
  },
  { 
    id: 'cataracts',
    name: 'Cataracts',
    enabled: false,
    intensity: 1.0,
    description: 'Clouding of the eye\'s natural lens. Causes blurry vision, difficulty seeing in bright light, and faded colors. Common with aging but can occur at any age.'
  },
  { 
    id: 'glaucoma',
    name: 'Glaucoma',
    enabled: false,
    intensity: 1.0,
    description: 'A group of eye diseases that damage the optic nerve, typically due to elevated intraocular pressure. Known as the "silent thief of sight" because vision loss occurs gradually and peripherally first. Early stages show small paracentral scotomas, progressing to arc-shaped defects, then tunnel vision, and finally severe constriction. Central vision remains sharp until late stages. Includes blue-yellow color deficits and reduced contrast sensitivity.'
  },
  { 
    id: 'amd',
    name: 'Age-Related Macular Degeneration (AMD)',
    enabled: false,
    intensity: 1.0,
    description: 'Deterioration of the macula, the central part of the retina. Causes loss of central vision while peripheral vision remains. Leading cause of vision loss in older adults.'
  },
  { 
    id: 'diabeticRetinopathy',
    name: 'Diabetic Retinopathy',
    enabled: false,
    intensity: 1.0,
    description: 'Damage to the blood vessels in the retina caused by diabetes. Can cause blurry vision, dark spots, and eventually blindness if untreated.'
  },
  { 
    id: 'astigmatism',
    name: 'Astigmatism',
    enabled: false,
    intensity: 1.0,
    description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts.'
  },
  { 
    id: 'retinitisPigmentosa',
    name: 'Retinitis Pigmentosa',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.'
  },
  { 
    id: 'stargardt',
    name: 'Stargardt Disease',
    enabled: false,
    intensity: 1.0,
    description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.'
  },
  { 
    id: 'nearSighted',
    name: 'Myopia (Near-Sightedness)',
    enabled: false,
    intensity: 1.0,
    description: 'Difficulty seeing distant objects clearly while near objects appear normal. Caused by the eye being too long or the cornea being too curved.'
  },
  { 
    id: 'farSighted',
    name: 'Hyperopia (Far-Sightedness)',
    enabled: false,
    intensity: 1.0,
    description: 'Difficulty seeing near objects clearly while distant objects appear normal. Caused by the eye being too short or the cornea being too flat.'
  },
  { 
    id: 'diplopiaMonocular',
    name: 'Monocular Diplopia (Double Vision in One Eye)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing double with one eye closed. Usually caused by problems within the eye itself, such as cataracts, corneal irregularities, or retinal issues.'
  },
  { 
    id: 'diplopiaBinocular',
    name: 'Binocular Diplopia (Double Vision in Both Eyes)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing double when both eyes are open, but single when one eye is closed. Usually caused by misalignment of the eyes due to muscle or nerve problems.'
  },
  { 
    id: 'tunnelVision',
    name: 'Tunnel Vision',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.'
  }
];

/**
 * Gets a visual effect by its ID
 * 
 * @param id - The effect ID to find
 * @returns The visual effect or undefined if not found
 */
export const getVisualEffectById = (id: ConditionType): VisualEffect | undefined => {
  return VISUAL_EFFECTS.find(effect => effect.id === id);
};

/**
 * Gets all enabled visual effects
 * 
 * @param effects - Array of visual effects
 * @returns Array of enabled effects
 */
export const getEnabledEffects = (effects: VisualEffect[]): VisualEffect[] => {
  return effects.filter(effect => effect.enabled);
};

/**
 * Creates a new visual effects array with default values
 * 
 * @returns Array of visual effects with all disabled
 */
export const createDefaultEffects = (): VisualEffect[] => {
  return VISUAL_EFFECTS.map(effect => ({
    ...effect,
    enabled: false,
    intensity: 1.0
  }));
};
