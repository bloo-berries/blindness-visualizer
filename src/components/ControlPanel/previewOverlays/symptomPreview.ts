/**
 * Generates preview overlay styles for symptom conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';

export const generateSymptomPreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  switch (effectType) {
    case 'vitreousHemorrhage': {
      // Vitreous Hemorrhage - blood in the vitreous humor
      // Individual randomized blob/splatter shapes with enhanced red coloring

      const floaters: string[] = [];
      const floaterCount = Math.max(8, Math.floor(8 + intensity * 14)); // 8-22 floaters

      for (let i = 0; i < floaterCount; i++) {
        const rand = (i * 0.618) % 1; // Deterministic pseudo-random
        const x = ((i * 31) % 90) + 5;
        const y = ((i * 47) % 85) + 7;
        const baseOpacity = (0.5 + (i % 5) * 0.1) * intensity;
        const baseColor = `rgba(180,20,20,${baseOpacity})`;
        const darkRed = `rgba(140,10,10,${baseOpacity * 0.9})`;

        if (rand < 0.25) {
          // Small dots
          const size = 1 + (i % 3) * 0.8;
          floaters.push(`radial-gradient(circle at ${x}% ${y}%, ${baseColor} 0%, transparent ${size}%)`);
        } else if (rand < 0.5) {
          // Cobweb strands
          const size = 2 + (i % 4) * 1.2;
          const angle = (i * 67) % 360;
          floaters.push(`radial-gradient(circle at ${x}% ${y}%, ${baseColor} 0%, transparent ${size * 0.6}%)`);
          floaters.push(`linear-gradient(${angle}deg, ${baseColor} 0%, transparent ${size * 0.4}%)`);
        } else if (rand < 0.75) {
          // Dark streaks
          const size = 1.5 + (i % 3) * 1.5;
          const angle = (i * 89) % 360;
          floaters.push(`linear-gradient(${angle}deg, ${darkRed} 0%, ${baseColor} ${size * 0.3}%, transparent ${size}%)`);
        } else {
          // Irregular blobs/splatters
          const sizeW = 2 + (i % 5) * 1.5;
          const sizeH = 1.5 + (i % 4) * 1.2;
          floaters.push(`radial-gradient(ellipse ${sizeW}% ${sizeH}% at ${x}% ${y}%, ${baseColor} 0%, ${darkRed} ${sizeW * 0.4}%, transparent ${sizeW}%)`);
        }
      }

      // Enhanced red haze
      const hazeGradient = `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(160,20,20,${0.2 * intensity}) 0%, transparent 70%),
        radial-gradient(ellipse 80% 80% at 30% 40%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%),
        radial-gradient(ellipse 80% 80% at 70% 60%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%)
      `;

      // Bottom accumulation (blood settles at bottom)
      const bottomAccumulation = `
        linear-gradient(to bottom, transparent 75%, rgba(150,15,15,${0.3 * intensity}) 90%, rgba(130,10,10,${0.4 * intensity}) 100%)
      `;

      // Red tint overlay
      const redTint = `rgba(180,25,25,${0.18 * intensity})`;

      const background = [
        ...floaters,
        hazeGradient,
        bottomAccumulation,
        redTint
      ].join(', ');

      return {
        background,
        mixBlendMode: 'multiply' as const,
        opacity: Math.min(0.85, 0.55 + intensity * 0.3)
      };
    }
    
    case 'keratoconus': {
      // Keratoconus causes:
      // 1. Multiple ghost images (polyopia) - cone shape creates multiple focal points
      // 2. Streaking/comet tails from light sources
      // 3. Halos around bright areas
      // 4. High-order aberrations causing irregular distortion

      const ghostCount = Math.max(3, Math.floor(3 + intensity * 5)); // 3-8 ghost images
      const streakOpacity = 0.15 + intensity * 0.25;
      const haloOpacity = 0.2 + intensity * 0.3;

      // Create ghost image effect using multiple offset radial gradients
      // These simulate the multiple focal points of the cone-shaped cornea
      const ghostLayers: string[] = [];
      for (let i = 0; i < ghostCount; i++) {
        const angle = (i / ghostCount) * Math.PI * 2;
        const distance = 3 + intensity * 8; // 3-11% offset
        const offsetX = 50 + Math.cos(angle) * distance;
        const offsetY = 50 + Math.sin(angle) * distance;
        const ghostOpacity = (0.08 + intensity * 0.12) * (1 - i * 0.1);

        // Each ghost creates a slight bright halo effect
        ghostLayers.push(
          `radial-gradient(ellipse 80% 80% at ${offsetX}% ${offsetY}%, rgba(255,255,255,${ghostOpacity}) 0%, rgba(255,255,255,${ghostOpacity * 0.5}) 30%, transparent 70%)`
        );
      }

      // Streaking effect - elongated gradients simulating comet tails
      // Primary downward streak (gravity causes cone to point down typically)
      const streaks = [
        `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${streakOpacity}) 20%, rgba(255,255,255,${streakOpacity * 0.6}) 50%, transparent 100%)`,
        `linear-gradient(160deg, transparent 0%, rgba(255,255,255,${streakOpacity * 0.7}) 30%, transparent 70%)`,
        `linear-gradient(200deg, transparent 0%, rgba(255,255,255,${streakOpacity * 0.7}) 30%, transparent 70%)`,
        // Diagonal streaks for irregular astigmatism
        `linear-gradient(135deg, transparent 20%, rgba(255,255,255,${streakOpacity * 0.5}) 40%, rgba(255,255,255,${streakOpacity * 0.3}) 60%, transparent 80%)`,
        `linear-gradient(225deg, transparent 20%, rgba(255,255,255,${streakOpacity * 0.4}) 40%, transparent 70%)`
      ];

      // Halos around simulated light sources
      const halos = [
        // Central halo (main distortion area)
        `radial-gradient(ellipse 60% 70% at 50% 45%, rgba(255,255,255,${haloOpacity}) 0%, rgba(255,255,255,${haloOpacity * 0.5}) 40%, transparent 70%)`,
        // Additional halos at typical bright spots
        `radial-gradient(circle at 30% 25%, rgba(255,255,255,${haloOpacity * 0.6}) 0%, transparent 20%)`,
        `radial-gradient(circle at 70% 35%, rgba(255,255,255,${haloOpacity * 0.5}) 0%, transparent 18%)`,
        `radial-gradient(circle at 50% 75%, rgba(255,255,255,${haloOpacity * 0.4}) 0%, transparent 15%)`
      ];

      // Combine all effects - use screen blend mode for additive light effect
      const background = [
        ...ghostLayers,
        ...streaks,
        ...halos
      ].join(', ');

      return {
        background,
        mixBlendMode: 'screen' as const,
        opacity: Math.min(1, 0.5 + intensity * 0.5)
      };
    }
    
    // CSS filter-based conditions are now handled directly in EffectPreview.tsx
    // These conditions don't need overlay elements, just CSS filters on the base image
    case 'dryEye':
    case 'posteriorSubcapsularCataract':
    case 'presbyopia':
    case 'glare':
    case 'blurryVision':
    case 'nightBlindness':
    case 'halos':
    case 'lossOfContrast':
    case 'starbursting':
    case 'persistentPositiveVisualPhenomenon':
    case 'palinopsia':
    case 'trails':
      return null; // Handled by CSS filters in EffectPreview.tsx
    // Note: blueFieldPhenomena is now handled by visualDisturbancePreview.ts
    
    default:
      return null;
  }
};

