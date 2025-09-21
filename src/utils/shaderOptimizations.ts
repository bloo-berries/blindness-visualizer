/**
 * Shader optimization utilities
 * Provides reusable shader functions and patterns
 */

/**
 * Common shader patterns and utilities
 */
export const SHADER_PATTERNS = {
  // Common desaturation patterns
  DESATURATION: `
    vec3 desaturate(vec3 color, float amount) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      return mix(color, vec3(luminance), amount);
    }
  `,

  // Common vignette patterns
  VIGNETTE: `
    float createVignette(vec2 uv, float intensity) {
      float dist = distance(uv, vec2(0.5, 0.5));
      return smoothstep(0.7, 1.0, dist * intensity);
    }
  `
};

/**
 * Optimized shader function generators
 */
export const generateOptimizedShader = {
  /**
   * Generates optimized color matrix application
   */
  colorMatrix: (matrixName: string) => {
    return `
    vec3 applyColorMatrix(vec3 color, float intensity) {
      mat3 matrix = ${matrixName};
      vec3 result = matrix * color;
      return mix(color, result, intensity);
    }
    `;
  }
};

/**
 * Shader performance optimizations
 */
export const SHADER_OPTIMIZATIONS = {
  // Pre-calculate common values
  PRECALCULATED_VALUES: `
    // Pre-calculate common values to avoid repeated calculations
    vec2 center = vec2(0.5, 0.5);
    float time = uTime;
    float intensity = uIntensity;
  `,

  // Branchless conditionals where possible
  BRANCHLESS_CONDITIONALS: `
    // Use mix instead of if/else when possible
    float condition = step(threshold, value);
    result = mix(valueA, valueB, condition);
  `
};
