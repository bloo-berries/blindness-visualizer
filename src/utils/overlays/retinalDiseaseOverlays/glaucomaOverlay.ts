import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';

/**
 * Creates glaucoma overlay with arcuate defects, nasal step, and realistic field patterns
 */
export function createGlaucomaOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Tighter contraction so peripheral loss is visible at moderate intensities
  const fieldRadius = Math.max(12, 75 - intensity * 63);
  const fadeWidth = Math.max(8, fieldRadius * 0.3);
  const fadeStart = fieldRadius - fadeWidth;
  const grayEdge = 30;
  const grayMid = 50;

  // Main peripheral field loss gradient
  const peripheralLoss = `radial-gradient(ellipse 100% 110% at 50% 50%,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0) ${fadeStart}%,
    rgba(${grayMid},${grayMid},${grayMid},${0.5 * intensity}) ${fadeStart + fadeWidth * 0.3}%,
    rgba(${(grayMid + grayEdge) / 2},${(grayMid + grayEdge) / 2},${(grayMid + grayEdge) / 2},${0.75 * intensity}) ${fadeStart + fadeWidth * 0.6}%,
    rgba(${grayEdge},${grayEdge},${grayEdge},${0.9 * intensity}) ${fieldRadius}%,
    rgba(${grayEdge},${grayEdge},${grayEdge},${0.95 * intensity}) 100%
  )`;

  // Arcuate defect patterns - curved scotomas following optic nerve fiber pattern
  const arcuatePatterns: string[] = [];

  // Superior arcuate defect (more common, appears above fixation)
  if (intensity > 0.15) {
    const superiorArcOpacity = Math.min(0.9, (intensity - 0.15) * 1.8);
    arcuatePatterns.push(`
      radial-gradient(ellipse 65% 28% at 50% 22%,
        rgba(${grayEdge},${grayEdge},${grayEdge},${superiorArcOpacity}) 0%,
        rgba(${grayEdge + 10},${grayEdge + 10},${grayEdge + 10},${superiorArcOpacity * 0.7}) 50%,
        rgba(${grayMid},${grayMid},${grayMid},${superiorArcOpacity * 0.3}) 75%,
        transparent 100%
      )
    `);
  }

  // Inferior arcuate defect (appears below fixation)
  if (intensity > 0.3) {
    const inferiorArcOpacity = Math.min(0.85, (intensity - 0.3) * 1.6);
    arcuatePatterns.push(`
      radial-gradient(ellipse 60% 25% at 50% 78%,
        rgba(${grayEdge},${grayEdge},${grayEdge},${inferiorArcOpacity}) 0%,
        rgba(${grayEdge + 10},${grayEdge + 10},${grayEdge + 10},${inferiorArcOpacity * 0.6}) 55%,
        rgba(${grayMid},${grayMid},${grayMid},${inferiorArcOpacity * 0.25}) 80%,
        transparent 100%
      )
    `);
  }

  // Nasal step - characteristic wedge-shaped defect on the nasal side
  if (intensity > 0.25) {
    const nasalStepOpacity = Math.min(0.8, (intensity - 0.25) * 1.4);
    arcuatePatterns.push(`
      conic-gradient(from 170deg at 12% 50%,
        rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity}) 0deg,
        rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity * 0.8}) 15deg,
        rgba(${grayMid},${grayMid},${grayMid},${nasalStepOpacity * 0.4}) 25deg,
        transparent 35deg,
        transparent 325deg,
        rgba(${grayMid},${grayMid},${grayMid},${nasalStepOpacity * 0.3}) 340deg,
        rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity * 0.6}) 355deg,
        rgba(${grayEdge},${grayEdge},${grayEdge},${nasalStepOpacity}) 360deg
      )
    `);
  }

  // Paracentral scotomas (early glaucoma - small defects near fixation)
  if (intensity > 0.1 && intensity < 0.7) {
    const paracentralOpacity = Math.min(0.7, intensity * 1.2);
    arcuatePatterns.push(`
      radial-gradient(circle 5% at 40% 36%,
        rgba(${grayEdge},${grayEdge},${grayEdge},${paracentralOpacity}) 0%,
        rgba(${grayMid},${grayMid},${grayMid},${paracentralOpacity * 0.5}) 50%,
        transparent 100%
      )
    `);
    arcuatePatterns.push(`
      radial-gradient(circle 4% at 60% 64%,
        rgba(${grayEdge},${grayEdge},${grayEdge},${paracentralOpacity * 0.8}) 0%,
        rgba(${grayMid},${grayMid},${grayMid},${paracentralOpacity * 0.4}) 50%,
        transparent 100%
      )
    `);
  }

  // Combine all patterns
  const allPatterns = [peripheralLoss, ...arcuatePatterns];
  const glaucomaBackground = allPatterns.join(', ');

  const blendMode = 'normal';
  const opacity = Math.min(0.95, 0.5 + intensity * 0.45);
  const filters = `blur(${intensity * 1.2}px) contrast(${100 - intensity * 30}%) brightness(${100 - intensity * 10}%)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-glaucoma',
      glaucomaBackground,
      blendMode,
      opacity.toString(),
      filters,
      undefined,
      'glaucoma',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-glaucoma',
      glaucomaBackground,
      blendMode,
      opacity.toString(),
      filters,
      undefined,
      'glaucoma'
    );
  }
}
