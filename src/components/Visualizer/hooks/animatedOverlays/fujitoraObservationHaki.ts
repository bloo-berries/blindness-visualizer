/**
 * Fujitora's Observation Haki overlay generator
 *
 * Marine Admiral who blinded himself. Perceives the world through
 * Observation Haki — life-force auras in a dark void — combined with
 * his Gravity-Gravity Fruit power (Zushi Zushi no Mi).
 *
 * Visual Concept:
 * - Deep indigo void with subtle purple nebula texture
 * - Vivid purple/violet aura silhouettes pulsing with life-force
 * - Concentric Haki ripple waves expanding outward like sonar
 * - Gravity distortion lines pulling inward toward center
 * - Amber/gold flares for strong fighters (intent detection)
 * - Central gravity well with swirling energy
 * - Haki "surge" flash when sensing killing intent
 */

import { createOverlayStyle } from './createOverlayStyle';

/**
 * Generate Fujitora's Observation Haki overlay
 */
export function generateFujitoraObservationHakiOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // === HAKI RIPPLE WAVES (sonar-like expanding rings) ===
  const rippleCycle = 2.5; // seconds per full expansion
  const ripplePhase1 = (time % rippleCycle) / rippleCycle;
  const ripplePhase2 = ((time + rippleCycle * 0.33) % rippleCycle) / rippleCycle;
  const ripplePhase3 = ((time + rippleCycle * 0.66) % rippleCycle) / rippleCycle;

  const rippleRadius1 = 5 + ripplePhase1 * 120;
  const rippleRadius2 = 5 + ripplePhase2 * 120;
  const rippleRadius3 = 5 + ripplePhase3 * 120;

  const rippleOpacity1 = (1 - ripplePhase1) * 0.40 * intensity;
  const rippleOpacity2 = (1 - ripplePhase2) * 0.35 * intensity;
  const rippleOpacity3 = (1 - ripplePhase3) * 0.30 * intensity;

  // === AURA SILHOUETTES (life-force of living beings) ===
  // 5 detected presences drifting slowly
  const aura1X = 30 + Math.sin(time * 0.10) * 12;
  const aura1Y = 40 + Math.cos(time * 0.08) * 10;
  const aura2X = 68 + Math.sin(time * 0.09 + 2.0) * 10;
  const aura2Y = 52 + Math.cos(time * 0.11 + 1.5) * 8;
  const aura3X = 50 + Math.sin(time * 0.07 + 4.0) * 15;
  const aura3Y = 28 + Math.cos(time * 0.09 + 3.0) * 6;
  const aura4X = 20 + Math.sin(time * 0.06 + 1.0) * 8;
  const aura4Y = 65 + Math.cos(time * 0.08 + 5.0) * 7;
  const aura5X = 78 + Math.sin(time * 0.08 + 3.5) * 7;
  const aura5Y = 35 + Math.cos(time * 0.07 + 2.5) * 9;

  // Heartbeat pulsing — sharp spike then decay (like a real heartbeat)
  // Uses a double-peak pattern: lub-DUB with exponential decay
  const heartbeat = (t: number, offset: number): number => {
    const phase = ((t * 1.2) + offset) % 1; // ~72 BPM
    // First peak (lub) at phase 0.0
    const lub = Math.exp(-phase * 12) * 0.6;
    // Second peak (dub) at phase 0.15
    const dubPhase = Math.max(0, phase - 0.15);
    const dub = Math.exp(-dubPhase * 10) * 1.0;
    return 0.25 + Math.max(lub, dub) * 0.75; // range: 0.25 to 1.0
  };
  const auraPulse1 = heartbeat(time, 0);
  const auraPulse2 = heartbeat(time, 0.2);
  const auraPulse3 = heartbeat(time, 0.45);
  const auraPulse4 = heartbeat(time, 0.6);
  const auraPulse5 = heartbeat(time, 0.8);

  // === INTENT / EMOTION DETECTION ===
  // Strong fighters glow amber-gold; the shift cycles between calm purple and fierce amber
  const intentCycle = Math.sin(time * 0.18) * 0.5 + 0.5; // 0-1 slow cycle
  // Primary strong fighter (aura3) shifts toward amber
  const amberR = Math.round(140 + intentCycle * 60); // 140-200
  const amberG = Math.round(80 + intentCycle * 70);  // 80-150
  const amberB = Math.round(220 - intentCycle * 170); // 220-50

  // === HAKI SURGE (sudden sensing of killing intent) ===
  // Brief bright purple flash every ~6 seconds
  const surgeCycle = time % 6;
  const surgeFlash = surgeCycle < 0.2
    ? Math.pow(1 - surgeCycle / 0.2, 2) * 0.45
    : 0;

  // === GRAVITY DISTORTION (Zushi Zushi no Mi) ===
  // Conic gradient "pull lines" spiraling toward center
  const gravityRotation = (time * 15) % 360; // slow spiral
  const gravityPulse = 0.6 + Math.sin(time * 0.4) * 0.2;

  // Central gravity well glow
  const wellPulse = 0.5 + Math.sin(time * 0.6) * 0.25;

  // === NEBULA TEXTURE (ambient void energy) ===
  const nebulaShift = time * 0.02;

  // --- LAYERS ---

  // Deep indigo void base
  const voidBase = `
    linear-gradient(
      160deg,
      rgba(8,2,25,${0.88 * intensity}) 0%,
      rgba(12,4,30,${0.85 * intensity}) 40%,
      rgba(6,1,20,${0.90 * intensity}) 100%
    )
  `;

  // Nebula clouds — subtle purple/blue swirls in the void
  const nebula1 = `
    radial-gradient(ellipse 60% 40% at ${35 + Math.sin(nebulaShift) * 10}% ${45 + Math.cos(nebulaShift * 0.8) * 8}%,
      rgba(60,20,120,${0.12 * intensity}) 0%,
      rgba(40,10,80,${0.06 * intensity}) 50%,
      transparent 100%
    )
  `;

  const nebula2 = `
    radial-gradient(ellipse 50% 55% at ${65 + Math.sin(nebulaShift + 2) * 12}% ${55 + Math.cos(nebulaShift * 0.6 + 1) * 10}%,
      rgba(50,15,100,${0.10 * intensity}) 0%,
      rgba(30,8,70,${0.05 * intensity}) 50%,
      transparent 100%
    )
  `;

  // Haki ripple rings — bright purple expanding circles
  const rippleRing1 = `
    radial-gradient(circle ${rippleRadius1}% at 50% 50%,
      transparent ${Math.max(0, rippleRadius1 - 4)}%,
      rgba(150,80,255,${rippleOpacity1 * 0.6}) ${rippleRadius1 - 2}%,
      rgba(180,100,255,${rippleOpacity1}) ${rippleRadius1}%,
      rgba(150,80,255,${rippleOpacity1 * 0.6}) ${rippleRadius1 + 2}%,
      transparent ${rippleRadius1 + 4}%
    )
  `;

  const rippleRing2 = `
    radial-gradient(circle ${rippleRadius2}% at 50% 50%,
      transparent ${Math.max(0, rippleRadius2 - 3)}%,
      rgba(130,60,230,${rippleOpacity2 * 0.5}) ${rippleRadius2 - 1.5}%,
      rgba(160,80,240,${rippleOpacity2}) ${rippleRadius2}%,
      rgba(130,60,230,${rippleOpacity2 * 0.5}) ${rippleRadius2 + 1.5}%,
      transparent ${rippleRadius2 + 3}%
    )
  `;

  const rippleRing3 = `
    radial-gradient(circle ${rippleRadius3}% at 50% 50%,
      transparent ${Math.max(0, rippleRadius3 - 3)}%,
      rgba(110,50,200,${rippleOpacity3 * 0.5}) ${rippleRadius3 - 1.5}%,
      rgba(140,70,220,${rippleOpacity3}) ${rippleRadius3}%,
      rgba(110,50,200,${rippleOpacity3 * 0.5}) ${rippleRadius3 + 1.5}%,
      transparent ${rippleRadius3 + 3}%
    )
  `;

  // Life-force aura silhouettes — vivid, saturated purple/violet glows
  const auraGlow1 = `
    radial-gradient(ellipse 20% 26% at ${aura1X}% ${aura1Y}%,
      rgba(200,140,255,${auraPulse1 * intensity * 0.75}) 0%,
      rgba(160,80,240,${auraPulse1 * intensity * 0.45}) 30%,
      rgba(120,50,200,${auraPulse1 * intensity * 0.20}) 60%,
      transparent 100%
    )
  `;

  const auraGlow2 = `
    radial-gradient(ellipse 17% 22% at ${aura2X}% ${aura2Y}%,
      rgba(190,120,255,${auraPulse2 * intensity * 0.70}) 0%,
      rgba(150,70,235,${auraPulse2 * intensity * 0.40}) 35%,
      rgba(110,40,190,${auraPulse2 * intensity * 0.16}) 65%,
      transparent 100%
    )
  `;

  // Strong fighter — shifts purple → amber with intent
  const auraGlow3 = `
    radial-gradient(ellipse 22% 28% at ${aura3X}% ${aura3Y}%,
      rgba(${amberR},${amberG},${amberB},${auraPulse3 * intensity * 0.80}) 0%,
      rgba(${Math.round(amberR * 0.7)},${Math.round(amberG * 0.6)},${Math.round(amberB * 0.8)},${auraPulse3 * intensity * 0.45}) 30%,
      rgba(${Math.round(amberR * 0.5)},${Math.round(amberG * 0.4)},${Math.round(amberB * 0.6)},${auraPulse3 * intensity * 0.18}) 60%,
      transparent 100%
    )
  `;

  // Smaller background presences — still visible
  const auraGlow4 = `
    radial-gradient(ellipse 14% 18% at ${aura4X}% ${aura4Y}%,
      rgba(180,110,250,${auraPulse4 * intensity * 0.55}) 0%,
      rgba(140,65,215,${auraPulse4 * intensity * 0.30}) 40%,
      rgba(100,40,170,${auraPulse4 * intensity * 0.12}) 70%,
      transparent 100%
    )
  `;

  const auraGlow5 = `
    radial-gradient(ellipse 12% 16% at ${aura5X}% ${aura5Y}%,
      rgba(175,100,245,${auraPulse5 * intensity * 0.50}) 0%,
      rgba(135,60,210,${auraPulse5 * intensity * 0.25}) 45%,
      transparent 100%
    )
  `;

  // Gravity distortion lines — conic gradient spiraling inward
  const gravityLines = `
    conic-gradient(
      from ${gravityRotation}deg at 50% 50%,
      rgba(100,60,200,${0.08 * gravityPulse * intensity}) 0deg,
      transparent 15deg,
      transparent 30deg,
      rgba(80,40,180,${0.06 * gravityPulse * intensity}) 45deg,
      transparent 60deg,
      transparent 75deg,
      rgba(100,60,200,${0.08 * gravityPulse * intensity}) 90deg,
      transparent 105deg,
      transparent 120deg,
      rgba(80,40,180,${0.06 * gravityPulse * intensity}) 135deg,
      transparent 150deg,
      transparent 165deg,
      rgba(100,60,200,${0.08 * gravityPulse * intensity}) 180deg,
      transparent 195deg,
      transparent 210deg,
      rgba(80,40,180,${0.06 * gravityPulse * intensity}) 225deg,
      transparent 240deg,
      transparent 255deg,
      rgba(100,60,200,${0.08 * gravityPulse * intensity}) 270deg,
      transparent 285deg,
      transparent 300deg,
      rgba(80,40,180,${0.06 * gravityPulse * intensity}) 315deg,
      transparent 330deg,
      transparent 345deg,
      rgba(100,60,200,${0.08 * gravityPulse * intensity}) 360deg
    )
  `;

  // Central gravity well — bright purple-white core
  const gravityWell = `
    radial-gradient(circle 8% at 50% 50%,
      rgba(200,180,255,${wellPulse * intensity * 0.30}) 0%,
      rgba(150,100,240,${wellPulse * intensity * 0.18}) 40%,
      rgba(100,60,200,${wellPulse * intensity * 0.08}) 70%,
      transparent 100%
    )
  `;

  // Haki surge flash — bright purple/white burst
  const surgeGlow = `
    radial-gradient(ellipse 70% 60% at 50% 50%,
      rgba(220,200,255,${surgeFlash * intensity}) 0%,
      rgba(160,120,255,${surgeFlash * intensity * 0.5}) 30%,
      rgba(100,60,200,${surgeFlash * intensity * 0.2}) 60%,
      transparent 90%
    )
  `;

  // Vignette — darkness deepens at edges
  const vignette = `
    radial-gradient(ellipse 65% 60% at 50% 50%,
      transparent 25%,
      rgba(8,2,25,${0.25 * intensity}) 55%,
      rgba(4,1,15,${0.50 * intensity}) 100%
    )
  `;

  const background = `
    ${surgeGlow},
    ${auraGlow1},
    ${auraGlow2},
    ${auraGlow3},
    ${auraGlow4},
    ${auraGlow5},
    ${gravityWell},
    ${rippleRing1},
    ${rippleRing2},
    ${rippleRing3},
    ${gravityLines},
    ${nebula1},
    ${nebula2},
    ${vignette},
    ${voidBase}
  `;

  return createOverlayStyle(background);
}
