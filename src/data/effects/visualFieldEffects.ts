import { VisualEffect } from '../../types/visualEffects';

/**
 * Visual Field Defects
 * Hemianopias, quadrantanopias, scotomas, tunnel vision
 */
export const visualFieldEffects: VisualEffect[] = [
  {
    id: 'hemianopiaLeft',
    name: 'Homonymous Hemianopia (Left-field)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.'
  },
  {
    id: 'hemianopiaRight',
    name: 'Homonymous Hemianopia (Right-field)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.'
  },
  {
    id: 'quadrantanopiaRight',
    name: 'Homonymous Hemianopia (Right-field) + Superior Quadrantanopia',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in one quarter (quadrant) of the visual field. Often caused by damage to specific parts of the brain that process vision. Affects spatial awareness and navigation.'
  },
  {
    id: 'quadrantanopiaInferiorLeft',
    name: 'Homonymous Inferior Quadrantanopia (Left)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in the lower-left quadrant of visual field in both eyes. Caused by damage to the right superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.'
  },
  {
    id: 'quadrantanopiaInferiorRight',
    name: 'Homonymous Inferior Quadrantanopia (Right)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in the lower-right quadrant of visual field in both eyes. Caused by damage to the left superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.'
  },
  {
    id: 'quadrantanopiaSuperiorLeft',
    name: 'Homonymous Superior Quadrantanopia (Left)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in the upper-left quadrant of visual field in both eyes. Caused by damage to the right inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.'
  },
  {
    id: 'quadrantanopiaSuperiorRight',
    name: 'Homonymous Superior Quadrantanopia (Right)',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in the upper-right quadrant of visual field in both eyes. Caused by damage to the left inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.'
  },
  {
    id: 'blindnessLeftEye',
    name: 'Complete Loss of Vision in Left Eye',
    enabled: false,
    intensity: 0.75,
    description: 'Complete blindness in the left eye. Caused by damage to the left optic nerve. Results in total loss of vision in the left eye while the right eye remains unaffected.'
  },
  {
    id: 'blindnessRightEye',
    name: 'Complete Loss of Vision in Right Eye',
    enabled: false,
    intensity: 0.75,
    description: 'Complete blindness in the right eye. Caused by damage to the right optic nerve. Results in total loss of vision in the right eye while the left eye remains unaffected.'
  },
  {
    id: 'bitemporalHemianopia',
    name: 'Bitemporal Hemianopia',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.'
  },
  {
    id: 'scotoma',
    name: 'Central Scotoma',
    enabled: false,
    intensity: 0.75,
    description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.'
  },
  {
    id: 'tunnelVision',
    name: 'Tunnel Vision',
    enabled: false,
    intensity: 0.75,
    description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.'
  }
];
