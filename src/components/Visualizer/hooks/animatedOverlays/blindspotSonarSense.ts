/**
 * Blindspot's Sonar Sense overlay generator
 * Simulates Samuel Baines' echolocation-based perception using sonar technology
 * Features:
 * - Monochrome blue-green palette (submarine sonar aesthetic)
 * - Depth-mapped brightness (near = bright, far = dim)
 * - Edge-dominant rendering with flat shading
 * - Radial ping sweep like a radar display
 * - Ripple/wavefront artifacts from active pinging
 * - Hard perceptual boundary beyond sonar range
 * - Sound-shadow occlusion zones
 * - Pulse/refresh strobe quality
 */

/**
 * Generate Blindspot's Sonar Sense overlay
 * Creates an echolocation/sonar visualization with ping sweeps and depth mapping
 */
export function generateBlindspotSonarSenseOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Ping cycle - sonar refreshes at ~2-4 Hz
  const pingCycle = (time * 3) % 1; // 3 Hz refresh rate
  const pingPhase = Math.sin(pingCycle * Math.PI * 2);

  // Radial sweep angle (rotating ping line)
  const sweepAngle = (time * 120) % 360; // Full rotation every 3 seconds

  // Ripple expansion - concentric rings emanating outward
  const ripple1Phase = (time * 2) % 1;
  const ripple2Phase = ((time * 2) + 0.33) % 1;
  const ripple3Phase = ((time * 2) + 0.66) % 1;

  // Pulse intensity for the strobe effect
  const pulseIntensity = 0.85 + pingPhase * 0.15;

  // Edge glow pulse
  const edgePulse = 0.7 + Math.sin(time * 4) * 0.2;

  // Base sonar color - cool blue-green monochrome
  // Deep blue-green void as the base (no data = darkness)
  const sonarVoid = `
    radial-gradient(ellipse 100% 100% at 50% 50%,
      rgba(5,25,35,${0.7 * intensity}) 0%,
      rgba(3,18,28,${0.8 * intensity}) 50%,
      rgba(2,12,20,${0.9 * intensity}) 100%
    )
  `;

  // Depth-mapped brightness gradient - center (near) is brighter
  const depthGradient = `
    radial-gradient(ellipse 70% 70% at 50% 50%,
      rgba(120,220,255,${0.25 * intensity * pulseIntensity}) 0%,
      rgba(80,180,220,${0.2 * intensity * pulseIntensity}) 25%,
      rgba(40,120,160,${0.15 * intensity * pulseIntensity}) 50%,
      rgba(20,60,90,${0.1 * intensity}) 75%,
      transparent 100%
    )
  `;

  // Radial ping sweep line - the classic radar sweep
  const pingSweep = `
    conic-gradient(
      from ${sweepAngle}deg at 50% 50%,
      rgba(100,220,255,${0.4 * intensity * pulseIntensity}) 0deg,
      rgba(80,200,240,${0.25 * intensity * pulseIntensity}) 15deg,
      rgba(60,160,200,${0.1 * intensity}) 30deg,
      transparent 45deg,
      transparent 360deg
    )
  `;

  // Trailing sweep echo (fainter, behind main sweep)
  const sweepEcho = `
    conic-gradient(
      from ${(sweepAngle - 60 + 360) % 360}deg at 50% 50%,
      rgba(60,150,180,${0.15 * intensity}) 0deg,
      rgba(40,100,140,${0.08 * intensity}) 20deg,
      transparent 40deg,
      transparent 360deg
    )
  `;

  // Ripple wavefronts - concentric rings expanding outward
  const rippleSize1 = 10 + ripple1Phase * 90;
  const rippleOpacity1 = (1 - ripple1Phase) * 0.3;
  const ripple1 = `
    radial-gradient(ellipse ${rippleSize1}% ${rippleSize1}% at 50% 50%,
      transparent 0%,
      transparent ${Math.max(0, rippleSize1 - 3)}%,
      rgba(100,200,240,${rippleOpacity1 * intensity}) ${rippleSize1 - 1}%,
      rgba(80,180,220,${rippleOpacity1 * intensity * 0.8}) ${rippleSize1}%,
      rgba(60,150,190,${rippleOpacity1 * intensity * 0.5}) ${rippleSize1 + 1}%,
      transparent ${rippleSize1 + 3}%,
      transparent 100%
    )
  `;

  const rippleSize2 = 10 + ripple2Phase * 90;
  const rippleOpacity2 = (1 - ripple2Phase) * 0.25;
  const ripple2 = `
    radial-gradient(ellipse ${rippleSize2}% ${rippleSize2}% at 50% 50%,
      transparent 0%,
      transparent ${Math.max(0, rippleSize2 - 2)}%,
      rgba(90,190,230,${rippleOpacity2 * intensity}) ${rippleSize2}%,
      rgba(70,160,200,${rippleOpacity2 * intensity * 0.6}) ${rippleSize2 + 1}%,
      transparent ${rippleSize2 + 2}%,
      transparent 100%
    )
  `;

  const rippleSize3 = 10 + ripple3Phase * 90;
  const rippleOpacity3 = (1 - ripple3Phase) * 0.2;
  const ripple3 = `
    radial-gradient(ellipse ${rippleSize3}% ${rippleSize3}% at 50% 50%,
      transparent 0%,
      transparent ${Math.max(0, rippleSize3 - 2)}%,
      rgba(80,170,210,${rippleOpacity3 * intensity}) ${rippleSize3}%,
      transparent ${rippleSize3 + 2}%,
      transparent 100%
    )
  `;

  // Edge detection lines - simulating sonar picking up hard surfaces
  const edgeAngle1 = 88 + Math.sin(time * 0.3) * 3;
  const edgeAngle2 = 178 + Math.sin(time * 0.25 + 1) * 3;

  const edgeLine1Pos = 20 + Math.sin(time * 0.4) * 5;
  const edgeLine2Pos = 45 + Math.sin(time * 0.35 + 1) * 6;
  const edgeLine3Pos = 70 + Math.sin(time * 0.38 + 2) * 5;

  const edgeLines1 = `
    linear-gradient(
      ${edgeAngle1}deg,
      transparent 0%,
      transparent ${edgeLine1Pos - 0.4}%,
      rgba(100,200,240,${0.35 * intensity * edgePulse}) ${edgeLine1Pos}%,
      transparent ${edgeLine1Pos + 0.4}%,
      transparent ${edgeLine2Pos - 0.3}%,
      rgba(80,180,220,${0.3 * intensity * edgePulse}) ${edgeLine2Pos}%,
      transparent ${edgeLine2Pos + 0.3}%,
      transparent ${edgeLine3Pos - 0.3}%,
      rgba(70,160,200,${0.25 * intensity * edgePulse}) ${edgeLine3Pos}%,
      transparent ${edgeLine3Pos + 0.3}%,
      transparent 100%
    )
  `;

  const hEdgeLine1Pos = 25 + Math.sin(time * 0.32) * 4;
  const hEdgeLine2Pos = 55 + Math.sin(time * 0.28 + 1.5) * 5;
  const hEdgeLine3Pos = 80 + Math.sin(time * 0.3 + 2.5) * 4;

  const edgeLines2 = `
    linear-gradient(
      ${edgeAngle2}deg,
      transparent 0%,
      transparent ${hEdgeLine1Pos - 0.3}%,
      rgba(90,190,230,${0.3 * intensity * edgePulse}) ${hEdgeLine1Pos}%,
      transparent ${hEdgeLine1Pos + 0.3}%,
      transparent ${hEdgeLine2Pos - 0.3}%,
      rgba(75,170,210,${0.25 * intensity * edgePulse}) ${hEdgeLine2Pos}%,
      transparent ${hEdgeLine2Pos + 0.3}%,
      transparent ${hEdgeLine3Pos - 0.25}%,
      rgba(65,150,190,${0.2 * intensity * edgePulse}) ${hEdgeLine3Pos}%,
      transparent ${hEdgeLine3Pos + 0.25}%,
      transparent 100%
    )
  `;

  // Sound-shadow occlusion zones - dark areas suggesting blocked sonar
  const shadowAngle1 = 35 + Math.sin(time * 0.15) * 8;
  const shadowAngle2 = -50 + Math.sin(time * 0.18 + 1) * 6;

  const soundShadow1 = `
    linear-gradient(
      ${shadowAngle1}deg,
      transparent 0%,
      transparent 60%,
      rgba(2,15,25,${0.4 * intensity}) 75%,
      rgba(1,10,18,${0.5 * intensity}) 85%,
      rgba(0,5,12,${0.55 * intensity}) 100%
    )
  `;

  const soundShadow2 = `
    linear-gradient(
      ${shadowAngle2}deg,
      transparent 0%,
      transparent 65%,
      rgba(2,12,22,${0.35 * intensity}) 80%,
      rgba(1,8,15,${0.45 * intensity}) 90%,
      rgba(0,5,10,${0.5 * intensity}) 100%
    )
  `;

  // Hard perceptual boundary - vignette representing sonar range limit
  const rangeBoundary = `
    radial-gradient(ellipse 85% 85% at 50% 50%,
      transparent 0%,
      transparent 50%,
      rgba(3,20,30,${0.3 * intensity}) 65%,
      rgba(2,15,25,${0.5 * intensity}) 78%,
      rgba(1,10,18,${0.75 * intensity}) 88%,
      rgba(0,5,12,${0.95 * intensity}) 100%
    )
  `;

  // Grid overlay - subtle reference grid like sonar displays
  const gridSpacing = 8;
  const gridOpacity = 0.08 * intensity * (0.8 + pingPhase * 0.2);
  const sonarGrid = `
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent ${gridSpacing - 1}px,
      rgba(80,180,220,${gridOpacity}) ${gridSpacing - 1}px,
      rgba(80,180,220,${gridOpacity}) ${gridSpacing}px
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent ${gridSpacing - 1}px,
      rgba(80,180,220,${gridOpacity}) ${gridSpacing - 1}px,
      rgba(80,180,220,${gridOpacity}) ${gridSpacing}px
    )
  `;

  // Center ping point - the emitter source
  const pingPoint = `
    radial-gradient(ellipse 3% 3% at 50% 50%,
      rgba(150,240,255,${0.6 * intensity * pulseIntensity}) 0%,
      rgba(120,220,250,${0.4 * intensity * pulseIntensity}) 40%,
      rgba(80,180,220,${0.2 * intensity}) 70%,
      transparent 100%
    )
  `;

  const background = `
    ${pingPoint},
    ${ripple1},
    ${ripple2},
    ${ripple3},
    ${pingSweep},
    ${sweepEcho},
    ${edgeLines1},
    ${edgeLines2},
    ${sonarGrid},
    ${soundShadow1},
    ${soundShadow2},
    ${depthGradient},
    ${rangeBoundary},
    ${sonarVoid}
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
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
