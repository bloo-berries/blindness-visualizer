/**
 * Simple Hallucination Patterns (geometric/abstract)
 * Common in CBS visual hallucinations
 */

import { seededRandom } from '../sharedOverlayUtils';

/**
 * Honeycomb hexagonal pattern - common in CBS simple hallucinations
 */
export function createHoneycombPattern(
  opacity: number,
  colored: boolean,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  const color = colored
    ? `rgba(180,150,80,${opacity})`
    : `rgba(80,80,90,${opacity})`;
  const bgColor = colored
    ? `rgba(100,80,40,${opacity * 0.3})`
    : `rgba(60,60,70,${opacity * 0.3})`;

  // Conic gradient creates hexagonal appearance
  return `
    repeating-conic-gradient(
      from 0deg at calc(50% + ${offsetX}px) calc(50% + ${offsetY}px),
      ${color} 0deg 60deg,
      ${bgColor} 60deg 120deg
    )
  `;
}

/**
 * Spiral pattern - logarithmic spiral often reported in CBS
 */
export function createSpiralPattern(
  opacity: number,
  colored: boolean,
  rotation: number = 0,
  centerX: number = 50,
  centerY: number = 50
): string {
  const elements: string[] = [];
  const numArms = 6;

  for (let i = 0; i < numArms; i++) {
    const angle = (i / numArms) * 360 + rotation;
    const hue = colored ? (i * 60) % 360 : 0;
    const saturation = colored ? 50 : 0;
    const lightness = colored ? 50 : 40 + (i % 3) * 10;

    elements.push(`
      conic-gradient(
        from ${angle}deg at ${centerX}% ${centerY}%,
        hsla(${hue},${saturation}%,${lightness}%,${opacity * 0.4}) 0deg,
        transparent 30deg,
        transparent 60deg
      )
    `);
  }

  return elements.join(', ');
}

/**
 * Tessellation pattern - organic mosaic of overlapping blobs
 */
export function createTessellationPattern(
  opacity: number,
  colored: boolean,
  seed: number = 1
): string {
  const elements: string[] = [];
  const numBlobs = 8;

  for (let i = 0; i < numBlobs; i++) {
    // Use seed for deterministic but varied positions
    const x = 10 + seededRandom(seed + i * 17) * 80;
    const y = 10 + seededRandom(seed + i * 23) * 80;
    const sizeX = 15 + seededRandom(seed + i * 31) * 25;
    const sizeY = 10 + seededRandom(seed + i * 37) * 20;

    const hue1 = colored ? 260 + seededRandom(seed + i) * 40 : 0;
    const hue2 = colored ? 180 + seededRandom(seed + i * 2) * 40 : 0;
    const sat = colored ? 40 : 0;
    const light = colored ? 50 : 45 + (i % 3) * 8;

    // Create irregular blob shapes using elliptical gradients
    elements.push(`
      radial-gradient(ellipse ${sizeX}% ${sizeY}% at ${x}% ${y}%,
        hsla(${i % 2 === 0 ? hue1 : hue2},${sat}%,${light}%,${opacity * 0.35}) 0%,
        hsla(${i % 2 === 0 ? hue1 : hue2},${sat}%,${light}%,${opacity * 0.15}) 50%,
        transparent 100%
      )
    `);
  }

  return elements.join(', ');
}

/**
 * Concentric circles pattern - pulsing rings
 */
export function createConcentricCirclesPattern(
  opacity: number,
  colored: boolean,
  centerX: number = 50,
  centerY: number = 50,
  pulse: number = 0
): string {
  const elements: string[] = [];
  const numRings = 5;

  for (let i = 0; i < numRings; i++) {
    const baseRadius = 8 + i * 12 + pulse * 3;
    const hue = colored ? (i * 45 + 200) % 360 : 0;
    const saturation = colored ? 40 : 0;
    const lightness = colored ? 55 : 50;

    elements.push(`
      radial-gradient(
        circle at ${centerX}% ${centerY}%,
        transparent ${baseRadius - 2}%,
        hsla(${hue},${saturation}%,${lightness}%,${opacity * 0.35}) ${baseRadius}%,
        hsla(${hue},${saturation}%,${lightness}%,${opacity * 0.35}) ${baseRadius + 1.5}%,
        transparent ${baseRadius + 3}%
      )
    `);
  }

  return elements.join(', ');
}

/**
 * Zigzag fortification pattern - organic wavy blobs instead of straight lines
 */
export function createZigzagPattern(
  opacity: number,
  colored: boolean,
  seed: number = 0
): string {
  const elements: string[] = [];
  const numWaves = 6;

  // Create a wave-like pattern using overlapping ellipses
  for (let i = 0; i < numWaves; i++) {
    // Staggered positions to create wave effect
    const baseX = 10 + (i * 15) + seededRandom(seed + i * 7) * 8;
    const baseY = 20 + seededRandom(seed + i * 11) * 60;
    const sizeX = 18 + seededRandom(seed + i * 13) * 15;
    const sizeY = 8 + seededRandom(seed + i * 17) * 10;

    const hue = colored ? 40 + seededRandom(seed + i) * 30 : 0; // Warm yellows/oranges
    const sat = colored ? 60 : 0;
    const light = colored ? 65 : 55;

    elements.push(`
      radial-gradient(ellipse ${sizeX}% ${sizeY}% at ${baseX}% ${baseY}%,
        hsla(${hue},${sat}%,${light}%,${opacity * 0.45}) 0%,
        hsla(${hue},${sat}%,${light}%,${opacity * 0.2}) 60%,
        transparent 100%
      )
    `);

    // Add secondary blob offset for organic feel
    const offsetX = baseX + 5 + seededRandom(seed + i * 19) * 10;
    const offsetY = baseY + 15 + seededRandom(seed + i * 23) * 15;

    elements.push(`
      radial-gradient(ellipse ${sizeX * 0.7}% ${sizeY * 0.8}% at ${offsetX}% ${offsetY}%,
        hsla(${hue},${sat}%,${light + 5}%,${opacity * 0.3}) 0%,
        hsla(${hue},${sat}%,${light}%,${opacity * 0.1}) 70%,
        transparent 100%
      )
    `);
  }

  return elements.join(', ');
}

/**
 * Grid/lattice pattern - organic lattice of interconnected blobs
 */
export function createGridPattern(
  opacity: number,
  colored: boolean,
  seed: number = 42
): string {
  const elements: string[] = [];

  // Create an organic lattice using scattered nodes
  const gridSize = 4;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      // Base position with randomized offset for organic feel
      const baseX = 12 + col * 22 + (seededRandom(seed + idx * 7) - 0.5) * 10;
      const baseY = 12 + row * 22 + (seededRandom(seed + idx * 11) - 0.5) * 10;
      const size = 8 + seededRandom(seed + idx * 13) * 8;

      const hue = colored ? 30 + seededRandom(seed + idx) * 20 : 0;
      const sat = colored ? 35 : 0;
      const light = colored ? 45 : 50;

      // Node blob
      elements.push(`
        radial-gradient(circle ${size}% at ${baseX}% ${baseY}%,
          hsla(${hue},${sat}%,${light}%,${opacity * 0.4}) 0%,
          hsla(${hue},${sat}%,${light}%,${opacity * 0.15}) 60%,
          transparent 100%
        )
      `);

      // Add connecting blobs between nodes (horizontal and vertical neighbors)
      if (col < gridSize - 1) {
        const connX = baseX + 11 + seededRandom(seed + idx * 17) * 4;
        const connY = baseY + (seededRandom(seed + idx * 19) - 0.5) * 6;
        elements.push(`
          radial-gradient(ellipse 12% 4% at ${connX}% ${connY}%,
            hsla(${hue},${sat}%,${light}%,${opacity * 0.25}) 0%,
            transparent 100%
          )
        `);
      }
      if (row < gridSize - 1) {
        const connX = baseX + (seededRandom(seed + idx * 23) - 0.5) * 6;
        const connY = baseY + 11 + seededRandom(seed + idx * 29) * 4;
        elements.push(`
          radial-gradient(ellipse 4% 12% at ${connX}% ${connY}%,
            hsla(${hue},${sat}%,${light}%,${opacity * 0.25}) 0%,
            transparent 100%
          )
        `);
      }
    }
  }

  return elements.join(', ');
}

/**
 * Photopsia - light flashes and colored spots
 */
export function createPhotopsiaPattern(
  opacity: number,
  colored: boolean,
  seed: number,
  numFlashes: number = 5
): string {
  const elements: string[] = [];

  for (let i = 0; i < numFlashes; i++) {
    const x = 15 + seededRandom(seed + i * 7) * 70;
    const y = 15 + seededRandom(seed + i * 11) * 70;
    const size = 6 + seededRandom(seed + i * 13) * 12;

    if (colored && i % 2 === 0) {
      const hue = [0, 60, 120, 240][Math.floor(seededRandom(seed + i) * 4)];
      elements.push(`
        radial-gradient(circle ${size}px at ${x}% ${y}%,
          hsla(${hue},70%,70%,${opacity * 0.6}) 0%,
          hsla(${hue},60%,60%,${opacity * 0.3}) 50%,
          transparent 100%
        )
      `);
    } else {
      elements.push(`
        radial-gradient(circle ${size}px at ${x}% ${y}%,
          rgba(255,255,255,${opacity * 0.7}) 0%,
          rgba(255,255,220,${opacity * 0.4}) 40%,
          rgba(255,240,200,${opacity * 0.2}) 70%,
          transparent 100%
        )
      `);
    }
  }

  return elements.join(', ');
}

/**
 * Sparkles - random twinkling points of light that appear sporadically
 * Common in CBS as brief, bright flashes scattered across vision
 */
export function createSparklesPattern(
  opacity: number,
  colored: boolean,
  seed: number,
  animationPhase: number = 0
): string {
  const elements: string[] = [];
  const numSparkles = 12 + Math.floor(seededRandom(seed) * 8);

  for (let i = 0; i < numSparkles; i++) {
    // Highly randomized positions using multiple seed offsets
    const x = seededRandom(seed + i * 17.3 + animationPhase * 0.06) * 100;
    const y = seededRandom(seed + i * 23.7 + animationPhase * 0.09) * 100;

    // Sporadic visibility - some sparkles visible, some not (slowed down)
    const visibilityPhase = Math.sin(animationPhase * 1.8 + seededRandom(seed + i * 31) * 10);
    const isVisible = visibilityPhase > -0.3;

    if (!isVisible) continue;

    // Variable sizes for twinkling effect
    const baseSize = 2 + seededRandom(seed + i * 41) * 6;
    const pulseSize = baseSize * (0.8 + Math.abs(visibilityPhase) * 0.4);

    // Sparkle intensity varies
    const sparkleOpacity = opacity * (0.4 + Math.abs(visibilityPhase) * 0.6);

    if (colored && seededRandom(seed + i * 53) > 0.6) {
      // Colored sparkle
      const hue = seededRandom(seed + i * 61) * 360;
      elements.push(`
        radial-gradient(circle ${pulseSize}px at ${x}% ${y}%,
          hsla(${hue},80%,90%,${sparkleOpacity}) 0%,
          hsla(${hue},70%,80%,${sparkleOpacity * 0.5}) 30%,
          transparent 100%
        )
      `);
    } else {
      // White sparkle with slight glow
      elements.push(`
        radial-gradient(circle ${pulseSize}px at ${x}% ${y}%,
          rgba(255,255,255,${sparkleOpacity}) 0%,
          rgba(255,255,240,${sparkleOpacity * 0.6}) 25%,
          rgba(255,250,220,${sparkleOpacity * 0.3}) 50%,
          transparent 100%
        )
      `);
    }
  }

  return elements.join(', ');
}
