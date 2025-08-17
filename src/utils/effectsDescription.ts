import { VisualEffect, InputSource } from '../types/visualEffects';

/**
 * Generates a human-readable description of the current visualization
 * based on the active effects and input source.
 * 
 * @param effects - Array of visual effects
 * @param inputSource - The current input source
 * @returns A descriptive string for screen readers and accessibility
 */
export const generateEffectsDescription = (
  effects: VisualEffect[], 
  inputSource: InputSource
): string => {
  const activeEffects = effects.filter(effect => effect.enabled);
  
  if (activeEffects.length === 0) {
    return `Visualization of ${inputSource.type} with no vision conditions applied.`;
  }
  
  const effectsDescription = activeEffects
    .map(e => `${e.name} at ${Math.round(e.intensity * 100)}% intensity`)
    .join(', ');
  
  return `Visualization of ${inputSource.type} with the following conditions applied: ${effectsDescription}.`;
};

/**
 * Generates accessibility-friendly descriptions for individual effects
 * 
 * @param effect - The visual effect to describe
 * @returns A detailed description of the effect
 */
export const getEffectDescription = (effect: VisualEffect): string => {
  const intensityPercent = Math.round(effect.intensity * 100);
  return `${effect.name} at ${intensityPercent}% intensity: ${effect.description}`;
};

/**
 * Generates a summary of all active effects for quick reference
 * 
 * @param effects - Array of visual effects
 * @returns A concise summary of active effects
 */
export const getActiveEffectsSummary = (effects: VisualEffect[]): string => {
  const activeEffects = effects.filter(effect => effect.enabled);
  
  if (activeEffects.length === 0) {
    return 'No vision conditions are currently active.';
  }
  
  if (activeEffects.length === 1) {
    const effect = activeEffects[0];
    return `${effect.name} (${Math.round(effect.intensity * 100)}% intensity)`;
  }
  
  return `${activeEffects.length} vision conditions active: ${activeEffects
    .map(e => `${e.name} (${Math.round(e.intensity * 100)}%)`)
    .join(', ')}`;
};
