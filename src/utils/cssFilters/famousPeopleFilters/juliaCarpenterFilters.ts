import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Julia Carpenter's Psychic Web Vision
 *
 * Technical Parameters:
 * 1. Desaturation (10-20%) — strips natural color
 * 2. Moderate dimming (60-75% brightness) — overlay provides the void
 * 3. Slight contrast boost (120-140%) — web strands pop
 * 4. Red hue shift (340deg) — crimson/magenta tones
 * 5. Light sepia (10-20%) — warm red-black undertone
 */
export const juliaCarpenterFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'juliaCarpenterPsychicWebComplete',
    filters: i => [
      // Desaturation — strips natural color for psychic overlay
      `saturate(${20 - i * 10}%)`,
      // Moderate dimming — overlay provides the dark void
      `brightness(${75 - i * 15}%)`,
      // Slight contrast boost — web strands pop
      `contrast(${120 + i * 20}%)`,
      // Red hue shift — crimson/magenta tones
      `hue-rotate(340deg)`,
      // Light sepia — warm red-black undertone
      `sepia(${10 + i * 10}%)`,
    ],
  },
];
