import { VisualEffect } from '../../types/visualEffects';

/**
 * Generates CSS filters for Visual Snow effects
 */
export const generateVisualSnowFilters = (effects: VisualEffect[]): string => {
  const visualSnowEffect = effects.find(e => e.id === 'visualSnow' && e.enabled);

  if (!visualSnowEffect) return '';

  // Visual Snow cannot be effectively simulated with CSS filters alone
  // It requires overlay effects for the static noise pattern
  // For YouTube content, we'll apply a subtle brightness/contrast adjustment
  // to simulate the visual interference, but the main effect should be handled by overlays

  const intensity = visualSnowEffect.intensity;

  // Subtle visual interference effects
  const filters: string[] = [];

  // Slight brightness variation to simulate visual noise
  filters.push(`brightness(${100 + intensity * 5}%)`);

  // Slight contrast reduction to simulate visual interference
  filters.push(`contrast(${100 - intensity * 3}%)`);

  return filters.join(' ');
};

/**
 * Generates CSS filters for new symptoms from specialty.vision
 */
export const generateSymptomFilters = (effects: VisualEffect[]): string => {
  const symptomEffects = effects.filter(e =>
    (e.id === 'blueFieldPhenomena' || e.id === 'glare' ||
     e.id === 'blurryVision' || e.id === 'nightBlindness' || e.id === 'halos' ||
     e.id === 'persistentPositiveVisualPhenomenon' || e.id === 'palinopsia' ||
     e.id === 'trails' || e.id === 'lossOfContrast' || e.id === 'starbursting' ||
     e.id === 'vitreousHemorrhage') && e.enabled
  );

  if (symptomEffects.length === 0) return '';

  const filters: string[] = [];

  const vitreousHemorrhage = effects.find(e => e.id === 'vitreousHemorrhage' && e.enabled);
  const glare = effects.find(e => e.id === 'glare' && e.enabled);
  const blurryVision = effects.find(e => e.id === 'blurryVision' && e.enabled);
  const nightBlindness = effects.find(e => e.id === 'nightBlindness' && e.enabled);
  const halos = effects.find(e => e.id === 'halos' && e.enabled);
  const lossOfContrast = effects.find(e => e.id === 'lossOfContrast' && e.enabled);
  const starbursting = effects.find(e => e.id === 'starbursting' && e.enabled);

  // Vitreous Hemorrhage - strong red tint from blood in vitreous humor
  if (vitreousHemorrhage) {
    const intensity = vitreousHemorrhage.intensity;
    // Apply strong red tint using sepia + hue-rotate combination
    filters.push(`sepia(${50 + intensity * 40}%)`); // 50-90% sepia for strong warm base
    filters.push(`hue-rotate(-25deg)`); // Stronger shift toward blood red
    filters.push(`saturate(${120 + intensity * 80}%)`); // 120-200% saturation boost
    filters.push(`brightness(${100 - intensity * 20}%)`); // Darkening from blood
    filters.push(`contrast(${100 - intensity * 15}%)`); // Contrast reduction
  }

  if (glare) {
    // Excessive brightness and reduced contrast
    filters.push(`brightness(${100 + glare.intensity * 30}%)`);
    filters.push(`contrast(${100 - glare.intensity * 40}%)`);
    filters.push(`saturate(${100 - glare.intensity * 20}%)`);
  }

  if (blurryVision) {
    // General blur effect
    filters.push(`blur(${blurryVision.intensity * 12}px)`);
    filters.push(`contrast(${100 - blurryVision.intensity * 25}%)`);
  }

  if (nightBlindness) {
    // Darken the image significantly
    filters.push(`brightness(${100 - nightBlindness.intensity * 60}%)`);
    filters.push(`contrast(${100 - nightBlindness.intensity * 30}%)`);
  }

  if (halos) {
    // Brighten and add slight blur for halo effect
    filters.push(`brightness(${100 + halos.intensity * 20}%)`);
    filters.push(`blur(${halos.intensity * 1}px)`);
  }

  if (lossOfContrast) {
    // Reduce contrast significantly
    filters.push(`contrast(${100 - lossOfContrast.intensity * 50}%)`);
    filters.push(`brightness(${100 - lossOfContrast.intensity * 20}%)`);
  }

  if (starbursting) {
    // Intensified starburst effect with enhanced brightness and blur
    filters.push(`brightness(${100 + starbursting.intensity * 40}%)`);
    filters.push(`blur(${starbursting.intensity * 1.5}px)`);
    filters.push(`contrast(${100 + starbursting.intensity * 20}%)`);
  }

  return filters.join(' ');
};
