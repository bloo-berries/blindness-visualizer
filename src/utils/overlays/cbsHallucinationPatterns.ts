/**
 * Charles Bonnet Syndrome (CBS) Hallucination Pattern Utilities
 *
 * Shared pattern generators for both the main visualizer and preview panel.
 * CBS hallucinations occur in episodic manner - different patterns appear and
 * disappear over time, which this system simulates.
 */

// ============================================================================
// Episode System
// ============================================================================

export interface EpisodeConfig {
  simplePatterns: SimplePatternType[];
  complexPatterns: ComplexPatternType[];
  patternColors: Map<string, boolean>; // true = colored, false = grayscale
}

export type SimplePatternType = 'honeycomb' | 'spiral' | 'tessellation' | 'concentricCircles' | 'zigzag' | 'grid' | 'photopsia';
export type ComplexPatternType = 'humanSilhouette' | 'face' | 'flower' | 'cat' | 'building';

const ALL_SIMPLE_PATTERNS: SimplePatternType[] = ['honeycomb', 'spiral', 'tessellation', 'concentricCircles', 'zigzag', 'grid', 'photopsia'];
const ALL_COMPLEX_PATTERNS: ComplexPatternType[] = ['humanSilhouette', 'face', 'flower', 'cat', 'building'];

/**
 * Seeded random number generator for deterministic episode selection
 * Same seed will always produce the same sequence of random numbers
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Calculate episode timing and opacity based on current time
 * Episodes change every 8-15 seconds with smooth fade transitions
 *
 * @param now - Current timestamp (Date.now())
 * @param intensity - Effect intensity (0-1)
 * @param startTime - Optional start time to offset episodes. When provided,
 *                    ensures the effect starts at the beginning of an episode
 *                    with full visibility.
 */
export function getEpisodeTiming(now: number, intensity: number, startTime?: number): {
  episodeSeed: number;
  episodeOpacity: number;
  episodeProgress: number;
} {
  // Episode duration varies between 8-15 seconds based on a seed from intensity
  const baseDuration = 10000;
  const variationRange = 5000;
  const durationSeed = Math.floor(intensity * 1000);
  const episodeDuration = baseDuration + seededRandom(durationSeed) * variationRange;

  // If startTime is provided, calculate time relative to it
  // This ensures the effect starts at the beginning of an episode
  const effectiveTime = startTime !== undefined ? (now - startTime) : now;

  // Add a small offset (10% into episode) to skip the fade-in and show patterns immediately
  const offsetTime = startTime !== undefined ? effectiveTime + episodeDuration * 0.1 : effectiveTime;

  const episodeSeed = Math.floor(offsetTime / episodeDuration);
  const episodeProgress = (offsetTime % episodeDuration) / episodeDuration;

  // Smooth fade transitions (20% fade in, 20% fade out)
  const fadeIn = Math.min(1, episodeProgress * 5);
  const fadeOut = Math.min(1, (1 - episodeProgress) * 5);
  const episodeOpacity = Math.min(fadeIn, fadeOut);

  return { episodeSeed, episodeOpacity, episodeProgress };
}

// Store the start time for hallucinations effect to ensure consistent episode timing
let hallucinationsStartTime: number | null = null;

/**
 * Get or initialize the hallucinations start time
 * Called when the effect is first enabled to ensure episodes start fresh
 */
export function getHallucinationsStartTime(): number {
  if (hallucinationsStartTime === null) {
    hallucinationsStartTime = Date.now();
  }
  return hallucinationsStartTime;
}

/**
 * Reset the hallucinations start time (called when effect is disabled)
 */
export function resetHallucinationsStartTime(): void {
  hallucinationsStartTime = null;
}

/**
 * Select which patterns to show for a given episode
 * Higher intensity = more patterns shown
 */
export function selectEpisodeConfig(episodeSeed: number, intensity: number): EpisodeConfig {
  // Number of patterns scales with intensity
  const numSimple = Math.floor(1 + intensity * 2.5); // 1-3 simple patterns
  const numComplex = Math.floor(intensity * 2); // 0-2 complex patterns

  const simplePatterns: SimplePatternType[] = [];
  const complexPatterns: ComplexPatternType[] = [];
  const patternColors = new Map<string, boolean>();

  // Select simple patterns using seeded random
  const shuffledSimple = [...ALL_SIMPLE_PATTERNS].sort(
    (a, b) => seededRandom(episodeSeed + ALL_SIMPLE_PATTERNS.indexOf(a)) -
              seededRandom(episodeSeed + ALL_SIMPLE_PATTERNS.indexOf(b))
  );
  for (let i = 0; i < Math.min(numSimple, shuffledSimple.length); i++) {
    simplePatterns.push(shuffledSimple[i]);
    // 40% chance of being colored
    patternColors.set(shuffledSimple[i], seededRandom(episodeSeed * 10 + i) > 0.6);
  }

  // Select complex patterns using seeded random
  const shuffledComplex = [...ALL_COMPLEX_PATTERNS].sort(
    (a, b) => seededRandom(episodeSeed * 2 + ALL_COMPLEX_PATTERNS.indexOf(a)) -
              seededRandom(episodeSeed * 2 + ALL_COMPLEX_PATTERNS.indexOf(b))
  );
  for (let i = 0; i < Math.min(numComplex, shuffledComplex.length); i++) {
    complexPatterns.push(shuffledComplex[i]);
    // 30% chance of being colored
    patternColors.set(shuffledComplex[i], seededRandom(episodeSeed * 20 + i) > 0.7);
  }

  return { simplePatterns, complexPatterns, patternColors };
}

// ============================================================================
// Simple Hallucination Patterns (geometric/abstract)
// ============================================================================

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

// ============================================================================
// Complex Hallucination Patterns (formed images)
// ============================================================================

/**
 * Human silhouette - improved with neck, shoulders, separate legs
 */
export function createHumanSilhouettePattern(
  opacity: number,
  colored: boolean,
  x: number = 70,
  y: number = 50,
  scale: number = 1
): string {
  const elements: string[] = [];
  const baseColor = colored ? '80,60,50' : '55,50,60';

  // Head
  elements.push(`
    radial-gradient(ellipse ${18 * scale}px ${22 * scale}px at ${x}% ${y - 20 * scale}%,
      rgba(${baseColor},${opacity}) 0%,
      rgba(${baseColor},${opacity * 0.5}) 70%,
      transparent 100%
    )
  `);

  // Neck
  elements.push(`
    radial-gradient(ellipse ${6 * scale}px ${8 * scale}px at ${x}% ${y - 8 * scale}%,
      rgba(${baseColor},${opacity * 0.8}) 0%,
      rgba(${baseColor},${opacity * 0.3}) 80%,
      transparent 100%
    )
  `);

  // Shoulders (wider ellipse)
  elements.push(`
    radial-gradient(ellipse ${35 * scale}px ${12 * scale}px at ${x}% ${y}%,
      rgba(${baseColor},${opacity * 0.9}) 0%,
      rgba(${baseColor},${opacity * 0.4}) 70%,
      transparent 100%
    )
  `);

  // Torso
  elements.push(`
    radial-gradient(ellipse ${25 * scale}px ${40 * scale}px at ${x}% ${y + 18 * scale}%,
      rgba(${baseColor},${opacity * 0.85}) 0%,
      rgba(${baseColor},${opacity * 0.35}) 70%,
      transparent 100%
    )
  `);

  // Left leg
  elements.push(`
    radial-gradient(ellipse ${10 * scale}px ${35 * scale}px at ${x - 8 * scale}% ${y + 58 * scale}%,
      rgba(${baseColor},${opacity * 0.7}) 0%,
      rgba(${baseColor},${opacity * 0.25}) 80%,
      transparent 100%
    )
  `);

  // Right leg
  elements.push(`
    radial-gradient(ellipse ${10 * scale}px ${35 * scale}px at ${x + 8 * scale}% ${y + 58 * scale}%,
      rgba(${baseColor},${opacity * 0.7}) 0%,
      rgba(${baseColor},${opacity * 0.25}) 80%,
      transparent 100%
    )
  `);

  return elements.join(', ');
}

/**
 * Face pattern - oval with eyes, nose, mouth shadows
 */
export function createFacePattern(
  opacity: number,
  colored: boolean,
  x: number = 60,
  y: number = 40,
  scale: number = 1
): string {
  const elements: string[] = [];
  const skinColor = colored ? '180,150,130' : '70,65,75';
  const featureColor = colored ? '80,60,50' : '40,35,45';

  // Face oval
  elements.push(`
    radial-gradient(ellipse ${28 * scale}px ${35 * scale}px at ${x}% ${y}%,
      rgba(${skinColor},${opacity * 0.7}) 0%,
      rgba(${skinColor},${opacity * 0.4}) 60%,
      rgba(${skinColor},${opacity * 0.15}) 80%,
      transparent 100%
    )
  `);

  // Left eye
  elements.push(`
    radial-gradient(ellipse ${5 * scale}px ${3 * scale}px at ${x - 7 * scale}% ${y - 5 * scale}%,
      rgba(${featureColor},${opacity * 0.8}) 0%,
      rgba(${featureColor},${opacity * 0.3}) 70%,
      transparent 100%
    )
  `);

  // Right eye
  elements.push(`
    radial-gradient(ellipse ${5 * scale}px ${3 * scale}px at ${x + 7 * scale}% ${y - 5 * scale}%,
      rgba(${featureColor},${opacity * 0.8}) 0%,
      rgba(${featureColor},${opacity * 0.3}) 70%,
      transparent 100%
    )
  `);

  // Nose shadow
  elements.push(`
    radial-gradient(ellipse ${3 * scale}px ${8 * scale}px at ${x}% ${y + 2 * scale}%,
      rgba(${featureColor},${opacity * 0.5}) 0%,
      rgba(${featureColor},${opacity * 0.2}) 60%,
      transparent 100%
    )
  `);

  // Mouth
  elements.push(`
    radial-gradient(ellipse ${8 * scale}px ${3 * scale}px at ${x}% ${y + 12 * scale}%,
      rgba(${featureColor},${opacity * 0.6}) 0%,
      rgba(${featureColor},${opacity * 0.2}) 70%,
      transparent 100%
    )
  `);

  return elements.join(', ');
}

/**
 * Flower pattern - 6 petals around a center
 */
export function createFlowerPattern(
  opacity: number,
  colored: boolean,
  x: number = 30,
  y: number = 60,
  scale: number = 1
): string {
  const elements: string[] = [];
  const petalColor = colored ? '220,150,180' : '90,85,95';
  const centerColor = colored ? '255,220,100' : '70,70,80';

  // 6 petals
  const numPetals = 6;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * 360;
    const rad = angle * Math.PI / 180;
    const petalX = x + Math.cos(rad) * 8 * scale;
    const petalY = y + Math.sin(rad) * 8 * scale;

    elements.push(`
      radial-gradient(ellipse ${12 * scale}px ${6 * scale}px at ${petalX}% ${petalY}%,
        rgba(${petalColor},${opacity * 0.6}) 0%,
        rgba(${petalColor},${opacity * 0.25}) 60%,
        transparent 100%
      )
    `);
  }

  // Center
  elements.push(`
    radial-gradient(circle ${5 * scale}px at ${x}% ${y}%,
      rgba(${centerColor},${opacity * 0.8}) 0%,
      rgba(${centerColor},${opacity * 0.4}) 60%,
      transparent 100%
    )
  `);

  return elements.join(', ');
}

/**
 * Cat pattern - body, head, ears, tail, legs
 */
export function createCatPattern(
  opacity: number,
  colored: boolean,
  x: number = 25,
  y: number = 70,
  scale: number = 1
): string {
  const elements: string[] = [];
  const furColor = colored ? '120,80,50' : '50,45,55';

  // Body (horizontal ellipse)
  elements.push(`
    radial-gradient(ellipse ${35 * scale}px ${18 * scale}px at ${x}% ${y}%,
      rgba(${furColor},${opacity * 0.85}) 0%,
      rgba(${furColor},${opacity * 0.35}) 70%,
      transparent 100%
    )
  `);

  // Head
  elements.push(`
    radial-gradient(ellipse ${14 * scale}px ${12 * scale}px at ${x - 18 * scale}% ${y - 8 * scale}%,
      rgba(${furColor},${opacity * 0.9}) 0%,
      rgba(${furColor},${opacity * 0.4}) 70%,
      transparent 100%
    )
  `);

  // Left ear
  elements.push(`
    radial-gradient(ellipse ${4 * scale}px ${6 * scale}px at ${x - 22 * scale}% ${y - 16 * scale}%,
      rgba(${furColor},${opacity * 0.8}) 0%,
      rgba(${furColor},${opacity * 0.3}) 70%,
      transparent 100%
    )
  `);

  // Right ear
  elements.push(`
    radial-gradient(ellipse ${4 * scale}px ${6 * scale}px at ${x - 14 * scale}% ${y - 16 * scale}%,
      rgba(${furColor},${opacity * 0.8}) 0%,
      rgba(${furColor},${opacity * 0.3}) 70%,
      transparent 100%
    )
  `);

  // Tail (curved using multiple gradients)
  elements.push(`
    radial-gradient(ellipse ${20 * scale}px ${5 * scale}px at ${x + 22 * scale}% ${y - 5 * scale}%,
      rgba(${furColor},${opacity * 0.7}) 0%,
      rgba(${furColor},${opacity * 0.25}) 70%,
      transparent 100%
    )
  `);

  // Front legs
  elements.push(`
    radial-gradient(ellipse ${5 * scale}px ${12 * scale}px at ${x - 12 * scale}% ${y + 12 * scale}%,
      rgba(${furColor},${opacity * 0.65}) 0%,
      rgba(${furColor},${opacity * 0.2}) 80%,
      transparent 100%
    )
  `);

  // Back legs
  elements.push(`
    radial-gradient(ellipse ${5 * scale}px ${12 * scale}px at ${x + 10 * scale}% ${y + 12 * scale}%,
      rgba(${furColor},${opacity * 0.65}) 0%,
      rgba(${furColor},${opacity * 0.2}) 80%,
      transparent 100%
    )
  `);

  return elements.join(', ');
}

/**
 * Building pattern - organic building shape with soft edges and scattered windows
 */
export function createBuildingPattern(
  opacity: number,
  colored: boolean,
  x: number = 75,
  y: number = 55,
  scale: number = 1
): string {
  const elements: string[] = [];
  const wallColor = colored ? '140,120,100' : '65,60,70';
  const windowColor = colored ? '200,220,255' : '45,45,55';

  // Main building shape - soft rectangular blob
  elements.push(`
    radial-gradient(ellipse ${32 * scale}% ${50 * scale}% at ${x}% ${y}%,
      rgba(${wallColor},${opacity * 0.65}) 0%,
      rgba(${wallColor},${opacity * 0.5}) 50%,
      rgba(${wallColor},${opacity * 0.25}) 75%,
      transparent 100%
    )
  `);

  // Add some organic edge variation
  elements.push(`
    radial-gradient(ellipse ${18 * scale}% ${25 * scale}% at ${x - 8 * scale}% ${y - 15 * scale}%,
      rgba(${wallColor},${opacity * 0.4}) 0%,
      rgba(${wallColor},${opacity * 0.15}) 70%,
      transparent 100%
    )
  `);
  elements.push(`
    radial-gradient(ellipse ${20 * scale}% ${20 * scale}% at ${x + 6 * scale}% ${y + 18 * scale}%,
      rgba(${wallColor},${opacity * 0.35}) 0%,
      rgba(${wallColor},${opacity * 0.1}) 70%,
      transparent 100%
    )
  `);

  // Windows as scattered glowing spots with slight randomization
  const windowPositions = [
    { dx: -8, dy: -20 }, { dx: 0, dy: -18 }, { dx: 7, dy: -19 },
    { dx: -9, dy: -8 }, { dx: 1, dy: -6 }, { dx: 8, dy: -7 },
    { dx: -7, dy: 5 }, { dx: 2, dy: 6 }, { dx: 9, dy: 4 },
    { dx: -8, dy: 16 }, { dx: 1, dy: 18 }, { dx: 7, dy: 17 }
  ];

  windowPositions.forEach((pos, i) => {
    // Add slight variation to each window position
    const varX = pos.dx + (Math.sin(i * 2.7) * 1.5);
    const varY = pos.dy + (Math.cos(i * 3.1) * 1.5);
    const winX = x + varX * scale;
    const winY = y + varY * scale;
    const sizeVar = 0.8 + Math.sin(i * 1.9) * 0.3;

    elements.push(`
      radial-gradient(ellipse ${4 * scale * sizeVar}% ${5 * scale * sizeVar}% at ${winX}% ${winY}%,
        rgba(${windowColor},${opacity * 0.55}) 0%,
        rgba(${windowColor},${opacity * 0.25}) 50%,
        transparent 100%
      )
    `);
  });

  return elements.join(', ');
}

// ============================================================================
// Combined Pattern Generation
// ============================================================================

/**
 * Generate all CSS gradient patterns for a given episode configuration
 */
export function generateEpisodePatterns(
  config: EpisodeConfig,
  intensity: number,
  baseOpacity: number,
  animationPhase: number,
  seed: number
): string[] {
  const patterns: string[] = [];

  // Generate simple patterns
  for (const pattern of config.simplePatterns) {
    const colored = config.patternColors.get(pattern) ?? false;
    const patternOpacity = baseOpacity * (0.6 + animationPhase * 0.4);

    switch (pattern) {
      case 'honeycomb':
        patterns.push(createHoneycombPattern(patternOpacity, colored, animationPhase * 5, animationPhase * 3));
        break;
      case 'spiral':
        patterns.push(createSpiralPattern(patternOpacity, colored, animationPhase * 30));
        break;
      case 'tessellation':
        patterns.push(createTessellationPattern(patternOpacity, colored, seed + animationPhase * 10));
        break;
      case 'concentricCircles':
        patterns.push(createConcentricCirclesPattern(patternOpacity, colored, 50, 50, animationPhase * 2));
        break;
      case 'zigzag':
        patterns.push(createZigzagPattern(patternOpacity, colored, seed + animationPhase * 5));
        break;
      case 'grid':
        patterns.push(createGridPattern(patternOpacity, colored, seed));
        break;
      case 'photopsia':
        patterns.push(createPhotopsiaPattern(patternOpacity, colored, seed, Math.floor(3 + intensity * 5)));
        break;
    }
  }

  // Generate complex patterns
  for (let i = 0; i < config.complexPatterns.length; i++) {
    const pattern = config.complexPatterns[i];
    const colored = config.patternColors.get(pattern) ?? false;
    const patternOpacity = baseOpacity * (0.7 + animationPhase * 0.3);

    // Position varies per pattern type
    const posX = 25 + seededRandom(seed + i * 31) * 50;
    const posY = 30 + seededRandom(seed + i * 37) * 40;
    const scale = 0.6 + seededRandom(seed + i * 41) * 0.6;

    switch (pattern) {
      case 'humanSilhouette':
        patterns.push(createHumanSilhouettePattern(patternOpacity, colored, posX, posY, scale));
        break;
      case 'face':
        patterns.push(createFacePattern(patternOpacity, colored, posX, posY, scale));
        break;
      case 'flower':
        patterns.push(createFlowerPattern(patternOpacity, colored, posX, posY, scale));
        break;
      case 'cat':
        patterns.push(createCatPattern(patternOpacity, colored, posX, posY, scale));
        break;
      case 'building':
        patterns.push(createBuildingPattern(patternOpacity, colored, posX, posY, scale));
        break;
    }
  }

  return patterns;
}

/**
 * Generate vision loss area gradient (common overlay for all episodes)
 * Uses overlapping radial gradients for organic edges
 */
export function createVisionLossGradient(intensity: number): string {
  const baseOpacity = 0.1 + intensity * 0.15;
  const edgeOpacity = 0.15 + intensity * 0.2;

  // Multiple overlapping radial gradients for organic edge
  return `
    radial-gradient(ellipse 80% 120% at 110% 50%,
      rgba(30,25,35,${edgeOpacity}) 0%,
      rgba(35,30,40,${baseOpacity}) 40%,
      transparent 70%
    ),
    radial-gradient(ellipse 60% 80% at 105% 30%,
      rgba(35,30,40,${edgeOpacity * 0.7}) 0%,
      rgba(40,35,45,${baseOpacity * 0.5}) 50%,
      transparent 80%
    ),
    radial-gradient(ellipse 50% 90% at 108% 70%,
      rgba(30,25,35,${edgeOpacity * 0.8}) 0%,
      rgba(40,35,45,${baseOpacity * 0.6}) 45%,
      transparent 75%
    )
  `;
}

/**
 * CSS keyframe animations for CBS hallucinations
 */
export const CBS_KEYFRAME_ANIMATIONS = `
  @keyframes cbsEpisodeFade {
    0%, 100% { opacity: 0.4; }
    20% { opacity: 0.7; }
    50% { opacity: 0.5; }
    80% { opacity: 0.75; }
  }
  @keyframes cbsPatternDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(2px, 1px) scale(1.01); }
    50% { transform: translate(-1px, 2px) scale(0.99); }
    75% { transform: translate(1px, -1px) scale(1.005); }
  }
  @keyframes cbsFlashPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    15% { opacity: 0.9; transform: scale(1.03); }
    30% { opacity: 0.3; transform: scale(0.98); }
    50% { opacity: 0.7; transform: scale(1.01); }
    70% { opacity: 0.35; transform: scale(1); }
    85% { opacity: 0.8; transform: scale(1.02); }
  }
  @keyframes cbsComplexFade {
    0%, 100% { opacity: 0.5; transform: translateX(0); }
    25% { opacity: 0.7; transform: translateX(1px); }
    50% { opacity: 0.4; transform: translateX(-0.5px); }
    75% { opacity: 0.6; transform: translateX(0.5px); }
  }
`;
