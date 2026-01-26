/**
 * Generates preview overlay styles for visual disturbance conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';

export const generateVisualDisturbancePreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  switch (effectType) {
    case 'visualFloaters': {
      const floaterPattern = `
        radial-gradient(ellipse 15% 6% at 30% 30%, rgba(0,0,0,${0.6 * intensity}) 0%, rgba(0,0,0,0) 70%),
        radial-gradient(ellipse 12% 5% at 70% 40%, rgba(0,0,0,${0.5 * intensity}) 0%, rgba(0,0,0,0) 65%),
        radial-gradient(circle 8% at 50% 70%, rgba(0,0,0,${0.4 * intensity}) 0%, rgba(0,0,0,0) 60%)
      `;
      return {
        background: floaterPattern,
        mixBlendMode: 'multiply' as const,
        opacity: Math.min(0.8, intensity)
      };
    }
    
    case 'visualSnow': {
      // Visual Snow Syndrome - persistent static overlay like TV noise or shaken snow globe
      // NO rapid flashing/strobing - gentle movement only
      const snowIntensity = Math.min(intensity * 1.2, 1.0);

      // Slow drift animation phase (not rapid flickering)
      const driftX = Math.sin(now / 2000) * 2; // Very slow horizontal drift
      const driftY = Math.cos(now / 2500) * 1.5; // Very slow vertical drift

      // Generate static dot patterns - mix of light, dark, and grayish dots
      const dotPatterns: string[] = [];
      for (let i = 0; i < 30; i++) {
        const x = (i * 17.3 + driftX) % 100;
        const y = (i * 23.7 + driftY) % 100;
        const size = 0.5 + (i % 4) * 0.5; // Tiny dots
        const dotType = i % 5;
        let color: string;
        const baseOpacity = (0.15 + (i % 10) * 0.035) * intensity;

        if (dotType === 0) {
          color = `rgba(255,255,255,${baseOpacity})`; // White
        } else if (dotType === 1) {
          color = `rgba(0,0,0,${baseOpacity * 0.8})`; // Dark
        } else if (dotType === 2) {
          color = `rgba(180,180,180,${baseOpacity * 0.9})`; // Gray
        } else if (dotType === 3) {
          color = `rgba(200,210,230,${baseOpacity * 0.7})`; // Slight blue tint
        } else {
          color = `rgba(220,220,220,${baseOpacity * 0.5})`; // Faint
        }
        dotPatterns.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
      }

      // Second layer of dots at different positions for depth
      const dotPatterns2: string[] = [];
      for (let i = 0; i < 20; i++) {
        const x = (i * 31.1 + 13 - driftX * 0.5) % 100;
        const y = (i * 19.9 + 7 - driftY * 0.5) % 100;
        const size = 0.8 + (i % 3) * 0.5;
        const opacity = (0.1 + (i % 8) * 0.025) * intensity;
        const isLight = i % 2 === 0;
        const color = isLight
          ? `rgba(240,240,245,${opacity})`
          : `rgba(60,60,70,${opacity * 0.7})`;
        dotPatterns2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
      }

      // Fine grain texture (TV static pattern)
      const grainOpacity = 0.08 + intensity * 0.1;
      const grainPattern = `
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 1px,
          rgba(200,200,200,${grainOpacity}) 1px,
          rgba(200,200,200,${grainOpacity}) 2px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 1px,
          rgba(150,150,150,${grainOpacity * 0.7}) 1px,
          rgba(150,150,150,${grainOpacity * 0.7}) 2px
        )
      `;

      const allPatterns = [
        ...dotPatterns,
        ...dotPatterns2,
        grainPattern
      ].join(', ');

      return {
        background: allPatterns,
        backgroundSize: '100% 100%',
        mixBlendMode: 'overlay' as const,
        opacity: Math.min(0.85, 0.6 + snowIntensity * 0.25)
      };
    }
    
    case 'hallucinations': {
      // Visual Hallucinations - Mixed type with patterns, lights, shadows, and figures
      const fadePhase = Math.sin(now / 3000) * 0.5 + 0.5; // Slow fade in/out
      const driftPhase = Math.sin(now / 4000) * 0.5 + 0.5;

      const elements: string[] = [];

      // Geometric lattice pattern (fades in periphery)
      const patternOpacity = (0.1 + intensity * 0.15) * fadePhase;
      elements.push(`
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 12px,
          rgba(100,80,120,${patternOpacity * 0.4}) 12px,
          rgba(100,80,120,${patternOpacity * 0.4}) 13px
        )
      `);
      elements.push(`
        repeating-linear-gradient(
          60deg,
          transparent 0px,
          transparent 12px,
          rgba(80,100,120,${patternOpacity * 0.3}) 12px,
          rgba(80,100,120,${patternOpacity * 0.3}) 13px
        )
      `);

      // Light phenomena - colored glows
      const lightPositions = [
        { x: 75, y: 25, hue: 200 },
        { x: 20, y: 70, hue: 280 },
        { x: 85, y: 60, hue: 40 },
      ];
      for (let i = 0; i < lightPositions.length; i++) {
        const pos = lightPositions[i];
        const lightOpacity = (0.15 + (i % 2) * 0.1) * intensity * (0.7 + fadePhase * 0.3);
        const drift = driftPhase * 3;
        elements.push(`
          radial-gradient(circle 12px at ${pos.x + drift}% ${pos.y - drift}%,
            hsla(${pos.hue},50%,65%,${lightOpacity}) 0%,
            hsla(${pos.hue},40%,55%,${lightOpacity * 0.4}) 50%,
            transparent 100%
          )
        `);
      }

      // Bright flash spots
      elements.push(`
        radial-gradient(circle 5px at 30% 40%,
          rgba(255,255,255,${0.25 * intensity * fadePhase}) 0%,
          transparent 100%
        )
      `);

      // Shadowy figures in periphery
      const figurePositions = [
        { x: 8, y: 45 },
        { x: 92, y: 40 },
      ];
      for (let i = 0; i < figurePositions.length; i++) {
        const pos = figurePositions[i];
        const figureOpacity = (0.2 + i * 0.05) * intensity * (0.6 + driftPhase * 0.4);
        // Head
        elements.push(`
          radial-gradient(ellipse 8px 10px at ${pos.x}% ${pos.y - 6}%,
            rgba(20,20,30,${figureOpacity}) 0%,
            transparent 100%
          )
        `);
        // Body
        elements.push(`
          radial-gradient(ellipse 12px 22px at ${pos.x}% ${pos.y + 8}%,
            rgba(15,15,25,${figureOpacity * 0.8}) 0%,
            rgba(15,15,25,${figureOpacity * 0.3}) 60%,
            transparent 100%
          )
        `);
      }

      // Small shadowy shapes
      for (let i = 0; i < 2; i++) {
        const x = 25 + i * 50;
        const y = 70 + (i * 10);
        const shapeOpacity = 0.12 * intensity * driftPhase;
        elements.push(`
          radial-gradient(ellipse 15px 8px at ${x}% ${y}%,
            rgba(30,25,35,${shapeOpacity}) 0%,
            transparent 100%
          )
        `);
      }

      // Face-like suggestion (pareidolia)
      const faceOpacity = 0.1 * intensity * fadePhase;
      elements.push(`
        radial-gradient(ellipse 15px 18px at 70% 30%,
          transparent 65%,
          rgba(60,50,70,${faceOpacity * 0.4}) 85%,
          transparent 100%
        )
      `);
      // Eyes
      elements.push(`
        radial-gradient(ellipse 3px 2px at 67% 27%,
          rgba(20,20,30,${faceOpacity}) 0%,
          transparent 100%
        )
      `);
      elements.push(`
        radial-gradient(ellipse 3px 2px at 73% 27%,
          rgba(20,20,30,${faceOpacity}) 0%,
          transparent 100%
        )
      `);

      // Vignette to emphasize peripheral hallucinations
      elements.push(`
        radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 100%)
      `);

      return {
        background: elements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.85, 0.5 + intensity * 0.35)
      };
    }
    
    case 'visualAura':
    case 'visualAuraLeft':
    case 'visualAuraRight': {
      // Visual aura - blob-like scotoma with soft prismatic rainbow edges
      // Based on Mayo Clinic reference images with heat wave distortion

      // Animation time for scintillation (half of original speed)
      const time = now / 60;
      const shimmerPhase = Math.sin(time * 0.15) * 0.5 + 0.5;

      // Multiple scintillation frequencies (half of original speed)
      const scintillate1 = Math.sin(time * 0.5) * 0.5 + 0.5;
      const scintillate2 = Math.sin(time * 0.75 + 1.2) * 0.5 + 0.5;
      const scintillate3 = Math.sin(time * 0.35 + 2.1) * 0.5 + 0.5;

      // Heat wave distortion frequencies - multiple waves for organic shimmer
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

      // Main scotoma - large soft grayish-white blob with heat wave edges
      const scotomaOpacity = 0.75 + shimmerPhase * 0.1;

      // Create multiple overlapping blobs with offset distortion for heat wave effect
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

      // Heat wave edge layers - overlapping blobs with phase-shifted distortion
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

      // Combine all layers including heat wave edges
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
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: background,
        opacity: Math.min(0.95, 0.7 + intensity * 0.25),
        pointerEvents: 'none' as const,
        filter: `blur(${2 + intensity * 3}px)`,
        mixBlendMode: 'normal' as const
      } as React.CSSProperties;
    }
    
    default:
      return null;
  }
};

