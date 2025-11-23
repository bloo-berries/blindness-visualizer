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
  // TODO: Move visual disturbance cases from EffectPreview.tsx switch statement here
  // Cases include: visualSnow, visualSnowFlashing, visualSnowColored, visualSnowTransparent, 
  // visualSnowDense, visualAura, visualAuraLeft, visualAuraRight, visualFloaters, hallucinations
  return null;
};

