/**
 * Anselmo Ralph - Ocular Myasthenia Gravis overlay generator
 *
 * Autoimmune neuromuscular disease causing:
 * 1. Ptosis (asymmetric eyelid droop) - curtain effect from top
 * 2. Diplopia (double vision) - offset/ghost image effect
 * 3. Photophobia (light sensitivity) - bloom/overexposure
 * 4. Blurred vision with halos
 * 5. Temporal fatigue cycle - symptoms worsen over time
 *
 * Technical implementation:
 * - Ptosis: Dark gradient from top with asymmetric coverage (left > right)
 * - Diplopia: Not handled by overlay (requires shader/CSS transform)
 * - Photophobia: Bright bloom gradient overlay
 * - Fatigue: State machine cycling through rest/mild/heavy/blink phases
 */

// Fatigue cycle state machine
// Periods represent how long each state lasts in seconds
const FATIGUE_STATES = {
  RESTED: { duration: 8, ptosisMultiplier: 0.3, photophobiaMultiplier: 0.5 },
  MILD_FATIGUE: { duration: 12, ptosisMultiplier: 0.6, photophobiaMultiplier: 0.75 },
  HEAVY_FATIGUE: { duration: 10, ptosisMultiplier: 1.0, photophobiaMultiplier: 1.0 },
  BLINK_REST: { duration: 3, ptosisMultiplier: 1.2, photophobiaMultiplier: 0.6 }
};

// Total cycle duration
const CYCLE_DURATION =
  FATIGUE_STATES.RESTED.duration +
  FATIGUE_STATES.MILD_FATIGUE.duration +
  FATIGUE_STATES.HEAVY_FATIGUE.duration +
  FATIGUE_STATES.BLINK_REST.duration;

/**
 * Get current fatigue state based on time
 */
function getFatigueState(timeInCycle: number): {
  ptosisMultiplier: number;
  photophobiaMultiplier: number;
  stateName: string;
} {
  let accumulated = 0;

  // RESTED state
  accumulated += FATIGUE_STATES.RESTED.duration;
  if (timeInCycle < accumulated) {
    const progress = timeInCycle / FATIGUE_STATES.RESTED.duration;
    // Gradually increase fatigue toward end of rest period
    const transitionMultiplier = 1 + progress * 0.3;
    return {
      ptosisMultiplier: FATIGUE_STATES.RESTED.ptosisMultiplier * transitionMultiplier,
      photophobiaMultiplier: FATIGUE_STATES.RESTED.photophobiaMultiplier * transitionMultiplier,
      stateName: 'RESTED'
    };
  }

  // MILD_FATIGUE state
  const mildStart = accumulated;
  accumulated += FATIGUE_STATES.MILD_FATIGUE.duration;
  if (timeInCycle < accumulated) {
    const progress = (timeInCycle - mildStart) / FATIGUE_STATES.MILD_FATIGUE.duration;
    const transitionMultiplier = 1 + progress * 0.3;
    return {
      ptosisMultiplier: FATIGUE_STATES.MILD_FATIGUE.ptosisMultiplier * transitionMultiplier,
      photophobiaMultiplier: FATIGUE_STATES.MILD_FATIGUE.photophobiaMultiplier * transitionMultiplier,
      stateName: 'MILD_FATIGUE'
    };
  }

  // HEAVY_FATIGUE state
  const heavyStart = accumulated;
  accumulated += FATIGUE_STATES.HEAVY_FATIGUE.duration;
  if (timeInCycle < accumulated) {
    const progress = (timeInCycle - heavyStart) / FATIGUE_STATES.HEAVY_FATIGUE.duration;
    // Peak fatigue - slight oscillation for realism
    const oscillation = Math.sin(progress * Math.PI * 3) * 0.08;
    return {
      ptosisMultiplier: FATIGUE_STATES.HEAVY_FATIGUE.ptosisMultiplier + oscillation,
      photophobiaMultiplier: FATIGUE_STATES.HEAVY_FATIGUE.photophobiaMultiplier + oscillation,
      stateName: 'HEAVY_FATIGUE'
    };
  }

  // BLINK_REST state - brief relief
  const blinkStart = accumulated;
  const progress = (timeInCycle - blinkStart) / FATIGUE_STATES.BLINK_REST.duration;
  // Rapid improvement then gradual return
  const recoveryMultiplier = Math.max(0.2, 1 - Math.pow(progress, 0.5) * 0.8);
  return {
    ptosisMultiplier: FATIGUE_STATES.BLINK_REST.ptosisMultiplier * recoveryMultiplier,
    photophobiaMultiplier: FATIGUE_STATES.BLINK_REST.photophobiaMultiplier * recoveryMultiplier,
    stateName: 'BLINK_REST'
  };
}

/**
 * Generate Anselmo's Ocular Myasthenia Gravis overlay
 * This creates the ptosis (eyelid droop) and photophobia (light sensitivity) effects
 */
export function generateAnselmoOcularMyastheniaOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;
  const timeInCycle = time % CYCLE_DURATION;

  const fatigueState = getFatigueState(timeInCycle);
  const ptosisMultiplier = fatigueState.ptosisMultiplier;
  const photophobiaMultiplier = fatigueState.photophobiaMultiplier;

  // === PTOSIS (EYELID DROOP) ===
  // Asymmetric drooping - left eye typically more affected
  // Creates dark curtain effect from top of visual field

  // Small tremor in eyelid position (myasthenic fatigue causes micro-movements)
  const eyelidTremor = Math.sin(time * 4) * 0.5 + Math.sin(time * 7) * 0.3;

  // Left eye droops more (covers more of the field)
  const leftPtosisCoverage = 18 + (ptosisMultiplier * intensity * 12) + eyelidTremor;
  // Right eye droops less
  const rightPtosisCoverage = 10 + (ptosisMultiplier * intensity * 8) + eyelidTremor * 0.7;

  // === PHOTOPHOBIA (LIGHT SENSITIVITY) ===
  // Bright areas bloom and overexpose, creating discomfort
  // Simulated as white/bright gradient overlays that pulse

  // Fluctuating light sensitivity
  const lightFluctuation = Math.sin(time * 0.8) * 0.15 + Math.sin(time * 1.3) * 0.1;
  const photophobiaIntensity = (0.35 + lightFluctuation) * intensity * photophobiaMultiplier;

  // Central bright bloom (simulates overhead/direct lighting)
  const centralBloom = `
    radial-gradient(
      ellipse 70% 50% at 50% 30%,
      rgba(255, 255, 255, ${photophobiaIntensity * 0.6}) 0%,
      rgba(255, 252, 245, ${photophobiaIntensity * 0.4}) 30%,
      rgba(255, 250, 240, ${photophobiaIntensity * 0.2}) 60%,
      transparent 100%
    )
  `;

  // Window/side light bloom
  const sideLightX = 75 + Math.sin(time * 0.2) * 5;
  const sideBloom = `
    radial-gradient(
      ellipse 40% 60% at ${sideLightX}% 40%,
      rgba(255, 255, 250, ${photophobiaIntensity * 0.5}) 0%,
      rgba(255, 253, 245, ${photophobiaIntensity * 0.3}) 40%,
      transparent 100%
    )
  `;

  // Subtle overall brightness increase (washed out effect)
  const overallBrightness = `
    linear-gradient(
      rgba(255, 255, 255, ${photophobiaIntensity * 0.15}) 0%,
      rgba(255, 255, 255, ${photophobiaIntensity * 0.1}) 50%,
      rgba(255, 255, 255, ${photophobiaIntensity * 0.15}) 100%
    )
  `;

  // === HALO EFFECT ===
  // Soft glow around perceived light sources
  const haloIntensity = intensity * photophobiaMultiplier * 0.3;
  const haloGlow = `
    radial-gradient(
      ellipse 100% 80% at 50% 50%,
      transparent 40%,
      rgba(255, 255, 230, ${haloIntensity * 0.2}) 60%,
      rgba(255, 255, 220, ${haloIntensity * 0.1}) 80%,
      transparent 100%
    )
  `;

  // Combine all overlays
  // Averaged ptosis gradient for full-width effect, plus photophobia
  // Using average of left/right coverage for a unified droop effect
  const avgPtosisCoverage = (leftPtosisCoverage + rightPtosisCoverage) / 2;
  const ptosisGradient = `
    linear-gradient(
      180deg,
      rgba(55, 48, 42, ${0.92 * intensity * ptosisMultiplier}) 0%,
      rgba(65, 55, 50, ${0.85 * intensity * ptosisMultiplier}) ${avgPtosisCoverage * 0.4}%,
      rgba(75, 60, 55, ${0.65 * intensity * ptosisMultiplier}) ${avgPtosisCoverage * 0.7}%,
      rgba(85, 70, 65, ${0.35 * intensity * ptosisMultiplier}) ${avgPtosisCoverage * 0.9}%,
      transparent ${avgPtosisCoverage + 4}%
    )
  `;

  const background = `
    ${ptosisGradient},
    ${centralBloom},
    ${sideBloom},
    ${overallBrightness},
    ${haloGlow}
  `;

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background,
    mixBlendMode: 'normal' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9998
  };
}

/**
 * Generate the ptosis (eyelid droop) overlay specifically
 * This is a separate layer that creates the asymmetric curtain effect
 */
export function generateAnselmoPtosisOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;
  const timeInCycle = time % CYCLE_DURATION;

  const fatigueState = getFatigueState(timeInCycle);
  const ptosisMultiplier = fatigueState.ptosisMultiplier;

  // Eyelid tremor
  const eyelidTremor = Math.sin(time * 4) * 0.5 + Math.sin(time * 7) * 0.3;

  // Left eye coverage (more severe)
  const leftCoverage = 20 + (ptosisMultiplier * intensity * 15) + eyelidTremor;

  // Split screen effect - left half has more droop
  const leftPtosis = `
    linear-gradient(
      180deg,
      rgba(45, 38, 35, ${0.98 * intensity * ptosisMultiplier}) 0%,
      rgba(55, 45, 40, ${0.92 * intensity * ptosisMultiplier}) ${leftCoverage * 0.4}%,
      rgba(65, 52, 48, ${0.8 * intensity * ptosisMultiplier}) ${leftCoverage * 0.7}%,
      rgba(80, 65, 60, ${0.5 * intensity * ptosisMultiplier}) ${leftCoverage * 0.9}%,
      rgba(100, 80, 75, ${0.2 * intensity * ptosisMultiplier}) ${leftCoverage}%,
      transparent ${leftCoverage + 3}%
    )
  `;

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    background: leftPtosis,
    mixBlendMode: 'normal' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9997
  };
}

/**
 * Generate the right eye ptosis overlay (separate element for asymmetry)
 */
export function generateAnselmoPtosisRightOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;
  const timeInCycle = time % CYCLE_DURATION;

  const fatigueState = getFatigueState(timeInCycle);
  const ptosisMultiplier = fatigueState.ptosisMultiplier;

  const eyelidTremor = Math.sin(time * 4) * 0.5 + Math.sin(time * 7) * 0.3;
  const rightCoverage = 12 + (ptosisMultiplier * intensity * 10) + eyelidTremor * 0.7;

  const rightPtosis = `
    linear-gradient(
      180deg,
      rgba(50, 42, 38, ${0.88 * intensity * ptosisMultiplier}) 0%,
      rgba(60, 50, 45, ${0.78 * intensity * ptosisMultiplier}) ${rightCoverage * 0.4}%,
      rgba(70, 57, 52, ${0.6 * intensity * ptosisMultiplier}) ${rightCoverage * 0.7}%,
      rgba(85, 70, 65, ${0.32 * intensity * ptosisMultiplier}) ${rightCoverage * 0.9}%,
      rgba(105, 85, 80, ${0.12 * intensity * ptosisMultiplier}) ${rightCoverage}%,
      transparent ${rightCoverage + 3}%
    )
  `;

  return {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    background: rightPtosis,
    mixBlendMode: 'normal' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9997
  };
}
