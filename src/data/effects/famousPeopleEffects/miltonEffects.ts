import { VisualEffect } from '../../../types/visualEffects';

/**
 * John Milton - Bilateral Retinal Detachment and Secondary Glaucoma
 */
export const miltonEffects: VisualEffect[] = [
  {
    id: 'miltonGlaucomaHalos',
    name: 'Glaucoma Rainbow Halos (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Prismatic rings of color around light sources (red on outside, violet inside) caused by corneal swelling from glaucoma. Classic symptom of acute angle-closure glaucoma with corneal edema.'
  },
  {
    id: 'miltonProgressiveVignetting',
    name: 'Progressive Vignetting (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive darkening from the edges inward, simulating the tunnel vision that develops as peripheral vision is lost. Represents the 7-year progression from age 36 to complete blindness at 43.'
  },
  {
    id: 'miltonScotomas',
    name: 'Progressive Scotomas (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Blind spots or dark patches appearing randomly in the visual field. Represents the irregular vision loss patterns from retinal detachment and glaucoma progression.'
  },
  {
    id: 'miltonRetinalDetachment',
    name: 'Retinal Detachment Shadows (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Dark shadows or curtains descending from top or sides, representing the retinal detachment that contributed to Milton\'s vision loss. Includes wavy/distorted vision (metamorphopsia).'
  },
  {
    id: 'miltonPhotophobia',
    name: 'Extreme Photophobia (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Extreme light sensitivity causing pain and discomfort in normal lighting. Simulates the photophobia that made normal lighting conditions unbearable for Milton.'
  },
  {
    id: 'miltonTemporalFieldLoss',
    name: 'Temporal Field Loss (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Vision loss starting from the outer sides (temples) moving inward - like black curtains slowly closing from the periphery. Represents the early stage of Milton\'s glaucoma progression.'
  },
  {
    id: 'miltonProgressiveBlindness',
    name: 'Progressive Blindness (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Milton\'s 7-year progression from partial vision at age 36 to complete blindness at 43. Combines all symptoms with increasing severity over time.'
  },
  {
    id: 'completeBlindness',
    name: 'Complete Blindness (No Light Perception)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete absence of light perception - total darkness. Represents conditions like Louis Braille\'s sympathetic ophthalmia, where there is no visual input whatsoever. The person experiences complete blackness with no ability to detect light, shapes, or movement.'
  }
];
