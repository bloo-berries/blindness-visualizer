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
      const snowIntensity = Math.min(intensity * 1.5, 1.0);
      const snowDensity = Math.min(intensity * 0.8, 0.6);
      const visualSnowBackground = `
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 2px,
          rgba(255,255,255,${snowDensity * 0.3}) 2px,
          rgba(255,255,255,${snowDensity * 0.3}) 3px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 2px,
          rgba(255,255,255,${snowDensity * 0.2}) 2px,
          rgba(255,255,255,${snowDensity * 0.2}) 3px
        ),
        repeating-linear-gradient(
          45deg,
          transparent 0px,
          transparent 3px,
          rgba(255,255,255,${snowDensity * 0.1}) 3px,
          rgba(255,255,255,${snowDensity * 0.1}) 4px
        )
      `;
      return {
        background: visualSnowBackground,
        backgroundSize: '4px 4px, 4px 4px, 6px 6px',
        mixBlendMode: 'screen' as const,
        opacity: Math.min(0.8, snowIntensity)
      };
    }
    
    case 'hallucinations': {
      const hallucinationIntensity = Math.min(intensity * 1.8, 1.0);
      const hallucinationElements: string[] = [];
      
      // Human-like figures
      for (let i = 0; i < 2 + Math.floor(intensity * 3); i++) {
        const baseX = 20 + (i * 25) % 60;
        const baseY = 30 + (i * 35) % 40;
        const figureOpacity = 0.3 + (i % 3) * 0.1;
        hallucinationElements.push(`
          radial-gradient(ellipse 15px 25px at ${baseX}% ${baseY}%, 
            rgba(0,0,0,${figureOpacity * hallucinationIntensity}) 0%, 
            rgba(0,0,0,${figureOpacity * 0.6 * hallucinationIntensity}) 40%,
            rgba(0,0,0,${figureOpacity * 0.3 * hallucinationIntensity}) 70%,
            rgba(0,0,0,0) 100%
          )
        `);
      }
      
      // Objects and shapes
      for (let i = 0; i < 3 + Math.floor(intensity * 4); i++) {
        const baseX = 10 + (i * 30) % 70;
        const baseY = 20 + (i * 25) % 60;
        const objectOpacity = 0.2 + (i % 2) * 0.1;
        const objectSize = 8 + (i % 3) * 2;
        if (i % 2 === 0) {
          hallucinationElements.push(`
            radial-gradient(circle ${objectSize}px at ${baseX}% ${baseY}%, 
              rgba(100,100,100,${objectOpacity * hallucinationIntensity}) 0%, 
              rgba(100,100,100,${objectOpacity * 0.5 * hallucinationIntensity}) 60%,
              rgba(100,100,100,0) 100%
            )
          `);
        } else {
          hallucinationElements.push(`
            radial-gradient(ellipse ${objectSize}px ${objectSize * 1.5}px at ${baseX}% ${baseY}%, 
              rgba(80,80,80,${objectOpacity * hallucinationIntensity}) 0%, 
              rgba(80,80,80,${objectOpacity * 0.4 * hallucinationIntensity}) 70%,
              rgba(80,80,80,0) 100%
            )
          `);
        }
      }
      
      return {
        background: hallucinationElements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.9, hallucinationIntensity)
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

