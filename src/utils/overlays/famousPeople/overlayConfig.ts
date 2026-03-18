/**
 * Declarative overlay configuration system.
 * Eliminates per-effect boilerplate: if/enabled/intensity/createOverlay.
 *
 * Usage:
 *   export const myOverlays: OverlayConfig[] = [
 *     { effectId: 'myEffect', background: i => `rgba(0,0,0,${i})`, blendMode: 'multiply' },
 *   ];
 *   // In the index, wrap with: createOverlayProcessor(myOverlays)
 */

import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';

export interface OverlayConfig {
  /** The effect ID to look up in the effects map */
  effectId: string;
  /** CSS background string as a function of intensity (0-1) */
  background: (i: number) => string;
  /** CSS mix-blend-mode */
  blendMode: string;
  /** Opacity as a function of intensity. Defaults to `i => i.toString()` */
  opacity?: (i: number) => string;
  /** Optional CSS filter as a function of intensity */
  filter?: (i: number) => string;
  /** Optional CSS clip-path as a function of intensity */
  clipPath?: (i: number) => string;
  /** If true, uses createOverlayWithContainer (needs container param) */
  useContainer?: boolean;
  /** Custom overlay ID override (defaults to `visual-field-overlay-${effectId}`) */
  overlayId?: string;
}

/**
 * Process an array of overlay configs against the current effects state.
 */
export function processOverlayConfigs(
  configs: OverlayConfig[],
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void {
  for (const config of configs) {
    const effect = effects.get(config.effectId);
    if (!effect?.enabled) continue;

    const i = effect.intensity;
    const id = config.overlayId ?? `visual-field-overlay-${config.effectId}`;
    const opacity = config.opacity ? config.opacity(i) : i.toString();
    const filter = config.filter?.(i);
    const clipPath = config.clipPath?.(i);

    if (config.useContainer) {
      createOverlayWithContainer(id, config.background(i), config.blendMode, opacity, filter, clipPath, config.effectId, container);
    } else {
      createOverlay(id, config.background(i), config.blendMode, opacity, filter, clipPath, config.effectId);
    }
  }
}

/**
 * Creates a standard overlay processor function from a config array.
 * Returns a function with the standard (effects, container?) signature.
 */
export function createOverlayProcessor(configs: OverlayConfig[]) {
  return (effects: Map<string, VisualEffect>, container?: HTMLElement): void => {
    processOverlayConfigs(configs, effects, container);
  };
}
