/**
 * John Milton-specific effect functions
 */
export const MILTON_FUNCTIONS = `
  vec3 applyMiltonGlaucomaHalos(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    if (brightness > 0.4) {
      vec2 center1 = vec2(0.5, 0.5);
      vec2 center2 = vec2(0.3, 0.4);
      vec2 center3 = vec2(0.7, 0.6);
      float dist1 = distance(uv, center1);
      float dist2 = distance(uv, center2);
      float dist3 = distance(uv, center3);
      for (int i = 0; i < 3; i++) {
        vec2 center = i == 0 ? center1 : (i == 1 ? center2 : center3);
        float dist = i == 0 ? dist1 : (i == 1 ? dist2 : dist3);
        float innerHalo = smoothstep(0.08, 0.12, dist) * (1.0 - smoothstep(0.12, 0.16, dist));
        vec3 innerHaloColor = vec3(0.8, 0.7, 0.9) * 0.3;
        result = mix(result, result + innerHaloColor, innerHalo * intensity * 0.4);
        float middleHalo = smoothstep(0.12, 0.16, dist) * (1.0 - smoothstep(0.16, 0.20, dist));
        vec3 middleHaloColor = vec3(0.7, 0.8, 0.7) * 0.25;
        result = mix(result, result + middleHaloColor, middleHalo * intensity * 0.3);
        float outerHalo = smoothstep(0.16, 0.20, dist) * (1.0 - smoothstep(0.20, 0.24, dist));
        vec3 outerHaloColor = vec3(0.9, 0.7, 0.6) * 0.2;
        result = mix(result, result + outerHaloColor, outerHalo * intensity * 0.25);
      }
    }
    float shimmer = sin(time * 1.5 + uv.x * 10.0 + uv.y * 8.0) * 0.05 * intensity;
    result += vec3(shimmer * 0.1, shimmer * 0.05, shimmer * 0.15);
    result = mix(color, result, intensity * 0.8);
    return result;
  }

  vec3 applyMiltonProgressiveVignetting(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    float tunnelRadius = 0.4 - intensity * 0.35;
    float angle = atan(uv.y - center.y, uv.x - center.x);
    float irregularity = sin(angle * 6.0 + time * 0.2) * 0.03 * intensity;
    tunnelRadius += irregularity;
    float tunnelMask = smoothstep(tunnelRadius, tunnelRadius + 0.08, dist);
    float distanceDarkening = smoothstep(tunnelRadius + 0.05, tunnelRadius + 0.15, dist);
    tunnelMask = min(tunnelMask, 1.0 - distanceDarkening * 0.8);
    return mix(vec3(0.0), color, tunnelMask);
  }

  vec3 applyMiltonScotomas(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    for (int i = 0; i < 6; i++) {
      float scotomaX = 0.2 + float(i) * 0.12 + sin(time * 0.3 + float(i)) * 0.08;
      float scotomaY = 0.3 + float(i) * 0.1 + cos(time * 0.4 + float(i)) * 0.06;
      float scotomaSize = 0.03 + intensity * 0.04;
      vec2 scotomaCenter = vec2(scotomaX, scotomaY);
      vec2 offset = uv - scotomaCenter;
      float angle = atan(offset.y, offset.x);
      float irregularity = sin(angle * 5.0 + time * 0.5) * 0.01;
      float scotomaDist = length(offset) + irregularity;
      float scotomaEffect = smoothstep(scotomaSize, scotomaSize + 0.02, scotomaDist);
      result = mix(vec3(0.0), result, scotomaEffect);
    }
    return result;
  }

  vec3 applyMiltonRetinalDetachment(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    float topCurtain = smoothstep(0.0, 0.3, uv.y) * (1.0 - smoothstep(0.3, 0.4, uv.y));
    result = mix(result * 0.2, result, 1.0 - topCurtain * intensity);
    float leftCurtain = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.2, 0.3, uv.x));
    float rightCurtain = smoothstep(0.7, 0.8, uv.x) * (1.0 - smoothstep(0.8, 1.0, uv.x));
    result = mix(result * 0.3, result, 1.0 - leftCurtain * intensity * 0.7);
    result = mix(result * 0.3, result, 1.0 - rightCurtain * intensity * 0.7);
    if (intensity > 0.3) {
      vec2 distortion = vec2(
        sin(uv.y * 10.0 + time * 0.5) * 0.01 * intensity,
        cos(uv.x * 8.0 + time * 0.3) * 0.008 * intensity
      );
      vec3 distortedColor = texture2D(tDiffuse, uv + distortion).rgb;
      result = mix(result, distortedColor, intensity * 0.3);
    }
    return result;
  }

  vec3 applyMiltonPhotophobia(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    result = result * (1.0 + intensity * 2.0);
    float whiteOverlay = intensity * 0.6;
    result = mix(result, vec3(1.0), whiteOverlay);
    float flicker = sin(time * 8.0) * 0.1 * intensity;
    result += vec3(flicker);
    float contrastReduction = intensity * 0.7;
    float avgLuminance = 0.8;
    result = mix(vec3(avgLuminance), result, 1.0 - contrastReduction);
    return result;
  }

  vec3 applyMiltonTemporalFieldLoss(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    float leftLoss = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.2, 0.3, uv.x));
    result = mix(vec3(0.0), result, 1.0 - leftLoss * intensity);
    float rightLoss = smoothstep(0.7, 0.8, uv.x) * (1.0 - smoothstep(0.8, 1.0, uv.x));
    result = mix(vec3(0.0), result, 1.0 - rightLoss * intensity);
    float progression = sin(time * 0.5) * 0.1 + 0.9;
    result = mix(vec3(0.0), result, progression);
    return result;
  }

  vec3 applyMiltonProgressiveBlindness(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    if (intensity > 0.0) {
      result = applyMiltonGlaucomaHalos(result, uv, min(intensity * 2.0, 1.0), time);
      result = applyMiltonTemporalFieldLoss(result, uv, min(intensity * 1.5, 1.0), time);
    }
    if (intensity > 0.3) {
      result = applyMiltonScotomas(result, uv, (intensity - 0.3) * 2.5, time);
      result = applyMiltonProgressiveVignetting(result, uv, (intensity - 0.3) * 2.5, time);
    }
    if (intensity > 0.7) {
      result = applyMiltonRetinalDetachment(result, uv, (intensity - 0.7) * 3.33, time);
      result = applyMiltonPhotophobia(result, uv, (intensity - 0.7) * 3.33, time);
    }
    if (intensity >= 1.0) {
      result = vec3(0.0);
    }
    return result;
  }
`;
