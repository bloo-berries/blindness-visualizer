import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Lex Gillette's Recurrent Retinal Detachments
 *
 * NOT a straight progression but oscillating cycles of hope and loss.
 *
 * Cycle 1 (0-15%): Monocular Vision
 * - Left eye always blind from ROP (complete blackness left side)
 * - Right eye working normally - this is "normal" for Lex
 *
 * Cycle 2 (16-30%): First Detachment
 * - Floaters drifting across vision
 * - Peripheral flashes (photopsia)
 * - Dark curtain encroaching from upper edge (15-20%)
 *
 * Cycle 3 (31-45%): Post-Surgery Restoration
 * - Vision returns but not perfect
 * - Clearer center with peripheral scotomas (laser scars)
 * - Hope tinged with uncertainty
 *
 * Cycle 4 (46-60%): Re-Detachment
 * - The shadow returns, larger this time (30-40%)
 * - More floaters, faster progression
 * - The familiar terror - "not again"
 *
 * Cycle 5 (61-80%): Cumulative Damage
 * - Multiple cycles leave permanent damage
 * - Clear zone shrinking (50-70% occluded)
 * - Permanent floater clouds, surgical scars
 *
 * Cycle 6 (81-100%): Daily Fading
 * - "A little less each morning"
 * - Gradual dimming, no dramatic event
 * - Until one morning, nothing left
 */
export const createLexGilletteOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const lexCycle = getEffect('lexRecurrentDetachmentCycle');
  const lexMonocular = getEffect('lexMonocularVision');
  const lexFirst = getEffect('lexFirstDetachment');
  const lexPostSurgery = getEffect('lexPostSurgeryRestoration');
  const lexRedetachment = getEffect('lexRedetachment');
  const lexCumulative = getEffect('lexCumulativeDamage');
  const lexFading = getEffect('lexDailyFading');

  // Helper: Create left eye blindness (always present - ROP from birth)
  const createLeftEyeBlindness = (id: string, opacity: number, conditionId: string) => {
    // Complete blackness in left visual field
    // Monocular vision means left half is completely blind
    const leftBlindness = `
      linear-gradient(
        90deg,
        rgba(0,0,0,${opacity}) 0%,
        rgba(0,0,0,${opacity}) 45%,
        rgba(0,0,0,${opacity * 0.3}) 48%,
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

  // Helper: Create drifting floaters
  const createFloaters = (id: string, intensity: number, count: number, conditionId: string) => {
    const floaters: string[] = [];

    // Generate semi-random floater positions (deterministic for consistency)
    const floaterConfigs = [
      { x: 55, y: 25, size: 3, opacity: 0.4 },
      { x: 70, y: 40, size: 5, opacity: 0.35 },
      { x: 60, y: 55, size: 4, opacity: 0.3 },
      { x: 75, y: 30, size: 2, opacity: 0.45 },
      { x: 65, y: 65, size: 6, opacity: 0.25 },
      { x: 80, y: 50, size: 3, opacity: 0.4 },
      { x: 58, y: 35, size: 4, opacity: 0.35 },
      { x: 72, y: 60, size: 5, opacity: 0.3 },
      { x: 62, y: 20, size: 3, opacity: 0.4 },
      { x: 78, y: 45, size: 4, opacity: 0.35 }
    ];

    for (let i = 0; i < Math.min(count, floaterConfigs.length); i++) {
      const f = floaterConfigs[i];
      // Cobweb-like floaters - semi-transparent drifting shapes
      floaters.push(`
        radial-gradient(ellipse ${f.size}% ${f.size * 1.5}% at ${f.x}% ${f.y}%,
          rgba(30,25,20,${f.opacity * intensity}) 0%,
          rgba(40,35,30,${f.opacity * intensity * 0.6}) 40%,
          transparent 100%
        )
      `);
    }

    // Add some string-like floaters
    floaters.push(`
      linear-gradient(
        ${45 + intensity * 20}deg,
        transparent 0%,
        transparent ${48 - intensity * 5}%,
        rgba(35,30,25,${0.15 * intensity}) ${50}%,
        transparent ${52 + intensity * 5}%,
        transparent 100%
      )
    `);

    if (floaters.length > 0) {
      createOverlay(
        `visual-field-overlay-${id}-floaters`,
        floaters.join(',\n'),
        'multiply',
        Math.min(0.9, 0.5 + intensity * 0.4).toString(),
        undefined,
        undefined,
        conditionId
      );
    }
  };

  // Helper: Create dark curtain (retinal detachment shadow)
  const createDarkCurtain = (id: string, coverage: number, direction: 'top' | 'topRight', conditionId: string) => {
    // Shadow descending from top/top-right (typical detachment pattern)
    // Only affects right side of vision (left is already blind)

    let curtain: string;

    if (direction === 'top') {
      // Curtain from top
      curtain = `
        linear-gradient(
          180deg,
          rgba(15,12,10,${0.85 + coverage * 0.10}) 0%,
          rgba(20,17,15,${0.80 + coverage * 0.10}) ${coverage * 80}%,
          rgba(30,25,22,${0.50 + coverage * 0.15}) ${coverage * 90}%,
          rgba(40,35,30,${0.20 + coverage * 0.10}) ${coverage * 95}%,
          transparent ${Math.min(100, coverage * 100 + 10)}%
        ),
        linear-gradient(
          90deg,
          transparent 0%,
          transparent 48%,
          rgba(10,8,6,0.1) 50%,
          rgba(10,8,6,0.1) 100%
        )
      `;
    } else {
      // Curtain from top-right (more common in ROP-related detachments)
      curtain = `
        linear-gradient(
          210deg,
          rgba(12,10,8,${0.88 + coverage * 0.08}) 0%,
          rgba(18,15,12,${0.82 + coverage * 0.10}) ${coverage * 75}%,
          rgba(28,23,18,${0.55 + coverage * 0.15}) ${coverage * 88}%,
          rgba(38,33,28,${0.25 + coverage * 0.10}) ${coverage * 94}%,
          transparent ${Math.min(100, coverage * 100 + 8)}%
        ),
        linear-gradient(
          90deg,
          transparent 0%,
          transparent 45%,
          rgba(8,6,5,0.05) 50%,
          rgba(8,6,5,0.05) 100%
        )
      `;
    }

    createOverlay(
      `visual-field-overlay-${id}-curtain`,
      curtain,
      'normal',
      '1',
      undefined,
      undefined,
      conditionId
    );
  };

  // Helper: Create peripheral scotomas (surgical laser scars)
  const createSurgicalScars = (id: string, intensity: number, conditionId: string) => {
    // Scattered dark patches in periphery where laser was applied
    const scars: string[] = [];

    const scarPositions = [
      { x: 90, y: 20, size: 8 },
      { x: 95, y: 40, size: 6 },
      { x: 88, y: 70, size: 7 },
      { x: 92, y: 85, size: 5 },
      { x: 85, y: 15, size: 6 },
      { x: 55, y: 10, size: 5 },
      { x: 60, y: 90, size: 6 },
      { x: 70, y: 95, size: 5 }
    ];

    for (const scar of scarPositions) {
      scars.push(`
        radial-gradient(ellipse ${scar.size}% ${scar.size * 0.8}% at ${scar.x}% ${scar.y}%,
          rgba(25,20,18,${0.6 * intensity}) 0%,
          rgba(35,30,25,${0.4 * intensity}) 50%,
          transparent 100%
        )
      `);
    }

    createOverlay(
      `visual-field-overlay-${id}-scars`,
      scars.join(',\n'),
      'multiply',
      Math.min(0.85, 0.5 + intensity * 0.35).toString(),
      undefined,
      undefined,
      conditionId
    );
  };

  // Complete Recurrent Detachment Cycle
  if (lexCycle?.enabled) {
    const i = lexCycle.intensity;

    // Left eye always blind (ROP from birth) - constant throughout
    createLeftEyeBlindness('lexCycle', 0.95, 'lexRecurrentDetachmentCycle');

    if (i <= 0.15) {
      // Cycle 1: Monocular normal (0-15%)
      // Just the left eye blindness, right eye working
      // Minimal additional overlays - this is "normal" for Lex

    } else if (i <= 0.30) {
      // Cycle 2: First Detachment (16-30%)
      const phaseI = (i - 0.15) / 0.15; // 0-1 within phase

      // Floaters appear and increase
      createFloaters('lexC2', phaseI, Math.floor(3 + phaseI * 5), 'lexRecurrentDetachmentCycle');

      // Dark curtain beginning to descend (15-20% coverage)
      const curtainCoverage = 0.15 + phaseI * 0.05; // 15-20%
      createDarkCurtain('lexC2', curtainCoverage, 'topRight', 'lexRecurrentDetachmentCycle');

    } else if (i <= 0.45) {
      // Cycle 3: Post-Surgery Restoration (31-45%)
      const phaseI = (i - 0.30) / 0.15; // 0-1 within phase

      // Vision improving but scarred
      // Fewer floaters (surgery cleared some)
      createFloaters('lexC3', 0.6 - phaseI * 0.3, Math.floor(4 - phaseI * 2), 'lexRecurrentDetachmentCycle');

      // Surgical scars visible in periphery
      createSurgicalScars('lexC3', 0.4 + phaseI * 0.3, 'lexRecurrentDetachmentCycle');

      // Curtain receding (healing)
      const curtainCoverage = 0.20 - phaseI * 0.15; // 20% down to 5%
      if (curtainCoverage > 0.05) {
        createDarkCurtain('lexC3', curtainCoverage, 'topRight', 'lexRecurrentDetachmentCycle');
      }

    } else if (i <= 0.60) {
      // Cycle 4: Re-Detachment (46-60%)
      const phaseI = (i - 0.45) / 0.15; // 0-1 within phase

      // Floaters return, more this time
      createFloaters('lexC4', 0.5 + phaseI * 0.5, Math.floor(5 + phaseI * 4), 'lexRecurrentDetachmentCycle');

      // Surgical scars still visible
      createSurgicalScars('lexC4', 0.6, 'lexRecurrentDetachmentCycle');

      // Curtain returning, larger this time (30-40%)
      const curtainCoverage = 0.30 + phaseI * 0.10; // 30-40%
      createDarkCurtain('lexC4', curtainCoverage, 'top', 'lexRecurrentDetachmentCycle');

    } else if (i <= 0.80) {
      // Cycle 5: Cumulative Damage (61-80%)
      const phaseI = (i - 0.60) / 0.20; // 0-1 within phase

      // Permanent floater clouds
      createFloaters('lexC5', 0.7 + phaseI * 0.25, 10, 'lexRecurrentDetachmentCycle');

      // Multiple surgical scars
      createSurgicalScars('lexC5', 0.7 + phaseI * 0.25, 'lexRecurrentDetachmentCycle');

      // Clear zone shrinking (50-70% occluded)
      const curtainCoverage = 0.50 + phaseI * 0.20; // 50-70%
      createDarkCurtain('lexC5', curtainCoverage, 'top', 'lexRecurrentDetachmentCycle');

      // Additional darkness creeping from edges
      const edgeDarkness = `
        radial-gradient(ellipse 120% 120% at 75% 50%,
          transparent 0%,
          transparent ${30 - phaseI * 15}%,
          rgba(15,12,10,${0.3 + phaseI * 0.3}) ${50 - phaseI * 10}%,
          rgba(10,8,6,${0.5 + phaseI * 0.3}) ${70 - phaseI * 10}%,
          rgba(5,4,3,${0.7 + phaseI * 0.2}) 100%
        )
      `;

      createOverlay(
        'visual-field-overlay-lexC5-edgeDark',
        edgeDarkness,
        'multiply',
        Math.min(0.9, 0.6 + phaseI * 0.3).toString(),
        undefined,
        undefined,
        'lexRecurrentDetachmentCycle'
      );

    } else {
      // Cycle 6: Daily Fading (81-100%)
      const phaseI = (i - 0.80) / 0.20; // 0-1 within phase

      // "A little less each morning" - gradual dimming to total darkness

      if (phaseI < 0.8) {
        // Still some vision remaining, but fading
        const remainingVision = `
          radial-gradient(ellipse 80% 80% at 70% 50%,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) ${15 - phaseI * 15}%,
            rgba(8,6,5,${0.4 + phaseI * 0.4}) ${25 - phaseI * 20}%,
            rgba(5,4,3,${0.7 + phaseI * 0.25}) ${40 - phaseI * 30}%,
            rgba(2,2,2,${0.85 + phaseI * 0.10}) ${60 - phaseI * 40}%,
            rgba(0,0,0,${0.92 + phaseI * 0.05}) 100%
          )
        `;

        createOverlay(
          'visual-field-overlay-lexC6-fading',
          remainingVision,
          'normal',
          '1',
          undefined,
          undefined,
          'lexRecurrentDetachmentCycle'
        );

        // Residual floaters (barely visible in the darkness)
        createFloaters('lexC6', 0.3 - phaseI * 0.3, 5, 'lexRecurrentDetachmentCycle');
      }

      // Total darkness overlay (increasing with phase)
      const totalDarkness = `
        linear-gradient(
          180deg,
          rgba(0,0,0,${phaseI * 1.1}) 0%,
          rgba(0,0,0,${phaseI * 1.1}) 100%
        )
      `;

      createOverlay(
        'visual-field-overlay-lexC6-darkness',
        totalDarkness,
        'normal',
        '1',
        undefined,
        undefined,
        'lexRecurrentDetachmentCycle'
      );
    }
  }

  // Individual phase effects
  if (lexMonocular?.enabled && !lexCycle?.enabled) {
    createLeftEyeBlindness('lexMono', lexMonocular.intensity * 0.95, 'lexMonocularVision');
  }

  if (lexFirst?.enabled && !lexCycle?.enabled) {
    const i = lexFirst.intensity;
    createLeftEyeBlindness('lexFirst', 0.95, 'lexFirstDetachment');
    createFloaters('lexFirst', i, Math.floor(3 + i * 5), 'lexFirstDetachment');
    createDarkCurtain('lexFirst', 0.15 + i * 0.05, 'topRight', 'lexFirstDetachment');
  }

  if (lexPostSurgery?.enabled && !lexCycle?.enabled) {
    const i = lexPostSurgery.intensity;
    createLeftEyeBlindness('lexPost', 0.95, 'lexPostSurgeryRestoration');
    createFloaters('lexPost', 0.3 + i * 0.2, Math.floor(2 + i * 2), 'lexPostSurgeryRestoration');
    createSurgicalScars('lexPost', 0.5 + i * 0.3, 'lexPostSurgeryRestoration');
  }

  if (lexRedetachment?.enabled && !lexCycle?.enabled) {
    const i = lexRedetachment.intensity;
    createLeftEyeBlindness('lexRe', 0.95, 'lexRedetachment');
    createFloaters('lexRe', 0.5 + i * 0.4, Math.floor(5 + i * 4), 'lexRedetachment');
    createSurgicalScars('lexRe', 0.6, 'lexRedetachment');
    createDarkCurtain('lexRe', 0.30 + i * 0.10, 'top', 'lexRedetachment');
  }

  if (lexCumulative?.enabled && !lexCycle?.enabled) {
    const i = lexCumulative.intensity;
    createLeftEyeBlindness('lexCum', 0.95, 'lexCumulativeDamage');
    createFloaters('lexCum', 0.7 + i * 0.25, 10, 'lexCumulativeDamage');
    createSurgicalScars('lexCum', 0.7 + i * 0.25, 'lexCumulativeDamage');
    createDarkCurtain('lexCum', 0.50 + i * 0.20, 'top', 'lexCumulativeDamage');
  }

  if (lexFading?.enabled && !lexCycle?.enabled) {
    const i = lexFading.intensity;
    createLeftEyeBlindness('lexFade', 0.95, 'lexDailyFading');

    // Total darkness based on intensity
    const totalDarkness = `
      linear-gradient(
        180deg,
        rgba(0,0,0,${i}) 0%,
        rgba(0,0,0,${i}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-lexFade-darkness',
      totalDarkness,
      'normal',
      '1',
      undefined,
      undefined,
      'lexDailyFading'
    );
  }
};
