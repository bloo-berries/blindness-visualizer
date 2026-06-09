/**
 * Hook for generating visual field overlay styles
 * Handles static visual field effects like Retinitis Pigmentosa, Stargardt, AMD, etc.
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../../types/visualEffects';
import { isVisualFieldLossCondition, isVisualDisturbanceCondition } from '../../../../utils/overlayConstants';
import {
  generateRetinitisPigmentosaOverlay,
  generateStargardtOverlay,
  generateAmdOverlay,
  generateDiabeticRetinopathyOverlay,
  generateGlaucomaOverlay,
  generateTunnelVisionOverlay,
  generateHemianopiaLeftOverlay,
  generateHemianopiaRightOverlay,
  generateScotomaOverlay,
  generateBlindnessLeftEyeOverlay,
  generateBlindnessRightEyeOverlay,
  generateRetinalDetachmentOverlay,
  generateBitemporalHemianopiaOverlay,
  generateQuadrantanopiaOverlay,
  generateAstigmatismOverlay,
  generateVisualFloatersOverlays,
  generateVisualSnowOverlays,
  generateVisualSnowFlashingOverlays,
  generateVisualSnowColoredOverlays,
  generateVisualSnowTransparentOverlays,
  generateVisualSnowDenseOverlays,
} from './standardOverlays';
import {
  generateJoseCidMonocularOverlay,
  generateJudiAMDCompleteOverlay,
  generatePlateauSolarRetinopathyOverlay,
  generateEulerAsymmetricOverlay,
  generateNemethDualAttackOverlay,
} from './personOverlays';

/** Map of effect IDs to their overlay generator functions */
type OverlayGenerator = (intensity: number) => React.CSSProperties;

const SINGLE_ID_GENERATORS: Record<string, OverlayGenerator> = {
  retinitisPigmentosa: generateRetinitisPigmentosaOverlay,
  stargardt: generateStargardtOverlay,
  amd: generateAmdOverlay,
  judiAMDComplete: generateJudiAMDCompleteOverlay,
  diabeticRetinopathy: generateDiabeticRetinopathyOverlay,
  glaucoma: generateGlaucomaOverlay,
  tunnelVision: generateTunnelVisionOverlay,
  hemianopiaLeft: generateHemianopiaLeftOverlay,
  hemianopiaRight: generateHemianopiaRightOverlay,
  bitemporalHemianopia: generateBitemporalHemianopiaOverlay,
  scotoma: generateScotomaOverlay,
  blindnessLeftEye: generateBlindnessLeftEyeOverlay,
  blindnessRightEye: generateBlindnessRightEyeOverlay,
  joseCidMonocularVision: generateJoseCidMonocularOverlay,
  retinalDetachment: generateRetinalDetachmentOverlay,
  astigmatism: generateAstigmatismOverlay,
  quadrantanopiaLeft: (i) => generateQuadrantanopiaOverlay('left', i),
  quadrantanopiaRight: (i) => generateQuadrantanopiaOverlay('right', i),
  quadrantanopiaInferiorLeft: (i) => generateQuadrantanopiaOverlay('inferiorLeft', i),
  quadrantanopiaInferiorRight: (i) => generateQuadrantanopiaOverlay('inferiorRight', i),
  quadrantanopiaSuperiorLeft: (i) => generateQuadrantanopiaOverlay('superiorLeft', i),
  quadrantanopiaSuperiorRight: (i) => generateQuadrantanopiaOverlay('superiorRight', i),
};

/** Generators that return multiple overlay layers */
type MultiLayerGenerator = (intensity: number) => React.CSSProperties[];

const MULTI_LAYER_GENERATORS: Record<string, MultiLayerGenerator> = {
  visualFloaters: generateVisualFloatersOverlays,
  visualSnow: generateVisualSnowOverlays,
  visualSnowFlashing: generateVisualSnowFlashingOverlays,
  visualSnowColored: generateVisualSnowColoredOverlays,
  visualSnowTransparent: generateVisualSnowTransparentOverlays,
  visualSnowDense: generateVisualSnowDenseOverlays,
};

/** Multi-ID effect groups (first matching ID triggers the generator) */
const MULTI_ID_GENERATORS: Array<{ ids: string[]; generator: OverlayGenerator }> = [
  {
    ids: ['plateauComplete', 'plateauCentralScotoma', 'plateauEarlyStage', 'plateauMidStage', 'plateauLateStage'],
    generator: generatePlateauSolarRetinopathyOverlay,
  },
  {
    ids: ['eulerComplete', 'eulerRightEyeBlind', 'eulerLeftEyeCataract', 'eulerEarlyStage', 'eulerMidStage', 'eulerLateStage'],
    generator: generateEulerAsymmetricOverlay,
  },
  {
    ids: ['nemethComplete', 'nemethCentralScotoma', 'nemethPeripheralConstriction', 'nemethMidRingRemnant', 'nemethPartialRing'],
    generator: generateNemethDualAttackOverlay,
  },
];

/**
 * Z-index tiers for overlay stacking order (bottom to top):
 *   1. Refractive errors / base conditions (9000)
 *   2. Visual field loss (9500)
 *   3. Visual disturbances — snow, floaters (9800)
 *
 * Visual field loss overlays (dark regions) must render on top of refractive
 * error overlays (blur/distortion) so that field loss boundaries stay crisp.
 */
const Z_REFRACTIVE = 9000;
const Z_VISUAL_FIELD_LOSS = 9500;
const Z_VISUAL_DISTURBANCE = 9800;

function getOverlayZIndex(effectId: string): number {
  if (isVisualDisturbanceCondition(effectId)) return Z_VISUAL_DISTURBANCE;
  if (isVisualFieldLossCondition(effectId)) return Z_VISUAL_FIELD_LOSS;
  return Z_REFRACTIVE;
}

/**
 * Hook that generates overlay styles for visual field effects.
 * Returns an array of CSS styles — one for each enabled visual field effect —
 * so that multiple conditions can be rendered simultaneously.
 *
 * Overlays are sorted by z-index tier so that refractive errors render behind
 * visual field loss overlays regardless of the order effects are toggled on.
 */
export const useVisualFieldOverlay = (effects: VisualEffect[]): React.CSSProperties[] => {
  return useMemo(() => {
    const overlays: Array<{ style: React.CSSProperties; z: number }> = [];

    // Track which multi-ID groups have already been matched
    const matchedMultiGroups = new Set<number>();

    for (const effect of effects) {
      if (!effect.enabled) continue;

      const z = getOverlayZIndex(effect.id);

      // Check multi-layer generators (visual snow, floaters)
      const multiLayerGen = MULTI_LAYER_GENERATORS[effect.id];
      if (multiLayerGen) {
        for (const style of multiLayerGen(effect.intensity)) {
          overlays.push({ style: { ...style, zIndex: z }, z });
        }
        continue;
      }

      // Check single-ID generators
      const singleGen = SINGLE_ID_GENERATORS[effect.id];
      if (singleGen) {
        const style = singleGen(effect.intensity);
        overlays.push({ style: { ...style, zIndex: z }, z });
        continue;
      }

      // Check multi-ID generators
      for (let gi = 0; gi < MULTI_ID_GENERATORS.length; gi++) {
        if (matchedMultiGroups.has(gi)) continue;
        const group = MULTI_ID_GENERATORS[gi];
        if (group.ids.includes(effect.id)) {
          const style = group.generator(effect.intensity);
          overlays.push({ style: { ...style, zIndex: z }, z });
          matchedMultiGroups.add(gi);
          break;
        }
      }
    }

    // Sort by z-index so lower tiers render first (behind higher tiers)
    overlays.sort((a, b) => a.z - b.z);

    return overlays.map(o => o.style);
  }, [effects]);
};
