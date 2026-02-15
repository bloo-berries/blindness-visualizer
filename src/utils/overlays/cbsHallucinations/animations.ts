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
  createPhotopsiaPattern
} from './simplePatterns';
import {
  createHumanSilhouettePattern,
  createFacePattern,
  createFlowerPattern,
  createCatPattern,
  createBuildingPattern
} from './complexPatterns';

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
