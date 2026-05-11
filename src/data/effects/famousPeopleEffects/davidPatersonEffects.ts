import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * David Paterson - Hemispheric Vision Loss
 */
export const davidPatersonEffects: VisualEffect[] = [
  effect('davidLeftEyeBlindness', 'Left Eye Blindness (David Paterson)', 'Complete blindness in the left eye from optic nerve damage caused by ear infection at 3 months old. Creates complete blackness in the left hemisphere of vision, representing total loss of visual input from the left eye.'),
  effect('davidRightEyeGlaucoma', 'Right Eye Glaucoma (David Paterson)', 'Glaucoma affecting the right eye, causing peripheral vision loss and tunnel vision. Creates a circular tunnel effect in the right hemisphere with severe peripheral darkening, representing the characteristic "tunnel vision" of advanced glaucoma.'),
  effect('davidHemisphericVision', 'Hemispheric Vision Loss (David Paterson)', 'Combined effect showing left eye complete blindness and right eye glaucoma. Creates a unique hemispheric vision loss where the left side is completely black and the right side shows tunnel vision with peripheral darkening.'),
  effect('davidCompleteVision', 'Complete Vision (David Paterson)', 'Complete simulation of David Paterson\'s vision combining left eye blindness and right eye glaucoma. Represents his unique visual experience with complete left hemisphere blindness and right hemisphere tunnel vision from glaucoma.'),
];
