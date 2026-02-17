import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Dame Judi Dench's Age-Related Macular Degeneration (AMD)
 *
 * Based on her descriptions:
 * - "I can see your outline" - peripheral vision preserved
 * - "I can't recognize anybody now" - central vision lost
 * - "I can't see the television, I can't see to read"
 *
 * AMD affects CENTRAL vision (the macula), creating a scotoma in the middle
 * while PERIPHERAL vision remains intact. This is the opposite of tunnel vision.
 */
export const createJudiDenchOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const judiAMDComplete = getEffect('judiAMDComplete');
  const judiCentralScotoma = getEffect('judiCentralScotoma');
  const judiFaceBlindness = getEffect('judiFaceBlindness');
  const judiReadingLoss = getEffect('judiReadingLoss');

  // Helper function to create central scotoma overlay
  const createCentralScotomaOverlay = (id: string, intensity: number, conditionId: string) => {
    // Central scotoma: dark/blurry center, clear periphery
    // The scotoma size increases with intensity
    const scotomaSize = 25 + intensity * 20; // 25-45% of view is affected
    const fadeSize = scotomaSize + 15; // Gradual fade to clear periphery

    // Primary scotoma - dark center that obscures faces and text
    const centralScotoma = `
      radial-gradient(ellipse ${scotomaSize}% ${scotomaSize}% at 50% 50%,
        rgba(40,40,45,${intensity * 0.92}) 0%,
        rgba(45,45,50,${intensity * 0.88}) 20%,
        rgba(50,50,55,${intensity * 0.80}) 40%,
        rgba(60,60,65,${intensity * 0.65}) 60%,
        rgba(80,80,85,${intensity * 0.40}) 75%,
        rgba(100,100,105,${intensity * 0.20}) 85%,
        transparent 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-scotoma`,
      centralScotoma,
      'multiply',
      '1',
      undefined,
      undefined,
      conditionId
    );

    // Blur gradient overlay - more blur in center, less at edges
    // This represents the loss of detail/acuity in central vision
    const blurGradient = `
      radial-gradient(ellipse ${fadeSize}% ${fadeSize}% at 50% 50%,
        rgba(128,128,130,${intensity * 0.35}) 0%,
        rgba(128,128,130,${intensity * 0.25}) 30%,
        rgba(128,128,130,${intensity * 0.12}) 60%,
        transparent 85%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-blur`,
      blurGradient,
      'overlay',
      Math.min(0.7, 0.4 + intensity * 0.3).toString(),
      `blur(${intensity * 3}px)`,
      undefined,
      conditionId
    );
  };

  // Judi - Complete AMD Experience
  if (judiAMDComplete?.enabled) {
    const i = judiAMDComplete.intensity;
    createCentralScotomaOverlay('judiAMDComplete', i, 'judiAMDComplete');

    // Additional subtle color shift in central area (AMD can affect color perception)
    const colorShift = `
      radial-gradient(ellipse 35% 35% at 50% 50%,
        rgba(100,95,90,${i * 0.15}) 0%,
        rgba(100,95,90,${i * 0.08}) 50%,
        transparent 80%
      )
    `;

    createOverlay(
      'visual-field-overlay-judiAMDComplete-color',
      colorShift,
      'color',
      Math.min(0.5, i * 0.5).toString(),
      undefined,
      undefined,
      'judiAMDComplete'
    );
  }

  // Judi - Central Scotoma Only
  if (judiCentralScotoma?.enabled) {
    const i = judiCentralScotoma.intensity;
    createCentralScotomaOverlay('judiCentralScotoma', i, 'judiCentralScotoma');
  }

  // Judi - Face Blindness (prosopagnosia-like from central vision loss)
  if (judiFaceBlindness?.enabled) {
    const i = judiFaceBlindness.intensity;

    // Face-sized scotoma in central vision where faces typically appear
    const faceScotoma = `
      radial-gradient(ellipse 22% 28% at 50% 45%,
        rgba(50,50,55,${i * 0.85}) 0%,
        rgba(60,60,65,${i * 0.70}) 30%,
        rgba(80,80,85,${i * 0.45}) 60%,
        rgba(100,100,105,${i * 0.20}) 80%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-judiFaceBlindness',
      faceScotoma,
      'multiply',
      '1',
      `blur(${i * 4}px)`,
      undefined,
      'judiFaceBlindness'
    );
  }

  // Judi - Reading Loss
  if (judiReadingLoss?.enabled) {
    const i = judiReadingLoss.intensity;

    // Scotoma affects central reading area
    const readingScotoma = `
      radial-gradient(ellipse 30% 20% at 50% 50%,
        rgba(45,45,50,${i * 0.80}) 0%,
        rgba(55,55,60,${i * 0.60}) 40%,
        rgba(75,75,80,${i * 0.35}) 70%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-judiReadingLoss',
      readingScotoma,
      'multiply',
      '1',
      `blur(${i * 5}px)`,
      undefined,
      'judiReadingLoss'
    );
  }
};
