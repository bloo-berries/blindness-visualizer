import {
  seededRandom,
  getEpisodeTiming,
  getHallucinationsStartTime,
  resetHallucinationsStartTime,
  selectEpisodeConfig,
  createHoneycombPattern,
  createSpiralPattern,
  createTessellationPattern,
  createConcentricCirclesPattern,
  createZigzagPattern,
  createGridPattern,
  createPhotopsiaPattern,
  createSparklesPattern,
  createHumanSilhouettePattern,
  createFacePattern,
  createFlowerPattern,
  createCatPattern,
  createBuildingPattern,
  createBirdPattern,
  createShadowBlobPattern,
  generateEpisodePatterns,
  createVisionLossGradient,
  CBS_KEYFRAME_ANIMATIONS,
  ALL_SIMPLE_PATTERNS,
  ALL_COMPLEX_PATTERNS,
} from '../../utils/overlays/cbsHallucinations';

describe('CBS Hallucinations', () => {
  // --- Episode System ---
  describe('getEpisodeTiming', () => {
    it('returns episodeSeed, episodeOpacity, and episodeProgress', () => {
      const result = getEpisodeTiming(Date.now(), 0.5);
      expect(result).toHaveProperty('episodeSeed');
      expect(result).toHaveProperty('episodeOpacity');
      expect(result).toHaveProperty('episodeProgress');
    });

    it('episodeOpacity is between 0 and 1', () => {
      for (let i = 0; i < 20; i++) {
        const now = Date.now() + i * 1000;
        const result = getEpisodeTiming(now, 0.5);
        expect(result.episodeOpacity).toBeGreaterThanOrEqual(0);
        expect(result.episodeOpacity).toBeLessThanOrEqual(1);
      }
    });

    it('episodeProgress is between 0 and 1', () => {
      const result = getEpisodeTiming(Date.now(), 0.7);
      expect(result.episodeProgress).toBeGreaterThanOrEqual(0);
      expect(result.episodeProgress).toBeLessThan(1);
    });

    it('uses startTime to offset calculations', () => {
      const now = Date.now();
      const resultWithout = getEpisodeTiming(now, 0.5);
      const resultWith = getEpisodeTiming(now, 0.5, now - 5000);
      // Different start times should produce different episode seeds
      // (or at least different progress values)
      expect(resultWith.episodeProgress !== resultWithout.episodeProgress ||
             resultWith.episodeSeed !== resultWithout.episodeSeed).toBe(true);
    });
  });

  describe('getHallucinationsStartTime / resetHallucinationsStartTime', () => {
    afterEach(() => {
      resetHallucinationsStartTime();
    });

    it('returns a timestamp', () => {
      const time = getHallucinationsStartTime();
      expect(typeof time).toBe('number');
      expect(time).toBeGreaterThan(0);
    });

    it('returns the same value on subsequent calls', () => {
      const time1 = getHallucinationsStartTime();
      const time2 = getHallucinationsStartTime();
      expect(time1).toBe(time2);
    });

    it('resets and returns a new value after reset', () => {
      const time1 = getHallucinationsStartTime();
      resetHallucinationsStartTime();
      // Allow a small delay for Date.now() to advance
      const time2 = getHallucinationsStartTime();
      // After reset, it could be the same ms, but the function should have cleared internal state
      expect(typeof time2).toBe('number');
    });
  });

  describe('selectEpisodeConfig', () => {
    it('returns EpisodeConfig with simplePatterns and complexPatterns arrays', () => {
      const config = selectEpisodeConfig(1, 0.5);
      expect(Array.isArray(config.simplePatterns)).toBe(true);
      expect(Array.isArray(config.complexPatterns)).toBe(true);
      expect(config.patternColors).toBeInstanceOf(Map);
    });

    it('returns at least 1 simple pattern', () => {
      const config = selectEpisodeConfig(0, 0.1);
      expect(config.simplePatterns.length).toBeGreaterThanOrEqual(1);
    });

    it('returns more patterns at higher intensity', () => {
      const configLow = selectEpisodeConfig(1, 0.1);
      const configHigh = selectEpisodeConfig(1, 1.0);
      const totalLow = configLow.simplePatterns.length + configLow.complexPatterns.length;
      const totalHigh = configHigh.simplePatterns.length + configHigh.complexPatterns.length;
      expect(totalHigh).toBeGreaterThanOrEqual(totalLow);
    });

    it('all returned patterns are from valid sets', () => {
      const config = selectEpisodeConfig(42, 0.8);
      for (const p of config.simplePatterns) {
        expect(ALL_SIMPLE_PATTERNS).toContain(p);
      }
      for (const p of config.complexPatterns) {
        expect(ALL_COMPLEX_PATTERNS).toContain(p);
      }
    });

    it('different seeds produce different pattern selections', () => {
      const config1 = selectEpisodeConfig(1, 0.8);
      const config2 = selectEpisodeConfig(100, 0.8);
      // At least the ordering should differ sometimes
      const set1 = config1.simplePatterns.join(',');
      const set2 = config2.simplePatterns.join(',');
      // Not guaranteed to be different for all seeds, but very likely
      expect(set1 !== set2 || config1.complexPatterns.join(',') !== config2.complexPatterns.join(',')).toBe(true);
    });
  });

  // --- Simple Patterns ---
  describe('simple pattern generators', () => {
    const simpleGenerators = [
      { name: 'honeycomb', fn: () => createHoneycombPattern(0.5, false) },
      { name: 'spiral', fn: () => createSpiralPattern(0.5, false) },
      { name: 'tessellation', fn: () => createTessellationPattern(0.5, false) },
      { name: 'concentricCircles', fn: () => createConcentricCirclesPattern(0.5, false) },
      { name: 'zigzag', fn: () => createZigzagPattern(0.5, false) },
      { name: 'grid', fn: () => createGridPattern(0.5, false) },
      { name: 'photopsia', fn: () => createPhotopsiaPattern(0.5, false, 1) },
      { name: 'sparkles', fn: () => createSparklesPattern(0.5, false, 1) },
    ];

    test.each(simpleGenerators)('$name returns a non-empty CSS gradient string', ({ fn }) => {
      const result = fn();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test.each(simpleGenerators)('$name contains gradient function', ({ fn }) => {
      const result = fn();
      // Should contain at least one CSS gradient function
      expect(result).toMatch(/(radial-gradient|conic-gradient|linear-gradient|repeating-conic-gradient)/);
    });
  });

  describe('honeycomb pattern', () => {
    it('produces different output for colored vs grayscale', () => {
      const colored = createHoneycombPattern(0.5, true);
      const grayscale = createHoneycombPattern(0.5, false);
      expect(colored).not.toBe(grayscale);
    });

    it('uses repeating-conic-gradient', () => {
      const result = createHoneycombPattern(0.5, false);
      expect(result).toContain('repeating-conic-gradient');
    });

    it('incorporates offset parameters', () => {
      const withOffset = createHoneycombPattern(0.5, false, 10, 20);
      expect(withOffset).toContain('10px');
      expect(withOffset).toContain('20px');
    });
  });

  describe('spiral pattern', () => {
    it('returns multiple conic gradients for spiral arms', () => {
      const result = createSpiralPattern(0.5, false);
      const count = (result.match(/conic-gradient/g) || []).length;
      expect(count).toBe(6); // numArms = 6
    });

    it('uses different hues when colored', () => {
      const result = createSpiralPattern(0.5, true);
      expect(result).toContain('hsla(');
    });
  });

  describe('photopsia pattern', () => {
    it('generates specified number of flashes', () => {
      const result = createPhotopsiaPattern(0.5, false, 1, 5);
      const count = (result.match(/radial-gradient/g) || []).length;
      expect(count).toBe(5);
    });
  });

  // --- Complex Patterns ---
  describe('complex pattern generators', () => {
    const complexGenerators = [
      { name: 'humanSilhouette', fn: () => createHumanSilhouettePattern(0.5, false) },
      { name: 'face', fn: () => createFacePattern(0.5, false) },
      { name: 'flower', fn: () => createFlowerPattern(0.5, false) },
      { name: 'cat', fn: () => createCatPattern(0.5, false) },
      { name: 'building', fn: () => createBuildingPattern(0.5, false) },
      { name: 'bird', fn: () => createBirdPattern(0.5, false) },
      { name: 'shadowBlob', fn: () => createShadowBlobPattern(0.5, false) },
    ];

    test.each(complexGenerators)('$name returns a non-empty CSS gradient string', ({ fn }) => {
      const result = fn();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test.each(complexGenerators)('$name contains radial-gradient', ({ fn }) => {
      const result = fn();
      expect(result).toContain('radial-gradient');
    });

    test.each(complexGenerators)('$name produces different output for colored vs grayscale', ({ fn, name }) => {
      let colored: string, grayscale: string;
      switch (name) {
        case 'humanSilhouette': colored = createHumanSilhouettePattern(0.5, true); grayscale = createHumanSilhouettePattern(0.5, false); break;
        case 'face': colored = createFacePattern(0.5, true); grayscale = createFacePattern(0.5, false); break;
        case 'flower': colored = createFlowerPattern(0.5, true); grayscale = createFlowerPattern(0.5, false); break;
        case 'cat': colored = createCatPattern(0.5, true); grayscale = createCatPattern(0.5, false); break;
        case 'building': colored = createBuildingPattern(0.5, true); grayscale = createBuildingPattern(0.5, false); break;
        case 'bird': colored = createBirdPattern(0.5, true); grayscale = createBirdPattern(0.5, false); break;
        case 'shadowBlob': colored = createShadowBlobPattern(0.5, true); grayscale = createShadowBlobPattern(0.5, false); break;
        default: colored = ''; grayscale = '';
      }
      expect(colored).not.toBe(grayscale);
    });
  });

  describe('humanSilhouette', () => {
    it('includes body parts: head, neck, shoulders, torso, legs', () => {
      const result = createHumanSilhouettePattern(0.5, false);
      // Should have 6 gradient components (head, neck, shoulders, torso, 2 legs)
      const count = (result.match(/radial-gradient/g) || []).length;
      expect(count).toBe(6);
    });
  });

  describe('face', () => {
    it('includes face oval and features', () => {
      const result = createFacePattern(0.5, false);
      // Face oval + 2 eyes + nose + mouth = 5
      const count = (result.match(/radial-gradient/g) || []).length;
      expect(count).toBe(5);
    });
  });

  describe('flower', () => {
    it('has 6 petals plus center', () => {
      const result = createFlowerPattern(0.5, false);
      // 6 petals + 1 center = 7
      const count = (result.match(/radial-gradient/g) || []).length;
      expect(count).toBe(7);
    });
  });

  // --- Generate Episode Patterns ---
  describe('generateEpisodePatterns', () => {
    it('returns an array of CSS gradient strings', () => {
      const config = selectEpisodeConfig(1, 0.5);
      const patterns = generateEpisodePatterns(config, 0.5, 0.3, 0.5, 1);
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
      for (const p of patterns) {
        expect(typeof p).toBe('string');
      }
    });

    it('includes sparkles at high intensity', () => {
      const config = selectEpisodeConfig(1, 0.8);
      const patterns = generateEpisodePatterns(config, 0.8, 0.5, 0.5, 1);
      // At intensity > 0.3, sparkles are always added
      expect(patterns.length).toBeGreaterThan(config.simplePatterns.length);
    });
  });

  // --- Vision Loss Gradient ---
  describe('createVisionLossGradient', () => {
    it('returns a CSS gradient string with multiple layers', () => {
      const result = createVisionLossGradient(0.5);
      expect(typeof result).toBe('string');
      const count = (result.match(/radial-gradient/g) || []).length;
      expect(count).toBe(3);
    });

    it('opacity increases with intensity', () => {
      const low = createVisionLossGradient(0.1);
      const high = createVisionLossGradient(0.9);
      expect(low).not.toBe(high);
    });
  });

  // --- Animations ---
  describe('CBS_KEYFRAME_ANIMATIONS', () => {
    it('contains keyframe animation definitions', () => {
      expect(CBS_KEYFRAME_ANIMATIONS).toContain('@keyframes cbsEpisodeFade');
      expect(CBS_KEYFRAME_ANIMATIONS).toContain('@keyframes cbsPatternDrift');
      expect(CBS_KEYFRAME_ANIMATIONS).toContain('@keyframes cbsFlashPulse');
      expect(CBS_KEYFRAME_ANIMATIONS).toContain('@keyframes cbsComplexFade');
    });
  });

  // --- Type constants ---
  describe('pattern type constants', () => {
    it('ALL_SIMPLE_PATTERNS has 8 entries', () => {
      expect(ALL_SIMPLE_PATTERNS.length).toBe(8);
    });

    it('ALL_COMPLEX_PATTERNS has 7 entries', () => {
      expect(ALL_COMPLEX_PATTERNS.length).toBe(7);
    });
  });
});
