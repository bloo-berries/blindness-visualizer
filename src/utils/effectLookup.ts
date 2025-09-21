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
 * Gets multiple effects by IDs with O(1) performance per lookup
 */
export const getEffectsByIds = (
  effectMap: Map<string, VisualEffect>, 
  ids: string[]
): (VisualEffect | undefined)[] => {
  return ids.map(id => effectMap.get(id));
};

/**
 * Gets all enabled effects with O(n) single pass
 */
export const getEnabledEffects = (effects: VisualEffect[]): VisualEffect[] => {
  return effects.filter(effect => effect.enabled);
};

/**
 * Gets effects by category/type with O(n) single pass
 */
export const getEffectsByCategory = (
  effects: VisualEffect[], 
  categoryPredicate: (effect: VisualEffect) => boolean
): VisualEffect[] => {
  return effects.filter(categoryPredicate);
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

/**
 * Creates a lookup map for specific effect types
 * Useful for grouping effects by category (e.g., color vision, field loss, etc.)
 */
export const createCategoryMap = (
  effects: VisualEffect[],
  categoryKey: (effect: VisualEffect) => string
): Map<string, VisualEffect[]> => {
  const categoryMap = new Map<string, VisualEffect[]>();
  
  effects.forEach(effect => {
    const category = categoryKey(effect);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(effect);
  });
  
  return categoryMap;
};

/**
 * Batch effect operations for better performance
 * Processes multiple effects in a single pass
 */
export const batchEffectOperations = <T>(
  effects: VisualEffect[],
  operations: Array<{
    predicate: (effect: VisualEffect) => boolean;
    processor: (effect: VisualEffect) => T;
  }>
): T[] => {
  const results: T[] = [];
  
  effects.forEach(effect => {
    operations.forEach(({ predicate, processor }) => {
      if (predicate(effect)) {
        results.push(processor(effect));
      }
    });
  });
  
  return results;
};

/**
 * Optimized effect intensity calculation
 * Calculates combined intensity for multiple effects
 */
export const calculateCombinedIntensity = (
  effects: VisualEffect[],
  predicate: (effect: VisualEffect) => boolean
): number => {
  let combinedIntensity = 0;
  let count = 0;
  
  for (const effect of effects) {
    if (effect.enabled && predicate(effect)) {
      combinedIntensity += effect.intensity;
      count++;
    }
  }
  
  return count > 0 ? Math.min(1.0, combinedIntensity / count) : 0;
};
