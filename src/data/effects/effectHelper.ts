import { VisualEffect } from '../../types/visualEffects';

/**
 * Creates a VisualEffect with default enabled:false and intensity:1.0.
 */
export const effect = (id: string, name: string, description: string): VisualEffect => ({
  id,
  name,
  enabled: false,
  intensity: 1.0,
  description,
});
