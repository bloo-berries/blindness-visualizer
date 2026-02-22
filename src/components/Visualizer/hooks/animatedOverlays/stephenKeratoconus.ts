/**
 * Stephen Curry's Keratoconus overlay generator
 * Drifting ghosting/polyopia, animated light streaks, and fluctuating waviness
 * Simulates the persistent visual frustration of keratoconus
 */

/**
 * Generate Stephen Curry's Keratoconus animated effects
 */
export function generateStephenKeratoconusOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;
  const elements: string[] = [];

  // DRIFTING GHOSTING / POLYOPIA
  // 2-4 ghost images that shift slightly, creating "dirty" chaotic scattering
  // Ghosts spread in consistent direction (matching coma axis - inferior/downward-left)

  // Ghost drift phase - slow, subtle movement
  const ghostDriftX = Math.sin(time * 0.2) * 1.5;
  const ghostDriftY = Math.cos(time * 0.15) * 1.2;

  // Ghost positions - offset in coma direction (inferior/downward-left from 50,50)
  const ghostPositions = [
    { baseX: 48, baseY: 52, opacity: 0.18, size: 96 },  // Primary ghost - close
    { baseX: 46, baseY: 54, opacity: 0.12, size: 92 },  // Secondary ghost
    { baseX: 44, baseY: 56, opacity: 0.07, size: 88 },  // Tertiary ghost - distant
    { baseX: 52, baseY: 48, opacity: 0.05, size: 94 },  // Opposite direction - very faint
  ];

  for (let i = 0; i < ghostPositions.length; i++) {
    const ghost = ghostPositions[i];
    // Each ghost drifts at slightly different rate
    const x = ghost.baseX + ghostDriftX * (1 + i * 0.15);
    const y = ghost.baseY + ghostDriftY * (1 + i * 0.12);

    elements.push(`
      radial-gradient(ellipse ${ghost.size}% ${ghost.size}% at ${x}% ${y}%,
        rgba(165,165,170,${intensity * ghost.opacity}) 0%,
        rgba(155,155,160,${intensity * ghost.opacity * 0.7}) 35%,
        rgba(145,145,150,${intensity * ghost.opacity * 0.4}) 65%,
        transparent 90%
      )
    `);
  }

  // Streaking connection between ghosts
  const streakPhase = 0.9 + Math.sin(time * 0.3) * 0.1;
  elements.push(`
    linear-gradient(
      160deg,
      transparent 0%,
      rgba(150,150,155,${intensity * 0.06 * streakPhase}) 35%,
      rgba(150,150,155,${intensity * 0.10 * streakPhase}) 50%,
      rgba(150,150,155,${intensity * 0.06 * streakPhase}) 65%,
      transparent 100%
    )
  `);

  // ANIMATED IRREGULAR HALOS / LIGHT STREAKS
  // Comet-like tails from simulated light positions that pulse and drift

  const lightSources = [
    { baseX: 50, baseY: 25, size: 12, tailLength: 18 },  // Center top
    { baseX: 25, baseY: 20, size: 10, tailLength: 14 },  // Upper left
    { baseX: 75, baseY: 22, size: 10, tailLength: 14 },  // Upper right
    { baseX: 35, baseY: 35, size: 8, tailLength: 12 },   // Middle left
    { baseX: 65, baseY: 38, size: 8, tailLength: 12 },   // Middle right
  ];

  for (let i = 0; i < lightSources.length; i++) {
    const light = lightSources[i];

    // Each light drifts slowly
    const lightDriftX = Math.sin(time * 0.12 + i * 1.2) * 4;
    const lightDriftY = Math.cos(time * 0.10 + i * 0.9) * 3;
    const x = light.baseX + lightDriftX;
    const y = light.baseY + lightDriftY;

    // Pulsing bloom intensity
    const pulsePhase = 0.7 + Math.sin(time * 0.4 + i * 1.5) * 0.3;
    const bloomOpacity = intensity * 0.22 * pulsePhase;

    // Core bloom
    elements.push(`
      radial-gradient(ellipse ${light.size}% ${light.size * 0.8}% at ${x}% ${y}%,
        rgba(255,255,252,${bloomOpacity}) 0%,
        rgba(255,255,248,${bloomOpacity * 0.65}) 35%,
        rgba(255,250,245,${bloomOpacity * 0.35}) 65%,
        transparent 100%
      )
    `);

    // Comet tail - trailing downward-left (coma direction)
    const tailX = x - light.tailLength * 0.25;
    const tailY = y + light.tailLength * 0.8;
    elements.push(`
      radial-gradient(ellipse ${light.size * 0.5}% ${light.tailLength * 0.9}% at ${tailX}% ${tailY}%,
        rgba(255,255,250,${bloomOpacity * 0.55}) 0%,
        rgba(255,250,248,${bloomOpacity * 0.35}) 35%,
        rgba(250,248,245,${bloomOpacity * 0.18}) 65%,
        transparent 100%
      )
    `);
  }

  // FLUCTUATING WAVINESS
  // Subtle wave patterns that shift, simulating irregular astigmatism

  const wavePhase = Math.sin(time * 0.25) * 0.5 + 0.5;
  const waveIntensity = intensity * 0.08 * (0.8 + wavePhase * 0.4);

  // Horizontal wave bands
  const waveY1 = 25 + Math.sin(time * 0.2) * 5;
  const waveY2 = 50 + Math.sin(time * 0.18 + 1) * 4;
  const waveY3 = 75 + Math.sin(time * 0.22 + 2) * 5;

  elements.push(`
    linear-gradient(
      0deg,
      transparent ${waveY1 - 4}%,
      rgba(140,140,145,${waveIntensity}) ${waveY1 - 1}%,
      rgba(130,130,135,${waveIntensity * 1.3}) ${waveY1}%,
      rgba(140,140,145,${waveIntensity}) ${waveY1 + 1}%,
      transparent ${waveY1 + 4}%
    )
  `);

  elements.push(`
    linear-gradient(
      0deg,
      transparent ${waveY2 - 3}%,
      rgba(135,135,140,${waveIntensity * 0.9}) ${waveY2}%,
      transparent ${waveY2 + 3}%
    )
  `);

  elements.push(`
    linear-gradient(
      0deg,
      transparent ${waveY3 - 4}%,
      rgba(140,140,145,${waveIntensity * 0.85}) ${waveY3}%,
      transparent ${waveY3 + 4}%
    )
  `);

  // ASYMMETRIC DISTORTION PULSE
  // Left side has more distortion - subtle pulse
  const asymmetryPulse = 0.85 + Math.sin(time * 0.35) * 0.15;
  elements.push(`
    linear-gradient(
      90deg,
      rgba(125,125,130,${intensity * 0.12 * asymmetryPulse}) 0%,
      rgba(135,135,140,${intensity * 0.08 * asymmetryPulse}) 18%,
      rgba(145,145,150,${intensity * 0.04 * asymmetryPulse}) 35%,
      transparent 55%
    )
  `);

  // OVERALL HAZE FLUCTUATION
  // Milky film effect that subtly varies
  const hazePulse = 0.9 + Math.sin(time * 0.4) * 0.1;
  elements.push(`
    radial-gradient(ellipse 150% 150% at 50% 50%,
      rgba(205,205,210,${intensity * 0.10 * hazePulse}) 0%,
      rgba(200,200,205,${intensity * 0.08 * hazePulse}) 40%,
      rgba(195,195,200,${intensity * 0.05 * hazePulse}) 70%,
      transparent 100%
    )
  `);

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: elements.join(', '),
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.85, 0.55 + intensity * 0.3),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
