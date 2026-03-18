import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Crazzy Steve's Bilateral Aphakia + Secondary Glaucoma
 * Key visual characteristics:
 * - Heavy Gaussian blur (30-50px) - nothing resolves to sharp edges
 * - Severe desaturation (40-60%) - colors appear washed out/faded
 * - Low contrast (~50% reduction) - dark objects against dark backgrounds disappear
 * - Overall dreamlike quality - "hazy aftermath of a dream"
 * - Tunnel vision handled by visual field overlay
 */
export const crazzysteveFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Aphakia + Glaucoma vision
  {
    effectId: 'crazzysteveComplete',
    filters: i => [
      // Heavy blur (30-50px range) - "like looking through frost or waking from deep sleep"
      `blur(${30 + i * 20}px)`,
      // Severe desaturation (40-60%) - colors present but muted, washed out
      `saturate(${60 - i * 20}%)`,
      // Low contrast (~50% reduction) - dark objects disappear against dark backgrounds
      `contrast(${50 - i * 10}%)`,
      // Slight brightness increase from light scatter (aphakic eyes lack UV filtering)
      `brightness(${100 + i * 15}%)`,
    ],
  },
  // Heavy Gaussian blur - nothing resolves to sharp edges
  {
    effectId: 'crazzySteveDreamlikeBlur',
    filters: i => [
      // Heavy Gaussian blur - nothing resolves to sharp edges
      `blur(${30 + i * 20}px)`,
      // Slight brightness from scatter
      `brightness(${100 + i * 10}%)`,
    ],
    excludeWhenActive: ['crazzysteveComplete'],
  },
  // Washed out colors from missing natural lens filtering
  {
    effectId: 'crazzysteveDesaturation',
    filters: i => [
      // Washed out colors from missing natural lens filtering
      `saturate(${60 - i * 30}%)`,
    ],
    excludeWhenActive: ['crazzysteveComplete'],
  },
  // Tunnel vision peripheral darkening
  {
    effectId: 'crazzysteveGlaucomaTunnel',
    filters: i => [
      // Tunnel vision is primarily handled by visual field overlay
      // Add slight overall darkening for the peripheral loss
      `brightness(${100 - i * 15}%)`,
    ],
    excludeWhenActive: ['crazzysteveComplete'],
  },
  // Severely reduced contrast
  {
    effectId: 'crazzySteveLowContrast',
    filters: i => [
      // Severely reduced contrast - only high-contrast boundaries register
      `contrast(${50 - i * 20}%)`,
    ],
    excludeWhenActive: ['crazzysteveComplete'],
  },
  // Light scatter and chromatic aberration
  {
    effectId: 'crazzysteveAphakicHalos',
    filters: i => [
      // Light scatter and chromatic aberration
      `brightness(${100 + i * 20}%)`,
      `contrast(${100 - i * 15}%)`,
    ],
    excludeWhenActive: ['crazzysteveComplete'],
  },
];
