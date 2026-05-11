import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Marla Runyan - Stargardt Disease
 */
export const marlaRunyanEffects: VisualEffect[] = [
  effect('marlaCentralScotoma', 'Central Scotoma (Marla Runyan)', 'Large central blind spot (20-30 degrees) caused by Stargardt macular degeneration. Creates a gray void in the center where objects disappear when looked at directly. Not black but a "gray fog" or "nothingness" that makes faces blank and objects vanish.'),
  effect('marlaPeripheralVision', 'Preserved Peripheral Vision (Marla Runyan)', 'Clear peripheral vision starting at 15-20 degrees from center. Excellent motion detection, navigation, and contrast detection in periphery. Represents the paradox of Stargardt - excellent vision everywhere except where you\'re looking.'),
  effect('marlaEccentricViewing', 'Eccentric Viewing (Marla Runyan)', 'Simulates the need to look 10-15 degrees to the side of what you want to see. Shows how Marla must use a "preferred retinal locus" (PRL) and fight the instinct to look directly at objects, which would make them disappear.'),
  effect('marlaFillingIn', 'Filling-In Phenomenon (Marla Runyan)', 'Brain\'s attempt to "fill" the blind spot with surrounding patterns, creating false continuity across the scotoma. Straight lines appear to continue through the blind spot, and the brain tries to complete missing information.'),
  effect('marlaCrowdingEffect', 'Crowding Effect (Marla Runyan)', 'Text and objects in near-periphery appear jumbled and merge together even if technically visible. Letters crowd together and spacing must be increased for recognition. Represents the difficulty of reading with peripheral vision.'),
  effect('marlaStargardtComplete', 'End-Stage Stargardt Disease (Marla Runyan)', 'TRUE END-STAGE simulation of Marla Runyan\'s Stargardt disease with MASSIVE central scotoma (30-40 degrees), severe gray void in center, minimal brain filling-in, and preserved peripheral vision. Represents the most severe form where faces disappear when looked at directly, but peripheral motion detection remains excellent for athletic navigation.'),
];
