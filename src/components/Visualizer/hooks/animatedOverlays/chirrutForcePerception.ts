/**
 * Chirrut Îmwe's Force Perception overlay generator
 *
 * Force attunement + heightened senses provide spatial awareness.
 * Strong desaturation with pale blue-cyan wash. Soft blue-white luminous
 * glows around living beings. Drifting Force energy wisps in pale cyan.
 * Subtle sound ripple rings. Serene, meditative quality.
 */

/**
 * Generate Chirrut Îmwe's Force Perception overlay
 */
export function generateChirrutForcePerceptionOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Slow, meditative timing — everything moves gently
  const breathCycle = Math.sin(time * 0.25) * 0.5 + 0.5; // ~4s breathing rhythm

  // Force aura glow positions — living beings sensed through the Force
  const aura1X = 40 + Math.sin(time * 0.04) * 12;
  const aura1Y = 45 + Math.cos(time * 0.035) * 10;
  const aura2X = 62 + Math.sin(time * 0.05 + 2.5) * 10;
  const aura2Y = 38 + Math.cos(time * 0.045 + 1.8) * 8;

  // Aura intensity pulsing — gentle, organic
  const auraPulse1 = 0.80 + Math.sin(time * 0.2) * 0.12;
  const auraPulse2 = 0.75 + Math.sin(time * 0.18 + 1.5) * 0.10;

  // Drifting Force wisps — pale cyan energy strands
  const wisp1X = 30 + Math.sin(time * 0.06) * 25;
  const wisp1Y = 50 + Math.cos(time * 0.04 + 0.8) * 20;
  const wisp2X = 70 + Math.sin(time * 0.05 + 3.0) * 20;
  const wisp2Y = 35 + Math.cos(time * 0.07 + 2.0) * 18;
  const wisp3X = 50 + Math.sin(time * 0.03 + 1.5) * 30;
  const wisp3Y = 65 + Math.cos(time * 0.055 + 4.0) * 15;

  const wispOpacity1 = (0.06 + Math.sin(time * 0.15) * 0.04) * intensity;
  const wispOpacity2 = (0.05 + Math.sin(time * 0.12 + 1.0) * 0.03) * intensity;
  const wispOpacity3 = (0.04 + Math.sin(time * 0.18 + 2.5) * 0.03) * intensity;

  // Sound ripple rings — expanding circles from ambient sounds
  const soundPhase1 = (time * 0.15) % 1; // ~6.7s cycle
  const soundPhase2 = ((time * 0.15) + 0.5) % 1;
  const soundRadius1 = 5 + soundPhase1 * 60;
  const soundRadius2 = 5 + soundPhase2 * 50;
  const soundOpacity1 = (1 - soundPhase1) * 0.10 * intensity;
  const soundOpacity2 = (1 - soundPhase2) * 0.08 * intensity;

  // Sound source positions
  const sound1X = 45 + Math.sin(time * 0.02) * 8;
  const sound1Y = 50 + Math.cos(time * 0.025) * 6;
  const sound2X = 60 + Math.sin(time * 0.03 + 2.0) * 10;
  const sound2Y = 40 + Math.cos(time * 0.02 + 1.0) * 8;

  // Blue-gray semi-transparent base — not darkness, awareness
  const baseWash = `
    linear-gradient(
      rgba(100,120,145,${(0.55 + breathCycle * 0.08) * intensity}) 0%,
      rgba(90,110,135,${(0.52 + breathCycle * 0.06) * intensity}) 50%,
      rgba(80,100,125,${(0.50 + breathCycle * 0.05) * intensity}) 100%
    )
  `;

  // Force aura halos — blue-white (#B0D4F1) luminous glows
  const forceAura1 = `
    radial-gradient(ellipse 28% 32% at ${aura1X}% ${aura1Y}%,
      rgba(176,212,241,${auraPulse1 * intensity * 0.28}) 0%,
      rgba(160,195,230,${auraPulse1 * intensity * 0.16}) 40%,
      rgba(140,175,215,${auraPulse1 * intensity * 0.06}) 70%,
      transparent 100%
    )
  `;

  const forceAura2 = `
    radial-gradient(ellipse 22% 26% at ${aura2X}% ${aura2Y}%,
      rgba(180,218,245,${auraPulse2 * intensity * 0.22}) 0%,
      rgba(165,200,235,${auraPulse2 * intensity * 0.12}) 45%,
      rgba(145,180,220,${auraPulse2 * intensity * 0.05}) 75%,
      transparent 100%
    )
  `;

  // Drifting Force energy wisps — pale cyan tendrils
  const forceWisp1 = `
    radial-gradient(ellipse 35% 8% at ${wisp1X}% ${wisp1Y}%,
      rgba(160,220,240,${wispOpacity1}) 0%,
      rgba(140,200,225,${wispOpacity1 * 0.5}) 50%,
      transparent 100%
    )
  `;

  const forceWisp2 = `
    radial-gradient(ellipse 8% 30% at ${wisp2X}% ${wisp2Y}%,
      rgba(150,215,235,${wispOpacity2}) 0%,
      rgba(135,195,220,${wispOpacity2 * 0.5}) 50%,
      transparent 100%
    )
  `;

  const forceWisp3 = `
    radial-gradient(ellipse 25% 6% at ${wisp3X}% ${wisp3Y}%,
      rgba(170,225,245,${wispOpacity3}) 0%,
      rgba(150,210,230,${wispOpacity3 * 0.5}) 50%,
      transparent 100%
    )
  `;

  // Sound ripple rings — subtle expanding circles
  const soundRipple1 = `
    radial-gradient(circle ${soundRadius1}% at ${sound1X}% ${sound1Y}%,
      transparent ${Math.max(0, soundRadius1 - 2)}%,
      rgba(180,210,235,${soundOpacity1}) ${soundRadius1 - 0.5}%,
      rgba(190,220,240,${soundOpacity1 * 1.2}) ${soundRadius1}%,
      rgba(180,210,235,${soundOpacity1}) ${soundRadius1 + 0.5}%,
      transparent ${soundRadius1 + 2}%
    )
  `;

  const soundRipple2 = `
    radial-gradient(circle ${soundRadius2}% at ${sound2X}% ${sound2Y}%,
      transparent ${Math.max(0, soundRadius2 - 2)}%,
      rgba(175,205,230,${soundOpacity2}) ${soundRadius2 - 0.5}%,
      rgba(185,215,238,${soundOpacity2 * 1.1}) ${soundRadius2}%,
      rgba(175,205,230,${soundOpacity2}) ${soundRadius2 + 0.5}%,
      transparent ${soundRadius2 + 2}%
    )
  `;

  // Gentle vignette — slightly darker at edges
  const vignette = `
    radial-gradient(ellipse 75% 70% at 50% 50%,
      transparent 40%,
      rgba(60,80,100,${0.15 * intensity}) 70%,
      rgba(40,60,80,${0.25 * intensity}) 100%
    )
  `;

  const background = `
    ${forceAura1},
    ${forceAura2},
    ${forceWisp1},
    ${forceWisp2},
    ${forceWisp3},
    ${soundRipple1},
    ${soundRipple2},
    ${vignette},
    ${baseWash}
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
    zIndex: 9999,
  };
}
