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
        rgba(55,55,55,${0.85 * tunnelVision.intensity}) ${Math.max(40, 55 - tunnelVision.intensity * 20)}%,
        rgba(35,35,35,${0.85 * tunnelVision.intensity}) 100%
      )`,
      'normal',
      Math.min(0.85, tunnelVision.intensity).toString(),
      'blur(1px)',
      undefined,
      'tunnelVision'
    );
  }

  // Quadrantanopia Left
  if (quadrantanopiaLeft?.enabled) {
    const qli = quadrantanopiaLeft.intensity === 1 ? 1 : 0.85 * quadrantanopiaLeft.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaLeft',
      `conic-gradient(from 0deg at 50% 50%,
        rgba(50,50,50,0) 0deg,
        rgba(50,50,50,0) 90deg,
        rgba(50,50,50,${qli}) 90deg,
        rgba(50,50,50,${qli}) 180deg,
        rgba(50,50,50,0) 180deg,
        rgba(50,50,50,0) 360deg
      )`,
      'normal',
      (quadrantanopiaLeft.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaLeft.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaLeft'
    );
  }

  // Quadrantanopia Right
  if (quadrantanopiaRight?.enabled) {
    const qri = quadrantanopiaRight.intensity === 1 ? 1 : 0.85 * quadrantanopiaRight.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaRight',
      `radial-gradient(circle at 0% 100%,
        rgba(50,50,50,0) 0%,
        rgba(50,50,50,0) ${Math.max(25, 40 - quadrantanopiaRight.intensity * 20)}%,
        rgba(50,50,50,1) ${Math.max(45, 60 - quadrantanopiaRight.intensity * 20)}%,
        rgba(50,50,50,1) 100%
      )`,
      'normal',
      (quadrantanopiaRight.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaRight.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaRight'
    );
  }

  // Quadrantanopia Inferior Left (bottom-left quadrant)
  if (quadrantanopiaInferiorLeft?.enabled) {
    const inferiorLeftIntensity = quadrantanopiaInferiorLeft.intensity === 1 ? 1 : 0.85 * quadrantanopiaInferiorLeft.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferiorLeft',
      `radial-gradient(ellipse 100% 100% at 0% 100%,
        rgba(50,50,50,${inferiorLeftIntensity}) 0%,
        rgba(50,50,50,${inferiorLeftIntensity}) 65%,
        rgba(50,50,50,${inferiorLeftIntensity * 0.6}) 72%,
        rgba(50,50,50,${inferiorLeftIntensity * 0.2}) 80%,
        rgba(50,50,50,0) 85%
      )`,
      'normal',
      (quadrantanopiaInferiorLeft.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaInferiorLeft.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferiorLeft'
    );
  }

  // Quadrantanopia Inferior Right (bottom-right quadrant)
  if (quadrantanopiaInferiorRight?.enabled) {
    const inferiorRightIntensity = quadrantanopiaInferiorRight.intensity === 1 ? 1 : 0.85 * quadrantanopiaInferiorRight.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferiorRight',
      `radial-gradient(ellipse 100% 100% at 100% 100%,
        rgba(50,50,50,${inferiorRightIntensity}) 0%,
        rgba(50,50,50,${inferiorRightIntensity}) 65%,
        rgba(50,50,50,${inferiorRightIntensity * 0.6}) 72%,
        rgba(50,50,50,${inferiorRightIntensity * 0.2}) 80%,
        rgba(50,50,50,0) 85%
      )`,
      'normal',
      (quadrantanopiaInferiorRight.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaInferiorRight.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferiorRight'
    );
  }

  // Quadrantanopia Superior Left (top-left quadrant)
  if (quadrantanopiaSuperiorLeft?.enabled) {
    const superiorLeftIntensity = quadrantanopiaSuperiorLeft.intensity === 1 ? 1 : 0.85 * quadrantanopiaSuperiorLeft.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperiorLeft',
      `radial-gradient(ellipse 100% 100% at 0% 0%,
        rgba(50,50,50,${superiorLeftIntensity}) 0%,
        rgba(50,50,50,${superiorLeftIntensity}) 65%,
        rgba(50,50,50,${superiorLeftIntensity * 0.6}) 72%,
        rgba(50,50,50,${superiorLeftIntensity * 0.2}) 80%,
        rgba(50,50,50,0) 85%
      )`,
      'normal',
      (quadrantanopiaSuperiorLeft.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaSuperiorLeft.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperiorLeft'
    );
  }

  // Quadrantanopia Superior Right (top-right quadrant)
  if (quadrantanopiaSuperiorRight?.enabled) {
    const superiorRightIntensity = quadrantanopiaSuperiorRight.intensity === 1 ? 1 : 0.85 * quadrantanopiaSuperiorRight.intensity;
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperiorRight',
      `radial-gradient(ellipse 100% 100% at 100% 0%,
        rgba(50,50,50,${superiorRightIntensity}) 0%,
        rgba(50,50,50,${superiorRightIntensity}) 65%,
        rgba(50,50,50,${superiorRightIntensity * 0.6}) 72%,
        rgba(50,50,50,${superiorRightIntensity * 0.2}) 80%,
        rgba(50,50,50,0) 85%
      )`,
      'normal',
      (quadrantanopiaSuperiorRight.intensity === 1 ? 1 : Math.min(0.85, quadrantanopiaSuperiorRight.intensity)).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperiorRight'
    );
  }

  // Hemianopia Left
  if (hemianopiaLeft?.enabled) {
    const hlOpacity = hemianopiaLeft.intensity === 1 ? 1 : 0.85 * hemianopiaLeft.intensity;
    createOverlay(
      'visual-field-overlay-hemianopiaLeft',
      `linear-gradient(to right,
        rgba(50,50,50,${hlOpacity}) 0%,
        rgba(50,50,50,${hlOpacity}) 45%,
        rgba(50,50,50,0) 50%
      )`,
      'normal',
      (hemianopiaLeft.intensity === 1 ? 1 : Math.min(0.85, hemianopiaLeft.intensity)).toString(),
      undefined,
      undefined,
      'hemianopiaLeft'
    );
  }

  // Hemianopia Right
  if (hemianopiaRight?.enabled) {
    const hrOpacity = hemianopiaRight.intensity === 1 ? 1 : 0.85 * hemianopiaRight.intensity;
    createOverlay(
      'visual-field-overlay-hemianopiaRight',
      `linear-gradient(to left,
        rgba(50,50,50,${hrOpacity}) 0%,
        rgba(50,50,50,${hrOpacity}) 45%,
        rgba(50,50,50,0) 50%
      )`,
      'normal',
      (hemianopiaRight.intensity === 1 ? 1 : Math.min(0.85, hemianopiaRight.intensity)).toString(),
      undefined,
      undefined,
      'hemianopiaRight'
    );
  }

  // Blindness Left Eye
  if (blindnessLeftEye?.enabled) {
    const isTotal = blindnessLeftEye.intensity === 1;
    const grayVal = isTotal ? 0 : 50;
    const leftEyeIntensity = isTotal ? 1 : 0.85 * blindnessLeftEye.intensity;
    createOverlay(
      'visual-field-overlay-blindnessLeftEye',
      `linear-gradient(to right,
        rgba(${grayVal},${grayVal},${grayVal},${leftEyeIntensity}) 0%,
        rgba(${grayVal},${grayVal},${grayVal},${leftEyeIntensity}) 47.5%,
        rgba(${grayVal},${grayVal},${grayVal},${leftEyeIntensity * 0.7}) 48.75%,
        rgba(${grayVal},${grayVal},${grayVal},${leftEyeIntensity * 0.4}) 50%,
        rgba(${grayVal},${grayVal},${grayVal},${leftEyeIntensity * 0.1}) 51.25%,
        rgba(0,0,0,0) 52.5%
      )`,
      'normal',
      (isTotal ? 1 : Math.min(0.85, blindnessLeftEye.intensity)).toString(),
      undefined,
      undefined,
      'blindnessLeftEye'
    );
  }

  // Blindness Right Eye
  if (blindnessRightEye?.enabled) {
    const isTotal = blindnessRightEye.intensity === 1;
    const grayVal = isTotal ? 0 : 50;
    const rightEyeIntensity = isTotal ? 1 : 0.85 * blindnessRightEye.intensity;
    createOverlay(
      'visual-field-overlay-blindnessRightEye',
      `linear-gradient(to left,
        rgba(${grayVal},${grayVal},${grayVal},${rightEyeIntensity}) 0%,
        rgba(${grayVal},${grayVal},${grayVal},${rightEyeIntensity}) 47.5%,
        rgba(${grayVal},${grayVal},${grayVal},${rightEyeIntensity * 0.7}) 48.75%,
        rgba(${grayVal},${grayVal},${grayVal},${rightEyeIntensity * 0.4}) 50%,
        rgba(${grayVal},${grayVal},${grayVal},${rightEyeIntensity * 0.1}) 51.25%,
        rgba(0,0,0,0) 52.5%
      )`,
      'normal',
      (isTotal ? 1 : Math.min(0.85, blindnessRightEye.intensity)).toString(),
      undefined,
      undefined,
      'blindnessRightEye'
    );
  }

  // Bitemporal Hemianopia
  if (bitemporalHemianopia?.enabled) {
    const bitemporalIntensity = bitemporalHemianopia.intensity === 1 ? 1 : 0.85 * bitemporalHemianopia.intensity;
    createOverlay(
      'visual-field-overlay-bitemporalHemianopia',
      `linear-gradient(to right,
        rgba(50,50,50,${bitemporalIntensity}) 0%,
        rgba(50,50,50,${bitemporalIntensity}) 22.5%,
        rgba(50,50,50,${bitemporalIntensity * 0.7}) 23.75%,
        rgba(50,50,50,${bitemporalIntensity * 0.4}) 25%,
        rgba(50,50,50,${bitemporalIntensity * 0.1}) 26.25%,
        rgba(50,50,50,0) 27.5%,
        rgba(50,50,50,0) 72.5%,
        rgba(50,50,50,${bitemporalIntensity * 0.1}) 73.75%,
        rgba(50,50,50,${bitemporalIntensity * 0.4}) 75%,
        rgba(50,50,50,${bitemporalIntensity * 0.7}) 76.25%,
        rgba(50,50,50,${bitemporalIntensity}) 77.5%,
        rgba(50,50,50,${bitemporalIntensity}) 100%
      )`,
      'normal',
      (bitemporalHemianopia.intensity === 1 ? 1 : Math.min(0.85, bitemporalHemianopia.intensity)).toString(),
      undefined,
      undefined,
      'bitemporalHemianopia'
    );
  }

  // Central Scotoma
  if (scotoma?.enabled) {
    const intensity = scotoma.intensity;
    const scotomaSize = Math.max(15, 10 + intensity * 20);

    createOverlay(
      'visual-field-overlay-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(45,45,45,${0.85 * intensity}) 0%, rgba(45,45,45,${0.75 * intensity}) ${scotomaSize - 5}%, rgba(45,45,45,${0.5 * intensity}) ${scotomaSize}%, rgba(45,45,45,${0.25 * intensity}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'normal',
      Math.min(0.85, intensity).toString(),
      'blur(0.5px)',
      undefined,
      'scotoma'
    );
  }
};

