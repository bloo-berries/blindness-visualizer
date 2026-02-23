/**
 * Geordi La Forge's VISOR Sense overlay generator
 * Simulates the enhanced electromagnetic spectrum perception from the VISOR device
 * Features:
 * - False-color thermal/spectral palette (blue/violet → cyan → orange → white/magenta)
 * - Infrared thermal layer with heat signature gradients
 * - EM emission halos around electrical/energy sources
 * - Scan-line banding artifacts suggesting mechanical processing
 * - Chromatic fringing at high-contrast boundaries
 * - No true darkness (minimum brightness floor)
 * - Visor-shaped peripheral vignette
 * - Occasional overload flicker in bright environments
 */

/**
 * Generate Geordi's VISOR Sense overlay
 * Creates a multi-spectral electromagnetic vision effect
 */
export function generateGeordiVisorSenseOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Scan line animation
  const scanLineOffset = (time * 30) % 100;

  // Pulsing for EM halos
  const emPulse1 = 0.6 + Math.sin(time * 2.5) * 0.25;
  const emPulse2 = 0.65 + Math.sin(time * 3.0 + 1) * 0.2;
  const emPulse3 = 0.55 + Math.sin(time * 2.2 + 2) * 0.25;

  // Overload flicker - occasional bright flash
  const flickerCycle = Math.sin(time * 8) * Math.sin(time * 13) * Math.sin(time * 5);
  const isFlickering = flickerCycle > 0.85;
  const flickerIntensity = isFlickering ? 0.3 * intensity : 0;

  // Thermal gradient shift
  const thermalShift = Math.sin(time * 0.5) * 5;

  // Base spectral tint - deep violet/blue floor (no true darkness)
  const spectralFloor = `
    linear-gradient(
      180deg,
      rgba(60,20,120,${0.25 * intensity}) 0%,
      rgba(40,30,100,${0.22 * intensity}) 50%,
      rgba(50,25,110,${0.25 * intensity}) 100%
    )
  `;

  // Thermal gradient overlay - simulates heat distribution
  const thermalGradient = `
    radial-gradient(ellipse 120% 100% at 50% 40%,
      rgba(255,180,100,${0.12 * intensity * emPulse1}) 0%,
      rgba(255,120,60,${0.1 * intensity}) 20%,
      rgba(200,80,180,${0.08 * intensity}) 40%,
      rgba(100,60,200,${0.1 * intensity}) 60%,
      rgba(60,40,150,${0.15 * intensity}) 80%,
      rgba(40,20,100,${0.2 * intensity}) 100%
    )
  `;

  // EM emission halo 1 - top area (simulating overhead lights/energy)
  const emHalo1 = `
    radial-gradient(ellipse 80% 40% at 50% 10%,
      rgba(255,220,180,${0.35 * intensity * emPulse1}) 0%,
      rgba(255,160,80,${0.25 * intensity * emPulse1}) 30%,
      rgba(200,100,220,${0.15 * intensity * emPulse1}) 60%,
      transparent 100%
    )
  `;

  // EM emission halo 2 - center area (body heat simulation)
  const emHalo2 = `
    radial-gradient(ellipse 60% 70% at 50% 50%,
      rgba(255,200,150,${0.18 * intensity * emPulse2}) 0%,
      rgba(255,140,100,${0.12 * intensity * emPulse2}) 40%,
      rgba(180,80,160,${0.08 * intensity * emPulse2}) 70%,
      transparent 100%
    )
  `;

  // EM emission halo 3 - peripheral electronics simulation
  const emHalo3X = 15 + Math.sin(time * 0.3) * 5;
  const emHalo3 = `
    radial-gradient(ellipse 25% 30% at ${emHalo3X}% 60%,
      rgba(100,200,255,${0.25 * intensity * emPulse3}) 0%,
      rgba(80,150,255,${0.18 * intensity * emPulse3}) 50%,
      rgba(60,100,200,${0.1 * intensity * emPulse3}) 80%,
      transparent 100%
    )
  `;

  // EM emission halo 4 - right side electronics
  const emHalo4X = 85 + Math.sin(time * 0.35 + 1.5) * 5;
  const emHalo4 = `
    radial-gradient(ellipse 20% 35% at ${emHalo4X}% 45%,
      rgba(120,220,255,${0.22 * intensity * emPulse1}) 0%,
      rgba(90,170,255,${0.15 * intensity * emPulse1}) 50%,
      rgba(70,120,220,${0.08 * intensity * emPulse1}) 80%,
      transparent 100%
    )
  `;

  // Scan-line overlay - horizontal bands
  const scanLines = `
    repeating-linear-gradient(
      180deg,
      transparent 0px,
      transparent 3px,
      rgba(150,200,255,${0.08 * intensity}) 3px,
      rgba(150,200,255,${0.08 * intensity}) 4px,
      transparent 4px,
      transparent 7px
    )
  `;

  // Moving scan bar - suggests active scanning
  const scanBarPos = scanLineOffset;
  const scanBar = `
    linear-gradient(
      180deg,
      transparent 0%,
      transparent ${scanBarPos - 2}%,
      rgba(200,255,255,${0.12 * intensity}) ${scanBarPos - 1}%,
      rgba(255,255,255,${0.2 * intensity}) ${scanBarPos}%,
      rgba(200,255,255,${0.12 * intensity}) ${scanBarPos + 1}%,
      transparent ${scanBarPos + 2}%,
      transparent 100%
    )
  `;

  // Chromatic fringing effect - cyan/magenta split at edges
  const chromaticAngle1 = 45 + thermalShift;
  const chromaticAngle2 = -45 + thermalShift;
  const chromaticFringe1 = `
    linear-gradient(
      ${chromaticAngle1}deg,
      rgba(0,255,255,${0.06 * intensity}) 0%,
      transparent 3%,
      transparent 97%,
      rgba(255,0,255,${0.06 * intensity}) 100%
    )
  `;
  const chromaticFringe2 = `
    linear-gradient(
      ${chromaticAngle2}deg,
      rgba(255,0,255,${0.05 * intensity}) 0%,
      transparent 4%,
      transparent 96%,
      rgba(0,255,255,${0.05 * intensity}) 100%
    )
  `;

  // Edge enhancement suggestion - spectral boundary lines
  const edgeLines1 = `
    repeating-linear-gradient(
      ${88 + Math.sin(time * 0.2) * 3}deg,
      transparent 0px,
      transparent ${45 + Math.sin(time * 0.3) * 10}px,
      rgba(180,220,255,${0.1 * intensity * emPulse2}) ${47 + Math.sin(time * 0.3) * 10}px,
      transparent ${49 + Math.sin(time * 0.3) * 10}px
    )
  `;

  const edgeLines2 = `
    repeating-linear-gradient(
      ${178 + Math.sin(time * 0.25) * 4}deg,
      transparent 0px,
      transparent ${55 + Math.sin(time * 0.35 + 1) * 12}px,
      rgba(200,180,255,${0.08 * intensity * emPulse3}) ${57 + Math.sin(time * 0.35 + 1) * 12}px,
      transparent ${59 + Math.sin(time * 0.35 + 1) * 12}px
    )
  `;

  // VISOR-shaped vignette - rounded rectangular aperture
  const visorVignette = `
    radial-gradient(ellipse 95% 75% at 50% 50%,
      transparent 0%,
      transparent 55%,
      rgba(20,10,60,${0.4 * intensity}) 75%,
      rgba(10,5,40,${0.7 * intensity}) 88%,
      rgba(5,2,20,${0.9 * intensity}) 100%
    )
  `;

  // Top and bottom visor edge bars
  const visorTopEdge = `
    linear-gradient(
      180deg,
      rgba(10,5,30,${0.85 * intensity}) 0%,
      rgba(20,10,50,${0.6 * intensity}) 8%,
      transparent 15%,
      transparent 100%
    )
  `;

  const visorBottomEdge = `
    linear-gradient(
      0deg,
      rgba(10,5,30,${0.85 * intensity}) 0%,
      rgba(20,10,50,${0.6 * intensity}) 8%,
      transparent 15%,
      transparent 100%
    )
  `;

  // Overload flash layer
  const overloadFlash = `
    radial-gradient(ellipse 100% 100% at 50% 50%,
      rgba(255,255,255,${flickerIntensity}) 0%,
      rgba(255,220,255,${flickerIntensity * 0.7}) 40%,
      rgba(200,180,255,${flickerIntensity * 0.4}) 70%,
      transparent 100%
    )
  `;

  const background = `
    ${overloadFlash},
    ${scanBar},
    ${scanLines},
    ${chromaticFringe1},
    ${chromaticFringe2},
    ${edgeLines1},
    ${edgeLines2},
    ${emHalo1},
    ${emHalo2},
    ${emHalo3},
    ${emHalo4},
    ${visorTopEdge},
    ${visorBottomEdge},
    ${visorVignette},
    ${thermalGradient},
    ${spectralFloor}
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
    mixBlendMode: 'hard-light' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
