import { VisualEffect } from '../types/visualEffects';
import { allEffects } from './effects';

/**
 * Complete list of visual effects with descriptions
 * Combined from category-specific files for maintainability
 */
export const VISUAL_EFFECTS: VisualEffect[] = allEffects;

/**
 * Creates a new visual effects array with default values
 *
 * @returns Array of visual effects with all disabled
 */
export const createDefaultEffects = (): VisualEffect[] => {
  return VISUAL_EFFECTS.map(effect => ({
    ...effect,
    enabled: false,
    intensity: 0.0
  }));
};
