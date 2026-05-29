/**
 * Diplopia (double vision) functions
 */
export const DIPLOPIA_FUNCTIONS = `
  vec3 applyMonocularDiplopia(vec3 color, vec2 uv, float intensity, float separation, float direction) {
    if (intensity <= 0.0) return color;
    vec2 offset = vec2(0.0);
    if (direction < 0.5) {
      offset = vec2(separation * intensity * 0.1, 0.0);
    } else if (direction < 1.5) {
      offset = vec2(0.0, separation * intensity * 0.1);
    } else {
      offset = vec2(separation * intensity * 0.07, separation * intensity * 0.07);
    }
    vec3 originalColor = color;
    vec2 ghostUv = uv + offset;
    vec3 ghostColor = texture2D(tDiffuse, ghostUv).rgb;
    vec3 blurredGhost = vec3(0.0);
    float totalWeight = 0.0;
    for(float x = -2.0; x <= 2.0; x++) {
      for(float y = -2.0; y <= 2.0; y++) {
        float weight = 1.0 / (1.0 + x * x + y * y);
        vec2 sampleUv = ghostUv + vec2(x, y) * vec2(1.0) / vec2(textureSize(tDiffuse, 0)) * 2.0;
        blurredGhost += texture2D(tDiffuse, sampleUv).rgb * weight;
        totalWeight += weight;
      }
    }
    blurredGhost /= totalWeight;
    float luminance = dot(blurredGhost, vec3(0.299, 0.587, 0.114));
    blurredGhost = mix(blurredGhost, vec3(luminance), 0.2);
    float ghostOpacity = 0.3 + intensity * 0.2;
    return mix(originalColor, blurredGhost, ghostOpacity);
  }

  vec3 applyBinocularDiplopia(vec3 color, vec2 uv, float intensity, float separation, float direction) {
    if (intensity <= 0.0) return color;
    vec2 offset = vec2(0.0);
    if (direction < 0.5) {
      offset = vec2(separation * intensity * 0.2, 0.0);
    } else if (direction < 1.5) {
      offset = vec2(0.0, separation * intensity * 0.2);
    } else {
      offset = vec2(separation * intensity * 0.14, separation * intensity * 0.14);
    }
    vec3 originalColor = color;
    vec2 secondUv = uv + offset;
    vec3 secondColor = texture2D(tDiffuse, secondUv).rgb;
    return mix(originalColor, secondColor, 0.5);
  }
`;
