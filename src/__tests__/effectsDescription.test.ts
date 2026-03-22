import { generateEffectsDescription } from '../utils/effectsDescription';
import { VisualEffect, InputSource } from '../types/visualEffects';

const makeEffect = (
  overrides: Partial<VisualEffect> & { id: any }
): VisualEffect => ({
  name: 'Test Effect',
  enabled: false,
  intensity: 0.75,
  description: 'Test description',
  ...overrides,
});

describe('generateEffectsDescription', () => {
  const youtubeSource: InputSource = { type: 'youtube' };
  const imageSource: InputSource = { type: 'image', url: 'test.jpg' };

  test('returns description with no conditions when no effects are enabled', () => {
    const effects = [makeEffect({ id: 'protanopia', enabled: false })];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('no vision conditions applied');
    expect(result).toContain('youtube');
  });

  test('includes input source type in description', () => {
    const result = generateEffectsDescription([], imageSource);
    expect(result).toContain('image');
  });

  test('describes a single enabled effect with name and intensity', () => {
    const effects = [
      makeEffect({ id: 'protanopia', name: 'Protanopia', enabled: true, intensity: 0.75 }),
    ];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('Protanopia');
    expect(result).toContain('75%');
    expect(result).toContain('intensity');
  });

  test('describes multiple enabled effects', () => {
    const effects = [
      makeEffect({ id: 'protanopia', name: 'Protanopia', enabled: true, intensity: 0.5 }),
      makeEffect({ id: 'deuteranopia', name: 'Deuteranopia', enabled: false, intensity: 1.0 }),
      makeEffect({ id: 'tritanopia', name: 'Tritanopia', enabled: true, intensity: 1.0 }),
    ];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('Protanopia');
    expect(result).toContain('50%');
    expect(result).toContain('Tritanopia');
    expect(result).toContain('100%');
    expect(result).not.toContain('Deuteranopia'); // disabled
  });

  test('rounds intensity to whole percentage', () => {
    const effects = [
      makeEffect({ id: 'protanopia', name: 'Protanopia', enabled: true, intensity: 0.333 }),
    ];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('33%');
  });

  test('handles zero intensity', () => {
    const effects = [
      makeEffect({ id: 'protanopia', name: 'Protanopia', enabled: true, intensity: 0 }),
    ];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('0%');
  });

  test('handles all effects disabled', () => {
    const effects = [
      makeEffect({ id: 'protanopia', enabled: false }),
      makeEffect({ id: 'deuteranopia', enabled: false }),
    ];
    const result = generateEffectsDescription(effects, youtubeSource);
    expect(result).toContain('no vision conditions applied');
  });

  test('returns valid description for empty effects array', () => {
    const result = generateEffectsDescription([], youtubeSource);
    expect(result).toContain('no vision conditions applied');
  });
});
