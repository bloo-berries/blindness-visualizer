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
  const quadrantanopiaInferior = getEffect('quadrantanopiaInferior');
  const quadrantanopiaSuperior = getEffect('quadrantanopiaSuperior');
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

  // Quadrantanopia Inferior
  if (quadrantanopiaInferior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,${quadrantanopiaInferior.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferior.intensity}) 0deg, 
        rgba(0,0,0,${quadrantanopiaInferior.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferior.intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      quadrantanopiaInferior.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaInferior.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaInferior.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferior'
    );
  }

  // Quadrantanopia Superior
  if (quadrantanopiaSuperior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${quadrantanopiaSuperior.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperior.intensity}) 90deg, 
        rgba(0,0,0,${quadrantanopiaSuperior.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperior.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      quadrantanopiaSuperior.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaSuperior.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaSuperior.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperior'
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
    createOverlay(
      'visual-field-overlay-blindnessLeftEye',
      `linear-gradient(to right, 
        rgba(0,0,0,${blindnessLeftEye.intensity === 1 ? 1 : 0.95 * blindnessLeftEye.intensity}) 0%, 
        rgba(0,0,0,${blindnessLeftEye.intensity === 1 ? 1 : 0.95 * blindnessLeftEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
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
    createOverlay(
      'visual-field-overlay-blindnessRightEye',
      `linear-gradient(to left, 
        rgba(0,0,0,${blindnessRightEye.intensity === 1 ? 1 : 0.95 * blindnessRightEye.intensity}) 0%, 
        rgba(0,0,0,${blindnessRightEye.intensity === 1 ? 1 : 0.95 * blindnessRightEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
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
    createOverlay(
      'visual-field-overlay-bitemporalHemianopia',
      `linear-gradient(to right, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 0%, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 25%, 
        rgba(0,0,0,0) 25%,
        rgba(0,0,0,0) 75%,
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 75%, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 100%
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

