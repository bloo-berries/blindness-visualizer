/**
 * Hook for generating animated overlay styles for visual effects
 * Uses a registry pattern to map effect IDs to generator functions.
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import {
  generateVisualAuraOverlay,
  generateHallucinationsOverlay,
  generateBlueFieldOverlay,
  generatePersistentPositiveOverlay,
  generatePalinopsiaOverlay,
  generateStarburstingOverlay,
  generateChristineFluctuatingOverlay,
  generateSugarRetinalDetachmentOverlay,
  generateStephenKeratoconusOverlay,
  generateHeatherLightPerceptionOverlay,
  generateDaredevilRadarSenseOverlay,
  generateGeordiVisorSenseOverlay,
  generateBlindspotSonarSenseOverlay,
  generateKenshiTelekineticSenseOverlay,
  generateTophSeismicSenseOverlay,
  generateAnselmoOcularMyastheniaOverlay,
  generateMargaritaLightPerceptionOverlay,
  generateFujitoraObservationHakiOverlay,
  generateChirrutForcePerceptionOverlay,
  generateJuliaCarpenterPsychicWebOverlay,
} from './animatedOverlays';

type OverlayGenerator = (intensity: number, now: number) => React.CSSProperties;

/**
 * Registry mapping effect IDs to their overlay generator functions.
 * Visual aura variants use a wrapper that passes the effect ID.
 * Grouped effects (e.g. Sugar Ray, Anselmo) map multiple IDs to the same generator.
 */
const EFFECT_GENERATORS: Record<string, OverlayGenerator> = {
  // Visual aura — needs effect ID passed through
  visualAura: (intensity, now) => generateVisualAuraOverlay('visualAura', intensity, now),
  visualAuraLeft: (intensity, now) => generateVisualAuraOverlay('visualAuraLeft', intensity, now),
  visualAuraRight: (intensity, now) => generateVisualAuraOverlay('visualAuraRight', intensity, now),
  // Standard animated effects
  hallucinations: generateHallucinationsOverlay,
  blueFieldPhenomena: generateBlueFieldOverlay,
  persistentPositiveVisualPhenomenon: generatePersistentPositiveOverlay,
  palinopsia: generatePalinopsiaOverlay,
  starbursting: generateStarburstingOverlay,
  // Person-specific effects
  christineFluctuatingVision: generateChristineFluctuatingOverlay,
  sugarRetinalDetachmentComplete: generateSugarRetinalDetachmentOverlay,
  sugarPeripheralFlashes: generateSugarRetinalDetachmentOverlay,
  stephenKeratoconusComplete: generateStephenKeratoconusOverlay,
  heatherLightPerceptionComplete: generateHeatherLightPerceptionOverlay,
  daredevilRadarSenseComplete: generateDaredevilRadarSenseOverlay,
  geordiVisorSenseComplete: generateGeordiVisorSenseOverlay,
  blindspotSonarSenseComplete: generateBlindspotSonarSenseOverlay,
  kenshiTelekineticSenseComplete: generateKenshiTelekineticSenseOverlay,
  tophSeismicSenseComplete: generateTophSeismicSenseOverlay,
  anselmoOcularMyastheniaComplete: generateAnselmoOcularMyastheniaOverlay,
  anselmoOcularMyastheniaPtosis: generateAnselmoOcularMyastheniaOverlay,
  anselmoOcularMyastheniaPhotophobia: generateAnselmoOcularMyastheniaOverlay,
  margaritaLightPerceptionComplete: generateMargaritaLightPerceptionOverlay,
  fujitoraObservationHakiComplete: generateFujitoraObservationHakiOverlay,
  chirrutForcePerceptionComplete: generateChirrutForcePerceptionOverlay,
  juliaCarpenterPsychicWebComplete: generateJuliaCarpenterPsychicWebOverlay,
};

/**
 * Effects that require animation updates (Set for O(1) lookup)
 */
export const ANIMATED_EFFECTS: ReadonlySet<string> = new Set([
  ...Object.keys(EFFECT_GENERATORS),
  // Note: Visual snow variants use CSS @keyframes animations, not JS-driven animation ticks.
  // They are handled by DOM-based overlays in visualDisturbanceOverlays/visualSnowOverlays.ts
  'visualFloaters',
  // Neo Matrix Code Vision uses a canvas-based renderer, not a CSS overlay generator
  'neoMatrixCodeVisionComplete',
]);

/**
 * Hook that generates animated overlay styles for visual effects
 */
export const useAnimatedOverlay = (effects: VisualEffect[], now: number): React.CSSProperties | null => {
  return useMemo(() => {
    const activeEffect = effects.find(e => e.enabled && EFFECT_GENERATORS[e.id]);
    if (!activeEffect) return null;
    return EFFECT_GENERATORS[activeEffect.id](activeEffect.intensity, now);
  }, [effects, now]);
};
