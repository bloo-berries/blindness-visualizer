import { renderHook, act } from '@testing-library/react';
import { useAnimationTicker } from '../../hooks/useAnimationTicker';

describe('useAnimationTicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns a number (timestamp) initially', () => {
    const { result } = renderHook(() => useAnimationTicker(true, 100));
    expect(typeof result.current).toBe('number');
  });

  test('returns initial Date.now() value', () => {
    const before = Date.now();
    const { result } = renderHook(() => useAnimationTicker(false, 100));
    const after = Date.now();
    expect(result.current).toBeGreaterThanOrEqual(before);
    expect(result.current).toBeLessThanOrEqual(after);
  });

  test('updates timestamp on each interval tick when enabled', () => {
    const { result } = renderHook(() => useAnimationTicker(true, 100));
    const initial = result.current;

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // After one interval, the value should have changed
    expect(result.current).not.toBe(initial);
  });

  test('does not update when disabled', () => {
    const { result } = renderHook(() => useAnimationTicker(false, 100));
    const initial = result.current;

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(initial);
  });

  test('uses default interval of 100ms', () => {
    const { result } = renderHook(() => useAnimationTicker(true));
    const initial = result.current;

    // Advance less than 100ms — no update
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).toBe(initial);

    // Advance to 100ms — should update
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).not.toBe(initial);
  });

  test('respects custom interval', () => {
    const { result } = renderHook(() => useAnimationTicker(true, 500));
    const initial = result.current;

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe(initial);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).not.toBe(initial);
  });

  test('stops updating when toggled from enabled to disabled', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useAnimationTicker(enabled, 100),
      { initialProps: { enabled: true } }
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });
    const afterFirstTick = result.current;

    // Disable
    rerender({ enabled: false });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(afterFirstTick);
  });

  test('resumes updating when toggled from disabled to enabled', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useAnimationTicker(enabled, 100),
      { initialProps: { enabled: false } }
    );

    const initial = result.current;

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(initial);

    // Enable
    rerender({ enabled: true });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).not.toBe(initial);
  });

  test('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useAnimationTicker(true, 100));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('updates multiple times over multiple intervals', () => {
    const values: number[] = [];
    const { result } = renderHook(() => useAnimationTicker(true, 50));

    values.push(result.current);

    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(50);
      });
      values.push(result.current);
    }

    // Each tick should produce a new timestamp (or at minimum, there should be changes)
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBeGreaterThan(1);
  });

  test('changing interval clears old interval and starts new one', () => {
    const { result, rerender } = renderHook(
      ({ interval }) => useAnimationTicker(true, interval),
      { initialProps: { interval: 100 } }
    );

    act(() => { jest.advanceTimersByTime(100); });
    const afterFirstInterval = result.current;

    // Change to longer interval
    rerender({ interval: 1000 });

    act(() => { jest.advanceTimersByTime(500); });
    // Should not have updated yet with the new 1000ms interval
    expect(result.current).toBe(afterFirstInterval);

    act(() => { jest.advanceTimersByTime(500); });
    // Now should have updated
    expect(result.current).not.toBe(afterFirstInterval);
  });
});
