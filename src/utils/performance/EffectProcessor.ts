/**
 * Optimized effect processing for multiple conditions
 */

import { VisualEffect } from '../../types/visualEffects';

export class EffectProcessor {
  private effectMap = new Map<string, VisualEffect>();
  private enabledEffects: VisualEffect[] = [];
  private lastUpdateHash = '';

  /**
   * Updates effect cache and returns only changed effects
   */
  updateEffects(effects: VisualEffect[]): {
    changed: boolean;
    enabledEffects: VisualEffect[];
    effectMap: Map<string, VisualEffect>;
  } {
    // Create hash of current effects state
    const currentHash = effects
      .map(e => `${e.id}:${e.enabled}:${e.intensity}`)
      .join('|');

    // Only update if effects have changed
    if (currentHash === this.lastUpdateHash) {

      return {
        changed: false,
        enabledEffects: this.enabledEffects,
        effectMap: this.effectMap
      };
    }

    // Update cache
    this.effectMap = new Map(effects.map(effect => [effect.id, effect]));
    this.enabledEffects = effects.filter(effect => effect.enabled);
    this.lastUpdateHash = currentHash;

    return {
      changed: true,
      enabledEffects: this.enabledEffects,
      effectMap: this.effectMap
    };
  }

  /**
   * Gets effect by ID with O(1) performance
   */
  getEffect(id: string): VisualEffect | undefined {
    return this.effectMap.get(id);
  }

  /**
   * Gets multiple effects by IDs
   */
  getEffects(ids: string[]): (VisualEffect | undefined)[] {
    return ids.map(id => this.effectMap.get(id));
  }

  /**
   * Gets all enabled effects
   */
  getEnabledEffects(): VisualEffect[] {
    return this.enabledEffects;
  }

  /**
   * Checks if any effects of a specific type are enabled
   */
  hasEnabledEffect(predicate: (effect: VisualEffect) => boolean): boolean {
    return this.enabledEffects.some(predicate);
  }
}
