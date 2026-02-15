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

  // Calculate field radius (shrinks with severity)
  const fieldRadius = Math.max(15, 90 - intensity * 75);
  const fadeWidth = fieldRadius * 0.25;
  const fadeStart = fieldRadius - fadeWidth;

  // Gray values for realistic "fading to grayness" effect
  const grayValueCenter = 75;
  const grayValueEdge = 35;

  // Main peripheral field loss gradient
  const peripheralLoss = `radial-gradient(ellipse 100% 110% at 50% 50%,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0) ${fadeStart}%,
    rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${0.35 * intensity}) ${fadeStart + fadeWidth * 0.3}%,
    rgba(${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${0.6 * intensity}) ${fadeStart + fadeWidth * 0.6}%,
    rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${0.85 * intensity}) ${fieldRadius}%,
    rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${0.9 * intensity}) 100%
  )`;

  // Arcuate defect patterns - curved scotomas following optic nerve fiber pattern
  const arcuatePatterns: string[] = [];

  // Superior arcuate defect (more common, appears above fixation)
  if (intensity > 0.2) {
    const superiorArcOpacity = Math.min(0.8, (intensity - 0.2) * 1.2);
    arcuatePatterns.push(`
      radial-gradient(ellipse 60% 25% at 50% 25%,
        rgba(${grayValueEdge - 10},${grayValueEdge - 10},${grayValueEdge - 10},${superiorArcOpacity}) 0%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${superiorArcOpacity * 0.7}) 50%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${superiorArcOpacity * 0.3}) 75%,
        transparent 100%
      )
    `);
  }

  // Inferior arcuate defect (appears below fixation)
  if (intensity > 0.35) {
    const inferiorArcOpacity = Math.min(0.75, (intensity - 0.35) * 1.1);
    arcuatePatterns.push(`
      radial-gradient(ellipse 55% 22% at 50% 75%,
        rgba(${grayValueEdge - 10},${grayValueEdge - 10},${grayValueEdge - 10},${inferiorArcOpacity}) 0%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${inferiorArcOpacity * 0.6}) 55%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${inferiorArcOpacity * 0.25}) 80%,
        transparent 100%
      )
    `);
  }

  // Nasal step - characteristic wedge-shaped defect on the nasal (inner) side
  if (intensity > 0.3) {
    const nasalStepOpacity = Math.min(0.7, (intensity - 0.3) * 1.0);
    arcuatePatterns.push(`
      conic-gradient(from 170deg at 15% 50%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${nasalStepOpacity}) 0deg,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${nasalStepOpacity * 0.8}) 15deg,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${nasalStepOpacity * 0.4}) 25deg,
        transparent 35deg,
        transparent 325deg,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${nasalStepOpacity * 0.3}) 340deg,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${nasalStepOpacity * 0.6}) 355deg,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${nasalStepOpacity}) 360deg
      )
    `);
  }

  // Paracentral scotomas (early glaucoma - small defects near fixation)
  if (intensity > 0.15 && intensity < 0.7) {
    const paracentralOpacity = Math.min(0.5, intensity * 0.8);
    arcuatePatterns.push(`
      radial-gradient(circle 4% at 42% 38%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${paracentralOpacity}) 0%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${paracentralOpacity * 0.5}) 50%,
        transparent 100%
      )
    `);
    arcuatePatterns.push(`
      radial-gradient(circle 3% at 58% 62%,
        rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${paracentralOpacity * 0.8}) 0%,
        rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${paracentralOpacity * 0.4}) 50%,
        transparent 100%
      )
    `);
  }

  // Combine all patterns
  const allPatterns = [peripheralLoss, ...arcuatePatterns];
  const glaucomaBackground = allPatterns.join(', ');

  const blendMode = 'normal';
  const opacity = Math.min(0.9, intensity * 0.95);
  const filters = `blur(${intensity * 1.5}px) contrast(${100 - intensity * 40}%) brightness(${100 - intensity * 8}%)`;

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
