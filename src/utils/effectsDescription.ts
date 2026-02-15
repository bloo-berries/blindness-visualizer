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
