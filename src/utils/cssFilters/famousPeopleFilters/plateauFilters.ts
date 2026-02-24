import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Joseph Plateau's Solar Retinopathy
 * Key visual characteristics:
 * - Central scotoma (handled by overlay)
 * - Blur increasing toward center (overall blur for CSS)
 * - Reduced brightness/contrast globally (progressive dimming)
 * - Desaturation from retinal damage
 * Progression: Early (preserved peripheral) → Mid (dimming) → Late (near-blind) → Total
 */
export const generatePlateauFilters = (effects: VisualEffect[]): string => {
  const plateauEffects = effects.filter(e =>
    e.id.startsWith('plateau') && e.enabled
  );

  if (plateauEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'plateauComplete' && e.enabled);
  const earlyStage = effects.find(e => e.id === 'plateauEarlyStage' && e.enabled);
  const midStage = effects.find(e => e.id === 'plateauMidStage' && e.enabled);
  const lateStage = effects.find(e => e.id === 'plateauLateStage' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'plateauCentralScotoma' && e.enabled);
  const acuityLoss = effects.find(e => e.id === 'plateauAcuityLoss' && e.enabled);
  const photopsia = effects.find(e => e.id === 'plateauPhotopsia' && e.enabled);
  const globalDimming = effects.find(e => e.id === 'plateauGlobalDimming' && e.enabled);

  // Complete simulation (mid-stage representation for educational value)
  if (completeVision) {
    const i = completeVision.intensity;
    // Moderate blur representing acuity loss
    filters.push(`blur(${3 + i * 4}px)`);
    // Reduced brightness (global dimming beginning)
    filters.push(`brightness(${85 - i * 20}%)`);
    // Reduced contrast
    filters.push(`contrast(${80 - i * 15}%)`);
    // Slight desaturation from retinal damage
    filters.push(`saturate(${85 - i * 20}%)`);
  }

  // Early stage - minimal global effects, central scotoma via overlay
  if (earlyStage && !completeVision) {
    const i = earlyStage.intensity;
    // Mild blur (peripheral still relatively clear)
    filters.push(`blur(${1 + i * 2}px)`);
    // Slight brightness reduction
    filters.push(`brightness(${95 - i * 10}%)`);
    // Mild contrast loss
    filters.push(`contrast(${95 - i * 10}%)`);
  }

  // Mid stage - increasing global degradation
  if (midStage && !completeVision) {
    const i = midStage.intensity;
    // Moderate blur
    filters.push(`blur(${3 + i * 4}px)`);
    // Notable brightness reduction
    filters.push(`brightness(${80 - i * 20}%)`);
    // Significant contrast loss
    filters.push(`contrast(${75 - i * 20}%)`);
    // Color desaturation
    filters.push(`saturate(${80 - i * 25}%)`);
  }

  // Late stage - severe degradation, near-blindness
  if (lateStage && !completeVision) {
    const i = lateStage.intensity;
    // Heavy blur
    filters.push(`blur(${6 + i * 8}px)`);
    // Severe brightness reduction
    filters.push(`brightness(${50 - i * 35}%)`);
    // Very low contrast
    filters.push(`contrast(${50 - i * 35}%)`);
    // Heavy desaturation
    filters.push(`saturate(${40 - i * 30}%)`);
  }

  // Individual effect components
  if (centralScotoma && !completeVision && !earlyStage && !midStage && !lateStage) {
    // Central scotoma mainly handled by overlay, mild blur for surrounding
    const i = centralScotoma.intensity;
    filters.push(`blur(${i * 2}px)`);
  }

  if (acuityLoss && !completeVision && !earlyStage && !midStage && !lateStage) {
    const i = acuityLoss.intensity;
    filters.push(`blur(${2 + i * 5}px)`);
    filters.push(`contrast(${90 - i * 20}%)`);
  }

  if (photopsia && !completeVision && !earlyStage && !midStage && !lateStage) {
    // Photopsia creates visual artifacts - slight brightness fluctuation
    const i = photopsia.intensity;
    filters.push(`brightness(${100 + i * 15}%)`);
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (globalDimming && !completeVision && !earlyStage && !midStage && !lateStage) {
    const i = globalDimming.intensity;
    filters.push(`brightness(${100 - i * 60}%)`);
    filters.push(`contrast(${100 - i * 50}%)`);
    filters.push(`saturate(${100 - i * 40}%)`);
  }

  return filters.join(' ');
};
