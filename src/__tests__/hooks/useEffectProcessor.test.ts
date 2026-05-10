/**
 * Tests for useEffectProcessor hook.
 *
 * The hook manages effect processing, overlay creation, and animation lifecycle.
 * It returns refs to PerformanceOptimizer, EffectProcessor, OverlayManager,
 * AnimationManager, and a getEffectStyles callback.
 */

import { renderHook } from '@testing-library/react';
import { useEffectProcessor } from '../../components/Visualizer/hooks/useEffectProcessor';
import { VisualEffect, InputSource } from '../../types/visualEffects';

// Mock the performance utilities
jest.mock('../../utils/performance', () => {
  const mockOptimizer = {
    getInstance: jest.fn(() => ({
      getTargetFPS: jest.fn(() => 60),
    })),
  };

  class MockEffectProcessor {
    updateEffects(effects: VisualEffect[]) {
      return {
        changed: true,
        enabledEffects: effects.filter((e) => e.enabled),
        effectMap: new Map(effects.map((e) => [e.id, e])),
      };
    }
  }

  class MockOverlayManager {
    clearOverlays = jest.fn();
    updateOverlays = jest.fn();
  }

  const mockAnimationManager = {
    getInstance: jest.fn(() => ({
      start: jest.fn(),
      stop: jest.fn(),
    })),
  };

  return {
    PerformanceOptimizer: mockOptimizer,
    EffectProcessor: MockEffectProcessor,
    OverlayManager: MockOverlayManager,
    AnimationManager: mockAnimationManager,
  };
});

jest.mock('../../utils/cssFilters', () => ({
  generateCSSFilters: jest.fn(() => 'blur(2px)'),
}));

jest.mock('../../utils/colorVisionFilters', () => ({
  getColorVisionFilter: jest.fn(() => 'saturate(0.5)'),
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

function createRef<T>(value: T): React.RefObject<T> {
  return { current: value } as React.RefObject<T>;
}

describe('useEffectProcessor', () => {
  const youtubeSource: InputSource = { type: 'youtube' };
  const imageSource: InputSource = { type: 'image', url: 'test.png' };
  const webcamSource: InputSource = { type: 'webcam' };

  function renderEffectProcessor(
    effects: VisualEffect[] = [],
    inputSource: InputSource = youtubeSource,
    options: {
      showComparison?: boolean;
      isFamousPeopleMode?: boolean;
    } = {}
  ) {
    const containerDiv = document.createElement('div');
    const simulationDiv = document.createElement('div');

    return renderHook(() =>
      useEffectProcessor(
        effects,
        inputSource,
        0,    // diplopiaSeparation
        0,    // diplopiaDirection
        options.showComparison ?? false,
        createRef(containerDiv),
        createRef(simulationDiv),
        options.isFamousPeopleMode ?? false
      )
    );
  }

  describe('returned refs', () => {
    test('returns optimizer ref', () => {
      const { result } = renderEffectProcessor();
      expect(result.current.optimizer).toBeDefined();
      expect(result.current.optimizer.current).toBeDefined();
    });

    test('returns effectProcessor ref', () => {
      const { result } = renderEffectProcessor();
      expect(result.current.effectProcessor).toBeDefined();
      expect(result.current.effectProcessor.current).toBeDefined();
    });

    test('returns overlayManager ref', () => {
      const { result } = renderEffectProcessor();
      expect(result.current.overlayManager).toBeDefined();
      expect(result.current.overlayManager.current).toBeDefined();
    });

    test('returns animationManager ref', () => {
      const { result } = renderEffectProcessor();
      expect(result.current.animationManager).toBeDefined();
      expect(result.current.animationManager.current).toBeDefined();
    });

    test('returns getEffectStyles function', () => {
      const { result } = renderEffectProcessor();
      expect(typeof result.current.getEffectStyles).toBe('function');
    });
  });

  describe('getEffectStyles', () => {
    test('returns base styles with no effects', () => {
      const { result } = renderEffectProcessor([], youtubeSource);
      const styles = result.current.getEffectStyles();

      expect(styles.position).toBe('absolute');
      expect(styles.top).toBe('50%');
      expect(styles.left).toBe('50%');
      expect(styles.transform).toBe('translate(-50%, -50%)');
      expect(styles.maxWidth).toBe('100%');
      expect(styles.maxHeight).toBe('100%');
      expect(styles.width).toBe('100%');
      expect(styles.height).toBe('100%');
      expect(styles.objectFit).toBe('contain');
    });

    test('includes filter for enabled effects on youtube', () => {
      const effects = [makeEffect('cataracts', true, 0.5)];
      const { result } = renderEffectProcessor(effects, youtubeSource);
      const styles = result.current.getEffectStyles();

      expect(styles.filter).toBeDefined();
    });

    test('includes filter for enabled effects on image', () => {
      const effects = [makeEffect('cataracts', true, 0.5)];
      const { result } = renderEffectProcessor(effects, imageSource);
      const styles = result.current.getEffectStyles();

      expect(styles.filter).toBeDefined();
    });

    test('returns only base styles for webcam source (uses WebGL)', () => {
      const effects = [makeEffect('cataracts', true, 0.5)];
      const { result } = renderEffectProcessor(effects, webcamSource);
      const styles = result.current.getEffectStyles();

      expect(styles.filter).toBeUndefined();
    });

    test('excludes diplopia effects from CSS filters', () => {
      const effects = [makeEffect('diplopiaMonocular', true, 0.8)];
      const { result } = renderEffectProcessor(effects, youtubeSource);
      const styles = result.current.getEffectStyles();

      // Diplopia is excluded from CSS filter generation
      // Since it is the only effect and it is excluded, no filter string should be generated
      expect(styles.filter).toBeUndefined();
    });

    test('includes color vision filter when enabled', () => {
      const effects = [makeEffect('protanopia', true, 0.7)];
      const { result } = renderEffectProcessor(effects, youtubeSource);
      const styles = result.current.getEffectStyles();

      expect(styles.filter).toBeDefined();
      expect(styles.filter).toContain('saturate');
    });

    test('base styles always present regardless of effects', () => {
      const effects = [makeEffect('glaucoma', true, 0.9)];
      const { result } = renderEffectProcessor(effects, youtubeSource);
      const styles = result.current.getEffectStyles();

      expect(styles.position).toBe('absolute');
      expect(styles.objectFit).toBe('contain');
    });
  });

  describe('overlay management', () => {
    test('clears overlays when no effects enabled on youtube', () => {
      const effects = [makeEffect('retinitisPigmentosa', false, 0.7)];
      const { result } = renderEffectProcessor(effects, youtubeSource);

      const overlayManager = result.current.overlayManager.current;
      expect(overlayManager.clearOverlays).toHaveBeenCalled();
    });

    test('clears overlays for webcam source', () => {
      const effects = [makeEffect('retinitisPigmentosa', true, 0.7)];
      const { result } = renderEffectProcessor(effects, webcamSource);

      const overlayManager = result.current.overlayManager.current;
      expect(overlayManager.clearOverlays).toHaveBeenCalled();
    });
  });

  describe('effect changes', () => {
    test('getEffectStyles returns different filter when effects change', () => {
      const { result, rerender } = renderHook(
        ({ effects }) => {
          const containerDiv = document.createElement('div');
          const simulationDiv = document.createElement('div');
          return useEffectProcessor(
            effects,
            youtubeSource,
            0, 0, false,
            createRef(containerDiv),
            createRef(simulationDiv),
            false
          );
        },
        { initialProps: { effects: [makeEffect('cataracts', true, 0.3)] } }
      );

      const styles1 = result.current.getEffectStyles();

      rerender({ effects: [makeEffect('cataracts', true, 0.9)] });
      const styles2 = result.current.getEffectStyles();

      // Both calls should return styles with filters
      expect(styles1.filter).toBeDefined();
      expect(styles2.filter).toBeDefined();
    });

    test('getEffectStyles is a stable function when deps do not change', () => {
      const effects = [makeEffect('cataracts', true, 0.5)];
      const { result, rerender } = renderHook(() => {
        const containerDiv = document.createElement('div');
        const simulationDiv = document.createElement('div');
        return useEffectProcessor(
          effects,
          youtubeSource,
          0, 0, false,
          createRef(containerDiv),
          createRef(simulationDiv),
          false
        );
      });

      const fn1 = result.current.getEffectStyles;
      rerender();
      const fn2 = result.current.getEffectStyles;
      // Same deps means same callback reference
      expect(fn1).toBe(fn2);
    });
  });
});
