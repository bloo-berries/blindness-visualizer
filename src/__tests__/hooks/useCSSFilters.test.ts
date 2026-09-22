/**
 * Tests for useCSSFilters hook.
 *
 * The hook computes CSS filter strings and combined effect styles
 * from active visual effects. It uses EffectProcessor for caching,
 * getColorVisionFilter for color vision (SVG mode for images),
 * getMobileCSSFilter for CSS-only mode (YouTube iframes), and
 * generateCSSFilters for other effects.
 */

import { renderHook } from '@testing-library/react';
import { useCSSFilters } from '../../components/Visualizer/hooks/useCSSFilters';
import { VisualEffect, InputSource } from '../../types/visualEffects';

// Mock the color vision filters module
jest.mock('../../utils/colorVisionFilters', () => {
  return {
    getColorVisionFilter: jest.fn(() => 'url("http://localhost/simulator#cvd-protanopia")'),
    getMobileCSSFilter: jest.fn(() => 'saturate(35%) sepia(15%) hue-rotate(345deg)'),
    COLOR_VISION_IDS: [
      'protanopia', 'deuteranopia', 'tritanopia',
      'protanomaly', 'deuteranomaly', 'tritanomaly',
      'monochromatic', 'monochromacy',
    ],
  };
});

jest.mock('../../utils/cssFilters', () => ({
  generateCSSFilters: jest.fn(() => 'blur(2px) contrast(90%)'),
}));

function makeEffect(
  id: string,
  enabled: boolean,
  intensity: number
): VisualEffect {
  return {
    id: id as VisualEffect['id'],
    name: id,
    enabled,
    intensity,
    description: `Test ${id}`,
  };
}

/**
 * Create a mock EffectProcessor ref matching the real EffectProcessor behavior.
 */
function createMockEffectProcessorRef() {
  const processor = {
    updateEffects: (effects: VisualEffect[]) => {
      const enabledEffects = effects.filter((e) => e.enabled);
      return {
        changed: true,
        enabledEffects,
        effectMap: new Map(effects.map((e) => [e.id, e])),
      };
    },
  };
  return { current: processor } as any;
}

describe('useCSSFilters', () => {
  const youtubeSource: InputSource = { type: 'youtube' };
  const imageSource: InputSource = { type: 'image', url: 'test.png' };
  const webcamSource: InputSource = { type: 'webcam' };

  beforeEach(() => {
    jest.clearAllMocks();
    const cvf = require('../../utils/colorVisionFilters');
    (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('url("http://localhost/simulator#cvd-protanopia")');
    (cvf.getMobileCSSFilter as jest.Mock).mockReturnValue('saturate(35%) sepia(15%) hue-rotate(345deg)');

    const cssFilters = require('../../utils/cssFilters');
    (cssFilters.generateCSSFilters as jest.Mock).mockReturnValue('blur(2px) contrast(90%)');
  });

  describe('computeFilterString (default SVG mode)', () => {
    test('returns null when no effects are enabled', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', false, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });

    test('returns SVG filter string for color vision effect', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('cvd-protanopia');
    });

    test('returns filter string for non-color-vision effects', () => {
      const effects: VisualEffect[] = [makeEffect('cataracts', true, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('blur');
    });

    test('combines color vision and other filters', () => {
      const effects: VisualEffect[] = [
        makeEffect('protanopia', true, 0.8),
        makeEffect('cataracts', true, 0.5),
      ];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('cvd-protanopia');
      expect(filterString).toContain('blur');
    });

    test('excludes diplopia effects from filter computation', () => {
      const effects: VisualEffect[] = [
        makeEffect('diplopiaMonocular', true, 0.8),
      ];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 5, 45, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });

    test('handles monochromacy via CSS filter', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('saturate(0%) contrast(85%) brightness(75%) blur(1.5px)');

      const effects: VisualEffect[] = [makeEffect('monochromacy', true, 0.9)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('saturate');
    });

    test('returns null when getColorVisionFilter returns empty string', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('');

      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });

    test('calls getColorVisionFilter (not getMobileCSSFilter) in default mode', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      result.current.computeFilterString();
      expect(cvf.getColorVisionFilter).toHaveBeenCalledWith('protanopia', 0.8);
      expect(cvf.getMobileCSSFilter).not.toHaveBeenCalled();
    });
  });

  describe('computeFilterString (cssOnly mode for YouTube)', () => {
    test('uses getMobileCSSFilter in cssOnly mode', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(cvf.getMobileCSSFilter).toHaveBeenCalledWith('protanopia', 0.8);
      expect(filterString).toContain('saturate');
      expect(filterString).toContain('sepia');
    });

    test('falls back to getColorVisionFilter when getMobileCSSFilter returns null', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getMobileCSSFilter as jest.Mock).mockReturnValue(null);
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('saturate(0%) contrast(85%)');

      const effects: VisualEffect[] = [makeEffect('monochromacy', true, 1.0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(cvf.getMobileCSSFilter).toHaveBeenCalledWith('monochromacy', 1.0);
      expect(cvf.getColorVisionFilter).toHaveBeenCalledWith('monochromacy', 1.0);
      expect(filterString).toContain('saturate');
    });

    test('does not call getColorVisionFilter when getMobileCSSFilter returns a value', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('deuteranopia', true, 1.0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      result.current.computeFilterString(true);
      expect(cvf.getMobileCSSFilter).toHaveBeenCalled();
      expect(cvf.getColorVisionFilter).not.toHaveBeenCalled();
    });

    test('combines CSS-only color vision filter with other effects', () => {
      const effects: VisualEffect[] = [
        makeEffect('protanopia', true, 0.8),
        makeEffect('cataracts', true, 0.5),
      ];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('sepia');
      expect(filterString).toContain('blur');
    });

    test('returns null in cssOnly mode when no effects enabled', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', false, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(filterString).toBeNull();
    });

    test('cssOnly mode excludes diplopia effects', () => {
      const effects: VisualEffect[] = [makeEffect('diplopiaMonocular', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 5, 45, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(filterString).toBeNull();
    });
  });

  describe('getColorVisionFilter delegation', () => {
    test('calls getColorVisionFilter with correct type and intensity', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      result.current.computeFilterString();
      expect(cvf.getColorVisionFilter).toHaveBeenCalledWith('protanopia', 0.8);
    });

    test('calls getColorVisionFilter for all SVG CVD types', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const svgTypes = ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly'];
      const processorRef = createMockEffectProcessorRef();

      for (const type of svgTypes) {
        jest.clearAllMocks();
        (cvf.getColorVisionFilter as jest.Mock).mockReturnValue(`url("http://localhost/simulator#cvd-${type}")`);

        const effects: VisualEffect[] = [makeEffect(type, true, 1.0)];
        const { result } = renderHook(() =>
          useCSSFilters(effects, imageSource, 0, 0, processorRef)
        );

        result.current.computeFilterString();
        expect(cvf.getColorVisionFilter).toHaveBeenCalledWith(type, 1.0);
      }
    });

    test('uses the return value from getColorVisionFilter as the filter string', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const absoluteUrl = 'url("http://localhost:3000/simulator#cvd-tritanopia")';
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue(absoluteUrl);

      const effects: VisualEffect[] = [makeEffect('tritanopia', true, 1.0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBe(absoluteUrl);
    });

    test('calls getColorVisionFilter exactly once per computeFilterString call', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('deuteranopia', true, 0.7)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      result.current.computeFilterString();
      expect(cvf.getColorVisionFilter).toHaveBeenCalledTimes(1);
    });

    test('does not call getColorVisionFilter when no CVD effect is enabled', () => {
      const cvf = require('../../utils/colorVisionFilters');
      const effects: VisualEffect[] = [makeEffect('cataracts', true, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      result.current.computeFilterString();
      expect(cvf.getColorVisionFilter).not.toHaveBeenCalled();
    });
  });

  describe('all CVD types produce filter strings', () => {
    const allCvdTypes = [
      { type: 'protanopia', label: 'protanopia (red-blind)' },
      { type: 'deuteranopia', label: 'deuteranopia (green-blind)' },
      { type: 'tritanopia', label: 'tritanopia (blue-blind)' },
      { type: 'protanomaly', label: 'protanomaly (red-weak)' },
      { type: 'deuteranomaly', label: 'deuteranomaly (green-weak)' },
      { type: 'tritanomaly', label: 'tritanomaly (blue-weak)' },
    ];

    test.each(allCvdTypes)('$label produces non-null filter string in SVG mode', ({ type }) => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue(`url("http://localhost/simulator#cvd-${type}")`);

      const effects: VisualEffect[] = [makeEffect(type, true, 1.0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain(`cvd-${type}`);
    });

    test.each(allCvdTypes)('$label produces non-null filter string in cssOnly mode', ({ type }) => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getMobileCSSFilter as jest.Mock).mockReturnValue(`saturate(35%) sepia(15%) hue-rotate(345deg)`);

      const effects: VisualEffect[] = [makeEffect(type, true, 1.0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString(true);
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('saturate');
    });
  });

  describe('getEffectStyles', () => {
    test('returns base styles for youtube source (no filter — filter goes on iframe)', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.position).toBe('absolute');
      expect(styles.top).toBe('50%');
      expect(styles.left).toBe('50%');
      expect(styles.filter).toBeUndefined();
    });

    test('includes filter in styles for image source', () => {
      const effects: VisualEffect[] = [makeEffect('cataracts', true, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.filter).toBeDefined();
      expect(typeof styles.filter).toBe('string');
    });

    test('returns base styles without filter for webcam source', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, webcamSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.filter).toBeUndefined();
    });

    test('transform centers the element', () => {
      const effects: VisualEffect[] = [];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.transform).toBe('translate(-50%, -50%)');
    });
  });

  describe('diplopia exclusion', () => {
    test('excludes diplopiaBinocular from non-diplopia filter list', () => {
      const cssFilters = require('../../utils/cssFilters');
      const effects: VisualEffect[] = [
        makeEffect('diplopiaBinocular', true, 0.8),
        makeEffect('cataracts', true, 0.5),
      ];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, imageSource, 5, 45, processorRef)
      );

      result.current.computeFilterString();

      // generateCSSFilters should be called with only cataracts (not diplopia)
      const callArgs = (cssFilters.generateCSSFilters as jest.Mock).mock.calls[0];
      const passedEffects = callArgs[0] as VisualEffect[];
      expect(passedEffects.some((e: VisualEffect) => e.id === 'diplopiaBinocular')).toBe(false);
      expect(passedEffects.some((e: VisualEffect) => e.id === 'cataracts')).toBe(true);
    });
  });

  describe('memoization', () => {
    test('computeFilterString is a stable callback reference', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result, rerender } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const firstRef = result.current.computeFilterString;
      rerender();
      const secondRef = result.current.computeFilterString;
      expect(firstRef).toBe(secondRef);
    });

    test('getEffectStyles is a stable callback reference', () => {
      const effects: VisualEffect[] = [];
      const processorRef = createMockEffectProcessorRef();

      const { result, rerender } = renderHook(() =>
        useCSSFilters(effects, imageSource, 0, 0, processorRef)
      );

      const firstRef = result.current.getEffectStyles;
      rerender();
      const secondRef = result.current.getEffectStyles;
      expect(firstRef).toBe(secondRef);
    });
  });
});
