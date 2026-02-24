import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Crazzy Steve's Bilateral Aphakia + Secondary Glaucoma
 * Key visual characteristics:
 * - Heavy Gaussian blur (30-50px) - nothing resolves to sharp edges
 * - Severe desaturation (40-60%) - colors appear washed out/faded
 * - Low contrast (~50% reduction) - dark objects against dark backgrounds disappear
 * - Overall dreamlike quality - "hazy aftermath of a dream"
 * - Tunnel vision handled by visual field overlay
 */
export const generateCrazzysteveFilters = (effects: VisualEffect[]): string => {
  const crazzysteveEffects = effects.filter(e =>
    e.id.startsWith('crazzysteve') || e.id.startsWith('crazzySteve')
  );

  if (crazzysteveEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'crazzysteveComplete' && e.enabled);
  const dreamlikeBlur = effects.find(e => e.id === 'crazzySteveDreamlikeBlur' && e.enabled);
  const desaturation = effects.find(e => e.id === 'crazzysteveDesaturation' && e.enabled);
  const glaucomaTunnel = effects.find(e => e.id === 'crazzysteveGlaucomaTunnel' && e.enabled);
  const lowContrast = effects.find(e => e.id === 'crazzySteveLowContrast' && e.enabled);
  const aphakicHalos = effects.find(e => e.id === 'crazzysteveAphakicHalos' && e.enabled);

  // Complete Aphakia + Glaucoma vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Heavy blur (30-50px range) - "like looking through frost or waking from deep sleep"
    filters.push(`blur(${30 + i * 20}px)`);
    // Severe desaturation (40-60%) - colors present but muted, washed out
    filters.push(`saturate(${60 - i * 20}%)`);
    // Low contrast (~50% reduction) - dark objects disappear against dark backgrounds
    filters.push(`contrast(${50 - i * 10}%)`);
    // Slight brightness increase from light scatter (aphakic eyes lack UV filtering)
    filters.push(`brightness(${100 + i * 15}%)`);
  }

  // Individual effects for customization
  if (dreamlikeBlur && !completeVision) {
    const i = dreamlikeBlur.intensity;
    // Heavy Gaussian blur - nothing resolves to sharp edges
    filters.push(`blur(${30 + i * 20}px)`);
    // Slight brightness from scatter
    filters.push(`brightness(${100 + i * 10}%)`);
  }

  if (desaturation && !completeVision) {
    const i = desaturation.intensity;
    // Washed out colors from missing natural lens filtering
    filters.push(`saturate(${60 - i * 30}%)`);
  }

  if (glaucomaTunnel && !completeVision) {
    // Tunnel vision is primarily handled by visual field overlay
    // Add slight overall darkening for the peripheral loss
    const i = glaucomaTunnel.intensity;
    filters.push(`brightness(${100 - i * 15}%)`);
  }

  if (lowContrast && !completeVision) {
    const i = lowContrast.intensity;
    // Severely reduced contrast - only high-contrast boundaries register
    filters.push(`contrast(${50 - i * 20}%)`);
  }

  if (aphakicHalos && !completeVision) {
    const i = aphakicHalos.intensity;
    // Light scatter and chromatic aberration
    filters.push(`brightness(${100 + i * 20}%)`);
    filters.push(`contrast(${100 - i * 15}%)`);
  }

  return filters.join(' ');
};
