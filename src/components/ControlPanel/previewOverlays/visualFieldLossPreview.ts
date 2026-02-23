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
      // Match the main visualizer's sizing formula
      const scotomaSize = Math.max(15, 10 + intensity * 20);
      const blackIntensity = intensity;

      // Generate peripheral puckering/pinching distortion from outer edges moving inward
      const puckeringWaves: string[] = [];
      if (intensity > 0.2) {
        // TOP EDGE - puckering waves coming down from top
        const topWaveCount = Math.floor(7 + intensity * 5);
        for (let i = 0; i < topWaveCount; i++) {
          const xPos = (i / (topWaveCount - 1)) * 100;
          const waveDepth = 8 + intensity * 10 + Math.sin(i * 0.8) * 4;
          const isLight = i % 2 === 0;
          const opacity = (0.24 + intensity * 0.18) * (isLight ? 1 : 0.8);
          const width = 8 + (i % 3) * 2;

          if (isLight) {
            puckeringWaves.push(`radial-gradient(ellipse ${width}% ${waveDepth}% at ${xPos}% 0%,
              rgba(152,152,158,${opacity}) 0%,
              rgba(132,132,138,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          } else {
            puckeringWaves.push(`radial-gradient(ellipse ${width}% ${waveDepth}% at ${xPos}% 0%,
              rgba(42,42,52,${opacity}) 0%,
              rgba(62,62,72,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          }
        }

        // BOTTOM EDGE - puckering waves coming up from bottom
        const bottomWaveCount = Math.floor(7 + intensity * 5);
        for (let i = 0; i < bottomWaveCount; i++) {
          const xPos = (i / (bottomWaveCount - 1)) * 100;
          const waveDepth = 8 + intensity * 10 + Math.sin(i * 0.9 + 0.5) * 4;
          const isLight = i % 2 === 0;
          const opacity = (0.24 + intensity * 0.18) * (isLight ? 1 : 0.8);
          const width = 8 + (i % 3) * 2;

          if (isLight) {
            puckeringWaves.push(`radial-gradient(ellipse ${width}% ${waveDepth}% at ${xPos}% 100%,
              rgba(152,152,158,${opacity}) 0%,
              rgba(132,132,138,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          } else {
            puckeringWaves.push(`radial-gradient(ellipse ${width}% ${waveDepth}% at ${xPos}% 100%,
              rgba(42,42,52,${opacity}) 0%,
              rgba(62,62,72,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          }
        }

        // LEFT EDGE - puckering waves coming from left
        const leftWaveCount = Math.floor(5 + intensity * 4);
        for (let i = 0; i < leftWaveCount; i++) {
          const yPos = (i / (leftWaveCount - 1)) * 100;
          const waveDepth = 6 + intensity * 8 + Math.sin(i * 0.7) * 3;
          const isLight = i % 2 === 0;
          const opacity = (0.22 + intensity * 0.16) * (isLight ? 1 : 0.8);
          const height = 10 + (i % 3) * 3;

          if (isLight) {
            puckeringWaves.push(`radial-gradient(ellipse ${waveDepth}% ${height}% at 0% ${yPos}%,
              rgba(148,148,154,${opacity}) 0%,
              rgba(128,128,134,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          } else {
            puckeringWaves.push(`radial-gradient(ellipse ${waveDepth}% ${height}% at 0% ${yPos}%,
              rgba(44,44,54,${opacity}) 0%,
              rgba(64,64,74,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          }
        }

        // RIGHT EDGE - puckering waves coming from right
        const rightWaveCount = Math.floor(5 + intensity * 4);
        for (let i = 0; i < rightWaveCount; i++) {
          const yPos = (i / (rightWaveCount - 1)) * 100;
          const waveDepth = 6 + intensity * 8 + Math.sin(i * 0.7 + 0.3) * 3;
          const isLight = i % 2 === 0;
          const opacity = (0.22 + intensity * 0.16) * (isLight ? 1 : 0.8);
          const height = 10 + (i % 3) * 3;

          if (isLight) {
            puckeringWaves.push(`radial-gradient(ellipse ${waveDepth}% ${height}% at 100% ${yPos}%,
              rgba(148,148,154,${opacity}) 0%,
              rgba(128,128,134,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          } else {
            puckeringWaves.push(`radial-gradient(ellipse ${waveDepth}% ${height}% at 100% ${yPos}%,
              rgba(44,44,54,${opacity}) 0%,
              rgba(64,64,74,${opacity * 0.5}) 60%,
              transparent 100%
            )`);
          }
        }

        // CORNER pinching effects
        const cornerOpacity = 0.28 + intensity * 0.22;
        const cornerSize = 14 + intensity * 10;
        puckeringWaves.push(`radial-gradient(ellipse ${cornerSize}% ${cornerSize}% at 0% 0%,
          rgba(145,145,150,${cornerOpacity}) 0%,
          rgba(50,50,60,${cornerOpacity * 0.6}) 40%,
          rgba(130,130,135,${cornerOpacity * 0.4}) 70%,
          transparent 100%
        )`);
        puckeringWaves.push(`radial-gradient(ellipse ${cornerSize}% ${cornerSize}% at 100% 0%,
          rgba(145,145,150,${cornerOpacity}) 0%,
          rgba(50,50,60,${cornerOpacity * 0.6}) 40%,
          rgba(130,130,135,${cornerOpacity * 0.4}) 70%,
          transparent 100%
        )`);
        puckeringWaves.push(`radial-gradient(ellipse ${cornerSize}% ${cornerSize}% at 0% 100%,
          rgba(145,145,150,${cornerOpacity}) 0%,
          rgba(50,50,60,${cornerOpacity * 0.6}) 40%,
          rgba(130,130,135,${cornerOpacity * 0.4}) 70%,
          transparent 100%
        )`);
        puckeringWaves.push(`radial-gradient(ellipse ${cornerSize}% ${cornerSize}% at 100% 100%,
          rgba(145,145,150,${cornerOpacity}) 0%,
          rgba(50,50,60,${cornerOpacity * 0.6}) 40%,
          rgba(130,130,135,${cornerOpacity * 0.4}) 70%,
          transparent 100%
        )`);
      }

      const mainScotoma = `radial-gradient(circle at 50% 50%,
        rgba(0,0,0,${blackIntensity}) 0%,
        rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%,
        rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%,
        rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%,
        transparent ${scotomaSize + 10}%
      )`;

      const allGradients = [mainScotoma, ...puckeringWaves].join(', ');

      return {
        background: allGradients,
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

