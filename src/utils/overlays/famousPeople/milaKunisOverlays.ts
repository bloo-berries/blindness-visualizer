import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Mila Kunis' mild iritis and cataracts
 *
 * Her condition is very mild - chronic iritis that caused cataracts in her left eye.
 * After treatment, she can see the vast majority of her environment clearly.
 * Effects should be subtle: slight light sensitivity and minimal haziness.
 */
export const createMilaKunisOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const milaCompleteVision = getEffect('milaCompleteVision');
  const milaMildIritis = getEffect('milaMildIritis');
  const milaMildCataracts = getEffect('milaMildCataracts');

  // Mila - Complete Vision (very mild combined effects)
  if (milaCompleteVision?.enabled) {
    const i = milaCompleteVision.intensity;

    // Very subtle light sensitivity bloom - barely noticeable
    const mildLightSensitivity = `
      radial-gradient(circle at 50% 30%,
        rgba(255,255,255,${i * 0.08}) 0%,
        rgba(255,255,255,${i * 0.04}) 20%,
        transparent 50%
      ),
      radial-gradient(circle at 30% 25%,
        rgba(255,255,255,${i * 0.06}) 0%,
        rgba(255,255,255,${i * 0.03}) 15%,
        transparent 40%
      ),
      radial-gradient(circle at 70% 35%,
        rgba(255,255,255,${i * 0.05}) 0%,
        rgba(255,255,255,${i * 0.02}) 18%,
        transparent 45%
      )
    `;

    createOverlay(
      'visual-field-overlay-milaCompleteVision',
      mildLightSensitivity,
      'screen',
      Math.min(0.4, 0.2 + i * 0.2).toString(),
      undefined,
      undefined,
      'milaCompleteVision'
    );
  }

  // Mila - Mild Iritis (subtle light sensitivity)
  if (milaMildIritis?.enabled) {
    const i = milaMildIritis.intensity;

    // Subtle glare spots around bright areas
    const iritisGlare = `
      radial-gradient(circle at 50% 25%,
        rgba(255,255,255,${i * 0.10}) 0%,
        rgba(255,255,255,${i * 0.05}) 15%,
        transparent 40%
      ),
      radial-gradient(circle at 25% 30%,
        rgba(255,255,255,${i * 0.07}) 0%,
        transparent 30%
      ),
      radial-gradient(circle at 75% 28%,
        rgba(255,255,255,${i * 0.07}) 0%,
        transparent 32%
      )
    `;

    createOverlay(
      'visual-field-overlay-milaMildIritis',
      iritisGlare,
      'screen',
      Math.min(0.35, 0.15 + i * 0.20).toString(),
      undefined,
      undefined,
      'milaMildIritis'
    );
  }

  // Mila - Mild Cataracts (very subtle haze)
  if (milaMildCataracts?.enabled) {
    const i = milaMildCataracts.intensity;

    // Very light, barely perceptible haze
    const mildHaze = `
      radial-gradient(ellipse 150% 150% at 50% 50%,
        rgba(255,255,255,${i * 0.06}) 0%,
        rgba(255,255,255,${i * 0.04}) 40%,
        rgba(255,255,255,${i * 0.02}) 70%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-milaMildCataracts',
      mildHaze,
      'screen',
      Math.min(0.30, 0.10 + i * 0.20).toString(),
      undefined,
      undefined,
      'milaMildCataracts'
    );
  }
};
