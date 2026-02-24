import { VisualEffect } from '../../../types/visualEffects';

/**
 * CSS filters for Toph Beifong's Seismic Sense
 *
 * Creates the base visual transformation:
 * - Desaturation (seismic sense has no color, only vibration data)
 * - Green/cyan tint (phosphor glow aesthetic)
 * - High contrast (clear differentiation of surfaces)
 * - Slight inversion (dark becomes the baseline)
 */
export const generateTophFilters = (effects: VisualEffect[]): string => {
  const filters: string[] = [];

  const tophSeismic = effects.find(e => e.id === 'tophSeismicSenseComplete' && e.enabled);
  const tophWireframe = effects.find(e => e.id === 'tophWireframeVision' && e.enabled);
  const tophSand = effects.find(e => e.id === 'tophSandWeakness' && e.enabled);

  if (tophSeismic) {
    const i = tophSeismic.intensity;
    // Near-complete desaturation (seismic sense has no color)
    filters.push(`saturate(${10 - i * 8}%)`);
    // Shift hue toward green/cyan (phosphor aesthetic)
    filters.push(`hue-rotate(${120 + i * 20}deg)`);
    // High contrast for clear surface definition
    filters.push(`contrast(${120 + i * 40}%)`);
    // Reduce brightness (dark background aesthetic)
    filters.push(`brightness(${40 + i * 20}%)`);
    // Sepia to warm the green slightly
    filters.push(`sepia(${20 + i * 10}%)`);
  }

  if (tophWireframe && !tophSeismic) {
    const i = tophWireframe.intensity;
    filters.push(`saturate(${15 - i * 10}%)`);
    filters.push(`hue-rotate(${110 + i * 25}deg)`);
    filters.push(`contrast(${130 + i * 30}%)`);
    filters.push(`brightness(${35 + i * 15}%)`);
  }

  if (tophSand) {
    const i = tophSand.intensity;
    // Sand weakness: blur and reduce clarity
    filters.push(`blur(${8 + i * 12}px)`);
    filters.push(`contrast(${60 - i * 20}%)`);
    filters.push(`brightness(${50 - i * 15}%)`);
  }

  return filters.join(' ');
};
