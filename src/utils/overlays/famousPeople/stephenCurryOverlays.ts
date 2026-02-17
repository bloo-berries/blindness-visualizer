import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Stephen Curry's Keratoconus (Mild-to-Moderate, Before Contact Lens Correction)
 *
 * Key visual characteristics:
 * 1. Coma aberration - Asymmetric directional smear/blur (comet tails trailing downward)
 * 2. Monocular polyopia - 2-4 ghost images offset from true position
 * 3. Irregular halos - Asymmetric streaking halos around lights (NOT circular)
 * 4. Irregular waviness - Subtle undulation in straight lines
 * 5. Reduced contrast & haze - Milky film, colors lack punch
 * 6. Asymmetric distortion - One eye worse than the other
 *
 * The world refuses to come into sharp focus - every edge bleeds, every light smears.
 */
export const createStephenCurryOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const stephenComplete = getEffect('stephenKeratoconusComplete');
  const stephenComa = getEffect('stephenComaAberration');
  const stephenGhosting = getEffect('stephenGhosting');
  const stephenHalos = getEffect('stephenIrregularHalos');
  const stephenWaviness = getEffect('stephenWaviness');
  const stephenContrast = getEffect('stephenReducedContrast');
  const stephenAsymmetry = getEffect('stephenAsymmetry');

  // Stephen Curry - Complete Keratoconus Experience
  if (stephenComplete?.enabled) {
    const i = stephenComplete.intensity;

    // 1. COMA ABERRATION / DIRECTIONAL SMEAR
    // Creates comet-tail effect trailing downward from high-contrast edges
    // Using overlapping gradients at an angle to simulate directional blur
    const comaDirection = 165; // Degrees - trailing inferior/downward-left
    const comaStrength = 0.4 + i * 0.3;

    const comaSmear = `
      linear-gradient(
        ${comaDirection}deg,
        transparent 0%,
        rgba(128,128,130,${i * 0.08}) 30%,
        rgba(128,128,130,${i * 0.12}) 50%,
        rgba(128,128,130,${i * 0.08}) 70%,
        transparent 100%
      ),
      linear-gradient(
        ${comaDirection + 5}deg,
        transparent 0%,
        rgba(120,120,125,${i * 0.06}) 35%,
        rgba(120,120,125,${i * 0.10}) 55%,
        rgba(120,120,125,${i * 0.06}) 75%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenComa',
      comaSmear,
      'overlay',
      comaStrength.toString(),
      `blur(${1.5 + i * 2}px)`,
      undefined,
      'stephenKeratoconusComplete'
    );

    // 2. GHOSTING / MONOCULAR POLYOPIA
    // Multiple offset semi-transparent copies of the image
    // Creates "dirty" chaotic visual impression
    const ghostBackground = generateGhostingOverlay(i);

    createOverlay(
      'visual-field-overlay-stephenGhosting',
      ghostBackground,
      'overlay',
      Math.min(0.6, 0.3 + i * 0.3).toString(),
      `blur(${0.5 + i * 1}px)`,
      undefined,
      'stephenKeratoconusComplete'
    );

    // 3. IRREGULAR HALOS - Asymmetric light streaking
    // NOT circular - they have comet tails extending in one direction
    const haloBackground = generateIrregularHalos(i);

    createOverlay(
      'visual-field-overlay-stephenHalos',
      haloBackground,
      'screen',
      Math.min(0.5, 0.25 + i * 0.25).toString(),
      undefined,
      undefined,
      'stephenKeratoconusComplete'
    );

    // 4. WAVINESS - Irregular astigmatism distortion
    // Subtle undulation overlay simulating heat-warped lens effect
    const wavinessBackground = generateWavinessOverlay(i);

    createOverlay(
      'visual-field-overlay-stephenWaviness',
      wavinessBackground,
      'overlay',
      Math.min(0.35, 0.15 + i * 0.2).toString(),
      undefined,
      undefined,
      'stephenKeratoconusComplete'
    );

    // 5. REDUCED CONTRAST & HAZE - Milky film effect
    // "Blacks aren't as black, whites aren't as white"
    const hazeBackground = `
      radial-gradient(ellipse 150% 150% at 50% 50%,
        rgba(200,200,205,${i * 0.12}) 0%,
        rgba(195,195,200,${i * 0.10}) 30%,
        rgba(190,190,195,${i * 0.08}) 60%,
        rgba(185,185,190,${i * 0.06}) 100%
      ),
      linear-gradient(
        180deg,
        rgba(195,195,200,${i * 0.08}) 0%,
        rgba(190,190,195,${i * 0.06}) 50%,
        rgba(195,195,200,${i * 0.08}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenHaze',
      hazeBackground,
      'screen',
      Math.min(0.55, 0.35 + i * 0.2).toString(),
      undefined,
      undefined,
      'stephenKeratoconusComplete'
    );

    // 6. ASYMMETRIC DISTORTION - One side worse than other
    // Left side has more distortion (keratoconus typically bilateral but asymmetric)
    const asymmetryBackground = `
      linear-gradient(
        90deg,
        rgba(120,120,125,${i * 0.18}) 0%,
        rgba(130,130,135,${i * 0.12}) 15%,
        rgba(140,140,145,${i * 0.06}) 35%,
        transparent 55%,
        rgba(140,140,145,${i * 0.03}) 75%,
        rgba(135,135,140,${i * 0.05}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenAsymmetry',
      asymmetryBackground,
      'overlay',
      Math.min(0.45, 0.25 + i * 0.2).toString(),
      `blur(${i * 1.2}px)`,
      undefined,
      'stephenKeratoconusComplete'
    );
  }

  // Individual coma aberration effect
  if (stephenComa?.enabled && !stephenComplete?.enabled) {
    const i = stephenComa.intensity;
    const comaSmear = `
      linear-gradient(
        165deg,
        transparent 0%,
        rgba(128,128,130,${i * 0.10}) 30%,
        rgba(128,128,130,${i * 0.15}) 50%,
        rgba(128,128,130,${i * 0.10}) 70%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenComaOnly',
      comaSmear,
      'overlay',
      Math.min(0.5, 0.3 + i * 0.2).toString(),
      `blur(${2 + i * 2.5}px)`,
      undefined,
      'stephenComaAberration'
    );
  }

  // Individual ghosting effect
  if (stephenGhosting?.enabled && !stephenComplete?.enabled) {
    const i = stephenGhosting.intensity;
    const ghostBackground = generateGhostingOverlay(i);

    createOverlay(
      'visual-field-overlay-stephenGhostingOnly',
      ghostBackground,
      'overlay',
      Math.min(0.65, 0.35 + i * 0.3).toString(),
      `blur(${0.5 + i * 1.2}px)`,
      undefined,
      'stephenGhosting'
    );
  }

  // Individual irregular halos effect
  if (stephenHalos?.enabled && !stephenComplete?.enabled) {
    const i = stephenHalos.intensity;
    const haloBackground = generateIrregularHalos(i);

    createOverlay(
      'visual-field-overlay-stephenHalosOnly',
      haloBackground,
      'screen',
      Math.min(0.55, 0.3 + i * 0.25).toString(),
      undefined,
      undefined,
      'stephenIrregularHalos'
    );
  }

  // Individual waviness effect
  if (stephenWaviness?.enabled && !stephenComplete?.enabled) {
    const i = stephenWaviness.intensity;
    const wavinessBackground = generateWavinessOverlay(i);

    createOverlay(
      'visual-field-overlay-stephenWavinessOnly',
      wavinessBackground,
      'overlay',
      Math.min(0.4, 0.2 + i * 0.2).toString(),
      undefined,
      undefined,
      'stephenWaviness'
    );
  }

  // Individual reduced contrast/haze effect
  if (stephenContrast?.enabled && !stephenComplete?.enabled) {
    const i = stephenContrast.intensity;
    const hazeBackground = `
      radial-gradient(ellipse 150% 150% at 50% 50%,
        rgba(200,200,205,${i * 0.15}) 0%,
        rgba(195,195,200,${i * 0.12}) 40%,
        rgba(190,190,195,${i * 0.08}) 80%,
        rgba(185,185,190,${i * 0.05}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenContrastOnly',
      hazeBackground,
      'screen',
      Math.min(0.6, 0.4 + i * 0.2).toString(),
      undefined,
      undefined,
      'stephenReducedContrast'
    );
  }

  // Individual asymmetry effect
  if (stephenAsymmetry?.enabled && !stephenComplete?.enabled) {
    const i = stephenAsymmetry.intensity;
    const asymmetryBackground = `
      linear-gradient(
        90deg,
        rgba(120,120,125,${i * 0.22}) 0%,
        rgba(130,130,135,${i * 0.15}) 20%,
        transparent 50%,
        rgba(135,135,140,${i * 0.06}) 85%,
        rgba(130,130,135,${i * 0.08}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-stephenAsymmetryOnly',
      asymmetryBackground,
      'overlay',
      Math.min(0.5, 0.3 + i * 0.2).toString(),
      `blur(${i * 1.5}px)`,
      undefined,
      'stephenAsymmetry'
    );
  }
};

/**
 * Generates ghosting/monocular polyopia overlay
 * Creates 2-4 faint duplicate "ghost" images offset from true position
 * Ghosts spread in consistent directional pattern (matching coma axis)
 */
function generateGhostingOverlay(intensity: number): string {
  const ghosts: string[] = [];

  // Ghost positions - offset in coma direction (inferior/downward-left)
  // Each ghost is a subtle duplicate shifted from center
  const ghostPositions = [
    { x: 48, y: 52, opacity: 0.15, size: 95 },  // Primary ghost - close, strong
    { x: 46, y: 54, opacity: 0.10, size: 90 },  // Secondary ghost - further, dimmer
    { x: 44, y: 56, opacity: 0.06, size: 85 },  // Tertiary ghost - distant, faint
    { x: 52, y: 48, opacity: 0.04, size: 92 },  // Opposite direction - very faint
  ];

  for (const ghost of ghostPositions) {
    ghosts.push(`
      radial-gradient(ellipse ${ghost.size}% ${ghost.size}% at ${ghost.x}% ${ghost.y}%,
        rgba(160,160,165,${intensity * ghost.opacity}) 0%,
        rgba(150,150,155,${intensity * ghost.opacity * 0.7}) 40%,
        rgba(140,140,145,${intensity * ghost.opacity * 0.4}) 70%,
        transparent 95%
      )
    `);
  }

  // Add streaking connecting the ghosts
  ghosts.push(`
    linear-gradient(
      160deg,
      transparent 0%,
      rgba(145,145,150,${intensity * 0.05}) 40%,
      rgba(145,145,150,${intensity * 0.08}) 50%,
      rgba(145,145,150,${intensity * 0.05}) 60%,
      transparent 100%
    )
  `);

  return ghosts.join(',\n');
}

/**
 * Generates irregular halos around simulated light positions
 * NOT circular - they have comet-like tails streaming in one direction
 */
function generateIrregularHalos(intensity: number): string {
  const halos: string[] = [];

  // Simulated light source positions with irregular halos
  const lightPositions = [
    { x: 50, y: 30, size: 18, tailLength: 25 },  // Center-top (arena light)
    { x: 25, y: 25, size: 14, tailLength: 20 },  // Upper left
    { x: 75, y: 25, size: 14, tailLength: 20 },  // Upper right
    { x: 50, y: 15, size: 12, tailLength: 18 },  // Top center (scoreboard)
    { x: 35, y: 20, size: 10, tailLength: 15 },  // Upper area
    { x: 65, y: 20, size: 10, tailLength: 15 },  // Upper area
  ];

  for (const light of lightPositions) {
    // Core bloom - irregular ellipse
    halos.push(`
      radial-gradient(ellipse ${light.size}% ${light.size * 0.8}% at ${light.x}% ${light.y}%,
        rgba(255,255,250,${intensity * 0.25}) 0%,
        rgba(255,255,245,${intensity * 0.15}) 40%,
        rgba(255,250,240,${intensity * 0.08}) 70%,
        transparent 100%
      )
    `);

    // Comet tail - streaming downward-left
    const tailEndX = light.x - light.tailLength * 0.3;
    const tailEndY = light.y + light.tailLength;
    halos.push(`
      radial-gradient(ellipse ${light.size * 0.6}% ${light.tailLength}% at ${tailEndX}% ${tailEndY}%,
        rgba(255,255,250,${intensity * 0.12}) 0%,
        rgba(255,250,245,${intensity * 0.08}) 30%,
        rgba(250,250,245,${intensity * 0.04}) 60%,
        transparent 100%
      )
    `);

    // Streaking rays from light source
    halos.push(`
      conic-gradient(
        from 150deg at ${light.x}% ${light.y}%,
        transparent 0deg,
        rgba(255,255,250,${intensity * 0.06}) 15deg,
        transparent 30deg,
        rgba(255,255,250,${intensity * 0.04}) 45deg,
        transparent 60deg,
        rgba(255,255,250,${intensity * 0.05}) 75deg,
        transparent 90deg,
        transparent 360deg
      )
    `);
  }

  return halos.join(',\n');
}

/**
 * Generates waviness overlay simulating irregular astigmatism
 * Creates subtle undulating distortion like heat-warped or old imperfect glass
 */
function generateWavinessOverlay(intensity: number): string {
  const waves: string[] = [];

  // Create alternating light/dark bands to simulate waviness
  // Non-uniform spacing reflects irregular corneal thinning
  const wavePositions = [
    { y: 15, width: 3, opacity: 0.06 },
    { y: 28, width: 4, opacity: 0.08 },
    { y: 42, width: 3, opacity: 0.05 },
    { y: 55, width: 5, opacity: 0.07 },
    { y: 68, width: 3, opacity: 0.06 },
    { y: 82, width: 4, opacity: 0.05 },
  ];

  for (const wave of wavePositions) {
    waves.push(`
      linear-gradient(
        0deg,
        transparent ${wave.y - wave.width}%,
        rgba(140,140,145,${intensity * wave.opacity}) ${wave.y - wave.width / 2}%,
        rgba(130,130,135,${intensity * wave.opacity * 1.2}) ${wave.y}%,
        rgba(140,140,145,${intensity * wave.opacity}) ${wave.y + wave.width / 2}%,
        transparent ${wave.y + wave.width}%
      )
    `);
  }

  // Add vertical waves too (crossing pattern)
  const verticalWaves = [
    { x: 20, width: 4, opacity: 0.05 },
    { x: 40, width: 3, opacity: 0.06 },
    { x: 60, width: 4, opacity: 0.05 },
    { x: 80, width: 3, opacity: 0.06 },
  ];

  for (const wave of verticalWaves) {
    waves.push(`
      linear-gradient(
        90deg,
        transparent ${wave.x - wave.width}%,
        rgba(135,135,140,${intensity * wave.opacity}) ${wave.x - wave.width / 2}%,
        rgba(125,125,130,${intensity * wave.opacity * 1.2}) ${wave.x}%,
        rgba(135,135,140,${intensity * wave.opacity}) ${wave.x + wave.width / 2}%,
        transparent ${wave.x + wave.width}%
      )
    `);
  }

  return waves.join(',\n');
}
