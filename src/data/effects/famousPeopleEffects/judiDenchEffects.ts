import { VisualEffect } from '../../../types/visualEffects';

/**
 * Dame Judi Dench - Age-Related Macular Degeneration (AMD)
 * "I can see your outline" but "I can't recognize anybody now"
 * Central vision loss with preserved peripheral vision
 */
export const judiDenchEffects: VisualEffect[] = [
  {
    id: 'judiCentralScotoma',
    name: 'Central Scotoma (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Central blind spot from AMD affecting the macula. Creates a dark or blurry area in the center of vision where faces and text would normally be seen. Peripheral vision around the edges remains clear.'
  },
  {
    id: 'judiPeripheralPreserved',
    name: 'Preserved Peripheral Vision (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Clear peripheral (side) vision characteristic of AMD. While central vision is lost, the outer edges of the visual field remain functional, allowing navigation and seeing general shapes and outlines.'
  },
  {
    id: 'judiFaceBlindness',
    name: 'Face Recognition Loss (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Inability to recognize faces due to central vision loss. As Judi describes: "I can\'t recognize anybody now" - she can see outlines but loses all facial detail when looking directly at someone.'
  },
  {
    id: 'judiReadingLoss',
    name: 'Reading Difficulty (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of ability to read standard text due to central scotoma. Judi needed scripts in 22-point font before her vision worsened further. Now relies on friends to read and repeat lines to her.'
  },
  {
    id: 'judiAMDComplete',
    name: 'Complete AMD Vision (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Judi Dench\'s AMD as she describes it: "I can see your outline" but "I can\'t recognize anybody now...I can\'t see the television...I can\'t see to read." Central vision is lost while peripheral vision remains, allowing her to navigate but not see faces or details.'
  }
];
