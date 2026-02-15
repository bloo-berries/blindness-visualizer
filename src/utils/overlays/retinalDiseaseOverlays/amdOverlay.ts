import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';
import { seededRandom } from '../sharedOverlayUtils';

/**
 * Creates Age-Related Macular Degeneration (AMD) overlay
 * Lower intensity = early/dry AMD (drusen spots)
 * Higher intensity = advanced/wet AMD (distortion + scotoma)
 */
export function createAmdOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Central scotoma with irregular edges
  const baseRadius = Math.max(12, 45 - intensity * 33);
  const grayValue = 30 + (1 - intensity) * 25;

  // Main scotoma - irregular shape using multiple offset gradients
  const mainScotoma = `radial-gradient(ellipse 105% 95% at 50% 50%,
    rgba(${grayValue},${grayValue},${grayValue + 5},${0.9 * intensity}) 0%,
    rgba(${grayValue},${grayValue},${grayValue + 5},${0.85 * intensity}) ${baseRadius - 8}%,
    rgba(${grayValue + 10},${grayValue + 10},${grayValue + 15},${0.6 * intensity}) ${baseRadius - 3}%,
    rgba(${grayValue + 20},${grayValue + 20},${grayValue + 25},${0.3 * intensity}) ${baseRadius + 2}%,
    transparent ${baseRadius + 8}%
  )`;

  // Secondary irregular edge
  const irregularEdge = `radial-gradient(ellipse 90% 110% at 52% 48%,
    rgba(${grayValue + 5},${grayValue + 5},${grayValue + 10},${0.7 * intensity}) 0%,
    rgba(${grayValue + 5},${grayValue + 5},${grayValue + 10},${0.5 * intensity}) ${baseRadius - 5}%,
    transparent ${baseRadius + 3}%
  )`;

  // Drusen spots (yellow deposits) - characteristic of dry AMD
  const drusenPatterns: string[] = [];
  const numDrusen = Math.floor(8 + (1 - intensity) * 15);

  for (let i = 0; i < numDrusen; i++) {
    const seed = i * 4.29;
    const angle = seededRandom(seed) * Math.PI * 2;
    const distance = 5 + seededRandom(seed + 1) * (baseRadius + 15);
    const x = 50 + Math.cos(angle) * distance * 0.6;
    const y = 50 + Math.sin(angle) * distance * 0.5;
    const size = 1.5 + seededRandom(seed + 2) * 3;
    const drusenOpacity = (0.2 + seededRandom(seed + 3) * 0.3) * (1.2 - intensity * 0.7);

    drusenPatterns.push(`
      radial-gradient(circle ${size}% at ${x}% ${y}%,
        rgba(220,200,120,${drusenOpacity}) 0%,
        rgba(200,180,100,${drusenOpacity * 0.6}) 50%,
        transparent 100%
      )
    `);
  }

  // Metamorphopsia effect (wavy distortion) - characteristic of wet AMD
  const distortionPatterns: string[] = [];
  if (intensity > 0.4) {
    const numDistortions = Math.floor(4 + intensity * 6);
    for (let i = 0; i < numDistortions; i++) {
      const seed = (i + 50) * 3.17;
      const angle = (i / numDistortions) * Math.PI * 2;
      const distance = baseRadius - 3 + seededRandom(seed) * 10;
      const x = 50 + Math.cos(angle) * distance * 0.5;
      const y = 50 + Math.sin(angle) * distance * 0.4;
      const width = 3 + seededRandom(seed + 1) * 5;
      const height = 2 + seededRandom(seed + 2) * 3;
      const distortOpacity = (0.15 + seededRandom(seed + 3) * 0.2) * intensity;

      distortionPatterns.push(`
        radial-gradient(ellipse ${width}% ${height}% at ${x}% ${y}%,
          rgba(100,100,110,${distortOpacity}) 0%,
          rgba(80,80,90,${distortOpacity * 0.5}) 60%,
          transparent 100%
        )
      `);
    }
  }

  const allPatterns = [mainScotoma, irregularEdge, ...drusenPatterns, ...distortionPatterns];
  const combinedBackground = allPatterns.join(', ');
  const filters = `contrast(${100 - intensity * 20}%) saturate(${100 - intensity * 25}%)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-amd',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'amd',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-amd',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'amd'
    );
  }
}
