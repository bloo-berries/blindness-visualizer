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
export const ANIMATED_EFFECTS = ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'hallucinations', 'blueFieldPhenomena', 'persistentPositiveVisualPhenomenon', 'palinopsia', 'starbursting'];

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
 * Generate Persistent Positive Visual Phenomenon overlay styles
 * Afterimages that persist much longer than normal, bright spots, and complementary colored shapes
 */
function generatePersistentPositiveOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Pulsing phase for persistence effect
  const pulsePhase = Math.sin(time * 0.3) * 0.15 + 0.85;
  const slowPulse = Math.sin(time * 0.15) * 0.1 + 0.9;

  // Number of afterimage spots based on intensity
  const numSpots = Math.floor(5 + intensity * 8); // 5-13 spots

  // Generate persistent afterimage spots
  for (let i = 0; i < numSpots; i++) {
    // Deterministic positioning
    const seed = i * 3.17;
    const x = 15 + (Math.sin(seed * 1.1) * 0.5 + 0.5) * 70;
    const y = 15 + (Math.cos(seed * 1.3) * 0.5 + 0.5) * 70;

    // Slight drift for "lingering" effect
    const driftX = Math.sin(time * 0.2 + seed) * 2;
    const driftY = Math.cos(time * 0.15 + seed * 1.2) * 2;
    const actualX = x + driftX;
    const actualY = y + driftY;

    // Size varies
    const size = 8 + (i % 5) * 6;

    // Alternate between complementary colors (negative afterimages)
    // and bright spots (positive afterimages)
    const colorType = i % 6;
    let color: string;
    const baseOpacity = (0.3 + (i % 4) * 0.1) * intensity * pulsePhase;

    switch (colorType) {
      case 0: // Cyan (complementary to red)
        color = `rgba(0,255,255,${baseOpacity})`;
        break;
      case 1: // Magenta (complementary to green)
        color = `rgba(255,0,255,${baseOpacity * 0.9})`;
        break;
      case 2: // Yellow (complementary to blue)
        color = `rgba(255,255,0,${baseOpacity * 0.85})`;
        break;
      case 3: // Bright white (positive afterimage)
        color = `rgba(255,255,255,${baseOpacity})`;
        break;
      case 4: // Pale blue
        color = `rgba(150,200,255,${baseOpacity * 0.9})`;
        break;
      default: // Pale green
        color = `rgba(180,255,180,${baseOpacity * 0.85})`;
    }

    // Create soft, glowing afterimage spots
    elements.push(`
      radial-gradient(
        ellipse ${size}% ${size * 0.8}% at ${actualX}% ${actualY}%,
        ${color} 0%,
        ${color.replace(/[\d.]+\)$/, `${baseOpacity * 0.5})`)} 40%,
        transparent 100%
      )
    `);
  }

  // Add larger, more diffuse "ghost" shapes that persist
  const numGhosts = Math.floor(2 + intensity * 3);
  for (let i = 0; i < numGhosts; i++) {
    const seed = i * 7.23 + 100;
    const x = 20 + (Math.sin(seed * 0.9) * 0.5 + 0.5) * 60;
    const y = 20 + (Math.cos(seed * 1.1) * 0.5 + 0.5) * 60;
    const driftX = Math.sin(time * 0.1 + seed) * 3;
    const driftY = Math.cos(time * 0.08 + seed) * 3;
    const actualX = x + driftX;
    const actualY = y + driftY;
    const width = 15 + (i % 3) * 8;
    const height = 12 + (i % 4) * 6;
    const ghostOpacity = (0.15 + (i % 3) * 0.08) * intensity * slowPulse;

    // Faded ghost image effect
    elements.push(`
      radial-gradient(
        ellipse ${width}% ${height}% at ${actualX}% ${actualY}%,
        rgba(255,255,255,${ghostOpacity}) 0%,
        rgba(240,245,255,${ghostOpacity * 0.6}) 30%,
        rgba(220,235,255,${ghostOpacity * 0.3}) 60%,
        transparent 100%
      )
    `);
  }

  // Add geometric pattern persistence (common in PPVP)
  const patternOpacity = 0.12 * intensity * pulsePhase;
  elements.push(`
    radial-gradient(
      circle at 30% 40%,
      rgba(255,200,100,${patternOpacity}) 0%,
      transparent 15%
    )
  `);
  elements.push(`
    radial-gradient(
      circle at 70% 35%,
      rgba(100,200,255,${patternOpacity * 0.9}) 0%,
      transparent 12%
    )
  `);
  elements.push(`
    radial-gradient(
      circle at 55% 65%,
      rgba(255,150,200,${patternOpacity * 0.85}) 0%,
      transparent 18%
    )
  `);

  // Overall slight brightness/haze to simulate visual interference
  elements.push(`
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      rgba(255,255,255,${0.08 * intensity * slowPulse}) 0%,
      transparent 70%
    )
  `);

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: elements.join(', '),
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.95, 0.6 + intensity * 0.35),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}

/**
 * Generate Palinopsia (Visual Perseveration) overlay styles
 * Trailing images, light streaking, and prolonged afterimages
 */
function generatePalinopsiaOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Subtle animation for the trailing effect
  const trailPhase = Math.sin(time * 0.4) * 0.1 + 0.9;
  const driftPhase = Math.sin(time * 0.2) * 2;

  // Number of trail copies based on intensity (3-8 trails)
  const numTrails = Math.floor(3 + intensity * 5);

  // Create trailing ghost images - offset in a direction to simulate motion trail
  const trailAngle = (time * 0.1) % (Math.PI * 2);
  const baseTrailDistance = 3 + intensity * 8;

  for (let i = 1; i <= numTrails; i++) {
    const distance = baseTrailDistance * i * 0.4;
    const offsetX = Math.cos(trailAngle) * distance + driftPhase * 0.3;
    const offsetY = Math.sin(trailAngle) * distance;

    const trailOpacity = (0.25 - i * 0.03) * intensity * trailPhase;

    elements.push(`
      radial-gradient(
        ellipse 100% 100% at ${50 + offsetX}% ${50 + offsetY}%,
        rgba(200,200,200,${trailOpacity}) 0%,
        rgba(180,180,180,${trailOpacity * 0.7}) 30%,
        rgba(150,150,150,${trailOpacity * 0.4}) 60%,
        transparent 85%
      )
    `);
  }

  // Light streaking effect
  const streakOpacity = 0.15 * intensity * trailPhase;
  const streakAngle = (trailAngle * 180 / Math.PI);

  elements.push(`
    linear-gradient(
      ${streakAngle}deg,
      transparent 0%,
      rgba(255,255,255,${streakOpacity}) 20%,
      rgba(255,255,255,${streakOpacity * 1.2}) 40%,
      rgba(255,255,255,${streakOpacity * 0.8}) 60%,
      rgba(255,255,255,${streakOpacity * 0.4}) 80%,
      transparent 100%
    )
  `);

  // Prolonged afterimage spots
  const numAfterimages = Math.floor(2 + intensity * 4);
  for (let i = 0; i < numAfterimages; i++) {
    const seed = i * 5.17;
    const x = 20 + (Math.sin(seed * 1.3) * 0.5 + 0.5) * 60;
    const y = 20 + (Math.cos(seed * 1.1) * 0.5 + 0.5) * 60;

    const driftX = Math.sin(time * 0.15 + seed) * 3;
    const driftY = Math.cos(time * 0.12 + seed * 0.8) * 3;
    const actualX = x + driftX;
    const actualY = y + driftY;

    const size = 10 + (i % 4) * 5;
    const afterimageOpacity = (0.12 + (i % 3) * 0.05) * intensity * trailPhase;

    elements.push(`
      radial-gradient(
        ellipse ${size}% ${size * 0.8}% at ${actualX}% ${actualY}%,
        rgba(255,255,255,${afterimageOpacity}) 0%,
        rgba(240,240,240,${afterimageOpacity * 0.6}) 40%,
        transparent 100%
      )
    `);
  }

  // Overall haze
  elements.push(`
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      rgba(255,255,255,${0.05 * intensity * trailPhase}) 0%,
      transparent 70%
    )
  `);

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: elements.join(', '),
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.9, 0.5 + intensity * 0.4),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}

/**
 * Generate animated Starbursting overlay
 * Creates dynamic starbursts that move across the frame to catch various light sources
 */
function generateStarburstingOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Many light source positions that slowly drift to catch various bright spots
  // Covers common light source areas: upper sky, middle where lights/windows appear, scattered
  const baseLightSources = [
    // Upper row (sky, sun, overhead lights)
    { baseX: 15, baseY: 8, size: 0.5, phase: 0 },
    { baseX: 35, baseY: 12, size: 0.7, phase: 1.2 },
    { baseX: 50, baseY: 6, size: 0.9, phase: 0.5 },
    { baseX: 65, baseY: 10, size: 0.75, phase: 1.8 },
    { baseX: 85, baseY: 8, size: 0.55, phase: 2.5 },
    // Upper-middle row (street lights, signs, windows)
    { baseX: 10, baseY: 25, size: 0.5, phase: 0.8 },
    { baseX: 30, baseY: 22, size: 0.6, phase: 2.1 },
    { baseX: 50, baseY: 28, size: 0.65, phase: 1.5 },
    { baseX: 70, baseY: 24, size: 0.55, phase: 0.3 },
    { baseX: 90, baseY: 26, size: 0.5, phase: 2.8 },
    // Middle row (shop windows, car lights, reflections)
    { baseX: 20, baseY: 42, size: 0.45, phase: 1.0 },
    { baseX: 40, baseY: 38, size: 0.5, phase: 2.3 },
    { baseX: 60, baseY: 45, size: 0.55, phase: 0.7 },
    { baseX: 80, baseY: 40, size: 0.5, phase: 1.9 },
    // Lower-middle row (ground reflections, low lights)
    { baseX: 25, baseY: 60, size: 0.4, phase: 1.6 },
    { baseX: 50, baseY: 58, size: 0.45, phase: 2.6 },
    { baseX: 75, baseY: 62, size: 0.4, phase: 0.4 },
  ];

  // Number of rays (8 is classic starburst)
  const numRays = 8;
  const rayWidth = 0.8 + intensity * 0.7;

  for (const source of baseLightSources) {
    // Slow drift movement for each starburst
    const driftX = Math.sin(time * 0.15 + source.phase) * 8;
    const driftY = Math.cos(time * 0.12 + source.phase * 1.3) * 6;
    const x = source.baseX + driftX;
    const y = source.baseY + driftY;

    // Pulsing intensity - each source pulses at different rates
    const pulsePhase = Math.sin(time * 0.4 + source.phase * 2) * 0.3 + 0.7;
    const baseOpacity = (0.35 + intensity * 0.45) * source.size * pulsePhase;

    // Skip if opacity too low (performance optimization)
    if (baseOpacity < 0.1) continue;

    const rayLength = (20 + intensity * 35) * source.size;

    // Build conic gradient stops for sharp, thin rays
    const conicStops: string[] = [];
    const angleStep = 360 / numRays;

    for (let i = 0; i < numRays; i++) {
      const rayAngle = i * angleStep;

      conicStops.push(`transparent ${rayAngle - rayWidth}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle - rayWidth * 0.5}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity}) ${rayAngle}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle + rayWidth * 0.5}deg`);
      conicStops.push(`transparent ${rayAngle + rayWidth}deg`);
    }

    // Conic gradient for the star rays pattern
    elements.push(`
      conic-gradient(
        from 22.5deg at ${x}% ${y}%,
        ${conicStops.join(', ')}
      )
    `);

    // Radial gradient to fade the rays outward
    elements.push(`
      radial-gradient(
        ellipse ${rayLength * 1.2}% ${rayLength}% at ${x}% ${y}%,
        transparent 0%,
        transparent 3%,
        rgba(0,0,0,0.3) 15%,
        rgba(0,0,0,0.7) 40%,
        rgba(0,0,0,0.95) 70%,
        black 100%
      )
    `);

    // Bright central glow/core
    const coreSize = 2 + intensity * 3;
    elements.push(`
      radial-gradient(
        circle at ${x}% ${y}%,
        rgba(255,255,255,${Math.min(1, baseOpacity * 1.4)}) 0%,
        rgba(255,255,240,${baseOpacity * 0.9}) ${coreSize * 0.4}%,
        rgba(255,255,220,${baseOpacity * 0.5}) ${coreSize * 0.7}%,
        transparent ${coreSize * 1.5}%
      )
    `);

    // Secondary thin rays for extra sharpness
    const secondaryStops: string[] = [];
    const thinRayWidth = rayWidth * 0.35;
    for (let i = 0; i < numRays; i++) {
      const rayAngle = i * angleStep + angleStep / 2;
      secondaryStops.push(`transparent ${rayAngle - thinRayWidth}deg`);
      secondaryStops.push(`rgba(255,255,255,${baseOpacity * 0.25}) ${rayAngle}deg`);
      secondaryStops.push(`transparent ${rayAngle + thinRayWidth}deg`);
    }

    elements.push(`
      conic-gradient(
        from 22.5deg at ${x}% ${y}%,
        ${secondaryStops.join(', ')}
      )
    `);
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
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.95, 0.5 + intensity * 0.45),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}

/**
 * Hook that generates animated overlay styles for visual aura, hallucinations, blue field, PPVP, palinopsia, and starbursting effects
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

    // Check for Persistent Positive Visual Phenomenon
    const ppvpEffect = effects.find(e => e.id === 'persistentPositiveVisualPhenomenon' && e.enabled);
    if (ppvpEffect) {
      return generatePersistentPositiveOverlay(ppvpEffect.intensity, now);
    }

    // Check for Palinopsia
    const palinopsiaEffect = effects.find(e => e.id === 'palinopsia' && e.enabled);
    if (palinopsiaEffect) {
      return generatePalinopsiaOverlay(palinopsiaEffect.intensity, now);
    }

    // Check for Starbursting
    const starburstingEffect = effects.find(e => e.id === 'starbursting' && e.enabled);
    if (starburstingEffect) {
      return generateStarburstingOverlay(starburstingEffect.intensity, now);
    }

    return null;
  }, [effects, now]);
};
