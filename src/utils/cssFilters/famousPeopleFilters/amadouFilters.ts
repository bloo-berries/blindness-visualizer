import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Amadou Bagayoko's Congenital Cataract Progression
 * Four phases based on intensity:
 * 0-25%: Phase 1 (childhood haze) - milky overlay, soft blur, warm shift
 * 26-50%: Phase 2 (fog thickens) - heavy milky, strong blur, sepia cast
 * 51-75%: Phase 3 (light perception) - near white-out, minimal detail
 * 76-100%: Phase 4 (total blindness) - complete darkness
 */
export const generateAmadouFilters = (effects: VisualEffect[]): string => {
  const amadouEffects = effects.filter(e =>
    e.id.startsWith('amadou') && e.enabled
  );

  if (amadouEffects.length === 0) return '';

  const filters: string[] = [];

  const cataractProgression = effects.find(e => e.id === 'amadouCataractProgression' && e.enabled);
  const phase1 = effects.find(e => e.id === 'amadouPhase1' && e.enabled);
  const phase2 = effects.find(e => e.id === 'amadouPhase2' && e.enabled);
  const phase3 = effects.find(e => e.id === 'amadouPhase3' && e.enabled);
  const phase4 = effects.find(e => e.id === 'amadouPhase4' && e.enabled);

  // Complete progression - intensity controls which phase
  if (cataractProgression) {
    const i = cataractProgression.intensity;

    if (i <= 0.25) {
      // Phase 1: Childhood haze (ages 5-8)
      const phaseI = i * 4; // 0-1 within phase
      filters.push(`blur(${8 + phaseI * 4}px)`); // 8-12px blur
      filters.push(`sepia(${30 + phaseI * 15}%)`); // Warm yellow-brown shift
      filters.push(`saturate(${70 - phaseI * 20}%)`); // Muted colors
      filters.push(`contrast(${90 - phaseI * 15}%)`); // Reduced contrast
      filters.push(`brightness(${100 + phaseI * 8}%)`); // Slight brightness from scatter
    } else if (i <= 0.5) {
      // Phase 2: Fog thickens (ages 10-13)
      const phaseI = (i - 0.25) * 4; // 0-1 within phase
      filters.push(`blur(${12 + phaseI * 13}px)`); // 12-25px blur
      filters.push(`sepia(${45 + phaseI * 20}%)`); // Stronger brown cast
      filters.push(`saturate(${50 - phaseI * 25}%)`); // Further desaturation
      filters.push(`contrast(${75 - phaseI * 25}%)`); // Lower contrast
      filters.push(`brightness(${108 + phaseI * 15}%)`); // Brighter from scatter
    } else if (i <= 0.75) {
      // Phase 3: Light perception only (ages 14-16)
      const phaseI = (i - 0.5) * 4; // 0-1 within phase
      filters.push(`blur(${25 + phaseI * 25}px)`); // 25-50px blur
      filters.push(`sepia(${65 + phaseI * 20}%)`); // Strong sepia
      filters.push(`saturate(${25 - phaseI * 20}%)`); // Nearly monochrome
      filters.push(`contrast(${50 - phaseI * 35}%)`); // Very low contrast
      filters.push(`brightness(${123 + phaseI * 40}%)`); // Wash toward white
    } else {
      // Phase 4: Total blindness (age 16+)
      const phaseI = (i - 0.75) * 4; // 0-1 within phase
      // Transition from washed-out white to total black
      filters.push(`brightness(${163 - phaseI * 163}%)`); // 163% to 0%
      filters.push(`contrast(${15 - phaseI * 15}%)`); // Minimal to zero
      filters.push(`saturate(0%)`); // No color
      filters.push(`blur(${50 - phaseI * 30}px)`); // Blur decreases as darkness takes over
    }
  }

  // Individual phase effects
  if (phase1 && !cataractProgression) {
    const i = phase1.intensity;
    filters.push(`blur(${8 + i * 4}px)`);
    filters.push(`sepia(${30 + i * 15}%)`);
    filters.push(`saturate(${70 - i * 20}%)`);
    filters.push(`contrast(${90 - i * 15}%)`);
    filters.push(`brightness(${100 + i * 8}%)`);
  }

  if (phase2 && !cataractProgression) {
    const i = phase2.intensity;
    filters.push(`blur(${12 + i * 13}px)`);
    filters.push(`sepia(${45 + i * 20}%)`);
    filters.push(`saturate(${50 - i * 25}%)`);
    filters.push(`contrast(${75 - i * 25}%)`);
    filters.push(`brightness(${108 + i * 15}%)`);
  }

  if (phase3 && !cataractProgression) {
    const i = phase3.intensity;
    filters.push(`blur(${25 + i * 25}px)`);
    filters.push(`sepia(${65 + i * 20}%)`);
    filters.push(`saturate(${25 - i * 20}%)`);
    filters.push(`contrast(${50 - i * 35}%)`);
    filters.push(`brightness(${123 + i * 40}%)`);
  }

  if (phase4 && !cataractProgression) {
    const i = phase4.intensity;
    // Total blackness
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  return filters.join(' ');
};
