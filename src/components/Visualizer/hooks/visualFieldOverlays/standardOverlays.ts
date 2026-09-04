/**
 * Standard visual field overlay generators
 * RP, Stargardt, AMD, DR, Glaucoma, Tunnel Vision, Hemianopia, Scotoma,
 * Blindness L/R, Retinal Detachment, Bitemporal Hemianopia, Quadrantanopia
 */

import { generatePuckeringWaves, STARGARDT_PUCKERING, AMD_PUCKERING, SCOTOMA_PUCKERING } from './puckeringUtils';
import { clampOpacity, scaledOpacity } from '../../../../utils/overlays/sharedOverlayUtils';

/** Base styles shared by all overlay generators */
export const OVERLAY_BASE: Pick<React.CSSProperties, 'position' | 'top' | 'left' | 'right' | 'bottom' | 'width' | 'height' | 'pointerEvents' | 'zIndex'> = {
  position: 'absolute' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none' as const,
  zIndex: 9999
};

/**
 * Generate Retinitis Pigmentosa overlay (tunnel vision)
 */
export function generateRetinitisPigmentosaOverlay(intensity: number): React.CSSProperties {
  const tunnelRadius = Math.max(3, 30 - intensity * 27);

  return {
    ...OVERLAY_BASE,
    background: `radial-gradient(ellipse 100% 130% at 50% 50%,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${tunnelRadius - 2}%,
      rgba(55,55,55,${0.3 * intensity}) ${tunnelRadius}%,
      rgba(45,45,45,${0.7 * intensity}) ${tunnelRadius + 3}%,
      rgba(35,35,35,${0.85 * intensity}) ${tunnelRadius + 8}%,
      rgba(35,35,35,${0.85 * intensity}) 100%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.85, intensity),
    filter: 'blur(1px) contrast(75%)'
  };
}

/**
 * Generate Stargardt Disease overlay (central vision loss)
 */
export function generateStargardtOverlay(intensity: number): React.CSSProperties {
  const scotomaRadius = 17 + intensity * 53;
  const puckeringWaves = generatePuckeringWaves(intensity, STARGARDT_PUCKERING);

  const mainScotoma = `radial-gradient(circle at 50% 50%,
    rgba(10,10,10,${0.99 * intensity}) 0%,
    rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
    rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
    rgba(0,0,0,0) ${scotomaRadius + 5}%
  )`;

  return {
    ...OVERLAY_BASE,
    background: [mainScotoma, ...puckeringWaves].join(', '),
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity),
    filter: `saturate(${1 - intensity * 0.4})`
  };
}

/**
 * Generate AMD (Age-Related Macular Degeneration) overlay
 */
export function generateAmdOverlay(intensity: number): React.CSSProperties {
  const amdRadius = Math.max(15, 52 - intensity * 37);
  const puckeringWaves = generatePuckeringWaves(intensity, AMD_PUCKERING);

  const mainScotoma = `radial-gradient(circle at 50% 50%,
    rgba(0,0,0,${0.95 * intensity}) 0%,
    rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
    rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
    rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
    rgba(0,0,0,0) ${amdRadius + 10}%
  )`;

  return {
    ...OVERLAY_BASE,
    background: [mainScotoma, ...puckeringWaves].join(', '),
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
  };
}

/**
 * Generate Diabetic Retinopathy overlay
 */
export function generateDiabeticRetinopathyOverlay(intensity: number): React.CSSProperties {
  // Microaneurysms - small dark hemorrhage spots scattered across vision
  const microaneurysms = `
    radial-gradient(circle 8px at 25% 35%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.6 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 6px at 65% 55%, rgba(0,0,0,${0.8 * intensity}) 0%, rgba(0,0,0,${0.5 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 10px at 45% 75%, rgba(0,0,0,${0.7 * intensity}) 0%, rgba(0,0,0,${0.4 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 7px at 80% 25%, rgba(0,0,0,${0.85 * intensity}) 0%, rgba(0,0,0,${0.55 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 9px at 30% 60%, rgba(0,0,0,${0.75 * intensity}) 0%, rgba(0,0,0,${0.45 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 6px at 70% 40%, rgba(0,0,0,${0.8 * intensity}) 0%, rgba(0,0,0,${0.5 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 8px at 15% 20%, rgba(0,0,0,${0.7 * intensity}) 0%, rgba(0,0,0,${0.4 * intensity}) 50%, rgba(0,0,0,0) 100%),
    radial-gradient(circle 5px at 85% 70%, rgba(0,0,0,${0.75 * intensity}) 0%, rgba(0,0,0,${0.45 * intensity}) 50%, rgba(0,0,0,0) 100%)
  `;

  // Cotton wool spots - fluffy white patches from nerve fiber damage
  const cottonWoolSpots = `
    radial-gradient(ellipse 30px 20px at 60% 40%, rgba(255,255,255,${0.6 * intensity}) 0%, rgba(255,255,255,${0.3 * intensity}) 50%, rgba(255,255,255,0) 100%),
    radial-gradient(ellipse 25px 18px at 30% 70%, rgba(255,255,255,${0.5 * intensity}) 0%, rgba(255,255,255,${0.25 * intensity}) 50%, rgba(255,255,255,0) 100%),
    radial-gradient(ellipse 22px 15px at 55% 20%, rgba(255,255,255,${0.4 * intensity}) 0%, rgba(255,255,255,${0.2 * intensity}) 50%, rgba(255,255,255,0) 100%)
  `;

  // Red tint from blood vessel damage
  const redTint = `
    radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,0,0,${0.15 * intensity}) 0%, transparent 70%),
    linear-gradient(to bottom, transparent 70%, rgba(180,0,0,${0.3 * intensity}) 90%, rgba(150,0,0,${0.5 * intensity}) 100%)
  `;

  return {
    ...OVERLAY_BASE,
    background: `${microaneurysms}, ${cottonWoolSpots}, ${redTint}`,
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.9, intensity),
    filter: `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) sepia(${intensity * 20}%)`
  };
}

/**
 * Generate Glaucoma overlay with arcuate defects, nasal step, and paracentral scotomas.
 * Ported from retinalDiseaseOverlays/glaucomaOverlay.ts for hook-based rendering.
 */
export function generateGlaucomaOverlay(intensity: number): React.CSSProperties {
  // Tighter contraction so peripheral loss is visible at moderate intensities
  const fieldRadius = Math.max(12, 75 - intensity * 63);
  const fadeWidth = Math.max(8, fieldRadius * 0.3);
  const fadeStart = fieldRadius - fadeWidth;
  const grayEdge = 30;
  const grayMid = 50;

  // Main peripheral field loss gradient
  const peripheralLoss = `radial-gradient(ellipse 100% 110% at 50% 50%,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0) ${fadeStart}%,
    rgba(${grayMid},${grayMid},${grayMid},${0.5 * intensity}) ${fadeStart + fadeWidth * 0.3}%,
    rgba(${(grayMid + grayEdge) / 2},${(grayMid + grayEdge) / 2},${(grayMid + grayEdge) / 2},${0.75 * intensity}) ${fadeStart + fadeWidth * 0.6}%,
    rgba(${grayEdge},${grayEdge},${grayEdge},${0.9 * intensity}) ${fieldRadius}%,
    rgba(${grayEdge},${grayEdge},${grayEdge},${0.95 * intensity}) 100%
  )`;

  const arcuatePatterns: string[] = [];

  // Superior arcuate defect (more common, appears above fixation)
  if (intensity > 0.15) {
    const superiorArcOpacity = Math.min(0.9, (intensity - 0.15) * 1.8);
    arcuatePatterns.push(`radial-gradient(ellipse 65% 28% at 50% 22%,
      rgba(${grayEdge},${grayEdge},${grayEdge},${superiorArcOpacity}) 0%,
      rgba(${grayEdge + 10},${grayEdge + 10},${grayEdge + 10},${superiorArcOpacity * 0.7}) 50%,
      rgba(${grayMid},${grayMid},${grayMid},${superiorArcOpacity * 0.3}) 75%,
      transparent 100%
    )`);
  }

  // Inferior arcuate defect (appears below fixation)
  if (intensity > 0.3) {
    const inferiorArcOpacity = Math.min(0.85, (intensity - 0.3) * 1.6);
    arcuatePatterns.push(`radial-gradient(ellipse 60% 25% at 50% 78%,
      rgba(${grayEdge},${grayEdge},${grayEdge},${inferiorArcOpacity}) 0%,
      rgba(${grayEdge + 10},${grayEdge + 10},${grayEdge + 10},${inferiorArcOpacity * 0.6}) 55%,
      rgba(${grayMid},${grayMid},${grayMid},${inferiorArcOpacity * 0.25}) 80%,
      transparent 100%
    )`);
  }

  // Nasal step - characteristic wedge-shaped defect on the nasal side
  if (intensity > 0.25) {
    const nasalStepOpacity = Math.min(0.8, (intensity - 0.25) * 1.4);
    arcuatePatterns.push(`conic-gradient(from 170deg at 12% 50%,
      rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity}) 0deg,
      rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity * 0.8}) 15deg,
      rgba(${grayMid},${grayMid},${grayMid},${nasalStepOpacity * 0.4}) 25deg,
      transparent 35deg,
      transparent 325deg,
      rgba(${grayMid},${grayMid},${grayMid},${nasalStepOpacity * 0.3}) 340deg,
      rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity * 0.6}) 355deg,
      rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity}) 360deg
    )`);
  }

  // Paracentral scotomas (early glaucoma - small defects near fixation)
  if (intensity > 0.1 && intensity < 0.7) {
    const paracentralOpacity = Math.min(0.7, intensity * 1.2);
    arcuatePatterns.push(`radial-gradient(circle 5% at 40% 36%,
      rgba(${grayEdge},${grayEdge},${grayEdge},${paracentralOpacity}) 0%,
      rgba(${grayMid},${grayMid},${grayMid},${paracentralOpacity * 0.5}) 50%,
      transparent 100%
    )`);
    arcuatePatterns.push(`radial-gradient(circle 4% at 60% 64%,
      rgba(${grayEdge},${grayEdge},${grayEdge},${paracentralOpacity * 0.8}) 0%,
      rgba(${grayMid},${grayMid},${grayMid},${paracentralOpacity * 0.4}) 50%,
      transparent 100%
    )`);
  }

  // Element opacity: floor of 0.5 so the effect is always visible when enabled
  const elementOpacity = Math.min(0.95, 0.5 + intensity * 0.45);

  return {
    ...OVERLAY_BASE,
    background: [peripheralLoss, ...arcuatePatterns].join(', '),
    mixBlendMode: 'normal' as const,
    opacity: elementOpacity,
    filter: `blur(${intensity * 1.2}px) contrast(${100 - intensity * 30}%) brightness(${100 - intensity * 10}%)`
  };
}

/**
 * Generate Tunnel Vision overlay
 */
export function generateTunnelVisionOverlay(intensity: number): React.CSSProperties {
  const clearRadius = Math.max(20, 35 - intensity * 20);

  return {
    ...OVERLAY_BASE,
    background: `radial-gradient(circle at 50% 50%,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${clearRadius}%,
      rgba(55,55,55,${0.85 * intensity}) ${Math.max(40, 55 - intensity * 20)}%,
      rgba(35,35,35,${0.85 * intensity}) 100%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.85, intensity),
    filter: 'blur(1px)'
  };
}

/**
 * Generate Hemianopia Left overlay
 */
export function generateHemianopiaLeftOverlay(intensity: number): React.CSSProperties {
  const maxOpacity = scaledOpacity(intensity);
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(50,50,50,${maxOpacity}) 0%,
      rgba(50,50,50,${maxOpacity}) 45%,
      rgba(50,50,50,0) 50%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: clampOpacity(intensity)
  };
}

/**
 * Generate Hemianopia Right overlay
 */
export function generateHemianopiaRightOverlay(intensity: number): React.CSSProperties {
  const maxOpacity = scaledOpacity(intensity);
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to left,
      rgba(50,50,50,${maxOpacity}) 0%,
      rgba(50,50,50,${maxOpacity}) 45%,
      rgba(50,50,50,0) 50%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: clampOpacity(intensity)
  };
}

/**
 * Generate Scotoma overlay
 */
export function generateScotomaOverlay(intensity: number): React.CSSProperties {
  const scotomaEdge = Math.max(20, 35 - intensity * 15);
  const puckeringWaves = generatePuckeringWaves(intensity, SCOTOMA_PUCKERING);

  const mainScotoma = `radial-gradient(circle at 50% 50%,
    rgba(45,45,45,${0.85 * intensity}) 0%,
    rgba(45,45,45,${0.75 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
    rgba(45,45,45,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
    rgba(45,45,45,0) ${scotomaEdge}%
  )`;

  return {
    ...OVERLAY_BASE,
    background: [mainScotoma, ...puckeringWaves].join(', '),
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.85, intensity),
    filter: 'blur(0.5px)'
  };
}

/**
 * Generate Blindness Left Eye overlay (monocular vision loss - left side)
 */
export function generateBlindnessLeftEyeOverlay(intensity: number): React.CSSProperties {
  // At full intensity, keep opaque black for total blindness; otherwise use gray
  const isTotal = intensity === 1;
  const grayVal = isTotal ? 0 : 50;
  const eyeIntensity = scaledOpacity(intensity);
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity}) 0%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity}) 47.5%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.7}) 48.75%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.4}) 50%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.1}) 51.25%,
      rgba(0,0,0,0) 52.5%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: clampOpacity(intensity)
  };
}

/**
 * Generate Blindness Right Eye overlay (monocular vision loss - right side)
 */
export function generateBlindnessRightEyeOverlay(intensity: number): React.CSSProperties {
  const isTotal = intensity === 1;
  const grayVal = isTotal ? 0 : 50;
  const eyeIntensity = scaledOpacity(intensity);
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to left,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity}) 0%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity}) 47.5%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.7}) 48.75%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.4}) 50%,
      rgba(${grayVal},${grayVal},${grayVal},${eyeIntensity * 0.1}) 51.25%,
      rgba(0,0,0,0) 52.5%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: clampOpacity(intensity)
  };
}

/**
 * Generate Retinal Detachment overlay (curtain-like shadow from top)
 */
export function generateRetinalDetachmentOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to bottom,
      rgba(60,60,60,${0.75 * intensity}) 0%,
      rgba(60,60,60,${0.65 * intensity}) 15%,
      rgba(60,60,60,${0.5 * intensity}) 30%,
      rgba(60,60,60,${0.35 * intensity}) 45%,
      rgba(60,60,60,${0.2 * intensity}) 60%,
      rgba(60,60,60,0) 75%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.75, intensity),
    filter: `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`
  };
}

/**
 * Generate Bitemporal Hemianopia overlay (loss of temporal/outer halves of both eyes)
 */
export function generateBitemporalHemianopiaOverlay(intensity: number): React.CSSProperties {
  const i = scaledOpacity(intensity);
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(50,50,50,${i}) 0%,
      rgba(50,50,50,${i}) 22.5%,
      rgba(50,50,50,${i * 0.7}) 23.75%,
      rgba(50,50,50,${i * 0.4}) 25%,
      rgba(50,50,50,${i * 0.1}) 26.25%,
      rgba(50,50,50,0) 27.5%,
      rgba(50,50,50,0) 72.5%,
      rgba(50,50,50,${i * 0.1}) 73.75%,
      rgba(50,50,50,${i * 0.4}) 75%,
      rgba(50,50,50,${i * 0.7}) 76.25%,
      rgba(50,50,50,${i}) 77.5%,
      rgba(50,50,50,${i}) 100%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: clampOpacity(intensity)
  };
}

/**
 * Generate Quadrantanopia overlay for a given quadrant
 */
export function generateQuadrantanopiaOverlay(
  quadrant: 'left' | 'right' | 'inferiorLeft' | 'inferiorRight' | 'superiorLeft' | 'superiorRight',
  intensity: number
): React.CSSProperties {
  const i = scaledOpacity(intensity);
  const opacity = clampOpacity(intensity);

  const gradientMap: Record<string, string> = {
    left: `conic-gradient(from 0deg at 50% 50%,
      rgba(50,50,50,0) 0deg, rgba(50,50,50,0) 90deg,
      rgba(50,50,50,${i}) 90deg, rgba(50,50,50,${i}) 180deg,
      rgba(50,50,50,0) 180deg, rgba(50,50,50,0) 360deg)`,
    right: `radial-gradient(circle at 0% 100%,
      rgba(50,50,50,0) 0%, rgba(50,50,50,0) ${Math.max(25, 40 - intensity * 20)}%,
      rgba(50,50,50,1) ${Math.max(45, 60 - intensity * 20)}%, rgba(50,50,50,1) 100%)`,
    inferiorLeft: `radial-gradient(ellipse 100% 100% at 0% 100%,
      rgba(50,50,50,${i}) 0%, rgba(50,50,50,${i}) 65%,
      rgba(50,50,50,${i * 0.6}) 72%, rgba(50,50,50,${i * 0.2}) 80%, rgba(50,50,50,0) 85%)`,
    inferiorRight: `radial-gradient(ellipse 100% 100% at 100% 100%,
      rgba(50,50,50,${i}) 0%, rgba(50,50,50,${i}) 65%,
      rgba(50,50,50,${i * 0.6}) 72%, rgba(50,50,50,${i * 0.2}) 80%, rgba(50,50,50,0) 85%)`,
    superiorLeft: `radial-gradient(ellipse 100% 100% at 0% 0%,
      rgba(50,50,50,${i}) 0%, rgba(50,50,50,${i}) 65%,
      rgba(50,50,50,${i * 0.6}) 72%, rgba(50,50,50,${i * 0.2}) 80%, rgba(50,50,50,0) 85%)`,
    superiorRight: `radial-gradient(ellipse 100% 100% at 100% 0%,
      rgba(50,50,50,${i}) 0%, rgba(50,50,50,${i}) 65%,
      rgba(50,50,50,${i * 0.6}) 72%, rgba(50,50,50,${i * 0.2}) 80%, rgba(50,50,50,0) 85%)`,
  };

  return {
    ...OVERLAY_BASE,
    background: gradientMap[quadrant],
    mixBlendMode: 'normal' as const,
    opacity,
  };
}

/**
 * Generate Astigmatism overlay with directional ghosting and meridional streaks.
 * Simulates "with-the-rule" astigmatism (most common type) — horizontal meridian blur.
 */
export function generateAstigmatismOverlay(intensity: number): React.CSSProperties {
  const ghostOffset = 2 + intensity * 6; // px equivalent via %
  const ghostOpacity = 0.08 + intensity * 0.15;
  const streakOpacity = 0.06 + intensity * 0.12;

  // Ghost images offset horizontally (with-the-rule astigmatism)
  const ghosts = [
    `linear-gradient(to right, rgba(255,255,255,${ghostOpacity}) 0%, transparent 15%, transparent 85%, rgba(255,255,255,${ghostOpacity}) 100%)`,
    `radial-gradient(ellipse 110% 80% at ${50 + ghostOffset}% 50%, rgba(255,255,255,${ghostOpacity * 0.7}) 0%, transparent 40%)`,
    `radial-gradient(ellipse 110% 80% at ${50 - ghostOffset}% 50%, rgba(255,255,255,${ghostOpacity * 0.6}) 0%, transparent 35%)`,
  ];

  // Directional streaks at 0deg/180deg (horizontal meridian)
  const streaks = [
    `linear-gradient(0deg, transparent 0%, rgba(255,255,255,${streakOpacity}) 40%, rgba(255,255,255,${streakOpacity * 1.2}) 50%, rgba(255,255,255,${streakOpacity}) 60%, transparent 100%)`,
    `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${streakOpacity * 0.7}) 35%, rgba(255,255,255,${streakOpacity * 0.8}) 50%, rgba(255,255,255,${streakOpacity * 0.7}) 65%, transparent 100%)`,
  ];

  return {
    ...OVERLAY_BASE,
    background: [...ghosts, ...streaks].join(', '),
    mixBlendMode: 'screen' as const,
    opacity: Math.min(1, 0.4 + intensity * 0.6),
  };
}

/* ===== Visual Floaters Overlay ===== */

/**
 * Generate Visual Floaters overlay layers
 * Dark semi-transparent shapes that drift slowly across the visual field
 */
export function generateVisualFloatersOverlays(intensity: number): React.CSSProperties[] {
  const opacity = 0.8 + intensity * 0.2;

  const floaterPatterns = [
    `radial-gradient(ellipse 60px 25px at 25% 30%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 50px 20px at 70% 40%, rgba(0,0,0,${opacity * 0.9}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 30px at 50% 65%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 45px 18px at 60% 25%, rgba(0,0,0,${opacity * 0.8}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 35px 15px at 35% 75%, rgba(0,0,0,${opacity * 0.75}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 20px at 80% 55%, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 55px 22px at 15% 50%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 25px at 85% 30%, rgba(0,0,0,${opacity * 0.65}) 0%, rgba(0,0,0,0) 70%)`,
  ];

  const depthPatterns = [
    `radial-gradient(ellipse 40px 18px at 40% 20%, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 22px at 65% 70%, rgba(0,0,0,${opacity * 0.65}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 48px 20px at 20% 60%, rgba(0,0,0,${opacity * 0.75}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 32px 14px at 75% 45%, rgba(0,0,0,${opacity * 0.6}) 0%, rgba(0,0,0,0) 70%)`,
  ];

  return [
    // Main floater layer
    {
      ...OVERLAY_BASE,
      background: floaterPatterns.join(', '),
      animation: 'floaterDrift 8s ease-in-out infinite alternate',
    },
    // Depth layer with offset timing for parallax
    {
      ...OVERLAY_BASE,
      background: depthPatterns.join(', '),
      animation: 'floaterDrift 12s ease-in-out infinite alternate-reverse',
    },
  ];
}

/* ===== Visual Snow Overlays ===== */

/** Helper to generate static dot background patterns */
function generateStaticDots(
  count: number,
  seedA: number,
  seedB: number,
  offsetA: number,
  offsetB: number,
  intensity: number,
  opacityBase: number,
  opacityStep: number,
  sizeBase: number,
  sizeMod: number,
): string[] {
  const dots: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i * seedA + offsetA + (i * i * 0.3)) % 100;
    const y = (i * seedB + offsetB + (i * 0.7)) % 100;
    const size = sizeBase + (i % sizeMod);
    const isBlack = i % 2 === 0;
    const opacity = (opacityBase + (i % 5) * opacityStep) * intensity;
    const color = isBlack ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`;
    dots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
  }
  return dots;
}

/**
 * Generate Visual Snow overlay layers (static particles)
 * Returns multiple overlay styles for layered animation
 */
export function generateVisualSnowOverlays(intensity: number): React.CSSProperties[] {
  const numDots1 = Math.floor(80 + intensity * 120);
  const dots1 = generateStaticDots(numDots1, 13.7, 17.3, 0, 0, intensity, 0.4, 0.1, 1, 3);

  const numDots2 = Math.floor(50 + intensity * 80);
  const dots2 = generateStaticDots(numDots2, 23.1, 19.3, 7, 11, intensity, 0.35, 0.08, 1, 2);

  // Blue field entoptic dots
  const blueFieldDots: string[] = [];
  const numBlue = Math.floor(8 + intensity * 12);
  for (let i = 0; i < numBlue; i++) {
    const x = (i * 29.3 + 5) % 100;
    const y = (i * 37.1 + 15) % 100;
    const size = 2 + (i % 2);
    const brightness = 0.6 + (i % 3) * 0.15;
    blueFieldDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${brightness * intensity}) 0%, rgba(200,230,255,${brightness * intensity * 0.5}) 50%, transparent 100%)`);
  }

  // Photopsia flash spots
  const flashSpots: string[] = [];
  const numFlashes = Math.floor(3 + intensity * 5);
  for (let i = 0; i < numFlashes; i++) {
    const x = (i * 31.7 + 20) % 80 + 10;
    const y = (i * 41.3 + 15) % 70 + 15;
    const size = 8 + (i % 3) * 4;
    const flashOpacity = (0.15 + (i % 2) * 0.1) * intensity;
    flashSpots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,240,${flashOpacity}) 0%, rgba(255,255,200,${flashOpacity * 0.3}) 50%, transparent 100%)`);
  }

  return [
    // Layer 1: Primary static dots
    {
      ...OVERLAY_BASE,
      background: dots1.join(', '),
      animation: 'visualSnowDrift 6s ease-in-out infinite alternate',
    },
    // Layer 2: Secondary dots (async movement)
    {
      ...OVERLAY_BASE,
      background: dots2.join(', '),
      animation: 'visualSnowDrift 9s ease-in-out infinite alternate-reverse',
    },
    // Layer 3: Blue field entoptic + photopsia combined
    {
      ...OVERLAY_BASE,
      background: [...blueFieldDots, ...flashSpots].join(', '),
      animation: 'visualSnowDrift 4s linear infinite',
    },
    // Layer 4: Contrast reduction
    {
      ...OVERLAY_BASE,
      background: `rgba(128,128,128,${0.05 + intensity * 0.1})`,
      mixBlendMode: 'overlay' as const,
    },
  ];
}

/**
 * Generate Visual Snow Flashing overlay
 */
export function generateVisualSnowFlashingOverlays(intensity: number): React.CSSProperties[] {
  const numDots = Math.floor(100 + intensity * 150);
  const dots = generateStaticDots(numDots, 13.7, 17.3, 0, 0, intensity, 0.5, 0.1, 1, 3);

  return [{
    ...OVERLAY_BASE,
    background: dots.join(', '),
    animation: 'visualSnowDrift 0.15s steps(2) infinite',
  }];
}

/**
 * Generate Visual Snow Colored overlay
 */
export function generateVisualSnowColoredOverlays(intensity: number): React.CSSProperties[] {
  const numDots = Math.floor(80 + intensity * 120);
  const colors = [
    'rgba(255,100,100', 'rgba(100,255,100', 'rgba(100,100,255', 'rgba(100,255,255',
    'rgba(255,100,255', 'rgba(255,255,100', 'rgba(255,150,50', 'rgba(150,100,255'
  ];
  const coloredDots: string[] = [];

  for (let i = 0; i < numDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 1 + (i % 3);
    const color = colors[i % colors.length];
    const opacity = (0.4 + (i % 5) * 0.1) * intensity;
    coloredDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${opacity}) 0%, transparent 100%)`);
  }

  for (let i = 0; i < numDots / 2; i++) {
    const x = (i * 23.1 + 7) % 100;
    const y = (i * 19.3 + 11) % 100;
    const size = 1 + (i % 2);
    const color = colors[(i + 3) % colors.length];
    const opacity = (0.35 + (i % 4) * 0.08) * intensity;
    coloredDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${opacity}) 0%, transparent 100%)`);
  }

  return [{
    ...OVERLAY_BASE,
    background: coloredDots.join(', '),
    animation: 'visualSnowDrift 6s ease-in-out infinite alternate',
  }];
}

/**
 * Generate Visual Snow Transparent overlay
 */
export function generateVisualSnowTransparentOverlays(intensity: number): React.CSSProperties[] {
  const numDots = Math.floor(100 + intensity * 150);
  const dots: string[] = [];

  for (let i = 0; i < numDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 2 + (i % 4);
    const opacity = (0.15 + (i % 5) * 0.05) * intensity;
    const color = i % 2 === 0 ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`;
    dots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
  }

  return [
    {
      ...OVERLAY_BASE,
      background: dots.join(', '),
      animation: 'visualSnowDrift 8s ease-in-out infinite alternate',
    },
    {
      ...OVERLAY_BASE,
      background: `rgba(200,200,200,${0.03 + intensity * 0.05})`,
      mixBlendMode: 'overlay' as const,
    },
  ];
}

/**
 * Generate Visual Snow Dense overlay
 */
export function generateVisualSnowDenseOverlays(intensity: number): React.CSSProperties[] {
  const numDots1 = Math.floor(150 + intensity * 200);
  const dots1 = generateStaticDots(numDots1, 11.3, 13.7, 0, 0, intensity, 0.5, 0.12, 2, 4);

  const numDots2 = Math.floor(120 + intensity * 180);
  const dots2 = generateStaticDots(numDots2, 17.1, 21.3, 5, 9, intensity, 0.45, 0.1, 2, 3);

  const numDots3 = Math.floor(80 + intensity * 120);
  const dots3 = generateStaticDots(numDots3, 23.7, 19.1, 13, 17, intensity, 0.4, 0.1, 3, 3);

  return [
    {
      ...OVERLAY_BASE,
      background: dots1.join(', '),
      animation: 'visualSnowDrift 5s ease-in-out infinite alternate',
    },
    {
      ...OVERLAY_BASE,
      background: dots2.join(', '),
      animation: 'visualSnowDrift 7s ease-in-out infinite alternate-reverse',
    },
    {
      ...OVERLAY_BASE,
      background: dots3.join(', '),
      animation: 'visualSnowDrift 9s ease-in-out infinite alternate',
    },
    {
      ...OVERLAY_BASE,
      background: `rgba(128,128,128,${0.1 + intensity * 0.15})`,
      mixBlendMode: 'overlay' as const,
    },
  ];
}
