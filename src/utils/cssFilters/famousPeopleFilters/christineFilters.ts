import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Christine Ha's NMO effects
 */
export const generateChristineFilters = (effects: VisualEffect[]): string => {
  const christineEffects = effects.filter(e =>
    e.id.startsWith('christine') && e.enabled
  );

  if (christineEffects.length === 0) return '';

  const filters: string[] = [];

  const nmoComplete = effects.find(e => e.id === 'christineNMOComplete' && e.enabled);
  const nmoBlur = effects.find(e => e.id === 'christineNMOBlur' && e.enabled);
  const steamyMirror = effects.find(e => e.id === 'christineSteamyMirror' && e.enabled);
  const lightScatter = effects.find(e => e.id === 'christineLightScatter' && e.enabled);
  const fogOverlay = effects.find(e => e.id === 'christineFogOverlay' && e.enabled);
  const fluctuatingVision = effects.find(e => e.id === 'christineFluctuatingVision' && e.enabled);

  if (nmoComplete) {
    // Requirement 2: Heavy blur (25-35px range) - reduced from 50px
    // "Counting fingers at 10-12 inches" - shapes should still be vaguely visible
    filters.push(`blur(${25 + nmoComplete.intensity * 10}px)`);
    // Requirement 7: Elevated brightness to prevent total darkness
    filters.push(`brightness(${105 + nmoComplete.intensity * 10}%)`);
    // Requirement 3: Low contrast for vague shapes only
    filters.push(`contrast(${50 - nmoComplete.intensity * 25}%)`);
    // Requirement 4: Heavy desaturation but not grayscale (muted, washed-out colors)
    filters.push(`saturate(${35 - nmoComplete.intensity * 20}%)`);
    // Slight warmth (steam has a warm quality)
    filters.push(`sepia(${nmoComplete.intensity * 20}%)`);
  }

  if (nmoBlur) {
    // Standalone blur effect for NMO - reduced to more realistic range
    filters.push(`blur(${22 + nmoBlur.intensity * 13}px)`);
    filters.push(`brightness(${102 + nmoBlur.intensity * 8}%)`);
  }

  if (steamyMirror) {
    // "Looking at a foggy mirror after hot shower" - high brightness, very low contrast
    filters.push(`brightness(${108 + steamyMirror.intensity * 12}%)`);
    filters.push(`contrast(${45 - steamyMirror.intensity * 30}%)`);
    filters.push(`saturate(${40 - steamyMirror.intensity * 25}%)`);
    filters.push(`blur(${20 + steamyMirror.intensity * 12}px)`);
  }

  if (lightScatter) {
    // Light sensitivity and scattering - makes bright areas bloom
    filters.push(`brightness(${110 + lightScatter.intensity * 20}%)`);
    filters.push(`contrast(${60 - lightScatter.intensity * 35}%)`);
    filters.push(`saturate(${50 - lightScatter.intensity * 25}%)`);
  }

  if (fogOverlay) {
    // Additional fog layer - adds to overall haziness
    filters.push(`brightness(${106 + fogOverlay.intensity * 10}%)`);
    filters.push(`contrast(${55 - fogOverlay.intensity * 35}%)`);
    filters.push(`saturate(${45 - fogOverlay.intensity * 30}%)`);
  }

  if (fluctuatingVision) {
    // Uhthoff's phenomenon - vision varies with temperature/fatigue
    // Minimal CSS filter contribution as main effect is in animated overlay
    filters.push(`brightness(${102 + fluctuatingVision.intensity * 5}%)`);
    filters.push(`contrast(${80 - fluctuatingVision.intensity * 20}%)`);
  }

  return filters.join(' ');
};
