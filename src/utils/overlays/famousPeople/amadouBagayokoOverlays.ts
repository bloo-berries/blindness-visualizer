import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Amadou Bagayoko's Congenital Cataract Progression to Total Blindness
 *
 * A slow, inevitable, graceful dimming - like a long sunset ending in night.
 *
 * Phase 1 (0-25%): Early Childhood (ages 5-8)
 * - Uniform milky haze like frosted glass
 * - Muted, warm-shifted colors (yellow-brown)
 * - Soft overall blur, mild glare from lights
 *
 * Phase 2 (26-50%): Late Childhood (ages 10-13)
 * - Heavy milky overlay (steamed window)
 * - Pronounced yellowish-brown cast
 * - Faces become unrecognizable
 * - Light sources wash out surrounding detail
 *
 * Phase 3 (51-75%): Final Stage (ages 14-16)
 * - Near-total white-out / dense milky opacity
 * - Light perception only
 * - No shapes, no edges, no faces
 *
 * Phase 4 (76-100%): Total Blindness (age 16+, 54 years)
 * - Complete, absolute darkness
 * - The darkness filled with music
 */
export const createAmadouBagayokoOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const amadouProgression = getEffect('amadouCataractProgression');
  const amadouPhase1 = getEffect('amadouPhase1');
  const amadouPhase2 = getEffect('amadouPhase2');
  const amadouPhase3 = getEffect('amadouPhase3');
  const amadouPhase4 = getEffect('amadouPhase4');

  // Helper: Create milky cataract haze overlay
  const createMilkyHaze = (id: string, opacity: number, warmth: number, conditionId: string) => {
    // Uniform milky-white haze with warm tint
    // Different from keratoconus (directional) or retinal detachment (shadow)
    // Cataract haze is omnidirectional, diffuse, and luminous
    const hazeBackground = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(${255 - warmth * 10},${250 - warmth * 15},${240 - warmth * 25},${opacity}) 0%,
        rgba(${252 - warmth * 8},${247 - warmth * 12},${235 - warmth * 22},${opacity * 0.95}) 25%,
        rgba(${250 - warmth * 6},${244 - warmth * 10},${230 - warmth * 20},${opacity * 0.90}) 50%,
        rgba(${248 - warmth * 5},${241 - warmth * 8},${225 - warmth * 18},${opacity * 0.85}) 75%,
        rgba(${246 - warmth * 4},${238 - warmth * 6},${220 - warmth * 15},${opacity * 0.80}) 100%
      ),
      linear-gradient(
        180deg,
        rgba(${255 - warmth * 8},${248 - warmth * 12},${235 - warmth * 20},${opacity * 0.6}) 0%,
        rgba(${252 - warmth * 6},${245 - warmth * 10},${232 - warmth * 18},${opacity * 0.55}) 50%,
        rgba(${255 - warmth * 8},${248 - warmth * 12},${235 - warmth * 20},${opacity * 0.6}) 100%
      )
    `;

    createOverlay(
      `visual-field-overlay-${id}-milkyHaze`,
      hazeBackground,
      'screen',
      '1',
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create diffuse light halos (gentle cotton-wrapped glow)
  const createDiffuseHalos = (id: string, intensity: number, conditionId: string) => {
    const halos: string[] = [];

    // Simulated light source positions (West African evening scene)
    const lightPositions = [
      { x: 20, y: 15, size: 18 },   // String light upper left
      { x: 50, y: 12, size: 22 },   // Central overhead light
      { x: 80, y: 15, size: 18 },   // String light upper right
      { x: 15, y: 40, size: 15 },   // Lantern left
      { x: 85, y: 45, size: 16 },   // Cooking fire right
      { x: 35, y: 20, size: 12 },   // String light
      { x: 65, y: 18, size: 12 },   // String light
      { x: 50, y: 60, size: 20 },   // Central fire/lantern
    ];

    for (const light of lightPositions) {
      // Gentle, rounded halo - NOT harsh streaking like keratoconus
      // "Each light wrapped in cotton" - soft, diffuse spreading
      halos.push(`
        radial-gradient(circle at ${light.x}% ${light.y}%,
          rgba(255,248,235,${intensity * 0.55}) 0%,
          rgba(255,245,225,${intensity * 0.40}) ${light.size * 0.3}%,
          rgba(255,242,215,${intensity * 0.28}) ${light.size * 0.5}%,
          rgba(252,238,205,${intensity * 0.15}) ${light.size * 0.75}%,
          transparent ${light.size}%
        )
      `);

      // Secondary outer glow
      halos.push(`
        radial-gradient(circle at ${light.x}% ${light.y}%,
          rgba(255,245,220,${intensity * 0.20}) 0%,
          rgba(252,240,210,${intensity * 0.12}) ${light.size * 0.8}%,
          rgba(250,235,200,${intensity * 0.05}) ${light.size * 1.2}%,
          transparent ${light.size * 1.5}%
        )
      `);
    }

    createOverlay(
      `visual-field-overlay-${id}-halos`,
      halos.join(',\n'),
      'screen',
      Math.min(0.85, 0.5 + intensity * 0.35).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Complete Cataract Progression
  if (amadouProgression?.enabled) {
    const i = amadouProgression.intensity;

    if (i <= 0.25) {
      // Phase 1: Childhood haze (ages 5-8)
      const phaseI = i * 4; // 0-1 within phase
      const hazeOpacity = 0.35 + phaseI * 0.15; // 0.35-0.50
      const warmth = 2 + phaseI * 3; // Warm shift factor

      createMilkyHaze('amadouP1', hazeOpacity, warmth, 'amadouCataractProgression');
      createDiffuseHalos('amadouP1', 0.4 + phaseI * 0.2, 'amadouCataractProgression');

    } else if (i <= 0.5) {
      // Phase 2: Fog thickens (ages 10-13)
      const phaseI = (i - 0.25) * 4; // 0-1 within phase
      const hazeOpacity = 0.50 + phaseI * 0.20; // 0.50-0.70
      const warmth = 5 + phaseI * 5; // Stronger brown cast

      createMilkyHaze('amadouP2', hazeOpacity, warmth, 'amadouCataractProgression');
      createDiffuseHalos('amadouP2', 0.6 + phaseI * 0.25, 'amadouCataractProgression');

      // Heavy additional milky layer
      const heavyMilk = `
        radial-gradient(ellipse 180% 180% at 50% 50%,
          rgba(248,240,225,${0.30 + phaseI * 0.20}) 0%,
          rgba(245,235,215,${0.25 + phaseI * 0.18}) 40%,
          rgba(242,230,205,${0.20 + phaseI * 0.15}) 70%,
          rgba(240,225,195,${0.15 + phaseI * 0.12}) 100%
        )
      `;

      createOverlay(
        'visual-field-overlay-amadouP2-heavyMilk',
        heavyMilk,
        'screen',
        Math.min(0.80, 0.55 + phaseI * 0.25).toString(),
        undefined,
        undefined,
        'amadouCataractProgression'
      );

    } else if (i <= 0.75) {
      // Phase 3: Light perception only (ages 14-16)
      const phaseI = (i - 0.5) * 4; // 0-1 within phase

      // Near-total white-out - dense warm milky-white fog
      const denseWhiteout = `
        radial-gradient(ellipse 200% 200% at 50% 50%,
          rgba(255,250,235,${0.75 + phaseI * 0.15}) 0%,
          rgba(252,245,225,${0.72 + phaseI * 0.15}) 30%,
          rgba(250,240,215,${0.68 + phaseI * 0.15}) 60%,
          rgba(248,235,205,${0.65 + phaseI * 0.15}) 100%
        ),
        linear-gradient(
          180deg,
          rgba(255,248,230,${0.60 + phaseI * 0.20}) 0%,
          rgba(252,244,220,${0.55 + phaseI * 0.20}) 50%,
          rgba(255,248,230,${0.60 + phaseI * 0.20}) 100%
        )
      `;

      createOverlay(
        'visual-field-overlay-amadouP3-whiteout',
        denseWhiteout,
        'screen',
        '1',
        undefined,
        undefined,
        'amadouCataractProgression'
      );

      // Only strongest lights register as slightly brighter patches
      const faintLightPatches = `
        radial-gradient(circle at 50% 50%,
          rgba(255,255,250,${0.15 + phaseI * 0.08}) 0%,
          rgba(255,252,242,${0.10 + phaseI * 0.05}) 15%,
          transparent 35%
        ),
        radial-gradient(circle at 25% 35%,
          rgba(255,252,240,${0.10 + phaseI * 0.05}) 0%,
          transparent 25%
        ),
        radial-gradient(circle at 75% 40%,
          rgba(255,250,235,${0.08 + phaseI * 0.04}) 0%,
          transparent 22%
        )
      `;

      createOverlay(
        'visual-field-overlay-amadouP3-faintLight',
        faintLightPatches,
        'screen',
        Math.min(0.70, 0.45 + phaseI * 0.25).toString(),
        undefined,
        undefined,
        'amadouCataractProgression'
      );

    } else {
      // Phase 4: Total blindness (age 16+)
      const phaseI = (i - 0.75) * 4; // 0-1 within phase

      // Transition from washed-out amber-white to total darkness
      // First half: warm glow fading
      // Second half: complete black

      if (phaseI < 0.5) {
        // Still fading - warm glow diminishing
        const fadeI = phaseI * 2; // 0-1 within first half
        const fadingGlow = `
          radial-gradient(ellipse 200% 200% at 50% 50%,
            rgba(${Math.floor(255 - fadeI * 200)},${Math.floor(245 - fadeI * 200)},${Math.floor(225 - fadeI * 200)},${0.90 - fadeI * 0.45}) 0%,
            rgba(${Math.floor(250 - fadeI * 200)},${Math.floor(240 - fadeI * 200)},${Math.floor(215 - fadeI * 200)},${0.85 - fadeI * 0.42}) 50%,
            rgba(${Math.floor(245 - fadeI * 200)},${Math.floor(235 - fadeI * 200)},${Math.floor(205 - fadeI * 200)},${0.80 - fadeI * 0.40}) 100%
          )
        `;

        createOverlay(
          'visual-field-overlay-amadouP4-fading',
          fadingGlow,
          'normal',
          '1',
          undefined,
          undefined,
          'amadouCataractProgression'
        );
      }

      // Total darkness overlay - increasing opacity
      const darknessOpacity = Math.min(1, phaseI * 1.1);
      const totalDarkness = `
        linear-gradient(
          180deg,
          rgba(0,0,0,${darknessOpacity}) 0%,
          rgba(0,0,0,${darknessOpacity}) 100%
        )
      `;

      createOverlay(
        'visual-field-overlay-amadouP4-darkness',
        totalDarkness,
        'normal',
        '1',
        undefined,
        undefined,
        'amadouCataractProgression'
      );
    }
  }

  // Individual Phase 1 effect
  if (amadouPhase1?.enabled && !amadouProgression?.enabled) {
    const i = amadouPhase1.intensity;
    const hazeOpacity = 0.35 + i * 0.15;
    const warmth = 2 + i * 3;

    createMilkyHaze('amadouPhase1Only', hazeOpacity, warmth, 'amadouPhase1');
    createDiffuseHalos('amadouPhase1Only', 0.4 + i * 0.2, 'amadouPhase1');
  }

  // Individual Phase 2 effect
  if (amadouPhase2?.enabled && !amadouProgression?.enabled) {
    const i = amadouPhase2.intensity;
    const hazeOpacity = 0.50 + i * 0.20;
    const warmth = 5 + i * 5;

    createMilkyHaze('amadouPhase2Only', hazeOpacity, warmth, 'amadouPhase2');
    createDiffuseHalos('amadouPhase2Only', 0.6 + i * 0.25, 'amadouPhase2');

    const heavyMilk = `
      radial-gradient(ellipse 180% 180% at 50% 50%,
        rgba(248,240,225,${0.30 + i * 0.20}) 0%,
        rgba(245,235,215,${0.25 + i * 0.18}) 40%,
        rgba(242,230,205,${0.20 + i * 0.15}) 70%,
        rgba(240,225,195,${0.15 + i * 0.12}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-amadouPhase2Only-heavyMilk',
      heavyMilk,
      'screen',
      Math.min(0.80, 0.55 + i * 0.25).toString(),
      undefined,
      undefined,
      'amadouPhase2'
    );
  }

  // Individual Phase 3 effect
  if (amadouPhase3?.enabled && !amadouProgression?.enabled) {
    const i = amadouPhase3.intensity;

    const denseWhiteout = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(255,250,235,${0.75 + i * 0.15}) 0%,
        rgba(252,245,225,${0.72 + i * 0.15}) 30%,
        rgba(250,240,215,${0.68 + i * 0.15}) 60%,
        rgba(248,235,205,${0.65 + i * 0.15}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-amadouPhase3Only-whiteout',
      denseWhiteout,
      'screen',
      '1',
      undefined,
      undefined,
      'amadouPhase3'
    );

    const faintLightPatches = `
      radial-gradient(circle at 50% 50%,
        rgba(255,255,250,${0.15 + i * 0.08}) 0%,
        transparent 35%
      ),
      radial-gradient(circle at 25% 35%,
        rgba(255,252,240,${0.10 + i * 0.05}) 0%,
        transparent 25%
      )
    `;

    createOverlay(
      'visual-field-overlay-amadouPhase3Only-faintLight',
      faintLightPatches,
      'screen',
      Math.min(0.70, 0.45 + i * 0.25).toString(),
      undefined,
      undefined,
      'amadouPhase3'
    );
  }

  // Individual Phase 4 effect
  if (amadouPhase4?.enabled && !amadouProgression?.enabled) {
    const i = amadouPhase4.intensity;

    // Complete, absolute darkness
    const totalDarkness = `
      linear-gradient(
        180deg,
        rgba(0,0,0,${i}) 0%,
        rgba(0,0,0,${i}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-amadouPhase4Only-darkness',
      totalDarkness,
      'normal',
      '1',
      undefined,
      undefined,
      'amadouPhase4'
    );
  }
};
