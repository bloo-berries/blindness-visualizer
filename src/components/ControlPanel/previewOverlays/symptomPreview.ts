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
      // Use highly saturated red colors to show the red tint effect clearly
      // Blood should appear red, not grey, and non-blood areas should remain clear
      let vitreousBackground = `
        /* Blood streaks at various angles - using highly saturated reds */
        linear-gradient(45deg, rgba(220,20,20,${0.6 * intensity}) 0%, transparent 30%),
        linear-gradient(-45deg, rgba(200,15,15,${0.55 * intensity}) 0%, transparent 25%),
        linear-gradient(90deg, rgba(210,18,18,${0.58 * intensity}) 0%, transparent 35%),
        linear-gradient(135deg, rgba(190,12,12,${0.5 * intensity}) 0%, transparent 22%),
        linear-gradient(15deg, rgba(180,10,10,${0.45 * intensity}) 0%, transparent 18%),
        linear-gradient(75deg, rgba(170,8,8,${0.4 * intensity}) 0%, transparent 15%),
        linear-gradient(105deg, rgba(195,14,14,${0.52 * intensity}) 0%, transparent 25%),
        linear-gradient(165deg, rgba(185,11,11,${0.48 * intensity}) 0%, transparent 20%),
        linear-gradient(30deg, rgba(175,9,9,${0.38 * intensity}) 0%, transparent 16%),
        linear-gradient(60deg, rgba(178,10,10,${0.4 * intensity}) 0%, transparent 14%),
        linear-gradient(120deg, rgba(168,7,7,${0.35 * intensity}) 0%, transparent 12%),
        linear-gradient(150deg, rgba(165,6,6,${0.32 * intensity}) 0%, transparent 10%),
        /* Blood pools and dots - using highly saturated reds */
        radial-gradient(circle at 30% 40%, rgba(220,20,20,${0.55 * intensity}) 0%, transparent 15%),
        radial-gradient(circle at 70% 60%, rgba(200,15,15,${0.5 * intensity}) 0%, transparent 12%),
        radial-gradient(circle at 20% 80%, rgba(190,12,12,${0.45 * intensity}) 0%, transparent 10%),
        radial-gradient(circle at 80% 20%, rgba(180,10,10,${0.4 * intensity}) 0%, transparent 8%),
        radial-gradient(circle at 50% 50%, rgba(170,8,8,${0.35 * intensity}) 0%, transparent 18%),
        radial-gradient(circle at 15% 25%, rgba(215,18,18,${0.5 * intensity}) 0%, transparent 9%),
        radial-gradient(circle at 85% 35%, rgba(205,16,16,${0.46 * intensity}) 0%, transparent 11%),
        radial-gradient(circle at 25% 75%, rgba(198,14,14,${0.44 * intensity}) 0%, transparent 7%),
        radial-gradient(circle at 75% 85%, rgba(192,12,12,${0.42 * intensity}) 0%, transparent 10%),
        radial-gradient(circle at 40% 15%, rgba(188,11,11,${0.4 * intensity}) 0%, transparent 8%),
        radial-gradient(circle at 60% 90%, rgba(185,10,10,${0.38 * intensity}) 0%, transparent 6%),
        radial-gradient(circle at 10% 60%, rgba(178,8,8,${0.35 * intensity}) 0%, transparent 5%),
        radial-gradient(circle at 90% 40%, rgba(182,9,9,${0.33 * intensity}) 0%, transparent 7%),
        radial-gradient(circle at 35% 85%, rgba(175,7,7,${0.31 * intensity}) 0%, transparent 6%),
        radial-gradient(circle at 65% 10%, rgba(172,6,6,${0.29 * intensity}) 0%, transparent 8%),
        /* Irregular blood patches */
        radial-gradient(ellipse at 35% 65%, rgba(170,5,5,${0.26 * intensity}) 0%, transparent 16%),
        radial-gradient(ellipse at 65% 25%, rgba(165,4,4,${0.24 * intensity}) 0%, transparent 13%),
        radial-gradient(ellipse at 10% 50%, rgba(160,3,3,${0.22 * intensity}) 0%, transparent 11%),
        radial-gradient(ellipse at 90% 70%, rgba(155,2,2,${0.20 * intensity}) 0%, transparent 9%),
        radial-gradient(ellipse at 20% 30%, rgba(150,1,1,${0.18 * intensity}) 0%, transparent 8%),
        radial-gradient(ellipse at 80% 80%, rgba(145,0,0,${0.16 * intensity}) 0%, transparent 7%),
        radial-gradient(ellipse at 45% 10%, rgba(140,0,0,${0.14 * intensity}) 0%, transparent 6%),
        radial-gradient(ellipse at 55% 90%, rgba(135,0,0,${0.12 * intensity}) 0%, transparent 5%)
      `;
      vitreousBackground = vitreousBackground.trim().replace(/,\s*$/, '');
      
      return {
        background: vitreousBackground,
        mixBlendMode: 'color' as const, // Use color blend mode to add red hue while preserving image clarity
        opacity: Math.min(0.7, intensity), // Lower opacity to keep non-blood areas clear
        // Remove blur from overlay - blur should only be on base image if needed
      };
    }
    
    case 'keratoconus': {
      const ghostCount = Math.max(2, Math.floor(2 + intensity * 6));
      const ghostOffsets = [];
      for (let i = 0; i < ghostCount; i++) {
        const angle = (i / ghostCount) * Math.PI * 2;
        const distance = 2 + intensity * 5;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        ghostOffsets.push(`translate(${offsetX}px, ${offsetY}px)`);
      }
      const streakIntensity = intensity * 1.2;
      const streakLength = 30 + intensity * 40;
      const haloIntensity = intensity * 1.0;
      const haloSize = 15 + intensity * 25;
      const contrastLoss = intensity * 1.0;
      const waveIntensity = intensity * 0.8;
      
      return {
        background: `
          ${ghostOffsets.map((offset, i) => `
            linear-gradient(${45 + i * 15}deg, 
              rgba(255,255,255,${intensity * 0.3}) 0%, 
              rgba(255,255,255,${intensity * 0.2}) 50%, 
              rgba(255,255,255,${intensity * 0.1}) 80%,
              transparent 100%
            )
          `).join(', ')}
          , linear-gradient(90deg, 
            rgba(255,255,255,${streakIntensity * 0.6}) 0%, 
            rgba(255,255,255,${streakIntensity * 0.4}) ${streakLength * 0.3}%, 
            rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.6}%,
            rgba(255,255,255,${streakIntensity * 0.1}) ${streakLength}%, 
            transparent 100%
          )
          , linear-gradient(45deg, 
            rgba(255,255,255,${streakIntensity * 0.5}) 0%, 
            rgba(255,255,255,${streakIntensity * 0.3}) ${streakLength * 0.4}%, 
            rgba(255,255,255,${streakIntensity * 0.15}) ${streakLength * 0.8}%, 
            transparent 100%
          )
          , linear-gradient(135deg, 
            rgba(255,255,255,${streakIntensity * 0.4}) 0%, 
            rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.5}%, 
            transparent 100%
          )
          , radial-gradient(circle at 20% 20%, 
            rgba(255,255,255,${haloIntensity * 0.8}) 0%, 
            rgba(255,255,255,${haloIntensity * 0.6}) ${haloSize * 0.3}%, 
            rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.6}%,
            rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
            transparent ${haloSize * 2}%
          )
          , radial-gradient(circle at 80% 30%, 
            rgba(255,255,255,${haloIntensity * 0.7}) 0%, 
            rgba(255,255,255,${haloIntensity * 0.5}) ${haloSize * 0.4}%, 
            rgba(255,255,255,${haloIntensity * 0.3}) ${haloSize * 0.8}%,
            rgba(255,255,255,${haloIntensity * 0.15}) ${haloSize * 1.2}%, 
            transparent ${haloSize * 2}%
          )
          , radial-gradient(circle at 50% 80%, 
            rgba(255,255,255,${haloIntensity * 0.6}) 0%, 
            rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.5}%, 
            rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
            transparent ${haloSize * 1.5}%
          )
          , rgba(0,0,0,${contrastLoss * 0.5})
          , rgba(128,128,128,${contrastLoss * 0.3})
        `,
        mixBlendMode: 'multiply' as const,
        opacity: intensity,
        filter: `blur(${waveIntensity * 3}px) contrast(${100 - contrastLoss * 60}%) brightness(${100 + intensity * 30}%) saturate(${100 - intensity * 40}%)`
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
    case 'blueFieldPhenomena':
    case 'persistentPositiveVisualPhenomenon':
    case 'palinopsia':
    case 'trails':
      return null; // Handled by CSS filters in EffectPreview.tsx
    
    default:
      return null;
  }
};

