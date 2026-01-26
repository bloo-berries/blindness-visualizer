import { VisualEffect } from '../../types/visualEffects';

/**
 * Color Vision Deficiencies
 * Protanopia, deuteranopia, tritanopia, anomalies, monochromacy
 */
export const colorVisionEffects: VisualEffect[] = [
  {
    id: 'protanopia',
    name: 'Protanopia (Red-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.'
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia (Green-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.'
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia (Blue-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.'
  },
  {
    id: 'protanomaly',
    name: 'Protanomaly (Red-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.'
  },
  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly (Green-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.'
  },
  {
    id: 'tritanomaly',
    name: 'Tritanomaly (Blue-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.'
  },
  {
    id: 'monochromacy',
    name: 'Monochromacy (Complete Color Blindness)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.'
  },
  {
    id: 'monochromatic',
    name: 'Monochromatic Vision',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing only in shades of one color (usually blue). Different from complete color blindness as some color perception remains. Very rare condition.'
  }
];
