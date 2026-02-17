/**
 * Hook for generating animated overlay styles for visual effects
 * Handles Visual Aura, CBS Hallucinations, and Blue Field Entoptic Phenomenon
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  getHallucinationsStartTime
} from '../../../utils/overlays/cbsHallucinations';

/**
 * Effects that require animation updates
 */
export const ANIMATED_EFFECTS = ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'hallucinations', 'blueFieldPhenomena'];

/**
 * Generate visual aura overlay styles
 */
function generateVisualAuraOverlay(
  effectType: string,
  intensity: number,
  now: number
): React.CSSProperties {
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

/**
 * Generate CBS Hallucinations overlay styles
 */
function generateHallucinationsOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
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

/**
 * Generate Blue Field Entoptic Phenomenon overlay styles
 */
function generateBlueFieldOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
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

/**
 * Hook that generates animated overlay styles for visual aura, hallucinations, and blue field effects
 */
export const useAnimatedOverlay = (effects: VisualEffect[], now: number): React.CSSProperties | null => {
  return useMemo(() => {
    // Check for visual aura variants
    const auraEffect = effects.find(e =>
      (e.id === 'visualAura' || e.id === 'visualAuraLeft' || e.id === 'visualAuraRight') && e.enabled
    );

    if (auraEffect) {
      return generateVisualAuraOverlay(auraEffect.id, auraEffect.intensity, now);
    }

    // Check for CBS Hallucinations
    const hallucinationsEffect = effects.find(e => e.id === 'hallucinations' && e.enabled);
    if (hallucinationsEffect) {
      return generateHallucinationsOverlay(hallucinationsEffect.intensity, now);
    }

    // Check for Blue Field Entoptic Phenomenon
    const blueFieldEffect = effects.find(e => e.id === 'blueFieldPhenomena' && e.enabled);
    if (blueFieldEffect) {
      return generateBlueFieldOverlay(blueFieldEffect.intensity, now);
    }

    return null;
  }, [effects, now]);
};
