import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  test('does not update value before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Advance partway through the delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('initial');
  });

  test('updates value after delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  test('rapid changes only use the last value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    rerender({ value: 'b', delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'c', delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'd', delay: 300 });

    // None of the intermediate values should have been applied yet
    expect(result.current).toBe('a');

    // After full delay from last change, only 'd' should appear
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('d');
  });

  test('works with number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 200 } }
    );

    rerender({ value: 42, delay: 200 });
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe(42);
  });

  test('works with object values', () => {
    const obj1 = { key: 'value1' };
    const obj2 = { key: 'value2' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: obj1, delay: 100 } }
    );

    rerender({ value: obj2, delay: 100 });
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe(obj2);
  });

  test('resets timer when value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    rerender({ value: 'second', delay: 500 });
    act(() => { jest.advanceTimersByTime(400); });

    // Change value again — this should reset the timer
    rerender({ value: 'third', delay: 500 });
    act(() => { jest.advanceTimersByTime(400); });

    // 'second' should never have appeared
    expect(result.current).toBe('first');

    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe('third');
  });

  test('handles delay of zero', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'start', delay: 0 } }
    );

    rerender({ value: 'end', delay: 0 });
    act(() => { jest.advanceTimersByTime(0); });
    expect(result.current).toBe('end');
  });

  test('changing delay resets the debounce timer', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'original', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 500 });
    act(() => { jest.advanceTimersByTime(300); });

    // Change delay — effect re-runs, clears old timer
    rerender({ value: 'changed', delay: 1000 });
    act(() => { jest.advanceTimersByTime(500); });

    // Old 500ms timer was cleared, new 1000ms timer not yet done
    expect(result.current).toBe('original');

    act(() => { jest.advanceTimersByTime(500); });
    expect(result.current).toBe('changed');
  });

  test('cleanup clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 500 });
    const callCountBefore = clearTimeoutSpy.mock.calls.length;

    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(callCountBefore);
    clearTimeoutSpy.mockRestore();
  });

  test('does not update debounced value if input reverts before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'stable', delay: 300 } }
    );

    rerender({ value: 'temporary', delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'stable', delay: 300 });
    act(() => { jest.advanceTimersByTime(300); });

    // Should still be 'stable' (reverted back)
    expect(result.current).toBe('stable');
  });
});
