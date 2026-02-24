import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Abraham Nemeth's Congenital Dual-Attack Blindness
 * Key visual characteristics:
 * - Central scotoma (macular component) + peripheral constriction (RP component)
 * - Only a fragile mid-peripheral ring survives (if any)
 * - Heavy Gaussian blur globally - even surviving ring has poor resolution
 * - Severe desaturation and contrast loss
 * - Night blindness component
 * - End state: near-total darkness, functionally blind from birth
 */
export const generateNemethFilters = (effects: VisualEffect[]): string => {
  const nemethEffects = effects.filter(e =>
    e.id.startsWith('nemeth') && e.enabled
  );

  if (nemethEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'nemethComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'nemethCentralScotoma' && e.enabled);
  const peripheralConstriction = effects.find(e => e.id === 'nemethPeripheralConstriction' && e.enabled);
  const midRingRemnant = effects.find(e => e.id === 'nemethMidRingRemnant' && e.enabled);
  const nightBlindness = effects.find(e => e.id === 'nemethNightBlindness' && e.enabled);
  const acuityLoss = effects.find(e => e.id === 'nemethAcuityLoss' && e.enabled);
  const partialRing = effects.find(e => e.id === 'nemethPartialRing' && e.enabled);

  // Complete dual-attack blindness - near-total darkness
  // Nemeth functioned as totally blind throughout life
  if (completeVision) {
    const i = completeVision.intensity;
    // Near-total darkness - brightness approaching 0
    filters.push(`brightness(${8 - i * 7}%)`);
    // Minimal contrast - no edges, no detail
    filters.push(`contrast(${15 - i * 12}%)`);
    // Complete desaturation
    filters.push(`saturate(${10 - i * 10}%)`);
    // Heavy blur eliminates any spatial information
    filters.push(`blur(${40 + i * 30}px)`);
  }

  // Central scotoma - darkening toward center
  if (centralScotoma && !completeVision) {
    const i = centralScotoma.intensity;
    // Overlay handles main scotoma, filter adds overall degradation
    filters.push(`brightness(${85 - i * 25}%)`);
    filters.push(`contrast(${80 - i * 30}%)`);
    filters.push(`blur(${i * 5}px)`);
  }

  // Peripheral constriction
  if (peripheralConstriction && !completeVision) {
    const i = peripheralConstriction.intensity;
    // Overlay handles tunnel effect, filter adds overall darkening
    filters.push(`brightness(${80 - i * 30}%)`);
    filters.push(`contrast(${75 - i * 25}%)`);
  }

  // Mid-ring remnant - the only surviving vision
  if (midRingRemnant && !completeVision) {
    const i = midRingRemnant.intensity;
    // Heavy blur - even surviving ring has poor resolution
    filters.push(`blur(${15 + i * 20}px)`);
    // Severe desaturation
    filters.push(`saturate(${40 - i * 30}%)`);
    // Low contrast
    filters.push(`contrast(${60 - i * 30}%)`);
    // Dimmed brightness
    filters.push(`brightness(${70 - i * 30}%)`);
  }

  // Night blindness - dramatic darkening in low light
  if (nightBlindness && !completeVision) {
    const i = nightBlindness.intensity;
    // Far beyond normal darkness adaptation
    filters.push(`brightness(${30 - i * 25}%)`);
    filters.push(`contrast(${40 - i * 30}%)`);
    filters.push(`saturate(${20 - i * 15}%)`);
  }

  // Severe global acuity loss
  if (acuityLoss && !completeVision) {
    const i = acuityLoss.intensity;
    // Heavy Gaussian blur across entire visual field
    filters.push(`blur(${20 + i * 25}px)`);
    filters.push(`contrast(${70 - i * 35}%)`);
  }

  // Partial ring vision (for educational purposes - what minimal vision might look like)
  if (partialRing && !completeVision) {
    const i = partialRing.intensity;
    // Moderate blur for the surviving ring
    filters.push(`blur(${8 + i * 12}px)`);
    // Desaturated
    filters.push(`saturate(${50 - i * 30}%)`);
    // Low contrast
    filters.push(`contrast(${65 - i * 30}%)`);
    // Dimmed
    filters.push(`brightness(${60 - i * 25}%)`);
  }

  return filters.join(' ');
};
