import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from '../overlayHelpers';
import { seededRandom } from '../sharedOverlayUtils';

/**
 * Creates Retinitis Pigmentosa overlay with tunnel vision, scotomas, and color desaturation
 */
export function createRetinitisPigmentosaOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;
  const tunnelRadius = Math.max(5, 35 - intensity * 30);

  // Use dark gray/brown tones instead of pure black (more realistic)
  const grayR = 35 + (1 - intensity) * 20;
  const grayG = 30 + (1 - intensity) * 18;
  const grayB = 25 + (1 - intensity) * 15;

  // Main tunnel vision gradient with smoother, more realistic fade
  const tunnelGradient = `radial-gradient(ellipse 100% 130% at 50% 50%,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0) ${tunnelRadius - 3}%,
    rgba(${grayR},${grayG},${grayB},${0.15 * intensity}) ${tunnelRadius}%,
    rgba(${grayR},${grayG},${grayB},${0.4 * intensity}) ${tunnelRadius + 4}%,
    rgba(${grayR},${grayG},${grayB},${0.7 * intensity}) ${tunnelRadius + 8}%,
    rgba(${grayR - 10},${grayG - 10},${grayB - 10},${0.9 * intensity}) ${tunnelRadius + 15}%,
    rgba(${grayR - 15},${grayG - 15},${grayB - 15},${0.95 * intensity}) 100%
  )`;

  // Add scattered scotomas (random blind spots) typical in RP
  const scotomaPatterns: string[] = [];
  const numScotomas = Math.floor(3 + intensity * 8);

  for (let i = 0; i < numScotomas; i++) {
    const seed = i * 7.31;
    const angle = seededRandom(seed) * Math.PI * 2;
    const distance = tunnelRadius + 5 + seededRandom(seed + 1) * (40 - tunnelRadius);
    const x = 50 + Math.cos(angle) * distance * 0.8;
    const y = 50 + Math.sin(angle) * distance * 0.6;
    const size = 2 + seededRandom(seed + 2) * 4;
    const scotomaOpacity = (0.5 + seededRandom(seed + 3) * 0.4) * intensity;

    scotomaPatterns.push(`
      radial-gradient(circle ${size}% at ${x}% ${y}%,
        rgba(${grayR - 20},${grayG - 20},${grayB - 20},${scotomaOpacity}) 0%,
        rgba(${grayR - 20},${grayG - 20},${grayB - 20},${scotomaOpacity * 0.6}) 50%,
        transparent 100%
      )
    `);
  }

  const combinedBackground = `${tunnelGradient}${scotomaPatterns.length > 0 ? ', ' + scotomaPatterns.join(', ') : ''}`;
  const filters = `saturate(${100 - intensity * 35}%) contrast(${100 - intensity * 15}%) brightness(${100 - intensity * 10}%)`;

  if (container) {
    createOverlayWithContainer(
      'visual-field-overlay-retinitisPigmentosa',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'retinitisPigmentosa',
      container
    );
  } else {
    createOverlay(
      'visual-field-overlay-retinitisPigmentosa',
      combinedBackground,
      'normal',
      Math.min(0.95, intensity).toString(),
      filters,
      undefined,
      'retinitisPigmentosa'
    );
  }
}
