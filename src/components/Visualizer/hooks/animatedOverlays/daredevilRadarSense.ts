/**
 * Daredevil's Radar Sense overlay generator
 * Simulates Matt Murdock's enhanced perception - a "world on fire" visualization
 * Features:
 * - Dark, saturated reddish hue tint over the entire scene
 * - Random dark red lines suggesting edge detection / contours
 * - Glowing pulsating arcs suggesting sonar/radar waves
 * - Subtle pulsing to suggest the "living" nature of radar sense
 * - Edge vignette for depth
 */

/**
 * Generate Daredevil's Radar Sense overlay
 * Creates a dark red tint "infrasight" effect with edge lines like in the comics
 */
export function generateDaredevilRadarSenseOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Pulsing for the "living" radar sense feel
  const pulseIntensity = 0.92 + Math.sin(time * 1.5) * 0.08;
  const pulseIntensity2 = 0.94 + Math.sin(time * 2.0 + 0.5) * 0.06;
  const arcPulse1 = 0.5 + Math.sin(time * 1.2) * 0.3;
  const arcPulse2 = 0.5 + Math.sin(time * 1.4 + 1) * 0.3;
  const arcPulse3 = 0.5 + Math.sin(time * 1.1 + 2) * 0.3;
  const arcPulse4 = 0.5 + Math.sin(time * 1.3 + 3) * 0.3;

  // Base red tint opacity (increased for more redness)
  const baseOpacity = 0.82 * intensity * pulseIntensity;

  // Subtle rotating sweep for 360° awareness suggestion
  const sweepAngle = (time * 20) % 360;

  // Line positions that shift slowly (simulating edge detection lines)
  const line1Pos = 15 + Math.sin(time * 0.3) * 5;
  const line2Pos = 35 + Math.sin(time * 0.25 + 1) * 4;
  const line3Pos = 55 + Math.sin(time * 0.35 + 2) * 5;
  const line4Pos = 75 + Math.sin(time * 0.28 + 3) * 4;
  const line5Pos = 88 + Math.sin(time * 0.32 + 4) * 3;

  // Horizontal line positions
  const hLine1Pos = 20 + Math.sin(time * 0.22) * 4;
  const hLine2Pos = 45 + Math.sin(time * 0.27 + 1.5) * 5;
  const hLine3Pos = 70 + Math.sin(time * 0.24 + 2.5) * 4;
  const hLine4Pos = 90 + Math.sin(time * 0.29 + 3.5) * 3;

  // Main transparent rich red overlay (more intense red)
  const redTint = `
    linear-gradient(
      180deg,
      rgba(240,50,70,${baseOpacity}) 0%,
      rgba(220,40,60,${baseOpacity * 0.97}) 50%,
      rgba(200,35,55,${baseOpacity}) 100%
    )
  `;

  // Glowing pulsating arcs - positioned at different spots
  // Arc 1: Top-left area
  const arc1Size = 35 + Math.sin(time * 0.8) * 5;
  const glowingArc1 = `
    radial-gradient(ellipse ${arc1Size}% ${arc1Size * 0.6}% at 20% 25%,
      transparent 60%,
      rgba(255,80,100,${0.35 * intensity * arcPulse1}) 75%,
      rgba(255,60,80,${0.5 * intensity * arcPulse1}) 85%,
      rgba(200,40,60,${0.3 * intensity * arcPulse1}) 95%,
      transparent 100%
    )
  `;

  // Arc 2: Right side
  const arc2Size = 40 + Math.sin(time * 0.9 + 1.5) * 6;
  const glowingArc2 = `
    radial-gradient(ellipse ${arc2Size * 0.5}% ${arc2Size}% at 85% 50%,
      transparent 55%,
      rgba(255,70,90,${0.3 * intensity * arcPulse2}) 70%,
      rgba(255,55,75,${0.45 * intensity * arcPulse2}) 82%,
      rgba(180,35,55,${0.25 * intensity * arcPulse2}) 94%,
      transparent 100%
    )
  `;

  // Arc 3: Bottom center
  const arc3Size = 45 + Math.sin(time * 0.7 + 2.5) * 7;
  const glowingArc3 = `
    radial-gradient(ellipse ${arc3Size}% ${arc3Size * 0.5}% at 50% 85%,
      transparent 50%,
      rgba(255,75,95,${0.32 * intensity * arcPulse3}) 68%,
      rgba(255,60,80,${0.48 * intensity * arcPulse3}) 80%,
      rgba(190,38,58,${0.28 * intensity * arcPulse3}) 92%,
      transparent 100%
    )
  `;

  // Arc 4: Top-right area
  const arc4Size = 32 + Math.sin(time * 1.0 + 3.5) * 5;
  const glowingArc4 = `
    radial-gradient(ellipse ${arc4Size}% ${arc4Size * 0.7}% at 75% 20%,
      transparent 58%,
      rgba(255,85,105,${0.28 * intensity * arcPulse4}) 72%,
      rgba(255,65,85,${0.42 * intensity * arcPulse4}) 84%,
      rgba(185,40,60,${0.22 * intensity * arcPulse4}) 95%,
      transparent 100%
    )
  `;

  // Arc 5: Left center - pulsing wave ring
  const arc5Size = 28 + Math.sin(time * 1.1 + 4.5) * 4;
  const glowingArc5 = `
    radial-gradient(ellipse ${arc5Size * 0.6}% ${arc5Size}% at 12% 55%,
      transparent 52%,
      rgba(255,72,92,${0.26 * intensity * arcPulse1}) 68%,
      rgba(255,58,78,${0.4 * intensity * arcPulse1}) 82%,
      rgba(175,35,55,${0.2 * intensity * arcPulse1}) 94%,
      transparent 100%
    )
  `;

  // Arc 6: Center expanding wave
  const arc6Size = 50 + Math.sin(time * 0.6) * 15;
  const glowingArc6 = `
    radial-gradient(ellipse ${arc6Size}% ${arc6Size}% at 50% 50%,
      transparent 70%,
      rgba(255,65,85,${0.18 * intensity * arcPulse2}) 80%,
      rgba(255,50,70,${0.28 * intensity * arcPulse2}) 88%,
      rgba(160,30,50,${0.15 * intensity * arcPulse2}) 96%,
      transparent 100%
    )
  `;

  // Randomized angle offsets for organic lines
  const angle1 = 88 + Math.sin(time * 0.2) * 4;
  const angle2 = 92 + Math.sin(time * 0.18 + 1) * 3;
  const angle3 = 85 + Math.sin(time * 0.22 + 2) * 5;
  const hAngle1 = 178 + Math.sin(time * 0.19) * 4;
  const hAngle2 = 182 + Math.sin(time * 0.21 + 1.5) * 3;

  // Vertical-ish lines (slightly angled, not perfectly straight)
  const verticalLines1 = `
    linear-gradient(
      ${angle1}deg,
      transparent 0%,
      transparent ${line1Pos - 0.6}%,
      rgba(120,20,35,${0.6 * intensity}) ${line1Pos}%,
      transparent ${line1Pos + 0.6}%,
      transparent ${line3Pos - 0.5}%,
      rgba(110,18,30,${0.55 * intensity}) ${line3Pos}%,
      transparent ${line3Pos + 0.5}%,
      transparent 100%
    )
  `;

  const verticalLines2 = `
    linear-gradient(
      ${angle2}deg,
      transparent 0%,
      transparent ${line2Pos - 0.5}%,
      rgba(130,22,38,${0.55 * intensity}) ${line2Pos}%,
      transparent ${line2Pos + 0.5}%,
      transparent ${line4Pos - 0.4}%,
      rgba(115,20,32,${0.5 * intensity}) ${line4Pos}%,
      transparent ${line4Pos + 0.4}%,
      transparent 100%
    )
  `;

  const verticalLines3 = `
    linear-gradient(
      ${angle3}deg,
      transparent 0%,
      transparent ${line5Pos - 0.5}%,
      rgba(105,18,28,${0.5 * intensity}) ${line5Pos}%,
      transparent ${line5Pos + 0.5}%,
      transparent 100%
    )
  `;

  // Horizontal-ish lines (slightly angled)
  const horizontalLines1 = `
    linear-gradient(
      ${hAngle1}deg,
      transparent 0%,
      transparent ${hLine1Pos - 0.5}%,
      rgba(125,22,36,${0.55 * intensity}) ${hLine1Pos}%,
      transparent ${hLine1Pos + 0.5}%,
      transparent ${hLine3Pos - 0.4}%,
      rgba(110,18,30,${0.5 * intensity}) ${hLine3Pos}%,
      transparent ${hLine3Pos + 0.4}%,
      transparent 100%
    )
  `;

  const horizontalLines2 = `
    linear-gradient(
      ${hAngle2}deg,
      transparent 0%,
      transparent ${hLine2Pos - 0.5}%,
      rgba(135,25,40,${0.55 * intensity}) ${hLine2Pos}%,
      transparent ${hLine2Pos + 0.5}%,
      transparent ${hLine4Pos - 0.4}%,
      rgba(115,20,34,${0.48 * intensity}) ${hLine4Pos}%,
      transparent ${hLine4Pos + 0.4}%,
      transparent 100%
    )
  `;

  // Diagonal lines with varying angles
  const diagAngle1 = 42 + Math.sin(time * 0.15) * 6;
  const diagAngle2 = -48 + Math.sin(time * 0.17 + 1) * 5;

  const diagonalLines = `
    repeating-linear-gradient(
      ${diagAngle1}deg,
      transparent 0px,
      transparent ${38 + Math.sin(time * 0.4) * 8}px,
      rgba(120,25,40,${0.32 * intensity * pulseIntensity2}) ${40 + Math.sin(time * 0.4) * 8}px,
      transparent ${43 + Math.sin(time * 0.4) * 8}px
    )
  `;

  const diagonalLines2 = `
    repeating-linear-gradient(
      ${diagAngle2}deg,
      transparent 0px,
      transparent ${52 + Math.sin(time * 0.35 + 1) * 10}px,
      rgba(110,22,35,${0.28 * intensity * pulseIntensity}) ${55 + Math.sin(time * 0.35 + 1) * 10}px,
      transparent ${58 + Math.sin(time * 0.35 + 1) * 10}px
    )
  `;

  // Sweep effect (brighter red)
  const radarSweep = `
    conic-gradient(
      from ${sweepAngle}deg at 50% 50%,
      rgba(255,70,90,${0.22 * intensity * pulseIntensity2}) 0deg,
      transparent 60deg,
      transparent 300deg,
      rgba(255,70,90,${0.22 * intensity * pulseIntensity2}) 360deg
    )
  `;

  // Vignette for depth (richer red at edges)
  const vignette = `
    radial-gradient(ellipse 80% 80% at 50% 50%,
      transparent 0%,
      transparent 25%,
      rgba(180,35,55,${0.4 * intensity}) 55%,
      rgba(130,25,40,${0.6 * intensity}) 100%
    )
  `;

  const background = `
    ${glowingArc1},
    ${glowingArc2},
    ${glowingArc3},
    ${glowingArc4},
    ${glowingArc5},
    ${glowingArc6},
    ${diagonalLines},
    ${diagonalLines2},
    ${verticalLines1},
    ${verticalLines2},
    ${verticalLines3},
    ${horizontalLines1},
    ${horizontalLines2},
    ${radarSweep},
    ${vignette},
    ${redTint}
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
    mixBlendMode: 'multiply' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
