import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Joshua Miele-specific conditions (Chemical Burn Blindness)
 */
export const createJoshuaMieleOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const joshuaCompleteBlindness = getEffect('joshuaCompleteBlindness');
  const joshuaEcholocation = getEffect('joshuaEcholocation');
  const joshuaTactileMaps = getEffect('joshuaTactileMaps');
  const joshuaAudioLandscape = getEffect('joshuaAudioLandscape');
  const joshuaAccessibilityMode = getEffect('joshuaAccessibilityMode');
  const joshuaSonification = getEffect('joshuaSonification');

  // Joshua Miele - Complete Blindness
  if (joshuaCompleteBlindness?.enabled) {
    const intensity = joshuaCompleteBlindness.intensity;

    createOverlay(
      'visual-field-overlay-joshuaCompleteBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaCompleteBlindness'
    );
  }

  // Joshua Miele - Echolocation
  if (joshuaEcholocation?.enabled) {
    const intensity = joshuaEcholocation.intensity;

    createOverlay(
      'visual-field-overlay-joshuaEcholocation',
      `radial-gradient(circle at 50% 50%, rgba(0,255,0,${intensity * 0.3}) 0%, rgba(0,255,0,${intensity * 0.2}) 20%, rgba(0,255,0,${intensity * 0.1}) 40%, transparent 60%), radial-gradient(circle at 30% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaEcholocation'
    );
  }

  // Joshua Miele - Tactile Maps
  if (joshuaTactileMaps?.enabled) {
    const intensity = joshuaTactileMaps.intensity;

    createOverlay(
      'visual-field-overlay-joshuaTactileMaps',
      `linear-gradient(0deg, rgba(255,255,255,${intensity * 0.4}) 0%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(255,255,255,${intensity * 0.4}) 100%), linear-gradient(90deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(255,255,255,${intensity * 0.1}) 50%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaTactileMaps'
    );
  }

  // Joshua Miele - Audio Landscape
  if (joshuaAudioLandscape?.enabled) {
    const intensity = joshuaAudioLandscape.intensity;

    createOverlay(
      'visual-field-overlay-joshuaAudioLandscape',
      `radial-gradient(circle at 20% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 20% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 50% 50%, rgba(0,0,255,${intensity * 0.2}) 0%, transparent 4%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAudioLandscape'
    );
  }

  // Joshua Miele - Accessibility Mode
  if (joshuaAccessibilityMode?.enabled) {
    const intensity = joshuaAccessibilityMode.intensity;

    createOverlay(
      'visual-field-overlay-joshuaAccessibilityMode',
      `linear-gradient(0deg, rgba(255,255,0,${intensity * 0.3}) 0%, rgba(255,255,0,${intensity * 0.1}) 50%, rgba(255,255,0,${intensity * 0.3}) 100%), linear-gradient(90deg, rgba(255,255,0,${intensity * 0.2}) 0%, rgba(255,255,0,${intensity * 0.05}) 50%, rgba(255,255,0,${intensity * 0.2}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAccessibilityMode'
    );
  }

  // Joshua Miele - Sonification
  if (joshuaSonification?.enabled) {
    const intensity = joshuaSonification.intensity;

    createOverlay(
      'visual-field-overlay-joshuaSonification',
      `radial-gradient(circle at 25% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 25% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaSonification'
    );
  }
};
