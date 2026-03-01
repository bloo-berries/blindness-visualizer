/**
 * Generates preview overlay styles for famous people-specific conditions
 */
import React from 'react';
import { ConditionType } from '../../../types/visualEffects';

export const generateFamousPeoplePreviewStyle = (
  effectType: ConditionType,
  intensity: number,
  now: number
): Partial<React.CSSProperties> | null => {
  // Famous people cases are handled by the main overlay system
  return null;
};

