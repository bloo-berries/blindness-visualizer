import { getColorVisionFilter, getColorVisionMatrix, cleanupAllDOMFilters, isColorVisionCondition } from '../utils/colorVisionFilters';
import { ConditionType } from '../types/visualEffects';

describe('getColorVisionFilter', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test('returns empty string at 0 intensity for protanopia', () => {
    expect(getColorVisionFilter('protanopia' as ConditionType, 0)).toBe('');
  });

  test('returns empty string at 0 intensity for monochromacy', () => {
    expect(getColorVisionFilter('monochromacy' as ConditionType, 0)).toBe('');
  });

  test('returns a DOM filter reference for protanopia at full intensity', () => {
    const filter = getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(filter).toMatch(/url\(".*#cvd-protanopia"\)/);
  });

  test('creates DOM filter element for protanopia', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    const filterEl = document.getElementById('cvd-protanopia');
    expect(filterEl).not.toBeNull();
    const feColorMatrix = filterEl?.querySelector('feColorMatrix');
    expect(feColorMatrix).not.toBeNull();
    expect(feColorMatrix?.getAttribute('type')).toBe('matrix');
  });

  test('returns a DOM filter reference for deuteranopia at full intensity', () => {
    const filter = getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    expect(filter).toMatch(/url\(".*#cvd-deuteranopia"\)/);
  });

  test('returns a DOM filter reference for tritanopia at full intensity', () => {
    const filter = getColorVisionFilter('tritanopia' as ConditionType, 1.0);
    expect(filter).toMatch(/url\(".*#cvd-tritanopia"\)/);
  });

  test('returns CSS saturate filter for monochromacy at full intensity', () => {
    const filter = getColorVisionFilter('monochromacy' as ConditionType, 1.0);
    expect(filter).toContain('saturate(');
    expect(filter).toContain('contrast(');
  });

  test.each([
    'protanomaly', 'deuteranomaly', 'tritanomaly',
  ] as ConditionType[])('%s returns a DOM filter reference at 0.5 intensity', (type) => {
    const filter = getColorVisionFilter(type, 0.5);
    expect(filter).toMatch(new RegExp(`url\\(".*#cvd-${type}"\\)`));
  });

  test('removes DOM filter when intensity goes to 0', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-protanopia')).not.toBeNull();

    getColorVisionFilter('protanopia' as ConditionType, 0);
    expect(document.getElementById('cvd-protanopia')).toBeNull();
  });

  test('sets feColorMatrix values on the DOM element', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    const filterEl = document.getElementById('cvd-protanopia');
    const feColorMatrix = filterEl?.querySelector('feColorMatrix');
    const values = feColorMatrix?.getAttribute('values');
    expect(values).toBeDefined();
    // Should have 20 space-separated numbers (5x4 matrix)
    const nums = values!.split(' ');
    expect(nums).toHaveLength(20);
    // Last row should be alpha passthrough: 0 0 0 1 0
    expect(nums.slice(15)).toEqual(['0', '0', '0', '1', '0']);
  });

  test('monochromatic alias returns saturate/contrast at full intensity', () => {
    const filter = getColorVisionFilter('monochromatic' as ConditionType, 1.0);
    expect(filter).toContain('saturate(');
    expect(filter).toContain('contrast(');
    // Should match the monochromacy output
    const monochromacyFilter = getColorVisionFilter('monochromacy' as ConditionType, 1.0);
    expect(filter).toBe(monochromacyFilter);
  });

  test('defaults to full intensity when no intensity arg provided', () => {
    const filterDefault = getColorVisionFilter('protanopia' as ConditionType);
    cleanupAllDOMFilters();
    const filterExplicit = getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(filterDefault).toBe(filterExplicit);
    expect(filterDefault).toMatch(/url\(".*#cvd-protanopia"\)/);
  });

  test('updates existing DOM element when intensity changes for same condition', () => {
    getColorVisionFilter('protanopia' as ConditionType, 0.5);
    const filterEl1 = document.getElementById('cvd-protanopia');
    const values1 = filterEl1?.querySelector('feColorMatrix')?.getAttribute('values');

    getColorVisionFilter('protanopia' as ConditionType, 0.8);
    const container = document.getElementById('cvd-svg-filters');
    const filters = container?.querySelectorAll('filter');
    expect(filters?.length).toBe(1);

    const filterEl2 = document.getElementById('cvd-protanopia');
    const values2 = filterEl2?.querySelector('feColorMatrix')?.getAttribute('values');
    expect(values2).not.toBe(values1);
  });
});

describe('isColorVisionCondition', () => {
  test('returns true for all CVD types', () => {
    const cvdTypes = [
      'protanopia', 'deuteranopia', 'tritanopia',
      'protanomaly', 'deuteranomaly', 'tritanomaly',
      'monochromatic', 'monochromacy',
    ] as ConditionType[];
    for (const type of cvdTypes) {
      expect(isColorVisionCondition(type)).toBe(true);
    }
  });

  test('returns false for non-CVD types', () => {
    const nonCvdTypes = ['cataracts', 'glaucoma', 'amd', 'unknownType'] as ConditionType[];
    for (const type of nonCvdTypes) {
      expect(isColorVisionCondition(type)).toBe(false);
    }
  });
});

describe('getColorVisionMatrix', () => {
  test('returns identity matrix for unknown condition', () => {
    const matrix = getColorVisionMatrix('unknownCondition' as ConditionType);
    expect(matrix).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
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

  test.each([
    'protanopia', 'deuteranopia', 'tritanopia',
    'protanomaly', 'deuteranomaly', 'tritanomaly',
  ] as ConditionType[])('%s returns a 9-element array', (type) => {
    const matrix = getColorVisionMatrix(type, 1.0);
    expect(matrix).toHaveLength(9);
  });

  test('anomaly interpolation produces intermediate values', () => {
    const at0 = getColorVisionMatrix('protanomaly' as ConditionType, 0.0);
    const at05 = getColorVisionMatrix('protanomaly' as ConditionType, 0.5);
    const at1 = getColorVisionMatrix('protanomaly' as ConditionType, 1.0);
    expect(at05).not.toEqual(at0);
    expect(at05).not.toEqual(at1);
  });
});
