import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';

/**
 * Creates overlays for visual field loss conditions
 * Includes: hemianopia, quadrantanopia, tunnel vision, scotoma, blindness
 */
export const createVisualFieldLossOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  const tunnelVision = getEffect('tunnelVision');
  const quadrantanopiaLeft = getEffect('quadrantanopiaLeft');
  const quadrantanopiaRight = getEffect('quadrantanopiaRight');
  const quadrantanopiaInferiorLeft = getEffect('quadrantanopiaInferiorLeft');
  const quadrantanopiaInferiorRight = getEffect('quadrantanopiaInferiorRight');
  const quadrantanopiaSuperiorLeft = getEffect('quadrantanopiaSuperiorLeft');
  const quadrantanopiaSuperiorRight = getEffect('quadrantanopiaSuperiorRight');
  const hemianopiaLeft = getEffect('hemianopiaLeft');
  const hemianopiaRight = getEffect('hemianopiaRight');
  const blindnessLeftEye = getEffect('blindnessLeftEye');
  const blindnessRightEye = getEffect('blindnessRightEye');
  const bitemporalHemianopia = getEffect('bitemporalHemianopia');
  const scotoma = getEffect('scotoma');

  // Tunnel Vision
  if (tunnelVision?.enabled) {
    createOverlay(
      'visual-field-overlay-tunnelVision',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(20, 35 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) ${Math.max(40, 55 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, tunnelVision.intensity).toString(),
      undefined,
      undefined,
      'tunnelVision'
    );
  }

  // Quadrantanopia Left
  if (quadrantanopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaLeft',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaLeft.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaLeft'
    );
  }

  // Quadrantanopia Right
  if (quadrantanopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaRight',
      `radial-gradient(circle at 0% 100%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(25, 40 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,1) ${Math.max(45, 60 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,1) 100%
      )`,
      'normal',
      '1',
      undefined,
      undefined,
      'quadrantanopiaRight'
    );
  }

  // Quadrantanopia Inferior Left (bottom-left quadrant)
  if (quadrantanopiaInferiorLeft?.enabled) {
    const inferiorLeftIntensity = quadrantanopiaInferiorLeft.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferiorLeft.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferiorLeft',
      `radial-gradient(ellipse 100% 100% at 0% 100%,
        rgba(0,0,0,${inferiorLeftIntensity}) 0%,
        rgba(0,0,0,${inferiorLeftIntensity}) 65%,
        rgba(0,0,0,${inferiorLeftIntensity * 0.8}) 70%,
        rgba(0,0,0,${inferiorLeftIntensity * 0.5}) 75%,
        rgba(0,0,0,${inferiorLeftIntensity * 0.2}) 80%,
        rgba(0,0,0,0) 85%
      )`,
      quadrantanopiaInferiorLeft.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaInferiorLeft.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaInferiorLeft.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferiorLeft'
    );
  }

  // Quadrantanopia Inferior Right (bottom-right quadrant)
  if (quadrantanopiaInferiorRight?.enabled) {
    const inferiorRightIntensity = quadrantanopiaInferiorRight.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferiorRight.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferiorRight',
      `radial-gradient(ellipse 100% 100% at 100% 100%,
        rgba(0,0,0,${inferiorRightIntensity}) 0%,
        rgba(0,0,0,${inferiorRightIntensity}) 65%,
        rgba(0,0,0,${inferiorRightIntensity * 0.8}) 70%,
        rgba(0,0,0,${inferiorRightIntensity * 0.5}) 75%,
        rgba(0,0,0,${inferiorRightIntensity * 0.2}) 80%,
        rgba(0,0,0,0) 85%
      )`,
      quadrantanopiaInferiorRight.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaInferiorRight.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaInferiorRight.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferiorRight'
    );
  }

  // Quadrantanopia Superior Left (top-left quadrant)
  if (quadrantanopiaSuperiorLeft?.enabled) {
    const superiorLeftIntensity = quadrantanopiaSuperiorLeft.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperiorLeft.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperiorLeft',
      `radial-gradient(ellipse 100% 100% at 0% 0%,
        rgba(0,0,0,${superiorLeftIntensity}) 0%,
        rgba(0,0,0,${superiorLeftIntensity}) 65%,
        rgba(0,0,0,${superiorLeftIntensity * 0.8}) 70%,
        rgba(0,0,0,${superiorLeftIntensity * 0.5}) 75%,
        rgba(0,0,0,${superiorLeftIntensity * 0.2}) 80%,
        rgba(0,0,0,0) 85%
      )`,
      quadrantanopiaSuperiorLeft.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaSuperiorLeft.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaSuperiorLeft.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperiorLeft'
    );
  }

  // Quadrantanopia Superior Right (top-right quadrant)
  if (quadrantanopiaSuperiorRight?.enabled) {
    const superiorRightIntensity = quadrantanopiaSuperiorRight.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperiorRight.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperiorRight',
      `radial-gradient(ellipse 100% 100% at 100% 0%,
        rgba(0,0,0,${superiorRightIntensity}) 0%,
        rgba(0,0,0,${superiorRightIntensity}) 65%,
        rgba(0,0,0,${superiorRightIntensity * 0.8}) 70%,
        rgba(0,0,0,${superiorRightIntensity * 0.5}) 75%,
        rgba(0,0,0,${superiorRightIntensity * 0.2}) 80%,
        rgba(0,0,0,0) 85%
      )`,
      quadrantanopiaSuperiorRight.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaSuperiorRight.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaSuperiorRight.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperiorRight'
    );
  }

  // Hemianopia Left
  if (hemianopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaLeft',
      `linear-gradient(to right, 
        rgba(0,0,0,${hemianopiaLeft.intensity === 1 ? 1 : 0.95 * hemianopiaLeft.intensity}) 0%, 
        rgba(0,0,0,${hemianopiaLeft.intensity === 1 ? 1 : 0.95 * hemianopiaLeft.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      hemianopiaLeft.intensity === 1 ? 'normal' : 'multiply',
      hemianopiaLeft.intensity === 1 ? '1' : Math.min(0.95, hemianopiaLeft.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaLeft'
    );
  }

  // Hemianopia Right
  if (hemianopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaRight',
      `linear-gradient(to left, 
        rgba(0,0,0,${hemianopiaRight.intensity === 1 ? 1 : 0.95 * hemianopiaRight.intensity}) 0%, 
        rgba(0,0,0,${hemianopiaRight.intensity === 1 ? 1 : 0.95 * hemianopiaRight.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      hemianopiaRight.intensity === 1 ? 'normal' : 'multiply',
      hemianopiaRight.intensity === 1 ? '1' : Math.min(0.95, hemianopiaRight.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaRight'
    );
  }

  // Blindness Left Eye
  if (blindnessLeftEye?.enabled) {
    const leftEyeIntensity = blindnessLeftEye.intensity === 1 ? 1 : 0.95 * blindnessLeftEye.intensity;
    createOverlay(
      'visual-field-overlay-blindnessLeftEye',
      `linear-gradient(to right, 
        rgba(0,0,0,${leftEyeIntensity}) 0%, 
        rgba(0,0,0,${leftEyeIntensity}) 47.5%, 
        rgba(0,0,0,${leftEyeIntensity * 0.7}) 48.75%,
        rgba(0,0,0,${leftEyeIntensity * 0.4}) 50%,
        rgba(0,0,0,${leftEyeIntensity * 0.1}) 51.25%,
        rgba(0,0,0,0) 52.5%
      )`,
      blindnessLeftEye.intensity === 1 ? 'normal' : 'multiply',
      blindnessLeftEye.intensity === 1 ? '1' : Math.min(0.95, blindnessLeftEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessLeftEye'
    );
  }

  // Blindness Right Eye
  if (blindnessRightEye?.enabled) {
    const rightEyeIntensity = blindnessRightEye.intensity === 1 ? 1 : 0.95 * blindnessRightEye.intensity;
    createOverlay(
      'visual-field-overlay-blindnessRightEye',
      `linear-gradient(to left, 
        rgba(0,0,0,${rightEyeIntensity}) 0%, 
        rgba(0,0,0,${rightEyeIntensity}) 47.5%, 
        rgba(0,0,0,${rightEyeIntensity * 0.7}) 48.75%,
        rgba(0,0,0,${rightEyeIntensity * 0.4}) 50%,
        rgba(0,0,0,${rightEyeIntensity * 0.1}) 51.25%,
        rgba(0,0,0,0) 52.5%
      )`,
      blindnessRightEye.intensity === 1 ? 'normal' : 'multiply',
      blindnessRightEye.intensity === 1 ? '1' : Math.min(0.95, blindnessRightEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessRightEye'
    );
  }

  // Bitemporal Hemianopia
  if (bitemporalHemianopia?.enabled) {
    const bitemporalIntensity = bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity;
    createOverlay(
      'visual-field-overlay-bitemporalHemianopia',
      `linear-gradient(to right, 
        rgba(0,0,0,${bitemporalIntensity}) 0%, 
        rgba(0,0,0,${bitemporalIntensity}) 22.5%, 
        rgba(0,0,0,${bitemporalIntensity * 0.7}) 23.75%,
        rgba(0,0,0,${bitemporalIntensity * 0.4}) 25%,
        rgba(0,0,0,${bitemporalIntensity * 0.1}) 26.25%,
        rgba(0,0,0,0) 27.5%,
        rgba(0,0,0,0) 72.5%,
        rgba(0,0,0,${bitemporalIntensity * 0.1}) 73.75%,
        rgba(0,0,0,${bitemporalIntensity * 0.4}) 75%,
        rgba(0,0,0,${bitemporalIntensity * 0.7}) 76.25%,
        rgba(0,0,0,${bitemporalIntensity}) 77.5%, 
        rgba(0,0,0,${bitemporalIntensity}) 100%
      )`,
      bitemporalHemianopia.intensity === 1 ? 'normal' : 'multiply',
      bitemporalHemianopia.intensity === 1 ? '1' : Math.min(0.95, bitemporalHemianopia.intensity).toString(),
      undefined,
      undefined,
      'bitemporalHemianopia'
    );
  }

  // Central Scotoma
  if (scotoma?.enabled) {
    const intensity = scotoma.intensity;
    const scotomaSize = Math.max(15, 10 + intensity * 20);
    const blackIntensity = intensity;
    
    createOverlay(
      'visual-field-overlay-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'scotoma'
    );
  }
};

