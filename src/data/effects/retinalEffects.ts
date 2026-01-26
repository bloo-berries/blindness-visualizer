import { VisualEffect } from '../../types/visualEffects';

/**
 * Retinal Disorders
 * Retinitis pigmentosa, Stargardt, AMD, diabetic retinopathy, and related conditions
 */
export const retinalEffects: VisualEffect[] = [
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
    id: 'retinalDetachment',
    name: 'Retinal Detachment',
    enabled: false,
    intensity: 1.0,
    description: 'Medical emergency where the retina separates from underlying tissue, causing sudden vision loss. Most common type is rhegmatogenous (from retinal tears), often associated with aging and posterior vitreous detachment. Symptoms include sudden increase in floaters, flashes of light, and a curtain-like shadow moving across vision. At detachment margins, vision may be distorted (metamorphopsia). Requires immediate medical attention to prevent permanent vision loss.'
  },
  {
    id: 'vitreousHemorrhage',
    name: 'Vitreous Hemorrhage',
    enabled: false,
    intensity: 1.0,
    description: 'Hazy, semi-random dark reddish or gray floaters that move with small inertia as gaze shifts. In severe cases, includes diffuse reddish clouding or patchy opacity that dims retinal illumination and obscures details, particularly in the lower visual field, with possible shadows or streaking.'
  }
];
