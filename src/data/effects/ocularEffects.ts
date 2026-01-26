import { VisualEffect } from '../../types/visualEffects';

/**
 * Ocular Conditions
 * Cataracts, glaucoma, astigmatism, myopia, hyperopia, and related conditions
 */
export const ocularEffects: VisualEffect[] = [
  {
    id: 'cataracts',
    name: 'Nuclear Sclerotic Cataract',
    enabled: false,
    intensity: 1.0,
    description: 'Nuclear sclerotic cataract - the most common type of cataract affecting the center of the lens. Causes progressive blurring, dimming of vision, and loss of color vibrancy, especially affecting blue color perception. The image becomes progressively more yellowed and less colorful over time.'
  },
  {
    id: 'posteriorSubcapsularCataract',
    name: 'Posterior Subcapsular Cataract',
    enabled: false,
    intensity: 1.0,
    description: 'Small central area of light scatter behind the pupil, causing pronounced glare sensitivity and loss of contrast in bright lighting. Creates a bright halo or cloudy patch that grows with brightness intensity, disproportionately affecting near and backlit vision. Peripheral vision may remain clearer.'
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    enabled: false,
    intensity: 1.0,
    description: 'Damages the optic nerve, typically due to elevated intraocular pressure. The most common symptoms are needing more light, blurry vision, and reduced contrast sensitivity - patients describe vision as "like looking underwater" or "through dirty glasses." Color discrimination is reduced, especially blue-yellow. Glare sensitivity and light bloom are common. Central vision typically remains clearer until late stages.'
  },
  {
    id: 'astigmatism',
    name: 'Astigmatism/Pterygium',
    enabled: false,
    intensity: 1.0,
    description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts. Pterygium is a fibrovascular growth onto the cornea that can cause astigmatism by distorting the corneal surface.'
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
    name: 'Binocular Diplopia/Strabismus (Double Vision in Both Eyes)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing double when both eyes are open, but single when one eye is closed. Usually caused by misalignment of the eyes due to muscle or nerve problems.'
  },
  {
    id: 'dryEye',
    name: 'Dry Eye Syndrome',
    enabled: false,
    intensity: 1.0,
    description: 'Mild random blurring and fluctuating transparency across the cornea due to an unstable tear film. Vision clarity varies over time, worsening after periods without blinking. Includes transient halos or glare around bright points and reduced contrast, especially in dry or windy conditions.'
  },
  {
    id: 'keratoconus',
    name: 'Keratoconus',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive corneal thinning causing irregular cone shape that creates multiple focal points. Results in multiple ghost images (2-8+ copies), streaking and comet tails from light sources, severe blur and wavy distortion of text, halos around lights, and high contrast loss. Gets worse with bright objects on dark backgrounds.'
  },
  {
    id: 'presbyopia',
    name: 'Presbyopia',
    enabled: false,
    intensity: 1.0,
    description: 'Gradual loss of near-focus accommodation by blurring objects closer than a variable distance from the focal plane. Transition occurs dynamically with simulated refocus effort lag. Distant and midrange objects remain sharp, but text or fine objects at hand length become unresolved without magnification.'
  },
  {
    id: 'blurryVision',
    name: 'Blurry Vision',
    enabled: false,
    intensity: 1.0,
    description: 'General lack of visual sharpness and clarity affecting the entire visual field. Objects appear out of focus, edges are soft, and fine details are difficult to distinguish. Can be constant or intermittent depending on the underlying cause.'
  },
  {
    id: 'nightBlindness',
    name: 'Night Blindness (Nyctalopia)',
    enabled: false,
    intensity: 1.0,
    description: 'Difficulty seeing in low light conditions or darkness. Vision becomes significantly impaired in dim lighting, making navigation and object recognition challenging. Often associated with rod cell dysfunction or vitamin A deficiency.'
  },
  {
    id: 'lossOfContrast',
    name: 'Loss of Contrast Sensitivity',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced ability to distinguish between similar shades or colors. Makes it difficult to see subtle differences in brightness, texture, or color. Objects may appear washed out or lacking in detail, especially in low contrast situations.'
  }
];
