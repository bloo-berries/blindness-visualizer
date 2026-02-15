/**
 * Complex Hallucination Patterns (formed images)
 * More detailed hallucinations often reported in CBS
 */

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
