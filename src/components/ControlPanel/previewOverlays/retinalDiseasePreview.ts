/**
 * Generates preview overlay styles for retinal disease conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';

export const generateRetinalDiseasePreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  switch (effectType) {
    case 'glaucoma': {
      // Based on NIH research: fading periphery (not black), contrast loss, blur
      // Calculate field radius (shrinks with severity)
      const fieldRadius = Math.max(15, 90 - intensity * 75); // 90% to 15%
      const fadeWidth = fieldRadius * 0.2; // 20% fade zone
      const fadeStart = fieldRadius - fadeWidth;
      
      // Use darker gray values that get progressively darker towards edges
      const grayValueCenter = 80; // Lighter gray in fade zone
      const grayValueEdge = 40; // Darker gray at edges
      const grayAlphaStart = intensity * 0.5; // Starting opacity in fade zone
      const grayAlphaEdge = intensity * 0.9; // Higher opacity at edges
      
      // Create smooth peripheral fade - darker and more opaque at edges
      const glaucomaBackground = `radial-gradient(circle at 50% 50%, 
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},0) 0%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},0) ${fadeStart}%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${grayAlphaStart * 0.4}) ${fadeStart + fadeWidth * 0.3}%,
        rgba(${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${grayAlphaStart * 0.7}) ${fadeStart + fadeWidth * 0.6}%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${grayAlphaEdge}) ${fieldRadius}%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${grayAlphaEdge}) 100%
      )`;
      
      return {
        background: glaucomaBackground,
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.85, intensity * 0.95), // Higher opacity overall
        filter: `blur(${intensity * 2}px) contrast(${100 - intensity * 50}%) brightness(${100 - intensity * 10}%)`
      };
    }
    
    case 'amd': {
      const amdRadius = Math.max(15, 52 - intensity * 37);
      return {
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
    
    case 'diabeticRetinopathy': {
      // Microaneurysms - dark hemorrhage spots (larger sizes for visibility)
      const microaneurysms = `
        radial-gradient(circle 8px at 25% 35%,
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.6 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 6px at 65% 55%,
          rgba(0,0,0,${0.8 * intensity}) 0%,
          rgba(0,0,0,${0.5 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 10px at 45% 75%,
          rgba(0,0,0,${0.7 * intensity}) 0%,
          rgba(0,0,0,${0.4 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 7px at 80% 25%,
          rgba(0,0,0,${0.85 * intensity}) 0%,
          rgba(0,0,0,${0.55 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 9px at 30% 60%,
          rgba(0,0,0,${0.75 * intensity}) 0%,
          rgba(0,0,0,${0.45 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 6px at 70% 40%,
          rgba(0,0,0,${0.8 * intensity}) 0%,
          rgba(0,0,0,${0.5 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 8px at 15% 20%,
          rgba(0,0,0,${0.7 * intensity}) 0%,
          rgba(0,0,0,${0.4 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        ),
        radial-gradient(circle 5px at 85% 70%,
          rgba(0,0,0,${0.75 * intensity}) 0%,
          rgba(0,0,0,${0.45 * intensity}) 50%,
          rgba(0,0,0,0) 100%
        )
      `;

      // Cotton wool spots - fluffy white patches (larger sizes for visibility)
      const cottonWoolSpots = `
        radial-gradient(ellipse 30px 20px at 60% 40%,
          rgba(255,255,255,${0.6 * intensity}) 0%,
          rgba(255,255,255,${0.3 * intensity}) 50%,
          rgba(255,255,255,0) 100%
        ),
        radial-gradient(ellipse 25px 18px at 30% 70%,
          rgba(255,255,255,${0.5 * intensity}) 0%,
          rgba(255,255,255,${0.25 * intensity}) 50%,
          rgba(255,255,255,0) 100%
        ),
        radial-gradient(ellipse 22px 15px at 55% 20%,
          rgba(255,255,255,${0.4 * intensity}) 0%,
          rgba(255,255,255,${0.2 * intensity}) 50%,
          rgba(255,255,255,0) 100%
        )
      `;

      // Red tint from blood vessel damage
      const redTint = `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,0,0,${0.15 * intensity}) 0%, transparent 70%),
        linear-gradient(to bottom, transparent 70%, rgba(180,0,0,${0.3 * intensity}) 90%, rgba(150,0,0,${0.5 * intensity}) 100%)
      `;

      return {
        background: `${microaneurysms}, ${cottonWoolSpots}, ${redTint}`,
        mixBlendMode: 'normal' as const,
        opacity: Math.min(0.9, intensity),
        filter: `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) sepia(${intensity * 20}%)`
      };
    }
    
    case 'retinitisPigmentosa': {
      const tunnelRadius = Math.max(3, 30 - intensity * 27);
      return {
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
    
    case 'stargardt': {
      const scotomaRadius = 17 + intensity * 53;
      return {
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
    
    case 'retinalDetachment': {
      return {
        background: `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`,
        mixBlendMode: 'multiply' as const,
        opacity: Math.min(0.8, intensity),
        filter: `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`
      };
    }
    
    default:
      return null;
  }
};

