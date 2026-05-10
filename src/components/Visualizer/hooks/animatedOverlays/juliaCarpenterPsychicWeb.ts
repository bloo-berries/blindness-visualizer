/**
 * Julia Carpenter's Psychic Web overlay generator
 *
 * Marvel's Madame Web (Arachne). Blind, but perceives a vast psychic web
 * connecting all living beings — a luminous spider-web of crimson and
 * magenta-pink strands radiating from her consciousness.
 *
 * Visual Concept:
 * - Deep red-black void as base
 * - Bright crimson/magenta web spokes rotating slowly (two counter-rotating layers)
 * - Concentric web rings pulsing outward
 * - White-hot detection nodes where presences are sensed (5 nodes)
 * - Central nexus — a blazing core where all strands converge
 * - Precognitive flashes — brief bright flares with magenta afterglow
 * - Thread connections arcing between nodes
 * - Outer web constantly reforming and extending
 */

import { createOverlayStyle } from './createOverlayStyle';

/**
 * Generate Julia Carpenter's Psychic Web overlay
 */
export function generateJuliaCarpenterPsychicWebOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // === WEB ROTATION (two counter-rotating layers) ===
  const webRotation1 = (time * 5) % 360;
  const webRotation2 = (360 - (time * 3) % 360); // counter-rotation

  // === WEB BREATHING (whole web pulses with life) ===
  const webBreath = 0.75 + Math.sin(time * 0.4) * 0.25;
  const webBreath2 = 0.70 + Math.sin(time * 0.35 + 1.0) * 0.20;

  // === DETECTION NODES (5 presences sensed on the web) ===
  const node1X = 30 + Math.sin(time * 0.08) * 12;
  const node1Y = 38 + Math.cos(time * 0.07) * 10;
  const node2X = 70 + Math.sin(time * 0.09 + 2.0) * 10;
  const node2Y = 55 + Math.cos(time * 0.10 + 1.5) * 8;
  const node3X = 50 + Math.sin(time * 0.06 + 4.0) * 14;
  const node3Y = 25 + Math.cos(time * 0.08 + 3.0) * 7;
  const node4X = 22 + Math.sin(time * 0.07 + 1.0) * 8;
  const node4Y = 65 + Math.cos(time * 0.06 + 5.0) * 6;
  const node5X = 78 + Math.sin(time * 0.10 + 3.5) * 7;
  const node5Y = 32 + Math.cos(time * 0.09 + 2.5) * 9;

  // Heartbeat-style pulsing for nodes
  const nodePulse1 = 0.6 + Math.sin(time * 1.0) * 0.4;
  const nodePulse2 = 0.55 + Math.sin(time * 0.9 + 1.2) * 0.4;
  const nodePulse3 = 0.65 + Math.sin(time * 1.1 + 2.8) * 0.35;
  const nodePulse4 = 0.5 + Math.sin(time * 0.85 + 0.5) * 0.35;
  const nodePulse5 = 0.6 + Math.sin(time * 1.05 + 4.0) * 0.3;

  // === PRECOGNITIVE FLASHES (vision of the future) ===
  // Two flash cycles offset so they feel irregular
  const flashCycle1 = time % 5;
  const flashIntensity1 = flashCycle1 < 0.25
    ? Math.pow(1 - flashCycle1 / 0.25, 2) * 0.50
    : flashCycle1 < 0.5
      ? Math.pow((flashCycle1 - 0.25) / 0.25, 0.5) * 0.15 // magenta afterglow
      : 0;

  const flashCycle2 = (time + 2.8) % 7;
  const flashIntensity2 = flashCycle2 < 0.2
    ? Math.pow(1 - flashCycle2 / 0.2, 2) * 0.35
    : 0;

  // === OUTER WEB REFORMATION (expanding rings) ===
  const reformPhase1 = (time * 0.18) % 1;
  const reformPhase2 = ((time * 0.18) + 0.5) % 1;
  const reformRadius1 = 50 + reformPhase1 * 50;
  const reformRadius2 = 50 + reformPhase2 * 50;
  const reformOpacity1 = (1 - reformPhase1) * 0.20 * intensity;
  const reformOpacity2 = (1 - reformPhase2) * 0.15 * intensity;

  // === CENTRAL NEXUS (where all web strands converge) ===
  const nexusPulse = 0.6 + Math.sin(time * 0.8) * 0.3;

  // === WEB MESH STRAND HELPERS ===
  // Opacity for the web strands — pulsing with the web breath
  const strandOp = 0.35 * webBreath * intensity; // primary strands
  const strandOp2 = 0.22 * webBreath2 * intensity; // secondary strands

  // Slow rotation offset for web wobble
  const rot = webRotation1;
  const rot2 = webRotation2;

  // --- LAYERS ---

  // Deep red-black void base
  const darkBase = `
    linear-gradient(
      150deg,
      rgba(30,8,12,${0.85 * intensity}) 0%,
      rgba(22,5,10,${0.88 * intensity}) 50%,
      rgba(18,4,8,${0.90 * intensity}) 100%
    )
  `;

  // === RADIAL SPOKE STRANDS (actual lines radiating from center) ===
  // 12 spokes at 30deg intervals, using thin linear-gradient lines through center
  // Each spoke is a narrow bright line (crimson or magenta) passing through 50% 50%
  const spoke = (angle: number, color: string, opacity: number) => `
    linear-gradient(
      ${angle}deg,
      transparent 0%,
      transparent 48.6%,
      ${color.replace('OP', String(opacity * 0.4))} 49.3%,
      ${color.replace('OP', String(opacity))} 49.8%,
      ${color.replace('OP', String(opacity * 1.2))} 50%,
      ${color.replace('OP', String(opacity))} 50.2%,
      ${color.replace('OP', String(opacity * 0.4))} 50.7%,
      transparent 51.4%,
      transparent 100%
    )
  `;

  // Primary web spokes — 12 crimson/magenta strands, slowly rotating
  const crimson = 'rgba(220,20,60,OP)';
  const magenta = 'rgba(255,20,147,OP)';

  const webSpoke0 = spoke(rot + 0, crimson, strandOp);
  const webSpoke1 = spoke(rot + 30, magenta, strandOp * 0.85);
  const webSpoke2 = spoke(rot + 60, crimson, strandOp * 0.9);
  const webSpoke3 = spoke(rot + 90, magenta, strandOp * 0.8);
  const webSpoke4 = spoke(rot + 120, crimson, strandOp * 0.95);
  const webSpoke5 = spoke(rot + 150, magenta, strandOp * 0.85);

  // Secondary counter-rotating spokes — thinner, offset between primary
  const webSpoke6 = spoke(rot2 + 15, crimson, strandOp2);
  const webSpoke7 = spoke(rot2 + 45, magenta, strandOp2 * 0.9);
  const webSpoke8 = spoke(rot2 + 75, crimson, strandOp2 * 0.85);
  const webSpoke9 = spoke(rot2 + 105, magenta, strandOp2);
  const webSpoke10 = spoke(rot2 + 135, crimson, strandOp2 * 0.9);
  const webSpoke11 = spoke(rot2 + 165, magenta, strandOp2 * 0.85);

  // === CONCENTRIC WEB RINGS (spiral threads connecting spokes) ===
  // Tighter spacing, more visible — the "spiral" part of the web
  const webRings = `
    repeating-radial-gradient(circle at 50% 50%,
      transparent 0%,
      transparent ${7.5 - intensity}%,
      rgba(255,60,100,${0.25 * webBreath * intensity}) ${8 - intensity}%,
      rgba(220,20,60,${0.30 * webBreath * intensity}) ${8.3 - intensity}%,
      rgba(255,60,100,${0.25 * webBreath * intensity}) ${8.6 - intensity}%,
      transparent ${9 - intensity}%
    )
  `;

  // Second ring layer — offset slightly for denser mesh
  const webRings2 = `
    repeating-radial-gradient(circle at 50% 50%,
      transparent 0%,
      transparent ${4 - intensity * 0.5}%,
      rgba(255,20,147,${0.12 * webBreath2 * intensity}) ${4.4 - intensity * 0.5}%,
      transparent ${4.8 - intensity * 0.5}%
    )
  `;

  // Central nexus — blazing white-hot core where all strands meet
  const nexus = `
    radial-gradient(circle 6% at 50% 50%,
      rgba(255,255,255,${nexusPulse * intensity * 0.55}) 0%,
      rgba(255,200,220,${nexusPulse * intensity * 0.35}) 30%,
      rgba(255,60,100,${nexusPulse * intensity * 0.18}) 60%,
      rgba(220,20,60,${nexusPulse * intensity * 0.06}) 85%,
      transparent 100%
    )
  `;

  // Detection node 1 — white-hot core with crimson halo
  const detectionNode1 = `
    radial-gradient(circle 5% at ${node1X}% ${node1Y}%,
      rgba(255,255,255,${nodePulse1 * intensity * 0.60}) 0%,
      rgba(255,180,200,${nodePulse1 * intensity * 0.35}) 30%,
      rgba(220,20,60,${nodePulse1 * intensity * 0.15}) 60%,
      transparent 100%
    )
  `;

  const detectionNode2 = `
    radial-gradient(circle 4% at ${node2X}% ${node2Y}%,
      rgba(255,255,255,${nodePulse2 * intensity * 0.55}) 0%,
      rgba(255,160,190,${nodePulse2 * intensity * 0.30}) 35%,
      rgba(255,20,147,${nodePulse2 * intensity * 0.12}) 65%,
      transparent 100%
    )
  `;

  const detectionNode3 = `
    radial-gradient(circle 4% at ${node3X}% ${node3Y}%,
      rgba(255,255,255,${nodePulse3 * intensity * 0.50}) 0%,
      rgba(255,170,200,${nodePulse3 * intensity * 0.28}) 35%,
      rgba(220,20,60,${nodePulse3 * intensity * 0.10}) 65%,
      transparent 100%
    )
  `;

  const detectionNode4 = `
    radial-gradient(circle 3.5% at ${node4X}% ${node4Y}%,
      rgba(255,255,255,${nodePulse4 * intensity * 0.45}) 0%,
      rgba(255,150,180,${nodePulse4 * intensity * 0.22}) 40%,
      rgba(255,20,147,${nodePulse4 * intensity * 0.08}) 70%,
      transparent 100%
    )
  `;

  const detectionNode5 = `
    radial-gradient(circle 3% at ${node5X}% ${node5Y}%,
      rgba(255,255,255,${nodePulse5 * intensity * 0.40}) 0%,
      rgba(255,140,170,${nodePulse5 * intensity * 0.20}) 45%,
      rgba(220,20,60,${nodePulse5 * intensity * 0.07}) 75%,
      transparent 100%
    )
  `;

  // Precognitive flash 1 — bright white with magenta afterglow
  const precogFlash1 = `
    radial-gradient(ellipse 70% 55% at 50% 45%,
      rgba(255,255,255,${flashIntensity1 * intensity}) 0%,
      rgba(255,100,160,${flashIntensity1 * intensity * 0.4}) 30%,
      rgba(220,20,60,${flashIntensity1 * intensity * 0.15}) 60%,
      transparent 90%
    )
  `;

  // Precognitive flash 2 — off-center, smaller
  const precogFlash2 = `
    radial-gradient(ellipse 40% 35% at 35% 40%,
      rgba(255,240,250,${flashIntensity2 * intensity}) 0%,
      rgba(255,80,140,${flashIntensity2 * intensity * 0.3}) 40%,
      transparent 80%
    )
  `;

  // Reforming outer web ring 1
  const outerReform1 = `
    radial-gradient(circle ${reformRadius1}% at 50% 50%,
      transparent ${Math.max(0, reformRadius1 - 3)}%,
      rgba(255,20,147,${reformOpacity1 * 0.7}) ${reformRadius1 - 1.5}%,
      rgba(255,60,120,${reformOpacity1}) ${reformRadius1}%,
      rgba(255,20,147,${reformOpacity1 * 0.7}) ${reformRadius1 + 1.5}%,
      transparent ${reformRadius1 + 3}%
    )
  `;

  // Reforming outer web ring 2
  const outerReform2 = `
    radial-gradient(circle ${reformRadius2}% at 50% 50%,
      transparent ${Math.max(0, reformRadius2 - 2.5)}%,
      rgba(220,20,60,${reformOpacity2 * 0.6}) ${reformRadius2 - 1}%,
      rgba(240,40,80,${reformOpacity2}) ${reformRadius2}%,
      rgba(220,20,60,${reformOpacity2 * 0.6}) ${reformRadius2 + 1}%,
      transparent ${reformRadius2 + 2.5}%
    )
  `;

  // Vignette — deep darkness at edges with crimson tinge
  const vignette = `
    radial-gradient(ellipse 60% 55% at 50% 50%,
      transparent 20%,
      rgba(30,8,12,${0.20 * intensity}) 50%,
      rgba(15,3,6,${0.50 * intensity}) 100%
    )
  `;

  const background = `
    ${precogFlash1},
    ${precogFlash2},
    ${nexus},
    ${detectionNode1},
    ${detectionNode2},
    ${detectionNode3},
    ${detectionNode4},
    ${detectionNode5},
    ${outerReform1},
    ${outerReform2},
    ${webSpoke0},
    ${webSpoke1},
    ${webSpoke2},
    ${webSpoke3},
    ${webSpoke4},
    ${webSpoke5},
    ${webSpoke6},
    ${webSpoke7},
    ${webSpoke8},
    ${webSpoke9},
    ${webSpoke10},
    ${webSpoke11},
    ${webRings},
    ${webRings2},
    ${vignette},
    ${darkBase}
  `;

  return createOverlayStyle(background);
}
