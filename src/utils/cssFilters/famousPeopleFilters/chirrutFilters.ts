import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Chirrut Îmwe's Force Perception
 *
 * Technical Parameters:
 * 1. Strong desaturation (8-15%) — muted, meditative palette
 * 2. Moderate darkness (45-60% brightness) — dim but not black
 * 3. Blue-cyan hue shift (190deg) — Force energy color
 * 4. Slight blur (2-4px) — soft, diffused awareness
 */
export const chirrutFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'chirrutForcePerceptionComplete',
    filters: i => [
      // Strong desaturation — muted, meditative feel
      `saturate(${15 - i * 7}%)`,
      // Moderate darkness — dim but not black
      `brightness(${60 - i * 15}%)`,
      // Blue-cyan hue shift — Force energy wash
      `hue-rotate(190deg)`,
      // Slight blur — soft awareness, not sharp vision
      `blur(${2 + i * 2}px)`,
    ],
  },
];
