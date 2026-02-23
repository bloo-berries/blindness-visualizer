/**
 * Kenshi Takahashi's Telekinetic Sense overlay generator
 * Simulates psychokinetic perception - presence-based, not reflection-based
 * Features:
 * - Dark void base (black/deep indigo) - no ambient light
 * - Soul/life-force glow on living beings (cool blue-white/spectral cyan)
 * - Inert matter as faint mass outlines (deep blue/violet contours)
 * - Intent/threat layer (precognitive flashes in hot white/amber)
 * - 360° spatial awareness (no fixed FOV, omnidirectional)
 * - Spirit realm bleed-through (ghostly wisps drifting through scene)
 * - Sento sword resonance (amber/gold pulsing aura)
 * - Hard perceptual boundary at range limit (crisp, not gradual)
 * - No texture/detail rendering (pure energy topology)
 * - Telekinetic force streams (arcs/tendrils of light)
 */

/**
 * Generate Kenshi's Telekinetic Sense overlay
 * Creates a psychic energy field perception with soul detection and spirit realm visibility
 */
export function generateKenshiTelekineticSenseOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Soul/life-force pulsing - gentle heartbeat rhythm (~60-80 BPM)
  const heartbeatPhase = (time * 1.2) % 1; // ~72 BPM
  const heartbeatPulse = Math.pow(Math.sin(heartbeatPhase * Math.PI), 2);
  const soulPulse = 0.7 + heartbeatPulse * 0.3;

  // Secondary soul rhythm for layering
  const soulPulse2 = 0.75 + Math.sin(time * 2.5 + 0.5) * 0.25;
  const soulPulse3 = 0.8 + Math.sin(time * 1.8 + 1.2) * 0.2;

  // Intent/threat flare timing - more frequent precognitive flashes
  const threatCycle1 = Math.sin(time * 3.5) * Math.sin(time * 5.2);
  const threatCycle2 = Math.sin(time * 4.8 + 1.5) * Math.sin(time * 2.8);
  const isThreatFlashing1 = threatCycle1 > 0.5;
  const isThreatFlashing2 = threatCycle2 > 0.6;
  const threatIntensity1 = isThreatFlashing1 ? 0.9 * intensity : 0;
  const threatIntensity2 = isThreatFlashing2 ? 0.7 * intensity : 0;

  // Spirit realm wisps - slow drifting motion
  const spiritDrift1X = 20 + Math.sin(time * 0.15) * 25;
  const spiritDrift1Y = 30 + Math.sin(time * 0.12 + 0.5) * 20;
  const spiritDrift2X = 70 + Math.sin(time * 0.18 + 2) * 20;
  const spiritDrift2Y = 55 + Math.sin(time * 0.14 + 1.2) * 25;
  const spiritDrift3X = 45 + Math.sin(time * 0.2 + 1) * 30;
  const spiritDrift3Y = 70 + Math.sin(time * 0.16 + 0.8) * 15;
  const spiritDrift4X = 85 + Math.sin(time * 0.13 + 0.3) * 12;
  const spiritDrift4Y = 25 + Math.sin(time * 0.17 + 1.8) * 18;
  const spiritOpacity1 = 0.35 + Math.sin(time * 0.5) * 0.15;
  const spiritOpacity2 = 0.3 + Math.sin(time * 0.4 + 1) * 0.12;
  const spiritOpacity3 = 0.32 + Math.sin(time * 0.55 + 2) * 0.13;
  const spiritOpacity4 = 0.28 + Math.sin(time * 0.45 + 0.7) * 0.1;

  // Sento sword resonance - warm amber/gold pulse from center-bottom
  const sentoResonance = 0.7 + Math.sin(time * 1.5) * 0.3;
  const sentoGlow = 0.6 + Math.sin(time * 2) * 0.25;

  // Telekinetic force stream angles - energy tendrils extending outward
  const tkStreamAngle1 = (time * 20) % 360;
  const tkStreamAngle2 = ((time * 20) + 120) % 360;
  const tkStreamAngle3 = ((time * 20) + 240) % 360;
  const tkStreamPulse = 0.6 + Math.sin(time * 3) * 0.35;

  // Range boundary pulse - subtle breathing at the perception edge
  const rangePulse = 0.9 + Math.sin(time * 0.8) * 0.08;

  // === LAYER 0: Semi-Opaque Dark Filter (Base) ===
  // This creates the fundamental darkness that all other effects sit on top of
  const darkFilter = `
    linear-gradient(
      180deg,
      rgba(5,5,25,0.92) 0%,
      rgba(3,3,18,0.94) 50%,
      rgba(2,2,12,0.92) 100%
    )
  `;

  // === LAYER -1: Additional Heavy Dark Overlay ===
  // Extra darkness to ensure the void effect is prominent
  const heavyDarkOverlay = `
    linear-gradient(
      180deg,
      rgba(0,0,15,0.88) 0%,
      rgba(0,0,10,0.90) 50%,
      rgba(0,0,8,0.88) 100%
    )
  `;

  // === LAYER 1: Dark Void with Indigo Tint ===
  // Black/deep indigo - the world is dark by default, no ambient light
  const darkVoid = `
    radial-gradient(ellipse 100% 100% at 50% 50%,
      rgba(15,15,45,${0.75 * intensity}) 0%,
      rgba(8,8,30,${0.8 * intensity}) 40%,
      rgba(5,5,20,${0.85 * intensity}) 70%,
      rgba(2,2,10,${0.9 * intensity}) 100%
    )
  `;

  // === LAYER 2: Soul/Life-Force Glow (Center - Living Being Detection) ===
  // Cool blue-white/spectral cyan glow with heartbeat pulsing - MUCH MORE PROMINENT
  const soulGlowCenter = `
    radial-gradient(ellipse 55% 70% at 50% 45%,
      rgba(180,220,255,${0.65 * intensity * soulPulse}) 0%,
      rgba(140,210,255,${0.55 * intensity * soulPulse}) 15%,
      rgba(100,190,250,${0.45 * intensity * soulPulse}) 30%,
      rgba(60,160,230,${0.35 * intensity * soulPulse}) 50%,
      rgba(30,120,200,${0.2 * intensity}) 70%,
      transparent 100%
    )
  `;

  // Secondary soul glow - off-center being detection - LARGER AND BRIGHTER
  const soulGlow2 = `
    radial-gradient(ellipse 35% 45% at 22% 50%,
      rgba(160,210,255,${0.5 * intensity * soulPulse2}) 0%,
      rgba(120,190,250,${0.4 * intensity * soulPulse2}) 30%,
      rgba(80,160,230,${0.25 * intensity * soulPulse2}) 60%,
      transparent 100%
    )
  `;

  const soulGlow3 = `
    radial-gradient(ellipse 30% 40% at 78% 38%,
      rgba(150,200,250,${0.45 * intensity * soulPulse3}) 0%,
      rgba(110,180,240,${0.35 * intensity * soulPulse3}) 35%,
      rgba(70,150,220,${0.2 * intensity * soulPulse3}) 65%,
      transparent 100%
    )
  `;

  // Additional soul glow for more coverage
  const soulGlow4 = `
    radial-gradient(ellipse 25% 35% at 35% 70%,
      rgba(140,200,250,${0.4 * intensity * soulPulse}) 0%,
      rgba(100,170,235,${0.28 * intensity * soulPulse}) 45%,
      transparent 100%
    )
  `;

  const soulGlow5 = `
    radial-gradient(ellipse 22% 30% at 68% 65%,
      rgba(130,195,245,${0.38 * intensity * soulPulse2}) 0%,
      rgba(90,165,225,${0.25 * intensity * soulPulse2}) 50%,
      transparent 100%
    )
  `;

  // === LAYER 3: Inert Matter Outlines - MORE VISIBLE ===
  // Faint contour lines in deep blue/violet - present but understated
  const inertMatter1 = `
    linear-gradient(
      ${85 + Math.sin(time * 0.1) * 2}deg,
      transparent 0%,
      transparent 12%,
      rgba(60,50,140,${0.35 * intensity}) 13%,
      rgba(80,70,160,${0.4 * intensity}) 14%,
      rgba(60,50,140,${0.35 * intensity}) 15%,
      transparent 16%,
      transparent 38%,
      rgba(70,60,150,${0.38 * intensity}) 39%,
      rgba(90,80,170,${0.42 * intensity}) 40%,
      rgba(70,60,150,${0.38 * intensity}) 41%,
      transparent 42%,
      transparent 63%,
      rgba(55,45,130,${0.32 * intensity}) 64%,
      rgba(75,65,155,${0.36 * intensity}) 65%,
      rgba(55,45,130,${0.32 * intensity}) 66%,
      transparent 67%,
      transparent 100%
    )
  `;

  const inertMatter2 = `
    linear-gradient(
      ${175 + Math.sin(time * 0.08 + 1) * 3}deg,
      transparent 0%,
      transparent 18%,
      rgba(65,55,145,${0.33 * intensity}) 19%,
      rgba(85,75,165,${0.38 * intensity}) 20%,
      rgba(65,55,145,${0.33 * intensity}) 21%,
      transparent 22%,
      transparent 48%,
      rgba(75,65,155,${0.36 * intensity}) 49%,
      rgba(95,85,175,${0.4 * intensity}) 50%,
      rgba(75,65,155,${0.36 * intensity}) 51%,
      transparent 52%,
      transparent 78%,
      rgba(50,40,120,${0.28 * intensity}) 79%,
      rgba(70,60,145,${0.32 * intensity}) 80%,
      rgba(50,40,120,${0.28 * intensity}) 81%,
      transparent 82%,
      transparent 100%
    )
  `;

  // === LAYER 4: Intent/Threat Flare - MUCH BRIGHTER ===
  // Precognitive flash in hot white/amber when enemy prepares to attack
  const threatFlare1 = `
    radial-gradient(ellipse 35% 45% at 72% 32%,
      rgba(255,255,255,${threatIntensity1}) 0%,
      rgba(255,220,150,${threatIntensity1 * 0.85}) 20%,
      rgba(255,180,80,${threatIntensity1 * 0.65}) 40%,
      rgba(255,140,40,${threatIntensity1 * 0.4}) 60%,
      rgba(200,100,20,${threatIntensity1 * 0.2}) 80%,
      transparent 100%
    )
  `;

  const threatFlare2 = `
    radial-gradient(ellipse 30% 35% at 28% 58%,
      rgba(255,250,220,${threatIntensity2}) 0%,
      rgba(255,200,120,${threatIntensity2 * 0.8}) 25%,
      rgba(255,160,60,${threatIntensity2 * 0.55}) 50%,
      rgba(230,120,30,${threatIntensity2 * 0.3}) 75%,
      transparent 100%
    )
  `;

  // === LAYER 5: Spirit Realm Bleed-Through - MUCH MORE VISIBLE ===
  // Ghostly wisps drifting through the scene - ancestral spirits, soul echoes
  const spiritWisp1 = `
    radial-gradient(ellipse 20% 32% at ${spiritDrift1X}% ${spiritDrift1Y}%,
      rgba(220,235,255,${spiritOpacity1 * intensity}) 0%,
      rgba(180,205,250,${spiritOpacity1 * 0.7 * intensity}) 30%,
      rgba(140,175,235,${spiritOpacity1 * 0.4 * intensity}) 60%,
      transparent 100%
    )
  `;

  const spiritWisp2 = `
    radial-gradient(ellipse 18% 28% at ${spiritDrift2X}% ${spiritDrift2Y}%,
      rgba(210,225,255,${spiritOpacity2 * intensity}) 0%,
      rgba(170,195,245,${spiritOpacity2 * 0.65 * intensity}) 35%,
      rgba(130,165,225,${spiritOpacity2 * 0.35 * intensity}) 65%,
      transparent 100%
    )
  `;

  const spiritWisp3 = `
    radial-gradient(ellipse 22% 18% at ${spiritDrift3X}% ${spiritDrift3Y}%,
      rgba(215,230,255,${spiritOpacity3 * intensity}) 0%,
      rgba(175,200,245,${spiritOpacity3 * 0.6 * intensity}) 40%,
      transparent 100%
    )
  `;

  const spiritWisp4 = `
    radial-gradient(ellipse 15% 22% at ${spiritDrift4X}% ${spiritDrift4Y}%,
      rgba(200,220,250,${spiritOpacity4 * intensity}) 0%,
      rgba(160,190,240,${spiritOpacity4 * 0.55 * intensity}) 45%,
      transparent 100%
    )
  `;

  // === LAYER 6: Sento Sword Resonance - MUCH BRIGHTER ===
  // Warm amber/gold pulsing aura from the blade - the one warm-toned element
  const sentoAura = `
    radial-gradient(ellipse 45% 55% at 50% 82%,
      rgba(255,200,100,${0.55 * intensity * sentoGlow}) 0%,
      rgba(255,170,70,${0.45 * intensity * sentoGlow}) 20%,
      rgba(255,140,50,${0.35 * intensity * sentoResonance}) 40%,
      rgba(230,110,30,${0.25 * intensity * sentoResonance}) 60%,
      rgba(180,80,15,${0.12 * intensity * sentoResonance}) 80%,
      transparent 100%
    )
  `;

  // Sento blade glow extending outward
  const sentoBladeGlow = `
    linear-gradient(
      0deg,
      rgba(255,210,130,${0.35 * intensity * sentoGlow}) 0%,
      rgba(255,180,90,${0.28 * intensity * sentoGlow}) 10%,
      rgba(255,150,60,${0.2 * intensity * sentoGlow}) 20%,
      rgba(220,120,40,${0.1 * intensity}) 35%,
      transparent 50%,
      transparent 100%
    )
  `;

  // === LAYER 7: Telekinetic Force Streams - MORE VISIBLE ===
  // Arcs/tendrils of light connecting mind to environment
  const tkStream1 = `
    conic-gradient(
      from ${tkStreamAngle1}deg at 50% 50%,
      transparent 0deg,
      rgba(140,200,255,${0.45 * intensity * tkStreamPulse}) 1deg,
      rgba(100,170,250,${0.35 * intensity * tkStreamPulse}) 3deg,
      rgba(70,140,230,${0.2 * intensity * tkStreamPulse}) 6deg,
      transparent 10deg,
      transparent 360deg
    )
  `;

  const tkStream2 = `
    conic-gradient(
      from ${tkStreamAngle2}deg at 50% 50%,
      transparent 0deg,
      rgba(130,190,255,${0.4 * intensity * tkStreamPulse}) 1.5deg,
      rgba(90,160,245,${0.3 * intensity * tkStreamPulse}) 4deg,
      rgba(60,130,220,${0.15 * intensity * tkStreamPulse}) 7deg,
      transparent 12deg,
      transparent 360deg
    )
  `;

  const tkStream3 = `
    conic-gradient(
      from ${tkStreamAngle3}deg at 50% 50%,
      transparent 0deg,
      rgba(120,180,250,${0.35 * intensity * tkStreamPulse}) 1deg,
      rgba(80,150,235,${0.25 * intensity * tkStreamPulse}) 3.5deg,
      rgba(50,120,210,${0.12 * intensity * tkStreamPulse}) 6deg,
      transparent 9deg,
      transparent 360deg
    )
  `;

  // === LAYER 8: Range Falloff ===
  // Hard perceptual boundary at psychic range limit - crisp edge, not gradual fade
  const rangeBoundary = `
    radial-gradient(ellipse 95% 95% at 50% 50%,
      transparent 0%,
      transparent ${72 * rangePulse}%,
      rgba(5,5,20,${0.3 * intensity}) ${76 * rangePulse}%,
      rgba(3,3,15,${0.6 * intensity}) ${80 * rangePulse}%,
      rgba(2,2,10,${0.85 * intensity}) ${84 * rangePulse}%,
      rgba(0,0,5,${0.95 * intensity}) ${87 * rangePulse}%,
      rgba(0,0,0,${1.0 * intensity}) 90%
    )
  `;

  // === LAYER 9: Energy Field Shimmer - MORE PROMINENT ===
  // Overall shimmer suggesting the psychic field
  const energyShimmer = `
    radial-gradient(ellipse 100% 100% at 50% 50%,
      rgba(120,170,240,${0.12 * intensity * soulPulse}) 0%,
      rgba(100,150,225,${0.08 * intensity}) 40%,
      rgba(80,130,210,${0.05 * intensity}) 70%,
      transparent 100%
    )
  `;

  // === LAYER 10: Soul Energy Lines (Edge Detection) - MORE VISIBLE ===
  // Lines suggesting the boundaries between living and dead matter
  const soulEdge1 = `
    repeating-linear-gradient(
      ${90 + Math.sin(time * 0.15) * 5}deg,
      transparent 0px,
      transparent ${30 + Math.sin(time * 0.2) * 6}px,
      rgba(140,200,255,${0.2 * intensity * soulPulse}) ${32 + Math.sin(time * 0.2) * 6}px,
      rgba(160,215,255,${0.25 * intensity * soulPulse}) ${33 + Math.sin(time * 0.2) * 6}px,
      rgba(140,200,255,${0.2 * intensity * soulPulse}) ${34 + Math.sin(time * 0.2) * 6}px,
      transparent ${36 + Math.sin(time * 0.2) * 6}px
    )
  `;

  const soulEdge2 = `
    repeating-linear-gradient(
      ${180 + Math.sin(time * 0.12 + 0.5) * 4}deg,
      transparent 0px,
      transparent ${40 + Math.sin(time * 0.18 + 1) * 8}px,
      rgba(120,180,250,${0.18 * intensity * soulPulse2}) ${42 + Math.sin(time * 0.18 + 1) * 8}px,
      rgba(140,195,255,${0.22 * intensity * soulPulse2}) ${43 + Math.sin(time * 0.18 + 1) * 8}px,
      rgba(120,180,250,${0.18 * intensity * soulPulse2}) ${44 + Math.sin(time * 0.18 + 1) * 8}px,
      transparent ${46 + Math.sin(time * 0.18 + 1) * 8}px
    )
  `;

  const background = `
    ${threatFlare1},
    ${threatFlare2},
    ${tkStream1},
    ${tkStream2},
    ${tkStream3},
    ${spiritWisp1},
    ${spiritWisp2},
    ${spiritWisp3},
    ${spiritWisp4},
    ${soulEdge1},
    ${soulEdge2},
    ${sentoAura},
    ${sentoBladeGlow},
    ${soulGlowCenter},
    ${soulGlow2},
    ${soulGlow3},
    ${soulGlow4},
    ${soulGlow5},
    ${energyShimmer},
    ${inertMatter1},
    ${inertMatter2},
    ${rangeBoundary},
    ${darkVoid},
    ${darkFilter},
    ${heavyDarkOverlay}
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
