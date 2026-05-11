import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Abraham Nemeth - Congenital Combined Central + Peripheral Blindness
 * Dual-attack pattern: central scotoma (macular) + peripheral constriction (RP-like)
 * Leaves only fragile mid-peripheral ring, functionally total blindness
 */
export const nemethEffects: VisualEffect[] = [
  effect('nemethCentralScotoma', 'Central Scotoma (Abraham Nemeth)', 'Dark elliptical void at fixation point (10-20\u00b0) from macular degeneration component. Everything looked at directly disappears into darkness. Not nothingness - an opaque dark region obscuring central vision.'),
  effect('nemethPeripheralConstriction', 'Peripheral Constriction (Abraham Nemeth)', 'Black vignette closing in from all edges - tunnel vision ring from retinitis pigmentosa component. The peripheral darkness advances inward, leaving only a narrow mid-peripheral ring between center and edges.'),
  effect('nemethMidRingRemnant', 'Mid-Ring Remnant (Abraham Nemeth)', 'Narrow donut-shaped band of low-acuity, desaturated, blurry vision between the central scotoma and peripheral darkness. Even this surviving ring has poor resolution - heavy Gaussian blur and severe contrast loss.'),
  effect('nemethNightBlindness', 'Severe Night Blindness (Abraham Nemeth)', 'In low-light conditions, everything darkens dramatically - far beyond normal darkness adaptation. Rod cell death eliminates night vision, making navigation in dim light impossible.'),
  effect('nemethAcuityLoss', 'Severe Global Acuity Loss (Abraham Nemeth)', 'Heavy Gaussian blur across the entire visual field. Even the narrow surviving mid-ring has extremely poor resolution - no fine detail, no text reading, no face recognition possible.'),
  effect('nemethPartialRing', 'Partial Vision Ring (Abraham Nemeth)', 'Simulation of the fragile mid-peripheral donut of usable vision. Shows what minimal functional vision might have looked like before complete loss - a narrow blurry ring between two dead zones.'),
  effect('nemethComplete', 'Complete Dual-Attack Blindness (Abraham Nemeth)', 'Complete simulation of Abraham Nemeth\'s congenital dual-attack blindness. Central scotoma from macular component creates void at fixation. Peripheral constriction from RP component creates tunnel closing from edges. Only a narrow mid-peripheral ring survives (if any) - heavily blurred, desaturated, no detail. Given congenital onset and education at school for blind, his functional vision was minimal to none. End state: near-total darkness with possibly faint light/motion perception at best.'),
];
