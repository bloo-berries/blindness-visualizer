/**
 * Generates overlay styles for preview images in the ControlPanel
 * This is separate from overlayManager.ts which handles DOM overlays for the main visualizer
 */

import React from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import { ConditionType } from '../../../types/visualEffects';
import { isVisualDisturbanceCondition, isVisualFieldLossCondition, Z_INDEX } from '../../../utils/overlayConstants';
import { generateVisualFieldLossPreviewStyle } from './visualFieldLossPreview';
import { generateVisualDisturbancePreviewStyle } from './visualDisturbancePreview';
import { generateRetinalDiseasePreviewStyle } from './retinalDiseasePreview';
import { generateFamousPeoplePreviewStyle } from './famousPeoplePreview';
import { generateSymptomPreviewStyle } from './symptomPreview';

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
  
  // Delegate to category-specific generators
  const visualFieldLossStyle = generateVisualFieldLossPreviewStyle(effectType, intensity, now);
  if (visualFieldLossStyle) {
    Object.assign(overlayStyle, visualFieldLossStyle);
    return overlayStyle;
  }
  
  const visualDisturbanceStyle = generateVisualDisturbancePreviewStyle(effectType, intensity, now);
  if (visualDisturbanceStyle) {
    Object.assign(overlayStyle, visualDisturbanceStyle);
    return overlayStyle;
  }
  
  const retinalDiseaseStyle = generateRetinalDiseasePreviewStyle(effectType, intensity, now);
  if (retinalDiseaseStyle) {
    Object.assign(overlayStyle, retinalDiseaseStyle);
    return overlayStyle;
  }
  
  const famousPeopleStyle = generateFamousPeoplePreviewStyle(effectType, intensity, now);
  if (famousPeopleStyle) {
    Object.assign(overlayStyle, famousPeopleStyle);
    return overlayStyle;
  }
  
  const symptomStyle = generateSymptomPreviewStyle(effectType, intensity, now);
  if (symptomStyle) {
    Object.assign(overlayStyle, symptomStyle);
    return overlayStyle;
  }
  
  // Default fallback
  overlayStyle.background = `rgba(0,0,0,${intensity * 0.3})`;
  overlayStyle.mixBlendMode = 'multiply';
  overlayStyle.opacity = intensity;
  
  return overlayStyle;
};

