import { VisualEffect } from '../../types/visualEffects';
import { INTENSITY } from '../../constants/effectDefaults';

/**
 * Creates a VisualEffect with default enabled:false and intensity:SEVERE (1.0).
 */
export const effect = (id: string, name: string, description: string): VisualEffect => ({
  id,
  name,
  enabled: false,
  intensity: INTENSITY.SEVERE,
  description,
});
