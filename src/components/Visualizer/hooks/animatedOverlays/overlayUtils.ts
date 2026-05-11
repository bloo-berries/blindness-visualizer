/**
 * Shared utility functions for animated overlay generators.
 *
 * These helpers extract common CSS-gradient patterns used across multiple
 * overlay files (fujitora, juliaCarpenter, chirrut, blindspot, toph, kenshi,
 * daredevil, etc.) so that new overlays can reuse battle-tested primitives
 * without duplicating gradient math.
 *
 * IMPORTANT: Existing overlay generators have NOT been modified to use these
 * utilities — their hand-tuned gradient strings must remain untouched to
 * preserve visual correctness.  These utilities are provided for future
 * overlays and for any deliberate, manually-tested refactors.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Simple RGB color tuple used throughout the gradient helpers. */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/** Configuration for a single expanding ring gradient. */
export interface RingConfig {
  centerX: number;
  centerY: number;
  /** Current radius of the ring as a percentage of the container. */
  radius: number;
  /** Peak opacity of the ring (0-1). */
  opacity: number;
  color: RGBColor;
  /** Width of the visible ring band in percentage points.  @default 3 */
  thickness?: number;
}

/** Configuration for a set of staggered ripple rings. */
export interface RippleConfig {
  /** Current elapsed time in seconds. */
  time: number;
  /** Duration of one full expansion cycle in seconds. */
  cycleDuration: number;
  /** Number of concentric rings to generate. */
  ringCount: number;
  /** Maximum radius a ring reaches before fading out (percentage). */
  maxRadius: number;
  /** Starting radius for newly spawned rings.  @default 5 */
  minRadius?: number;
  centerX: number;
  centerY: number;
  color: RGBColor;
  /** Base opacity at the moment of spawn (before intensity scaling). */
  baseOpacity: number;
  /** Effect intensity multiplier (typically 0-1). */
  intensity: number;
  /** Per-ring thickness override.  @default 3 */
  thickness?: number;
}

/** Configuration for a radial vignette gradient. */
export interface VignetteConfig {
  color: RGBColor;
  /** Inner transparent radius as a percentage.  @default 55 */
  innerRadius?: number;
  /** Ellipse width percentage.  @default 130 */
  width?: number;
  /** Ellipse height percentage.  @default 110 */
  height?: number;
  /** Opacity at the inner-most color stop.  @default 0 */
  innerOpacity?: number;
  /** Opacity at the outer edge (100%). */
  outerOpacity: number;
  /** If provided, inserts a mid-point color stop between inner and outer. */
  midOpacity?: number;
}

/** Configuration for a soft elliptical glow node (detected presence / aura). */
export interface GlowNodeConfig {
  /** Horizontal center position (percentage). */
  x: number;
  /** Vertical center position (percentage). */
  y: number;
  /** Ellipse width (percentage). */
  width: number;
  /** Ellipse height (percentage). */
  height: number;
  color: RGBColor;
  /** Peak opacity at the node center. */
  opacity: number;
  /**
   * Opacity multipliers for the three gradient stops: [outer, mid, inner].
   * The outer stop (index 0) is at 0%, mid at 40%, inner at 70%.
   * @default [1, 0.7, 0.3]
   */
  stops?: [number, number, number];
}

// ---------------------------------------------------------------------------
// Gradient generators
// ---------------------------------------------------------------------------

/**
 * Generate a single radial-gradient ring at a given position and radius.
 *
 * Shared pattern found in fujitora (Haki ripples), juliaCarpenter (psychic
 * web pulses), chirrut (Force ripples), blindspot (sonar wavefronts), and
 * toph (seismic pings).
 *
 * The ring is rendered as a thin band of color that transitions:
 *   transparent -> half-opacity -> full opacity -> half-opacity -> transparent
 */
export const generateExpandingRing = (config: RingConfig): string => {
  const { centerX, centerY, radius, opacity, color, thickness = 3 } = config;
  const { r, g, b } = color;
  return (
    `radial-gradient(circle ${radius}% at ${centerX}% ${centerY}%, ` +
    `transparent ${Math.max(0, radius - thickness)}%, ` +
    `rgba(${r},${g},${b},${opacity * 0.6}) ${radius - 1.5}%, ` +
    `rgba(${r},${g},${b},${opacity}) ${radius}%, ` +
    `rgba(${r},${g},${b},${opacity * 0.6}) ${radius + 1.5}%, ` +
    `transparent ${radius + thickness}%)`
  );
};

/**
 * Generate an array of staggered expanding ring gradients.
 *
 * Wraps {@link generateExpandingRing} for the common "N rings evenly offset
 * in phase" pattern.  Each ring starts small, expands to `maxRadius`, and
 * fades out linearly as it grows.
 */
export const generateRippleRings = (config: RippleConfig): string[] => {
  const {
    time,
    cycleDuration,
    ringCount,
    maxRadius,
    minRadius = 5,
    centerX,
    centerY,
    color,
    baseOpacity,
    intensity,
    thickness,
  } = config;

  const rings: string[] = [];
  for (let i = 0; i < ringCount; i++) {
    const phase =
      ((time + cycleDuration * (i / ringCount)) % cycleDuration) /
      cycleDuration;
    const radius = minRadius + phase * maxRadius;
    const opacity = (1 - phase) * baseOpacity * intensity;
    rings.push(
      generateExpandingRing({ centerX, centerY, radius, opacity, color, thickness }),
    );
  }
  return rings;
};

/**
 * Generate a radial vignette gradient (darkening toward the edges).
 *
 * Shared by fujitora, juliaCarpenter, chirrut, and daredevil overlays.
 * Supports an optional `midOpacity` stop for smoother falloff.
 */
export const generateVignette = (config: VignetteConfig): string => {
  const {
    color,
    innerRadius = 55,
    width = 130,
    height = 110,
    innerOpacity = 0,
    outerOpacity,
    midOpacity,
  } = config;
  const { r, g, b } = color;

  if (midOpacity !== undefined) {
    const midStop = Math.round(innerRadius + (100 - innerRadius) * 0.5);
    return (
      `radial-gradient(ellipse ${width}% ${height}% at 50% 50%, ` +
      `rgba(${r},${g},${b},${innerOpacity}) ${innerRadius}%, ` +
      `rgba(${r},${g},${b},${midOpacity}) ${midStop}%, ` +
      `rgba(${r},${g},${b},${outerOpacity}) 100%)`
    );
  }

  return (
    `radial-gradient(ellipse ${width}% ${height}% at 50% 50%, ` +
    `transparent ${innerRadius}%, ` +
    `rgba(${r},${g},${b},${outerOpacity}) 100%)`
  );
};

/**
 * Generate a soft elliptical glow for a detected presence or aura node.
 *
 * Shared by fujitora (life-force auras), juliaCarpenter (psychic web nodes),
 * chirrut (Force presence glows), blindspot (sonar contacts), kenshi
 * (telekinetic sense nodes), and toph (seismic figure detection).
 *
 * The gradient has three color stops plus a transparent outer edge.
 */
export const generateGlowNode = (config: GlowNodeConfig): string => {
  const { x, y, width, height, color, opacity, stops = [1, 0.7, 0.3] } = config;
  const { r, g, b } = color;
  return (
    `radial-gradient(ellipse ${width}% ${height}% at ${x}% ${y}%, ` +
    `rgba(${r},${g},${b},${opacity * stops[0]}) 0%, ` +
    `rgba(${r},${g},${b},${opacity * stops[1]}) 40%, ` +
    `rgba(${r},${g},${b},${opacity * stops[2]}) 70%, ` +
    `transparent 100%)`
  );
};

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

/**
 * Compute a sinusoidal oscillation around a base position.
 *
 * Shared by all "sense" overlays (daredevil, fujitora, juliaCarpenter,
 * chirrut, blindspot, kenshi, toph) for slowly drifting detected-presence
 * positions.
 *
 * @param base      Center value to oscillate around.
 * @param time      Current elapsed time in seconds.
 * @param speed     Oscillation frequency multiplier.
 * @param amplitude Maximum deviation from `base`.
 * @param phase     Optional phase offset in radians.
 * @returns         The oscillated position value.
 */
export const driftPosition = (
  base: number,
  time: number,
  speed: number,
  amplitude: number,
  phase?: number,
): number => base + Math.sin(time * speed + (phase ?? 0)) * amplitude;

/**
 * Compute a 0-1 heartbeat pulse value at the given BPM.
 *
 * Uses a simple squared-sine curve to produce a smooth "throb" that
 * approximates a heartbeat.  Shared by fujitora, kenshi, and toph overlays
 * for pulsing detected-entity glows.
 *
 * @param time    Current elapsed time in seconds.
 * @param bpm     Beats per minute.  @default 72
 * @param offset  Phase offset in seconds.  @default 0
 * @returns       A value between 0 and 1.
 */
export const heartbeat = (
  time: number,
  bpm: number = 72,
  offset: number = 0,
): number => {
  const freq = bpm / 60;
  return Math.pow(Math.sin((time + offset) * freq * Math.PI), 2);
};
