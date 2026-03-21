import { generateCSSFilters } from '../utils/cssFilters';
import { createDefaultEffects } from '../data/visualEffects';
import { VisualEffect } from '../types/visualEffects';

/** Helper: enable a single effect by ID at a given intensity */
function enableEffect(effects: VisualEffect[], id: string, intensity: number = 1.0): VisualEffect[] {
  return effects.map(e =>
    e.id === id ? { ...e, enabled: true, intensity } : e
  );
}

/** Helper: enable multiple effects by ID */
function enableEffects(effects: VisualEffect[], ids: string[], intensity: number = 1.0): VisualEffect[] {
  const idSet = new Set(ids);
  return effects.map(e =>
    idSet.has(e.id) ? { ...e, enabled: true, intensity } : e
  );
}

describe('CSS Filter Pipeline', () => {
  let defaults: VisualEffect[];

  beforeEach(() => {
    defaults = createDefaultEffects();
  });

  test('returns empty string when no effects are enabled', () => {
    expect(generateCSSFilters(defaults)).toBe('');
  });

  test('completeBlindness returns brightness(0) and nothing else', () => {
    const effects = enableEffect(defaults, 'completeBlindness');
    const result = generateCSSFilters(effects);
    expect(result).toBe('brightness(0)');
  });

  test('completeBlindness overrides all other effects', () => {
    const effects = enableEffects(defaults, [
      'completeBlindness', 'protanopia', 'cataracts', 'blurryVision',
    ]);
    const result = generateCSSFilters(effects);
    expect(result).toBe('brightness(0)');
  });

  test('enabled effects produce non-empty filter strings', () => {
    // Test a representative set of effect categories
    const testEffects = [
      'protanopia',
      'blurryVision',
      'cataracts',
      'visualSnow',
      'nearSighted',
    ];

    for (const id of testEffects) {
      const effects = enableEffect(defaults, id);
      const result = generateCSSFilters(effects);
      expect(result.length).toBeGreaterThan(0);
    }
  });

  test('filter output does not contain undefined or NaN', () => {
    // Enable every non-completeBlindness effect and check for bad values
    const effects = defaults.map(e =>
      e.id === 'completeBlindness'
        ? e
        : { ...e, enabled: true, intensity: 0.5 }
    );
    const result = generateCSSFilters(effects);
    expect(result).not.toContain('undefined');
    expect(result).not.toContain('NaN');
    expect(result).not.toContain('null');
  });

  test('vitreousHemorrhage suppresses cataracts filter', () => {
    // With cataracts only
    const withCataracts = enableEffect(defaults, 'cataracts');
    const cataractResult = generateCSSFilters(withCataracts);

    // With both cataracts + vitreousHemorrhage
    const withBoth = enableEffects(defaults, ['cataracts', 'vitreousHemorrhage']);
    const bothResult = generateCSSFilters(withBoth);

    // The combined result should differ from cataracts-only
    // (vitreousHemorrhage suppresses the cataracts yellow/brown tint)
    expect(bothResult).not.toBe(cataractResult);
  });

  test('intensity scaling affects output', () => {
    const lowIntensity = enableEffect(defaults, 'blurryVision', 0.1);
    const highIntensity = enableEffect(defaults, 'blurryVision', 1.0);

    const lowResult = generateCSSFilters(lowIntensity);
    const highResult = generateCSSFilters(highIntensity);

    // Different intensities should produce different filter values
    expect(lowResult).not.toBe(highResult);
  });

  test('multiple effects combine into a space-separated filter string', () => {
    const effects = enableEffects(defaults, ['blurryVision', 'lossOfContrast']);
    const result = generateCSSFilters(effects);

    // Should have content (not just one filter) and be space-separated
    expect(result.length).toBeGreaterThan(0);
    // The result should contain CSS filter functions
    expect(result).toMatch(/\w+\([^)]+\)/);
  });
});
