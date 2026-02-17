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

    return null;
  }, [effects]);
};
