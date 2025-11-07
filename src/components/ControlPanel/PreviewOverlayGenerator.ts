/**
 * Generates overlay styles for the ControlPanel preview image
 * This is separate from overlayManager.ts which handles DOM overlays for the main visualizer
 */

import React from 'react';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { isVisualDisturbanceCondition, isVisualFieldLossCondition, Z_INDEX } from '../../utils/overlayConstants';

/**
 * Generates overlay style for a single effect in the preview
 */
export const generatePreviewOverlayStyle = (
  effect: VisualEffect,
  enabledEffects: VisualEffect[]
): React.CSSProperties | null => {
  const effectType = effect.id as ConditionType;
  const intensity = effect.intensity;
  
  // Base overlay style
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    clipPath: 'inset(0)',
    transform: 'translateZ(0)'
  };

  // Set z-index based on condition type
  if (isVisualDisturbanceCondition(effectType)) {
    overlayStyle.zIndex = Z_INDEX.VISUAL_DISTURBANCE;
  } else if (isVisualFieldLossCondition(effectType)) {
    overlayStyle.zIndex = Z_INDEX.VISUAL_FIELD_LOSS;
  } else {
    overlayStyle.zIndex = Z_INDEX.BASE + enabledEffects.indexOf(effect);
  }
  
  // Get current time for animated effects (throttled for performance)
  const now = Math.floor(Date.now() / 100) * 100;
  
  // Apply specific overlay styles based on condition type
  // This is a simplified version - the full implementation would include all cases
  // For now, we'll handle the most common cases and use a default for others
  switch (effectType) {
    case 'blindnessLeftEye':
      overlayStyle.background = `
        linear-gradient(to right, 
          rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 0%, 
          rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 50%, 
          rgba(0,0,0,0) 50%
        )
      `;
      overlayStyle.mixBlendMode = intensity === 1 ? 'normal' : 'multiply';
      overlayStyle.opacity = intensity === 1 ? '1' : Math.min(0.95, intensity);
      break;
      
    case 'blindnessRightEye':
      overlayStyle.background = `
        linear-gradient(to left, 
          rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 0%, 
          rgba(0,0,0,${intensity === 1 ? 1 : 0.95 * intensity}) 50%, 
          rgba(0,0,0,0) 50%
        )
      `;
      overlayStyle.mixBlendMode = intensity === 1 ? 'normal' : 'multiply';
      overlayStyle.opacity = intensity === 1 ? '1' : Math.min(0.95, intensity);
      break;
      
    case 'tunnelVision':
      const tunnelRadius = Math.max(10, 80 - intensity * 70);
      overlayStyle.background = `
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
      `;
      overlayStyle.mixBlendMode = 'multiply';
      overlayStyle.opacity = Math.min(0.95, intensity);
      break;
      
    case 'scotoma':
      const offsetX = 50 + Math.sin(now/2000) * 10;
      const offsetY = 50 + Math.cos(now/2000) * 10;
      overlayStyle.background = `
        radial-gradient(circle at ${offsetX}% ${offsetY}%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
          rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
        )
      `;
      overlayStyle.mixBlendMode = 'multiply';
      overlayStyle.opacity = Math.min(0.95, intensity);
      break;
      
    default:
      // For other conditions, use a simple darkening overlay
      overlayStyle.background = `rgba(0,0,0,${intensity * 0.3})`;
      overlayStyle.mixBlendMode = 'multiply';
      overlayStyle.opacity = intensity;
  }
  
  return overlayStyle;
};

