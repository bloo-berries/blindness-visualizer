import { VisualEffect } from '../../../types/visualEffects';

/**
 * Galileo Galilei - Acute Angle-Closure Glaucoma
 */
export const galileoEffects: VisualEffect[] = [
  {
    id: 'galileoAcuteHalos',
    name: 'Acute Glaucoma Halos (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Intense, vivid prismatic rings around ALL light sources during acute angle-closure glaucoma attacks. Much more pronounced than chronic glaucoma, with pulsating/breathing effects. Red on outside, violet inside, caused by severe corneal edema.'
  },
  {
    id: 'galileoSevereBlurring',
    name: 'Severe Blurring (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Sudden dramatic drop in visual acuity during acute attacks, like looking through heavy fog. Visual acuity can drop from 20/20 to 20/200 within minutes during an acute episode.'
  },
  {
    id: 'galileoRedEyeEffect',
    name: 'Red Eye Effect (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Reddish tint to vision from conjunctival injection during acute glaucoma attacks. The eye becomes severely inflamed and bloodshot, affecting color perception.'
  },
  {
    id: 'galileoExtremePhotophobia',
    name: 'Extreme Photophobia (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Unbearable light sensitivity during acute attacks - even dim lights cause severe pain and discomfort. Normal lighting becomes excruciating and causes white-out effects.'
  },
  {
    id: 'galileoCornealHaziness',
    name: 'Corneal Haziness (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Milky white veil over entire visual field from severe corneal edema during acute attacks. Creates a foggy, clouded appearance that obscures all details.'
  },
  {
    id: 'galileoSectoralDefects',
    name: 'Sectoral Defects (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Wedge-shaped blind spots typically starting superior-nasal (upper nose-side) after acute attacks. Each attack leaves permanent sectoral damage that never fully recovers.'
  },
  {
    id: 'galileoArcuateScotomas',
    name: 'Arcuate Scotomas (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Curved blind areas following nerve fiber patterns, creating arc-shaped defects in the visual field. These develop after multiple acute attacks and follow the anatomical structure of the optic nerve.'
  },
  {
    id: 'galileoSwissCheeseVision',
    name: 'Swiss Cheese Vision (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Multiple patchy blind spots throughout the visual field after multiple acute attacks. Creates irregular, scattered vision loss with islands of preserved vision surrounded by blind areas.'
  },
  {
    id: 'galileoAcuteAttackMode',
    name: 'Acute Attack Mode (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of an acute angle-closure glaucoma attack with sudden onset. Combines intense halos, severe blurring, red eye effect, extreme photophobia, and corneal haziness in a dramatic, episodic presentation.'
  },
  {
    id: 'galileoChronicProgression',
    name: 'Chronic Progression (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive deterioration pattern showing cumulative damage from multiple acute attacks. Features stepped rather than smooth deterioration with sectoral defects, arcuate scotomas, and eventual severe tunnel vision.'
  }
];
