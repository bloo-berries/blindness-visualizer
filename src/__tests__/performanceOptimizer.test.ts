import { PerformanceOptimizer } from '../utils/performance/PerformanceOptimizer';

describe('PerformanceOptimizer', () => {
  // Use getInstance to get the singleton — but note tests share state.
  // For isolation, test getOptimalFrameRate and shouldThrottleAnimation
  // which are pure functions of their input (ignoring isThrottling state).

  describe('singleton pattern', () => {
    test('getInstance returns the same instance', () => {
      const a = PerformanceOptimizer.getInstance();
      const b = PerformanceOptimizer.getInstance();
      expect(a).toBe(b);
    });

    test('instance is a PerformanceOptimizer', () => {
      const instance = PerformanceOptimizer.getInstance();
      expect(instance).toBeInstanceOf(PerformanceOptimizer);
    });
  });

  describe('getOptimalFrameRate', () => {
    const optimizer = PerformanceOptimizer.getInstance();

    test('returns 60 FPS for 0 conditions', () => {
      expect(optimizer.getOptimalFrameRate(0)).toBe(60);
    });

    test('returns 60 FPS for 1-3 conditions', () => {
      expect(optimizer.getOptimalFrameRate(1)).toBe(60);
      expect(optimizer.getOptimalFrameRate(2)).toBe(60);
      expect(optimizer.getOptimalFrameRate(3)).toBe(60);
    });

    test('returns 45 FPS for 4-5 conditions', () => {
      expect(optimizer.getOptimalFrameRate(4)).toBe(45);
      expect(optimizer.getOptimalFrameRate(5)).toBe(45);
    });

    test('returns 30 FPS for 6+ conditions', () => {
      expect(optimizer.getOptimalFrameRate(6)).toBe(30);
      expect(optimizer.getOptimalFrameRate(10)).toBe(30);
      expect(optimizer.getOptimalFrameRate(100)).toBe(30);
    });
  });

  describe('getFps and getIsThrottling', () => {
    const optimizer = PerformanceOptimizer.getInstance();

    test('getFps returns a number', () => {
      expect(typeof optimizer.getFps()).toBe('number');
    });

    test('getIsThrottling returns a boolean', () => {
      expect(typeof optimizer.getIsThrottling()).toBe('boolean');
    });
  });
});
