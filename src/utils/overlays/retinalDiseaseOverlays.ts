import { VisualEffect } from '../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from './overlayHelpers';

/**
 * Creates overlays for retinal disease conditions
 * Includes: glaucoma, AMD, diabetic retinopathy, stargardt, retinitis pigmentosa, retinal detachment
 */
export const createRetinalDiseaseOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  const glaucoma = getEffect('glaucoma');
  const amd = getEffect('amd');
  const diabeticRetinopathy = getEffect('diabeticRetinopathy');
  const stargardt = getEffect('stargardt');
  const retinitisPigmentosa = getEffect('retinitisPigmentosa');
  const retinalDetachment = getEffect('retinalDetachment');

  // Glaucoma - Improved with arcuate defects, nasal step, and realistic field patterns
  if (glaucoma?.enabled) {
    const intensity = glaucoma.intensity;

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
    // These appear in the superior and inferior arcuate regions (Bjerrum area)
    const arcuatePatterns: string[] = [];

    // Superior arcuate defect (more common, appears above fixation)
    if (intensity > 0.2) {
      const superiorArcOpacity = Math.min(0.8, (intensity - 0.2) * 1.2);
      // Arc curves from blind spot area (15 degrees from center) to nasal side
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
    // This occurs because nerve fibers from superior and inferior retina meet at horizontal raphe
    if (intensity > 0.3) {
      const nasalStepOpacity = Math.min(0.7, (intensity - 0.3) * 1.0);
      // Nasal step appears as an asymmetric loss on one side of horizontal midline
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
      // Small scotomas in the paracentral region (within 10 degrees of fixation)
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

    // CSS filters for blur, contrast reduction, and slight brightness reduction
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

  // Stargardt Disease - Improved with ring scotoma pattern and yellow/brown lipofuscin tint
  if (stargardt?.enabled) {
    const intensity = stargardt.intensity;

    // Stargardt creates a ring/annular scotoma pattern (not a filled circle)
    // The fovea may be relatively spared initially, with damage in the perifoveal ring
    const innerRadius = Math.max(3, 8 - intensity * 5); // Inner preserved area shrinks with progression
    const ringStart = innerRadius + 2;
    const ringPeak = 15 + intensity * 20; // Peak of the scotoma ring
    const ringEnd = ringPeak + 10 + intensity * 15;

    // Stargardt has characteristic yellow/brown lipofuscin deposits
    // This creates a warm brownish tint to the scotoma
    const brownR = 60 + (1 - intensity) * 20;
    const brownG = 45 + (1 - intensity) * 15;
    const brownB = 25 + (1 - intensity) * 10;

    // Ring scotoma pattern - darkest in the perifoveal ring, lighter at center and periphery
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

    // Add yellow flecks pattern (characteristic of Stargardt - "beaten bronze" appearance)
    const fleckPatterns: string[] = [];
    const numFlecks = Math.floor(6 + intensity * 12);

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numFlecks; i++) {
      const seed = i * 5.73;
      // Flecks appear in the perifoveal region
      const angle = seededRandom(seed) * Math.PI * 2;
      const distance = ringStart + seededRandom(seed + 1) * (ringEnd - ringStart);
      const x = 50 + Math.cos(angle) * distance * 0.7;
      const y = 50 + Math.sin(angle) * distance * 0.7;
      const size = 1 + seededRandom(seed + 2) * 2.5;
      const fleckOpacity = (0.3 + seededRandom(seed + 3) * 0.4) * intensity;

      // Yellow-orange flecks (lipofuscin deposits)
      fleckPatterns.push(`
        radial-gradient(circle ${size}% at ${x}% ${y}%,
          rgba(180,150,60,${fleckOpacity}) 0%,
          rgba(160,130,50,${fleckOpacity * 0.5}) 50%,
          transparent 100%
        )
      `);
    }

    const combinedBackground = `${ringScotoma}${fleckPatterns.length > 0 ? ', ' + fleckPatterns.join(', ') : ''}`;

    // Color perception is affected - reduced color saturation and slight warm shift
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

  // Age-Related Macular Degeneration (AMD) - Improved with drusen, metamorphopsia, and irregular scotoma
  // Lower intensity = early/dry AMD (drusen spots), higher intensity = advanced/wet AMD (distortion + scotoma)
  if (amd?.enabled) {
    const intensity = amd.intensity;

    // Central scotoma with irregular edges (not a perfect circle)
    const baseRadius = Math.max(12, 45 - intensity * 33);

    // Use gray tones instead of pure black for more realistic appearance
    const grayValue = 30 + (1 - intensity) * 25;

    // Main scotoma - irregular shape using multiple offset gradients
    const mainScotoma = `radial-gradient(ellipse 105% 95% at 50% 50%,
      rgba(${grayValue},${grayValue},${grayValue + 5},${0.9 * intensity}) 0%,
      rgba(${grayValue},${grayValue},${grayValue + 5},${0.85 * intensity}) ${baseRadius - 8}%,
      rgba(${grayValue + 10},${grayValue + 10},${grayValue + 15},${0.6 * intensity}) ${baseRadius - 3}%,
      rgba(${grayValue + 20},${grayValue + 20},${grayValue + 25},${0.3 * intensity}) ${baseRadius + 2}%,
      transparent ${baseRadius + 8}%
    )`;

    // Secondary irregular edge (creates more natural boundary)
    const irregularEdge = `radial-gradient(ellipse 90% 110% at 52% 48%,
      rgba(${grayValue + 5},${grayValue + 5},${grayValue + 10},${0.7 * intensity}) 0%,
      rgba(${grayValue + 5},${grayValue + 5},${grayValue + 10},${0.5 * intensity}) ${baseRadius - 5}%,
      transparent ${baseRadius + 3}%
    )`;

    // Drusen spots (yellow deposits) - characteristic of dry AMD
    // More visible at lower intensities, become obscured by scotoma at higher intensities
    const drusenPatterns: string[] = [];
    const numDrusen = Math.floor(8 + (1 - intensity) * 15); // More drusen visible in early stages

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numDrusen; i++) {
      const seed = i * 4.29;
      // Drusen appear in and around the macular region
      const angle = seededRandom(seed) * Math.PI * 2;
      const distance = 5 + seededRandom(seed + 1) * (baseRadius + 15);
      const x = 50 + Math.cos(angle) * distance * 0.6;
      const y = 50 + Math.sin(angle) * distance * 0.5;
      const size = 1.5 + seededRandom(seed + 2) * 3;
      // Drusen are more visible in early stages
      const drusenOpacity = (0.2 + seededRandom(seed + 3) * 0.3) * (1.2 - intensity * 0.7);

      // Yellow-white drusen spots
      drusenPatterns.push(`
        radial-gradient(circle ${size}% at ${x}% ${y}%,
          rgba(220,200,120,${drusenOpacity}) 0%,
          rgba(200,180,100,${drusenOpacity * 0.6}) 50%,
          transparent 100%
        )
      `);
    }

    // Metamorphopsia effect (wavy distortion) - characteristic of wet AMD
    // This creates a subtle distortion pattern around the scotoma edge
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

        // Subtle wavy distortion lines
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

    // Contrast and color perception affected
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

  // Diabetic Retinopathy
  if (diabeticRetinopathy?.enabled) {
    const intensity = diabeticRetinopathy.intensity;
    
    const microaneurysms = `
      radial-gradient(circle 3px at 25% 35%, 
        rgba(0,0,0,${0.9 * intensity}) 0%, 
        rgba(0,0,0,${0.6 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 65% 55%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 4px at 45% 75%, 
        rgba(0,0,0,${0.7 * intensity}) 0%, 
        rgba(0,0,0,${0.4 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2.5px at 80% 25%, 
        rgba(0,0,0,${0.85 * intensity}) 0%, 
        rgba(0,0,0,${0.55 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 3px at 30% 60%, 
        rgba(0,0,0,${0.75 * intensity}) 0%, 
        rgba(0,0,0,${0.45 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 70% 40%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      )
    `;
    
    const cottonWoolSpots = `
      radial-gradient(ellipse 15px 10px at 60% 40%, 
        rgba(255,255,255,${0.6 * intensity}) 0%, 
        rgba(255,255,255,${0.3 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 12px 8px at 30% 70%, 
        rgba(255,255,255,${0.5 * intensity}) 0%, 
        rgba(255,255,255,${0.25 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 10px 7px at 55% 20%, 
        rgba(255,255,255,${0.4 * intensity}) 0%, 
        rgba(255,255,255,${0.2 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      )
    `;
    
    const vitreousHemorrhage = `
      radial-gradient(circle at 50% 50%, 
        rgba(139,0,0,${0.3 * intensity}) 0%, 
        rgba(139,0,0,${0.2 * intensity}) 30%,
        rgba(139,0,0,${0.1 * intensity}) 60%,
        rgba(139,0,0,0) 100%
      )
    `;
    
    const diabeticRetinopathyBackground = `${microaneurysms}, ${cottonWoolSpots}, ${vitreousHemorrhage}`;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-diabeticRetinopathy',
        diabeticRetinopathyBackground,
        'normal',
        Math.min(0.9, intensity).toString(),
        `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`,
        undefined,
        'diabeticRetinopathy',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-diabeticRetinopathy',
        diabeticRetinopathyBackground,
        'normal',
        Math.min(0.9, intensity).toString(),
        `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`,
        undefined,
        'diabeticRetinopathy'
      );
    }
  }

  // Retinal Detachment
  if (retinalDetachment?.enabled) {
    const intensity = retinalDetachment.intensity;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-retinalDetachment',
        `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`,
        'multiply',
        Math.min(0.8, intensity).toString(),
        `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`,
        undefined,
        'retinalDetachment',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-retinalDetachment',
        `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`,
        'multiply',
        Math.min(0.8, intensity).toString(),
        `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`,
        undefined,
        'retinalDetachment'
      );
    }
  }

  // Retinitis Pigmentosa - Improved with realistic gray fades, scotomas, and color desaturation
  if (retinitisPigmentosa?.enabled) {
    const intensity = retinitisPigmentosa.intensity;
    const tunnelRadius = Math.max(5, 35 - intensity * 30);

    // Use dark gray/brown tones instead of pure black (more realistic)
    // Real RP fades to a dark brownish-gray, not pure black
    const grayR = 35 + (1 - intensity) * 20; // 35-55 range
    const grayG = 30 + (1 - intensity) * 18; // 30-48 range
    const grayB = 25 + (1 - intensity) * 15; // 25-40 range (slightly warm/brown tint)

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
    // These appear in the mid-peripheral region
    const scotomaPatterns: string[] = [];
    const numScotomas = Math.floor(3 + intensity * 8);

    // Seeded pseudo-random for consistent scotoma positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numScotomas; i++) {
      const seed = i * 7.31;
      // Position scotomas in the mid-peripheral region (between tunnel edge and outer darkness)
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

    // Add color desaturation filter (RP affects color perception in peripheral areas)
    // Also slight contrast reduction and brightness adjustment for "night blindness" effect
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
};
