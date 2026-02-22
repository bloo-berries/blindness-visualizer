/**
 * Persistent Positive Visual Phenomenon (PPVP) overlay generator
 * Afterimages that persist much longer than normal, bright spots, and complementary colored shapes
 */

/**
 * Generate Persistent Positive Visual Phenomenon overlay styles
 */
export function generatePersistentPositiveOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Pulsing phase for persistence effect
  const pulsePhase = Math.sin(time * 0.3) * 0.15 + 0.85;
  const slowPulse = Math.sin(time * 0.15) * 0.1 + 0.9;

  // Number of afterimage spots based on intensity
  const numSpots = Math.floor(5 + intensity * 8); // 5-13 spots

  // Generate persistent afterimage spots
  for (let i = 0; i < numSpots; i++) {
    // Deterministic positioning
    const seed = i * 3.17;
    const x = 15 + (Math.sin(seed * 1.1) * 0.5 + 0.5) * 70;
    const y = 15 + (Math.cos(seed * 1.3) * 0.5 + 0.5) * 70;

    // Slight drift for "lingering" effect
    const driftX = Math.sin(time * 0.2 + seed) * 2;
    const driftY = Math.cos(time * 0.15 + seed * 1.2) * 2;
    const actualX = x + driftX;
    const actualY = y + driftY;

    // Size varies
    const size = 8 + (i % 5) * 6;

    // Alternate between complementary colors (negative afterimages)
    // and bright spots (positive afterimages)
    const colorType = i % 6;
    let color: string;
    const baseOpacity = (0.3 + (i % 4) * 0.1) * intensity * pulsePhase;

    switch (colorType) {
      case 0: // Cyan (complementary to red)
        color = `rgba(0,255,255,${baseOpacity})`;
        break;
      case 1: // Magenta (complementary to green)
        color = `rgba(255,0,255,${baseOpacity * 0.9})`;
        break;
      case 2: // Yellow (complementary to blue)
        color = `rgba(255,255,0,${baseOpacity * 0.85})`;
        break;
      case 3: // Bright white (positive afterimage)
        color = `rgba(255,255,255,${baseOpacity})`;
        break;
      case 4: // Pale blue
        color = `rgba(150,200,255,${baseOpacity * 0.9})`;
        break;
      default: // Pale green
        color = `rgba(180,255,180,${baseOpacity * 0.85})`;
    }

    // Create soft, glowing afterimage spots
    elements.push(`
      radial-gradient(
        ellipse ${size}% ${size * 0.8}% at ${actualX}% ${actualY}%,
        ${color} 0%,
        ${color.replace(/[\d.]+\)$/, `${baseOpacity * 0.5})`)} 40%,
        transparent 100%
      )
    `);
  }

  // Add larger, more diffuse "ghost" shapes that persist
  const numGhosts = Math.floor(2 + intensity * 3);
  for (let i = 0; i < numGhosts; i++) {
    const seed = i * 7.23 + 100;
    const x = 20 + (Math.sin(seed * 0.9) * 0.5 + 0.5) * 60;
    const y = 20 + (Math.cos(seed * 1.1) * 0.5 + 0.5) * 60;
    const driftX = Math.sin(time * 0.1 + seed) * 3;
    const driftY = Math.cos(time * 0.08 + seed) * 3;
    const actualX = x + driftX;
    const actualY = y + driftY;
    const width = 15 + (i % 3) * 8;
    const height = 12 + (i % 4) * 6;
    const ghostOpacity = (0.15 + (i % 3) * 0.08) * intensity * slowPulse;

    // Faded ghost image effect
    elements.push(`
      radial-gradient(
        ellipse ${width}% ${height}% at ${actualX}% ${actualY}%,
        rgba(255,255,255,${ghostOpacity}) 0%,
        rgba(240,245,255,${ghostOpacity * 0.6}) 30%,
        rgba(220,235,255,${ghostOpacity * 0.3}) 60%,
        transparent 100%
      )
    `);
  }

  // Add geometric pattern persistence (common in PPVP)
  const patternOpacity = 0.12 * intensity * pulsePhase;
  elements.push(`
    radial-gradient(
      circle at 30% 40%,
      rgba(255,200,100,${patternOpacity}) 0%,
      transparent 15%
    )
  `);
  elements.push(`
    radial-gradient(
      circle at 70% 35%,
      rgba(100,200,255,${patternOpacity * 0.9}) 0%,
      transparent 12%
    )
  `);
  elements.push(`
    radial-gradient(
      circle at 55% 65%,
      rgba(255,150,200,${patternOpacity * 0.85}) 0%,
      transparent 18%
    )
  `);

  // Overall slight brightness/haze to simulate visual interference
  elements.push(`
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      rgba(255,255,255,${0.08 * intensity * slowPulse}) 0%,
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
    opacity: Math.min(0.95, 0.6 + intensity * 0.35),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
