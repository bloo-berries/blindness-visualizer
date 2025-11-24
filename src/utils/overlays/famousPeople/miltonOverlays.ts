import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';

/**
 * Creates overlays for John Milton-specific conditions
 */
export const createMiltonOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  const miltonProgressiveVignetting = getEffect('miltonProgressiveVignetting');
  const miltonRetinalDetachment = getEffect('miltonRetinalDetachment');
  const miltonGlaucomaHalos = getEffect('miltonGlaucomaHalos');
  const miltonPhotophobia = getEffect('miltonPhotophobia');
  const miltonTemporalFieldLoss = getEffect('miltonTemporalFieldLoss');
  const completeBlindness = getEffect('completeBlindness');

  // Progressive Vignetting
  if (miltonProgressiveVignetting?.enabled) {
    const intensity = miltonProgressiveVignetting.intensity;
    const tunnelRadius = Math.max(5, 40 - intensity * 35);
    
    createOverlay(
      'visual-field-overlay-miltonProgressiveVignetting',
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
      'miltonProgressiveVignetting'
    );
  }

  // Temporal Field Loss
  if (miltonTemporalFieldLoss?.enabled) {
    const intensity = miltonTemporalFieldLoss.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonTemporalFieldLoss',
      `linear-gradient(90deg, 
        rgba(0,0,0,${0.95 * intensity}) 0%,
        rgba(0,0,0,${0.95 * intensity}) 20%,
        rgba(0,0,0,0) 30%,
        rgba(0,0,0,0) 70%,
        rgba(0,0,0,${0.95 * intensity}) 80%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'miltonTemporalFieldLoss'
    );
  }

  // Retinal Detachment
  if (miltonRetinalDetachment?.enabled) {
    const intensity = miltonRetinalDetachment.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonRetinalDetachment',
      `linear-gradient(180deg, 
        rgba(0,0,0,${0.8 * intensity}) 0%,
        rgba(0,0,0,${0.8 * intensity}) 30%,
        rgba(0,0,0,0) 40%,
        rgba(0,0,0,0) 60%,
        rgba(0,0,0,${0.6 * intensity}) 70%,
        rgba(0,0,0,${0.6 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.8, intensity).toString(),
      undefined,
      undefined,
      'miltonRetinalDetachment'
    );
  }

  // Photophobia
  if (miltonPhotophobia?.enabled) {
    const intensity = miltonPhotophobia.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonPhotophobia',
      `rgba(255,255,255,${0.6 * intensity})`,
      'screen',
      Math.min(0.6, intensity).toString(),
      `brightness(${1 + intensity * 2}) contrast(${1 - intensity * 0.7})`,
      undefined,
      'miltonPhotophobia'
    );
  }

  // Glaucoma Halos
  if (miltonGlaucomaHalos?.enabled) {
    const intensity = miltonGlaucomaHalos.intensity;

    createOverlayWithContainer(
      'visual-field-overlay-miltonGlaucomaHalos',
      `conic-gradient(from 0deg at 50% 50%,
        rgba(255,255,255,${intensity * 0.3}) 0deg,
        rgba(255,0,0,${intensity * 0.2}) 60deg,
        rgba(255,255,0,${intensity * 0.2}) 120deg,
        rgba(0,255,0,${intensity * 0.2}) 180deg,
        rgba(0,255,255,${intensity * 0.2}) 240deg,
        rgba(0,0,255,${intensity * 0.2}) 300deg,
        rgba(255,255,255,${intensity * 0.3}) 360deg
      )`,
      'screen',
      Math.min(0.6, intensity).toString(),
      `blur(${intensity * 3}px)`,
      undefined,
      'miltonGlaucomaHalos',
      container
    );
  }

  // Complete Blindness
  if (completeBlindness?.enabled) {
    const intensity = completeBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-completeBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'completeBlindness'
    );
  }
};

