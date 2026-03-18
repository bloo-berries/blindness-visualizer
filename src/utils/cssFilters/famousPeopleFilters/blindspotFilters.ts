import { CSSFilterEffectConfig } from './filterConfig';

/**
 * CSS filters for Blindspot's Sonar Sense
 * Key visual characteristics:
 * - Monochrome blue-green palette (submarine sonar aesthetic)
 * - No color information - only depth/distance
 * - High contrast for edge detection (hard surfaces reflect strongly)
 * - Slight blur representing sonar resolution limits
 */
export const blindspotFilterConfigs: CSSFilterEffectConfig[] = [
  // Complete Sonar Sense - monochrome depth-mapped vision
  {
    effectId: 'blindspotSonarSenseComplete',
    filters: i => [
      // Strip color - sonar provides no wavelength information
      `saturate(${15 - i * 10}%)`,
      // Shift to blue-green monochrome (submarine sonar look)
      `hue-rotate(${160 + i * 20}deg)`,
      // High contrast for edge detection (hard surfaces)
      `contrast(${120 + i * 25}%)`,
      // Reduced brightness - sonar world is darker
      `brightness(${75 - i * 15}%)`,
      // Slight blur representing resolution limits
      `blur(${0.5 + i * 1}px)`,
    ],
  },
  // Depth mapping only
  {
    effectId: 'blindspotDepthMapping',
    filters: i => [
      `saturate(${20 - i * 15}%)`,
      `hue-rotate(${170 + i * 15}deg)`,
      `brightness(${80 - i * 20}%)`,
    ],
    excludeWhenActive: ['blindspotSonarSenseComplete'],
  },
  // Edge detection emphasis
  {
    effectId: 'blindspotEdgeDetection',
    filters: i => [
      `contrast(${130 + i * 35}%)`,
      `brightness(${90 - i * 10}%)`,
    ],
    excludeWhenActive: ['blindspotSonarSenseComplete'],
  },
  // Sonar resolution limits
  {
    effectId: 'blindspotSonarResolution',
    filters: i => [
      `blur(${0.8 + i * 1.5}px)`,
      `contrast(${110 + i * 15}%)`,
    ],
    excludeWhenActive: ['blindspotSonarSenseComplete'],
  },
];
