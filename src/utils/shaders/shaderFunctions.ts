/**
 * Shader function code for color blindness effects
 * Using Machado, Oliveira & Fernandes 2009 matrices for accurate simulation
 */
export const COLOR_BLINDNESS_FUNCTIONS = `
  // sRGB gamma correction functions for accurate color simulation
  vec3 srgbToLinear(vec3 srgb) {
    vec3 linear;
    linear.r = srgb.r <= 0.04045 ? srgb.r / 12.92 : pow((srgb.r + 0.055) / 1.055, 2.4);
    linear.g = srgb.g <= 0.04045 ? srgb.g / 12.92 : pow((srgb.g + 0.055) / 1.055, 2.4);
    linear.b = srgb.b <= 0.04045 ? srgb.b / 12.92 : pow((srgb.b + 0.055) / 1.055, 2.4);
    return linear;
  }

  vec3 linearToSrgb(vec3 linear) {
    vec3 srgb;
    srgb.r = linear.r <= 0.0031308 ? 12.92 * linear.r : 1.055 * pow(linear.r, 1.0/2.4) - 0.055;
    srgb.g = linear.g <= 0.0031308 ? 12.92 * linear.g : 1.055 * pow(linear.g, 1.0/2.4) - 0.055;
    srgb.b = linear.b <= 0.0031308 ? 12.92 * linear.b : 1.055 * pow(linear.b, 1.0/2.4) - 0.055;
    return clamp(srgb, 0.0, 1.0);
  }

  vec3 applyProtanopia(vec3 color) {
    // Convert to linear RGB for accurate matrix transformation
    vec3 linear = srgbToLinear(color);
    // Machado, Oliveira & Fernandes 2009 protanopia matrix
    vec3 result = vec3(
      0.152286 * linear.r + 1.052583 * linear.g - 0.204868 * linear.b,
      0.114503 * linear.r + 0.786281 * linear.g + 0.099216 * linear.b,
     -0.003882 * linear.r - 0.048116 * linear.g + 1.051998 * linear.b
    );
    return linearToSrgb(result);
  }

  vec3 applyDeuteranopia(vec3 color) {
    // Convert to linear RGB for accurate matrix transformation
    vec3 linear = srgbToLinear(color);
    // Machado, Oliveira & Fernandes 2009 deuteranopia matrix
    vec3 result = vec3(
      0.367322 * linear.r + 0.860646 * linear.g - 0.227968 * linear.b,
      0.280085 * linear.r + 0.672501 * linear.g + 0.047413 * linear.b,
     -0.011820 * linear.r + 0.042940 * linear.g + 0.968881 * linear.b
    );
    return linearToSrgb(result);
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

    // Convert to linear RGB
    vec3 linear = srgbToLinear(color);

    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);

    // Machado 2009 protanopia endpoint matrix
    vec3 protanopiaR = vec3(0.152286, 1.052583, -0.204868);
    vec3 protanopiaG = vec3(0.114503, 0.786281, 0.099216);
    vec3 protanopiaB = vec3(-0.003882, -0.048116, 1.051998);

    vec3 r = mix(normalR, protanopiaR, scaledIntensity);
    vec3 g = mix(normalG, protanopiaG, scaledIntensity);
    vec3 b = mix(normalB, protanopiaB, scaledIntensity);

    vec3 result = vec3(
      dot(linear, r),
      dot(linear, g),
      dot(linear, b)
    );
    return linearToSrgb(result);
  }

  vec3 applyDeuteranomaly(vec3 color, float intensity) {
    float t = intensity;
    float scaledIntensity = t * t * (3.0 - 2.0 * t);

    // Convert to linear RGB
    vec3 linear = srgbToLinear(color);

    vec3 normalR = vec3(1.000, 0.000, 0.000);
    vec3 normalG = vec3(0.000, 1.000, 0.000);
    vec3 normalB = vec3(0.000, 0.000, 1.000);

    // Machado 2009 deuteranopia endpoint matrix
    vec3 deuteranopiaR = vec3(0.367322, 0.860646, -0.227968);
    vec3 deuteranopiaG = vec3(0.280085, 0.672501, 0.047413);
    vec3 deuteranopiaB = vec3(-0.011820, 0.042940, 0.968881);

    vec3 r = mix(normalR, deuteranopiaR, scaledIntensity);
    vec3 g = mix(normalG, deuteranopiaG, scaledIntensity);
    vec3 b = mix(normalB, deuteranopiaB, scaledIntensity);

    vec3 result = vec3(
      dot(linear, r),
      dot(linear, g),
      dot(linear, b)
    );
    return linearToSrgb(result);
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
    
    return vec3(
      dot(color, r),
      dot(color, g),
      dot(color, b)
    );
  }
`;

