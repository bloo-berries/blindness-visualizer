/**
 * Palinopsia (Visual Perseveration) overlay generator
 * Trailing images, light streaking, and prolonged afterimages
 */

/**
 * Generate Palinopsia (Visual Perseveration) overlay styles
 */
export function generatePalinopsiaOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Subtle animation for the trailing effect
  const trailPhase = Math.sin(time * 0.4) * 0.1 + 0.9;
  const driftPhase = Math.sin(time * 0.2) * 2;

  // Number of trail copies based on intensity (3-8 trails)
  const numTrails = Math.floor(3 + intensity * 5);

  // Create trailing ghost images - offset in a direction to simulate motion trail
  const trailAngle = (time * 0.1) % (Math.PI * 2);
  const baseTrailDistance = 3 + intensity * 8;

  for (let i = 1; i <= numTrails; i++) {
    const distance = baseTrailDistance * i * 0.4;
    const offsetX = Math.cos(trailAngle) * distance + driftPhase * 0.3;
    const offsetY = Math.sin(trailAngle) * distance;

    const trailOpacity = (0.25 - i * 0.03) * intensity * trailPhase;

    elements.push(`
      radial-gradient(
        ellipse 100% 100% at ${50 + offsetX}% ${50 + offsetY}%,
        rgba(200,200,200,${trailOpacity}) 0%,
        rgba(180,180,180,${trailOpacity * 0.7}) 30%,
        rgba(150,150,150,${trailOpacity * 0.4}) 60%,
        transparent 85%
      )
    `);
  }

  // Light streaking effect
  const streakOpacity = 0.15 * intensity * trailPhase;
  const streakAngle = (trailAngle * 180 / Math.PI);

  elements.push(`
    linear-gradient(
      ${streakAngle}deg,
      transparent 0%,
      rgba(255,255,255,${streakOpacity}) 20%,
      rgba(255,255,255,${streakOpacity * 1.2}) 40%,
      rgba(255,255,255,${streakOpacity * 0.8}) 60%,
      rgba(255,255,255,${streakOpacity * 0.4}) 80%,
      transparent 100%
    )
  `);

  // Prolonged afterimage spots
  const numAfterimages = Math.floor(2 + intensity * 4);
  for (let i = 0; i < numAfterimages; i++) {
    const seed = i * 5.17;
    const x = 20 + (Math.sin(seed * 1.3) * 0.5 + 0.5) * 60;
    const y = 20 + (Math.cos(seed * 1.1) * 0.5 + 0.5) * 60;

    const driftX = Math.sin(time * 0.15 + seed) * 3;
    const driftY = Math.cos(time * 0.12 + seed * 0.8) * 3;
    const actualX = x + driftX;
    const actualY = y + driftY;

    const size = 10 + (i % 4) * 5;
    const afterimageOpacity = (0.12 + (i % 3) * 0.05) * intensity * trailPhase;

    elements.push(`
      radial-gradient(
        ellipse ${size}% ${size * 0.8}% at ${actualX}% ${actualY}%,
        rgba(255,255,255,${afterimageOpacity}) 0%,
        rgba(240,240,240,${afterimageOpacity * 0.6}) 40%,
        transparent 100%
      )
    `);
  }

  // Overall haze
  elements.push(`
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      rgba(255,255,255,${0.05 * intensity * trailPhase}) 0%,
      transparent 70%
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
    opacity: Math.min(0.9, 0.5 + intensity * 0.4),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
