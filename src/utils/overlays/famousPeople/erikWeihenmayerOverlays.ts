import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Erik Weihenmayer-specific conditions (Retinoschisis)
 */
export const createErikWeihenmayerOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const erikRetinoschisisIslands = getEffect('erikRetinoschisisIslands');
  const erikIslandFragmentation = getEffect('erikIslandFragmentation');
  const erikProgressiveLoss = getEffect('erikProgressiveLoss');
  const erikCompleteBlindness = getEffect('erikCompleteBlindness');
  const erikScanningBehavior = getEffect('erikScanningBehavior');
  const erikCognitiveLoad = getEffect('erikCognitiveLoad');

  // Erik Weihenmayer - Retinoschisis Islands
  if (erikRetinoschisisIslands?.enabled) {
    const intensity = erikRetinoschisisIslands.intensity;

    createOverlay(
      'visual-field-overlay-erikIsland1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(15% 10%, 35% 8%, 40% 25%, 25% 30%, 10% 20%)',
      'erikIsland1'
    );

    createOverlay(
      'visual-field-overlay-erikIsland2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(65% 40%, 85% 35%, 90% 55%, 75% 65%, 60% 50%)',
      'erikIsland2'
    );

    createOverlay(
      'visual-field-overlay-erikIsland3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(20% 70%, 45% 65%, 50% 85%, 30% 90%, 15% 80%)',
      'erikIsland3'
    );
  }

  // Erik Weihenmayer - Island Fragmentation
  if (erikIslandFragmentation?.enabled) {
    const intensity = erikIslandFragmentation.intensity;

    createOverlay(
      'visual-field-overlay-erikFragment1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(70% 15%, 80% 12%, 85% 25%, 75% 28%, 65% 20%)',
      'erikFragment1'
    );

    createOverlay(
      'visual-field-overlay-erikFragment2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(45% 45%, 55% 42%, 60% 55%, 50% 58%, 40% 50%)',
      'erikFragment2'
    );

    createOverlay(
      'visual-field-overlay-erikFragment3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(75% 75%, 90% 70%, 95% 85%, 80% 88%, 70% 80%)',
      'erikFragment3'
    );
  }

  // Erik Weihenmayer - Progressive Loss
  if (erikProgressiveLoss?.enabled) {
    const intensity = erikProgressiveLoss.intensity;

    createOverlay(
      'visual-field-overlay-erikProgressive1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(40% 20%, 60% 18%, 65% 35%, 45% 38%, 35% 25%)',
      'erikProgressive1'
    );

    createOverlay(
      'visual-field-overlay-erikProgressive2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(35% 60%, 55% 58%, 60% 75%, 40% 78%, 30% 65%)',
      'erikProgressive2'
    );
  }

  // Erik Weihenmayer - Complete Blindness
  if (erikCompleteBlindness?.enabled) {
    const intensity = erikCompleteBlindness.intensity;

    createOverlay(
      'visual-field-overlay-erikCompleteBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCompleteBlindness'
    );
  }

  // Erik Weihenmayer - Scanning Behavior
  if (erikScanningBehavior?.enabled) {
    const intensity = erikScanningBehavior.intensity;

    createOverlay(
      'visual-field-overlay-erikScanningBehavior',
      `rgba(0,0,0,${intensity * 0.1})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikScanningBehavior'
    );
  }

  // Erik Weihenmayer - Cognitive Load
  if (erikCognitiveLoad?.enabled) {
    const intensity = erikCognitiveLoad.intensity;

    createOverlay(
      'visual-field-overlay-erikCognitiveLoad',
      `rgba(0,0,0,${intensity * 0.05})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCognitiveLoad'
    );
  }
};
