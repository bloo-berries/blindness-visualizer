import React from 'react';
import { ColorLens as ColorLensIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const colorVisionCategory: ConditionCategory = {
  id: 'color-vision',
  name: 'Color Vision Deficiencies',
  icon: <ColorLensIcon />,
  description: 'Conditions affecting color perception and discrimination',
  conditions: [
    {
      id: 'protanopia',
      name: 'Protanopia (Red-Blind)',
      imagePath: `${PUBLIC_URL}/images/glossary/Protanopia (Red-Blind).webp`,
      description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
          'Adaptive strategies: using patterns, labels, or apps to identify colors',
          'Gene therapy research is ongoing but not yet available'
        ],
        notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
      }
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia (Green-Blind)',
      imagePath: `${PUBLIC_URL}/images/glossary/Deuteranopia (Green-Blind).webp`,
      description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
          'Adaptive strategies: using patterns, labels, or apps to identify colors',
          'Gene therapy research is ongoing but not yet available'
        ],
        notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
      }
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia (Blue-Blind)',
      imagePath: `${PUBLIC_URL}/images/glossary/Tritanopia (Blue-Blind).webp`,
      description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'May be acquired (from eye disease, medication, or aging) or inherited',
          'If acquired, treating underlying cause may help',
          'Adaptive strategies and color identification apps'
        ],
        notes: 'Acquired tritanopia may improve if the underlying cause is treated. Inherited forms are permanent.'
      }
    },
    {
      id: 'protanomaly',
      name: 'Protanomaly (Red-Weak)',
      imagePath: `${PUBLIC_URL}/images/glossary/Protanomaly (Red-Weak).webp`,
      description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'Color-correcting glasses may provide some improvement',
          'Adaptive strategies and color identification tools'
        ],
        notes: 'Milder than protanopia but still permanent. Adaptive strategies are the primary management approach.'
      }
    },
    {
      id: 'deuteranomaly',
      name: 'Deuteranomaly (Green-Weak)',
      imagePath: `${PUBLIC_URL}/images/glossary/Deuteranomaly (Green-Weak).webp`,
      description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'Color-correcting glasses may provide some improvement',
          'Adaptive strategies and color identification tools'
        ],
        notes: 'Most common color vision deficiency. Usually does not significantly impact daily life, but adaptive strategies can help when needed.'
      }
    },
    {
      id: 'tritanomaly',
      name: 'Tritanomaly (Blue-Weak)',
      imagePath: `${PUBLIC_URL}/images/glossary/Tritanomaly (Blue-Weak).webp`,
      description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'If acquired, treating underlying cause may help',
          'Adaptive strategies and color identification tools'
        ],
        notes: 'Very rare condition. Treatment depends on whether it is inherited or acquired.'
      }
    },
    {
      id: 'monochromacy',
      name: 'Monochromacy (Complete Color Blindness)',
      imagePath: `${PUBLIC_URL}/images/glossary/Monochromacy (Complete Color Blindness).webp`,
      description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.',
      treatments: {
        available: false,
        options: [
          'No cure currently available',
          'Low vision aids and adaptive strategies',
          'Protection from bright light (often associated with photophobia)',
          'Gene therapy research is ongoing but experimental'
        ],
        notes: 'Complete color blindness is typically genetic and permanent. Management focuses on maximizing remaining vision and adaptive strategies.'
      }
    }
  ]
};
