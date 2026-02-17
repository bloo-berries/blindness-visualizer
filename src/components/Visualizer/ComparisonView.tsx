import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { YOUTUBE_IFRAME_PROPS, YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  getHallucinationsStartTime
} from '../../utils/overlays/cbsHallucinations';

// Effects that need animation
const ANIMATED_EFFECTS = ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'hallucinations', 'blueFieldPhenomena'];

interface ComparisonViewProps {
  effects: VisualEffect[];
  inputSource: InputSource;
  getVideoUrl: () => string;
  getEffectStyles: () => React.CSSProperties;
  getDiplopiaOverlay: () => React.ReactNode;
  onToggleComparison: () => void;
  simulationContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Generates animated overlay styles for visual aura effects
 */
const useAnimatedOverlay = (effects: VisualEffect[], now: number): React.CSSProperties | null => {
  return useMemo(() => {
    // Check for visual aura variants
    const auraEffect = effects.find(e =>
      (e.id === 'visualAura' || e.id === 'visualAuraLeft' || e.id === 'visualAuraRight') && e.enabled
    );

    if (auraEffect) {
      const intensity = auraEffect.intensity;
      const effectType = auraEffect.id;

      // Animation time for scintillation (same as preview)
      const time = now / 60;
      const shimmerPhase = Math.sin(time * 0.15) * 0.5 + 0.5;

      // Multiple scintillation frequencies
      const scintillate1 = Math.sin(time * 0.5) * 0.5 + 0.5;
      const scintillate2 = Math.sin(time * 0.75 + 1.2) * 0.5 + 0.5;
      const scintillate3 = Math.sin(time * 0.35 + 2.1) * 0.5 + 0.5;

      // Heat wave distortion frequencies
      const heatWave1 = Math.sin(time * 0.6) * 4;
      const heatWave2 = Math.sin(time * 0.45 + 1.5) * 3;
      const heatWave3 = Math.sin(time * 0.8 + 0.8) * 2.5;
      const heatWave4 = Math.cos(time * 0.55 + 2.2) * 3.5;

      // Position configuration based on variant
      const config = {
        visualAura: { centerX: 55, centerY: 45 },
        visualAuraLeft: { centerX: 35, centerY: 45 },
        visualAuraRight: { centerX: 65, centerY: 45 }
      }[effectType] || { centerX: 55, centerY: 45 };

      const { centerX, centerY } = config;

      // Base blob size with heat wave distortion
      const baseBlobWidth = 55 + intensity * 25;
      const baseBlobHeight = 65 + intensity * 20;

      // Apply heat wave distortion to dimensions
      const blobWidth = baseBlobWidth + heatWave1 + heatWave3 * 0.5;
      const blobHeight = baseBlobHeight + heatWave2 + heatWave4 * 0.5;

      // Animated movement with heat wave wobble
      const wobbleX = Math.sin(time * 0.075) * 2 + heatWave1 * 0.3;
      const wobbleY = Math.cos(time * 0.06) * 1.5 + heatWave2 * 0.25;
      const actualCenterX = centerX + wobbleX;
      const actualCenterY = centerY + wobbleY;

      // Main scotoma - large soft grayish-white blob
      const scotomaOpacity = 0.75 + shimmerPhase * 0.1;

      // Main scotoma blob
      const mainScotoma = `
        radial-gradient(
          ellipse ${blobWidth}% ${blobHeight}% at ${actualCenterX}% ${actualCenterY}%,
          rgba(235,235,240,${scotomaOpacity * intensity}) 0%,
          rgba(230,230,235,${scotomaOpacity * intensity * 0.95}) 15%,
          rgba(225,225,230,${scotomaOpacity * intensity * 0.9}) 30%,
          rgba(220,220,228,${scotomaOpacity * intensity * 0.8}) 45%,
          rgba(215,218,225,${scotomaOpacity * intensity * 0.6}) 60%,
          rgba(210,215,225,${scotomaOpacity * intensity * 0.35}) 75%,
          transparent 92%
        )
      `;

      // Heat wave edge layers
      const heatEdge1Width = blobWidth + 3 + heatWave2 * 0.8;
      const heatEdge1Height = blobHeight - 2 + heatWave3 * 0.6;
      const heatEdge1 = `
        radial-gradient(
          ellipse ${heatEdge1Width}% ${heatEdge1Height}% at ${actualCenterX + heatWave1 * 0.2}% ${actualCenterY + heatWave4 * 0.15}%,
          transparent 70%,
          rgba(230,232,240,${scotomaOpacity * intensity * 0.3}) 82%,
          rgba(225,228,238,${scotomaOpacity * intensity * 0.15}) 90%,
          transparent 100%
        )
      `;

      const heatEdge2Width = blobWidth - 2 + heatWave3 * 0.7;
      const heatEdge2Height = blobHeight + 4 + heatWave1 * 0.5;
      const heatEdge2 = `
        radial-gradient(
          ellipse ${heatEdge2Width}% ${heatEdge2Height}% at ${actualCenterX - heatWave2 * 0.15}% ${actualCenterY + heatWave3 * 0.2}%,
          transparent 72%,
          rgba(228,230,242,${scotomaOpacity * intensity * 0.25}) 85%,
          rgba(222,225,235,${scotomaOpacity * intensity * 0.1}) 93%,
          transparent 100%
        )
      `;

      // Secondary blob with heat wave distortion
      const blob2X = actualCenterX + 8 + heatWave3 * 0.4;
      const blob2Y = actualCenterY - 12 + heatWave4 * 0.3;
      const blob2Width = baseBlobWidth * 0.7 + heatWave2 * 0.6;
      const blob2Height = baseBlobHeight * 0.6 + heatWave1 * 0.4;
      const secondaryScotoma = `
        radial-gradient(
          ellipse ${blob2Width}% ${blob2Height}% at ${blob2X}% ${blob2Y}%,
          rgba(240,240,245,${scotomaOpacity * intensity * 0.7}) 0%,
          rgba(230,230,238,${scotomaOpacity * intensity * 0.5}) 40%,
          rgba(220,225,235,${scotomaOpacity * intensity * 0.25}) 70%,
          transparent 100%
        )
      `;

      // Third blob with heat wave distortion
      const blob3X = actualCenterX - 5 + heatWave4 * 0.35;
      const blob3Y = actualCenterY + 15 + heatWave1 * 0.25;
      const blob3Width = baseBlobWidth * 0.5 + heatWave3 * 0.5;
      const blob3Height = baseBlobHeight * 0.5 + heatWave2 * 0.35;
      const tertiaryScotoma = `
        radial-gradient(
          ellipse ${blob3Width}% ${blob3Height}% at ${blob3X}% ${blob3Y}%,
          rgba(235,235,242,${scotomaOpacity * intensity * 0.6}) 0%,
          rgba(228,230,240,${scotomaOpacity * intensity * 0.35}) 50%,
          transparent 100%
        )
      `;

      // Rainbow/prismatic edge with heat wave distortion
      const rainbowIntensity = 0.4 + scintillate1 * 0.2 + scintillate2 * 0.15;

      // Outer rainbow ring with heat wave shimmer
      const rainbowOuterWidth = blobWidth + 12 + heatWave2 * 0.8;
      const rainbowOuterHeight = blobHeight + 10 + heatWave4 * 0.6;
      const rainbowOuter = `
        radial-gradient(
          ellipse ${rainbowOuterWidth}% ${rainbowOuterHeight}% at ${actualCenterX + 5 + heatWave1 * 0.2}% ${actualCenterY + heatWave3 * 0.15}%,
          transparent 60%,
          rgba(0,255,255,${rainbowIntensity * intensity * (0.3 + scintillate3 * 0.15)}) 72%,
          rgba(100,255,200,${rainbowIntensity * intensity * (0.35 + scintillate1 * 0.1)}) 78%,
          rgba(150,255,100,${rainbowIntensity * intensity * (0.3 + scintillate2 * 0.1)}) 83%,
          rgba(255,255,100,${rainbowIntensity * intensity * 0.25}) 87%,
          rgba(255,200,150,${rainbowIntensity * intensity * 0.2}) 91%,
          transparent 98%
        )
      `;

      // Inner rainbow with heat wave
      const rainbowInner1Width = baseBlobWidth * 0.8 + heatWave3 * 0.7;
      const rainbowInner1Height = baseBlobHeight * 0.7 + heatWave1 * 0.5;
      const rainbowInner1 = `
        radial-gradient(
          ellipse ${rainbowInner1Width}% ${rainbowInner1Height}% at ${actualCenterX + 15 + heatWave2 * 0.25}% ${actualCenterY - 8 + heatWave4 * 0.2}%,
          transparent 55%,
          rgba(0,220,255,${rainbowIntensity * intensity * (0.4 + scintillate1 * 0.2)}) 70%,
          rgba(0,255,200,${rainbowIntensity * intensity * (0.35 + scintillate3 * 0.15)}) 80%,
          rgba(100,255,150,${rainbowIntensity * intensity * 0.25}) 88%,
          transparent 95%
        )
      `;

      // Magenta/pink accent with heat wave
      const magentaWidth = baseBlobWidth * 0.6 + heatWave1 * 0.5;
      const magentaHeight = baseBlobHeight * 0.5 + heatWave3 * 0.4;
      const rainbowMagenta = `
        radial-gradient(
          ellipse ${magentaWidth}% ${magentaHeight}% at ${actualCenterX - 10 + heatWave4 * 0.3}% ${actualCenterY + 20 + heatWave2 * 0.25}%,
          transparent 50%,
          rgba(255,100,200,${rainbowIntensity * intensity * (0.25 + scintillate2 * 0.1)}) 70%,
          rgba(200,150,255,${rainbowIntensity * intensity * 0.2}) 85%,
          transparent 100%
        )
      `;

      // Bright glowing spots with heat wave movement
      const glowSpot1X = actualCenterX + 18 + Math.sin(time * 0.4) * 3 + heatWave1 * 0.4;
      const glowSpot1Y = actualCenterY - 5 + Math.cos(time * 0.3) * 2 + heatWave3 * 0.3;
      const glowSpot1 = `
        radial-gradient(
          circle at ${glowSpot1X}% ${glowSpot1Y}%,
          rgba(255,255,255,${(0.5 + scintillate1 * 0.4) * intensity}) 0%,
          rgba(200,255,255,${(0.3 + scintillate2 * 0.2) * intensity}) 20%,
          transparent 45%
        )
      `;

      const glowSpot2X = actualCenterX + 10 + Math.sin(time * 0.55 + 1) * 2 + heatWave2 * 0.35;
      const glowSpot2Y = actualCenterY - 15 + Math.cos(time * 0.45 + 0.5) * 2 + heatWave4 * 0.25;
      const glowSpot2 = `
        radial-gradient(
          circle at ${glowSpot2X}% ${glowSpot2Y}%,
          rgba(255,255,240,${(0.4 + scintillate3 * 0.35) * intensity}) 0%,
          rgba(150,255,200,${(0.25 + scintillate1 * 0.15) * intensity}) 25%,
          transparent 50%
        )
      `;

      // Combine all layers
      const background = `
        ${glowSpot1},
        ${glowSpot2},
        ${rainbowInner1},
        ${rainbowMagenta},
        ${rainbowOuter},
        ${heatEdge1},
        ${heatEdge2},
        ${secondaryScotoma},
        ${tertiaryScotoma},
        ${mainScotoma}
      `;

      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: background,
        opacity: Math.min(0.95, 0.7 + intensity * 0.25),
        pointerEvents: 'none' as const,
        filter: `blur(${2 + intensity * 3}px)`,
        mixBlendMode: 'normal' as const,
        zIndex: 9999
      };
    }

    // Check for CBS Hallucinations
    const hallucinationsEffect = effects.find(e => e.id === 'hallucinations' && e.enabled);
    if (hallucinationsEffect) {
      const intensity = hallucinationsEffect.intensity;

      // Episode system - patterns change every 8-15 seconds with smooth transitions
      const startTime = getHallucinationsStartTime();
      const { episodeSeed, episodeOpacity } = getEpisodeTiming(now, intensity, startTime);
      const episodeConfig = selectEpisodeConfig(episodeSeed, intensity);

      // Animation phases for subtle movement (slowed down)
      const animationPhase = Math.sin(now / 5000) * 0.5 + 0.5;
      const flashPhase = Math.sin(now / 2500) * 0.5 + 0.5;

      // Base opacity scales with intensity
      const baseOpacity = (0.25 + intensity * 0.35) * episodeOpacity;

      const elements: string[] = [];

      // Episode-based patterns (simple + complex hallucinations)
      const patternElements = generateEpisodePatterns(
        episodeConfig,
        intensity,
        baseOpacity,
        animationPhase,
        episodeSeed
      );
      elements.push(...patternElements);

      // Persistent photopsia flashes (always present)
      const numFlashes = Math.floor(2 + intensity * 3);
      const flashOpacityBase = (0.25 + intensity * 0.25) * flashPhase;

      for (let i = 0; i < numFlashes; i++) {
        const x = 20 + (i * 25 + now / 5000) % 60;
        const y = 20 + (i * 30) % 60;
        const size = 5 + (i % 3) * 4;
        const flashOpacity = flashOpacityBase * (0.5 + (i % 3) * 0.25);

        elements.push(`
          radial-gradient(circle ${size}px at ${x}% ${y}%,
            rgba(255,255,255,${flashOpacity}) 0%,
            rgba(255,255,220,${flashOpacity * 0.5}) 40%,
            transparent 100%
          )
        `);
      }

      // Vision loss area gradient
      elements.push(createVisionLossGradient(intensity));

      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: elements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.9, 0.6 + intensity * 0.3),
        pointerEvents: 'none' as const,
        zIndex: 9999
      };
    }

    // Check for Blue Field Entoptic Phenomenon
    const blueFieldEffect = effects.find(e => e.id === 'blueFieldPhenomena' && e.enabled);
    if (blueFieldEffect) {
      const intensity = blueFieldEffect.intensity;
      const elements: string[] = [];
      const numSprites = Math.floor(10 + intensity * 10); // 10-20 sprites

      // Time-based animation for smooth movement
      const time = now / 1000;

      for (let i = 0; i < numSprites; i++) {
        // Deterministic but varied path using index as seed
        const seed = i * 7.31;
        const pathSeed = Math.sin(seed) * 10000;

        // Animation phase for this sprite (staggered)
        const phase = ((time * 1.5 + i * 0.3) % 1.2) / 1.2; // 0-1 cycling faster

        // Central area positioning (within 30% of center)
        const centerOffset = 30;
        const baseX = 50 + Math.sin(pathSeed * 1.1) * centerOffset;
        const baseY = 50 + Math.cos(pathSeed * 1.3) * centerOffset;

        // Path movement
        const pathLength = 15 + Math.abs(Math.sin(pathSeed * 1.7)) * 15;
        const pathAngle = Math.sin(pathSeed * 2.1) * 360 * Math.PI / 180;

        // Curved path with wobble
        const wobble = Math.sin(phase * Math.PI * 4 + pathSeed) * 4;
        const x = baseX + Math.cos(pathAngle) * pathLength * phase + wobble;
        const y = baseY + Math.sin(pathAngle) * pathLength * phase + Math.cos(phase * Math.PI * 3) * 3;

        // Fade in and out along path - sharper transitions for better visibility
        const fadeIn = Math.min(1, phase * 8);
        const fadeOut = Math.min(1, (1 - phase) * 8);
        const spriteOpacity = Math.min(fadeIn, fadeOut) * (0.7 + intensity * 0.3);

        // Sprite size - larger for visibility
        const size = 6 + intensity * 4; // 6-10px

        // Bright white dot with strong glow
        elements.push(`
          radial-gradient(circle ${size}px at ${x}% ${y}%,
            rgba(255,255,255,${spriteOpacity}) 0%,
            rgba(255,255,255,${spriteOpacity * 0.7}) 30%,
            rgba(220,240,255,${spriteOpacity * 0.4}) 60%,
            transparent 100%
          )
        `);

        // Dark tail behind some sprites (red blood cells)
        if (i % 2 === 0 && phase > 0.15) {
          const tailX = x - Math.cos(pathAngle) * 4;
          const tailY = y - Math.sin(pathAngle) * 4;
          elements.push(`
            radial-gradient(circle ${size * 0.5}px at ${tailX}% ${tailY}%,
              rgba(80,40,40,${spriteOpacity * 0.5}) 0%,
              transparent 100%
            )
          `);
        }
      }

      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: elements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: 1,
        pointerEvents: 'none' as const,
        zIndex: 9999
      };
    }

    return null;
  }, [effects, now]);
};

/**
 * Generates overlay styles for visual field effects that need to be rendered
 * as React components rather than DOM manipulation (more reliable in ComparisonView)
 */
const useVisualFieldOverlay = (effects: VisualEffect[]): React.CSSProperties | null => {
  return useMemo(() => {
    // Skip if animated effects are enabled (handled by animated overlay)
    const hasAnimatedEffect = effects.some(e =>
      (e.id === 'visualAura' || e.id === 'visualAuraLeft' || e.id === 'visualAuraRight' || e.id === 'hallucinations' || e.id === 'blueFieldPhenomena') && e.enabled
    );
    if (hasAnimatedEffect) return null;
    // Check for retinitis pigmentosa - matches preview exactly
    const rpEffect = effects.find(e => e.id === 'retinitisPigmentosa' && e.enabled);
    if (rpEffect) {
      const intensity = rpEffect.intensity;
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

    // Check for Stargardt Disease - central vision loss, matches preview exactly
    const stargardtEffect = effects.find(e => e.id === 'stargardt' && e.enabled);
    if (stargardtEffect) {
      const intensity = stargardtEffect.intensity;
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

    // Check for AMD (Age-Related Macular Degeneration) - central vision loss, matches preview exactly
    const amdEffect = effects.find(e => e.id === 'amd' && e.enabled);
    if (amdEffect) {
      const intensity = amdEffect.intensity;
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

    // Check for Diabetic Retinopathy - scattered dark spots, white patches, and red tint
    const drEffect = effects.find(e => e.id === 'diabeticRetinopathy' && e.enabled);
    if (drEffect) {
      const intensity = drEffect.intensity;

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

    // Check for glaucoma
    const glaucomaEffect = effects.find(e => e.id === 'glaucoma' && e.enabled);
    if (glaucomaEffect) {
      const intensity = glaucomaEffect.intensity;
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

    // Check for tunnel vision
    const tunnelVisionEffect = effects.find(e => e.id === 'tunnelVision' && e.enabled);
    if (tunnelVisionEffect) {
      const intensity = tunnelVisionEffect.intensity;
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

    // Check for hemianopia left
    const hemianopiaLeftEffect = effects.find(e => e.id === 'hemianopiaLeft' && e.enabled);
    if (hemianopiaLeftEffect) {
      const intensity = hemianopiaLeftEffect.intensity;
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

    // Check for hemianopia right
    const hemianopiaRightEffect = effects.find(e => e.id === 'hemianopiaRight' && e.enabled);
    if (hemianopiaRightEffect) {
      const intensity = hemianopiaRightEffect.intensity;
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

    // Check for scotoma
    const scotomaEffect = effects.find(e => e.id === 'scotoma' && e.enabled);
    if (scotomaEffect) {
      const intensity = scotomaEffect.intensity;
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

    return null;
  }, [effects]);
};

/**
 * Side-by-side comparison view showing simulation vs original
 */
const ComparisonView: React.FC<ComparisonViewProps> = ({
  effects,
  inputSource,
  getVideoUrl,
  getEffectStyles,
  getDiplopiaOverlay,
  onToggleComparison,
  simulationContainerRef
}) => {
  // Animation state for animated effects
  const [now, setNow] = useState(Date.now());

  // Check if any enabled effect needs animation
  const needsAnimation = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);

  // Animation loop for animated effects
  useEffect(() => {
    if (!needsAnimation) return;

    // Update every 100ms for smooth animation (same as EffectPreview)
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [needsAnimation]);

  // Get visual field overlay styles for React-based rendering
  const visualFieldOverlayStyle = useVisualFieldOverlay(effects);

  // Get animated overlay styles (for visual aura, etc.)
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  return (
    <Box className="comparison-container" sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '400px',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>

      {/* Screen Reader Announcements for Simulation Status */}
      <Box
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {effects.filter(e => e.enabled).length > 0 &&
          `Simulation active with ${effects.filter(e => e.enabled).length} vision condition${effects.filter(e => e.enabled).length > 1 ? 's' : ''} applied`
        }
      </Box>

      {/* Left side - Simulation video */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50%',
        height: '100%',
        borderRight: '2px solid #fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Simulation
        </Box>
        <div ref={simulationContainerRef} style={getEffectStyles()}>
          {inputSource.type === 'youtube' ? (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <iframe
                {...YOUTUBE_IFRAME_PROPS}
                src={getVideoUrl()}
                title="Vision simulation video with applied visual effects"
                aria-label="YouTube video with vision condition simulation applied"
                style={{ width: '100%', height: '100%' }}
              />
              {/* React-based visual field overlay for reliable rendering */}
              {visualFieldOverlayStyle && (
                <div style={visualFieldOverlayStyle} aria-hidden="true" />
              )}
              {/* Animated overlay for visual aura effects */}
              {animatedOverlayStyle && (
                <div style={animatedOverlayStyle} aria-hidden="true" />
              )}
            </div>
          ) : inputSource.type === 'image' && inputSource.url ? (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={inputSource.url}
                alt="Uploaded content with vision condition simulation applied"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              {/* React-based visual field overlay for reliable rendering */}
              {visualFieldOverlayStyle && (
                <div style={visualFieldOverlayStyle} aria-hidden="true" />
              )}
              {/* Animated overlay for visual aura effects */}
              {animatedOverlayStyle && (
                <div style={animatedOverlayStyle} aria-hidden="true" />
              )}
            </div>
          ) : (
            <Box sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Typography>Simulation content would appear here</Typography>
            </Box>
          )}
        </div>
        {getDiplopiaOverlay()}
      </Box>

      {/* Right side - Original video */}
      <Box sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Original
        </Box>
        {inputSource.type === 'youtube' ? (
          <iframe
            {...YOUTUBE_IFRAME_PROPS}
            src={YOUTUBE_EMBED_URL}
            title="Original YouTube video"
            style={{ width: '100%', height: '100%' }}
          />
        ) : inputSource.type === 'image' && inputSource.url ? (
          <img
            src={inputSource.url}
            alt="Original uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Typography>Original content would appear here</Typography>
          </Box>
        )}
      </Box>

      {/* Toggle button */}
      <Box sx={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          onClick={onToggleComparison}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }}
        >
          View Full Simulation
        </Button>
      </Box>
    </Box>
  );
};

export default ComparisonView;
