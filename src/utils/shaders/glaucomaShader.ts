/**
 * Utility functions (noise, blur) and Glaucoma effect
 */

/**
 * Utility functions (noise, blur)
 */
export const UTILITY_FUNCTIONS = `
  float simpleNoise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = simpleNoise(i);
    float b = simpleNoise(i + vec2(1.0, 0.0));
    float c = simpleNoise(i + vec2(0.0, 1.0));
    float d = simpleNoise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  vec3 gaussianBlur(sampler2D tex, vec2 uv, float sigma) {
    vec2 pixelSize = vec2(1.0) / uResolution;
    float scale = max(sigma / 3.0, 1.0);
    vec3 result = vec3(0.0);
    float total = 0.0;
    for(int x = -3; x <= 3; x++) {
      for(int y = -3; y <= 3; y++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize * scale;
        float weight = exp(-(float(x*x + y*y)) / 18.0);
        result += texture2D(tex, uv + offset).rgb * weight;
        total += weight;
      }
    }
    return result / total;
  }
`;

/**
 * Glaucoma effect function
 */
export const GLAUCOMA_FUNCTION = `
  vec3 applyGlaucoma(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    float blurAmount = mix(0.0, 8.0, intensity);
    vec3 result = color;
    if(blurAmount > 0.1) {
      result = gaussianBlur(tDiffuse, uv, blurAmount);
    }
    float contrastFactor = mix(1.0, 0.5, intensity);
    result = mix(vec3(0.5), result, contrastFactor);
    float saturation = mix(1.0, 0.6, intensity);
    vec3 gray = vec3(dot(result, vec3(0.299, 0.587, 0.114)));
    result = mix(gray, result, saturation);
    float fieldRadius = mix(0.9, 0.2, intensity);
    float fadeWidth = fieldRadius * 0.2;
    float fadeStart = fieldRadius - fadeWidth;
    float visibility = 1.0 - smoothstep(fadeStart, fieldRadius, dist);
    float edgeDarkness = smoothstep(fadeStart, fieldRadius, dist);
    vec3 fadeColor = mix(vec3(0.3), vec3(0.15), edgeDarkness);
    result = mix(fadeColor, result, visibility);
    if(intensity > 0.3) {
      vec2 scotomaSeed = vec2(1.234, 5.678);
      float scotomaNoise = smoothNoise(uv * 4.0 + scotomaSeed);
      float scotomaThreshold = mix(1.0, 0.5, (intensity - 0.3) / 0.7);
      if(scotomaNoise > scotomaThreshold) {
        vec3 scotomaColor = mix(result, vec3(0.2), 0.8);
        float scotomaBlend = smoothstep(scotomaThreshold, scotomaThreshold + 0.1, scotomaNoise);
        result = mix(result, scotomaColor, scotomaBlend);
        vec3 scotomaBlurred = gaussianBlur(tDiffuse, uv, 6.0);
        result = mix(result, scotomaBlurred, scotomaBlend * 0.5);
      }
    }
    float glareSensitivity = mix(0.0, 0.3, intensity);
    vec3 highlights = max(result - vec3(0.7), vec3(0.0));
    result += highlights * glareSensitivity * 2.0;
    result = clamp(result, 0.0, 1.2);
    float grainAmount = mix(0.0, 0.03, intensity);
    float grain = (simpleNoise(uv * 500.0 + time * 0.1) - 0.5) * grainAmount;
    result += vec3(grain);
    result = clamp(result, 0.0, 1.0);
    return result;
  }
`;
