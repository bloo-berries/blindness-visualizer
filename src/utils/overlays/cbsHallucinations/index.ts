/**
 * Charles Bonnet Syndrome (CBS) Hallucination Pattern Utilities
 *
 * Shared pattern generators for both the main visualizer and preview panel.
 * CBS hallucinations occur in episodic manner - different patterns appear and
 * disappear over time, which this system simulates.
 */

// Re-export seededRandom for backwards compatibility
export { seededRandom } from '../sharedOverlayUtils';

// Export types
export type { EpisodeConfig, SimplePatternType, ComplexPatternType } from './types';
export { ALL_SIMPLE_PATTERNS, ALL_COMPLEX_PATTERNS } from './types';

// Export episode system
export {
  getEpisodeTiming,
  getHallucinationsStartTime,
  resetHallucinationsStartTime,
  selectEpisodeConfig
} from './episodeSystem';

// Export simple patterns
export {
  createHoneycombPattern,
  createSpiralPattern,
  createTessellationPattern,
  createConcentricCirclesPattern,
  createZigzagPattern,
  createGridPattern,
  createPhotopsiaPattern
} from './simplePatterns';

// Export complex patterns
export {
  createHumanSilhouettePattern,
  createFacePattern,
  createFlowerPattern,
  createCatPattern,
  createBuildingPattern
} from './complexPatterns';

// Export animations and combined generation
export {
  generateEpisodePatterns,
  createVisionLossGradient,
  CBS_KEYFRAME_ANIMATIONS
} from './animations';
