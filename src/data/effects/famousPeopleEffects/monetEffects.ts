import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Claude Monet - Cataracts
 */
export const monetEffects: VisualEffect[] = [
  effect('monetCataractsFog', 'Cataracts Fog Effect (Monet)', 'The characteristic "fog" effect that Monet described seeing through. Creates a cloudy, hazy overlay that reduces visual clarity and contrast, simulating the clouding of the eye\'s natural lens.'),
  effect('monetColorDistortion', 'Color Distortion (Monet)', 'Dramatic alteration of color perception where cool colors (blue, purple) become difficult to distinguish while warm tones (red, yellow, orange) are accentuated. Represents the yellowing and filtering effect of cataracts on color vision.'),
  effect('monetProgressiveLoss', 'Progressive Vision Loss (Monet)', 'Simulates Monet\'s progressive vision deterioration from his 60s to his 80s, showing the gradual worsening of visual acuity and contrast sensitivity that led to legal blindness in his right eye and only 10% vision in his left.'),
  effect('monetCataractsProgression', 'Complete Cataracts Progression (Monet)', 'Complete simulation of Monet\'s cataracts experience combining fog effects, color distortion, and progressive vision loss. Represents his journey from initial symptoms in his 60s to severe impairment by 1922.'),
];
