import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';
import { seededRandom } from '../sharedOverlayUtils';

/**
 * Creates Stargardt Disease overlay with ring scotoma pattern and yellow/brown lipofuscin tint
 */
export function createStargardtOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Stargardt creates a ring/annular scotoma pattern (not a filled circle)
  const innerRadius = Math.max(3, 8 - intensity * 5);
  const ringStart = innerRadius + 2;
  const ringPeak = 15 + intensity * 20;
  const ringEnd = ringPeak + 10 + intensity * 15;

  // Stargardt has characteristic yellow/brown lipofuscin deposits
  const brownR = 60 + (1 - intensity) * 20;
  const brownG = 45 + (1 - intensity) * 15;
  const brownB = 25 + (1 - intensity) * 10;

  // Ring scotoma pattern
  const ringScotoma = `radial-gradient(circle at 50% 50%,
    rgba(${brownR},${brownG},${brownB},${0.3 * intensity}) 0%,
    rgba(${brownR},${brownG},${brownB},${0.4 * intensity}) ${innerRadius}%,
    rgba(${brownR - 20},${brownG - 20},${brownB - 10},${0.7 * intensity}) ${ringStart}%,
    rgba(${brownR - 35},${brownG - 30},${brownB - 15},${0.95 * intensity}) ${ringPeak - 5}%,
    rgba(${brownR - 40},${brownG - 35},${brownB - 18},${0.98 * intensity}) ${ringPeak}%,
    rgba(${brownR - 35},${brownG - 30},${brownB - 15},${0.9 * intensity}) ${ringPeak + 5}%,
    rgba(${brownR - 20},${brownG - 20},${brownB - 10},${0.6 * intensity}) ${ringEnd - 5}%,
    rgba(${brownR},${brownG},${brownB},${0.3 * intensity}) ${ringEnd}%,
    transparent ${ringEnd + 10}%
  )`;

  // Add yellow flecks pattern (characteristic "beaten bronze" appearance)
  const fleckPatterns: string[] = [];
  const numFlecks = Math.floor(6 + intensity * 12);

  for (let i = 0; i < numFlecks; i++) {
    const seed = i * 5.73;
    const angle = seededRandom(seed) * Math.PI * 2;
    const distance = ringStart + seededRandom(seed + 1) * (ringEnd - ringStart);
    const x = 50 + Math.cos(angle) * distance * 0.7;
    const y = 50 + Math.sin(angle) * distance * 0.7;
    const size = 1 + seededRandom(seed + 2) * 2.5;
    const fleckOpacity = (0.3 + seededRandom(seed + 3) * 0.4) * intensity;

    fleckPatterns.push(`
      radial-gradient(circle ${size}% at ${x}% ${y}%,
        rgba(180,150,60,${fleckOpacity}) 0%,
        rgba(160,130,50,${fleckOpacity * 0.5}) 50%,
        transparent 100%
      )
    `);
  }

  const combinedBackground = `${ringScotoma}${fleckPatterns.length > 0 ? ', ' + fleckPatterns.join(', ') : ''}`;
  const filters = `saturate(${100 - intensity * 45}%) sepia(${intensity * 15}%) contrast(${100 - intensity * 10}%)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-stargardt',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'stargardt',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-stargardt',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'stargardt'
    );
  }
}
