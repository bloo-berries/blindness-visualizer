import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Anselmo Ralph's Ocular Myasthenia Gravis
 *
 * Technical Parameters:
 * 1. Blur (2-8px) - muscular fatigue affects focus control
 * 2. Brightness (110-130%) - photophobia causes light sensitivity
 * 3. Contrast (85-95%) - slight contrast reduction from fatigue
 *
 * Note: Ptosis overlay and diplopia effects are handled separately
 */
export const generateAnselmoFilters = (effects: VisualEffect[]): string => {
  const anselmoEffects = effects.filter(e =>
    e.id.startsWith('anselmoOcularMyasthenia') && e.enabled
  );

  if (anselmoEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'anselmoOcularMyastheniaComplete' && e.enabled);
  const ptosis = effects.find(e => e.id === 'anselmoOcularMyastheniaPtosis' && e.enabled);
  const diplopia = effects.find(e => e.id === 'anselmoOcularMyastheniaDiplopia' && e.enabled);
  const photophobia = effects.find(e => e.id === 'anselmoOcularMyastheniaPhotophobia' && e.enabled);
  const blur = effects.find(e => e.id === 'anselmoOcularMyastheniaBlur' && e.enabled);

  // Complete Ocular Myasthenia Gravis simulation
  if (completeVision) {
    const i = completeVision.intensity;
    // Moderate blur from muscle fatigue affecting focus (2-8px)
    filters.push(`blur(${2 + i * 6}px)`);
    // Increased brightness from photophobia (110-130%)
    filters.push(`brightness(${110 + i * 20}%)`);
    // Slight contrast reduction (85-95%)
    filters.push(`contrast(${95 - i * 10}%)`);
    // Slight saturation reduction from visual strain
    filters.push(`saturate(${95 - i * 10}%)`);
  }

  // Photophobia only
  if (photophobia && !completeVision) {
    const i = photophobia.intensity;
    // High brightness - light sensitivity
    filters.push(`brightness(${115 + i * 25}%)`);
    // Slight contrast reduction
    filters.push(`contrast(${92 - i * 8}%)`);
  }

  // Blur only (from muscle fatigue)
  if (blur && !completeVision) {
    const i = blur.intensity;
    // Moderate blur from fatigue
    filters.push(`blur(${2 + i * 6}px)`);
    // Slight brightness increase
    filters.push(`brightness(${105 + i * 10}%)`);
  }

  // Diplopia standalone - handled via CSS transform/overlay, minimal filter effect
  if (diplopia && !completeVision) {
    const i = diplopia.intensity;
    // Very slight blur to soften edges of ghost images
    filters.push(`blur(${0.5 + i * 1.5}px)`);
  }

  // Ptosis standalone - primarily handled by overlay, minimal filter
  if (ptosis && !completeVision) {
    const i = ptosis.intensity;
    // Slight brightness reduction as light is partially blocked
    filters.push(`brightness(${95 - i * 10}%)`);
  }

  return filters.join(' ');
};
