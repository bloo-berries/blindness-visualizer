/**
 * Hook for generating visual field overlay styles
 * Handles static visual field effects like Retinitis Pigmentosa, Stargardt, AMD, etc.
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import { ANIMATED_EFFECTS } from './useAnimatedOverlay';

/**
 * Generate Retinitis Pigmentosa overlay (tunnel vision)
 */
function generateRetinitisPigmentosaOverlay(intensity: number): React.CSSProperties {
  // Use same formula as preview: Math.max(3, 30 - intensity * 27)
  const tunnelRadius = Math.max(3, 30 - intensity * 27);

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    // Match preview exactly: pure black, tighter gradient stops
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
  // Central scotoma that expands with intensity
  const scotomaRadius = 17 + intensity * 53;

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    background: `radial-gradient(circle at 50% 50%,
      rgba(10,10,10,${0.99 * intensity}) 0%,
      rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
      rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
      rgba(0,0,0,0) ${scotomaRadius + 5}%
    )`,
    mixBlendMode: 'multiply' as const,
    opacity: Math.min(0.95, intensity),
    filter: `saturate(${1 - intensity * 0.4})`
  };
}

/**
 * Generate AMD (Age-Related Macular Degeneration) overlay
 */
function generateAmdOverlay(intensity: number): React.CSSProperties {
  // Central scotoma with softer edges than Stargardt
  const amdRadius = Math.max(15, 52 - intensity * 37);

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    background: `radial-gradient(circle at 50% 50%,
      rgba(0,0,0,${0.95 * intensity}) 0%,
      rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
      rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
      rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
      rgba(0,0,0,0) ${amdRadius + 10}%
    )`,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    background: `radial-gradient(circle at 50% 50%,
      rgba(0,0,0,${0.95 * intensity}) 0%,
      rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
      rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
      rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
    )`,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
 * Generate Dame Judi Dench AMD Complete overlay
 * Based on her descriptions: central vision lost, peripheral preserved
 * "I can see your outline" but "I can't recognize anybody now...I can't see to read"
 */
function generateJudiAMDCompleteOverlay(intensity: number): React.CSSProperties {
  const scotomaSize = 25 + intensity * 20; // 25-45% of view is affected

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    background: `
      radial-gradient(ellipse ${scotomaSize}% ${scotomaSize}% at 50% 50%,
        rgba(40,40,45,${intensity * 0.92}) 0%,
        rgba(45,45,50,${intensity * 0.88}) 20%,
        rgba(50,50,55,${intensity * 0.80}) 40%,
        rgba(60,60,65,${intensity * 0.65}) 60%,
        rgba(80,80,85,${intensity * 0.40}) 75%,
        rgba(100,100,105,${intensity * 0.20}) 85%,
        transparent 100%
      )
    `,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
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
 * Hook that generates overlay styles for visual field effects
 * Returns null if animated effects are enabled (handled by useAnimatedOverlay)
 */
export const useVisualFieldOverlay = (effects: VisualEffect[]): React.CSSProperties | null => {
  return useMemo(() => {
    // Skip if animated effects are enabled (handled by animated overlay)
    const hasAnimatedEffect = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);
    if (hasAnimatedEffect) return null;

    // Check for retinitis pigmentosa
    const rpEffect = effects.find(e => e.id === 'retinitisPigmentosa' && e.enabled);
    if (rpEffect) {
      return generateRetinitisPigmentosaOverlay(rpEffect.intensity);
    }

    // Check for Stargardt Disease
    const stargardtEffect = effects.find(e => e.id === 'stargardt' && e.enabled);
    if (stargardtEffect) {
      return generateStargardtOverlay(stargardtEffect.intensity);
    }

    // Check for AMD
    const amdEffect = effects.find(e => e.id === 'amd' && e.enabled);
    if (amdEffect) {
      return generateAmdOverlay(amdEffect.intensity);
    }

    // Check for Judi Dench AMD Complete (central scotoma with peripheral preservation)
    const judiAMDEffect = effects.find(e => e.id === 'judiAMDComplete' && e.enabled);
    if (judiAMDEffect) {
      return generateJudiAMDCompleteOverlay(judiAMDEffect.intensity);
    }

    // Check for Joseph Plateau Solar Retinopathy (central scotoma from solar damage)
    const plateauEffect = effects.find(e =>
      (e.id === 'plateauComplete' || e.id === 'plateauCentralScotoma' ||
       e.id === 'plateauEarlyStage' || e.id === 'plateauMidStage' || e.id === 'plateauLateStage') && e.enabled
    );
    if (plateauEffect) {
      return generatePlateauSolarRetinopathyOverlay(plateauEffect.intensity);
    }

    // Check for Leonhard Euler's asymmetric vision loss (right eye blind, left eye cataract)
    const eulerEffect = effects.find(e =>
      (e.id === 'eulerComplete' || e.id === 'eulerRightEyeBlind' ||
       e.id === 'eulerLeftEyeCataract' || e.id === 'eulerEarlyStage' ||
       e.id === 'eulerMidStage' || e.id === 'eulerLateStage') && e.enabled
    );
    if (eulerEffect) {
      return generateEulerAsymmetricOverlay(eulerEffect.intensity);
    }

    // Check for Abraham Nemeth's dual-attack blindness (central scotoma + peripheral constriction)
    const nemethEffect = effects.find(e =>
      (e.id === 'nemethComplete' || e.id === 'nemethCentralScotoma' ||
       e.id === 'nemethPeripheralConstriction' || e.id === 'nemethMidRingRemnant' ||
       e.id === 'nemethPartialRing') && e.enabled
    );
    if (nemethEffect) {
      return generateNemethDualAttackOverlay(nemethEffect.intensity);
    }

    // Check for Diabetic Retinopathy
    const drEffect = effects.find(e => e.id === 'diabeticRetinopathy' && e.enabled);
    if (drEffect) {
      return generateDiabeticRetinopathyOverlay(drEffect.intensity);
    }

    // Check for glaucoma
    const glaucomaEffect = effects.find(e => e.id === 'glaucoma' && e.enabled);
    if (glaucomaEffect) {
      return generateGlaucomaOverlay(glaucomaEffect.intensity);
    }

    // Check for tunnel vision
    const tunnelVisionEffect = effects.find(e => e.id === 'tunnelVision' && e.enabled);
    if (tunnelVisionEffect) {
      return generateTunnelVisionOverlay(tunnelVisionEffect.intensity);
    }

    // Check for hemianopia left
    const hemianopiaLeftEffect = effects.find(e => e.id === 'hemianopiaLeft' && e.enabled);
    if (hemianopiaLeftEffect) {
      return generateHemianopiaLeftOverlay(hemianopiaLeftEffect.intensity);
    }

    // Check for hemianopia right
    const hemianopiaRightEffect = effects.find(e => e.id === 'hemianopiaRight' && e.enabled);
    if (hemianopiaRightEffect) {
      return generateHemianopiaRightOverlay(hemianopiaRightEffect.intensity);
    }

    // Check for scotoma
    const scotomaEffect = effects.find(e => e.id === 'scotoma' && e.enabled);
    if (scotomaEffect) {
      return generateScotomaOverlay(scotomaEffect.intensity);
    }

    // Check for blindness left eye
    const blindnessLeftEyeEffect = effects.find(e => e.id === 'blindnessLeftEye' && e.enabled);
    if (blindnessLeftEyeEffect) {
      return generateBlindnessLeftEyeOverlay(blindnessLeftEyeEffect.intensity);
    }

    // Check for blindness right eye
    const blindnessRightEyeEffect = effects.find(e => e.id === 'blindnessRightEye' && e.enabled);
    if (blindnessRightEyeEffect) {
      return generateBlindnessRightEyeOverlay(blindnessRightEyeEffect.intensity);
    }

    return null;
  }, [effects]);
};
