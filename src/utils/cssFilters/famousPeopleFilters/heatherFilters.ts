import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Heather Hutchison's Light Perception Only Vision
 *
 * Technical Parameters:
 * 1. Extreme Gaussian blur (80-120px) - destroys all edge, form, detail
 * 2. Near-total desaturation (0-5%) - functional absence of color
 * 3. Severe contrast reduction (10-20%) - shadows/midtones collapse
 * 4. High brightness (180%+) - "washed-out white" perception
 *
 * Note: The white fog overlay is handled by the animated overlay system
 */
export const heatherFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Light Perception vision
  {
    effectId: 'heatherLightPerceptionComplete',
    filters: i => [
      // Extreme blur - nothing resolves to form (80-120px range)
      `blur(${80 + i * 40}px)`,
      // Strip all color - LP vision doesn't resolve wavelength (0-5% saturation)
      `saturate(${5 - i * 5}%)`,
      // Severe contrast reduction (10-20% range)
      `contrast(${20 - i * 10}%)`,
      // High brightness - "washed-out white" perception (180%+)
      `brightness(${180 + i * 40}%)`,
    ],
  },
  // Near-total opacity (standalone)
  {
    effectId: 'heatherNearTotalOpacity',
    filters: i => [
      `brightness(${180 + i * 30}%)`,
      `contrast(${20 - i * 10}%)`,
    ],
    excludeWhenActive: ['heatherLightPerceptionComplete'],
  },
  // Diffuse light blobs (standalone)
  {
    effectId: 'heatherDiffuseLightBlobs',
    filters: i => [
      `blur(${80 + i * 40}px)`,
      `contrast(${20 - i * 10}%)`,
      `brightness(${160 + i * 30}%)`,
    ],
    excludeWhenActive: ['heatherLightPerceptionComplete'],
  },
  // No color (standalone)
  {
    effectId: 'heatherNoColor',
    filters: () => [
      `saturate(0%)`,
    ],
    excludeWhenActive: ['heatherLightPerceptionComplete'],
  },
];
