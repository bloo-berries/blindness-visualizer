import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';

/**
 * Creates Diabetic Retinopathy overlay with microaneurysms, cotton wool spots, and hemorrhage
 */
export function createDiabeticRetinopathyOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  const microaneurysms = `
    radial-gradient(circle 3px at 25% 35%,
      rgba(0,0,0,${0.9 * intensity}) 0%,
      rgba(0,0,0,${0.6 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    ),
    radial-gradient(circle 2px at 65% 55%,
      rgba(0,0,0,${0.8 * intensity}) 0%,
      rgba(0,0,0,${0.5 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    ),
    radial-gradient(circle 4px at 45% 75%,
      rgba(0,0,0,${0.7 * intensity}) 0%,
      rgba(0,0,0,${0.4 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    ),
    radial-gradient(circle 2.5px at 80% 25%,
      rgba(0,0,0,${0.85 * intensity}) 0%,
      rgba(0,0,0,${0.55 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    ),
    radial-gradient(circle 3px at 30% 60%,
      rgba(0,0,0,${0.75 * intensity}) 0%,
      rgba(0,0,0,${0.45 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    ),
    radial-gradient(circle 2px at 70% 40%,
      rgba(0,0,0,${0.8 * intensity}) 0%,
      rgba(0,0,0,${0.5 * intensity}) 50%,
      rgba(0,0,0,0) 100%
    )
  `;

  const cottonWoolSpots = `
    radial-gradient(ellipse 15px 10px at 60% 40%,
      rgba(255,255,255,${0.6 * intensity}) 0%,
      rgba(255,255,255,${0.3 * intensity}) 50%,
      rgba(255,255,255,0) 100%
    ),
    radial-gradient(ellipse 12px 8px at 30% 70%,
      rgba(255,255,255,${0.5 * intensity}) 0%,
      rgba(255,255,255,${0.25 * intensity}) 50%,
      rgba(255,255,255,0) 100%
    ),
    radial-gradient(ellipse 10px 7px at 55% 20%,
      rgba(255,255,255,${0.4 * intensity}) 0%,
      rgba(255,255,255,${0.2 * intensity}) 50%,
      rgba(255,255,255,0) 100%
    )
  `;

  const vitreousHemorrhage = `
    radial-gradient(circle at 50% 50%,
      rgba(139,0,0,${0.3 * intensity}) 0%,
      rgba(139,0,0,${0.2 * intensity}) 30%,
      rgba(139,0,0,${0.1 * intensity}) 60%,
      rgba(139,0,0,0) 100%
    )
  `;

  const background = `${microaneurysms}, ${cottonWoolSpots}, ${vitreousHemorrhage}`;
  const filters = `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-diabeticRetinopathy',
      background,
      'normal',
      Math.min(0.9, intensity).toString(),
      filters,
      undefined,
      'diabeticRetinopathy',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-diabeticRetinopathy',
      background,
      'normal',
      Math.min(0.9, intensity).toString(),
      filters,
      undefined,
      'diabeticRetinopathy'
    );
  }
}
