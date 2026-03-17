/**
 * Hook for generating visual field overlay styles
 * Handles static visual field effects like Retinitis Pigmentosa, Stargardt, AMD, etc.
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import { ANIMATED_EFFECTS } from './useAnimatedOverlay';

/** Base styles shared by all overlay generators */
const OVERLAY_BASE: Pick<React.CSSProperties, 'position' | 'top' | 'left' | 'right' | 'bottom' | 'width' | 'height' | 'pointerEvents' | 'zIndex'> = {
  position: 'absolute' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none' as const,
  zIndex: 9999
};

/**
 * Parameterized puckering/metamorphopsia wave generator.
 * Each condition variant supplies its own tuning coefficients; the loop
 * structure and gradient pattern are identical across all callers.
 */
interface PuckeringParams {
  topCount: [number, number];       // [base, intensityMult] for Math.floor(base + intensity * mult)
  topDepth: [number, number, number]; // [base, intensityMult, sinAmplitude]
  topOpacity: [number, number];     // [base, intensityMult]
  topWidth: [number, number];       // [base, modMult]
  sideCount: [number, number];
  sideDepth: [number, number, number];
  sideOpacity: [number, number];
  sideHeight: [number, number];     // [base, modMult]
  cornerOpacity: [number, number];
  cornerSize: [number, number];
  lightRgb: [number, number, number];   // primary light color
  lightRgb2: [number, number, number];  // secondary light color
  darkRgb: [number, number, number];    // primary dark color
  darkRgb2: [number, number, number];   // secondary dark color
  cornerLightRgb: [number, number, number];
  cornerDarkRgb: [number, number, number];
  cornerLight2Rgb: [number, number, number];
}

function generatePuckeringWaves(intensity: number, p: PuckeringParams): string[] {
  const waves: string[] = [];
  if (intensity <= 0.2) return waves;

  const topWaveCount = Math.floor(p.topCount[0] + intensity * p.topCount[1]);
  const sideWaveCount = Math.floor(p.sideCount[0] + intensity * p.sideCount[1]);

  // Helper to build a single wave gradient
  const wave = (
    widthPct: number, depthPct: number, posAxis: string, posVal: number,
    edgeAxis: string, edgeVal: string, opacity: number, isLight: boolean
  ) => {
    const [lr, lg, lb] = isLight ? p.lightRgb : p.darkRgb;
    const [lr2, lg2, lb2] = isLight ? p.lightRgb2 : p.darkRgb2;
    const isHorizontalEdge = edgeAxis === 'y';
    const w = isHorizontalEdge ? `${widthPct}% ${depthPct}%` : `${depthPct}% ${widthPct}%`;
    const pos = isHorizontalEdge ? `${posVal}% ${edgeVal}` : `${edgeVal} ${posVal}%`;
    return `radial-gradient(ellipse ${w} at ${pos}, rgba(${lr},${lg},${lb},${opacity}) 0%, rgba(${lr2},${lg2},${lb2},${opacity * 0.5}) 60%, transparent 100%)`;
  };

  // TOP EDGE
  for (let i = 0; i < topWaveCount; i++) {
    const pos = (i / (topWaveCount - 1)) * 100;
    const depth = p.topDepth[0] + intensity * p.topDepth[1] + Math.sin(i * 0.8) * p.topDepth[2];
    const opacity = (p.topOpacity[0] + intensity * p.topOpacity[1]) * (i % 2 === 0 ? 1 : 0.8);
    const width = p.topWidth[0] + (i % 3) * p.topWidth[1];
    waves.push(wave(width, depth, 'x', pos, 'y', '0%', opacity, i % 2 === 0));
  }

  // BOTTOM EDGE
  for (let i = 0; i < topWaveCount; i++) {
    const pos = (i / (topWaveCount - 1)) * 100;
    const depth = p.topDepth[0] + intensity * p.topDepth[1] + Math.sin(i * 0.9 + 0.5) * p.topDepth[2];
    const opacity = (p.topOpacity[0] + intensity * p.topOpacity[1]) * (i % 2 === 0 ? 1 : 0.8);
    const width = p.topWidth[0] + (i % 3) * p.topWidth[1];
    waves.push(wave(width, depth, 'x', pos, 'y', '100%', opacity, i % 2 === 0));
  }

  // LEFT EDGE
  for (let i = 0; i < sideWaveCount; i++) {
    const pos = (i / (sideWaveCount - 1)) * 100;
    const depth = p.sideDepth[0] + intensity * p.sideDepth[1] + Math.sin(i * 0.7) * p.sideDepth[2];
    const opacity = (p.sideOpacity[0] + intensity * p.sideOpacity[1]) * (i % 2 === 0 ? 1 : 0.8);
    const height = p.sideHeight[0] + (i % 3) * p.sideHeight[1];
    waves.push(wave(height, depth, 'y', pos, 'x', '0%', opacity, i % 2 === 0));
  }

  // RIGHT EDGE
  for (let i = 0; i < sideWaveCount; i++) {
    const pos = (i / (sideWaveCount - 1)) * 100;
    const depth = p.sideDepth[0] + intensity * p.sideDepth[1] + Math.sin(i * 0.7 + 0.3) * p.sideDepth[2];
    const opacity = (p.sideOpacity[0] + intensity * p.sideOpacity[1]) * (i % 2 === 0 ? 1 : 0.8);
    const height = p.sideHeight[0] + (i % 3) * p.sideHeight[1];
    waves.push(wave(height, depth, 'y', pos, 'x', '100%', opacity, i % 2 === 0));
  }

  // CORNER pinching effects
  const co = p.cornerOpacity[0] + intensity * p.cornerOpacity[1];
  const cs = p.cornerSize[0] + intensity * p.cornerSize[1];
  const [clr, clg, clb] = p.cornerLightRgb;
  const [cdr, cdg, cdb] = p.cornerDarkRgb;
  const [cl2r, cl2g, cl2b] = p.cornerLight2Rgb;
  const cornerGrad = (x: string, y: string) =>
    `radial-gradient(ellipse ${cs}% ${cs}% at ${x} ${y}, rgba(${clr},${clg},${clb},${co}) 0%, rgba(${cdr},${cdg},${cdb},${co * 0.6}) 40%, rgba(${cl2r},${cl2g},${cl2b},${co * 0.4}) 70%, transparent 100%)`;
  waves.push(cornerGrad('0%', '0%'), cornerGrad('100%', '0%'), cornerGrad('0%', '100%'), cornerGrad('100%', '100%'));

  return waves;
}

// Preset puckering parameters for each condition
const STARGARDT_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [10, 15, 6], topOpacity: [0.28, 0.22], topWidth: [9, 3],
  sideCount: [6, 5], sideDepth: [7, 12, 5], sideOpacity: [0.25, 0.2], sideHeight: [12, 4],
  cornerOpacity: [0.32, 0.28], cornerSize: [18, 12],
  lightRgb: [160, 160, 165], lightRgb2: [140, 140, 145],
  darkRgb: [38, 38, 48], darkRgb2: [58, 58, 68],
  cornerLightRgb: [150, 150, 155], cornerDarkRgb: [48, 48, 58], cornerLight2Rgb: [135, 135, 140]
};

const AMD_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [8, 12, 5], topOpacity: [0.25, 0.2], topWidth: [8, 3],
  sideCount: [6, 5], sideDepth: [6, 10, 4], sideOpacity: [0.22, 0.18], sideHeight: [10, 4],
  cornerOpacity: [0.3, 0.25], cornerSize: [15, 10],
  lightRgb: [155, 155, 160], lightRgb2: [135, 135, 140],
  darkRgb: [40, 40, 50], darkRgb2: [60, 60, 70],
  cornerLightRgb: [145, 145, 150], cornerDarkRgb: [50, 50, 60], cornerLight2Rgb: [130, 130, 135]
};

const SCOTOMA_PUCKERING: PuckeringParams = {
  topCount: [7, 5], topDepth: [8, 10, 4], topOpacity: [0.24, 0.18], topWidth: [8, 2],
  sideCount: [5, 4], sideDepth: [6, 8, 3], sideOpacity: [0.22, 0.16], sideHeight: [10, 3],
  cornerOpacity: [0.28, 0.22], cornerSize: [14, 10],
  lightRgb: [152, 152, 158], lightRgb2: [132, 132, 138],
  darkRgb: [42, 42, 52], darkRgb2: [62, 62, 72],
  cornerLightRgb: [145, 145, 150], cornerDarkRgb: [50, 50, 60], cornerLight2Rgb: [130, 130, 135]
};

const JUDI_AMD_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [9, 14, 5], topOpacity: [0.26, 0.2], topWidth: [8, 3],
  sideCount: [6, 5], sideDepth: [7, 11, 4], sideOpacity: [0.24, 0.18], sideHeight: [11, 4],
  cornerOpacity: [0.3, 0.25], cornerSize: [16, 12],
  lightRgb: [158, 158, 163], lightRgb2: [138, 138, 143],
  darkRgb: [38, 38, 48], darkRgb2: [58, 58, 68],
  cornerLightRgb: [148, 148, 153], cornerDarkRgb: [48, 48, 58], cornerLight2Rgb: [133, 133, 138]
};

/**
 * Generate Retinitis Pigmentosa overlay (tunnel vision)
 */
function generateRetinitisPigmentosaOverlay(intensity: number): React.CSSProperties {
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
function generateStargardtOverlay(intensity: number): React.CSSProperties {
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
function generateAmdOverlay(intensity: number): React.CSSProperties {
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
function generateDiabeticRetinopathyOverlay(intensity: number): React.CSSProperties {
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
function generateGlaucomaOverlay(intensity: number): React.CSSProperties {
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
function generateTunnelVisionOverlay(intensity: number): React.CSSProperties {
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
function generateHemianopiaLeftOverlay(intensity: number): React.CSSProperties {
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
function generateHemianopiaRightOverlay(intensity: number): React.CSSProperties {
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
function generateScotomaOverlay(intensity: number): React.CSSProperties {
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
function generateBlindnessLeftEyeOverlay(intensity: number): React.CSSProperties {
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
function generateBlindnessRightEyeOverlay(intensity: number): React.CSSProperties {
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
 * Generate Jose Cid Monocular Vision overlay (left eye prosthetic)
 * Complete left eye blindness - covers full left half of vision
 * Soft gradient transition at center
 */
function generateJoseCidMonocularOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    background: `linear-gradient(to right,
      rgba(0,0,0,${intensity}) 0%,
      rgba(0,0,0,${intensity}) 45%,
      rgba(0,0,0,${intensity * 0.7}) 48%,
      rgba(0,0,0,${intensity * 0.4}) 50%,
      rgba(0,0,0,${intensity * 0.1}) 52%,
      rgba(0,0,0,0) 55%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: 1
  };
}

/**
 * Generate Retinal Detachment overlay (curtain-like shadow from top)
 */
function generateRetinalDetachmentOverlay(intensity: number): React.CSSProperties {
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
 * Generate Dame Judi Dench AMD Complete overlay
 * Central vision lost, peripheral preserved with puckering distortion
 */
function generateJudiAMDCompleteOverlay(intensity: number): React.CSSProperties {
  const scotomaSize = 25 + intensity * 20;
  const puckeringWaves = generatePuckeringWaves(intensity, JUDI_AMD_PUCKERING);

  const mainScotoma = `radial-gradient(ellipse ${scotomaSize}% ${scotomaSize}% at 50% 50%,
    rgba(40,40,45,${intensity * 0.92}) 0%,
    rgba(45,45,50,${intensity * 0.88}) 20%,
    rgba(50,50,55,${intensity * 0.80}) 40%,
    rgba(60,60,65,${intensity * 0.65}) 60%,
    rgba(80,80,85,${intensity * 0.40}) 75%,
    rgba(100,100,105,${intensity * 0.20}) 85%,
    transparent 100%
  )`;

  return {
    ...OVERLAY_BASE,
    background: [mainScotoma, ...puckeringWaves].join(', '),
    mixBlendMode: 'multiply' as const,
    opacity: 1,
    filter: `blur(${intensity * 2}px)`
  };
}

/**
 * Generate Joseph Plateau Solar Retinopathy overlay
 * Central scotoma (10-20° dark ellipse) from solar damage with preserved peripheral
 * Features dark opaque center, blur gradient, and slight afterimage artifacts
 */
function generatePlateauSolarRetinopathyOverlay(intensity: number): React.CSSProperties {
  // Central scotoma size: 10-20% of visual field
  const scotomaSize = 12 + intensity * 8; // 12-20%

  return {
    ...OVERLAY_BASE,
    // Dark central scotoma with softer edges transitioning to preserved peripheral
    background: `
      radial-gradient(ellipse ${scotomaSize}% ${scotomaSize * 0.9}% at 50% 50%,
        rgba(5,5,5,${intensity * 0.95}) 0%,
        rgba(10,10,10,${intensity * 0.92}) 40%,
        rgba(20,20,20,${intensity * 0.85}) 60%,
        rgba(40,40,40,${intensity * 0.6}) 75%,
        rgba(60,60,60,${intensity * 0.3}) 85%,
        transparent 100%
      )
    `,
    mixBlendMode: 'multiply' as const,
    opacity: 1,
    // Slight blur to soften the scotoma edges
    filter: `blur(${intensity * 1.5}px)`
  };
}

/**
 * Generate Leonhard Euler's Asymmetric Vision Loss overlay
 * Right eye: Complete black (dead from infection ~1738)
 * Left eye: Milky cataract fog (handled by CSS filters)
 * The overlay blacks out the right half while leaving left visible for cataract effects
 */
function generateEulerAsymmetricOverlay(intensity: number): React.CSSProperties {
  return {
    ...OVERLAY_BASE,
    // Right half complete black (dead right eye), soft transition to left
    background: `linear-gradient(to left,
      rgba(0,0,0,${intensity}) 0%,
      rgba(0,0,0,${intensity}) 45%,
      rgba(0,0,0,${intensity * 0.7}) 48%,
      rgba(0,0,0,${intensity * 0.3}) 50%,
      rgba(0,0,0,${intensity * 0.1}) 52%,
      rgba(0,0,0,0) 55%
    )`,
    mixBlendMode: 'normal' as const,
    opacity: 1
  };
}

/**
 * Generate Abraham Nemeth's Dual-Attack Blindness overlay
 * Combines central scotoma + peripheral constriction, leaving only a fragile mid-peripheral ring
 * For his lived experience: near-total darkness (functioned as totally blind)
 */
function generateNemethDualAttackOverlay(intensity: number): React.CSSProperties {
  // Central scotoma size: 10-20% of visual field (expands with intensity)
  const centralScotomaSize = 10 + intensity * 10;

  // Peripheral constriction: tunnel closes from edges
  // At full intensity, the tunnel is very narrow, leaving almost nothing
  const peripheralStart = 25 + intensity * 20; // Where peripheral darkness begins (25-45%)
  const peripheralEnd = 35 + intensity * 25; // Where it becomes total (35-60%)

  // The mid-ring remnant exists between centralScotomaSize and peripheralStart
  // At high intensity, these overlap, leaving effectively nothing

  return {
    ...OVERLAY_BASE,
    // Layer 1: Central scotoma (dark elliptical void at center)
    // Layer 2: Peripheral constriction (darkness from edges)
    // The combination leaves only a thin donut ring (if any)
    background: `
      radial-gradient(ellipse ${centralScotomaSize}% ${centralScotomaSize * 0.9}% at 50% 50%,
        rgba(0,0,0,${intensity * 0.98}) 0%,
        rgba(0,0,0,${intensity * 0.95}) 60%,
        rgba(0,0,0,${intensity * 0.85}) 80%,
        rgba(5,5,5,${intensity * 0.6}) 90%,
        transparent 100%
      ),
      radial-gradient(ellipse 100% 120% at 50% 50%,
        transparent 0%,
        transparent ${peripheralStart - 5}%,
        rgba(5,5,5,${intensity * 0.4}) ${peripheralStart}%,
        rgba(0,0,0,${intensity * 0.7}) ${(peripheralStart + peripheralEnd) / 2}%,
        rgba(0,0,0,${intensity * 0.95}) ${peripheralEnd}%,
        rgba(0,0,0,${intensity * 0.98}) 100%
      )
    `,
    mixBlendMode: 'multiply' as const,
    opacity: 1
  };
}

/**
 * Generate Bitemporal Hemianopia overlay (loss of temporal/outer halves of both eyes)
 */
function generateBitemporalHemianopiaOverlay(intensity: number): React.CSSProperties {
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
function generateQuadrantanopiaOverlay(
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

/** Map of effect IDs to their overlay generator functions */
type OverlayGenerator = (intensity: number) => React.CSSProperties;

const SINGLE_ID_GENERATORS: Record<string, OverlayGenerator> = {
  retinitisPigmentosa: generateRetinitisPigmentosaOverlay,
  stargardt: generateStargardtOverlay,
  amd: generateAmdOverlay,
  judiAMDComplete: generateJudiAMDCompleteOverlay,
  diabeticRetinopathy: generateDiabeticRetinopathyOverlay,
  glaucoma: generateGlaucomaOverlay,
  tunnelVision: generateTunnelVisionOverlay,
  hemianopiaLeft: generateHemianopiaLeftOverlay,
  hemianopiaRight: generateHemianopiaRightOverlay,
  bitemporalHemianopia: generateBitemporalHemianopiaOverlay,
  scotoma: generateScotomaOverlay,
  blindnessLeftEye: generateBlindnessLeftEyeOverlay,
  blindnessRightEye: generateBlindnessRightEyeOverlay,
  joseCidMonocularVision: generateJoseCidMonocularOverlay,
  retinalDetachment: generateRetinalDetachmentOverlay,
  quadrantanopiaLeft: (i) => generateQuadrantanopiaOverlay('left', i),
  quadrantanopiaRight: (i) => generateQuadrantanopiaOverlay('right', i),
  quadrantanopiaInferiorLeft: (i) => generateQuadrantanopiaOverlay('inferiorLeft', i),
  quadrantanopiaInferiorRight: (i) => generateQuadrantanopiaOverlay('inferiorRight', i),
  quadrantanopiaSuperiorLeft: (i) => generateQuadrantanopiaOverlay('superiorLeft', i),
  quadrantanopiaSuperiorRight: (i) => generateQuadrantanopiaOverlay('superiorRight', i),
};

/** Multi-ID effect groups (first matching ID triggers the generator) */
const MULTI_ID_GENERATORS: Array<{ ids: string[]; generator: OverlayGenerator }> = [
  {
    ids: ['plateauComplete', 'plateauCentralScotoma', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
    generator: generatePlateauSolarRetinopathyOverlay,
  },
  {
    ids: ['eulerComplete', 'eulerRightEyeBlind', 'eulerLeftEyeCataract', 'eulerEarlyStage', 'eulerMidStage', 'eulerLateStage'],
    generator: generateEulerAsymmetricOverlay,
  },
  {
    ids: ['nemethComplete', 'nemethCentralScotoma', 'nemethPeripheralConstriction', 'nemethMidRingRemnant', 'nemethPartialRing'],
    generator: generateNemethDualAttackOverlay,
  },
];

/**
 * Hook that generates overlay styles for visual field effects.
 * Returns an array of CSS styles — one for each enabled visual field effect —
 * so that multiple conditions can be rendered simultaneously.
 */
export const useVisualFieldOverlay = (effects: VisualEffect[]): React.CSSProperties[] => {
  return useMemo(() => {
    // Skip if animated effects are enabled (handled by animated overlay)
    const hasAnimatedEffect = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);
    if (hasAnimatedEffect) return [];

    const overlays: React.CSSProperties[] = [];

    // Track which multi-ID groups have already been matched
    const matchedMultiGroups = new Set<number>();

    for (const effect of effects) {
      if (!effect.enabled) continue;

      // Check single-ID generators
      const singleGen = SINGLE_ID_GENERATORS[effect.id];
      if (singleGen) {
        overlays.push(singleGen(effect.intensity));
        continue;
      }

      // Check multi-ID generators
      for (let gi = 0; gi < MULTI_ID_GENERATORS.length; gi++) {
        if (matchedMultiGroups.has(gi)) continue;
        const group = MULTI_ID_GENERATORS[gi];
        if (group.ids.includes(effect.id)) {
          overlays.push(group.generator(effect.intensity));
          matchedMultiGroups.add(gi);
          break;
        }
      }
    }

    return overlays;
  }, [effects]);
};
