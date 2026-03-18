import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Sugar Ray Leonard's Retinal Detachment
 * Haziness, muted colors, slight contrast loss - the "dirty glass" effect
 */
export const sugarFilterConfigs: CSSFilterEffectConfig[] = [
  {
    // Complete retinal detachment - overall haziness like dirty glass
    effectId: 'sugarRetinalDetachmentComplete',
    filters: i => [
      // Mild contrast reduction (vitreous clouding)
      `contrast(${100 - i * 15}%)`,
      // Slight brightness reduction
      `brightness(${100 - i * 8}%)`,
      // Muted colors
      `saturate(${100 - i * 20}%)`,
      // Very subtle blur for the haze effect
      `blur(${i * 0.5}px)`,
    ],
  },
  {
    effectId: 'sugarHaziness',
    filters: i => [
      `contrast(${100 - i * 18}%)`,
      `saturate(${100 - i * 15}%)`,
      `blur(${i * 0.8}px)`,
    ],
  },
  {
    effectId: 'sugarDarkCurtain',
    filters: i => [
      // Slight overall darkening
      `brightness(${100 - i * 10}%)`,
    ],
  },
];
