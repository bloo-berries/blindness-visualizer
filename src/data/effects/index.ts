/**
 * Visual Effects Index
 * Combines all effect categories into a single export
 */

import { colorVisionEffects } from './colorVisionEffects';
import { visualFieldEffects } from './visualFieldEffects';
import { visualDisturbanceEffects } from './visualDisturbanceEffects';
import { retinalEffects } from './retinalEffects';
import { ocularEffects } from './ocularEffects';
import { famousPeopleEffects } from './famousPeopleEffects';
import { VisualEffect } from '../../types/visualEffects';

// Re-export individual category arrays
export { colorVisionEffects } from './colorVisionEffects';
export { visualFieldEffects } from './visualFieldEffects';
export { visualDisturbanceEffects } from './visualDisturbanceEffects';
export { retinalEffects } from './retinalEffects';
export { ocularEffects } from './ocularEffects';
export { famousPeopleEffects } from './famousPeopleEffects';

/**
 * Combined array of all visual effects
 */
export const allEffects: VisualEffect[] = [
  ...visualFieldEffects,
  ...visualDisturbanceEffects,
  ...colorVisionEffects,
  ...ocularEffects,
  ...retinalEffects,
  ...famousPeopleEffects
];
