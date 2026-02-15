/**
 * Episode System for CBS Hallucinations
 * Handles timing, opacity, and pattern selection for episodic hallucinations
 */

import { seededRandom } from '../sharedOverlayUtils';
import {
  EpisodeConfig,
  SimplePatternType,
  ComplexPatternType,
  ALL_SIMPLE_PATTERNS,
  ALL_COMPLEX_PATTERNS
} from './types';

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
