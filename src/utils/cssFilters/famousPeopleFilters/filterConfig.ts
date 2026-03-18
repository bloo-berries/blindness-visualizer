/**
 * Declarative CSS filter configuration system.
 * Eliminates per-effect boilerplate: find/enabled/push/join.
 *
 * Usage:
 *   export const myFilterConfigs: CSSFilterEffectConfig[] = [
 *     { effectId: 'myEffect', filters: i => [`blur(${i * 5}px)`] },
 *   ];
 */

import { VisualEffect } from '../../../types/visualEffects';

export interface CSSFilterEffectConfig {
  /** The effect ID to look up */
  effectId: string;
  /** CSS filter strings as a function of intensity (0-1) */
  filters: (intensity: number) => string[];
  /** Don't apply if any of these effect IDs are currently enabled */
  excludeWhenActive?: string[];
}

/**
 * Process an array of filter configs against current effects.
 * Returns a single CSS filter string (all matching filters joined by space).
 */
export function processCSSFilterConfigs(
  configs: CSSFilterEffectConfig[],
  effects: VisualEffect[]
): string {
  const enabledIds = new Set(
    effects.filter(e => e.enabled).map(e => e.id)
  );

  const results: string[] = [];

  for (const config of configs) {
    if (!enabledIds.has(config.effectId)) continue;
    if (config.excludeWhenActive?.some(id => enabledIds.has(id))) continue;

    const effect = effects.find(e => e.id === config.effectId)!;
    results.push(...config.filters(effect.intensity));
  }

  return results.join(' ');
}
