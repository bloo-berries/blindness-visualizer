/**
 * Christine Ha's Fluctuating Vision overlay generator
 * Simulates Uhthoff's phenomenon - vision that fluctuates with subtle variations in fog density
 * Creates drifting fog layers and animated light scatter bloom points
 */

/**
 * Generate Christine Ha's Fluctuating Vision overlay
 */
export function generateChristineFluctuatingOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Subtle fog density fluctuation (Uhthoff's phenomenon - vision varies with temperature/fatigue)
  const densityWave = Math.sin(time * 0.3) * 0.08 + 0.92;
  const densityWave2 = Math.sin(time * 0.22 + 1.5) * 0.06 + 0.94;

  // Slow drift movement for the fog layers
  const driftX = Math.sin(time * 0.12) * 2;
  const driftY = Math.cos(time * 0.1) * 1.5;
  const driftX2 = Math.sin(time * 0.09 + 2) * 1.8;
  const driftY2 = Math.cos(time * 0.11 + 1) * 1.3;

  // Light sensitivity bloom positions that drift slowly
  const bloom1X = 28 + Math.sin(time * 0.15) * 12;
  const bloom1Y = 22 + Math.cos(time * 0.12) * 10;
  const bloom2X = 72 + Math.sin(time * 0.18 + 1) * 10;
  const bloom2Y = 30 + Math.cos(time * 0.14 + 1) * 8;
  const bloom3X = 50 + Math.sin(time * 0.13 + 2) * 8;
  const bloom3Y = 45 + Math.cos(time * 0.16 + 2) * 7;

  // Bloom intensity with subtle pulsing
  const bloomPulse = 0.3 + Math.sin(time * 0.4) * 0.12;
  const bloomPulse2 = 0.28 + Math.sin(time * 0.35 + 1.2) * 0.10;
  const bloomIntensity = bloomPulse * intensity;
  const bloomIntensity2 = bloomPulse2 * intensity;

  // Primary drifting fog layer
  const driftingFog1 = `
    radial-gradient(ellipse 200% 200% at ${50 + driftX}% ${50 + driftY}%,
      rgba(248,248,252,${intensity * 0.55 * densityWave}) 0%,
      rgba(246,246,250,${intensity * 0.52 * densityWave}) 20%,
      rgba(244,244,248,${intensity * 0.48 * densityWave}) 40%,
      rgba(242,242,246,${intensity * 0.44 * densityWave}) 60%,
      rgba(240,240,244,${intensity * 0.40 * densityWave}) 80%,
      rgba(238,238,242,${intensity * 0.36 * densityWave}) 100%
    )
  `;

  // Secondary fog layer with opposite drift
  const driftingFog2 = `
    radial-gradient(ellipse 180% 160% at ${50 + driftX2}% ${50 + driftY2}%,
      rgba(250,250,254,${intensity * 0.40 * densityWave2}) 0%,
      rgba(248,248,252,${intensity * 0.35 * densityWave2}) 35%,
      rgba(246,246,250,${intensity * 0.30 * densityWave2}) 65%,
      transparent 100%
    )
  `;

  // Third fog layer for additional depth
  const driftingFog3 = `
    radial-gradient(ellipse 160% 180% at ${50 - driftX * 0.7}% ${50 - driftY * 0.8}%,
      rgba(252,252,255,${intensity * 0.35 * densityWave}) 0%,
      rgba(250,250,254,${intensity * 0.28 * densityWave}) 40%,
      rgba(248,248,252,${intensity * 0.22 * densityWave}) 70%,
      transparent 100%
    )
  `;

  // Light bloom spot 1 (upper left area)
  const lightBloom1 = `
    radial-gradient(circle at ${bloom1X}% ${bloom1Y}%,
      rgba(255,255,252,${bloomIntensity * 0.65}) 0%,
      rgba(255,255,250,${bloomIntensity * 0.45}) 15%,
      rgba(255,255,248,${bloomIntensity * 0.28}) 30%,
      transparent 50%
    )
  `;

  // Light bloom spot 2 (upper right area)
  const lightBloom2 = `
    radial-gradient(circle at ${bloom2X}% ${bloom2Y}%,
      rgba(255,255,250,${bloomIntensity2 * 0.55}) 0%,
      rgba(255,255,248,${bloomIntensity2 * 0.38}) 18%,
      rgba(255,255,245,${bloomIntensity2 * 0.22}) 35%,
      transparent 55%
    )
  `;

  // Light bloom spot 3 (center area)
  const lightBloom3 = `
    radial-gradient(circle at ${bloom3X}% ${bloom3Y}%,
      rgba(255,255,252,${bloomIntensity * 0.45}) 0%,
      rgba(255,255,248,${bloomIntensity * 0.30}) 20%,
      transparent 45%
    )
  `;

  // Note: Near-distance exception zone is handled in christineHaOverlays.ts with multiply blend
  // We can't apply it here since this overlay uses screen blend mode

  const background = `
    ${lightBloom1},
    ${lightBloom2},
    ${lightBloom3},
    ${driftingFog2},
    ${driftingFog3},
    ${driftingFog1}
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
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.92, 0.65 + intensity * 0.27),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
