/**
 * Cross-browser regression tests for color vision filters.
 *
 * These tests guard against reintroduction of Safari-incompatible patterns
 * (data URI SVG filters) and verify the DOM-injection approach works correctly.
 *
 * Background: Safari/WebKit does NOT support filter: url("data:image/svg+xml,...")
 * (WebKit Bug #104169, open since 2012). The fix injects <filter> elements into
 * the DOM and references them via url("#id").
 */
import { getColorVisionFilter, getColorVisionMatrix, cleanupAllDOMFilters } from '../utils/colorVisionFilters';
import { ConditionType } from '../types/visualEffects';

const SVG_FILTER_CONDITIONS: ConditionType[] = [
  'protanopia' as ConditionType,
  'deuteranopia' as ConditionType,
  'tritanopia' as ConditionType,
  'protanomaly' as ConditionType,
  'deuteranomaly' as ConditionType,
  'tritanomaly' as ConditionType,
];

describe('Cross-browser compatibility: no data URIs', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test.each(SVG_FILTER_CONDITIONS)(
    '%s filter output never contains data:image/svg+xml',
    (type) => {
      for (const intensity of [0.25, 0.5, 0.75, 1.0]) {
        const filter = getColorVisionFilter(type, intensity);
        expect(filter).not.toContain('data:image/svg+xml');
        cleanupAllDOMFilters();
      }
    }
  );

  test.each(SVG_FILTER_CONDITIONS)(
    '%s filter output is a local url("#cvd-...") reference',
    (type) => {
      const filter = getColorVisionFilter(type, 1.0);
      expect(filter).toMatch(/^url\("#cvd-[a-z]+"\)$/);
    }
  );
});

describe('DOM injection creates valid SVG structure', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test('SVG container element exists after applying a filter', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    const container = document.getElementById('cvd-svg-filters');
    expect(container).not.toBeNull();
    expect(container?.tagName.toLowerCase()).toBe('svg');
  });

  test.each(SVG_FILTER_CONDITIONS)(
    '%s: filter element has correct id and structure',
    (type) => {
      getColorVisionFilter(type, 1.0);
      const filterId = `cvd-${type}`;
      const filterEl = document.getElementById(filterId);

      expect(filterEl).not.toBeNull();
      expect(filterEl?.getAttribute('color-interpolation-filters')).toBe('linearRGB');

      const feColorMatrix = filterEl?.querySelector('feColorMatrix');
      expect(feColorMatrix).not.toBeNull();
      expect(feColorMatrix?.getAttribute('type')).toBe('matrix');
    }
  );

  test('feColorMatrix values contain 20 space-separated numbers', () => {
    getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    const filterEl = document.getElementById('cvd-deuteranopia');
    const feColorMatrix = filterEl?.querySelector('feColorMatrix');
    const values = feColorMatrix?.getAttribute('values') ?? '';
    const nums = values.split(' ');
    expect(nums).toHaveLength(20);
    // All values should be parseable as numbers
    for (const n of nums) {
      expect(Number.isNaN(parseFloat(n))).toBe(false);
    }
  });

  test('does not create duplicate SVG containers on repeated calls', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    cleanupAllDOMFilters();
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    getColorVisionFilter('protanopia' as ConditionType, 0.8);
    const containers = document.querySelectorAll('#cvd-svg-filters');
    expect(containers).toHaveLength(1);
  });
});

describe('Matrix values correctness', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test('alpha row is always 0 0 0 1 0', () => {
    for (const type of SVG_FILTER_CONDITIONS) {
      getColorVisionFilter(type, 1.0);
      const filterEl = document.getElementById(`cvd-${type}`);
      const values = filterEl?.querySelector('feColorMatrix')?.getAttribute('values') ?? '';
      const nums = values.split(' ').map(Number);
      // Last row (indices 15-19) = alpha passthrough
      expect(nums[15]).toBe(0);
      expect(nums[16]).toBe(0);
      expect(nums[17]).toBe(0);
      expect(nums[18]).toBe(1);
      expect(nums[19]).toBe(0);
      cleanupAllDOMFilters();
    }
  });

  test('protanopia at full intensity matches Machado matrix', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    const filterEl = document.getElementById('cvd-protanopia');
    const values = filterEl?.querySelector('feColorMatrix')?.getAttribute('values') ?? '';
    const nums = values.split(' ').map(Number);

    // Known Machado 2009 protanopia matrix (first row)
    expect(nums[0]).toBeCloseTo(0.152286, 4);
    expect(nums[1]).toBeCloseTo(1.052583, 4);
    expect(nums[2]).toBeCloseTo(-0.204868, 4);
  });

  test('50% intensity values are blended with identity', () => {
    getColorVisionFilter('protanopia' as ConditionType, 0.5);
    const filterEl = document.getElementById('cvd-protanopia');
    const values = filterEl?.querySelector('feColorMatrix')?.getAttribute('values') ?? '';
    const nums = values.split(' ').map(Number);

    // At 50%, first element = 0.152286 * 0.5 + 1.0 * 0.5 = 0.576143
    expect(nums[0]).toBeCloseTo(0.576143, 4);
    // Second element = 1.052583 * 0.5 + 0.0 * 0.5 = 0.526292
    expect(nums[1]).toBeCloseTo(0.526292, 3);
  });
});

describe('Cleanup behavior', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test('intensity 0 removes the DOM filter element', () => {
    getColorVisionFilter('tritanopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-tritanopia')).not.toBeNull();

    getColorVisionFilter('tritanopia' as ConditionType, 0);
    expect(document.getElementById('cvd-tritanopia')).toBeNull();
  });

  test('switching conditions removes the previous filter', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-protanopia')).not.toBeNull();

    getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-protanopia')).toBeNull();
    expect(document.getElementById('cvd-deuteranopia')).not.toBeNull();
  });

  test('cleanupAllDOMFilters removes the entire SVG container', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-svg-filters')).not.toBeNull();

    cleanupAllDOMFilters();
    expect(document.getElementById('cvd-svg-filters')).toBeNull();
    expect(document.getElementById('cvd-protanopia')).toBeNull();
  });

  test('no stale filter elements remain after switching', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    getColorVisionFilter('tritanopia' as ConditionType, 1.0);

    // Only the last filter should remain
    const container = document.getElementById('cvd-svg-filters');
    const filters = container?.querySelectorAll('filter');
    expect(filters?.length).toBe(1);
    expect(filters?.[0]?.getAttribute('id')).toBe('cvd-tritanopia');
  });

  test('switching from SVG filter to monochromacy cleans up DOM filter', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(document.getElementById('cvd-protanopia')).not.toBeNull();

    getColorVisionFilter('monochromacy' as ConditionType, 1.0);
    expect(document.getElementById('cvd-protanopia')).toBeNull();
  });

  test('switching from monochromacy to SVG filter works correctly', () => {
    getColorVisionFilter('monochromacy' as ConditionType, 1.0);
    const filter = getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(filter).toBe('url("#cvd-protanopia")');
    expect(document.getElementById('cvd-protanopia')).not.toBeNull();
  });

  test('cleanupAllDOMFilters is idempotent', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    cleanupAllDOMFilters();
    expect(() => cleanupAllDOMFilters()).not.toThrow();
    expect(document.getElementById('cvd-svg-filters')).toBeNull();
  });

  test('very small intensity still creates a DOM filter', () => {
    getColorVisionFilter('protanopia' as ConditionType, 0.01);
    expect(document.getElementById('cvd-protanopia')).not.toBeNull();
  });
});

describe('Matrix luminance preservation', () => {
  test.each([
    'protanopia', 'deuteranopia', 'tritanopia',
  ] as ConditionType[])('%s matrix rows sum to approximately 1.0', (type) => {
    const matrix = getColorVisionMatrix(type, 1.0);
    // Check each row of the 3x3 matrix sums to ~1.0
    for (let row = 0; row < 3; row++) {
      const rowSum = matrix[row * 3] + matrix[row * 3 + 1] + matrix[row * 3 + 2];
      expect(rowSum).toBeCloseTo(1.0, 1);
    }
  });
});
