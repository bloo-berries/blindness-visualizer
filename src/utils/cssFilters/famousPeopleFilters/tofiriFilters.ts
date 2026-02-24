import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Tofiri Kibuuka's B1/T11 Blindness
 * Two variants supported:
 * - NLP (No Light Perception): Complete darkness, brightness 0%
 * - Bare LP: Near-total darkness (98-100% opacity) with extremely subtle
 *   ambient luminance variation - no spatial info, just "light exists somewhere"
 */
export const generateTofiriFilters = (effects: VisualEffect[]): string => {
  const tofiriEffects = effects.filter(e =>
    e.id.startsWith('tofiri') && e.enabled
  );

  if (tofiriEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'tofiriComplete' && e.enabled);
  const nlp = effects.find(e => e.id === 'tofiriNLP' && e.enabled);
  const bareLightPerception = effects.find(e => e.id === 'tofiriBareLightPerception' && e.enabled);

  // No Light Perception - complete darkness
  if (nlp) {
    filters.push('brightness(0%)');
    filters.push('contrast(0%)');
    filters.push('saturate(0%)');
    return filters.join(' ');
  }

  // Bare Light Perception or Complete B1/T11 vision
  // Near-total darkness with extremely subtle ambient luminance
  if (completeVision || bareLightPerception) {
    const i = (completeVision || bareLightPerception)!.intensity;
    // Near-total darkness: brightness at 2-5% (just barely perceptible luminance variation)
    filters.push(`brightness(${2 + i * 3}%)`);
    // Minimal contrast - no edges, no shapes
    filters.push(`contrast(${5 - i * 3}%)`);
    // Complete desaturation - no color perception
    filters.push('saturate(0%)');
    // Extreme blur to eliminate any spatial information
    filters.push(`blur(${80 + i * 40}px)`);
  }

  return filters.join(' ');
};
