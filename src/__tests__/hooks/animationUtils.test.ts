import { pulse, oscillate, drift, seededPosition, fadeInOut } from '../../components/Visualizer/hooks/animatedOverlays/animationUtils';

describe('animationUtils', () => {
  describe('pulse', () => {
    test('returns value between min and max', () => {
      const result = pulse(1.0, 2.0, 0.2, 0.8);
      expect(result).toBeGreaterThanOrEqual(0.2);
      expect(result).toBeLessThanOrEqual(0.8);
    });

    test('defaults to 0-1 range', () => {
      const result = pulse(0.5, 1.0);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe('oscillate', () => {
    test('returns value within amplitude of offset', () => {
      const result = oscillate(1.0, 2.0, 5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(15);
    });

    test('defaults offset to 0', () => {
      const result = oscillate(0, 1.0, 3);
      expect(result).toBeGreaterThanOrEqual(-3);
      expect(result).toBeLessThanOrEqual(3);
    });
  });

  describe('drift', () => {
    test('returns x and y coordinates', () => {
      const result = drift(1.0, 0.5, 0.3, 10, 8);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(Math.abs(result.x)).toBeLessThanOrEqual(10);
      expect(Math.abs(result.y)).toBeLessThanOrEqual(8);
    });

    test('accepts phase parameter', () => {
      const r1 = drift(1.0, 0.5, 0.3, 10, 8, 0);
      const r2 = drift(1.0, 0.5, 0.3, 10, 8, Math.PI);
      expect(r1.x).not.toBeCloseTo(r2.x);
    });
  });

  describe('seededPosition', () => {
    test('returns value in expected range', () => {
      const result = seededPosition(42, 3.7, 100, 10);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(110);
    });

    test('is deterministic for same seed', () => {
      const r1 = seededPosition(7, 2.3, 50, 0);
      const r2 = seededPosition(7, 2.3, 50, 0);
      expect(r1).toBe(r2);
    });
  });

  describe('fadeInOut', () => {
    test('returns 0 at phase 0', () => {
      expect(fadeInOut(0)).toBe(0);
    });

    test('returns 0 at phase 1', () => {
      expect(fadeInOut(1)).toBeCloseTo(0, 5);
    });

    test('returns 1 in the middle of the cycle', () => {
      expect(fadeInOut(0.5)).toBe(1);
    });

    test('respects custom ramp speed', () => {
      const slow = fadeInOut(0.05, 4);
      const fast = fadeInOut(0.05, 20);
      expect(fast).toBeGreaterThan(slow);
    });
  });
});
