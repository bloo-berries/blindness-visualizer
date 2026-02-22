/**
 * Sugar Ray Leonard's Retinal Detachment overlay generator
 * Peripheral flashes (photopsia) - lightning-like arcs at edges
 * Also includes subtle floater drift animation
 */

/**
 * Generate Sugar Ray Leonard's Retinal Detachment animated effects
 */
export function generateSugarRetinalDetachmentOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;
  const elements: string[] = [];

  // PERIPHERAL FLASHES (photopsia) - 2-3 brief lightning-like flashes
  // These appear randomly at the edges of the visual field
  // They represent vitreous gel tugging on still-attached retina

  // Flash timing - each flash has its own cycle
  const flash1Phase = (Math.sin(time * 2.5) + 1) / 2; // 0-1 cycling
  const flash2Phase = (Math.sin(time * 1.8 + 1.5) + 1) / 2;
  const flash3Phase = (Math.sin(time * 3.2 + 3) + 1) / 2;

  // Flashes are only visible briefly when phase is high (>0.85)
  const flash1Visible = flash1Phase > 0.88 ? (flash1Phase - 0.88) * 8 : 0;
  const flash2Visible = flash2Phase > 0.90 ? (flash2Phase - 0.90) * 10 : 0;
  const flash3Visible = flash3Phase > 0.92 ? (flash3Phase - 0.92) * 12 : 0;

  // Flash positions - at periphery, moving slightly
  const flash1X = 15 + Math.sin(time * 0.3) * 8;
  const flash1Y = 25 + Math.cos(time * 0.25) * 10;

  const flash2X = 85 + Math.sin(time * 0.35 + 1) * 6;
  const flash2Y = 35 + Math.cos(time * 0.28 + 1) * 8;

  const flash3X = 10 + Math.sin(time * 0.4 + 2) * 5;
  const flash3Y = 60 + Math.cos(time * 0.32 + 2) * 7;

  // Flash 1 - arc-shaped at upper left periphery
  if (flash1Visible > 0) {
    const flashOpacity = flash1Visible * intensity * 0.9;
    elements.push(`
      radial-gradient(ellipse 15% 4% at ${flash1X}% ${flash1Y}%,
        rgba(255,255,255,${flashOpacity}) 0%,
        rgba(220,235,255,${flashOpacity * 0.7}) 30%,
        rgba(180,210,255,${flashOpacity * 0.4}) 60%,
        transparent 100%
      )
    `);
    // Secondary glow
    elements.push(`
      radial-gradient(ellipse 20% 8% at ${flash1X}% ${flash1Y}%,
        rgba(200,220,255,${flashOpacity * 0.3}) 0%,
        transparent 70%
      )
    `);
  }

  // Flash 2 - arc at right periphery
  if (flash2Visible > 0) {
    const flashOpacity = flash2Visible * intensity * 0.8;
    elements.push(`
      radial-gradient(ellipse 12% 5% at ${flash2X}% ${flash2Y}%,
        rgba(255,255,255,${flashOpacity}) 0%,
        rgba(230,240,255,${flashOpacity * 0.6}) 40%,
        transparent 100%
      )
    `);
  }

  // Flash 3 - smaller flash at left edge
  if (flash3Visible > 0) {
    const flashOpacity = flash3Visible * intensity * 0.7;
    elements.push(`
      radial-gradient(ellipse 8% 3% at ${flash3X}% ${flash3Y}%,
        rgba(255,255,255,${flashOpacity}) 0%,
        rgba(200,225,255,${flashOpacity * 0.5}) 50%,
        transparent 100%
      )
    `);
  }

  // DRIFTING FLOATERS - subtle movement to existing floaters
  // These add to the static floaters from the DOM overlay
  const driftX = Math.sin(time * 0.15) * 2;
  const driftY = Math.cos(time * 0.12) * 1.5;

  // A few animated floater specks that drift slowly
  const floaterPositions = [
    { baseX: 40, baseY: 45, size: 2 },
    { baseX: 55, baseY: 50, size: 1.5 },
    { baseX: 48, baseY: 55, size: 1.8 },
    { baseX: 35, baseY: 48, size: 1.3 }
  ];

  for (let i = 0; i < floaterPositions.length; i++) {
    const f = floaterPositions[i];
    const offsetX = Math.sin(time * 0.1 + i * 1.5) * 3;
    const offsetY = Math.cos(time * 0.08 + i * 1.2) * 2.5;
    const x = f.baseX + driftX + offsetX;
    const y = f.baseY + driftY + offsetY;

    elements.push(`
      radial-gradient(circle at ${x}% ${y}%,
        rgba(50,50,55,${intensity * 0.4}) 0%,
        rgba(60,60,65,${intensity * 0.25}) ${f.size}%,
        transparent ${f.size * 2.5}%
      )
    `);
  }

  // A drifting cobweb strand
  const strandX = 45 + Math.sin(time * 0.08) * 4;
  const strandY = 48 + Math.cos(time * 0.06) * 3;
  elements.push(`
    radial-gradient(ellipse 10% 2% at ${strandX}% ${strandY}%,
      rgba(55,55,60,${intensity * 0.35}) 0%,
      rgba(65,65,70,${intensity * 0.20}) 50%,
      transparent 100%
    )
  `);

  // Subtle overall movement/shimmer in the haziness
  const hazeShimmer = 0.95 + Math.sin(time * 0.5) * 0.05;
  elements.push(`
    radial-gradient(ellipse 100% 100% at 50% 50%,
      rgba(180,180,185,${intensity * 0.06 * hazeShimmer}) 0%,
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
    background: elements.length > 0 ? elements.join(', ') : 'transparent',
    mixBlendMode: 'screen' as const,
    opacity: Math.min(0.95, 0.6 + intensity * 0.35),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
