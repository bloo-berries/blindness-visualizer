import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Christine Ha's NMO effects
 */
export const christineFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'christineNMOComplete',
    filters: i => [
      // Requirement 2: Heavy blur (25-35px range) - reduced from 50px
      // "Counting fingers at 10-12 inches" - shapes should still be vaguely visible
      `blur(${25 + i * 10}px)`,
      // Requirement 7: Elevated brightness to prevent total darkness
      `brightness(${105 + i * 10}%)`,
      // Requirement 3: Low contrast for vague shapes only
      `contrast(${50 - i * 25}%)`,
      // Requirement 4: Heavy desaturation but not grayscale (muted, washed-out colors)
      `saturate(${35 - i * 20}%)`,
      // Slight warmth (steam has a warm quality)
      `sepia(${i * 20}%)`,
    ],
  },
  {
    effectId: 'christineNMOBlur',
    filters: i => [
      // Standalone blur effect for NMO - reduced to more realistic range
      `blur(${22 + i * 13}px)`,
      `brightness(${102 + i * 8}%)`,
    ],
  },
  {
    effectId: 'christineSteamyMirror',
    filters: i => [
      // "Looking at a foggy mirror after hot shower" - high brightness, very low contrast
      `brightness(${108 + i * 12}%)`,
      `contrast(${45 - i * 30}%)`,
      `saturate(${40 - i * 25}%)`,
      `blur(${20 + i * 12}px)`,
    ],
  },
  {
    effectId: 'christineLightScatter',
    filters: i => [
      // Light sensitivity and scattering - makes bright areas bloom
      `brightness(${110 + i * 20}%)`,
      `contrast(${60 - i * 35}%)`,
      `saturate(${50 - i * 25}%)`,
    ],
  },
  {
    effectId: 'christineFogOverlay',
    filters: i => [
      // Additional fog layer - adds to overall haziness
      `brightness(${106 + i * 10}%)`,
      `contrast(${55 - i * 35}%)`,
      `saturate(${45 - i * 30}%)`,
    ],
  },
  {
    effectId: 'christineFluctuatingVision',
    filters: i => [
      // Uhthoff's phenomenon - vision varies with temperature/fatigue
      // Minimal CSS filter contribution as main effect is in animated overlay
      `brightness(${102 + i * 5}%)`,
      `contrast(${80 - i * 20}%)`,
    ],
  },
];
