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
    
    case 'visualAura': {
      const scotomaSize = 25;
      const scotomaCenterX = 50;
      const scotomaCenterY = 50;
      const cShapeScotoma = `
        radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
          rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
          rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
          rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
          rgba(0,0,0,0) ${scotomaSize + 8}%
        )
      `;
      const scintillatingEdges = `
        conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(255,0,0,${0.6 * intensity}) 0deg,
          rgba(255,165,0,${0.7 * intensity}) 30deg,
          rgba(255,255,0,${0.5 * intensity}) 60deg,
          rgba(0,255,0,${0.6 * intensity}) 90deg,
          rgba(0,255,255,${0.4 * intensity}) 120deg,
          rgba(0,0,255,${0.5 * intensity}) 150deg,
          rgba(128,0,128,${0.6 * intensity}) 180deg,
          rgba(255,0,255,${0.4 * intensity}) 210deg,
          rgba(255,255,255,${0.7 * intensity}) 240deg,
          rgba(255,192,203,${0.3 * intensity}) 270deg,
          rgba(255,255,0,${0.5 * intensity}) 300deg,
          rgba(255,165,0,${0.6 * intensity}) 330deg,
          rgba(255,0,0,${0.6 * intensity}) 360deg
        )
      `;
      return {
        background: `${cShapeScotoma}, ${scintillatingEdges}`,
        mixBlendMode: 'overlay' as const,
        opacity: Math.min(0.9, intensity)
      };
    }
    
    case 'visualAuraLeft': {
      const scotomaSize = 20;
      const scotomaCenterX = 25;
      const scotomaCenterY = 50;
      const cShapeScotoma = `
        radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
          rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
          rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
          rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
          rgba(0,0,0,0) ${scotomaSize + 8}%
        )
      `;
      const scintillatingEdges = `
        conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(255,0,0,${0.6 * intensity}) 0deg,
          rgba(255,165,0,${0.7 * intensity}) 30deg,
          rgba(255,255,0,${0.5 * intensity}) 60deg,
          rgba(0,255,0,${0.6 * intensity}) 90deg,
          rgba(0,255,255,${0.4 * intensity}) 120deg,
          rgba(0,0,255,${0.5 * intensity}) 150deg,
          rgba(128,0,128,${0.6 * intensity}) 180deg,
          rgba(255,0,255,${0.4 * intensity}) 210deg,
          rgba(255,255,255,${0.7 * intensity}) 240deg,
          rgba(255,192,203,${0.3 * intensity}) 270deg,
          rgba(255,255,0,${0.5 * intensity}) 300deg,
          rgba(255,165,0,${0.6 * intensity}) 330deg,
          rgba(255,0,0,${0.6 * intensity}) 360deg
        )
      `;
      return {
        background: `${cShapeScotoma}, ${scintillatingEdges}`,
        mixBlendMode: 'overlay' as const,
        opacity: Math.min(0.9, intensity)
      };
    }
    
    case 'visualAuraRight': {
      const scotomaSize = 20;
      const scotomaCenterX = 75;
      const scotomaCenterY = 50;
      const cShapeScotoma = `
        radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
          rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
          rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
          rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
          rgba(0,0,0,0) ${scotomaSize + 8}%
        )
      `;
      const scintillatingEdges = `
        conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
          rgba(255,0,0,${0.6 * intensity}) 0deg,
          rgba(255,165,0,${0.7 * intensity}) 30deg,
          rgba(255,255,0,${0.5 * intensity}) 60deg,
          rgba(0,255,0,${0.6 * intensity}) 90deg,
          rgba(0,255,255,${0.4 * intensity}) 120deg,
          rgba(0,0,255,${0.5 * intensity}) 150deg,
          rgba(128,0,128,${0.6 * intensity}) 180deg,
          rgba(255,0,255,${0.4 * intensity}) 210deg,
          rgba(255,255,255,${0.7 * intensity}) 240deg,
          rgba(255,192,203,${0.3 * intensity}) 270deg,
          rgba(255,255,0,${0.5 * intensity}) 300deg,
          rgba(255,165,0,${0.6 * intensity}) 330deg,
          rgba(255,0,0,${0.6 * intensity}) 360deg
        )
      `;
      return {
        background: `${cShapeScotoma}, ${scintillatingEdges}`,
        mixBlendMode: 'overlay' as const,
        opacity: Math.min(0.9, intensity)
      };
    }
    
    default:
      return null;
  }
};

