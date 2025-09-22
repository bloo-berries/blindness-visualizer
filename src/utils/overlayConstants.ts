/**
 * Shared constants and utilities for overlay management
 * Centralized to avoid duplication across overlay-related files
 */

/**
 * Visual Field Loss conditions that should always overlay on top
 */
export const VISUAL_FIELD_LOSS_CONDITIONS = [
  'blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight', 
  'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior', 
  'quadrantanopiaSuperior', 'scotoma', 'tunnelVision'
];

/**
 * Visual Disturbance conditions that should appear underneath other conditions
 */
export const VISUAL_DISTURBANCE_CONDITIONS = [
  'visualAura', 'visualFloaters', 'visualSnow', 'hallucinations',
  'visualAuraLeft', 'visualAuraRight'
];

/**
 * Determines if a condition is a Visual Field Loss condition
 */
export const isVisualFieldLossCondition = (conditionId: string): boolean => {
  return VISUAL_FIELD_LOSS_CONDITIONS.includes(conditionId);
};

/**
 * Determines if a condition is a Visual Disturbance condition
 */
export const isVisualDisturbanceCondition = (conditionId: string): boolean => {
  return VISUAL_DISTURBANCE_CONDITIONS.includes(conditionId);
};

/**
 * Gets the appropriate z-index for an overlay based on condition type
 * @param conditionId - The condition ID to check
 * @param baseZIndex - Base z-index value (default: 1000)
 * @returns String representation of the z-index
 */
export const getOverlayZIndex = (conditionId: string, baseZIndex: number = 1000): string => {
  // Visual Field Loss conditions get higher z-index to appear on top
  if (isVisualFieldLossCondition(conditionId)) {
    return (baseZIndex + 100).toString();
  }
  // Visual Disturbance conditions get lower z-index to appear underneath
  if (isVisualDisturbanceCondition(conditionId)) {
    return (baseZIndex - 100).toString();
  }
  return baseZIndex.toString();
};

/**
 * Common overlay styles for consistent appearance
 */
export const OVERLAY_BASE_STYLES = {
  position: 'absolute' as const,
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none' as const,
};

/**
 * Z-index constants for different overlay types
 */
export const Z_INDEX = {
  BASE: 1000,
  VISUAL_FIELD_LOSS: 1100,
  VISUAL_DISTURBANCE: 900,
  DIPLOPIA: 1001,
  ANIMATED: 10,
  ANIMATED_VISUAL_FIELD_LOSS: 110,
} as const;
