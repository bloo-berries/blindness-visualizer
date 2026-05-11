import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Galileo Galilei - Acute Angle-Closure Glaucoma
 */
export const galileoEffects: VisualEffect[] = [
  effect('galileoAcuteHalos', 'Acute Glaucoma Halos (Galileo)', 'Intense, vivid prismatic rings around ALL light sources during acute angle-closure glaucoma attacks. Much more pronounced than chronic glaucoma, with pulsating/breathing effects. Red on outside, violet inside, caused by severe corneal edema.'),
  effect('galileoSevereBlurring', 'Severe Blurring (Galileo)', 'Sudden dramatic drop in visual acuity during acute attacks, like looking through heavy fog. Visual acuity can drop from 20/20 to 20/200 within minutes during an acute episode.'),
  effect('galileoRedEyeEffect', 'Red Eye Effect (Galileo)', 'Reddish tint to vision from conjunctival injection during acute glaucoma attacks. The eye becomes severely inflamed and bloodshot, affecting color perception.'),
  effect('galileoExtremePhotophobia', 'Extreme Photophobia (Galileo)', 'Unbearable light sensitivity during acute attacks - even dim lights cause severe pain and discomfort. Normal lighting becomes excruciating and causes white-out effects.'),
  effect('galileoCornealHaziness', 'Corneal Haziness (Galileo)', 'Milky white veil over entire visual field from severe corneal edema during acute attacks. Creates a foggy, clouded appearance that obscures all details.'),
  effect('galileoSectoralDefects', 'Sectoral Defects (Galileo)', 'Wedge-shaped blind spots typically starting superior-nasal (upper nose-side) after acute attacks. Each attack leaves permanent sectoral damage that never fully recovers.'),
  effect('galileoArcuateScotomas', 'Arcuate Scotomas (Galileo)', 'Curved blind areas following nerve fiber patterns, creating arc-shaped defects in the visual field. These develop after multiple acute attacks and follow the anatomical structure of the optic nerve.'),
  effect('galileoSwissCheeseVision', 'Swiss Cheese Vision (Galileo)', 'Multiple patchy blind spots throughout the visual field after multiple acute attacks. Creates irregular, scattered vision loss with islands of preserved vision surrounded by blind areas.'),
  effect('galileoAcuteAttackMode', 'Acute Attack Mode (Galileo)', 'Complete simulation of an acute angle-closure glaucoma attack with sudden onset. Combines intense halos, severe blurring, red eye effect, extreme photophobia, and corneal haziness in a dramatic, episodic presentation.'),
  effect('galileoChronicProgression', 'Chronic Progression (Galileo)', 'Progressive deterioration pattern showing cumulative damage from multiple acute attacks. Features stepped rather than smooth deterioration with sectoral defects, arcuate scotomas, and eventual severe tunnel vision.'),
];
