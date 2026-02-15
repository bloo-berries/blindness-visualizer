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
      // Vitreous Hemorrhage preview with different floater types, haze, and red tint
      // Simplified version for preview (full animation in main overlay)
      
      // Generate representative floaters for preview
      const floaterCount = Math.max(6, Math.floor(6 + intensity * 12)); // 6-18 floaters for preview
      const floaters: string[] = [];
      
      for (let i = 0; i < floaterCount; i++) {
        const rand = Math.random();
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const baseOpacity = 0.3 + Math.random() * 0.4;
        const opacity = baseOpacity * intensity;
        const baseColor = `rgba(180,0,0,${opacity})`; // More saturated red
        const darkRed = `rgba(120,0,0,${opacity * 0.8})`; // More saturated dark red
        
        if (rand < 0.3) {
          // Small dots
          const size = 0.5 + Math.random() * 1.5;
          floaters.push(`radial-gradient(circle at ${x}% ${y}%, ${baseColor} 0%, transparent ${size}%)`);
        } else if (rand < 0.6) {
          // Cobweb strands
          const size = 2 + Math.random() * 3;
          const angle = Math.random() * 360;
          floaters.push(`
            linear-gradient(${angle}deg, ${baseColor} 0%, transparent ${size * 0.3}%),
            linear-gradient(${angle + 60}deg, ${baseColor} 0%, transparent ${size * 0.3}%),
            linear-gradient(${angle + 120}deg, ${baseColor} 0%, transparent ${size * 0.3}%),
            radial-gradient(circle at ${x}% ${y}%, ${baseColor} 0%, transparent ${size * 0.5}%)
          `);
        } else if (rand < 0.85) {
          // Dark streaks
          const size = 1.5 + Math.random() * 2.5;
          const angle = Math.random() * 360;
          floaters.push(`linear-gradient(${angle}deg, ${darkRed} 0%, ${baseColor} ${size * 0.2}%, transparent ${size}%)`);
        } else {
          // Large blobs
          const size = 3 + Math.random() * 4;
          floaters.push(`radial-gradient(ellipse ${size * 1.2}% ${size}% at ${x}% ${y}%, ${baseColor} 0%, ${darkRed} ${size * 0.3}%, transparent ${size}%)`);
        }
      }
      
      // Haze/fog effect - increased reddish hue
      const hazeGradient = `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,0,0,${0.12 * intensity}) 0%, transparent 70%),
        radial-gradient(ellipse 80% 80% at 30% 40%, rgba(180,0,0,${0.1 * intensity}) 0%, transparent 60%),
        radial-gradient(ellipse 80% 80% at 70% 60%, rgba(180,0,0,${0.1 * intensity}) 0%, transparent 60%)
      `;
      
      // Red/pink tint overlay - increased reddish hue
      const redTint = `rgba(220,20,20,${0.25 * intensity})`;
      
      // Bottom accumulation (gravitational settling preview) - increased reddish hue
      const bottomAccumulation = `
        linear-gradient(to bottom, transparent 70%, rgba(180,0,0,${0.3 * intensity}) 85%, rgba(180,0,0,${0.5 * intensity}) 100%)
      `;
      
      let vitreousBackground = `
        ${floaters.join(', ')},
        ${hazeGradient},
        ${bottomAccumulation},
        ${redTint}
      `;
      
      vitreousBackground = vitreousBackground.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');
      
      return {
        background: vitreousBackground,
        mixBlendMode: 'multiply' as const,
        opacity: Math.min(0.81, intensity), // Reduced opacity by 10%
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
    case 'persistentPositiveVisualPhenomenon':
    case 'palinopsia':
    case 'trails':
      return null; // Handled by CSS filters in EffectPreview.tsx
    // Note: blueFieldPhenomena is now handled by visualDisturbancePreview.ts
    
    default:
      return null;
  }
};

