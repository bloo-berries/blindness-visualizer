/**
 * Generates preview overlay styles for visual disturbance conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  getHallucinationsStartTime
} from '../../../utils/overlays/cbsHallucinations';

export const generateVisualDisturbancePreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  switch (effectType) {
    case 'visualFloaters': {
      // Note: visualFloaters is now handled directly in generatePreviewOverlayStyle
      // This case is kept as a fallback
      const baseOpacity = 0.4 + intensity * 0.4;
      return {
        background: `
          radial-gradient(ellipse 25% 10% at 25% 25%, rgba(40,35,30,${baseOpacity}) 0%, transparent 100%),
          radial-gradient(ellipse 20% 8% at 70% 35%, rgba(35,30,25,${baseOpacity * 0.9}) 0%, transparent 100%),
          radial-gradient(circle 12% at 45% 65%, rgba(30,25,20,${baseOpacity * 0.85}) 0%, transparent 100%)
        `,
        mixBlendMode: 'multiply' as const,
        opacity: Math.max(0.6, Math.min(0.95, intensity))
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
      // Charles Bonnet Syndrome / Release Hallucinations (Stroke/TBI)
      // Episodic variation: different hallucinations appear/disappear every 8-15 seconds
      // Uses shared pattern generators for sync with main visualizer

      // Episode system - patterns change every 8-15 seconds with smooth transitions
      // Using shared start time ensures preview and main visualizer stay in sync
      const startTime = getHallucinationsStartTime();
      const { episodeSeed, episodeOpacity } = getEpisodeTiming(now, intensity, startTime);
      const episodeConfig = selectEpisodeConfig(episodeSeed, intensity);

      // Animation phases for subtle movement (slowed down for more natural feel)
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
        background: elements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.9, 0.6 + intensity * 0.3)
      };
    }

    case 'blueFieldPhenomena': {
      // Blue Field Entoptic Phenomenon (Scheerer's Phenomenon)
      // Tiny bright dots moving quickly along curved paths in central vision
      // Simulates white blood cells moving in retinal capillaries

      const elements: string[] = [];
      const numSprites = Math.floor(10 + intensity * 10); // 10-20 sprites for preview

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
        background: elements.join(', '),
        mixBlendMode: 'normal' as const,
        opacity: 1
      };
    }

    case 'starbursting': {
      // Starbursting - sharp star-like rays/spikes radiating from light sources
      // Based on reference images: thin, crisp rays at regular angles (typically 6-8 rays)
      // Uses conic gradients to create the distinctive star pattern
      // Caused by astigmatism, cataracts, LASIK, keratoconus, etc.

      const elements: string[] = [];

      // Light sources positioned at typical bright spots in an outdoor scene
      const lightSources = [
        { x: 50, y: 10, size: 1.0 },    // Top center (sky/sun) - primary
        { x: 20, y: 20, size: 0.55 },   // Upper left
        { x: 80, y: 15, size: 0.6 },    // Upper right
        { x: 65, y: 35, size: 0.4 },    // Mid right
        { x: 30, y: 55, size: 0.35 },   // Lower left
      ];

      // Number of rays (6-8 is typical for starbursting)
      const numRays = 8;
      const rayWidth = 0.8 + intensity * 0.7; // Thin rays: 0.8-1.5 degrees

      for (const source of lightSources) {
        const baseOpacity = (0.5 + intensity * 0.45) * source.size;
        const rayLength = (25 + intensity * 40) * source.size;

        // Build conic gradient stops for sharp, thin rays
        const conicStops: string[] = [];
        const angleStep = 360 / numRays;

        for (let i = 0; i < numRays; i++) {
          const rayAngle = i * angleStep;

          // Create sharp ray with quick fade at edges
          conicStops.push(`transparent ${rayAngle - rayWidth}deg`);
          conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle - rayWidth * 0.5}deg`);
          conicStops.push(`rgba(255,255,255,${baseOpacity}) ${rayAngle}deg`);
          conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle + rayWidth * 0.5}deg`);
          conicStops.push(`transparent ${rayAngle + rayWidth}deg`);
        }

        // Conic gradient for the star rays pattern
        elements.push(`
          conic-gradient(
            from 22.5deg at ${source.x}% ${source.y}%,
            ${conicStops.join(', ')}
          )
        `);

        // Radial gradient to fade the rays outward (brighter near center, fading out)
        // This overlays and modulates the conic gradient intensity
        elements.push(`
          radial-gradient(
            ellipse ${rayLength * 1.2}% ${rayLength}% at ${source.x}% ${source.y}%,
            transparent 0%,
            transparent 3%,
            rgba(0,0,0,0.3) 15%,
            rgba(0,0,0,0.7) 40%,
            rgba(0,0,0,0.95) 70%,
            black 100%
          )
        `);

        // Bright central glow/core at each light source
        const coreSize = 3 + intensity * 4;
        elements.push(`
          radial-gradient(
            circle at ${source.x}% ${source.y}%,
            rgba(255,255,255,${Math.min(1, baseOpacity * 1.3)}) 0%,
            rgba(255,255,240,${baseOpacity * 0.9}) ${coreSize * 0.4}%,
            rgba(255,255,220,${baseOpacity * 0.5}) ${coreSize * 0.7}%,
            rgba(255,255,200,${baseOpacity * 0.2}) ${coreSize}%,
            transparent ${coreSize * 1.5}%
          )
        `);

        // Secondary thin rays for extra sharpness (offset by half the angle step)
        const secondaryStops: string[] = [];
        const thinRayWidth = rayWidth * 0.4;
        for (let i = 0; i < numRays; i++) {
          const rayAngle = i * angleStep + angleStep / 2; // Offset

          secondaryStops.push(`transparent ${rayAngle - thinRayWidth}deg`);
          secondaryStops.push(`rgba(255,255,255,${baseOpacity * 0.3}) ${rayAngle}deg`);
          secondaryStops.push(`transparent ${rayAngle + thinRayWidth}deg`);
        }

        elements.push(`
          conic-gradient(
            from 22.5deg at ${source.x}% ${source.y}%,
            ${secondaryStops.join(', ')}
          )
        `);
      }

      return {
        background: elements.join(', '),
        mixBlendMode: 'screen' as const,
        opacity: Math.min(0.95, 0.5 + intensity * 0.45)
      };
    }

    case 'palinopsia': {
      // Palinopsia (Visual Perseveration) - trailing images and afterimages
      // Creates multiple faded "ghost" copies offset to simulate trailing effect
      // Based on descriptions of visual trailing and prolonged afterimages

      const elements: string[] = [];
      const time = now / 1000;

      // Subtle animation for the trailing effect
      const trailPhase = Math.sin(time * 0.4) * 0.1 + 0.9;
      const driftPhase = Math.sin(time * 0.2) * 2;

      // Number of trail copies based on intensity (3-8 trails)
      const numTrails = Math.floor(3 + intensity * 5);

      // Create trailing ghost images - offset in a direction to simulate motion trail
      // The trail direction shifts slowly to simulate different movement
      const trailAngle = (time * 0.1) % (Math.PI * 2);
      const baseTrailDistance = 3 + intensity * 8; // How far apart the trails are

      for (let i = 1; i <= numTrails; i++) {
        // Each trail is progressively more offset and more faded
        const distance = baseTrailDistance * i * 0.4;
        const offsetX = Math.cos(trailAngle) * distance + driftPhase * 0.3;
        const offsetY = Math.sin(trailAngle) * distance;

        // Opacity decreases for each successive trail (oldest = faintest)
        const trailOpacity = (0.25 - i * 0.03) * intensity * trailPhase;

        // Create a large semi-transparent overlay shifted in the trail direction
        // This simulates the "ghost" of the previous image position
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

      // Add light streaking effect (common in palinopsia)
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

      // Add prolonged afterimage spots (positive afterimages - same color, not complementary)
      const numAfterimages = Math.floor(2 + intensity * 4);
      for (let i = 0; i < numAfterimages; i++) {
        const seed = i * 5.17;
        const x = 20 + (Math.sin(seed * 1.3) * 0.5 + 0.5) * 60;
        const y = 20 + (Math.cos(seed * 1.1) * 0.5 + 0.5) * 60;

        // Slow drift for lingering effect
        const driftX = Math.sin(time * 0.15 + seed) * 3;
        const driftY = Math.cos(time * 0.12 + seed * 0.8) * 3;
        const actualX = x + driftX;
        const actualY = y + driftY;

        const size = 10 + (i % 4) * 5;
        const afterimageOpacity = (0.12 + (i % 3) * 0.05) * intensity * trailPhase;

        // Bright, persistent afterimage
        elements.push(`
          radial-gradient(
            ellipse ${size}% ${size * 0.8}% at ${actualX}% ${actualY}%,
            rgba(255,255,255,${afterimageOpacity}) 0%,
            rgba(240,240,240,${afterimageOpacity * 0.6}) 40%,
            transparent 100%
          )
        `);
      }

      // Subtle overall haze to simulate visual persistence
      elements.push(`
        radial-gradient(
          ellipse 100% 100% at 50% 50%,
          rgba(255,255,255,${0.05 * intensity * trailPhase}) 0%,
          transparent 70%
        )
      `);

      return {
        background: elements.join(', '),
        mixBlendMode: 'screen' as const,
        opacity: Math.min(0.9, 0.5 + intensity * 0.4)
      };
    }

    case 'persistentPositiveVisualPhenomenon': {
      // Persistent Positive Visual Phenomena
      // Afterimages that persist much longer than normal, bright spots, shapes, and patterns
      // Can appear as positive (same color) or negative (complementary color) afterimages

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
        background: elements.join(', '),
        mixBlendMode: 'screen' as const,
        opacity: Math.min(0.95, 0.6 + intensity * 0.35)
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

