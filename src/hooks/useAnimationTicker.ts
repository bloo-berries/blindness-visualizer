import { useState, useEffect } from 'react';

/**
 * Hook that provides an animation ticker for animated effects.
 * Returns the current timestamp that updates every `interval` ms when enabled.
 *
 * @param enabled - Whether the animation should be running
 * @param interval - Update interval in milliseconds (default: 100ms)
 * @returns Current timestamp (Date.now()) that updates on each tick
 */
export const useAnimationTicker = (enabled: boolean, interval: number = 100): number => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval]);

  return now;
};
