/**
 * Toph Beifong's Seismic Sense overlay generator
 *
 * Simulates "seeing" through earth vibrations - a unique form of echolocation
 * that detects shapes, movement, and even heartbeats through ground contact.
 *
 * Visual Style:
 * - Topographic wireframe / displacement map
 * - Dark background with pale green phosphor glow
 * - Like sonar, LiDAR, or oscilloscope output
 *
 * Features:
 * - Radial "ping" waves that sweep outward (active sonar effect)
 * - Grid lines representing terrain topology
 * - Pulsing "heartbeat" elements for living beings
 * - Motion ripples from detected movement
 * - Fading effect representing temporal decay of perception
 */

/**
 * Generate Toph Beifong's Seismic Sense overlay
 */
export function generateTophSeismicSenseOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Phosphor green color palette
  const phosphorGreen = '120, 255, 180'; // RGB for the main glow
  const phosphorDim = '60, 180, 100'; // Dimmer version
  const phosphorBright = '150, 255, 200'; // Brighter highlights

  // === SEISMIC PING / RADIAL SWEEP ===
  // Footstep creates outward-expanding sonar ping every ~2 seconds
  const pingCycle = 2.0; // seconds per ping
  const pingPhase = (time % pingCycle) / pingCycle; // 0 to 1
  const pingRadius = pingPhase * 150; // expands from 0% to 150%
  const pingOpacity = (1 - pingPhase) * 0.4 * intensity; // fades as it expands

  // Secondary ping offset for continuous coverage
  const ping2Phase = ((time + 1.0) % pingCycle) / pingCycle;
  const ping2Radius = ping2Phase * 150;
  const ping2Opacity = (1 - ping2Phase) * 0.3 * intensity;

  // === HEARTBEAT PULSE ===
  // Living beings pulse at ~1.2 Hz (72 BPM)
  const heartbeatFreq = 1.2;
  const heartbeat = 0.5 + Math.sin(time * heartbeatFreq * 2 * Math.PI) * 0.3;
  const heartbeat2 = 0.5 + Math.sin(time * heartbeatFreq * 2 * Math.PI + 0.5) * 0.25;

  // === MOTION RIPPLES ===
  // Simulate detected footsteps/movement at various positions
  const ripple1Phase = (time * 0.8) % 1;
  const ripple2Phase = ((time * 0.8) + 0.33) % 1;

  // Ripple positions (simulating detected movement)
  const ripple1X = 30 + Math.sin(time * 0.3) * 15;
  const ripple1Y = 60 + Math.cos(time * 0.25) * 10;
  const ripple2X = 70 + Math.sin(time * 0.35 + 1) * 12;
  const ripple2Y = 40 + Math.cos(time * 0.28 + 0.5) * 8;

  // === TERRAIN TOPOLOGY GRID ===
  // Represents the "wireframe" view of the ground
  const gridOpacity = 0.15 * intensity;

  // === TEMPORAL FADE ===
  // Perception fades without fresh vibration input
  // Simulated by oscillating base visibility
  const temporalFade = 0.85 + Math.sin(time * 0.5) * 0.1;

  // === DETECTED FIGURES (living beings with heartbeat) ===
  // Positioned around the view as detected entities
  const figure1X = 25 + Math.sin(time * 0.15) * 8;
  const figure1Y = 45 + Math.cos(time * 0.12) * 6;
  const figure2X = 65 + Math.sin(time * 0.18 + 2) * 10;
  const figure2Y = 55 + Math.cos(time * 0.14 + 1) * 7;
  const figure3X = 50 + Math.sin(time * 0.1 + 4) * 5;
  const figure3Y = 70 + Math.cos(time * 0.13 + 3) * 4;

  // Central ping wave (main sonar sweep)
  const pingWave = `
    radial-gradient(circle at 50% 85%,
      transparent ${pingRadius - 5}%,
      rgba(${phosphorGreen}, ${pingOpacity}) ${pingRadius}%,
      rgba(${phosphorGreen}, ${pingOpacity * 0.5}) ${pingRadius + 2}%,
      transparent ${pingRadius + 5}%
    )
  `;

  // Secondary ping wave
  const pingWave2 = `
    radial-gradient(circle at 50% 85%,
      transparent ${ping2Radius - 5}%,
      rgba(${phosphorDim}, ${ping2Opacity}) ${ping2Radius}%,
      rgba(${phosphorDim}, ${ping2Opacity * 0.4}) ${ping2Radius + 2}%,
      transparent ${ping2Radius + 4}%
    )
  `;

  // Motion ripples from detected movement
  const motionRipple1 = `
    radial-gradient(circle at ${ripple1X}% ${ripple1Y}%,
      transparent ${ripple1Phase * 15 - 2}%,
      rgba(${phosphorGreen}, ${(1 - ripple1Phase) * 0.25 * intensity}) ${ripple1Phase * 15}%,
      transparent ${ripple1Phase * 15 + 3}%
    )
  `;

  const motionRipple2 = `
    radial-gradient(circle at ${ripple2X}% ${ripple2Y}%,
      transparent ${ripple2Phase * 12 - 2}%,
      rgba(${phosphorGreen}, ${(1 - ripple2Phase) * 0.2 * intensity}) ${ripple2Phase * 12}%,
      transparent ${ripple2Phase * 12 + 2}%
    )
  `;

  // Detected figures with heartbeat pulse
  const detectedFigure1 = `
    radial-gradient(ellipse 8% 12% at ${figure1X}% ${figure1Y}%,
      rgba(${phosphorBright}, ${heartbeat * 0.5 * intensity}) 0%,
      rgba(${phosphorGreen}, ${heartbeat * 0.3 * intensity}) 40%,
      rgba(${phosphorDim}, ${heartbeat * 0.15 * intensity}) 70%,
      transparent 100%
    )
  `;

  const detectedFigure2 = `
    radial-gradient(ellipse 7% 10% at ${figure2X}% ${figure2Y}%,
      rgba(${phosphorBright}, ${heartbeat2 * 0.45 * intensity}) 0%,
      rgba(${phosphorGreen}, ${heartbeat2 * 0.25 * intensity}) 45%,
      rgba(${phosphorDim}, ${heartbeat2 * 0.1 * intensity}) 75%,
      transparent 100%
    )
  `;

  const detectedFigure3 = `
    radial-gradient(ellipse 6% 9% at ${figure3X}% ${figure3Y}%,
      rgba(${phosphorBright}, ${heartbeat * 0.35 * intensity}) 0%,
      rgba(${phosphorGreen}, ${heartbeat * 0.2 * intensity}) 50%,
      transparent 100%
    )
  `;

  // Terrain contour lines (topographic effect)
  const terrainLines = `
    repeating-radial-gradient(circle at 50% 100%,
      transparent 0%,
      transparent 8%,
      rgba(${phosphorDim}, ${gridOpacity}) 8.5%,
      transparent 9%
    )
  `;

  // Horizon/ground plane glow
  const groundGlow = `
    linear-gradient(to top,
      rgba(${phosphorGreen}, ${0.25 * intensity * temporalFade}) 0%,
      rgba(${phosphorDim}, ${0.15 * intensity * temporalFade}) 15%,
      rgba(${phosphorDim}, ${0.08 * intensity * temporalFade}) 30%,
      transparent 60%
    )
  `;

  // Ambient "static" representing constant ground vibration awareness
  const ambientField = `
    radial-gradient(ellipse 200% 100% at 50% 100%,
      rgba(${phosphorDim}, ${0.12 * intensity * temporalFade}) 0%,
      rgba(${phosphorDim}, ${0.06 * intensity * temporalFade}) 40%,
      transparent 70%
    )
  `;

  // Dark base layer (near-black background)
  const darkBase = `
    linear-gradient(
      rgba(5, 15, 10, ${0.92 * intensity}) 0%,
      rgba(8, 20, 12, ${0.88 * intensity}) 100%
    )
  `;

  const background = `
    ${pingWave},
    ${pingWave2},
    ${motionRipple1},
    ${motionRipple2},
    ${detectedFigure1},
    ${detectedFigure2},
    ${detectedFigure3},
    ${terrainLines},
    ${groundGlow},
    ${ambientField},
    ${darkBase}
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
    zIndex: 9999
  };
}
