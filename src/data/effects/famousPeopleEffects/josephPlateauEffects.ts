import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Joseph Plateau - Solar Retinopathy Progression to Total Blindness
 * Damaged retinas via prolonged direct solar observation (~1829)
 * Progressive deterioration over ~14 years to total blindness by ~1843
 * Key features: central scotoma, preserved peripheral (early), afterimages/photopsia, global dimming
 */
export const josephPlateauEffects: VisualEffect[] = [
  effect('plateauCentralScotoma', 'Central Scotoma (Joseph Plateau)', 'A dark elliptical blind spot in the center of the visual field (10-20\u00b0) from solar retinopathy. Not "nothingness" - an opaque dark region obscuring the fixation point. Text, faces, and fine detail become unreadable when looking directly at them.'),
  effect('plateauPeripheralPreserved', 'Preserved Peripheral Vision (Joseph Plateau)', 'Early stage: peripheral vision remains functional while central vision is destroyed. Plateau could still navigate using side vision, but anything he looked directly at would disappear into the central scotoma.'),
  effect('plateauAcuityLoss', 'Severe Acuity Loss (Joseph Plateau)', 'Fine detail destroyed in the center of vision. Blur increases toward the center of the visual field. Even where vision remained, text and facial features would be unreadable and unrecognizable.'),
  effect('plateauPhotopsia', 'Persistent Afterimages/Photopsia (Joseph Plateau)', 'Lingering bright spots and color distortions - phantom light artifacts from retinal damage caused by staring at the sun. These afterimages persist and drift across the visual field, a permanent reminder of the solar exposure.'),
  effect('plateauGlobalDimming', 'Progressive Global Dimming (Joseph Plateau)', 'Over ~14 years, remaining peripheral vision progressively darkened and blurred. Brightness and contrast gradually diminish across the entire visual field as the retinal damage spreads, eventually leading to total blindness.'),
  effect('plateauEarlyStage', 'Early Stage Solar Retinopathy (Joseph Plateau)', 'Early stage (~1829-1835): Central scotoma with preserved peripheral vision. Dark elliptical blind spot in center, moderate blur increasing toward fixation point, flickering afterimages from retinal damage. Plateau could still work but had difficulty reading and seeing fine detail.'),
  effect('plateauMidStage', 'Mid Stage Progression (Joseph Plateau)', 'Mid stage (~1835-1840): Central scotoma expanding, peripheral vision beginning to dim. Global brightness and contrast reducing. Persistent photopsia (bright spots and color distortions). Reading and detailed work becoming impossible.'),
  effect('plateauLateStage', 'Late Stage Near-Blindness (Joseph Plateau)', 'Late stage (~1840-1843): Near-total vision loss. Large central scotoma surrounded by severely dimmed, blurry peripheral vision. Brightness reduced to shadows and vague forms. Photopsia continues in the darkness. Navigation barely possible.'),
  effect('plateauComplete', 'Complete Solar Retinopathy (Joseph Plateau)', 'Complete simulation of Joseph Plateau\'s solar retinopathy at mid-progression. Features dark elliptical central scotoma (10-20\u00b0), blur increasing toward center, reduced global brightness and contrast, and persistent afterimage artifacts. Represents the vision that allowed him to continue scientific work with assistance, before total blindness in 1843.'),
];
