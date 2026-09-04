import { useState, useEffect, useRef } from 'react';

/**
 * Hook that provides an animation ticker for animated effects.
 * Uses requestAnimationFrame with timestamp-based throttle for smooth rendering.
 * Automatically pauses when the tab is backgrounded (rAF stops in hidden tabs).
 *
 * @param enabled - Whether the animation should be running
 * @param interval - Minimum update interval in milliseconds (default: 100ms)
 * @returns Current timestamp (Date.now()) that updates on each tick
 */
export const useAnimationTicker = (enabled: boolean, interval: number = 100): number => {
  const [now, setNow] = useState(Date.now());
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const prefersReducedMotion =
      (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.documentElement.classList.contains('reduced-motion-mode');
    if (prefersReducedMotion) return;

    let rafId: number;
    let initialized = false;

    const tick = (timestamp: number) => {
      if (!initialized) {
        lastUpdateRef.current = timestamp;
        initialized = true;
      }
      if (timestamp - lastUpdateRef.current >= interval) {
        lastUpdateRef.current = timestamp;
        setNow(Date.now());
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [enabled, interval]);

  return now;
};
