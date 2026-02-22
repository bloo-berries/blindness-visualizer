/**
 * Starbursting overlay generator
 * Creates dynamic starbursts that move across the frame to catch various light sources
 */

/**
 * Generate animated Starbursting overlay
 */
export function generateStarburstingOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Many light source positions that slowly drift to catch various bright spots
  // Covers common light source areas: upper sky, middle where lights/windows appear, scattered
  const baseLightSources = [
    // Upper row (sky, sun, overhead lights)
    { baseX: 15, baseY: 8, size: 0.5, phase: 0 },
    { baseX: 35, baseY: 12, size: 0.7, phase: 1.2 },
    { baseX: 50, baseY: 6, size: 0.9, phase: 0.5 },
    { baseX: 65, baseY: 10, size: 0.75, phase: 1.8 },
    { baseX: 85, baseY: 8, size: 0.55, phase: 2.5 },
    // Upper-middle row (street lights, signs, windows)
    { baseX: 10, baseY: 25, size: 0.5, phase: 0.8 },
    { baseX: 30, baseY: 22, size: 0.6, phase: 2.1 },
    { baseX: 50, baseY: 28, size: 0.65, phase: 1.5 },
    { baseX: 70, baseY: 24, size: 0.55, phase: 0.3 },
    { baseX: 90, baseY: 26, size: 0.5, phase: 2.8 },
    // Middle row (shop windows, car lights, reflections)
    { baseX: 20, baseY: 42, size: 0.45, phase: 1.0 },
    { baseX: 40, baseY: 38, size: 0.5, phase: 2.3 },
    { baseX: 60, baseY: 45, size: 0.55, phase: 0.7 },
    { baseX: 80, baseY: 40, size: 0.5, phase: 1.9 },
    // Lower-middle row (ground reflections, low lights)
    { baseX: 25, baseY: 60, size: 0.4, phase: 1.6 },
    { baseX: 50, baseY: 58, size: 0.45, phase: 2.6 },
    { baseX: 75, baseY: 62, size: 0.4, phase: 0.4 },
  ];

  // Number of rays (8 is classic starburst)
  const numRays = 8;
  const rayWidth = 0.8 + intensity * 0.7;

  for (const source of baseLightSources) {
    // Slow drift movement for each starburst
    const driftX = Math.sin(time * 0.15 + source.phase) * 8;
    const driftY = Math.cos(time * 0.12 + source.phase * 1.3) * 6;
    const x = source.baseX + driftX;
    const y = source.baseY + driftY;

    // Pulsing intensity - each source pulses at different rates
    const pulsePhase = Math.sin(time * 0.4 + source.phase * 2) * 0.3 + 0.7;
    const baseOpacity = (0.35 + intensity * 0.45) * source.size * pulsePhase;

    // Skip if opacity too low (performance optimization)
    if (baseOpacity < 0.1) continue;

    const rayLength = (20 + intensity * 35) * source.size;

    // Build conic gradient stops for sharp, thin rays
    const conicStops: string[] = [];
    const angleStep = 360 / numRays;

    for (let i = 0; i < numRays; i++) {
      const rayAngle = i * angleStep;

      conicStops.push(`transparent ${rayAngle - rayWidth}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle - rayWidth * 0.5}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity}) ${rayAngle}deg`);
      conicStops.push(`rgba(255,255,255,${baseOpacity * 0.4}) ${rayAngle + rayWidth * 0.5}deg`);
      conicStops.push(`transparent ${rayAngle + rayWidth}deg`);
    }

    // Conic gradient for the star rays pattern
    elements.push(`
      conic-gradient(
        from 22.5deg at ${x}% ${y}%,
        ${conicStops.join(', ')}
      )
    `);

    // Radial gradient to fade the rays outward
    elements.push(`
      radial-gradient(
        ellipse ${rayLength * 1.2}% ${rayLength}% at ${x}% ${y}%,
        transparent 0%,
        transparent 3%,
        rgba(0,0,0,0.3) 15%,
        rgba(0,0,0,0.7) 40%,
        rgba(0,0,0,0.95) 70%,
        black 100%
      )
    `);

    // Bright central glow/core
    const coreSize = 2 + intensity * 3;
    elements.push(`
      radial-gradient(
        circle at ${x}% ${y}%,
        rgba(255,255,255,${Math.min(1, baseOpacity * 1.4)}) 0%,
        rgba(255,255,240,${baseOpacity * 0.9}) ${coreSize * 0.4}%,
        rgba(255,255,220,${baseOpacity * 0.5}) ${coreSize * 0.7}%,
        transparent ${coreSize * 1.5}%
      )
    `);

    // Secondary thin rays for extra sharpness
    const secondaryStops: string[] = [];
    const thinRayWidth = rayWidth * 0.35;
    for (let i = 0; i < numRays; i++) {
      const rayAngle = i * angleStep + angleStep / 2;
      secondaryStops.push(`transparent ${rayAngle - thinRayWidth}deg`);
      secondaryStops.push(`rgba(255,255,255,${baseOpacity * 0.25}) ${rayAngle}deg`);
      secondaryStops.push(`transparent ${rayAngle + thinRayWidth}deg`);
    }

    elements.push(`
      conic-gradient(
        from 22.5deg at ${x}% ${y}%,
        ${secondaryStops.join(', ')}
      )
    `);
  }

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
    opacity: Math.min(0.95, 0.5 + intensity * 0.45),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
