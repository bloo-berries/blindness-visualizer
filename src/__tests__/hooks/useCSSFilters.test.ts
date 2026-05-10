/**
 * Tests for useCSSFilters hook.
 *
 * The hook computes CSS filter strings and combined effect styles
 * from active visual effects. It uses EffectProcessor for caching,
 * getColorVisionFilter / getColorVisionFilterData for color vision,
 * and generateCSSFilters for other effects.
 */

import { renderHook } from '@testing-library/react';
import { useCSSFilters } from '../../components/Visualizer/hooks/useCSSFilters';
import { VisualEffect, InputSource } from '../../types/visualEffects';

// Mock the color vision filters module
jest.mock('../../utils/colorVisionFilters', () => {
  let _cached: boolean | null = null;
  return {
    getColorVisionFilter: jest.fn(() => 'url("#cvd-protanopia")'),
    getColorVisionFilterData: jest.fn(() => ({ filterId: 'cvd-protanopia', matrixValues: '0.15 0.85 0 0 0.15 0.85 0 0 1' })),
    isMobileBrowser: jest.fn(() => false),
    _resetMobileDetection: jest.fn(() => { _cached = null; }),
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
    // Re-setup default return values after clearAllMocks resets them
    const cvf = require('../../utils/colorVisionFilters');
    (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('url("#cvd-protanopia")');
    (cvf.getColorVisionFilterData as jest.Mock).mockReturnValue({
      filterId: 'cvd-protanopia',
      matrixValues: '0.15 0.85 0 0 0.15 0.85 0 0 1',
    });
    (cvf.isMobileBrowser as jest.Mock).mockReturnValue(false);

    const cssFilters = require('../../utils/cssFilters');
    (cssFilters.generateCSSFilters as jest.Mock).mockReturnValue('blur(2px) contrast(90%)');
  });

  describe('computeFilterString', () => {
    test('returns null when no effects are enabled', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', false, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });

    test('returns filter string for color vision effect on desktop', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(typeof filterString).toBe('string');
      expect(filterString).toContain('cvd-protanopia');
    });

    test('returns filter string for non-color-vision effects', () => {
      const effects: VisualEffect[] = [makeEffect('cataracts', true, 0.5)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
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
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString!.length).toBeGreaterThan(0);
    });

    test('excludes diplopia effects from filter computation', () => {
      const effects: VisualEffect[] = [
        makeEffect('diplopiaMonocular', true, 0.8),
      ];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 5, 45, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });

    test('handles mobile browser fallback', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.isMobileBrowser as jest.Mock).mockReturnValue(true);
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('saturate(0.3) hue-rotate(30deg)');

      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
    });

    test('handles monochromacy via CSS filter (no SVG)', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getColorVisionFilterData as jest.Mock).mockReturnValue(null);
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue('saturate(0) contrast(1.1)');

      const effects: VisualEffect[] = [makeEffect('monochromacy', true, 0.9)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).not.toBeNull();
      expect(filterString).toContain('saturate');
    });

    test('returns null when color vision filter functions return null', () => {
      const cvf = require('../../utils/colorVisionFilters');
      (cvf.getColorVisionFilterData as jest.Mock).mockReturnValue(null);
      (cvf.getColorVisionFilter as jest.Mock).mockReturnValue(null);

      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const filterString = result.current.computeFilterString();
      expect(filterString).toBeNull();
    });
  });

  describe('getEffectStyles', () => {
    test('returns base styles for youtube source with no effects', () => {
      const effects: VisualEffect[] = [];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.position).toBe('absolute');
      expect(styles.top).toBe('50%');
      expect(styles.left).toBe('50%');
      expect(styles.width).toBe('100%');
      expect(styles.height).toBe('100%');
      expect(styles.objectFit).toBe('contain');
    });

    test('includes filter in styles for youtube source with effects', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const styles = result.current.getEffectStyles();
      expect(styles.filter).toBeDefined();
      expect(typeof styles.filter).toBe('string');
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

  describe('memoization', () => {
    test('computeFilterString is a stable callback reference', () => {
      const effects: VisualEffect[] = [makeEffect('protanopia', true, 0.8)];
      const processorRef = createMockEffectProcessorRef();

      const { result, rerender } = renderHook(() =>
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
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
        useCSSFilters(effects, youtubeSource, 0, 0, processorRef)
      );

      const firstRef = result.current.getEffectStyles;
      rerender();
      const secondRef = result.current.getEffectStyles;
      expect(firstRef).toBe(secondRef);
    });
  });
});
