import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Jose Cid's monocular vision condition
 *
 * Condition: Left eye anophthalmic (prosthetic) - complete vision loss
 * Right eye: Normal/corrected vision
 *
 * Visual effects:
 * - Left peripheral field loss (~25-30% of viewport)
 * - Abrupt cutoff with soft gradient edge (2-5% width)
 * - Central and right vision remain intact
 * - Reduced overall field of view from ~200° to ~150°
 */
export const createJoseCidOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const joseCidMonocular = getEffect('joseCidMonocularVision');

  // Jose Cid - Monocular Vision (Left Eye Blindness)
  // Complete left eye blindness - covers full left half of vision
  // Soft gradient transition at center
  if (joseCidMonocular?.enabled) {
    const intensity = joseCidMonocular.intensity;

    // Full left half vision loss with soft center transition
    createOverlay(
      'visual-field-overlay-joseCidMonocular',
      `linear-gradient(to right,
        rgba(0,0,0,${intensity}) 0%,
        rgba(0,0,0,${intensity}) 45%,
        rgba(0,0,0,${intensity * 0.7}) 48%,
        rgba(0,0,0,${intensity * 0.4}) 50%,
        rgba(0,0,0,${intensity * 0.1}) 52%,
        rgba(0,0,0,0) 55%
      )`,
      'normal',
      '1',
      undefined,
      undefined,
      'joseCidMonocular'
    );
  }
};
