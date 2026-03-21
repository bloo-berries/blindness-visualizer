/**
 * Shared constants and utilities for overlay management
 * Centralized to avoid duplication across overlay-related files
 */

/**
 * Visual Field Loss conditions — overlaid on top of eye conditions, color vision,
 * refractive errors, retinal disorders, and double vision
 */
const VISUAL_FIELD_LOSS_CONDITIONS = [
  'blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight',
  'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior',
  'quadrantanopiaSuperior', 'scotoma', 'tunnelVision', 'retinitisPigmentosa'
];

/**
 * Visual Disturbance conditions — overlaid on top of visual field loss (highest layer)
 */
const VISUAL_DISTURBANCE_CONDITIONS = [
  'visualAura', 'visualFloaters', 'visualSnow', 'visualSnowFlashing',
  'visualSnowColored', 'visualSnowTransparent', 'visualSnowDense', 'hallucinations',
  'visualAuraLeft', 'visualAuraRight', 'blueFieldPhenomena'
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
 * Gets the appropriate z-index for an overlay based on condition type.
 *
 * Stacking order (bottom to top):
 *   1. Base (eye conditions, color vision, refractive errors, retinal disorders)
 *   2. Diplopia / double vision
 *   3. Visual field loss
 *   4. Visual disturbances (highest — snow, aura, floaters, hallucinations)
 *
 * @param conditionId - The condition ID to check
 * @param baseZIndex - Base z-index value (default: 1000)
 * @returns String representation of the z-index
 */
export const getOverlayZIndex = (conditionId: string, baseZIndex: number = 1000): string => {
  // Visual Disturbance conditions get highest z-index to appear on top of everything
  if (isVisualDisturbanceCondition(conditionId)) {
    return (baseZIndex + 200).toString();
  }
  // Visual Field Loss conditions appear above base but below disturbances
  if (isVisualFieldLossCondition(conditionId)) {
    return (baseZIndex + 100).toString();
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
 * Z-index constants for different overlay types.
 * Note: YouTube iframes can have varying z-index, so we use high values
 * to ensure overlays appear above all embedded content.
 *
 * Stacking order (bottom to top):
 *   BASE (5000) < DIPLOPIA (5001) < VISUAL_FIELD_LOSS (9000) < VISUAL_DISTURBANCE (10000)
 */
export const Z_INDEX = {
  BASE: 5000,
  DIPLOPIA: 5001,
  VISUAL_FIELD_LOSS: 9000,
  VISUAL_DISTURBANCE: 10000,
  ANIMATED: 10,
  ANIMATED_VISUAL_FIELD_LOSS: 110,
} as const;
