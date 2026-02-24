import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Geordi La Forge's VISOR Sense
 * Key visual characteristics:
 * - False-color thermal/spectral palette - remap to non-natural colors
 * - No true darkness - minimum brightness floor (0.15-0.2)
 * - Enhanced contrast for EM edge detection
 * - Chromatic shift away from natural greens/earth tones
 */
export const generateGeordiFilters = (effects: VisualEffect[]): string => {
  const geordiEffects = effects.filter(e =>
    e.id.startsWith('geordi') && e.enabled
  );

  if (geordiEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'geordiVisorSenseComplete' && e.enabled);
  const thermalSpectrum = effects.find(e => e.id === 'geordiThermalSpectrum' && e.enabled);
  const emEnhancement = effects.find(e => e.id === 'geordiEMEnhancement' && e.enabled);
  const noTrueDarkness = effects.find(e => e.id === 'geordiNoTrueDarkness' && e.enabled);

  // Complete VISOR Sense - false-color spectral vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Shift hue significantly - move away from natural colors
    // Rotate toward blue/violet/magenta spectrum (thermal palette)
    filters.push(`hue-rotate(${180 + i * 40}deg)`);
    // Boost saturation for vibrant false-color effect
    filters.push(`saturate(${130 + i * 40}%)`);
    // Increased contrast for edge enhancement / EM boundaries
    filters.push(`contrast(${115 + i * 20}%)`);
    // Minimum brightness floor - no true darkness (violet floor)
    filters.push(`brightness(${85 + i * 15}%)`);
    // Slight invert-like effect via sepia + hue for thermal look
    filters.push(`sepia(${i * 15}%)`);
  }

  // Thermal spectrum effect (standalone)
  if (thermalSpectrum && !completeVision) {
    const i = thermalSpectrum.intensity;
    // Dramatic hue shift to thermal colors
    filters.push(`hue-rotate(${200 + i * 60}deg)`);
    filters.push(`saturate(${140 + i * 50}%)`);
    filters.push(`sepia(${i * 20}%)`);
  }

  // EM enhancement (standalone)
  if (emEnhancement && !completeVision) {
    const i = emEnhancement.intensity;
    // High contrast for edge detection appearance
    filters.push(`contrast(${120 + i * 30}%)`);
    filters.push(`brightness(${105 + i * 15}%)`);
    filters.push(`saturate(${120 + i * 30}%)`);
  }

  // No true darkness (standalone)
  if (noTrueDarkness && !completeVision) {
    const i = noTrueDarkness.intensity;
    // Ensure minimum brightness floor
    filters.push(`brightness(${115 + i * 25}%)`);
    // Lift shadows
    filters.push(`contrast(${90 - i * 15}%)`);
  }

  return filters.join(' ');
};
