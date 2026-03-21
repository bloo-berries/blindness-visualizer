import { getColorVisionFilter, getColorVisionMatrix } from '../utils/colorVisionFilters';
import { ConditionType } from '../types/visualEffects';

describe('getColorVisionFilter', () => {
  test('returns empty string at 0 intensity for protanopia', () => {
    expect(getColorVisionFilter('protanopia' as ConditionType, 0)).toBe('');
  });

  test('returns empty string at 0 intensity for monochromacy', () => {
    expect(getColorVisionFilter('monochromacy' as ConditionType, 0)).toBe('');
  });

  test('returns a valid data URI for protanopia at full intensity', () => {
    const filter = getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(filter).toContain('url("data:image/svg+xml,');
    expect(filter).toContain('feColorMatrix');
    expect(filter).toContain('#f")');
  });

  test('returns a valid data URI for deuteranopia at full intensity', () => {
    const filter = getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    expect(filter).toContain('url("data:image/svg+xml,');
  });

  test('returns a valid data URI for tritanopia at full intensity', () => {
    const filter = getColorVisionFilter('tritanopia' as ConditionType, 1.0);
    expect(filter).toContain('url("data:image/svg+xml,');
  });

  test('returns CSS saturate filter for monochromacy at full intensity', () => {
    const filter = getColorVisionFilter('monochromacy' as ConditionType, 1.0);
    expect(filter).toContain('saturate(');
    expect(filter).toContain('contrast(');
  });

  test('returns a valid data URI for anomaly types', () => {
    const types = ['protanomaly', 'deuteranomaly', 'tritanomaly'] as ConditionType[];
    for (const type of types) {
      const filter = getColorVisionFilter(type, 0.5);
      expect(filter).toContain('url("data:image/svg+xml,');
    }
  });
});

describe('getColorVisionMatrix', () => {
  test('returns identity matrix for unknown condition', () => {
    const matrix = getColorVisionMatrix('unknownCondition' as ConditionType);
    expect(matrix).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  test('returns a 9-element array for protanopia', () => {
    const matrix = getColorVisionMatrix('protanopia' as ConditionType);
    expect(matrix).toHaveLength(9);
  });

  test('protanopia matrix differs from identity', () => {
    const matrix = getColorVisionMatrix('protanopia' as ConditionType, 1.0);
    const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    expect(matrix).not.toEqual(identity);
  });

  test('deuteranopia matrix has expected first element', () => {
    const matrix = getColorVisionMatrix('deuteranopia' as ConditionType, 1.0);
    expect(matrix[0]).toBeCloseTo(0.367322, 4);
  });
});
