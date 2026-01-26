import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for David Paterson-specific conditions (Hemispheric Vision Loss)
 */
export const createDavidPatersonOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const davidLeftEyeBlindness = getEffect('davidLeftEyeBlindness');
  const davidRightEyeGlaucoma = getEffect('davidRightEyeGlaucoma');
  const davidHemisphericVision = getEffect('davidHemisphericVision');
  const davidCompleteVision = getEffect('davidCompleteVision');

  // David Paterson - Left Eye Blindness
  if (davidLeftEyeBlindness?.enabled) {
    const intensity = davidLeftEyeBlindness.intensity;

    createOverlay(
      'visual-field-overlay-davidLeftEyeBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidLeftEyeBlindness'
    );
  }

  // David Paterson - Right Eye Glaucoma
  if (davidRightEyeGlaucoma?.enabled) {
    const intensity = davidRightEyeGlaucoma.intensity;

    createOverlay(
      'visual-field-overlay-davidRightEyeGlaucoma',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.1}) 0%, rgba(255,255,200,${intensity * 0.18}) 50%, rgba(255,255,180,${intensity * 0.1}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidRightEyeGlaucoma'
    );
  }

  // David Paterson - Hemispheric Vision
  if (davidHemisphericVision?.enabled) {
    const intensity = davidHemisphericVision.intensity;

    createOverlay(
      'visual-field-overlay-davidHemisphericVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidHemisphericVision-left'
    );

    createOverlay(
      'visual-field-overlay-davidHemisphericVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidHemisphericVision-right'
    );
  }

  // David Paterson - Complete Vision
  if (davidCompleteVision?.enabled) {
    const intensity = davidCompleteVision.intensity;

    createOverlay(
      'visual-field-overlay-davidCompleteVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidCompleteVision-left'
    );

    createOverlay(
      'visual-field-overlay-davidCompleteVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidCompleteVision-right'
    );
  }
};
