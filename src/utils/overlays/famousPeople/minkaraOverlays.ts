import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Dr. Mona Minkara-specific conditions
 * (Combined Macular Degeneration + Cone-Rod Dystrophy)
 */
export const createMinkaraOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const minkaraEndStageComplete = getEffect('minkaraEndStageComplete');
  const minkaraCentralScotoma = getEffect('minkaraCentralScotoma');
  const minkaraRingScotoma = getEffect('minkaraRingScotoma');
  const minkaraPeripheralIslands = getEffect('minkaraPeripheralIslands');
  const minkaraPhotophobia = getEffect('minkaraPhotophobia');
  const minkaraAchromatopsia = getEffect('minkaraAchromatopsia');
  const minkaraNightBlindness = getEffect('minkaraNightBlindness');
  const minkaraChemistryMode = getEffect('minkaraChemistryMode');

  // Dr. Mona Minkara - End Stage Complete
  if (minkaraEndStageComplete?.enabled) {
    const intensity = minkaraEndStageComplete.intensity;

    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-central',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.95}) 15%, rgba(0,0,0,${intensity * 0.9}) 25%, rgba(0,0,0,${intensity * 0.8}) 35%, transparent 40%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-central'
    );

    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-ring',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-ring'
    );

    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-peripheral',
      `radial-gradient(circle at 10% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 10% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-peripheral'
    );

    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-photophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-photophobia'
    );
  }

  // Dr. Mona Minkara - Individual Effects
  if (minkaraCentralScotoma?.enabled) {
    const intensity = minkaraCentralScotoma.intensity;
    const scotomaSize = Math.max(35, 30 + intensity * 20);
    const blackIntensity = intensity;

    createOverlay(
      'visual-field-overlay-minkaraCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.95}) ${scotomaSize - 10}%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.8}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.5}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraCentralScotoma'
    );
  }

  if (minkaraRingScotoma?.enabled) {
    const intensity = minkaraRingScotoma.intensity;

    createOverlay(
      'visual-field-overlay-minkaraRingScotoma',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraRingScotoma'
    );
  }

  if (minkaraPeripheralIslands?.enabled) {
    const intensity = minkaraPeripheralIslands.intensity;

    createOverlay(
      'visual-field-overlay-minkaraPeripheralIslands',
      `radial-gradient(circle at 15% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 15% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPeripheralIslands'
    );
  }

  if (minkaraPhotophobia?.enabled) {
    const intensity = minkaraPhotophobia.intensity;

    createOverlay(
      'visual-field-overlay-minkaraPhotophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPhotophobia'
    );
  }

  if (minkaraAchromatopsia?.enabled) {
    const intensity = minkaraAchromatopsia.intensity;

    createOverlay(
      'visual-field-overlay-minkaraAchromatopsia',
      `linear-gradient(45deg, rgba(128,128,128,${intensity * 0.3}) 0%, rgba(128,128,128,${intensity * 0.2}) 50%, rgba(128,128,128,${intensity * 0.3}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraAchromatopsia'
    );
  }

  if (minkaraNightBlindness?.enabled) {
    const intensity = minkaraNightBlindness.intensity;

    createOverlay(
      'visual-field-overlay-minkaraNightBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity * 0.6}) 0%, rgba(0,0,0,${intensity * 0.4}) 50%, rgba(0,0,0,${intensity * 0.6}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraNightBlindness'
    );
  }

  if (minkaraChemistryMode?.enabled) {
    const intensity = minkaraChemistryMode.intensity;

    createOverlay(
      'visual-field-overlay-minkaraChemistryMode',
      `radial-gradient(circle at 20% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 20% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraChemistryMode'
    );
  }
};
