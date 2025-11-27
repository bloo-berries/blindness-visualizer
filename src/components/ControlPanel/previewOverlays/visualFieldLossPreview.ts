/**
 * Generates preview overlay styles for visual field loss conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';

export const generateVisualFieldLossPreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  switch (effectType) {
    case 'blindnessLeftEye': {
      const leftEyeIntensity = intensity === 1 ? 1 : 0.95 * intensity;
      return {
        background: `
          linear-gradient(to right, 
            rgba(0,0,0,${leftEyeIntensity}) 0%, 
            rgba(0,0,0,${leftEyeIntensity}) 47.5%, 
            rgba(0,0,0,${leftEyeIntensity * 0.7}) 48.75%,
            rgba(0,0,0,${leftEyeIntensity * 0.4}) 50%,
            rgba(0,0,0,${leftEyeIntensity * 0.1}) 51.25%,
            rgba(0,0,0,0) 52.5%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
    }
      
    case 'blindnessRightEye': {
      const rightEyeIntensity = intensity === 1 ? 1 : 0.95 * intensity;
      return {
        background: `
          linear-gradient(to left, 
            rgba(0,0,0,${rightEyeIntensity}) 0%, 
            rgba(0,0,0,${rightEyeIntensity}) 47.5%, 
            rgba(0,0,0,${rightEyeIntensity * 0.7}) 48.75%,
            rgba(0,0,0,${rightEyeIntensity * 0.4}) 50%,
            rgba(0,0,0,${rightEyeIntensity * 0.1}) 51.25%,
            rgba(0,0,0,0) 52.5%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
    }
      
    case 'bitemporalHemianopia': {
      const bitemporalIntensity = intensity === 1 ? 1 : 0.95 * intensity;
      return {
        background: `
          linear-gradient(to right, 
            rgba(0,0,0,${bitemporalIntensity}) 0%, 
            rgba(0,0,0,${bitemporalIntensity}) 22.5%, 
            rgba(0,0,0,${bitemporalIntensity * 0.7}) 23.75%,
            rgba(0,0,0,${bitemporalIntensity * 0.4}) 25%,
            rgba(0,0,0,${bitemporalIntensity * 0.1}) 26.25%,
            rgba(0,0,0,0) 27.5%,
            rgba(0,0,0,0) 72.5%,
            rgba(0,0,0,${bitemporalIntensity * 0.1}) 73.75%,
            rgba(0,0,0,${bitemporalIntensity * 0.4}) 75%,
            rgba(0,0,0,${bitemporalIntensity * 0.7}) 76.25%,
            rgba(0,0,0,${bitemporalIntensity}) 77.5%, 
            rgba(0,0,0,${bitemporalIntensity}) 100%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
    }
      
    case 'quadrantanopiaRight':
      return {
        background: `
          radial-gradient(circle at 0% 100%, 
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) ${Math.max(25, 40 - intensity * 20)}%,
            rgba(0,0,0,1) ${Math.max(45, 60 - intensity * 20)}%,
            rgba(0,0,0,1) 100%
          )
        `,
        mixBlendMode: 'normal',
        opacity: '1'
      };
      
    case 'quadrantanopiaInferior': {
      const inferiorIntensity = intensity === 1 ? 1 : 0.95 * intensity;
      return {
        background: `
          radial-gradient(ellipse 100% 100% at 100% 100%, 
            rgba(0,0,0,${inferiorIntensity}) 0%,
            rgba(0,0,0,${inferiorIntensity}) 65%,
            rgba(0,0,0,${inferiorIntensity * 0.8}) 70%,
            rgba(0,0,0,${inferiorIntensity * 0.5}) 75%,
            rgba(0,0,0,${inferiorIntensity * 0.2}) 80%,
            rgba(0,0,0,0) 85%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
    }
      
    case 'quadrantanopiaSuperior': {
      const superiorIntensity = intensity === 1 ? 1 : 0.95 * intensity;
      return {
        background: `
          radial-gradient(ellipse 100% 100% at 100% 0%, 
            rgba(0,0,0,${superiorIntensity}) 0%,
            rgba(0,0,0,${superiorIntensity}) 65%,
            rgba(0,0,0,${superiorIntensity * 0.8}) 70%,
            rgba(0,0,0,${superiorIntensity * 0.5}) 75%,
            rgba(0,0,0,${superiorIntensity * 0.2}) 80%,
            rgba(0,0,0,0) 85%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
    }
      
    case 'scotoma': {
      const offsetX = 50 + Math.sin(now/2000) * 10;
      const offsetY = 50 + Math.cos(now/2000) * 10;
      return {
        background: `
          radial-gradient(circle at ${offsetX}% ${offsetY}%, 
            rgba(0,0,0,${0.95 * intensity}) 0%, 
            rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
            rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
            rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
          )
        `,
        mixBlendMode: 'multiply',
        opacity: Math.min(0.95, intensity)
      };
    }
      
    case 'tunnelVision': {
      const tunnelRadius = Math.max(10, 80 - intensity * 70);
      return {
        background: `
          radial-gradient(circle at center, 
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) ${tunnelRadius - 5}%,
            rgba(0,0,0,${0.1 * intensity}) ${tunnelRadius}%,
            rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius + 5}%,
            rgba(0,0,0,${0.6 * intensity}) ${tunnelRadius + 10}%,
            rgba(0,0,0,${0.8 * intensity}) ${tunnelRadius + 15}%,
            rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 20}%,
            rgba(0,0,0,${0.95 * intensity}) 100%
          )
        `,
        mixBlendMode: 'multiply',
        opacity: Math.min(0.95, intensity)
      };
    }
      
    case 'hemianopiaLeft':
      return {
        background: `
          linear-gradient(to right, 
            rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 0%, 
            rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 45%, 
            rgba(0,0,0,0) 50%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
      
    case 'hemianopiaRight':
      return {
        background: `
          linear-gradient(to left, 
            rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 0%, 
            rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 45%, 
            rgba(0,0,0,0) 50%
          )
        `,
        mixBlendMode: intensity === 1 ? 'normal' : 'multiply',
        opacity: intensity === 1 ? '1' : Math.min(0.95, intensity)
      };
      
    default:
      return null;
  }
};

