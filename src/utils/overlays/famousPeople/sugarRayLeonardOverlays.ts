import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Sugar Ray Leonard's Partial Retinal Detachment (Left Eye, 1982)
 *
 * Key visual characteristics:
 * 1. Dark curtain/shade from upper periphery (30-40% coverage)
 * 2. Numerous floaters (specks, strands, cobwebs, blobs)
 * 3. Peripheral light flashes (photopsia)
 * 4. Overall haziness and muted colors
 * 5. Asymmetric pressure sensation on left side
 * 6. Central vision intact but threatened
 *
 * This is monocular (left eye only) - the right eye was normal.
 */
export const createSugarRayLeonardOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const sugarComplete = getEffect('sugarRetinalDetachmentComplete');
  const sugarDarkCurtain = getEffect('sugarDarkCurtain');
  const sugarFloaters = getEffect('sugarFloaters');
  const sugarLeftEyePressure = getEffect('sugarLeftEyePressure');

  // Sugar Ray Leonard - Complete Retinal Detachment Experience
  if (sugarComplete?.enabled) {
    const i = sugarComplete.intensity;

    // 1. DARK CURTAIN - encroaching from upper/upper-left periphery
    // Like a lowered window shade, covering 30-40% of vision
    // Soft, irregular, undulating border - not a crisp geometric line
    const darkCurtainSize = 30 + i * 15; // 30-45% coverage
    const curtainBackground = `
      linear-gradient(
        165deg,
        rgba(25,25,30,${i * 0.95}) 0%,
        rgba(30,30,35,${i * 0.92}) ${darkCurtainSize * 0.3}%,
        rgba(35,35,40,${i * 0.88}) ${darkCurtainSize * 0.5}%,
        rgba(40,40,45,${i * 0.80}) ${darkCurtainSize * 0.7}%,
        rgba(50,50,55,${i * 0.60}) ${darkCurtainSize * 0.85}%,
        rgba(70,70,75,${i * 0.35}) ${darkCurtainSize * 0.95}%,
        rgba(90,90,95,${i * 0.15}) ${darkCurtainSize}%,
        transparent ${darkCurtainSize + 8}%
      ),
      radial-gradient(
        ellipse 120% 80% at 25% -10%,
        rgba(20,20,25,${i * 0.90}) 0%,
        rgba(30,30,35,${i * 0.75}) 30%,
        rgba(45,45,50,${i * 0.50}) 55%,
        rgba(70,70,75,${i * 0.25}) 75%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-sugarDarkCurtain',
      curtainBackground,
      'multiply',
      '1',
      undefined,
      undefined,
      'sugarRetinalDetachmentComplete'
    );

    // 2. FLOATERS - various types scattered across visible field
    // Mix of specks, strands, cobwebs, and cloudy blobs
    const floatersBackground = generateFloatersGradient(i);

    createOverlay(
      'visual-field-overlay-sugarFloaters',
      floatersBackground,
      'multiply',
      Math.min(0.85, 0.5 + i * 0.35).toString(),
      `blur(${0.5 + i * 0.5}px)`,
      undefined,
      'sugarRetinalDetachmentComplete'
    );

    // 3. HAZINESS OVERLAY - milky haze across vision
    const hazinessBackground = `
      radial-gradient(ellipse 100% 100% at 50% 50%,
        rgba(200,200,205,${i * 0.12}) 0%,
        rgba(190,190,195,${i * 0.10}) 30%,
        rgba(180,180,185,${i * 0.08}) 60%,
        rgba(170,170,175,${i * 0.06}) 100%
      ),
      linear-gradient(
        180deg,
        rgba(180,180,185,${i * 0.15}) 0%,
        rgba(190,190,195,${i * 0.08}) 40%,
        transparent 70%
      )
    `;

    createOverlay(
      'visual-field-overlay-sugarHaziness',
      hazinessBackground,
      'screen',
      Math.min(0.6, 0.3 + i * 0.3).toString(),
      undefined,
      undefined,
      'sugarRetinalDetachmentComplete'
    );

    // 4. LEFT EYE PRESSURE/SWELLING - compression on left side
    const leftPressureBackground = `
      linear-gradient(
        90deg,
        rgba(20,20,25,${i * 0.40}) 0%,
        rgba(30,30,35,${i * 0.30}) 8%,
        rgba(50,50,55,${i * 0.18}) 15%,
        rgba(80,80,85,${i * 0.08}) 25%,
        transparent 40%
      ),
      radial-gradient(
        ellipse 40% 100% at 0% 50%,
        rgba(25,25,30,${i * 0.35}) 0%,
        rgba(40,40,45,${i * 0.20}) 40%,
        transparent 80%
      )
    `;

    createOverlay(
      'visual-field-overlay-sugarLeftPressure',
      leftPressureBackground,
      'multiply',
      '1',
      undefined,
      undefined,
      'sugarRetinalDetachmentComplete'
    );
  }

  // Individual dark curtain effect
  if (sugarDarkCurtain?.enabled && !sugarComplete?.enabled) {
    const i = sugarDarkCurtain.intensity;
    const darkCurtainSize = 30 + i * 15;

    const curtainBackground = `
      linear-gradient(
        165deg,
        rgba(25,25,30,${i * 0.95}) 0%,
        rgba(35,35,40,${i * 0.85}) ${darkCurtainSize * 0.6}%,
        rgba(60,60,65,${i * 0.50}) ${darkCurtainSize * 0.9}%,
        transparent ${darkCurtainSize + 10}%
      ),
      radial-gradient(
        ellipse 100% 70% at 30% 0%,
        rgba(20,20,25,${i * 0.85}) 0%,
        rgba(40,40,45,${i * 0.55}) 50%,
        transparent 90%
      )
    `;

    createOverlay(
      'visual-field-overlay-sugarDarkCurtainOnly',
      curtainBackground,
      'multiply',
      '1',
      undefined,
      undefined,
      'sugarDarkCurtain'
    );
  }

  // Individual floaters effect
  if (sugarFloaters?.enabled && !sugarComplete?.enabled) {
    const i = sugarFloaters.intensity;
    const floatersBackground = generateFloatersGradient(i);

    createOverlay(
      'visual-field-overlay-sugarFloatersOnly',
      floatersBackground,
      'multiply',
      Math.min(0.85, 0.5 + i * 0.35).toString(),
      `blur(${0.5 + i * 0.5}px)`,
      undefined,
      'sugarFloaters'
    );
  }

  // Individual left eye pressure effect
  if (sugarLeftEyePressure?.enabled && !sugarComplete?.enabled) {
    const i = sugarLeftEyePressure.intensity;

    const pressureBackground = `
      linear-gradient(
        90deg,
        rgba(20,20,25,${i * 0.45}) 0%,
        rgba(40,40,45,${i * 0.25}) 12%,
        rgba(70,70,75,${i * 0.10}) 25%,
        transparent 45%
      )
    `;

    createOverlay(
      'visual-field-overlay-sugarLeftPressureOnly',
      pressureBackground,
      'multiply',
      '1',
      undefined,
      undefined,
      'sugarLeftEyePressure'
    );
  }
};

/**
 * Generates floaters gradient background
 * Creates various types: specks, strands, cobwebs, blobs
 */
function generateFloatersGradient(intensity: number): string {
  const floaters: string[] = [];

  // Small dark specks (like gnats) - 8-10 of them
  const speckPositions = [
    { x: 25, y: 35, size: 1.5 },
    { x: 45, y: 25, size: 1.2 },
    { x: 60, y: 45, size: 1.8 },
    { x: 35, y: 55, size: 1.3 },
    { x: 70, y: 35, size: 1.5 },
    { x: 55, y: 65, size: 1.4 },
    { x: 40, y: 70, size: 1.2 },
    { x: 65, y: 55, size: 1.6 },
    { x: 30, y: 45, size: 1.1 },
    { x: 50, y: 40, size: 1.3 }
  ];

  for (const speck of speckPositions) {
    floaters.push(`
      radial-gradient(circle at ${speck.x}% ${speck.y}%,
        rgba(40,40,45,${intensity * 0.7}) 0%,
        rgba(50,50,55,${intensity * 0.5}) ${speck.size}%,
        transparent ${speck.size * 2}%
      )
    `);
  }

  // Squiggly strands/worm-like shapes - 4-5 of them (using elongated ellipses)
  const strandPositions = [
    { x: 38, y: 42, w: 8, h: 2, angle: 25 },
    { x: 58, y: 38, w: 10, h: 1.5, angle: -15 },
    { x: 45, y: 58, w: 7, h: 2, angle: 40 },
    { x: 62, y: 48, w: 9, h: 1.8, angle: -30 },
    { x: 32, y: 52, w: 6, h: 1.5, angle: 10 }
  ];

  for (const strand of strandPositions) {
    floaters.push(`
      radial-gradient(ellipse ${strand.w}% ${strand.h}% at ${strand.x}% ${strand.y}%,
        rgba(45,45,50,${intensity * 0.55}) 0%,
        rgba(55,55,60,${intensity * 0.35}) 50%,
        transparent 100%
      )
    `);
  }

  // Cobweb-like filaments - larger, more diffuse
  const cobwebPositions = [
    { x: 42, y: 48, size: 12 },
    { x: 55, y: 42, size: 15 },
    { x: 48, y: 55, size: 10 }
  ];

  for (const cobweb of cobwebPositions) {
    floaters.push(`
      radial-gradient(ellipse ${cobweb.size}% ${cobweb.size * 0.7}% at ${cobweb.x}% ${cobweb.y}%,
        rgba(50,50,55,${intensity * 0.30}) 0%,
        rgba(60,60,65,${intensity * 0.20}) 40%,
        rgba(70,70,75,${intensity * 0.10}) 70%,
        transparent 100%
      )
    `);
  }

  // Larger amorphous cloudy blobs - 2-3 of them
  const blobPositions = [
    { x: 45, y: 45, w: 18, h: 14 },
    { x: 58, y: 52, w: 15, h: 12 }
  ];

  for (const blob of blobPositions) {
    floaters.push(`
      radial-gradient(ellipse ${blob.w}% ${blob.h}% at ${blob.x}% ${blob.y}%,
        rgba(55,55,60,${intensity * 0.25}) 0%,
        rgba(65,65,70,${intensity * 0.18}) 30%,
        rgba(80,80,85,${intensity * 0.10}) 60%,
        transparent 100%
      )
    `);
  }

  return floaters.join(',\n');
}
