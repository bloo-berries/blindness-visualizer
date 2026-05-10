/**
 * Shared math helpers for animated overlay generators.
 * Eliminates duplicated sin/cos patterns across overlay files.
 */

/** Oscillate between min and max at a given frequency. */
export const pulse = (time: number, freq: number, min = 0, max = 1): number => {
  const t = Math.sin(time * freq) * 0.5 + 0.5;
  return min + t * (max - min);
};

/** Sine oscillation with amplitude and offset. */
export const oscillate = (time: number, freq: number, amplitude: number, offset = 0): number =>
  Math.sin(time * freq) * amplitude + offset;

/** Generate X/Y drift values for slow organic movement. */
export const drift = (
  time: number,
  freqX: number,
  freqY: number,
  ampX: number,
  ampY: number,
  phase = 0,
): { x: number; y: number } => ({
  x: Math.sin(time * freqX + phase) * ampX,
  y: Math.cos(time * freqY + phase) * ampY,
});

/** Deterministic pseudo-random position from a seed value. */
export const seededPosition = (
  seed: number,
  factor: number,
  range: number,
  offset: number,
): number => offset + (Math.sin(seed * factor) * 0.5 + 0.5) * range;

/** Smooth fade-in/out based on phase (0-1 cycle). */
export const fadeInOut = (phase: number, rampSpeed = 8): number => {
  const fadeIn = Math.min(1, phase * rampSpeed);
  const fadeOut = Math.min(1, (1 - phase) * rampSpeed);
  return Math.min(fadeIn, fadeOut);
};
