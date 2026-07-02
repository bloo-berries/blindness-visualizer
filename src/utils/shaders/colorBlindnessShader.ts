/**
 * Color blindness transformation functions (protanopia, deuteranopia, tritanopia)
 *
 * Uses Machado, Oliveira & Fernandes 2009 matrices applied in linear RGB space
 * for physiologically accurate simulation. Matches the SVG/CSS filter path
 * (colorVisionMatrices.ts) which also uses Machado 2009 with linearRGB.
 */
export const COLOR_BLINDNESS_FUNCTIONS = `
  float sRGBToLinear(float c) {
    return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4);
  }

  float linearToSRGB(float c) {
    return c <= 0.0031308 ? c * 12.92 : 1.055 * pow(c, 1.0 / 2.4) - 0.055;
  }

  vec3 toLinear(vec3 srgb) {
    return vec3(sRGBToLinear(srgb.r), sRGBToLinear(srgb.g), sRGBToLinear(srgb.b));
  }

  vec3 toSRGB(vec3 linear) {
    return vec3(linearToSRGB(linear.r), linearToSRGB(linear.g), linearToSRGB(linear.b));
  }

  vec3 applyProtanopia(vec3 color) {
    vec3 lin = toLinear(color);
    vec3 result = vec3(
      0.152286 * lin.r + 1.052583 * lin.g + -0.204868 * lin.b,
      0.114503 * lin.r + 0.786281 * lin.g +  0.099216 * lin.b,
     -0.003882 * lin.r + -0.048116 * lin.g +  1.051998 * lin.b
    );
    return toSRGB(clamp(result, 0.0, 1.0));
  }

  vec3 applyDeuteranopia(vec3 color) {
    vec3 lin = toLinear(color);
    vec3 result = vec3(
      0.367322 * lin.r +  0.860646 * lin.g + -0.227968 * lin.b,
      0.280085 * lin.r +  0.672501 * lin.g +  0.047413 * lin.b,
     -0.011820 * lin.r +  0.042940 * lin.g +  0.968881 * lin.b
    );
    return toSRGB(clamp(result, 0.0, 1.0));
  }

  vec3 applyTritanopia(vec3 color) {
    vec3 lin = toLinear(color);
    vec3 result = vec3(
      0.950 * lin.r + 0.050 * lin.g + 0.000 * lin.b,
      0.000 * lin.r + 0.433 * lin.g + 0.567 * lin.b,
      0.000 * lin.r + 0.475 * lin.g + 0.525 * lin.b
    );
    return toSRGB(clamp(result, 0.0, 1.0));
  }

  vec3 applyProtanomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 lin = toLinear(color);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 protanopiaR = vec3( 0.152286,  1.052583, -0.204868);
    vec3 protanopiaG = vec3( 0.114503,  0.786281,  0.099216);
    vec3 protanopiaB = vec3(-0.003882, -0.048116,  1.051998);
    vec3 r = mix(normalR, protanopiaR, scaledIntensity);
    vec3 g = mix(normalG, protanopiaG, scaledIntensity);
    vec3 b = mix(normalB, protanopiaB, scaledIntensity);
    vec3 result = vec3(dot(lin, r), dot(lin, g), dot(lin, b));
    return toSRGB(clamp(result, 0.0, 1.0));
  }

  vec3 applyDeuteranomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 lin = toLinear(color);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 deuteranopiaR = vec3( 0.367322,  0.860646, -0.227968);
    vec3 deuteranopiaG = vec3( 0.280085,  0.672501,  0.047413);
    vec3 deuteranopiaB = vec3(-0.011820,  0.042940,  0.968881);
    vec3 r = mix(normalR, deuteranopiaR, scaledIntensity);
    vec3 g = mix(normalG, deuteranopiaG, scaledIntensity);
    vec3 b = mix(normalB, deuteranopiaB, scaledIntensity);
    vec3 result = vec3(dot(lin, r), dot(lin, g), dot(lin, b));
    return toSRGB(clamp(result, 0.0, 1.0));
  }

  vec3 applyTritanomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);
    vec3 lin = toLinear(color);
    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);
    vec3 mildR = vec3(0.970, 0.030, 0.000);
    vec3 mildG = vec3(0.000, 0.900, 0.100);
    vec3 mildB = vec3(0.000, 0.100, 0.900);
    vec3 moderateR = vec3(0.950, 0.050, 0.000);
    vec3 moderateG = vec3(0.000, 0.800, 0.200);
    vec3 moderateB = vec3(0.000, 0.200, 0.800);
    vec3 severeR = vec3(0.950, 0.050, 0.000);
    vec3 severeG = vec3(0.000, 0.700, 0.300);
    vec3 severeB = vec3(0.000, 0.300, 0.700);
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
    vec3 result = vec3(dot(lin, r), dot(lin, g), dot(lin, b));
    return toSRGB(clamp(result, 0.0, 1.0));
  }
`;
