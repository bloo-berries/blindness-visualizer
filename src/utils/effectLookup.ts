/**
 * Optimized effect lookup utilities
 * Provides O(1) lookup performance for visual effects instead of O(n) array.find operations
 */

import { VisualEffect } from '../types/visualEffects';

/**
 * Creates a Map-based lookup for visual effects
 * Provides O(1) access instead of O(n) array.find operations
 */
export const createEffectMap = (effects: VisualEffect[]): Map<string, VisualEffect> => {
  return new Map(effects.map(effect => [effect.id, effect]));
};

/**
 * Gets an effect by ID with O(1) performance
 */
export const getEffectById = (effectMap: Map<string, VisualEffect>, id: string): VisualEffect | undefined => {
  return effectMap.get(id);
};

/**
 * Gets the first enabled effect matching a predicate
 */
export const getFirstEnabledEffect = (
  effects: VisualEffect[],
  predicate: (effect: VisualEffect) => boolean
): VisualEffect | undefined => {
  return effects.find(effect => effect.enabled && predicate(effect));
};
