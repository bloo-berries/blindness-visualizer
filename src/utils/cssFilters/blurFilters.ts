import { VisualEffect } from '../../types/visualEffects';

/**
 * Generates blur filter for nearsightedness, farsightedness, and astigmatism
 */
export const generateBlurFilter = (effects: VisualEffect[]): string => {
  // More efficient: check specific IDs directly
  const nearSighted = effects.find(e => e.id === 'nearSighted' && e.enabled);
  const farSighted = effects.find(e => e.id === 'farSighted' && e.enabled);
  const astigmatism = effects.find(e => e.id === 'astigmatism' && e.enabled);
  const blurEffect = nearSighted || farSighted || astigmatism;
  return blurEffect ? `blur(${blurEffect.intensity * 10}px)` : '';
};

/**
 * Generates CSS filters for new refractive errors from specialty.vision
 */
export const generateRefractiveErrorFilters = (effects: VisualEffect[]): string => {
  const refractiveEffects = effects.filter(e =>
    e.id === 'presbyopia' && e.enabled
  );

  if (refractiveEffects.length === 0) return '';

  const filters: string[] = [];

  const presbyopia = effects.find(e => e.id === 'presbyopia' && e.enabled);

  if (presbyopia) {
    // Blur effect for near vision difficulty
    filters.push(`blur(${presbyopia.intensity * 6}px)`);
    filters.push(`contrast(${100 - presbyopia.intensity * 20}%)`);
  }

  return filters.join(' ');
};
