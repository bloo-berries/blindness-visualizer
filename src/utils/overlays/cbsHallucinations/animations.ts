/**
 * Combined Pattern Generation and Animations for CBS Hallucinations
 */

import { seededRandom } from '../sharedOverlayUtils';
import { EpisodeConfig } from './types';
import {
  createHoneycombPattern,
  createSpiralPattern,
  createTessellationPattern,
  createConcentricCirclesPattern,
  createZigzagPattern,
  createGridPattern,
  createPhotopsiaPattern,
  createSparklesPattern
} from './simplePatterns';
import {
  createHumanSilhouettePattern,
  createFacePattern,
  createFlowerPattern,
  createCatPattern,
  createBuildingPattern,
  createBirdPattern,
  createShadowBlobPattern
} from './complexPatterns';

/**
 * Generate all CSS gradient patterns for a given episode configuration
 * Enhanced with more sporadic, randomized positioning and timing
 */
export function generateEpisodePatterns(
  config: EpisodeConfig,
  intensity: number,
  baseOpacity: number,
  animationPhase: number,
  seed: number
): string[] {
  const patterns: string[] = [];

  // Generate simple patterns with sporadic positioning
  for (let idx = 0; idx < config.simplePatterns.length; idx++) {
    const pattern = config.simplePatterns[idx];
    const colored = config.patternColors.get(pattern) ?? false;

    // Sporadic opacity variation - patterns fade in/out unpredictably (slowed down)
    const sporadicPhase = Math.sin(animationPhase * 1.5 + seededRandom(seed + idx * 7) * 10);
    const patternOpacity = baseOpacity * (0.4 + Math.abs(sporadicPhase) * 0.6);

    // Randomized center positions for non-linear placement
    const offsetX = (seededRandom(seed + idx * 13) - 0.5) * 40;
    const offsetY = (seededRandom(seed + idx * 17) - 0.5) * 30;
    const centerX = 50 + offsetX + Math.sin(animationPhase * 0.9 + idx) * 5;
    const centerY = 50 + offsetY + Math.cos(animationPhase * 0.7 + idx * 0.7) * 4;

    switch (pattern) {
      case 'honeycomb':
        patterns.push(createHoneycombPattern(patternOpacity, colored, animationPhase * 3 + offsetX, animationPhase * 2 + offsetY));
        break;
      case 'spiral':
        patterns.push(createSpiralPattern(patternOpacity, colored, animationPhase * 18, centerX, centerY));
        break;
      case 'tessellation':
        patterns.push(createTessellationPattern(patternOpacity, colored, seed + animationPhase * 6 + idx * 100));
        break;
      case 'concentricCircles':
        patterns.push(createConcentricCirclesPattern(patternOpacity, colored, centerX, centerY, animationPhase * 1.2));
        break;
      case 'zigzag':
        patterns.push(createZigzagPattern(patternOpacity, colored, seed + animationPhase * 3 + idx * 50));
        break;
      case 'grid':
        patterns.push(createGridPattern(patternOpacity, colored, seed + idx * 200));
        break;
      case 'photopsia':
        patterns.push(createPhotopsiaPattern(patternOpacity, colored, seed + animationPhase * 60, Math.floor(3 + intensity * 5)));
        break;
      case 'sparkles':
        patterns.push(createSparklesPattern(patternOpacity, colored, seed + idx * 300, animationPhase));
        break;
    }
  }

  // Generate complex patterns with highly randomized positions
  for (let i = 0; i < config.complexPatterns.length; i++) {
    const pattern = config.complexPatterns[i];
    const colored = config.patternColors.get(pattern) ?? false;

    // Sporadic visibility - complex patterns appear/disappear unpredictably (slowed down)
    const visibilityPhase = Math.sin(animationPhase * 1.1 + seededRandom(seed + i * 43) * 8);
    const isVisible = visibilityPhase > -0.5 || pattern === 'shadowBlob'; // Shadow blobs always somewhat visible
    if (!isVisible) continue;

    const patternOpacity = baseOpacity * (0.5 + Math.abs(visibilityPhase) * 0.5);

    // Highly randomized positions - spread across entire field
    const posX = 10 + seededRandom(seed + i * 31 + animationPhase * 0.3) * 80;
    const posY = 15 + seededRandom(seed + i * 37 + animationPhase * 0.2) * 70;

    // Variable scale with more variation
    const scale = 0.4 + seededRandom(seed + i * 41) * 0.8;

    // Add slight drift to positions for sporadic movement (slowed down)
    const driftX = Math.sin(animationPhase * 0.5 + i * 2.1) * 3;
    const driftY = Math.cos(animationPhase * 0.4 + i * 1.7) * 2;
    const finalX = posX + driftX;
    const finalY = posY + driftY;

    switch (pattern) {
      case 'humanSilhouette':
        patterns.push(createHumanSilhouettePattern(patternOpacity, colored, finalX, finalY, scale));
        break;
      case 'face':
        patterns.push(createFacePattern(patternOpacity, colored, finalX, finalY, scale));
        break;
      case 'flower':
        patterns.push(createFlowerPattern(patternOpacity, colored, finalX, finalY, scale));
        break;
      case 'cat':
        patterns.push(createCatPattern(patternOpacity, colored, finalX, finalY, scale));
        break;
      case 'building':
        patterns.push(createBuildingPattern(patternOpacity, colored, finalX, finalY, scale));
        break;
      case 'bird':
        // Birds tend to appear in upper portion of vision, moving across (slowed down)
        const birdX = 15 + seededRandom(seed + i * 47) * 70 + animationPhase * 8;
        const birdY = 15 + seededRandom(seed + i * 53) * 35;
        patterns.push(createBirdPattern(patternOpacity * 1.2, colored, birdX, birdY, scale * 0.8, seed + i * 59));
        break;
      case 'shadowBlob':
        // Shadow blobs appear more in peripheral vision
        const blobX = seededRandom(seed + i * 61) > 0.5 ? 75 + seededRandom(seed + i * 67) * 20 : 5 + seededRandom(seed + i * 67) * 20;
        const blobY = 20 + seededRandom(seed + i * 71) * 60;
        patterns.push(createShadowBlobPattern(patternOpacity * 1.3, colored, blobX, blobY, scale, seed + i * 73));
        break;
    }
  }

  // Add random sporadic sparkles overlay (always present at some level)
  if (intensity > 0.3) {
    const sparkleOpacity = baseOpacity * 0.4 * intensity;
    patterns.push(createSparklesPattern(sparkleOpacity, true, seed + 999, animationPhase));
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
