import { VisualEffect } from '../types/visualEffects';
import { allEffects } from './effects';

/**
 * Complete list of visual effects with descriptions
 * Combined from category-specific files for maintainability
 */
export const VISUAL_EFFECTS: VisualEffect[] = allEffects;

/** Programmatically derived count of all vision conditions */
export const CONDITION_COUNT = allEffects.length;

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
