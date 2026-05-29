/**
 * Standard visual field overlay generators
 * RP, Stargardt, AMD, DR, Glaucoma, Tunnel Vision, Hemianopia, Scotoma,
 * Blindness L/R, Retinal Detachment, Bitemporal Hemianopia, Quadrantanopia
 */

import { generatePuckeringWaves, STARGARDT_PUCKERING, AMD_PUCKERING, SCOTOMA_PUCKERING } from './puckeringUtils';

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
      rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius}%,
      rgba(0,0,0,${0.7 * intensity}) ${tunnelRadius + 3}%,
      rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 8}%,
      rgba(0,0,0,${0.95 * intensity}) 100%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
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
 * Generate Glaucoma overlay
 */
export function generateGlaucomaOverlay(intensity: number): React.CSSProperties {
  const fieldRadius = Math.max(15, 90 - intensity * 75);
  const fadeWidth = fieldRadius * 0.25;
  const fadeStart = fieldRadius - fadeWidth;
  const grayValueCenter = 75;
  const grayValueEdge = 35;

  return {
    ...OVERLAY_BASE,
    background: `radial-gradient(ellipse 100% 110% at 50% 50%,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${fadeStart}%,
      rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${0.35 * intensity}) ${fadeStart + fadeWidth * 0.3}%,
      rgba(${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${0.6 * intensity}) ${fadeStart + fadeWidth * 0.6}%,
      rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${0.85 * intensity}) ${fieldRadius}%,
      rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${0.9 * intensity}) 100%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.9, intensity * 0.95),
    filter: `blur(${intensity * 1.5}px) contrast(${100 - intensity * 40}%) brightness(${100 - intensity * 8}%)`
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
      rgba(0,0,0,${0.95 * intensity}) ${Math.max(40, 55 - intensity * 20)}%,
      rgba(0,0,0,${0.95 * intensity}) 100%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
  };
}

/**
 * Generate Hemianopia Left overlay
 */
export function generateHemianopiaLeftOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(0,0,0,${0.95 * intensity}) 0%,
      rgba(0,0,0,${0.95 * intensity}) 45%,
      rgba(0,0,0,0) 50%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
  };
}

/**
 * Generate Hemianopia Right overlay
 */
export function generateHemianopiaRightOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to left,
      rgba(0,0,0,${0.95 * intensity}) 0%,
      rgba(0,0,0,${0.95 * intensity}) 45%,
      rgba(0,0,0,0) 50%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
  };
}

/**
 * Generate Scotoma overlay
 */
export function generateScotomaOverlay(intensity: number): React.CSSProperties {
  const scotomaEdge = Math.max(20, 35 - intensity * 15);
  const puckeringWaves = generatePuckeringWaves(intensity, SCOTOMA_PUCKERING);

  const mainScotoma = `radial-gradient(circle at 50% 50%,
    rgba(0,0,0,${0.95 * intensity}) 0%,
    rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
    rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
    rgba(0,0,0,0) ${scotomaEdge}%
  )`;

  return {
    ...OVERLAY_BASE,
    background: [mainScotoma, ...puckeringWaves].join(', '),
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity)
  };
}

/**
 * Generate Blindness Left Eye overlay (monocular vision loss - left side)
 */
export function generateBlindnessLeftEyeOverlay(intensity: number): React.CSSProperties {
  const eyeIntensity = intensity === 1 ? 1 : 0.95 * intensity;
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(0,0,0,${eyeIntensity}) 0%,
      rgba(0,0,0,${eyeIntensity}) 47.5%,
      rgba(0,0,0,${eyeIntensity * 0.7}) 48.75%,
      rgba(0,0,0,${eyeIntensity * 0.4}) 50%,
      rgba(0,0,0,${eyeIntensity * 0.1}) 51.25%,
      rgba(0,0,0,0) 52.5%
    )`,
    mixBlendMode: intensity === 1 ? 'normal' as const : 'multiply' as const,
    opacity: intensity === 1 ? 1 : Math.min(0.95, intensity)
  };
}

/**
 * Generate Blindness Right Eye overlay (monocular vision loss - right side)
 */
export function generateBlindnessRightEyeOverlay(intensity: number): React.CSSProperties {
  const eyeIntensity = intensity === 1 ? 1 : 0.95 * intensity;
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to left,
      rgba(0,0,0,${eyeIntensity}) 0%,
      rgba(0,0,0,${eyeIntensity}) 47.5%,
      rgba(0,0,0,${eyeIntensity * 0.7}) 48.75%,
      rgba(0,0,0,${eyeIntensity * 0.4}) 50%,
      rgba(0,0,0,${eyeIntensity * 0.1}) 51.25%,
      rgba(0,0,0,0) 52.5%
    )`,
    mixBlendMode: intensity === 1 ? 'normal' as const : 'multiply' as const,
    opacity: intensity === 1 ? 1 : Math.min(0.95, intensity)
  };
}

/**
 * Generate Retinal Detachment overlay (curtain-like shadow from top)
 */
export function generateRetinalDetachmentOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to bottom,
      rgba(0,0,0,${0.9 * intensity}) 0%,
      rgba(0,0,0,${0.8 * intensity}) 15%,
      rgba(0,0,0,${0.6 * intensity}) 30%,
      rgba(0,0,0,${0.4 * intensity}) 45%,
      rgba(0,0,0,${0.2 * intensity}) 60%,
      rgba(0,0,0,0) 75%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.8, intensity),
    filter: `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`
  };
}

/**
 * Generate Bitemporal Hemianopia overlay (loss of temporal/outer halves of both eyes)
 */
export function generateBitemporalHemianopiaOverlay(intensity: number): React.CSSProperties {
  const i = intensity === 1 ? 1 : 0.95 * intensity;
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(0,0,0,${i}) 0%,
      rgba(0,0,0,${i}) 22.5%,
      rgba(0,0,0,${i * 0.7}) 23.75%,
      rgba(0,0,0,${i * 0.4}) 25%,
      rgba(0,0,0,${i * 0.1}) 26.25%,
      rgba(0,0,0,0) 27.5%,
      rgba(0,0,0,0) 72.5%,
      rgba(0,0,0,${i * 0.1}) 73.75%,
      rgba(0,0,0,${i * 0.4}) 75%,
      rgba(0,0,0,${i * 0.7}) 76.25%,
      rgba(0,0,0,${i}) 77.5%,
      rgba(0,0,0,${i}) 100%
    )`,
    mixBlendMode: intensity === 1 ? 'normal' as const : 'multiply' as const,
    opacity: intensity === 1 ? 1 : Math.min(0.95, intensity)
  };
}

/**
 * Generate Quadrantanopia overlay for a given quadrant
 */
export function generateQuadrantanopiaOverlay(
  quadrant: 'left' | 'right' | 'inferiorLeft' | 'inferiorRight' | 'superiorLeft' | 'superiorRight',
  intensity: number
): React.CSSProperties {
  const i = intensity === 1 ? 1 : 0.95 * intensity;
  const blendMode = intensity === 1 ? 'normal' as const : 'multiply' as const;
  const opacity = intensity === 1 ? 1 : Math.min(0.95, intensity);

  const gradientMap: Record<string, string> = {
    left: `conic-gradient(from 0deg at 50% 50%,
      rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 90deg,
      rgba(0,0,0,${i}) 90deg, rgba(0,0,0,${i}) 180deg,
      rgba(0,0,0,0) 180deg, rgba(0,0,0,0) 360deg)`,
    right: `radial-gradient(circle at 0% 100%,
      rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${Math.max(25, 40 - intensity * 20)}%,
      rgba(0,0,0,1) ${Math.max(45, 60 - intensity * 20)}%, rgba(0,0,0,1) 100%)`,
    inferiorLeft: `radial-gradient(ellipse 100% 100% at 0% 100%,
      rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 65%,
      rgba(0,0,0,${i * 0.6}) 72%, rgba(0,0,0,${i * 0.2}) 80%, rgba(0,0,0,0) 85%)`,
    inferiorRight: `radial-gradient(ellipse 100% 100% at 100% 100%,
      rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 65%,
      rgba(0,0,0,${i * 0.6}) 72%, rgba(0,0,0,${i * 0.2}) 80%, rgba(0,0,0,0) 85%)`,
    superiorLeft: `radial-gradient(ellipse 100% 100% at 0% 0%,
      rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 65%,
      rgba(0,0,0,${i * 0.6}) 72%, rgba(0,0,0,${i * 0.2}) 80%, rgba(0,0,0,0) 85%)`,
    superiorRight: `radial-gradient(ellipse 100% 100% at 100% 0%,
      rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 65%,
      rgba(0,0,0,${i * 0.6}) 72%, rgba(0,0,0,${i * 0.2}) 80%, rgba(0,0,0,0) 85%)`,
  };

  return {
    ...OVERLAY_BASE,
    background: gradientMap[quadrant],
    mixBlendMode: blendMode,
    opacity,
  };
}
