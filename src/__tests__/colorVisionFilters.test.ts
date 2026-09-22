import { getColorVisionFilter, getColorVisionMatrix, cleanupAllDOMFilters, isColorVisionCondition, getColorVisionFilterData, _resetMobileDetection, isMobileBrowser, getColorVisionDescription, getColorVisionPrevalence, COLOR_VISION_IDS, SVG_COLOR_VISION_IDS, blendWithIdentity } from '../utils/colorVisionFilters';
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

describe('getColorVisionFilterData', () => {
  test('returns filter data for protanopia', () => {
    const data = getColorVisionFilterData('protanopia' as ConditionType, 1.0);
    expect(data).not.toBeNull();
    expect(data!.filterId).toBe('cvd-protanopia');
    expect(data!.matrixValues).toBeTruthy();
  });

  test('returns null for monochromacy', () => {
    const data = getColorVisionFilterData('monochromacy' as ConditionType, 1.0);
    expect(data).toBeNull();
  });

  test('returns null for monochromatic', () => {
    const data = getColorVisionFilterData('monochromatic' as ConditionType, 1.0);
    expect(data).toBeNull();
  });

  test('returns null at zero intensity', () => {
    const data = getColorVisionFilterData('protanopia' as ConditionType, 0);
    expect(data).toBeNull();
  });

  test('matrix values contain 20 numbers for 5x4 matrix', () => {
    const data = getColorVisionFilterData('deuteranopia' as ConditionType, 0.7);
    expect(data).not.toBeNull();
    const nums = data!.matrixValues.split(' ');
    expect(nums).toHaveLength(20);
  });

  test('partial intensity produces blended matrix', () => {
    const dataFull = getColorVisionFilterData('tritanopia' as ConditionType, 1.0);
    const dataHalf = getColorVisionFilterData('tritanopia' as ConditionType, 0.5);
    expect(dataFull).not.toBeNull();
    expect(dataHalf).not.toBeNull();
    expect(dataFull!.matrixValues).not.toBe(dataHalf!.matrixValues);
  });
});

describe('_resetMobileDetection', () => {
  test('can be called without error', () => {
    expect(() => _resetMobileDetection()).not.toThrow();
  });
});

describe('isMobileBrowser', () => {
  afterEach(() => {
    _resetMobileDetection();
  });

  test('returns false in JSDOM environment', () => {
    _resetMobileDetection();
    expect(isMobileBrowser()).toBe(false);
  });

  test('result is cached after first call', () => {
    _resetMobileDetection();
    const first = isMobileBrowser();
    const second = isMobileBrowser();
    expect(first).toBe(second);
  });
});

describe('getColorVisionFilter mobile path', () => {
  const originalMatchMedia = window.matchMedia;
  // JSDOM defines userAgent on Navigator.prototype, not on navigator itself,
  // so getOwnPropertyDescriptor returns undefined. Capture it from the prototype.
  const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent')
    || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), 'userAgent');

  afterEach(() => {
    _resetMobileDetection();
    cleanupAllDOMFilters();
    window.matchMedia = originalMatchMedia;
    if (originalUserAgent) {
      Object.defineProperty(navigator, 'userAgent', originalUserAgent);
    }
  });

  test('returns CSS filter string on mobile for protanopia', () => {
    _resetMobileDetection();
    // Simulate mobile UA
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      configurable: true,
    });
    window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as any;

    const filter = getColorVisionFilter('protanopia' as ConditionType, 1.0);
    expect(filter).toContain('sepia');
    expect(filter).toContain('hue-rotate');
  });

  test('returns scaled CSS filter at partial intensity on mobile', () => {
    _resetMobileDetection();
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      configurable: true,
    });
    window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as any;

    const filter = getColorVisionFilter('deuteranopia' as ConditionType, 0.5);
    expect(filter).toContain('sepia');
    expect(filter).toContain('saturate');
  });
});

describe('cleanupAllDOMFilters', () => {
  beforeEach(() => {
    _resetMobileDetection();
  });

  test('removes all injected SVG filter elements', () => {
    // Ensure we're not in mobile mode
    _resetMobileDetection();
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    const container = document.getElementById('cvd-svg-filters');
    // On desktop, SVG filters should be created
    if (container) {
      cleanupAllDOMFilters();
      expect(document.getElementById('cvd-svg-filters')).toBeNull();
      expect(document.getElementById('cvd-protanopia')).toBeNull();
    }
  });

  test('is safe to call when no filters exist', () => {
    cleanupAllDOMFilters();
    expect(() => cleanupAllDOMFilters()).not.toThrow();
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

  test('monochromatic returns achromatopsia matrix', () => {
    const matrix = getColorVisionMatrix('monochromatic' as ConditionType, 1.0);
    const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    expect(matrix).not.toEqual(identity);
    expect(matrix).toHaveLength(9);
  });

  test('monochromacy returns same matrix as monochromatic', () => {
    const monochromatic = getColorVisionMatrix('monochromatic' as ConditionType, 1.0);
    const monochromacy = getColorVisionMatrix('monochromacy' as ConditionType, 1.0);
    expect(monochromatic).toEqual(monochromacy);
  });

  test('anomaly interpolation produces intermediate values', () => {
    const at0 = getColorVisionMatrix('protanomaly' as ConditionType, 0.0);
    const at05 = getColorVisionMatrix('protanomaly' as ConditionType, 0.5);
    const at1 = getColorVisionMatrix('protanomaly' as ConditionType, 1.0);
    expect(at05).not.toEqual(at0);
    expect(at05).not.toEqual(at1);
  });
});

describe('getColorVisionDescription', () => {
  test('returns description for protanopia', () => {
    const desc = getColorVisionDescription('protanopia' as ConditionType);
    expect(desc).toContain('red-blindness');
    expect(desc).toContain('L-cones');
  });

  test('returns description for deuteranopia', () => {
    const desc = getColorVisionDescription('deuteranopia' as ConditionType);
    expect(desc).toContain('green-blindness');
  });

  test('returns description for tritanopia', () => {
    const desc = getColorVisionDescription('tritanopia' as ConditionType);
    expect(desc).toContain('blue-blindness');
  });

  test('returns description for anomaly types', () => {
    expect(getColorVisionDescription('protanomaly' as ConditionType)).toContain('red-weakness');
    expect(getColorVisionDescription('deuteranomaly' as ConditionType)).toContain('green-weakness');
    expect(getColorVisionDescription('tritanomaly' as ConditionType)).toContain('blue-weakness');
  });

  test('returns description for monochromacy', () => {
    const desc = getColorVisionDescription('monochromacy' as ConditionType);
    expect(desc).toContain('achromatopsia');
  });

  test('returns fallback for unknown type', () => {
    const desc = getColorVisionDescription('unknownType' as ConditionType);
    expect(desc).toBe('Color vision deficiency simulation');
  });
});

describe('getColorVisionPrevalence', () => {
  test('returns prevalence for protanopia', () => {
    const prev = getColorVisionPrevalence('protanopia' as ConditionType);
    expect(prev).toContain('males');
    expect(prev).toContain('females');
  });

  test('returns prevalence for deuteranomaly as most common', () => {
    const prev = getColorVisionPrevalence('deuteranomaly' as ConditionType);
    expect(prev).toContain('6%');
  });

  test('returns prevalence for monochromacy', () => {
    const prev = getColorVisionPrevalence('monochromacy' as ConditionType);
    expect(prev).toContain('30,000');
  });

  test('returns unknown for unrecognized type', () => {
    const prev = getColorVisionPrevalence('unknownType' as ConditionType);
    expect(prev).toBe('Unknown prevalence');
  });
});

describe('intermediate intensity interpolation', () => {
  afterEach(() => {
    cleanupAllDOMFilters();
  });

  test('protanopia at 0.5 intensity blends with identity matrix', () => {
    const data = getColorVisionFilterData('protanopia' as ConditionType, 0.5);
    expect(data).not.toBeNull();
    // Blended matrix should be between identity and full protanopia
    const nums = data!.matrixValues.split(' ').map(Number);
    // First element of identity is 1, first of protanopia is ~0.152
    // At 0.5 blend: ~0.576
    expect(nums[0]).toBeGreaterThan(0.1);
    expect(nums[0]).toBeLessThan(1.0);
  });

  test('tritanomaly intermediate interpolation between keyframes', () => {
    const at02 = getColorVisionMatrix('tritanomaly' as ConditionType, 0.2);
    const at04 = getColorVisionMatrix('tritanomaly' as ConditionType, 0.4);
    // These should be distinct intermediate values
    expect(at02).not.toEqual(at04);
    expect(at02).toHaveLength(9);
    expect(at04).toHaveLength(9);
  });

  test('monochromacy at partial intensity returns CSS filter with adjusted values', () => {
    const filter = getColorVisionFilter('monochromacy' as ConditionType, 0.5);
    expect(filter).toContain('saturate(');
    // At 0.5 intensity, saturate should not be 0% (full) — it should be partially desaturated
    expect(filter).not.toBe('');
  });
});

describe('cleanupAllDOMFilters edge cases', () => {
  test('calling cleanup multiple times is safe', () => {
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    cleanupAllDOMFilters();
    cleanupAllDOMFilters();
    cleanupAllDOMFilters();
    expect(document.getElementById('cvd-svg-filters')).toBeNull();
  });

  test('cleanup removes filters for multiple conditions', () => {
    _resetMobileDetection();
    getColorVisionFilter('protanopia' as ConditionType, 1.0);
    getColorVisionFilter('deuteranopia' as ConditionType, 1.0);
    cleanupAllDOMFilters();
    expect(document.getElementById('cvd-protanopia')).toBeNull();
    expect(document.getElementById('cvd-deuteranopia')).toBeNull();
    expect(document.getElementById('cvd-svg-filters')).toBeNull();
  });
});

describe('COLOR_VISION_IDS and SVG_COLOR_VISION_IDS constants', () => {
  test('COLOR_VISION_IDS contains all 8 CVD types', () => {
    expect(COLOR_VISION_IDS).toHaveLength(8);
    const expected: ConditionType[] = [
      'protanopia', 'deuteranopia', 'tritanopia',
      'protanomaly', 'deuteranomaly', 'tritanomaly',
      'monochromatic', 'monochromacy',
    ];
    for (const id of expected) {
      expect(COLOR_VISION_IDS).toContain(id);
    }
  });

  test('SVG_COLOR_VISION_IDS contains 6 types (no monochromacy variants)', () => {
    expect(SVG_COLOR_VISION_IDS).toHaveLength(6);
    expect(SVG_COLOR_VISION_IDS).not.toContain('monochromatic');
    expect(SVG_COLOR_VISION_IDS).not.toContain('monochromacy');
  });

  test('SVG_COLOR_VISION_IDS is a subset of COLOR_VISION_IDS', () => {
    for (const id of SVG_COLOR_VISION_IDS) {
      expect(COLOR_VISION_IDS).toContain(id);
    }
  });
});

describe('blendWithIdentity', () => {
  const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  test('intensity 0 returns identity matrix', () => {
    const matrix = [0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0, 1];
    const result = blendWithIdentity(matrix, 0);
    expect(result).toEqual(identity);
  });

  test('intensity 1 returns the full matrix unchanged', () => {
    const matrix = [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998];
    const result = blendWithIdentity(matrix, 1.0);
    for (let i = 0; i < 9; i++) {
      expect(result[i]).toBeCloseTo(matrix[i], 6);
    }
  });

  test('intensity 0.5 produces midpoint between identity and matrix', () => {
    const matrix = [0, 1, 0, 1, 0, 0, 0, 0, 1];
    const result = blendWithIdentity(matrix, 0.5);
    // First element: 0 * 0.5 + 1 * 0.5 = 0.5
    expect(result[0]).toBeCloseTo(0.5, 6);
    // Second element: 1 * 0.5 + 0 * 0.5 = 0.5
    expect(result[1]).toBeCloseTo(0.5, 6);
    // Last element: 1 * 0.5 + 1 * 0.5 = 1.0
    expect(result[8]).toBeCloseTo(1.0, 6);
  });

  test('result has same length as input', () => {
    const matrix = [0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0, 1];
    const result = blendWithIdentity(matrix, 0.7);
    expect(result).toHaveLength(9);
  });
});

describe('getColorVisionFilterData for all SVG types', () => {
  const svgTypes: ConditionType[] = [
    'protanopia', 'deuteranopia', 'tritanopia',
    'protanomaly', 'deuteranomaly', 'tritanomaly',
  ] as ConditionType[];

  test.each(svgTypes)('%s returns valid filter data at full intensity', (type) => {
    const data = getColorVisionFilterData(type, 1.0);
    expect(data).not.toBeNull();
    expect(data!.filterId).toBe(`cvd-${type}`);
    const nums = data!.matrixValues.split(' ').map(Number);
    expect(nums).toHaveLength(20);
    // Alpha row must be identity: 0 0 0 1 0
    expect(nums[15]).toBe(0);
    expect(nums[16]).toBe(0);
    expect(nums[17]).toBe(0);
    expect(nums[18]).toBe(1);
    expect(nums[19]).toBe(0);
  });

  test.each(svgTypes)('%s returns blended data at partial intensity', (type) => {
    const full = getColorVisionFilterData(type, 1.0);
    const half = getColorVisionFilterData(type, 0.5);
    expect(full).not.toBeNull();
    expect(half).not.toBeNull();
    // Different intensities must produce different matrices
    expect(full!.matrixValues).not.toBe(half!.matrixValues);
  });

  test.each(svgTypes)('%s returns null at zero intensity', (type) => {
    expect(getColorVisionFilterData(type, 0)).toBeNull();
  });
});

describe('getColorVisionFilter for all SVG types', () => {
  beforeEach(() => {
    _resetMobileDetection();
    cleanupAllDOMFilters();
  });

  afterEach(() => {
    cleanupAllDOMFilters();
  });

  const svgTypes: ConditionType[] = [
    'protanopia', 'deuteranopia', 'tritanopia',
    'protanomaly', 'deuteranomaly', 'tritanomaly',
  ] as ConditionType[];

  test.each(svgTypes)('%s injects a DOM filter with correct feColorMatrix', (type) => {
    getColorVisionFilter(type, 1.0);
    const filterEl = document.getElementById(`cvd-${type}`);
    expect(filterEl).not.toBeNull();
    const feColorMatrix = filterEl?.querySelector('feColorMatrix');
    expect(feColorMatrix).not.toBeNull();
    expect(feColorMatrix?.getAttribute('type')).toBe('matrix');
    const values = feColorMatrix?.getAttribute('values') ?? '';
    const nums = values.split(' ').map(Number);
    expect(nums).toHaveLength(20);
    // Verify no NaN values
    for (const n of nums) {
      expect(Number.isNaN(n)).toBe(false);
    }
  });

  test.each(svgTypes)('%s at partial intensity produces blended matrix in DOM', (type) => {
    getColorVisionFilter(type, 0.5);
    const filterEl = document.getElementById(`cvd-${type}`);
    expect(filterEl).not.toBeNull();
    const feColorMatrix = filterEl?.querySelector('feColorMatrix');
    expect(feColorMatrix).not.toBeNull();
    const values = feColorMatrix?.getAttribute('values') ?? '';
    const nums = values.split(' ').map(Number);
    expect(nums).toHaveLength(20);
    // Blended matrix at 0.5 should differ from both identity and full matrix
    const fullData = getColorVisionFilterData(type, 1.0);
    const halfData = getColorVisionFilterData(type, 0.5);
    expect(fullData).not.toBeNull();
    expect(halfData).not.toBeNull();
    expect(fullData!.matrixValues).not.toBe(halfData!.matrixValues);
  });
});

describe('removeDOMFilter scoping', () => {
  beforeEach(() => {
    _resetMobileDetection();
    cleanupAllDOMFilters();
  });

  afterEach(() => {
    cleanupAllDOMFilters();
    // Remove any non-container filters we injected
    document.querySelectorAll('filter[id^="cvd-"]').forEach(el => el.remove());
  });

  test('removeDOMFilter only removes filters from the cvd-svg-filters container', () => {
    // Create a filter outside the container (simulating the inline SVG)
    const externalSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const externalFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    externalFilter.setAttribute('id', 'cvd-protanopia');
    externalSvg.appendChild(externalFilter);
    document.body.appendChild(externalSvg);

    // Also create one inside the container via getColorVisionFilter
    getColorVisionFilter('protanopia' as ConditionType, 1.0);

    // Now set intensity to 0 which triggers removeDOMFilter
    getColorVisionFilter('protanopia' as ConditionType, 0);

    // The external filter should still exist
    expect(externalSvg.querySelector('filter[id="cvd-protanopia"]')).not.toBeNull();

    // Clean up
    externalSvg.remove();
  });
});
