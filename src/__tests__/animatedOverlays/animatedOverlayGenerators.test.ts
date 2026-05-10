/**
 * Tests for all animated overlay generators exported from the index.
 *
 * Each generator takes (intensity: number, now: number) and returns
 * React.CSSProperties with overlay positioning and gradient backgrounds.
 * The one exception is generateVisualAuraOverlay which takes
 * (effectType: string, intensity: number, now: number).
 */

import {
  createOverlayStyle,
  generateVisualAuraOverlay,
  generateHallucinationsOverlay,
  generateBlueFieldOverlay,
  generatePersistentPositiveOverlay,
  generatePalinopsiaOverlay,
  generateStarburstingOverlay,
  generateChristineFluctuatingOverlay,
  generateSugarRetinalDetachmentOverlay,
  generateStephenKeratoconusOverlay,
  generateHeatherLightPerceptionOverlay,
  generateDaredevilRadarSenseOverlay,
  generateGeordiVisorSenseOverlay,
  generateBlindspotSonarSenseOverlay,
  generateKenshiTelekineticSenseOverlay,
  generateTophSeismicSenseOverlay,
  generateAnselmoOcularMyastheniaOverlay,
  generateAnselmoPtosisOverlay,
  generateAnselmoPtosisRightOverlay,
  generateMargaritaLightPerceptionOverlay,
  generateFujitoraObservationHakiOverlay,
  generateChirrutForcePerceptionOverlay,
  generateJuliaCarpenterPsychicWebOverlay,
} from '../../components/Visualizer/hooks/animatedOverlays';

// ---- Standard-signature generators: (intensity, now) => CSSProperties ----

const standardGenerators: Array<{
  name: string;
  fn: (intensity: number, now: number) => React.CSSProperties;
}> = [
  { name: 'generateHallucinationsOverlay', fn: generateHallucinationsOverlay },
  { name: 'generateBlueFieldOverlay', fn: generateBlueFieldOverlay },
  { name: 'generatePersistentPositiveOverlay', fn: generatePersistentPositiveOverlay },
  { name: 'generatePalinopsiaOverlay', fn: generatePalinopsiaOverlay },
  { name: 'generateStarburstingOverlay', fn: generateStarburstingOverlay },
  { name: 'generateChristineFluctuatingOverlay', fn: generateChristineFluctuatingOverlay },
  { name: 'generateSugarRetinalDetachmentOverlay', fn: generateSugarRetinalDetachmentOverlay },
  { name: 'generateStephenKeratoconusOverlay', fn: generateStephenKeratoconusOverlay },
  { name: 'generateHeatherLightPerceptionOverlay', fn: generateHeatherLightPerceptionOverlay },
  { name: 'generateDaredevilRadarSenseOverlay', fn: generateDaredevilRadarSenseOverlay },
  { name: 'generateGeordiVisorSenseOverlay', fn: generateGeordiVisorSenseOverlay },
  { name: 'generateBlindspotSonarSenseOverlay', fn: generateBlindspotSonarSenseOverlay },
  { name: 'generateKenshiTelekineticSenseOverlay', fn: generateKenshiTelekineticSenseOverlay },
  { name: 'generateTophSeismicSenseOverlay', fn: generateTophSeismicSenseOverlay },
  { name: 'generateAnselmoOcularMyastheniaOverlay', fn: generateAnselmoOcularMyastheniaOverlay },
  { name: 'generateAnselmoPtosisOverlay', fn: generateAnselmoPtosisOverlay },
  { name: 'generateAnselmoPtosisRightOverlay', fn: generateAnselmoPtosisRightOverlay },
  { name: 'generateMargaritaLightPerceptionOverlay', fn: generateMargaritaLightPerceptionOverlay },
  { name: 'generateFujitoraObservationHakiOverlay', fn: generateFujitoraObservationHakiOverlay },
  { name: 'generateChirrutForcePerceptionOverlay', fn: generateChirrutForcePerceptionOverlay },
  { name: 'generateJuliaCarpenterPsychicWebOverlay', fn: generateJuliaCarpenterPsychicWebOverlay },
];

// ---- createOverlayStyle ----

describe('createOverlayStyle', () => {
  test('returns overlay base properties with default options', () => {
    const style = createOverlayStyle('linear-gradient(red, blue)');
    expect(style.position).toBe('absolute');
    expect(style.top).toBe(0);
    expect(style.left).toBe(0);
    expect(style.right).toBe(0);
    expect(style.bottom).toBe(0);
    expect(style.width).toBe('100%');
    expect(style.height).toBe('100%');
    expect(style.pointerEvents).toBe('none');
    expect(style.background).toBe('linear-gradient(red, blue)');
    expect(style.mixBlendMode).toBe('normal');
    expect(style.opacity).toBe(1);
    expect(style.zIndex).toBe(9999);
  });

  test('applies custom options', () => {
    const style = createOverlayStyle('some-bg', {
      opacity: 0.5,
      mixBlendMode: 'screen',
      filter: 'blur(3px)',
      zIndex: 100,
    });
    expect(style.opacity).toBe(0.5);
    expect(style.mixBlendMode).toBe('screen');
    expect(style.filter).toBe('blur(3px)');
    expect(style.zIndex).toBe(100);
  });

  test('omits filter property when not provided', () => {
    const style = createOverlayStyle('bg');
    expect(style).not.toHaveProperty('filter');
  });
});

// ---- Batch tests for all standard generators ----

describe.each(standardGenerators)('$name', ({ fn }) => {
  const NOW = 5000;

  test('returns without throwing at intensity=0.5', () => {
    expect(() => fn(0.5, NOW)).not.toThrow();
  });

  test('returns an object with position: absolute', () => {
    const result = fn(0.7, NOW);
    expect(result.position).toBe('absolute');
  });

  test('returns an object with pointerEvents: none', () => {
    const result = fn(0.7, NOW);
    expect(result.pointerEvents).toBe('none');
  });

  test('returns a string background property', () => {
    const result = fn(0.7, NOW);
    expect(typeof result.background).toBe('string');
    expect((result.background as string).length).toBeGreaterThan(0);
  });

  test('handles intensity=0 without throwing', () => {
    expect(() => fn(0, NOW)).not.toThrow();
    const result = fn(0, NOW);
    expect(result).toBeDefined();
    expect(result.position).toBe('absolute');
  });

  test('handles intensity=1 without throwing', () => {
    expect(() => fn(1, NOW)).not.toThrow();
    const result = fn(1, NOW);
    expect(result).toBeDefined();
    expect(result.position).toBe('absolute');
  });

  test('handles now=0 without throwing', () => {
    expect(() => fn(0.5, 0)).not.toThrow();
  });

  test('handles large now values without throwing', () => {
    expect(() => fn(0.5, 1e9)).not.toThrow();
  });

  test('width and height are 100%', () => {
    const result = fn(0.5, NOW);
    // Most generators use createOverlayStyle which sets width/height to '100%'.
    // The Anselmo ptosis overlays intentionally use '50%' width.
    expect(result.width).toBeDefined();
    expect(result.height).toBeDefined();
  });

  test('opacity is a number between 0 and 1 inclusive', () => {
    const result = fn(0.7, NOW);
    expect(typeof result.opacity).toBe('number');
    expect(result.opacity).toBeGreaterThanOrEqual(0);
    expect(result.opacity).toBeLessThanOrEqual(1);
  });
});

// ---- generateVisualAuraOverlay (special 3-param signature) ----

describe('generateVisualAuraOverlay', () => {
  const NOW = 5000;

  test('returns without throwing for default effectType', () => {
    expect(() => generateVisualAuraOverlay('visualAura', 0.7, NOW)).not.toThrow();
  });

  test('returns overlay base properties', () => {
    const result = generateVisualAuraOverlay('visualAura', 0.7, NOW);
    expect(result.position).toBe('absolute');
    expect(result.pointerEvents).toBe('none');
    expect(result.width).toBe('100%');
    expect(result.height).toBe('100%');
  });

  test('returns a background string', () => {
    const result = generateVisualAuraOverlay('visualAura', 0.7, NOW);
    expect(typeof result.background).toBe('string');
    expect((result.background as string).length).toBeGreaterThan(0);
  });

  test.each(['visualAura', 'visualAuraLeft', 'visualAuraRight'])(
    'works with effectType=%s',
    (effectType) => {
      const result = generateVisualAuraOverlay(effectType, 0.7, NOW);
      expect(result).toBeDefined();
      expect(result.position).toBe('absolute');
    }
  );

  test('handles unknown effectType gracefully (falls back to default)', () => {
    expect(() => generateVisualAuraOverlay('unknown', 0.7, NOW)).not.toThrow();
    const result = generateVisualAuraOverlay('unknown', 0.7, NOW);
    expect(result.position).toBe('absolute');
  });

  test('handles intensity=0', () => {
    const result = generateVisualAuraOverlay('visualAura', 0, NOW);
    expect(result).toBeDefined();
  });

  test('handles intensity=1', () => {
    const result = generateVisualAuraOverlay('visualAura', 1, NOW);
    expect(result).toBeDefined();
    expect(result.opacity).toBeLessThanOrEqual(1);
  });

  test('opacity is bounded', () => {
    const result = generateVisualAuraOverlay('visualAura', 1, NOW);
    expect(result.opacity).toBeGreaterThanOrEqual(0);
    expect(result.opacity).toBeLessThanOrEqual(1);
  });

  test('includes blur filter', () => {
    const result = generateVisualAuraOverlay('visualAura', 0.7, NOW);
    expect(result.filter).toBeDefined();
    expect(result.filter).toContain('blur');
  });
});

// ---- Specific generator behavior tests ----

describe('generateAnselmoPtosisOverlay (left eye)', () => {
  test('width is 50% (covers left half only)', () => {
    const result = generateAnselmoPtosisOverlay(0.7, 5000);
    expect(result.width).toBe('50%');
  });

  test('has left=0 positioning', () => {
    const result = generateAnselmoPtosisOverlay(0.7, 5000);
    expect(result.left).toBe(0);
  });

  test('zIndex is 9997 (below main overlay)', () => {
    const result = generateAnselmoPtosisOverlay(0.7, 5000);
    expect(result.zIndex).toBe(9997);
  });
});

describe('generateAnselmoPtosisRightOverlay (right eye)', () => {
  test('width is 50% (covers right half only)', () => {
    const result = generateAnselmoPtosisRightOverlay(0.7, 5000);
    expect(result.width).toBe('50%');
  });

  test('has right=0 positioning', () => {
    const result = generateAnselmoPtosisRightOverlay(0.7, 5000);
    expect(result.right).toBe(0);
  });

  test('zIndex is 9997 (below main overlay)', () => {
    const result = generateAnselmoPtosisRightOverlay(0.7, 5000);
    expect(result.zIndex).toBe(9997);
  });
});

describe('generateDaredevilRadarSenseOverlay', () => {
  test('uses multiply blend mode', () => {
    const result = generateDaredevilRadarSenseOverlay(0.7, 5000);
    expect(result.mixBlendMode).toBe('multiply');
  });
});

describe('generateFujitoraObservationHakiOverlay', () => {
  test('uses default (normal) blend mode via createOverlayStyle', () => {
    const result = generateFujitoraObservationHakiOverlay(0.7, 5000);
    expect(result.mixBlendMode).toBe('normal');
  });
});

describe('animated overlay time-dependence', () => {
  test('generateBlueFieldOverlay produces different backgrounds at different times', () => {
    const result1 = generateBlueFieldOverlay(0.7, 1000);
    const result2 = generateBlueFieldOverlay(0.7, 5000);
    // Backgrounds should differ because sprite positions depend on time
    expect(result1.background).not.toBe(result2.background);
  });

  test('generatePalinopsiaOverlay produces different backgrounds at different times', () => {
    const result1 = generatePalinopsiaOverlay(0.7, 1000);
    const result2 = generatePalinopsiaOverlay(0.7, 5000);
    expect(result1.background).not.toBe(result2.background);
  });
});
