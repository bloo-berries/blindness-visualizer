import { ConditionType, VisualEffect } from '../types/visualEffects';
import { allEffects } from './effects';

/**
 * Complete list of visual effects with descriptions
 * Combined from category-specific files for maintainability
 */
export const VISUAL_EFFECTS: VisualEffect[] = allEffects;

// Create a Map for O(1) lookup performance
const EFFECT_MAP = new Map(VISUAL_EFFECTS.map(effect => [effect.id, effect]));

/**
 * Gets a visual effect by its ID with O(1) performance
 *
 * @param id - The effect ID to find
 * @returns The visual effect or undefined if not found
 */
export const getVisualEffectById = (id: ConditionType): VisualEffect | undefined => {
  return EFFECT_MAP.get(id);
};

/**
 * Gets all enabled visual effects
 *
 * @param effects - Array of visual effects
 * @returns Array of enabled effects
 */
export const getEnabledEffects = (effects: VisualEffect[]): VisualEffect[] => {
  return effects.filter(effect => effect.enabled);
};

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

// Re-export individual category arrays for direct access
export {
  colorVisionEffects,
  visualFieldEffects,
  visualDisturbanceEffects,
  retinalEffects,
  ocularEffects,
  famousPeopleEffects
} from './effects';
