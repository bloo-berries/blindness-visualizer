import { AnimationManager } from '../../utils/performance/AnimationManager';

describe('AnimationManager', () => {
  let rafCallbacks: Array<() => void>;
  let rafIds: number;
  let originalRAF: typeof requestAnimationFrame;
  let originalCAF: typeof cancelAnimationFrame;

  beforeEach(() => {
    rafCallbacks = [];
    rafIds = 0;

    originalRAF = global.requestAnimationFrame;
    originalCAF = global.cancelAnimationFrame;

    global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
      const id = ++rafIds;
      rafCallbacks.push(() => cb(performance.now()));
      return id;
    });

    global.cancelAnimationFrame = jest.fn();

    // Reset the singleton between tests by clearing the private static instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AnimationManager as any).instance = undefined;
  });

  afterEach(() => {
    // Clean up: remove all callbacks to stop the loop
    const instance = AnimationManager.getInstance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance as any).callbacks = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance as any).isRunning = false;

    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
  });

  test('getInstance returns the same instance (singleton)', () => {
    const a = AnimationManager.getInstance();
    const b = AnimationManager.getInstance();
    expect(a).toBe(b);
  });

  test('addCallback starts the animation loop', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    manager.addCallback(cb);

    // The animate method should have been invoked, which calls requestAnimationFrame
    // The first call to animate runs the callbacks then schedules the next frame
    expect(cb).toHaveBeenCalledTimes(1);
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('addCallback does not add duplicate callbacks', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    manager.addCallback(cb);
    manager.addCallback(cb);

    // Flush one animation frame
    if (rafCallbacks.length > 0) {
      rafCallbacks[rafCallbacks.length - 1]();
    }

    // The callback should only be in the list once — called once per frame
    expect(cb).toHaveBeenCalledTimes(2); // Once from initial animate, once from flushed frame
  });

  test('removeCallback removes a callback from the loop', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    manager.addCallback(cb);
    const callCountAfterAdd = cb.mock.calls.length;

    manager.removeCallback(cb);

    // Flush any pending frames
    rafCallbacks.forEach(fn => fn());

    // Should not have been called again after removal
    expect(cb).toHaveBeenCalledTimes(callCountAfterAdd);
  });

  test('removing last callback stops the animation loop', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    manager.addCallback(cb);
    manager.removeCallback(cb);

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  test('removing a non-existent callback does not throw', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    expect(() => manager.removeCallback(cb)).not.toThrow();
  });

  test('multiple callbacks are all invoked on each frame', () => {
    const manager = AnimationManager.getInstance();
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    const cb3 = jest.fn();

    manager.addCallback(cb1);
    manager.addCallback(cb2);
    manager.addCallback(cb3);

    // The first addCallback triggers animate(), which runs only cb1 at that point.
    // cb2 and cb3 were added after animate() already iterated.
    // Flush a frame so all three are called together.
    if (rafCallbacks.length > 0) {
      rafCallbacks[rafCallbacks.length - 1]();
    }

    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
    expect(cb3).toHaveBeenCalled();
  });

  test('callback errors are caught silently and do not break the loop', () => {
    const manager = AnimationManager.getInstance();
    const badCb = jest.fn(() => { throw new Error('boom'); });
    const goodCb = jest.fn();

    // Add both callbacks first, then trigger a frame
    manager.addCallback(goodCb);
    manager.addCallback(badCb);

    // The initial animate() call should have executed both callbacks
    // (goodCb was added first, animate ran with [goodCb], then badCb added but
    // loop was already running). Flush the next frame to run both together.
    if (rafCallbacks.length > 0) {
      rafCallbacks[rafCallbacks.length - 1]();
    }

    // Both should have been invoked — bad callback does not prevent good callback
    expect(badCb).toHaveBeenCalled();
    expect(goodCb).toHaveBeenCalled();

    // Loop should still be running (requestAnimationFrame called)
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('getPerformanceStatus returns fps and isThrottling', () => {
    const manager = AnimationManager.getInstance();
    const status = manager.getPerformanceStatus();

    expect(status).toHaveProperty('fps');
    expect(status).toHaveProperty('isThrottling');
    expect(typeof status.fps).toBe('number');
    expect(typeof status.isThrottling).toBe('boolean');
  });

  test('adding a callback after stop restarts the loop', () => {
    const manager = AnimationManager.getInstance();
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    manager.addCallback(cb1);
    manager.removeCallback(cb1); // This stops the loop

    // Reset RAF mock call count
    (global.requestAnimationFrame as jest.Mock).mockClear();

    manager.addCallback(cb2);

    // Loop should have restarted
    expect(global.requestAnimationFrame).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
  });

  test('animation frame chain continues when callbacks exist', () => {
    const manager = AnimationManager.getInstance();
    const cb = jest.fn();

    manager.addCallback(cb);

    // Simulate multiple animation frames
    for (let i = 0; i < 3; i++) {
      if (rafCallbacks.length > 0) {
        const latest = rafCallbacks[rafCallbacks.length - 1];
        rafCallbacks = [];
        latest();
      }
    }

    // The callback should have been called multiple times (initial + 3 frames)
    expect(cb.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});
