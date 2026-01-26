import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Christine Ha-specific conditions (Neuromyelitis Optica)
 */
export const createChristineHaOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const christineSteamyMirror = getEffect('christineSteamyMirror');
  const christineLightScatter = getEffect('christineLightScatter');
  const christineFogOverlay = getEffect('christineFogOverlay');
  const christineFluctuatingVision = getEffect('christineFluctuatingVision');
  const christineNMOComplete = getEffect('christineNMOComplete');

  // Christine Ha - Steamy Mirror
  if (christineSteamyMirror?.enabled) {
    const intensity = christineSteamyMirror.intensity;

    createOverlay(
      'visual-field-overlay-christineSteamyMirror',
      `rgba(255,255,255,${intensity * 0.7})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineSteamyMirror'
    );
  }

  // Christine Ha - Light Scatter
  if (christineLightScatter?.enabled) {
    const intensity = christineLightScatter.intensity;

    createOverlay(
      'visual-field-overlay-christineLightScatter',
      `radial-gradient(circle at 30% 20%, rgba(255,255,255,${intensity * 0.4}) 0%, transparent 15%), radial-gradient(circle at 70% 80%, rgba(255,255,255,${intensity * 0.3}) 0%, transparent 12%), radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.2}) 0%, transparent 20%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineLightScatter'
    );
  }

  // Christine Ha - Fog Overlay
  if (christineFogOverlay?.enabled) {
    const intensity = christineFogOverlay.intensity;

    createOverlay(
      'visual-field-overlay-christineFogOverlay',
      `linear-gradient(45deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(240,240,240,${intensity * 0.5}) 25%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(240,240,240,${intensity * 0.4}) 75%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFogOverlay'
    );
  }

  // Christine Ha - Fluctuating Vision
  if (christineFluctuatingVision?.enabled) {
    const intensity = christineFluctuatingVision.intensity;

    createOverlay(
      'visual-field-overlay-christineFluctuatingVision',
      `rgba(255,255,255,${intensity * 0.1})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFluctuatingVision'
    );
  }

  // Christine Ha - Complete NMO
  if (christineNMOComplete?.enabled) {
    const intensity = christineNMOComplete.intensity;

    createOverlay(
      'visual-field-overlay-christineNMOComplete',
      `rgba(255,255,255,${intensity * 0.6})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineNMOComplete'
    );
  }
};
