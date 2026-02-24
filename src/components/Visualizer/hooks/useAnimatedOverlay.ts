/**
 * Hook for generating animated overlay styles for visual effects
 * Handles Visual Aura, CBS Hallucinations, Blue Field, PPVP, Palinopsia, Starbursting,
 * and person-specific effects (Christine Ha, Sugar Ray Leonard, Stephen Curry)
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
} from './animatedOverlays';

/**
 * Effects that require animation updates
 */
export const ANIMATED_EFFECTS = [
  // Visual aura effects
  'visualAura', 'visualAuraLeft', 'visualAuraRight',
  // Visual snow variants
  'visualSnow', 'visualSnowFlashing', 'visualSnowColored', 'visualSnowTransparent', 'visualSnowDense',
  // Other animated effects
  'hallucinations', 'visualFloaters', 'blueFieldPhenomena',
  'persistentPositiveVisualPhenomenon', 'palinopsia', 'starbursting',
  // Person-specific animated effects
  'christineFluctuatingVision', 'sugarRetinalDetachmentComplete', 'sugarPeripheralFlashes', 'stephenKeratoconusComplete',
  'heatherLightPerceptionComplete', 'daredevilRadarSenseComplete', 'geordiVisorSenseComplete', 'blindspotSonarSenseComplete',
  'kenshiTelekineticSenseComplete', 'tophSeismicSenseComplete'
];

/**
 * Hook that generates animated overlay styles for visual effects
 */
export const useAnimatedOverlay = (effects: VisualEffect[], now: number): React.CSSProperties | null => {
  return useMemo(() => {
    // Check for visual aura variants
    const auraEffect = effects.find(e =>
      (e.id === 'visualAura' || e.id === 'visualAuraLeft' || e.id === 'visualAuraRight') && e.enabled
    );

    if (auraEffect) {
      return generateVisualAuraOverlay(auraEffect.id, auraEffect.intensity, now);
    }

    // Check for CBS Hallucinations
    const hallucinationsEffect = effects.find(e => e.id === 'hallucinations' && e.enabled);
    if (hallucinationsEffect) {
      return generateHallucinationsOverlay(hallucinationsEffect.intensity, now);
    }

    // Check for Blue Field Entoptic Phenomenon
    const blueFieldEffect = effects.find(e => e.id === 'blueFieldPhenomena' && e.enabled);
    if (blueFieldEffect) {
      return generateBlueFieldOverlay(blueFieldEffect.intensity, now);
    }

    // Check for Persistent Positive Visual Phenomenon
    const ppvpEffect = effects.find(e => e.id === 'persistentPositiveVisualPhenomenon' && e.enabled);
    if (ppvpEffect) {
      return generatePersistentPositiveOverlay(ppvpEffect.intensity, now);
    }

    // Check for Palinopsia
    const palinopsiaEffect = effects.find(e => e.id === 'palinopsia' && e.enabled);
    if (palinopsiaEffect) {
      return generatePalinopsiaOverlay(palinopsiaEffect.intensity, now);
    }

    // Check for Starbursting
    const starburstingEffect = effects.find(e => e.id === 'starbursting' && e.enabled);
    if (starburstingEffect) {
      return generateStarburstingOverlay(starburstingEffect.intensity, now);
    }

    // Check for Christine Ha's Fluctuating Vision (NMO)
    const christineFluctuatingEffect = effects.find(e => e.id === 'christineFluctuatingVision' && e.enabled);
    if (christineFluctuatingEffect) {
      return generateChristineFluctuatingOverlay(christineFluctuatingEffect.intensity, now);
    }

    // Check for Sugar Ray Leonard's Retinal Detachment (peripheral flashes + drifting floaters)
    const sugarRetinalEffect = effects.find(e =>
      (e.id === 'sugarRetinalDetachmentComplete' || e.id === 'sugarPeripheralFlashes') && e.enabled
    );
    if (sugarRetinalEffect) {
      return generateSugarRetinalDetachmentOverlay(sugarRetinalEffect.intensity, now);
    }

    // Check for Stephen Curry's Keratoconus (drifting ghosts, light streaks, waviness)
    const stephenKeratoconusEffect = effects.find(e => e.id === 'stephenKeratoconusComplete' && e.enabled);
    if (stephenKeratoconusEffect) {
      return generateStephenKeratoconusOverlay(stephenKeratoconusEffect.intensity, now);
    }

    // Check for Heather Hutchison's Light Perception (nystagmus, diffuse light blobs)
    const heatherLPEffect = effects.find(e => e.id === 'heatherLightPerceptionComplete' && e.enabled);
    if (heatherLPEffect) {
      return generateHeatherLightPerceptionOverlay(heatherLPEffect.intensity, now);
    }

    // Check for Daredevil's Radar Sense (red monochrome, edge detection, pulsing)
    const daredevilEffect = effects.find(e => e.id === 'daredevilRadarSenseComplete' && e.enabled);
    if (daredevilEffect) {
      return generateDaredevilRadarSenseOverlay(daredevilEffect.intensity, now);
    }

    // Check for Geordi La Forge's VISOR Sense (EM spectrum, thermal, scan lines)
    const geordiEffect = effects.find(e => e.id === 'geordiVisorSenseComplete' && e.enabled);
    if (geordiEffect) {
      return generateGeordiVisorSenseOverlay(geordiEffect.intensity, now);
    }

    // Check for Blindspot's Sonar Sense (echolocation, ping sweeps, depth mapping)
    const blindspotEffect = effects.find(e => e.id === 'blindspotSonarSenseComplete' && e.enabled);
    if (blindspotEffect) {
      return generateBlindspotSonarSenseOverlay(blindspotEffect.intensity, now);
    }

    // Check for Kenshi's Telekinetic Sense (psychic perception, soul detection, spirit realm)
    const kenshiEffect = effects.find(e => e.id === 'kenshiTelekineticSenseComplete' && e.enabled);
    if (kenshiEffect) {
      return generateKenshiTelekineticSenseOverlay(kenshiEffect.intensity, now);
    }

    // Check for Toph Beifong's Seismic Sense (earthbending vision, ground vibrations)
    const tophEffect = effects.find(e => e.id === 'tophSeismicSenseComplete' && e.enabled);
    if (tophEffect) {
      return generateTophSeismicSenseOverlay(tophEffect.intensity, now);
    }

    return null;
  }, [effects, now]);
};
