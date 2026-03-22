/**
 * Glaucoma effect function
 */
export const GLAUCOMA_FUNCTION = `
  vec3 applyGlaucoma(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
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
    float peripheralBlurAmount = smoothstep(0.0, fieldRadius, dist) * 4.0 * intensity;
    if(peripheralBlurAmount > 0.5) {
      vec3 blurred = gaussianBlur(tDiffuse, uv, peripheralBlurAmount);
      result = mix(result, blurred, 0.5);
    }
    if(intensity > 0.3) {
      vec2 scotomaSeed = vec2(1.234, 5.678);
      float scotomaNoise = simpleNoise(uv * 4.0 + scotomaSeed);
      float scotomaThreshold = mix(1.0, 0.5, (intensity - 0.3) / 0.7);
      if(scotomaNoise > scotomaThreshold) {
        vec3 scotomaColor = mix(result, vec3(0.2), 0.8);
        float scotomaBlend = smoothstep(scotomaThreshold, scotomaThreshold + 0.1, scotomaNoise);
        result = mix(result, scotomaColor, scotomaBlend);
        vec3 scotomaBlurred = gaussianBlur(tDiffuse, uv, 15.0);
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
