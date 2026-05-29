/**
 * Person-specific visual field overlay generators
 * Jose Cid, Judi Dench AMD, Plateau, Euler, Nemeth
 */

import { generatePuckeringWaves, JUDI_AMD_PUCKERING } from './puckeringUtils';
import { OVERLAY_BASE } from './standardOverlays';

/**
 * Generate Jose Cid Monocular Vision overlay (left eye prosthetic)
 * Complete left eye blindness - covers full left half of vision
 * Soft gradient transition at center
 */
export function generateJoseCidMonocularOverlay(intensity: number): React.CSSProperties {
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
 * Generate Dame Judi Dench AMD Complete overlay
 * Central vision lost, peripheral preserved with puckering distortion
 */
export function generateJudiAMDCompleteOverlay(intensity: number): React.CSSProperties {
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
export function generatePlateauSolarRetinopathyOverlay(intensity: number): React.CSSProperties {
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
export function generateEulerAsymmetricOverlay(intensity: number): React.CSSProperties {
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
export function generateNemethDualAttackOverlay(intensity: number): React.CSSProperties {
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
