import { VisualEffect } from '../../../types/visualEffects';

/**
 * Marla Runyan - Stargardt Disease
 */
export const marlaRunyanEffects: VisualEffect[] = [
  {
    id: 'marlaCentralScotoma',
    name: 'Central Scotoma (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Large central blind spot (20-30 degrees) caused by Stargardt macular degeneration. Creates a gray void in the center where objects disappear when looked at directly. Not black but a "gray fog" or "nothingness" that makes faces blank and objects vanish.'
  },
  {
    id: 'marlaPeripheralVision',
    name: 'Preserved Peripheral Vision (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Clear peripheral vision starting at 15-20 degrees from center. Excellent motion detection, navigation, and contrast detection in periphery. Represents the paradox of Stargardt - excellent vision everywhere except where you\'re looking.'
  },
  {
    id: 'marlaEccentricViewing',
    name: 'Eccentric Viewing (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the need to look 10-15 degrees to the side of what you want to see. Shows how Marla must use a "preferred retinal locus" (PRL) and fight the instinct to look directly at objects, which would make them disappear.'
  },
  {
    id: 'marlaFillingIn',
    name: 'Filling-In Phenomenon (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Brain\'s attempt to "fill" the blind spot with surrounding patterns, creating false continuity across the scotoma. Straight lines appear to continue through the blind spot, and the brain tries to complete missing information.'
  },
  {
    id: 'marlaCrowdingEffect',
    name: 'Crowding Effect (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Text and objects in near-periphery appear jumbled and merge together even if technically visible. Letters crowd together and spacing must be increased for recognition. Represents the difficulty of reading with peripheral vision.'
  },
  {
    id: 'marlaStargardtComplete',
    name: 'End-Stage Stargardt Disease (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'TRUE END-STAGE simulation of Marla Runyan\'s Stargardt disease with MASSIVE central scotoma (30-40 degrees), severe gray void in center, minimal brain filling-in, and preserved peripheral vision. Represents the most severe form where faces disappear when looked at directly, but peripheral motion detection remains excellent for athletic navigation.'
  }
];
