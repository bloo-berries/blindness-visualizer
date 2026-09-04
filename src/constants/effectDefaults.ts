/**
 * Default intensity constants for visual effects.
 * Replaces magic numbers across effect definition files.
 */
export const INTENSITY = {
  /** Subtle effects like visual aura, myopia, keratoconus (0.5) */
  SUBTLE: 0.5,
  /** Standard default for most conditions (0.75) */
  STANDARD: 0.75,
  /** Full-strength effects like AMD, diabetic retinopathy (1.0) */
  SEVERE: 1.0,
} as const;
