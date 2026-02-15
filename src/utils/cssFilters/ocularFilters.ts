import { VisualEffect } from '../../types/visualEffects';

/**
 * Generates CSS filters for cataracts (Nuclear Sclerotic Cataract)
 */
export const generateCataractsFilter = (effects: VisualEffect[]): string => {
  const cataracts = effects.find(e => e.id === 'cataracts' && e.enabled);

  if (!cataracts) return '';

  const filters: string[] = [];
  const intensity = cataracts.intensity;

  // Nuclear Sclerotic Cataract effects:
  // - Progressive blurring
  // - Dimming of vision (reduced brightness)
  // - Loss of color vibrancy, especially blue perception
  // - Progressive yellowing (sepia effect)
  // - Reduced contrast

  filters.push(`brightness(${100 + intensity * 15}%)`); // Slight brightness increase from light scatter
  filters.push(`contrast(${100 - intensity * 30}%)`); // Reduced contrast
  filters.push(`sepia(${intensity * 80}%)`); // Yellowing effect (affects blue color perception)
  filters.push(`blur(${intensity * 3}px)`); // Progressive blurring
  filters.push(`hue-rotate(${intensity * 20}deg)`); // Color shift affecting cool colors
  filters.push(`saturate(${100 + intensity * 20}%)`); // Slight saturation increase for warm tones

  return filters.join(' ');
};

/**
 * Generates CSS filters for new ocular diseases from specialty.vision
 */
export const generateOcularDiseaseFilters = (effects: VisualEffect[]): string => {
  const ocularEffects = effects.filter(e =>
    (e.id === 'keratoconus' || e.id === 'dryEye' || e.id === 'vitreousHemorrhage' ||
     e.id === 'retinalDetachment' || e.id === 'posteriorSubcapsularCataract' ||
     e.id === 'corticalCataract') && e.enabled
  );

  if (ocularEffects.length === 0) return '';

  const filters: string[] = [];

  const keratoconus = effects.find(e => e.id === 'keratoconus' && e.enabled);
  const dryEye = effects.find(e => e.id === 'dryEye' && e.enabled);
  const vitreousHemorrhage = effects.find(e => e.id === 'vitreousHemorrhage' && e.enabled);
  const retinalDetachment = effects.find(e => e.id === 'retinalDetachment' && e.enabled);
  const posteriorSubcapsularCataract = effects.find(e => e.id === 'posteriorSubcapsularCataract' && e.enabled);
  const corticalCataract = effects.find(e => e.id === 'corticalCataract' && e.enabled);

  if (keratoconus) {
    // Irregular astigmatism and distortion
    filters.push(`blur(${keratoconus.intensity * 8}px)`);
    filters.push(`brightness(${100 - keratoconus.intensity * 20}%)`);
    filters.push(`contrast(${100 - keratoconus.intensity * 30}%)`);
    // Add slight hue rotation for color distortion
    filters.push(`hue-rotate(${keratoconus.intensity * 5}deg)`);
  }

  if (dryEye) {
    // Intermittent blurring and fluctuating vision
    filters.push(`blur(${dryEye.intensity * 3}px)`);
    filters.push(`brightness(${100 - dryEye.intensity * 15}%)`);
    filters.push(`contrast(${100 - dryEye.intensity * 20}%)`);
    // Add slight desaturation for the gritty sensation
    filters.push(`saturate(${100 - dryEye.intensity * 25}%)`);
  }

  if (vitreousHemorrhage) {
    // Vitreous Hemorrhage - Blood in vitreous humor
    // CSS filters provide: haze/fog (blur), dimming, and contrast reduction
    // The red tint and floaters come from the overlay layer
    const intensity = vitreousHemorrhage.intensity;
    // Haze/fog effect - diffuse blood scatters light (reduced by 30% total)
    filters.push(`blur(${intensity * 4.32}px)`); // Reduced by 10% from 4.8px
    filters.push(`brightness(${100 - intensity * 40}%)`); // Dimming from blood (reduced for better visibility)
    filters.push(`contrast(${100 - intensity * 35}%)`); // Contrast reduction (reduced for better visibility)
    // Add slight saturation reduction to enhance haze effect
    filters.push(`saturate(${100 - intensity * 10}%)`);
    // NO sepia or hue-rotate - these create yellow/brown tint that conflicts with red overlay
    // The red tint is provided entirely by the overlay layer
  }

  if (retinalDetachment) {
    // Curtain-like shadow effect with margin distortion (metamorphopsia)
    filters.push(`brightness(${100 - retinalDetachment.intensity * 50}%)`);
    filters.push(`contrast(${100 - retinalDetachment.intensity * 40}%)`);
    // Add slight blur for margin distortion (metamorphopsia)
    filters.push(`blur(${retinalDetachment.intensity * 3}px)`);
    // Add slight hue rotation for color distortion at margins
    filters.push(`hue-rotate(${retinalDetachment.intensity * 2}deg)`);
  }

  if (posteriorSubcapsularCataract) {
    // Severe glare and halos effect
    filters.push(`brightness(${100 + posteriorSubcapsularCataract.intensity * 25}%)`);
    filters.push(`contrast(${100 - posteriorSubcapsularCataract.intensity * 30}%)`);
    filters.push(`blur(${posteriorSubcapsularCataract.intensity * 3}px)`);
    // Add slight desaturation for glare effect
    filters.push(`saturate(${100 - posteriorSubcapsularCataract.intensity * 20}%)`);
  }

  if (corticalCataract) {
    // Cortical cataract - wedge-shaped opacities cause light scatter and glare
    // Less yellowing than nuclear, more radial streaking/glare
    const intensity = corticalCataract.intensity;
    filters.push(`brightness(${100 + intensity * 15}%)`); // Light scatter
    filters.push(`contrast(${100 - intensity * 25}%)`); // Contrast reduction
    filters.push(`blur(${intensity * 2}px)`); // Mild blur from spoke opacities
    filters.push(`saturate(${100 - intensity * 15}%)`); // Slight desaturation
    // Less sepia than nuclear cataract (cortical doesn't yellow as much)
    filters.push(`sepia(${intensity * 20}%)`);
  }

  return filters.join(' ');
};
