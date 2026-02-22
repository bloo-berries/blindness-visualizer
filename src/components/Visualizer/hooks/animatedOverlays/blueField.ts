/**
 * Blue Field Entoptic Phenomenon overlay generator
 * Generates white blood cell sprites moving through retinal capillaries
 */

/**
 * Generate Blue Field Entoptic Phenomenon overlay styles
 */
export function generateBlueFieldOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const numSprites = Math.floor(10 + intensity * 10); // 10-20 sprites

  // Time-based animation for smooth movement
  const time = now / 1000;

  for (let i = 0; i < numSprites; i++) {
    // Deterministic but varied path using index as seed
    const seed = i * 7.31;
    const pathSeed = Math.sin(seed) * 10000;

    // Animation phase for this sprite (staggered)
    const phase = ((time * 1.5 + i * 0.3) % 1.2) / 1.2; // 0-1 cycling faster

    // Central area positioning (within 30% of center)
    const centerOffset = 30;
    const baseX = 50 + Math.sin(pathSeed * 1.1) * centerOffset;
    const baseY = 50 + Math.cos(pathSeed * 1.3) * centerOffset;

    // Path movement
    const pathLength = 15 + Math.abs(Math.sin(pathSeed * 1.7)) * 15;
    const pathAngle = Math.sin(pathSeed * 2.1) * 360 * Math.PI / 180;

    // Curved path with wobble
    const wobble = Math.sin(phase * Math.PI * 4 + pathSeed) * 4;
    const x = baseX + Math.cos(pathAngle) * pathLength * phase + wobble;
    const y = baseY + Math.sin(pathAngle) * pathLength * phase + Math.cos(phase * Math.PI * 3) * 3;

    // Fade in and out along path - sharper transitions for better visibility
    const fadeIn = Math.min(1, phase * 8);
    const fadeOut = Math.min(1, (1 - phase) * 8);
    const spriteOpacity = Math.min(fadeIn, fadeOut) * (0.7 + intensity * 0.3);

    // Sprite size - larger for visibility
    const size = 6 + intensity * 4; // 6-10px

    // Bright white dot with strong glow
    elements.push(`
      radial-gradient(circle ${size}px at ${x}% ${y}%,
        rgba(255,255,255,${spriteOpacity}) 0%,
        rgba(255,255,255,${spriteOpacity * 0.7}) 30%,
        rgba(220,240,255,${spriteOpacity * 0.4}) 60%,
        transparent 100%
      )
    `);

    // Dark tail behind some sprites (red blood cells)
    if (i % 2 === 0 && phase > 0.15) {
      const tailX = x - Math.cos(pathAngle) * 4;
      const tailY = y - Math.sin(pathAngle) * 4;
      elements.push(`
        radial-gradient(circle ${size * 0.5}px at ${tailX}% ${tailY}%,
          rgba(80,40,40,${spriteOpacity * 0.5}) 0%,
          transparent 100%
        )
      `);
    }
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
    mixBlendMode: 'normal' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
