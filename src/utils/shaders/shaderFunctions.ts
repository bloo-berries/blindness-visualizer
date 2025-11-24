/**
 * Shader function code for color blindness effects
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
    
    return vec3(
      dot(color, r),
      dot(color, g),
      dot(color, b)
    );
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
    
    return vec3(
      dot(color, r),
      dot(color, g),
      dot(color, b)
    );
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

