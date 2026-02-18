import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for David Brown's Kawasaki Disease to Glaucoma
 *
 * A dual-phase, asymmetric progression from confused adaptation to sudden devastation.
 *
 * Phase 1: "Kawasaki Eyes" (0-12%) — Infancy to age 3
 * - Both eyes early damage: subtle haze, rainbow halos, peripheral softening
 * - Left eye catastrophe at age 3: goes to flat dark gray (not black)
 *
 * Phase 2: "I Thought Everyone Played Like I Did" (13-25%) — Ages 3-8
 * - Monocular, hazy but functional
 * - Dirty-glass effect, reduced contrast, beginning peripheral loss
 * - Colors muted but present, no depth perception
 *
 * Phase 3: "Afraid of Either Extremes" (26-50%) — Ages 6-12
 * - Outdoor nightmare: too bright (blown out, painful glare)
 * - Indoor nightmare: too dark (murky near-darkness)
 * - Sweet spot: narrow tolerable band
 * - Tunnel vision advancing, intensifying halos, pain intrusions
 *
 * Phase 4: "One Minute I'm Able to See" (51-90%) — Age 13
 * - Rapid collapse: tunnel constricts, colors drain, then nothing
 *
 * Phase Final: "I Ended Up Snapping" (91-100%) — Age 13 onward
 * - Total blindness with ongoing pain pulses
 */
export const createDavidBrownOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const davidComplete = getEffect('davidKawasakiGlaucomaComplete');
  const davidKawasaki = getEffect('davidKawasakiEyes');
  const davidLeftLoss = getEffect('davidLeftEyeLoss');
  const davidMonocular = getEffect('davidMonocularHaze');
  const davidOutdoor = getEffect('davidOutdoorNightmare');
  const davidIndoor = getEffect('davidIndoorNightmare');
  const davidSweet = getEffect('davidSweetSpot');
  const davidPain = getEffect('davidPainIntrusions');
  const davidCollapse = getEffect('davidFinalCollapse');
  const davidOngoing = getEffect('davidOngoingPain');

  // Helper: Create left eye blindness (flat dark gray, not black)
  const createLeftEyeBlindness = (id: string, opacity: number, conditionId: string) => {
    // Dead eye - flat dark gray (may still transmit some non-visual light sensation)
    // Not true black, but a muted, lifeless gray
    const leftBlindness = `
      linear-gradient(
        90deg,
        rgba(35,32,30,${opacity}) 0%,
        rgba(35,32,30,${opacity}) 44%,
        rgba(35,32,30,${opacity * 0.7}) 47%,
        rgba(35,32,30,${opacity * 0.3}) 49%,
        transparent 52%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-leftBlind`,
      leftBlindness,
      'normal',
      '1',
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create rainbow halos around light sources (glaucoma corneal edema)
  const createRainbowHalos = (id: string, intensity: number, conditionId: string) => {
    const halos: string[] = [];

    // Simulated light source positions
    const lightPositions = [
      { x: 65, y: 20, size: 18 },   // Upper right (main light)
      { x: 80, y: 35, size: 14 },   // Window
      { x: 55, y: 45, size: 12 },   // Secondary light
      { x: 70, y: 60, size: 10 },   // Lamp
      { x: 90, y: 25, size: 8 },    // Small light
    ];

    for (const light of lightPositions) {
      // Prismatic rainbow rings - red outside, violet inside
      // Characteristic of corneal edema from elevated IOP
      halos.push(`
        radial-gradient(circle at ${light.x}% ${light.y}%,
          rgba(255,255,255,${intensity * 0.4}) 0%,
          rgba(148,0,211,${intensity * 0.25}) ${light.size * 0.15}%,
          rgba(75,0,130,${intensity * 0.22}) ${light.size * 0.25}%,
          rgba(0,0,255,${intensity * 0.20}) ${light.size * 0.35}%,
          rgba(0,255,0,${intensity * 0.18}) ${light.size * 0.45}%,
          rgba(255,255,0,${intensity * 0.18}) ${light.size * 0.55}%,
          rgba(255,165,0,${intensity * 0.20}) ${light.size * 0.65}%,
          rgba(255,0,0,${intensity * 0.22}) ${light.size * 0.80}%,
          transparent ${light.size}%
        )
      `);
    }

    createOverlay(
      `visual-field-overlay-${id}-rainbowHalos`,
      halos.join(',\n'),
      'screen',
      Math.min(0.9, 0.5 + intensity * 0.4).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create dirty glass haze (petroleum jelly effect)
  const createDirtyGlassHaze = (id: string, intensity: number, conditionId: string) => {
    // Diffuse, milky-translucent haze - like a window that hasn't been cleaned
    // Thinner than cataract opacity, more atmospheric
    const haze = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(220,215,210,${intensity * 0.35}) 0%,
        rgba(215,210,205,${intensity * 0.32}) 25%,
        rgba(210,205,200,${intensity * 0.28}) 50%,
        rgba(205,200,195,${intensity * 0.25}) 75%,
        rgba(200,195,190,${intensity * 0.22}) 100%
      ),
      linear-gradient(
        180deg,
        rgba(225,220,215,${intensity * 0.20}) 0%,
        rgba(218,213,208,${intensity * 0.18}) 50%,
        rgba(225,220,215,${intensity * 0.20}) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-dirtyGlass`,
      haze,
      'screen',
      Math.min(0.85, 0.4 + intensity * 0.45).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create soft peripheral vignette (glaucoma field loss)
  const createPeripheralVignette = (id: string, intensity: number, fieldPercent: number, conditionId: string) => {
    // Soft, gradual vignette - NOT sharp-edged tunnel vision
    // Gray-murky dissolve, not black edges
    const vignette = `
      radial-gradient(ellipse ${fieldPercent}% ${fieldPercent}% at 60% 50%,
        transparent 0%,
        transparent ${fieldPercent * 0.4}%,
        rgba(60,55,50,${intensity * 0.15}) ${fieldPercent * 0.55}%,
        rgba(50,45,40,${intensity * 0.30}) ${fieldPercent * 0.70}%,
        rgba(40,35,32,${intensity * 0.50}) ${fieldPercent * 0.82}%,
        rgba(35,32,28,${intensity * 0.70}) ${fieldPercent * 0.92}%,
        rgba(30,28,25,${intensity * 0.85}) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-vignette`,
      vignette,
      'multiply',
      '1',
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create outdoor glare nightmare (blown out, painful)
  const createOutdoorGlare = (id: string, intensity: number, conditionId: string) => {
    // Painful blinding glare - sky as featureless white blaze
    // Reflective surfaces produce searing starbursts
    const glare = `
      radial-gradient(ellipse 250% 250% at 60% 30%,
        rgba(255,255,255,${0.7 + intensity * 0.25}) 0%,
        rgba(255,252,248,${0.6 + intensity * 0.25}) 20%,
        rgba(255,250,245,${0.5 + intensity * 0.25}) 40%,
        rgba(255,248,242,${0.4 + intensity * 0.20}) 60%,
        rgba(252,245,238,${0.25 + intensity * 0.15}) 80%,
        rgba(250,242,235,${0.15 + intensity * 0.10}) 100%
      ),
      radial-gradient(circle at 75% 25%,
        rgba(255,255,255,${0.8 + intensity * 0.15}) 0%,
        rgba(255,255,250,${0.5 + intensity * 0.20}) 15%,
        rgba(255,252,245,${0.3 + intensity * 0.15}) 30%,
        transparent 50%
      ),
      radial-gradient(circle at 85% 40%,
        rgba(255,255,255,${0.6 + intensity * 0.15}) 0%,
        rgba(255,252,248,${0.4 + intensity * 0.15}) 10%,
        transparent 35%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-outdoorGlare`,
      glare,
      'screen',
      '1',
      undefined,
      undefined,
      conditionId
    );

    // Overlapping rainbow halos that bleed into each other
    createRainbowHalos(`${id}-outdoor`, intensity * 1.5, conditionId);
  };

  // Helper: Create indoor darkness nightmare (murky, soupy)
  const createIndoorDarkness = (id: string, intensity: number, conditionId: string) => {
    // Murky near-darkness - furniture as darker shadows, doorways as lighter rectangles
    const darkness = `
      linear-gradient(
        180deg,
        rgba(20,18,15,${0.75 + intensity * 0.15}) 0%,
        rgba(18,16,13,${0.78 + intensity * 0.15}) 30%,
        rgba(15,13,10,${0.80 + intensity * 0.15}) 60%,
        rgba(18,16,13,${0.78 + intensity * 0.15}) 100%
      ),
      radial-gradient(ellipse 150% 150% at 60% 50%,
        rgba(25,22,18,${0.65 + intensity * 0.20}) 0%,
        rgba(20,18,14,${0.72 + intensity * 0.18}) 40%,
        rgba(15,13,10,${0.80 + intensity * 0.15}) 80%,
        rgba(12,10,8,${0.85 + intensity * 0.12}) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-indoorDark`,
      darkness,
      'multiply',
      '1',
      undefined,
      undefined,
      conditionId
    );

    // Add dirty glass effect that absorbs light
    const absorbingHaze = `
      radial-gradient(ellipse 180% 180% at 60% 50%,
        rgba(40,35,30,${0.4 + intensity * 0.25}) 0%,
        rgba(35,30,25,${0.45 + intensity * 0.25}) 40%,
        rgba(30,25,20,${0.50 + intensity * 0.25}) 80%,
        rgba(25,20,15,${0.55 + intensity * 0.20}) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-indoorHaze`,
      absorbingHaze,
      'multiply',
      Math.min(0.9, 0.5 + intensity * 0.4).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create pain intrusion visual artifacts
  const createPainArtifacts = (id: string, intensity: number, conditionId: string) => {
    // Photopsias and distortion from pressure on optic nerve
    // Crushing sensation - warping, constricting, throbbing
    const artifacts = `
      radial-gradient(ellipse 120% 120% at 60% 50%,
        transparent 0%,
        transparent 30%,
        rgba(80,20,20,${intensity * 0.15}) 50%,
        rgba(60,10,10,${intensity * 0.25}) 70%,
        rgba(40,5,5,${intensity * 0.35}) 85%,
        rgba(30,0,0,${intensity * 0.45}) 100%
      ),
      radial-gradient(circle at 55% 45%,
        rgba(255,200,180,${intensity * 0.20}) 0%,
        rgba(255,180,150,${intensity * 0.15}) 10%,
        transparent 25%
      ),
      radial-gradient(circle at 70% 55%,
        rgba(255,220,200,${intensity * 0.15}) 0%,
        transparent 20%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-painArtifacts`,
      artifacts,
      'overlay',
      Math.min(0.85, 0.4 + intensity * 0.45).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create final collapse (rapid deterioration)
  const createFinalCollapse = (id: string, phase: number, conditionId: string) => {
    // Phase 0-1 within collapse: tunnel constricts, colors drain, darkness
    if (phase < 0.4) {
      // Tunnel rapidly constricting
      const collapsePhase = phase / 0.4;
      const fieldSize = 50 - collapsePhase * 30; // 50% down to 20%

      const constricting = `
        radial-gradient(ellipse ${fieldSize}% ${fieldSize}% at 60% 50%,
          transparent 0%,
          transparent ${fieldSize * 0.3}%,
          rgba(25,22,18,${0.5 + collapsePhase * 0.3}) ${fieldSize * 0.5}%,
          rgba(18,15,12,${0.7 + collapsePhase * 0.2}) ${fieldSize * 0.7}%,
          rgba(10,8,6,${0.85 + collapsePhase * 0.1}) ${fieldSize * 0.85}%,
          rgba(5,4,3,${0.92 + collapsePhase * 0.06}) 100%
        )
      `;

      createOverlay(
        `visual-field-overlay-${id}-collapse`,
        constricting,
        'normal',
        '1',
        undefined,
        undefined,
        conditionId
      );
    } else if (phase < 0.7) {
      // Colors draining to gray-brown
      const drainPhase = (phase - 0.4) / 0.3;

      const draining = `
        radial-gradient(ellipse 20% 20% at 60% 50%,
          rgba(80,70,60,${0.3 + drainPhase * 0.4}) 0%,
          rgba(60,50,42,${0.5 + drainPhase * 0.3}) 30%,
          rgba(35,28,22,${0.75 + drainPhase * 0.15}) 60%,
          rgba(15,12,10,${0.90 + drainPhase * 0.08}) 100%
        )
      `;

      createOverlay(
        `visual-field-overlay-${id}-draining`,
        draining,
        'normal',
        '1',
        undefined,
        undefined,
        conditionId
      );
    } else {
      // Tiny island of dim light, then nothing
      const finalPhase = (phase - 0.7) / 0.3;

      const finalIsland = `
        radial-gradient(ellipse ${10 - finalPhase * 10}% ${10 - finalPhase * 10}% at 60% 50%,
          rgba(45,40,35,${0.5 - finalPhase * 0.5}) 0%,
          rgba(25,22,18,${0.7 - finalPhase * 0.4}) 50%,
          rgba(8,6,5,${0.92 + finalPhase * 0.06}) 100%
        ),
        linear-gradient(
          180deg,
          rgba(5,4,3,${0.90 + finalPhase * 0.08}) 0%,
          rgba(3,2,2,${0.92 + finalPhase * 0.06}) 50%,
          rgba(5,4,3,${0.90 + finalPhase * 0.08}) 100%
        )
      `;

      createOverlay(
        `visual-field-overlay-${id}-final`,
        finalIsland,
        'normal',
        '1',
        undefined,
        undefined,
        conditionId
      );
    }
  };

  // Helper: Create ongoing pain in total darkness
  const createOngoingPainDarkness = (id: string, intensity: number, conditionId: string) => {
    // Absolute darkness with throbbing pain pulse
    // Deep red-purple pressure emanating from behind the blackness
    const painDarkness = `
      linear-gradient(
        180deg,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,1) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-totalDark`,
      painDarkness,
      'normal',
      '1',
      undefined,
      undefined,
      conditionId
    );

    // Subtle pain pulse visualization (not light, but pressure sensation)
    const painPulse = `
      radial-gradient(ellipse 60% 60% at 40% 50%,
        rgba(50,10,25,${intensity * 0.20}) 0%,
        rgba(35,5,18,${intensity * 0.15}) 30%,
        rgba(20,2,10,${intensity * 0.10}) 60%,
        transparent 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-painPulse`,
      painPulse,
      'screen',
      Math.min(0.6, intensity * 0.6).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Complete Kawasaki-Glaucoma Progression
  if (davidComplete?.enabled) {
    const i = davidComplete.intensity;

    // Left eye always affected (goes fully blind at age 3)
    if (i > 0.08) {
      // After early phase, left eye is completely blind
      createLeftEyeBlindness('davidComplete', Math.min(1, (i - 0.08) * 8), 'davidKawasakiGlaucomaComplete');
    }

    if (i <= 0.12) {
      // Phase 1: Kawasaki Eyes (0-12%) - bilateral haze, halos
      const phaseI = i / 0.12;

      createDirtyGlassHaze('davidP1', 0.3 + phaseI * 0.3, 'davidKawasakiGlaucomaComplete');
      createRainbowHalos('davidP1', 0.4 + phaseI * 0.3, 'davidKawasakiGlaucomaComplete');
      createPeripheralVignette('davidP1', 0.2 + phaseI * 0.2, 85 - phaseI * 10, 'davidKawasakiGlaucomaComplete');

    } else if (i <= 0.25) {
      // Phase 2: Left eye loss + monocular haze (13-25%)
      const phaseI = (i - 0.12) / 0.13;

      createDirtyGlassHaze('davidP2', 0.6 + phaseI * 0.2, 'davidKawasakiGlaucomaComplete');
      createRainbowHalos('davidP2', 0.7 + phaseI * 0.15, 'davidKawasakiGlaucomaComplete');
      createPeripheralVignette('davidP2', 0.4 + phaseI * 0.15, 70 - phaseI * 10, 'davidKawasakiGlaucomaComplete');

    } else if (i <= 0.50) {
      // Phase 3: Light extremes (26-50%)
      const phaseI = (i - 0.25) / 0.25;

      if (phaseI < 0.4) {
        // Outdoor nightmare (26-35%)
        const subI = phaseI / 0.4;
        createOutdoorGlare('davidP3out', 0.5 + subI * 0.5, 'davidKawasakiGlaucomaComplete');
        createPeripheralVignette('davidP3out', 0.5, 60, 'davidKawasakiGlaucomaComplete');
      } else if (phaseI < 0.7) {
        // Indoor nightmare (36-42%)
        const subI = (phaseI - 0.4) / 0.3;
        createIndoorDarkness('davidP3in', 0.6 + subI * 0.35, 'davidKawasakiGlaucomaComplete');
        createPeripheralVignette('davidP3in', 0.6, 55, 'davidKawasakiGlaucomaComplete');
      } else {
        // Sweet spot (43-50%)
        const subI = (phaseI - 0.7) / 0.3;
        createDirtyGlassHaze('davidP3sweet', 0.7 + subI * 0.15, 'davidKawasakiGlaucomaComplete');
        createRainbowHalos('davidP3sweet', 0.8 + subI * 0.12, 'davidKawasakiGlaucomaComplete');
        createPeripheralVignette('davidP3sweet', 0.55 + subI * 0.1, 50 - subI * 5, 'davidKawasakiGlaucomaComplete');
      }

    } else if (i <= 0.75) {
      // Phase 4: Advancing tunnel + sweet spot + pain (51-75%)
      const phaseI = (i - 0.50) / 0.25;

      createDirtyGlassHaze('davidP4', 0.85 + phaseI * 0.10, 'davidKawasakiGlaucomaComplete');
      createRainbowHalos('davidP4', 0.92 + phaseI * 0.05, 'davidKawasakiGlaucomaComplete');
      createPeripheralVignette('davidP4', 0.65 + phaseI * 0.20, 45 - phaseI * 10, 'davidKawasakiGlaucomaComplete');

      // Pain intrusions become more frequent
      if (phaseI > 0.3) {
        createPainArtifacts('davidP4', (phaseI - 0.3) / 0.7, 'davidKawasakiGlaucomaComplete');
      }

    } else if (i <= 0.90) {
      // Phase 5: Rapid final collapse (76-90%)
      const phaseI = (i - 0.75) / 0.15;

      createFinalCollapse('davidP5', phaseI, 'davidKawasakiGlaucomaComplete');
      createPainArtifacts('davidP5', 0.5 + phaseI * 0.4, 'davidKawasakiGlaucomaComplete');

    } else {
      // Phase 6: Total blindness with ongoing pain (91-100%)
      const phaseI = (i - 0.90) / 0.10;

      createOngoingPainDarkness('davidP6', 0.3 + phaseI * 0.7, 'davidKawasakiGlaucomaComplete');
    }
  }

  // Individual phase effects
  if (davidKawasaki?.enabled && !davidComplete?.enabled) {
    const i = davidKawasaki.intensity;
    createDirtyGlassHaze('kawasakiOnly', 0.3 + i * 0.4, 'davidKawasakiEyes');
    createRainbowHalos('kawasakiOnly', 0.4 + i * 0.4, 'davidKawasakiEyes');
    createPeripheralVignette('kawasakiOnly', 0.2 + i * 0.3, 85 - i * 15, 'davidKawasakiEyes');
  }

  if (davidLeftLoss?.enabled && !davidComplete?.enabled) {
    createLeftEyeBlindness('leftOnly', davidLeftLoss.intensity, 'davidLeftEyeLoss');
  }

  if (davidMonocular?.enabled && !davidComplete?.enabled) {
    const i = davidMonocular.intensity;
    createLeftEyeBlindness('monoOnly', 0.95, 'davidMonocularHaze');
    createDirtyGlassHaze('monoOnly', 0.5 + i * 0.35, 'davidMonocularHaze');
    createRainbowHalos('monoOnly', 0.6 + i * 0.3, 'davidMonocularHaze');
    createPeripheralVignette('monoOnly', 0.35 + i * 0.25, 70 - i * 15, 'davidMonocularHaze');
  }

  if (davidOutdoor?.enabled && !davidComplete?.enabled) {
    const i = davidOutdoor.intensity;
    createLeftEyeBlindness('outdoorOnly', 0.95, 'davidOutdoorNightmare');
    createOutdoorGlare('outdoorOnly', 0.5 + i * 0.5, 'davidOutdoorNightmare');
    createPeripheralVignette('outdoorOnly', 0.5 + i * 0.2, 55 - i * 10, 'davidOutdoorNightmare');
  }

  if (davidIndoor?.enabled && !davidComplete?.enabled) {
    const i = davidIndoor.intensity;
    createLeftEyeBlindness('indoorOnly', 0.95, 'davidIndoorNightmare');
    createIndoorDarkness('indoorOnly', 0.5 + i * 0.45, 'davidIndoorNightmare');
    createPeripheralVignette('indoorOnly', 0.55 + i * 0.25, 55 - i * 10, 'davidIndoorNightmare');
  }

  if (davidSweet?.enabled && !davidComplete?.enabled) {
    const i = davidSweet.intensity;
    createLeftEyeBlindness('sweetOnly', 0.95, 'davidSweetSpot');
    createDirtyGlassHaze('sweetOnly', 0.65 + i * 0.25, 'davidSweetSpot');
    createRainbowHalos('sweetOnly', 0.75 + i * 0.2, 'davidSweetSpot');
    createPeripheralVignette('sweetOnly', 0.5 + i * 0.25, 50 - i * 12, 'davidSweetSpot');
  }

  if (davidPain?.enabled && !davidComplete?.enabled) {
    const i = davidPain.intensity;
    createLeftEyeBlindness('painOnly', 0.95, 'davidPainIntrusions');
    createDirtyGlassHaze('painOnly', 0.7, 'davidPainIntrusions');
    createPainArtifacts('painOnly', i, 'davidPainIntrusions');
    createPeripheralVignette('painOnly', 0.6 + i * 0.2, 45, 'davidPainIntrusions');
  }

  if (davidCollapse?.enabled && !davidComplete?.enabled) {
    createLeftEyeBlindness('collapseOnly', 0.95, 'davidFinalCollapse');
    createFinalCollapse('collapseOnly', davidCollapse.intensity, 'davidFinalCollapse');
  }

  if (davidOngoing?.enabled && !davidComplete?.enabled) {
    createOngoingPainDarkness('ongoingOnly', davidOngoing.intensity, 'davidOngoingPain');
  }
};
