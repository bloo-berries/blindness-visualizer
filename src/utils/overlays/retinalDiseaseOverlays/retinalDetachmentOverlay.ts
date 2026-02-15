import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';

/**
 * Creates Retinal Detachment overlay with curtain-like field loss
 */
export function createRetinalDetachmentOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  const background = `linear-gradient(to bottom,
    rgba(0,0,0,${0.9 * intensity}) 0%,
    rgba(0,0,0,${0.8 * intensity}) 15%,
    rgba(0,0,0,${0.6 * intensity}) 30%,
    rgba(0,0,0,${0.4 * intensity}) 45%,
    rgba(0,0,0,${0.2 * intensity}) 60%,
    rgba(0,0,0,0) 75%
  )`;

  const filters = `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-retinalDetachment',
      background,
      'multiply',
      Math.min(0.8, intensity).toString(),
      filters,
      undefined,
      'retinalDetachment',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-retinalDetachment',
      background,
      'multiply',
      Math.min(0.8, intensity).toString(),
      filters,
      undefined,
      'retinalDetachment'
    );
  }
}
