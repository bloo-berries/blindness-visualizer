/**
 * Parameterized puckering/metamorphopsia wave generator.
 * Each condition variant supplies its own tuning coefficients; the loop
 * structure and gradient pattern are identical across all callers.
 */

export interface PuckeringParams {
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

export function generatePuckeringWaves(intensity: number, p: PuckeringParams): string[] {
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
export const STARGARDT_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [10, 15, 6], topOpacity: [0.28, 0.22], topWidth: [9, 3],
  sideCount: [6, 5], sideDepth: [7, 12, 5], sideOpacity: [0.25, 0.2], sideHeight: [12, 4],
  cornerOpacity: [0.32, 0.28], cornerSize: [18, 12],
  lightRgb: [160, 160, 165], lightRgb2: [140, 140, 145],
  darkRgb: [38, 38, 48], darkRgb2: [58, 58, 68],
  cornerLightRgb: [150, 150, 155], cornerDarkRgb: [48, 48, 58], cornerLight2Rgb: [135, 135, 140]
};

export const AMD_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [8, 12, 5], topOpacity: [0.25, 0.2], topWidth: [8, 3],
  sideCount: [6, 5], sideDepth: [6, 10, 4], sideOpacity: [0.22, 0.18], sideHeight: [10, 4],
  cornerOpacity: [0.3, 0.25], cornerSize: [15, 10],
  lightRgb: [155, 155, 160], lightRgb2: [135, 135, 140],
  darkRgb: [40, 40, 50], darkRgb2: [60, 60, 70],
  cornerLightRgb: [145, 145, 150], cornerDarkRgb: [50, 50, 60], cornerLight2Rgb: [130, 130, 135]
};

export const SCOTOMA_PUCKERING: PuckeringParams = {
  topCount: [7, 5], topDepth: [8, 10, 4], topOpacity: [0.24, 0.18], topWidth: [8, 2],
  sideCount: [5, 4], sideDepth: [6, 8, 3], sideOpacity: [0.22, 0.16], sideHeight: [10, 3],
  cornerOpacity: [0.28, 0.22], cornerSize: [14, 10],
  lightRgb: [152, 152, 158], lightRgb2: [132, 132, 138],
  darkRgb: [42, 42, 52], darkRgb2: [62, 62, 72],
  cornerLightRgb: [145, 145, 150], cornerDarkRgb: [50, 50, 60], cornerLight2Rgb: [130, 130, 135]
};

export const JUDI_AMD_PUCKERING: PuckeringParams = {
  topCount: [8, 6], topDepth: [9, 14, 5], topOpacity: [0.26, 0.2], topWidth: [8, 3],
  sideCount: [6, 5], sideDepth: [7, 11, 4], sideOpacity: [0.24, 0.18], sideHeight: [11, 4],
  cornerOpacity: [0.3, 0.25], cornerSize: [16, 12],
  lightRgb: [158, 158, 163], lightRgb2: [138, 138, 143],
  darkRgb: [38, 38, 48], darkRgb2: [58, 58, 68],
  cornerLightRgb: [148, 148, 153], cornerDarkRgb: [48, 48, 58], cornerLight2Rgb: [133, 133, 138]
};
