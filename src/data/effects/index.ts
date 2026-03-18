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
