import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Marla Runyan-specific conditions (Stargardt Disease)
 */
export const createMarlaRunyanOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const marlaCentralScotoma = getEffect('marlaCentralScotoma');
  const marlaPeripheralVision = getEffect('marlaPeripheralVision');
  const marlaEccentricViewing = getEffect('marlaEccentricViewing');
  const marlaFillingIn = getEffect('marlaFillingIn');
  const marlaCrowdingEffect = getEffect('marlaCrowdingEffect');
  const marlaStargardtComplete = getEffect('marlaStargardtComplete');

  // Marla Runyan - Central Scotoma
  if (marlaCentralScotoma?.enabled) {
    const intensity = marlaCentralScotoma.intensity;
    const scotomaSize = Math.max(20, 15 + intensity * 25);
    const blackIntensity = intensity;

    createOverlay(
      'visual-field-overlay-marlaCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCentralScotoma'
    );
  }

  // Marla Runyan - Peripheral Vision
  if (marlaPeripheralVision?.enabled) {
    const intensity = marlaPeripheralVision.intensity;

    createOverlay(
      'visual-field-overlay-marlaPeripheralVision',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,${intensity * -0.1}) 60%, rgba(0,0,0,${intensity * -0.05}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaPeripheralVision'
    );
  }

  // Marla Runyan - Eccentric Viewing
  if (marlaEccentricViewing?.enabled) {
    const intensity = marlaEccentricViewing.intensity;

    createOverlay(
      'visual-field-overlay-marlaEccentricViewing',
      `radial-gradient(circle at 30% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaEccentricViewing'
    );
  }

  // Marla Runyan - Filling In
  if (marlaFillingIn?.enabled) {
    const intensity = marlaFillingIn.intensity;

    createOverlay(
      'visual-field-overlay-marlaFillingIn',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.3}) 0%, rgba(200,200,200,${intensity * 0.15}) 30%, transparent 40%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaFillingIn'
    );
  }

  // Marla Runyan - Crowding Effect
  if (marlaCrowdingEffect?.enabled) {
    const intensity = marlaCrowdingEffect.intensity;

    createOverlay(
      'visual-field-overlay-marlaCrowdingEffect',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,${intensity * 0.1}) 45%, rgba(0,0,0,${intensity * 0.05}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCrowdingEffect'
    );
  }

  // Marla Runyan - Complete Stargardt
  if (marlaStargardtComplete?.enabled) {
    const intensity = marlaStargardtComplete.intensity;

    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(30,30,30,${intensity}) 0%, rgba(30,30,30,${intensity * 0.95}) 15%, rgba(30,30,30,${intensity * 0.8}) 25%, rgba(30,30,30,${intensity * 0.6}) 35%, rgba(30,30,30,${intensity * 0.4}) 45%, rgba(30,30,30,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma'
    );

    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma-deep',
      `radial-gradient(circle at 50% 50%, rgba(20,20,20,${intensity}) 0%, rgba(20,20,20,${intensity * 0.95}) 15%, rgba(20,20,20,${intensity * 0.8}) 25%, rgba(20,20,20,${intensity * 0.6}) 35%, rgba(20,20,20,${intensity * 0.4}) 45%, rgba(20,20,20,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma-deep'
    );

    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-filling',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.2}) 0%, rgba(200,200,200,${intensity * 0.1}) 25%, rgba(200,200,200,${intensity * 0.05}) 35%, rgba(200,200,200,${intensity * 0.02}) 45%, transparent 55%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-filling'
    );

    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-eccentric',
      `radial-gradient(circle at 20% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 20% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-eccentric'
    );
  }
};
