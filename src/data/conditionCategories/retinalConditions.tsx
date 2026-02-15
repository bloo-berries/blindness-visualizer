import React from 'react';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const retinalConditionsCategory: ConditionCategory = {
  id: 'retinal-disorders',
  name: 'Retinal Disorders',
  icon: <VisibilityIcon />,
  description: 'Conditions affecting the retina and its specialized cells',
  conditions: [
    {
      id: 'retinitisPigmentosa',
      name: 'Retinitis Pigmentosa',
      imagePath: `${PUBLIC_URL}/images/glossary/Retinitis Pigmentosa.webp`,
      description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.',
      relatedPeople: ['Erik Weihenmayer'],
      treatments: {
        available: true,
        options: [
          'Vitamin A palmitate (15,000 IU/day) - may slow progression in some forms',
          'Docosahexaenoic acid (DHA) supplements',
          'Gene therapy (Luxturna) for specific RPE65 mutations - FDA approved',
          'Retinal implants (Argus II, Alpha AMS) for advanced cases',
          'Stem cell therapy (experimental)',
          'Low vision aids and rehabilitation',
          'Protection from bright light with sunglasses',
          'Genetic counseling and testing'
        ],
        notes: 'RP is progressive and currently has no cure for most forms. Treatment focuses on slowing progression and maximizing remaining vision. Gene therapy is available for specific genetic mutations.'
      }
    },
    {
      id: 'stargardt',
      name: 'Stargardt Disease',
      imagePath: `${PUBLIC_URL}/images/glossary/Stargardt Disease.webp`,
      description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.',
      relatedPeople: ['Marla Runyan'],
      treatments: {
        available: true,
        options: [
          'No cure currently available',
          'Low vision rehabilitation and aids',
          'Eccentric viewing training',
          'Gene therapy research is ongoing (experimental)',
          'Stem cell therapy research (experimental)',
          'Protection from bright light (may slow progression)',
          'Avoid high-dose vitamin A supplements',
          'Genetic counseling'
        ],
        notes: 'Stargardt disease is progressive and currently incurable. Management focuses on maximizing remaining peripheral vision and adaptive strategies. Research into gene and stem cell therapies is promising.'
      }
    },
    {
      id: 'retinalDetachment',
      name: 'Retinal Detachment',
      imagePath: `${PUBLIC_URL}/images/glossary/Retinal Detachment.webp`,
      description: 'Separation of the retina from the underlying tissue. Can cause sudden flashes of light, floaters, and a curtain-like shadow over the visual field. Requires immediate medical attention.',
      relatedPeople: ['John Milton'],
      treatments: {
        available: true,
        options: [
          'Surgical repair (urgent):',
          '• Pneumatic retinopexy: gas bubble injection',
          '• Scleral buckle: band around eye to support retina',
          '• Vitrectomy: removal of vitreous gel and retinal reattachment',
          'Laser photocoagulation or cryopexy to seal retinal tears',
          'Post-surgical positioning (face-down) to help reattachment'
        ],
        notes: 'Retinal detachment is a medical emergency requiring immediate treatment. Success rates are high if treated promptly (within days). Delayed treatment can result in permanent vision loss.'
      }
    }
  ]
};
