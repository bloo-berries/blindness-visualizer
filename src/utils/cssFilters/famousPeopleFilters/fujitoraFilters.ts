import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Fujitora's Observation Haki Vision
 *
 * Technical Parameters:
 * 1. Desaturation (10-20%) — muted physical world
 * 2. Moderate dimming (60-75% brightness) — overlay provides the void
 * 3. Purple tint via hue-rotate (~270deg) — Haki energy color
 * 4. Slight contrast boost (120-140%) — sharper edges
 */
export const fujitoraFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'fujitoraObservationHakiComplete',
    filters: i => [
      // Desaturation — muted physical world beneath overlay
      `saturate(${20 - i * 10}%)`,
      // Moderate dimming — overlay provides the dark void
      `brightness(${75 - i * 15}%)`,
      // Purple/indigo tint — Haki energy color
      `hue-rotate(270deg)`,
      // Slight contrast boost
      `contrast(${120 + i * 20}%)`,
    ],
  },
];
