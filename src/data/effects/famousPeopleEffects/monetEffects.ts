import { VisualEffect } from '../../../types/visualEffects';

/**
 * Claude Monet - Cataracts
 */
export const monetEffects: VisualEffect[] = [
  {
    id: 'monetCataractsFog',
    name: 'Cataracts Fog Effect (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'The characteristic "fog" effect that Monet described seeing through. Creates a cloudy, hazy overlay that reduces visual clarity and contrast, simulating the clouding of the eye\'s natural lens.'
  },
  {
    id: 'monetColorDistortion',
    name: 'Color Distortion (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Dramatic alteration of color perception where cool colors (blue, purple) become difficult to distinguish while warm tones (red, yellow, orange) are accentuated. Represents the yellowing and filtering effect of cataracts on color vision.'
  },
  {
    id: 'monetProgressiveLoss',
    name: 'Progressive Vision Loss (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates Monet\'s progressive vision deterioration from his 60s to his 80s, showing the gradual worsening of visual acuity and contrast sensitivity that led to legal blindness in his right eye and only 10% vision in his left.'
  },
  {
    id: 'monetCataractsProgression',
    name: 'Complete Cataracts Progression (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Monet\'s cataracts experience combining fog effects, color distortion, and progressive vision loss. Represents his journey from initial symptoms in his 60s to severe impairment by 1922.'
  }
];
