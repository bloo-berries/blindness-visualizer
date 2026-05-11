import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * John Milton - Bilateral Retinal Detachment and Secondary Glaucoma
 */
export const miltonEffects: VisualEffect[] = [
  effect('miltonGlaucomaHalos', 'Glaucoma Rainbow Halos (Milton)', 'Prismatic rings of color around light sources (red on outside, violet inside) caused by corneal swelling from glaucoma. Classic symptom of acute angle-closure glaucoma with corneal edema.'),
  effect('miltonProgressiveVignetting', 'Progressive Vignetting (Milton)', 'Progressive darkening from the edges inward, simulating the tunnel vision that develops as peripheral vision is lost. Represents the 7-year progression from age 36 to complete blindness at 43.'),
  effect('miltonScotomas', 'Progressive Scotomas (Milton)', 'Blind spots or dark patches appearing randomly in the visual field. Represents the irregular vision loss patterns from retinal detachment and glaucoma progression.'),
  effect('miltonRetinalDetachment', 'Retinal Detachment Shadows (Milton)', 'Dark shadows or curtains descending from top or sides, representing the retinal detachment that contributed to Milton\'s vision loss. Includes wavy/distorted vision (metamorphopsia).'),
  effect('miltonPhotophobia', 'Extreme Photophobia (Milton)', 'Extreme light sensitivity causing pain and discomfort in normal lighting. Simulates the photophobia that made normal lighting conditions unbearable for Milton.'),
  effect('miltonTemporalFieldLoss', 'Temporal Field Loss (Milton)', 'Vision loss starting from the outer sides (temples) moving inward - like black curtains slowly closing from the periphery. Represents the early stage of Milton\'s glaucoma progression.'),
  effect('miltonProgressiveBlindness', 'Progressive Blindness (Milton)', 'Complete simulation of Milton\'s 7-year progression from partial vision at age 36 to complete blindness at 43. Combines all symptoms with increasing severity over time.'),
  effect('completeBlindness', 'Complete Blindness (No Light Perception)', 'Complete absence of light perception - total darkness. Represents conditions like Louis Braille\'s sympathetic ophthalmia, where there is no visual input whatsoever. The person experiences complete blackness with no ability to detect light, shapes, or movement.'),
];
