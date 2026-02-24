import { VisualEffect } from '../../../types/visualEffects';

/**
 * Joseph Plateau - Solar Retinopathy Progression to Total Blindness
 * Damaged retinas via prolonged direct solar observation (~1829)
 * Progressive deterioration over ~14 years to total blindness by ~1843
 * Key features: central scotoma, preserved peripheral (early), afterimages/photopsia, global dimming
 */
export const josephPlateauEffects: VisualEffect[] = [
  {
    id: 'plateauCentralScotoma',
    name: 'Central Scotoma (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'A dark elliptical blind spot in the center of the visual field (10-20°) from solar retinopathy. Not "nothingness" - an opaque dark region obscuring the fixation point. Text, faces, and fine detail become unreadable when looking directly at them.'
  },
  {
    id: 'plateauPeripheralPreserved',
    name: 'Preserved Peripheral Vision (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Early stage: peripheral vision remains functional while central vision is destroyed. Plateau could still navigate using side vision, but anything he looked directly at would disappear into the central scotoma.'
  },
  {
    id: 'plateauAcuityLoss',
    name: 'Severe Acuity Loss (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Fine detail destroyed in the center of vision. Blur increases toward the center of the visual field. Even where vision remained, text and facial features would be unreadable and unrecognizable.'
  },
  {
    id: 'plateauPhotopsia',
    name: 'Persistent Afterimages/Photopsia (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Lingering bright spots and color distortions - phantom light artifacts from retinal damage caused by staring at the sun. These afterimages persist and drift across the visual field, a permanent reminder of the solar exposure.'
  },
  {
    id: 'plateauGlobalDimming',
    name: 'Progressive Global Dimming (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Over ~14 years, remaining peripheral vision progressively darkened and blurred. Brightness and contrast gradually diminish across the entire visual field as the retinal damage spreads, eventually leading to total blindness.'
  },
  {
    id: 'plateauEarlyStage',
    name: 'Early Stage Solar Retinopathy (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Early stage (~1829-1835): Central scotoma with preserved peripheral vision. Dark elliptical blind spot in center, moderate blur increasing toward fixation point, flickering afterimages from retinal damage. Plateau could still work but had difficulty reading and seeing fine detail.'
  },
  {
    id: 'plateauMidStage',
    name: 'Mid Stage Progression (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Mid stage (~1835-1840): Central scotoma expanding, peripheral vision beginning to dim. Global brightness and contrast reducing. Persistent photopsia (bright spots and color distortions). Reading and detailed work becoming impossible.'
  },
  {
    id: 'plateauLateStage',
    name: 'Late Stage Near-Blindness (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Late stage (~1840-1843): Near-total vision loss. Large central scotoma surrounded by severely dimmed, blurry peripheral vision. Brightness reduced to shadows and vague forms. Photopsia continues in the darkness. Navigation barely possible.'
  },
  {
    id: 'plateauComplete',
    name: 'Complete Solar Retinopathy (Joseph Plateau)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Joseph Plateau\'s solar retinopathy at mid-progression. Features dark elliptical central scotoma (10-20°), blur increasing toward center, reduced global brightness and contrast, and persistent afterimage artifacts. Represents the vision that allowed him to continue scientific work with assistance, before total blindness in 1843.'
  }
];
