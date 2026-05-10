/**
 * Infanta Margarita's Light Perception overlay generator
 *
 * She can perceive "light and shadows and rarely something more."
 * This creates a diffuse fog with more visible shadow regions than pure LP.
 *
 * Key differences from Heather Hutchison's LP overlay:
 * - No nystagmus (not part of Margarita's condition)
 * - More prominent shadow areas (she can distinguish light vs dark)
 * - Slightly less opaque fog (allows more light/dark contrast through)
 * - Slower, gentler fluctuation
 */

import { createOverlayStyle } from './createOverlayStyle';

/**
 * Generate Infanta Margarita's Light & Shadow Perception overlay
 */
export function generateMargaritaLightPerceptionOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Fluctuating perception - slow oscillation (4-6 second period, +/-8% variation)
  // Gentler and slower than Heather's to represent more stable congenital adaptation
  const fluctuationPeriod1 = 5; // ~5 second cycle
  const fluctuationPeriod2 = 4.2; // slightly different for organic feel
  const fluctuation1 = Math.sin(time * (2 * Math.PI / fluctuationPeriod1)) * 0.04; // +/-4%
  const fluctuation2 = Math.sin(time * (2 * Math.PI / fluctuationPeriod2) + 1.5) * 0.04; // +/-4%

  // Base fog opacity: 0.60-0.75 (less than Heather's 0.70-0.85)
  // Allows more of the underlying light/dark to show through
  const baseFogOpacity = 0.63 + intensity * 0.10; // 0.63-0.73
  const fogOpacity = baseFogOpacity + fluctuation1;

  // Secondary fog layer
  const secondaryFogOpacity = 0.58 + intensity * 0.12 + fluctuation2; // 0.58-0.70

  // Vague light blob positions - drift slowly
  // Represent distinguishable light areas (windows, lamps)
  const lightBlob1X = 45 + Math.sin(time * 0.04) * 10;
  const lightBlob1Y = 30 + Math.cos(time * 0.035) * 8;
  const lightBlob2X = 55 + Math.sin(time * 0.05 + 2.0) * 8;
  const lightBlob2Y = 60 + Math.cos(time * 0.06 + 1.2) * 7;

  // Blob brightness pulsing
  const blobPulse1 = 0.93 + Math.sin(time * 0.15) * 0.03 + fluctuation1;
  const blobPulse2 = 0.91 + Math.sin(time * 0.18 + 1.0) * 0.03 + fluctuation2;

  // Primary white fog layer - diffuse light perception
  const whiteFogPrimary = `
    linear-gradient(
      rgba(255,255,255,${fogOpacity * intensity}) 0%,
      rgba(248,248,248,${fogOpacity * intensity * 0.95}) 100%
    )
  `;

  // Secondary fog layer for depth
  const whiteFogSecondary = `
    radial-gradient(ellipse 140% 120% at 50% 50%,
      rgba(255,255,255,${secondaryFogOpacity * intensity * 0.85}) 0%,
      rgba(245,245,245,${secondaryFogOpacity * intensity * 0.80}) 40%,
      rgba(240,240,240,${secondaryFogOpacity * intensity * 0.75}) 70%,
      rgba(235,235,235,${secondaryFogOpacity * intensity * 0.70}) 100%
    )
  `;

  // Light patches - brighter areas representing light sources
  const lightPatch1 = `
    radial-gradient(ellipse 50% 45% at ${lightBlob1X}% ${lightBlob1Y}%,
      rgba(255,255,255,${blobPulse1 * intensity * 0.18}) 0%,
      rgba(255,255,255,${blobPulse1 * intensity * 0.10}) 50%,
      transparent 100%
    )
  `;

  const lightPatch2 = `
    radial-gradient(ellipse 40% 35% at ${lightBlob2X}% ${lightBlob2Y}%,
      rgba(255,255,255,${blobPulse2 * intensity * 0.14}) 0%,
      rgba(255,255,255,${blobPulse2 * intensity * 0.07}) 50%,
      transparent 100%
    )
  `;

  // Shadow regions - more prominent than Heather's since Margarita perceives shadows
  // Multiple shadow hints at different positions to simulate dark areas
  const shadowDrift = Math.sin(time * 0.03) * 5;
  const shadow1 = `
    radial-gradient(ellipse 55% 45% at ${22 + shadowDrift}% ${65 + Math.cos(time * 0.04) * 4}%,
      rgba(180,180,180,${0.15 * intensity}) 0%,
      rgba(200,200,200,${0.08 * intensity}) 50%,
      transparent 100%
    )
  `;

  const shadow2 = `
    radial-gradient(ellipse 45% 50% at ${75 - shadowDrift * 0.7}% ${40 + Math.sin(time * 0.045 + 1.0) * 5}%,
      rgba(190,190,190,${0.12 * intensity}) 0%,
      rgba(210,210,210,${0.06 * intensity}) 50%,
      transparent 100%
    )
  `;

  // Bottom shadow - simulating ground/floor darkness
  const shadow3 = `
    linear-gradient(
      to bottom,
      transparent 50%,
      rgba(195,195,195,${0.10 * intensity + fluctuation2 * 0.3}) 80%,
      rgba(185,185,185,${0.14 * intensity + fluctuation2 * 0.3}) 100%
    )
  `;

  const background = `
    ${lightPatch1},
    ${lightPatch2},
    ${shadow1},
    ${shadow2},
    ${shadow3},
    ${whiteFogPrimary},
    ${whiteFogSecondary}
  `;

  return createOverlayStyle(background);
}
