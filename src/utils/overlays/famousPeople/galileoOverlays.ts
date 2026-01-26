import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Galileo Galilei-specific conditions (Acute Angle-Closure Glaucoma)
 */
export const createGalileoOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const galileoSectoralDefects = getEffect('galileoSectoralDefects');
  const galileoArcuateScotomas = getEffect('galileoArcuateScotomas');
  const galileoSwissCheeseVision = getEffect('galileoSwissCheeseVision');
  const galileoChronicProgression = getEffect('galileoChronicProgression');

  // Galileo - Sectoral Defects
  if (galileoSectoralDefects?.enabled) {
    const intensity = galileoSectoralDefects.intensity;

    createOverlay(
      'visual-field-overlay-galileoSectoralDefects',
      `conic-gradient(from 45deg at 30% 20%,
        rgba(0,0,0,${0.9 * intensity}) 0deg,
        rgba(0,0,0,${0.9 * intensity}) 90deg,
        rgba(0,0,0,0) 90deg,
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSectoralDefects'
    );
  }

  // Galileo - Arcuate Scotomas
  if (galileoArcuateScotomas?.enabled) {
    const intensity = galileoArcuateScotomas.intensity;

    createOverlay(
      'visual-field-overlay-galileoArcuateScotomas',
      `radial-gradient(ellipse 200px 50px at 50% 50%,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) 40%,
        rgba(0,0,0,${0.8 * intensity}) 45%,
        rgba(0,0,0,${0.8 * intensity}) 55%,
        rgba(0,0,0,0) 60%,
        rgba(0,0,0,0) 100%
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoArcuateScotomas'
    );
  }

  // Galileo - Swiss Cheese Vision
  if (galileoSwissCheeseVision?.enabled) {
    const intensity = galileoSwissCheeseVision.intensity;

    createOverlay(
      'visual-field-overlay-galileoSwissCheeseVision',
      `radial-gradient(circle at 20% 30%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 60% 20%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 4%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 80% 60%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 30% 70%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 2%, rgba(0,0,0,0) 2%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 70% 80%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSwissCheeseVision'
    );
  }

  // Galileo - Chronic Progression
  if (galileoChronicProgression?.enabled) {
    const intensity = galileoChronicProgression.intensity;
    const tunnelRadius = Math.max(10, 50 - intensity * 40);

    createOverlay(
      'visual-field-overlay-galileoChronicProgression',
      `radial-gradient(circle at 50% 50%,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 5}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'galileoChronicProgression'
    );
  }
};
