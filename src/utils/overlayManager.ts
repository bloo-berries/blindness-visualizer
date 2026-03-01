import { VisualEffect } from '../types/visualEffects';
import { createEffectMap } from './effectLookup';
import { createVisualFieldLossOverlays } from './overlays/visualFieldLossOverlays';
import { createVisualDisturbanceOverlays } from './overlays/visualDisturbanceOverlays';
import { createRetinalDiseaseOverlays } from './overlays/retinalDiseaseOverlays';
import { createFamousPeopleOverlays } from './overlays/famousPeopleOverlays';
import { createOcularOverlays } from './overlays/ocularOverlays';

/**
 * Creates visual field overlays for all enabled effects
 * Delegates to category-specific overlay generators
 */
export const createVisualFieldOverlays = (effects: VisualEffect[], container?: HTMLElement): void => {
  // Remove existing overlays first
  document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());

  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);

  // Delegate to category-based overlay generators
  createVisualFieldLossOverlays(effectMap, container);
  createVisualDisturbanceOverlays(effectMap, container);
  createRetinalDiseaseOverlays(effectMap, container);
  createFamousPeopleOverlays(effectMap, container);
  createOcularOverlays(effectMap);
};
