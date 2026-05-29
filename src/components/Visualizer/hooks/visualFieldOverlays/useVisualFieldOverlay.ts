/**
 * Hook for generating visual field overlay styles
 * Handles static visual field effects like Retinitis Pigmentosa, Stargardt, AMD, etc.
 */
import { useMemo } from 'react';
import { VisualEffect } from '../../../../types/visualEffects';
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
  quadrantanopiaLeft: (i) => generateQuadrantanopiaOverlay('left', i),
  quadrantanopiaRight: (i) => generateQuadrantanopiaOverlay('right', i),
  quadrantanopiaInferiorLeft: (i) => generateQuadrantanopiaOverlay('inferiorLeft', i),
  quadrantanopiaInferiorRight: (i) => generateQuadrantanopiaOverlay('inferiorRight', i),
  quadrantanopiaSuperiorLeft: (i) => generateQuadrantanopiaOverlay('superiorLeft', i),
  quadrantanopiaSuperiorRight: (i) => generateQuadrantanopiaOverlay('superiorRight', i),
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
 * Hook that generates overlay styles for visual field effects.
 * Returns an array of CSS styles — one for each enabled visual field effect —
 * so that multiple conditions can be rendered simultaneously.
 */
export const useVisualFieldOverlay = (effects: VisualEffect[]): React.CSSProperties[] => {
  return useMemo(() => {
    const overlays: React.CSSProperties[] = [];

    // Track which multi-ID groups have already been matched
    const matchedMultiGroups = new Set<number>();

    for (const effect of effects) {
      if (!effect.enabled) continue;

      // Check single-ID generators
      const singleGen = SINGLE_ID_GENERATORS[effect.id];
      if (singleGen) {
        overlays.push(singleGen(effect.intensity));
        continue;
      }

      // Check multi-ID generators
      for (let gi = 0; gi < MULTI_ID_GENERATORS.length; gi++) {
        if (matchedMultiGroups.has(gi)) continue;
        const group = MULTI_ID_GENERATORS[gi];
        if (group.ids.includes(effect.id)) {
          overlays.push(group.generator(effect.intensity));
          matchedMultiGroups.add(gi);
          break;
        }
      }
    }

    return overlays;
  }, [effects]);
};
