import { VisualEffect } from '../../../types/visualEffects';
import { findOverlayContainer } from '../sharedOverlayUtils';

import { createFloaterOverlay } from './floaterOverlays';
import {
  createVisualSnowOverlay,
  createVisualSnowFlashingOverlay,
  createVisualSnowColoredOverlay,
  createVisualSnowTransparentOverlay,
  createVisualSnowDenseOverlay
} from './visualSnowOverlays';
import {
  createVisualAuraOverlay,
  createVisualAuraLeftOverlay,
  createVisualAuraRightOverlay
} from './auraOverlays';
import { createHallucinationsOverlay } from './hallucinationOverlays';
import { createBlueFieldOverlay } from './blueFieldOverlays';

// Re-export individual modules for direct imports if needed
export { createFloaterOverlay } from './floaterOverlays';
export {
  createVisualSnowOverlay,
  createVisualSnowFlashingOverlay,
  createVisualSnowColoredOverlay,
  createVisualSnowTransparentOverlay,
  createVisualSnowDenseOverlay
} from './visualSnowOverlays';
export {
  createVisualAuraOverlay,
  createVisualAuraLeftOverlay,
  createVisualAuraRightOverlay
} from './auraOverlays';
export { createHallucinationsOverlay } from './hallucinationOverlays';
export { createBlueFieldOverlay } from './blueFieldOverlays';

/**
 * Creates overlays for visual disturbance conditions
 * Includes: floaters, aura, visual snow, hallucinations
 */
export const createVisualDisturbanceOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  // Helper to find container - uses passed container or falls back to shared utility
  const findContainer = (): Element | null => {
    if (container) return container;
    return findOverlayContainer();
  };

  // Visual Floaters
  createFloaterOverlay(getEffect('visualFloaters'), findContainer);

  // Visual Snow variants
  createVisualSnowOverlay(getEffect('visualSnow'), findContainer);
  createVisualSnowFlashingOverlay(getEffect('visualSnowFlashing'), findContainer);
  createVisualSnowColoredOverlay(getEffect('visualSnowColored'), findContainer);
  createVisualSnowTransparentOverlay(getEffect('visualSnowTransparent'), findContainer);
  createVisualSnowDenseOverlay(getEffect('visualSnowDense'), findContainer);

  // Visual Hallucinations (CBS)
  createHallucinationsOverlay(getEffect('hallucinations'), findContainer);

  // Blue Field Entoptic Phenomenon
  createBlueFieldOverlay(getEffect('blueFieldPhenomena'), findContainer);

  // Visual Aura variants
  createVisualAuraOverlay(getEffect('visualAura'), findContainer);
  createVisualAuraLeftOverlay(getEffect('visualAuraLeft'));
  createVisualAuraRightOverlay(getEffect('visualAuraRight'));
};
