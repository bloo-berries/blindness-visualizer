import { VisualEffect } from '../../../types/visualEffects';
import { findOverlayContainer } from '../sharedOverlayUtils';

import {
  createVisualAuraOverlay,
  createVisualAuraLeftOverlay,
  createVisualAuraRightOverlay
} from './auraOverlays';
import { createHallucinationsOverlay } from './hallucinationOverlays';
import { createBlueFieldOverlay } from './blueFieldOverlays';

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

  // Visual Floaters and Visual Snow variants are rendered via React-based useVisualFieldOverlay hook

  // Visual Hallucinations (CBS)
  createHallucinationsOverlay(getEffect('hallucinations'), findContainer);

  // Blue Field Entoptic Phenomenon
  createBlueFieldOverlay(getEffect('blueFieldPhenomena'), findContainer);

  // Visual Aura variants
  createVisualAuraOverlay(getEffect('visualAura'), findContainer);
  createVisualAuraLeftOverlay(getEffect('visualAuraLeft'));
  createVisualAuraRightOverlay(getEffect('visualAuraRight'));
};
