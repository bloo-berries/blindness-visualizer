/**
 * Retinal condition functions (RP, Stargardt, AMD, Diabetic Retinopathy)
 */
export const RETINAL_FUNCTIONS = `
  vec3 applyRetinitisPigmentosa(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity >= 1.0) { return vec3(0.0); }
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    vec2 tunnelCenter = center + vec2(
      sin(uv.y * 4.0 + time * 0.1) * 0.02,
      cos(uv.x * 3.0 + time * 0.08) * 0.015
    );
    vec2 tunnelOffset = (uv - tunnelCenter) * vec2(1.0, 1.3);
    float tunnelDist = length(tunnelOffset);
    float irregularity = sin(atan(tunnelOffset.y, tunnelOffset.x) * 8.0 + time * 0.2) * 0.05;
    tunnelDist += irregularity;
    float tunnelRadius = 0.08 - intensity * 0.075;
    float tunnelEffect = smoothstep(tunnelRadius, tunnelRadius + 0.04, tunnelDist);
    float nightBlindness = 1.0 - intensity * 0.4;
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    float desaturationAmount = intensity * 0.6;
    vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
    vec3 result = desaturated * nightBlindness;
    float tunnelMask = 1.0 - smoothstep(tunnelRadius - 0.02, tunnelRadius + 0.08, tunnelDist);
    result = mix(vec3(0.0), result, tunnelMask);
    float distanceDarkening = smoothstep(tunnelRadius + 0.05, tunnelRadius + 0.15, tunnelDist);
    result = mix(result, vec3(0.0), distanceDarkening * 0.95);
    if (intensity > 0.7) {
      float finalDarkening = (intensity - 0.7) * 3.33;
      result = mix(result, vec3(0.0), finalDarkening);
    }
    return result;
  }

  vec3 applyStargardt(vec3 color, vec2 uv, float intensity) {
    if (intensity <= 0.0) return color;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    float scotomaRadius = 0.17 + intensity * 0.53;
    float scotomaEffect = smoothstep(scotomaRadius - 0.05, scotomaRadius + 0.05, dist);
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    float desaturationAmount = intensity * 0.4;
    vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
    vec3 veryDark = vec3(0.04, 0.04, 0.04);
    float opaqueEffect = smoothstep(scotomaRadius - 0.02, scotomaRadius + 0.02, dist);
    return mix(veryDark, desaturated, opaqueEffect);
  }

  vec3 applyAMD(vec3 color, vec2 uv, float intensity) {
    if (intensity <= 0.0) return color;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    float scotomaRadius = 0.15 + intensity * 0.25;
    float irregularity = sin(atan(uv.y - 0.5, uv.x - 0.5) * 6.0) * 0.02;
    float scotomaEffect = smoothstep(scotomaRadius - 0.05 + irregularity, scotomaRadius + 0.05 + irregularity, dist);
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    float desaturationAmount = intensity * 0.6;
    vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
    float darkening = 1.0 - intensity * 0.3;
    desaturated *= darkening;
    return mix(vec3(0.0), desaturated, scotomaEffect);
  }

  vec3 applyDiabeticRetinopathy(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    float blurAmount = intensity * 0.8;
    vec3 result = color;
    if (blurAmount > 0.0) {
      vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
      vec3 blurred = vec3(0.0);
      float total = 0.0;
      for(float x = -3.0; x <= 3.0; x++) {
        for(float y = -3.0; y <= 3.0; y++) {
          float weight = 1.0 / (1.0 + x * x + y * y);
          blurred += texture2D(tDiffuse, uv + vec2(x, y) * pixelSize * blurAmount).rgb * weight;
          total += weight;
        }
      }
      blurred /= total;
      result = blurred;
    }
    float scotomaMask = 1.0;
    vec2 center1 = vec2(0.5, 0.4);
    float dist1 = distance(uv, center1);
    float scotoma1 = smoothstep(0.15 + intensity * 0.1, 0.25 + intensity * 0.15, dist1);
    vec2 center2 = vec2(0.3, 0.6);
    float dist2 = distance(uv, center2);
    float scotoma2 = smoothstep(0.12 + intensity * 0.08, 0.2 + intensity * 0.12, dist2);
    vec2 center3 = vec2(0.7, 0.3);
    float dist3 = distance(uv, center3);
    float scotoma3 = smoothstep(0.08 + intensity * 0.06, 0.15 + intensity * 0.1, dist3);
    vec2 center4 = vec2(0.2, 0.2);
    float dist4 = distance(uv, center4);
    float scotoma4 = smoothstep(0.06 + intensity * 0.04, 0.12 + intensity * 0.08, dist4);
    vec2 center5 = vec2(0.8, 0.7);
    float dist5 = distance(uv, center5);
    float scotoma5 = smoothstep(0.05 + intensity * 0.03, 0.1 + intensity * 0.06, dist5);
    scotomaMask = min(scotoma1, min(scotoma2, min(scotoma3, min(scotoma4, scotoma5))));
    float scotomaIntensity = 1.0 - intensity * 0.9;
    result = mix(result * 0.05, result, scotomaMask);
    float luminance = dot(result, vec3(0.299, 0.587, 0.114));
    float desaturationAmount = intensity * 0.6;
    result = mix(result, vec3(luminance), desaturationAmount);
    return result;
  }
`;
