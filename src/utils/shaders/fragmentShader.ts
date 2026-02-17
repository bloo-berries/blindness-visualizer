/**
 * Fragment shader for color blindness and vision condition simulation
 * This file contains all GLSL shader code separated from the material setup
 */

/**
 * Uniform declarations for all vision condition intensities
 */
export const UNIFORM_DECLARATIONS = `
  uniform sampler2D tDiffuse;
  uniform float protanopiaIntensity;
  uniform float deuteranopiaIntensity;
  uniform float tritanopiaIntensity;
  uniform float protanomalyIntensity;
  uniform float deuteranomalyIntensity;
  uniform float tritanomalyIntensity;
  uniform float retinitisPigmentosaIntensity;
  uniform float diplopiaMonocularIntensity;
  uniform float diplopiaBinocularIntensity;
  uniform float diplopiaSeparation;
  uniform float diplopiaDirection;
  uniform float stargardtIntensity;
  uniform float amdIntensity;
  uniform float diabeticRetinopathyIntensity;
  uniform float glaucomaIntensity;
  uniform float time;
  // John Milton-specific effects
  uniform float miltonGlaucomaHalosIntensity;
  uniform float miltonProgressiveVignettingIntensity;
  uniform float miltonScotomasIntensity;
  uniform float miltonRetinalDetachmentIntensity;
  uniform float miltonPhotophobiaIntensity;
  uniform float miltonTemporalFieldLossIntensity;
  uniform float miltonProgressiveBlindnessIntensity;
  // Galileo Galilei-specific effects
  uniform float galileoAcuteHalosIntensity;
  uniform float galileoSevereBlurringIntensity;
  uniform float galileoRedEyeEffectIntensity;
  uniform float galileoExtremePhotophobiaIntensity;
  uniform float galileoCornealHazinessIntensity;
  uniform float galileoSectoralDefectsIntensity;
  uniform float galileoArcuateScotomasIntensity;
  uniform float galileoSwissCheeseVisionIntensity;
  uniform float galileoAcuteAttackModeIntensity;
  uniform float galileoChronicProgressionIntensity;
  varying vec2 vUv;
`;

/**
 * Color blindness transformation functions (protanopia, deuteranopia, tritanopia)
 */
export const COLOR_BLINDNESS_FUNCTIONS = `
  vec3 applyProtanopia(vec3 color) {
    return vec3(
      0.567 * color.r + 0.433 * color.g + 0.000 * color.b,
      0.558 * color.r + 0.442 * color.g + 0.000 * color.b,
      0.000 * color.r + 0.242 * color.g + 0.758 * color.b
    );
  }

  vec3 applyDeuteranopia(vec3 color) {
    return vec3(
      0.625 * color.r + 0.375 * color.g + 0.000 * color.b,
      0.700 * color.r + 0.300 * color.g + 0.000 * color.b,
      0.000 * color.r + 0.300 * color.g + 0.700 * color.b
    );
  }

  vec3 applyTritanopia(vec3 color) {
    return vec3(
      0.950 * color.r + 0.050 * color.g + 0.000 * color.b,
      0.000 * color.r + 0.433 * color.g + 0.567 * color.b,
      0.000 * color.r + 0.475 * color.g + 0.525 * color.b
    );
  }

  vec3 applyProtanomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 protanopiaR = vec3(0.567, 0.433, 0.000);
    vec3 protanopiaG = vec3(0.558, 0.442, 0.000);
    vec3 protanopiaB = vec3(0.000, 0.242, 0.758);
    vec3 r = mix(normalR, protanopiaR, scaledIntensity);
    vec3 g = mix(normalG, protanopiaG, scaledIntensity);
    vec3 b = mix(normalB, protanopiaB, scaledIntensity);
    return vec3(dot(color, r), dot(color, g), dot(color, b));
  }

  vec3 applyDeuteranomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 deuteranopiaR = vec3(0.625, 0.375, 0.000);
    vec3 deuteranopiaG = vec3(0.700, 0.300, 0.000);
    vec3 deuteranopiaB = vec3(0.000, 0.300, 0.700);
    vec3 r = mix(normalR, deuteranopiaR, scaledIntensity);
    vec3 g = mix(normalG, deuteranopiaG, scaledIntensity);
    vec3 b = mix(normalB, deuteranopiaB, scaledIntensity);
    return vec3(dot(color, r), dot(color, g), dot(color, b));
  }

  vec3 applyTritanomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 mildR = vec3(0.900, 0.100, 0.000);
    vec3 mildG = vec3(0.000, 0.800, 0.200);
    vec3 mildB = vec3(0.000, 0.200, 0.800);
    vec3 moderateR = vec3(0.950, 0.050, 0.000);
    vec3 moderateG = vec3(0.000, 0.600, 0.400);
    vec3 moderateB = vec3(0.000, 0.400, 0.600);
    vec3 severeR = vec3(0.950, 0.050, 0.000);
    vec3 severeG = vec3(0.000, 0.433, 0.567);
    vec3 severeB = vec3(0.000, 0.475, 0.525);
    vec3 r, g, b;
    if (scaledIntensity < 0.33) {
      float localT = scaledIntensity / 0.33;
      r = mix(normalR, mildR, localT);
      g = mix(normalG, mildG, localT);
      b = mix(normalB, mildB, localT);
    } else if (scaledIntensity < 0.66) {
      float localT = (scaledIntensity - 0.33) / 0.33;
      r = mix(mildR, moderateR, localT);
      g = mix(mildG, moderateG, localT);
      b = mix(mildB, moderateB, localT);
    } else {
      float localT = (scaledIntensity - 0.66) / 0.34;
      r = mix(moderateR, severeR, localT);
      g = mix(moderateG, severeG, localT);
      b = mix(moderateB, severeB, localT);
    }
    return vec3(dot(color, r), dot(color, g), dot(color, b));
  }
`;

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

/**
 * Utility functions (noise, blur)
 */
export const UTILITY_FUNCTIONS = `
  float simpleNoise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 gaussianBlur(sampler2D tex, vec2 uv, float sigma) {
    vec2 pixelSize = vec2(1.0) / vec2(textureSize(tex, 0));
    vec3 result = vec3(0.0);
    float total = 0.0;
    int samples = int(sigma * 3.0);
    for(int x = -samples; x <= samples; x++) {
      for(int y = -samples; y <= samples; y++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize;
        float weight = exp(-(float(x*x + y*y)) / (2.0 * sigma * sigma));
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

/**
 * Galileo Galilei-specific effect functions
 */
export const GALILEO_FUNCTIONS = `
  vec3 applyGalileoAcuteHalos(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    if (brightness > 0.3) {
      vec2 center1 = vec2(0.5, 0.5);
      vec2 center2 = vec2(0.3, 0.4);
      vec2 center3 = vec2(0.7, 0.6);
      for (int i = 0; i < 3; i++) {
        vec2 center = i == 0 ? center1 : (i == 1 ? center2 : center3);
        float dist = i == 0 ? distance(uv, center1) : (i == 1 ? distance(uv, center2) : distance(uv, center3));
        float pulse = 1.0 + 0.3 * sin(time * 3.0 + float(i) * 2.0);
        float adjustedDist = dist / pulse;
        float innerHalo = smoothstep(0.06, 0.10, adjustedDist) * (1.0 - smoothstep(0.10, 0.14, adjustedDist));
        vec3 innerHaloColor = vec3(0.9, 0.8, 1.0) * 0.6;
        result = mix(result, result + innerHaloColor, innerHalo * intensity * 0.8);
        float middleHalo = smoothstep(0.10, 0.14, adjustedDist) * (1.0 - smoothstep(0.14, 0.18, adjustedDist));
        vec3 middleHaloColor = vec3(0.8, 1.0, 0.8) * 0.5;
        result = mix(result, result + middleHaloColor, middleHalo * intensity * 0.7);
        float outerHalo = smoothstep(0.14, 0.18, adjustedDist) * (1.0 - smoothstep(0.18, 0.22, adjustedDist));
        vec3 outerHaloColor = vec3(1.0, 0.7, 0.6) * 0.4;
        result = mix(result, result + outerHaloColor, outerHalo * intensity * 0.6);
      }
    }
    float shimmer = sin(time * 2.0 + uv.x * 15.0 + uv.y * 12.0) * 0.1 * intensity;
    result += vec3(shimmer * 0.2, shimmer * 0.1, shimmer * 0.3);
    result = mix(color, result, intensity * 1.2);
    return result;
  }

  vec3 applyGalileoSevereBlurring(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
    vec3 blurred = vec3(0.0);
    float total = 0.0;
    float blurRadius = intensity * 8.0;
    for(float x = -blurRadius; x <= blurRadius; x += 1.0) {
      for(float y = -blurRadius; y <= blurRadius; y += 1.0) {
        float weight = 1.0 / (1.0 + (x * x + y * y) / (blurRadius * blurRadius));
        blurred += texture2D(tDiffuse, uv + vec2(x, y) * pixelSize).rgb * weight;
        total += weight;
      }
    }
    blurred /= total;
    vec3 fogColor = vec3(0.8, 0.8, 0.9);
    float fogAmount = intensity * 0.4;
    blurred = mix(blurred, fogColor, fogAmount);
    return mix(color, blurred, intensity);
  }

  vec3 applyGalileoRedEyeEffect(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 redTint = vec3(1.0, 0.7, 0.7);
    float bloodVesselPattern = sin(uv.x * 20.0 + time * 0.5) * sin(uv.y * 15.0 + time * 0.3) * 0.1;
    redTint += vec3(bloodVesselPattern * 0.3, 0.0, 0.0);
    float tintStrength = intensity * (0.6 + 0.4 * sin(time * 2.0));
    return mix(color, color * redTint, tintStrength);
  }

  vec3 applyGalileoExtremePhotophobia(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    float threshold = 0.4 - intensity * 0.3;
    if (brightness > threshold) {
      float whiteOutAmount = (brightness - threshold) / (1.0 - threshold);
      whiteOutAmount = pow(whiteOutAmount, 2.0);
      vec3 whiteOut = vec3(1.0, 1.0, 1.0);
      result = mix(result, whiteOut, whiteOutAmount * intensity * 0.8);
    }
    float edgeDistance = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeEffect = smoothstep(0.0, 0.1, edgeDistance);
    vec3 painColor = vec3(1.0, 0.3, 0.3);
    result = mix(painColor, result, edgeEffect * (1.0 - intensity * 0.3));
    return result;
  }

  vec3 applyGalileoCornealHaziness(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 hazeColor = vec3(0.95, 0.95, 1.0);
    float noise = sin(uv.x * 30.0 + time * 0.5) * sin(uv.y * 25.0 + time * 0.3) * 0.05;
    hazeColor += vec3(noise);
    float hazeIntensity = intensity * (0.7 + 0.3 * sin(time * 1.5));
    return mix(color, hazeColor, hazeIntensity * 0.6);
  }

  vec3 applyGalileoSectoralDefects(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    vec2 center = vec2(0.3, 0.2);
    float angle = atan(uv.y - center.y, uv.x - center.x);
    float dist = distance(uv, center);
    float sectorStart = -1.0;
    float sectorEnd = 0.5;
    float sectorWidth = 1.5;
    if (angle > sectorStart && angle < sectorEnd && dist < sectorWidth) {
      float sectorEffect = smoothstep(0.0, 0.3, dist) * (1.0 - smoothstep(0.3, sectorWidth, dist));
      result = mix(vec3(0.0), result, 1.0 - sectorEffect * intensity);
    }
    return result;
  }

  vec3 applyGalileoArcuateScotomas(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    for (int i = 0; i < 3; i++) {
      float arcCenterX = 0.5 + float(i) * 0.2 - 0.2;
      float arcCenterY = 0.5 + sin(float(i) * 2.0) * 0.1;
      float arcRadius = 0.2 + float(i) * 0.1;
      float arcAngle = atan(uv.y - arcCenterY, uv.x - arcCenterX);
      float arcDist = distance(uv, vec2(arcCenterX, arcCenterY));
      float arcStart = -1.0 + float(i) * 0.5;
      float arcEnd = arcStart + 1.0;
      if (arcAngle > arcStart && arcAngle < arcEnd &&
          arcDist > arcRadius - 0.05 && arcDist < arcRadius + 0.05) {
        float arcEffect = smoothstep(0.0, 0.1, abs(arcDist - arcRadius));
        result = mix(vec3(0.0), result, 1.0 - arcEffect * intensity * 0.8);
      }
    }
    return result;
  }

  vec3 applyGalileoSwissCheeseVision(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    for (int i = 0; i < 12; i++) {
      float spotX = 0.1 + float(i) * 0.08 + sin(time * 0.2 + float(i)) * 0.05;
      float spotY = 0.1 + float(i) * 0.07 + cos(time * 0.3 + float(i)) * 0.06;
      float spotSize = 0.03 + intensity * 0.04;
      float spotDist = distance(uv, vec2(spotX, spotY));
      float irregularity = sin(atan(uv.y - spotY, uv.x - spotX) * 6.0) * 0.02;
      spotDist += irregularity;
      float spotEffect = smoothstep(spotSize, spotSize + 0.01, spotDist);
      result = mix(vec3(0.0), result, spotEffect);
    }
    return result;
  }

  vec3 applyGalileoAcuteAttackMode(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    result = applyGalileoAcuteHalos(result, uv, intensity, time);
    result = applyGalileoSevereBlurring(result, uv, intensity, time);
    result = applyGalileoRedEyeEffect(result, uv, intensity, time);
    result = applyGalileoExtremePhotophobia(result, uv, intensity, time);
    result = applyGalileoCornealHaziness(result, uv, intensity, time);
    return result;
  }

  vec3 applyGalileoChronicProgression(vec3 color, vec2 uv, float intensity, float time) {
    if (intensity <= 0.0) return color;
    vec3 result = color;
    if (intensity > 0.0) {
      result = applyGalileoSectoralDefects(result, uv, min(intensity * 2.0, 1.0), time);
    }
    if (intensity > 0.3) {
      result = applyGalileoArcuateScotomas(result, uv, (intensity - 0.3) * 3.33, time);
    }
    if (intensity > 0.6) {
      result = applyGalileoSwissCheeseVision(result, uv, (intensity - 0.6) * 2.5, time);
      float centerDist = distance(uv, vec2(0.5, 0.5));
      float tunnelRadius = 0.3 - (intensity - 0.6) * 0.25;
      float tunnelEffect = smoothstep(tunnelRadius, tunnelRadius + 0.1, centerDist);
      result = mix(vec3(0.0), result, tunnelEffect);
    }
    return result;
  }
`;

/**
 * Main function that applies all effects
 */
export const MAIN_FUNCTION = `
  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;

    if (protanopiaIntensity > 0.0) {
      color = mix(color, applyProtanopia(color), protanopiaIntensity);
    }
    if (deuteranopiaIntensity > 0.0) {
      color = mix(color, applyDeuteranopia(color), deuteranopiaIntensity);
    }
    if (tritanopiaIntensity > 0.0) {
      color = mix(color, applyTritanopia(color), tritanopiaIntensity);
    }
    if (protanomalyIntensity > 0.0) {
      color = applyProtanomaly(color, protanomalyIntensity);
    }
    if (deuteranomalyIntensity > 0.0) {
      color = applyDeuteranomaly(color, deuteranomalyIntensity);
    }
    if (tritanomalyIntensity > 0.0) {
      color = applyTritanomaly(color, tritanomalyIntensity);
    }
    if (retinitisPigmentosaIntensity > 0.0) {
      color = applyRetinitisPigmentosa(color, vUv, retinitisPigmentosaIntensity, time);
    }
    if (diplopiaMonocularIntensity > 0.0) {
      color = applyMonocularDiplopia(color, vUv, diplopiaMonocularIntensity, diplopiaSeparation, diplopiaDirection);
    }
    if (diplopiaBinocularIntensity > 0.0) {
      color = applyBinocularDiplopia(color, vUv, diplopiaBinocularIntensity, diplopiaSeparation, diplopiaDirection);
    }
    if (stargardtIntensity > 0.0) {
      color = applyStargardt(color, vUv, stargardtIntensity);
    }
    if (amdIntensity > 0.0) {
      color = applyAMD(color, vUv, amdIntensity);
    }
    if (diabeticRetinopathyIntensity > 0.0) {
      color = applyDiabeticRetinopathy(color, vUv, diabeticRetinopathyIntensity, time);
    }
    if (glaucomaIntensity > 0.0) {
      color = applyGlaucoma(color, vUv, glaucomaIntensity, time);
    }
    if (miltonGlaucomaHalosIntensity > 0.0) {
      color = applyMiltonGlaucomaHalos(color, vUv, miltonGlaucomaHalosIntensity, time);
    }
    if (miltonProgressiveVignettingIntensity > 0.0) {
      color = applyMiltonProgressiveVignetting(color, vUv, miltonProgressiveVignettingIntensity, time);
    }
    if (miltonScotomasIntensity > 0.0) {
      color = applyMiltonScotomas(color, vUv, miltonScotomasIntensity, time);
    }
    if (miltonRetinalDetachmentIntensity > 0.0) {
      color = applyMiltonRetinalDetachment(color, vUv, miltonRetinalDetachmentIntensity, time);
    }
    if (miltonPhotophobiaIntensity > 0.0) {
      color = applyMiltonPhotophobia(color, vUv, miltonPhotophobiaIntensity, time);
    }
    if (miltonTemporalFieldLossIntensity > 0.0) {
      color = applyMiltonTemporalFieldLoss(color, vUv, miltonTemporalFieldLossIntensity, time);
    }
    if (miltonProgressiveBlindnessIntensity > 0.0) {
      color = applyMiltonProgressiveBlindness(color, vUv, miltonProgressiveBlindnessIntensity, time);
    }
    if (galileoAcuteHalosIntensity > 0.0) {
      color = applyGalileoAcuteHalos(color, vUv, galileoAcuteHalosIntensity, time);
    }
    if (galileoSevereBlurringIntensity > 0.0) {
      color = applyGalileoSevereBlurring(color, vUv, galileoSevereBlurringIntensity, time);
    }
    if (galileoRedEyeEffectIntensity > 0.0) {
      color = applyGalileoRedEyeEffect(color, vUv, galileoRedEyeEffectIntensity, time);
    }
    if (galileoExtremePhotophobiaIntensity > 0.0) {
      color = applyGalileoExtremePhotophobia(color, vUv, galileoExtremePhotophobiaIntensity, time);
    }
    if (galileoCornealHazinessIntensity > 0.0) {
      color = applyGalileoCornealHaziness(color, vUv, galileoCornealHazinessIntensity, time);
    }
    if (galileoSectoralDefectsIntensity > 0.0) {
      color = applyGalileoSectoralDefects(color, vUv, galileoSectoralDefectsIntensity, time);
    }
    if (galileoArcuateScotomasIntensity > 0.0) {
      color = applyGalileoArcuateScotomas(color, vUv, galileoArcuateScotomasIntensity, time);
    }
    if (galileoSwissCheeseVisionIntensity > 0.0) {
      color = applyGalileoSwissCheeseVision(color, vUv, galileoSwissCheeseVisionIntensity, time);
    }
    if (galileoAcuteAttackModeIntensity > 0.0) {
      color = applyGalileoAcuteAttackMode(color, vUv, galileoAcuteAttackModeIntensity, time);
    }
    if (galileoChronicProgressionIntensity > 0.0) {
      color = applyGalileoChronicProgression(color, vUv, galileoChronicProgressionIntensity, time);
    }

    gl_FragColor = vec4(color, texel.a);
  }
`;

/**
 * Combines all shader parts into the complete fragment shader
 */
export function getFragmentShader(): string {
  return `
    ${UNIFORM_DECLARATIONS}
    ${COLOR_BLINDNESS_FUNCTIONS}
    ${RETINAL_FUNCTIONS}
    ${DIPLOPIA_FUNCTIONS}
    ${UTILITY_FUNCTIONS}
    ${GLAUCOMA_FUNCTION}
    ${MILTON_FUNCTIONS}
    ${GALILEO_FUNCTIONS}
    ${MAIN_FUNCTION}
  `;
}
