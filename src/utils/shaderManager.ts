import * as THREE from 'three';
import { VisualEffect } from '../types/visualEffects';
import { createEffectMap, getEffectById } from './effectLookup';

/**
 * Creates a Three.js shader material for color blindness simulation
 * 
 * @returns A configured ShaderMaterial with color blindness effects
 */
export const createColorBlindnessShaderMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      protanopiaIntensity: { value: 0.0 },
      deuteranopiaIntensity: { value: 0.0 },
      tritanopiaIntensity: { value: 0.0 },
      protanomalyIntensity: { value: 0.0 },
      deuteranomalyIntensity: { value: 0.0 },
      tritanomalyIntensity: { value: 0.0 },
      retinitisPigmentosaIntensity: { value: 0.0 },
      diplopiaMonocularIntensity: { value: 0.0 },
      diplopiaBinocularIntensity: { value: 0.0 },
      diplopiaSeparation: { value: 0.1 },
      diplopiaDirection: { value: 0.0 }, // 0 = horizontal, 1 = vertical, 2 = diagonal
      stargardtIntensity: { value: 0.0 },
      amdIntensity: { value: 0.0 },
      diabeticRetinopathyIntensity: { value: 0.0 },
      glaucomaIntensity: { value: 0.0 },
      time: { value: 0.0 },
      // John Milton-specific effects
      miltonGlaucomaHalosIntensity: { value: 0.0 },
      miltonProgressiveVignettingIntensity: { value: 0.0 },
      miltonScotomasIntensity: { value: 0.0 },
      miltonRetinalDetachmentIntensity: { value: 0.0 },
      miltonPhotophobiaIntensity: { value: 0.0 },
      miltonTemporalFieldLossIntensity: { value: 0.0 },
      miltonProgressiveBlindnessIntensity: { value: 0.0 },
      // Galileo Galilei-specific effects
      galileoAcuteHalosIntensity: { value: 0.0 },
      galileoSevereBlurringIntensity: { value: 0.0 },
      galileoRedEyeEffectIntensity: { value: 0.0 },
      galileoExtremePhotophobiaIntensity: { value: 0.0 },
      galileoCornealHazinessIntensity: { value: 0.0 },
      galileoSectoralDefectsIntensity: { value: 0.0 },
      galileoArcuateScotomasIntensity: { value: 0.0 },
      galileoSwissCheeseVisionIntensity: { value: 0.0 },
      galileoAcuteAttackModeIntensity: { value: 0.0 },
      galileoChronicProgressionIntensity: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
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
        // Protanomaly severity matrices with improved scaling
        float t = intensity;
        
        // Apply exponential scaling for more pronounced effects
        float scaledIntensity = t * t * (3.0 - 2.0 * t); // Smooth step function
        
        // Normal vision matrix (identity)
        vec3 normalR = vec3(1.000, 0.000, 0.000);
        vec3 normalG = vec3(0.000, 1.000, 0.000);
        vec3 normalB = vec3(0.000, 0.000, 1.000);
        
        // Protanopia matrix (complete red blindness)
        vec3 protanopiaR = vec3(0.567, 0.433, 0.000);
        vec3 protanopiaG = vec3(0.558, 0.442, 0.000);
        vec3 protanopiaB = vec3(0.000, 0.242, 0.758);
        
        // Interpolate between normal and protanopia with improved scaling
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
        // Deuteranomaly severity matrices with improved scaling
        float t = intensity;
        
        // Apply exponential scaling for more pronounced effects
        float scaledIntensity = t * t * (3.0 - 2.0 * t); // Smooth step function
        
        // Normal vision matrix (identity)
        vec3 normalR = vec3(1.000, 0.000, 0.000);
        vec3 normalG = vec3(0.000, 1.000, 0.000);
        vec3 normalB = vec3(0.000, 0.000, 1.000);
        
        // Deuteranopia matrix (complete green blindness)
        vec3 deuteranopiaR = vec3(0.625, 0.375, 0.000);
        vec3 deuteranopiaG = vec3(0.700, 0.300, 0.000);
        vec3 deuteranopiaB = vec3(0.000, 0.300, 0.700);
        
        // Interpolate between normal and deuteranopia with improved scaling
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
        // Tritanomaly severity matrices matching CSS filter implementation
        // Use more aggressive scaling for better visual impact
        float t = intensity;
        
        // Apply exponential scaling to make higher intensities more pronounced
        float scaledIntensity = t * t * (3.0 - 2.0 * t); // Smooth step function for better scaling
        
        // Normal vision matrix (identity)
        vec3 normalR = vec3(1.000, 0.000, 0.000);
        vec3 normalG = vec3(0.000, 1.000, 0.000);
        vec3 normalB = vec3(0.000, 0.000, 1.000);
        
        // Mild tritanomaly (0.3 intensity equivalent)
        vec3 mildR = vec3(0.900, 0.100, 0.000);
        vec3 mildG = vec3(0.000, 0.800, 0.200);
        vec3 mildB = vec3(0.000, 0.200, 0.800);
        
        // Moderate tritanomaly (0.6 intensity equivalent)
        vec3 moderateR = vec3(0.950, 0.050, 0.000);
        vec3 moderateG = vec3(0.000, 0.600, 0.400);
        vec3 moderateB = vec3(0.000, 0.400, 0.600);
        
        // Severe tritanomaly/tritanopia (1.0 intensity)
        vec3 severeR = vec3(0.950, 0.050, 0.000);
        vec3 severeG = vec3(0.000, 0.433, 0.567);
        vec3 severeB = vec3(0.000, 0.475, 0.525);
        
        // Multi-stage interpolation for more pronounced effects
        vec3 r, g, b;
        if (scaledIntensity < 0.33) {
          // Interpolate between normal and mild
          float localT = scaledIntensity / 0.33;
          r = mix(normalR, mildR, localT);
          g = mix(normalG, mildG, localT);
          b = mix(normalB, mildB, localT);
        } else if (scaledIntensity < 0.66) {
          // Interpolate between mild and moderate
          float localT = (scaledIntensity - 0.33) / 0.33;
          r = mix(mildR, moderateR, localT);
          g = mix(mildG, moderateG, localT);
          b = mix(mildB, moderateB, localT);
        } else {
          // Interpolate between moderate and severe
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

      // Retinitis Pigmentosa effects
      vec3 applyRetinitisPigmentosa(vec3 color, vec2 uv, float intensity, float time) {
        // At 100% intensity, complete blindness
        if (intensity >= 1.0) {
          return vec3(0.0); // Complete black
        }
        
        // Calculate distance from center for tunnel vision effect
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        
        // Create irregular, asymmetrical tunnel shape based on reference images
        // The tunnel is more oval and irregular, not a perfect circle
        vec2 tunnelCenter = center + vec2(
          sin(uv.y * 4.0 + time * 0.1) * 0.02,  // Slight vertical offset
          cos(uv.x * 3.0 + time * 0.08) * 0.015  // Slight horizontal offset
        );
        
        // Create elliptical tunnel shape (wider horizontally, narrower vertically)
        vec2 tunnelOffset = (uv - tunnelCenter) * vec2(1.0, 1.3); // Make it more oval
        float tunnelDist = length(tunnelOffset);
        
        // Add irregular edges to the tunnel
        float irregularity = sin(atan(tunnelOffset.y, tunnelOffset.x) * 8.0 + time * 0.2) * 0.05;
        tunnelDist += irregularity;
        
        // Progressive tunnel vision - very severe constriction
        // At 100% intensity, tunnel should be extremely narrow (3-5% of screen)
        float tunnelRadius = 0.08 - intensity * 0.075; // From 8% to 0.5% (very narrow)
        
        // Create smooth transition from visible to dark
        float tunnelEffect = smoothstep(tunnelRadius, tunnelRadius + 0.04, tunnelDist);
        
        // Night blindness - progressively darken the entire image
        float nightBlindness = 1.0 - intensity * 0.4;
        
        // Color desaturation - more aggressive as intensity increases
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.6;
        vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
        
        // Apply tunnel vision effect with heavy darkening
        vec3 result = desaturated * nightBlindness;
        
        // Create the tunnel effect - darken everything outside the tunnel
        // Use a more gradual transition for a more realistic effect
        float tunnelMask = 1.0 - smoothstep(tunnelRadius - 0.02, tunnelRadius + 0.08, tunnelDist);
        result = mix(vec3(0.0), result, tunnelMask);
        
        // Add additional darkening for areas further from center
        float distanceDarkening = smoothstep(tunnelRadius + 0.05, tunnelRadius + 0.15, tunnelDist);
        result = mix(result, vec3(0.0), distanceDarkening * 0.95);
        
        // At very high intensities (>0.7), further darken everything including the tunnel
        if (intensity > 0.7) {
          float finalDarkening = (intensity - 0.7) * 3.33; // 0 to 1.0
          result = mix(result, vec3(0.0), finalDarkening);
        }
        
        return result;
      }

      // Monocular Diplopia effects
      vec3 applyMonocularDiplopia(vec3 color, vec2 uv, float intensity, float separation, float direction) {
        if (intensity <= 0.0) return color;
        
        // Calculate offset based on direction
        vec2 offset = vec2(0.0);
        if (direction < 0.5) {
          // Horizontal offset
          offset = vec2(separation * intensity * 0.1, 0.0);
        } else if (direction < 1.5) {
          // Vertical offset
          offset = vec2(0.0, separation * intensity * 0.1);
        } else {
          // Diagonal offset
          offset = vec2(separation * intensity * 0.07, separation * intensity * 0.07);
        }
        
        // Sample the original image
        vec3 originalColor = color;
        
        // Sample the ghost image with offset
        vec2 ghostUv = uv + offset;
        vec3 ghostColor = texture2D(tDiffuse, ghostUv).rgb;
        
        // Apply blur to ghost image
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
        
        // Desaturate ghost image slightly
        float luminance = dot(blurredGhost, vec3(0.299, 0.587, 0.114));
        blurredGhost = mix(blurredGhost, vec3(luminance), 0.2);
        
        // Combine original with ghost (30-50% opacity for ghost)
        float ghostOpacity = 0.3 + intensity * 0.2; // 30-50% opacity
        return mix(originalColor, blurredGhost, ghostOpacity);
      }

      // Binocular Diplopia effects
      vec3 applyBinocularDiplopia(vec3 color, vec2 uv, float intensity, float separation, float direction) {
        if (intensity <= 0.0) return color;
        
        // Calculate offset based on direction
        vec2 offset = vec2(0.0);
        if (direction < 0.5) {
          // Horizontal offset
          offset = vec2(separation * intensity * 0.2, 0.0);
        } else if (direction < 1.5) {
          // Vertical offset
          offset = vec2(0.0, separation * intensity * 0.2);
        } else {
          // Diagonal offset
          offset = vec2(separation * intensity * 0.14, separation * intensity * 0.14);
        }
        
        // Sample the original image
        vec3 originalColor = color;
        
        // Sample the second image with offset
        vec2 secondUv = uv + offset;
        vec3 secondColor = texture2D(tDiffuse, secondUv).rgb;
        
        // For binocular diplopia, both images are equally clear and solid
        // No blur or transparency - just two distinct images
        return mix(originalColor, secondColor, 0.5);
      }

      // Stargardt Disease effects
      vec3 applyStargardt(vec3 color, vec2 uv, float intensity) {
        if (intensity <= 0.0) return color;
        
        // Calculate distance from center for central vision loss
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        
        // Central scotoma - progressive loss of central vision
        float scotomaRadius = 0.17 + intensity * 0.53; // 17% to 70% of screen
        
        // Create central blind spot
        float scotomaEffect = smoothstep(scotomaRadius - 0.05, scotomaRadius + 0.05, dist);
        
        // Color desaturation
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.4;
        vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
        
        // Apply central vision loss with very dark color - similar to Retinitis Pigmentosa
        vec3 veryDark = vec3(0.04, 0.04, 0.04); // Very dark color (10,10,10 in RGB)
        // Make the scotoma much more opaque by reducing the mix factor
        float opaqueEffect = smoothstep(scotomaRadius - 0.02, scotomaRadius + 0.02, dist);
        return mix(veryDark, desaturated, opaqueEffect);
      }

      // Age-Related Macular Degeneration (AMD) effects
      vec3 applyAMD(vec3 color, vec2 uv, float intensity) {
        if (intensity <= 0.0) return color;
        
        // Calculate distance from center for central vision loss
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        
        // Central scotoma - more severe than Stargardt
        float scotomaRadius = 0.15 + intensity * 0.25; // 15% to 40% of screen
        
        // Create central blind spot with irregular edges
        float irregularity = sin(atan(uv.y - 0.5, uv.x - 0.5) * 6.0) * 0.02;
        float scotomaEffect = smoothstep(scotomaRadius - 0.05 + irregularity, scotomaRadius + 0.05 + irregularity, dist);
        
        // Color desaturation and darkening
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.6;
        vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
        
        // Progressive darkening
        float darkening = 1.0 - intensity * 0.3;
        desaturated *= darkening;
        
        // Apply central vision loss
        return mix(vec3(0.0), desaturated, scotomaEffect);
      }

      // Diabetic Retinopathy effects
      vec3 applyDiabeticRetinopathy(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        // First apply overall blur to the entire image
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
        
        // Create large, irregular scotomas (blind spots)
        float scotomaMask = 1.0;
        
        // Large central scotoma - irregular shape
        vec2 center1 = vec2(0.5, 0.4);
        float dist1 = distance(uv, center1);
        float scotoma1 = smoothstep(0.15 + intensity * 0.1, 0.25 + intensity * 0.15, dist1);
        
        // Second large scotoma - more irregular
        vec2 center2 = vec2(0.3, 0.6);
        float dist2 = distance(uv, center2);
        float scotoma2 = smoothstep(0.12 + intensity * 0.08, 0.2 + intensity * 0.12, dist2);
        
        // Third scotoma - smaller but still significant
        vec2 center3 = vec2(0.7, 0.3);
        float dist3 = distance(uv, center3);
        float scotoma3 = smoothstep(0.08 + intensity * 0.06, 0.15 + intensity * 0.1, dist3);
        
        // Additional smaller scotomas for more fragmentation
        vec2 center4 = vec2(0.2, 0.2);
        float dist4 = distance(uv, center4);
        float scotoma4 = smoothstep(0.06 + intensity * 0.04, 0.12 + intensity * 0.08, dist4);
        
        vec2 center5 = vec2(0.8, 0.7);
        float dist5 = distance(uv, center5);
        float scotoma5 = smoothstep(0.05 + intensity * 0.03, 0.1 + intensity * 0.06, dist5);
        
        // Combine all scotomas
        scotomaMask = min(scotoma1, min(scotoma2, min(scotoma3, min(scotoma4, scotoma5))));
        
        // Apply scotomas - make them very dark (almost black)
        float scotomaIntensity = 1.0 - intensity * 0.9;
        result = mix(result * 0.05, result, scotomaMask);
        
        // Overall color desaturation
        float luminance = dot(result, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.6;
        result = mix(result, vec3(luminance), desaturationAmount);
        
        return result;
      }

      // Simple noise function for scotomas and grain
      float simpleNoise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Gaussian blur helper
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

      // Glaucoma effects - Based on NIH research: NOT tunnel vision, but contrast loss, blur, fading periphery
      vec3 applyGlaucoma(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
        
        // ===== 1. BASE BLUR (clarity loss) - PRIMARY EFFECT =====
        float blurAmount = mix(0.0, 8.0, intensity);
        vec3 result = color;
        if(blurAmount > 0.1) {
          result = gaussianBlur(tDiffuse, uv, blurAmount);
        }
        
        // ===== 2. CONTRAST REDUCTION - PRIMARY EFFECT =====
        float contrastFactor = mix(1.0, 0.5, intensity);
        result = mix(vec3(0.5), result, contrastFactor);
        
        // ===== 3. SATURATION REDUCTION (color discrimination) =====
        float saturation = mix(1.0, 0.6, intensity);
        vec3 gray = vec3(dot(result, vec3(0.299, 0.587, 0.114)));
        result = mix(gray, result, saturation);
        
        // ===== 4. PERIPHERAL FIELD LOSS WITH FADE (NOT sharp cutoff) =====
        // Field radius shrinks with severity
        // Map severity to visual angle (normalized)
        float fieldRadius = mix(0.9, 0.2, intensity);
        float fadeWidth = fieldRadius * 0.2; // 20% fade zone
        float fadeStart = fieldRadius - fadeWidth;
        
        // Smooth fade - NOT sharp cutoff, but darker and more opaque at edges
        float visibility = 1.0 - smoothstep(fadeStart, fieldRadius, dist);
        
        // Fade to darker gray at edges - make it progressively darker towards periphery
        float edgeDarkness = smoothstep(fadeStart, fieldRadius, dist);
        vec3 fadeColor = mix(vec3(0.3), vec3(0.15), edgeDarkness); // Darker at edges (0.15 vs 0.3)
        result = mix(fadeColor, result, visibility);
        
        // ===== 5. ADDITIONAL PERIPHERAL BLUR =====
        // Vision is blurrier at edges even within visible field
        float peripheralBlurAmount = smoothstep(0.0, fieldRadius, dist) * 4.0 * intensity;
        if(peripheralBlurAmount > 0.5) {
          vec3 blurred = gaussianBlur(tDiffuse, uv, peripheralBlurAmount);
          result = mix(result, blurred, 0.5);
        }
        
        // ===== 6. SCOTOMAS (patchy blind spots) - NOT black holes =====
        if(intensity > 0.3) {
          // Create irregular scotoma pattern using noise
          vec2 scotomaSeed = vec2(1.234, 5.678);
          float scotomaNoise = simpleNoise(uv * 4.0 + scotomaSeed);
          float scotomaThreshold = mix(1.0, 0.5, (intensity - 0.3) / 0.7);
          
          if(scotomaNoise > scotomaThreshold) {
            // Blend scotoma areas rather than making them black
            // Apply heavy blur + desaturation to scotoma regions
            vec3 scotomaColor = mix(result, vec3(0.2), 0.8); // Darker scotomas
            float scotomaBlend = smoothstep(scotomaThreshold, scotomaThreshold + 0.1, scotomaNoise);
            result = mix(result, scotomaColor, scotomaBlend);
            
            // Add extra blur to scotoma areas
            vec3 scotomaBlurred = gaussianBlur(tDiffuse, uv, 15.0);
            result = mix(result, scotomaBlurred, scotomaBlend * 0.5);
          }
        }
        
        // ===== 7. GLARE / BLOOM =====
        float glareSensitivity = mix(0.0, 0.3, intensity);
        vec3 highlights = max(result - vec3(0.7), vec3(0.0));
        result += highlights * glareSensitivity * 2.0;
        result = clamp(result, 0.0, 1.2);
        
        // ===== 8. DIRTY GLASS EFFECT =====
        float grainAmount = mix(0.0, 0.03, intensity);
        float grain = (simpleNoise(uv * 500.0 + time * 0.1) - 0.5) * grainAmount;
        result += vec3(grain);
        
        // Final clamp
        result = clamp(result, 0.0, 1.0);
        
        return result;
      }

      // John Milton-specific effects for bilateral retinal detachment and secondary glaucoma
      
      // Glaucoma Rainbow Halos - subtle prismatic rings around light sources
      vec3 applyMiltonGlaucomaHalos(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec3 result = color;
        
        // Detect bright areas in the image to create halos around light sources
        float brightness = dot(color, vec3(0.299, 0.587, 0.114));
        
        // Only create halos around bright areas (light sources)
        if (brightness > 0.4) {
          // Create multiple halo centers based on bright areas
          vec2 center1 = vec2(0.5, 0.5); // Center of image
          vec2 center2 = vec2(0.3, 0.4); // Upper left area
          vec2 center3 = vec2(0.7, 0.6); // Lower right area
          
          // Calculate distances to each potential light source
          float dist1 = distance(uv, center1);
          float dist2 = distance(uv, center2);
          float dist3 = distance(uv, center3);
          
          // Create halos around each light source
          for (int i = 0; i < 3; i++) {
            vec2 center = i == 0 ? center1 : (i == 1 ? center2 : center3);
            float dist = i == 0 ? dist1 : (i == 1 ? dist2 : dist3);
            
            // Inner halo (violet/blue) - more visible but still subtle
            float innerHalo = smoothstep(0.08, 0.12, dist) * (1.0 - smoothstep(0.12, 0.16, dist));
            vec3 innerHaloColor = vec3(0.8, 0.7, 0.9) * 0.3; // Muted violet
            result = mix(result, result + innerHaloColor, innerHalo * intensity * 0.4);
            
            // Middle halo (green) - subtle but visible
            float middleHalo = smoothstep(0.12, 0.16, dist) * (1.0 - smoothstep(0.16, 0.20, dist));
            vec3 middleHaloColor = vec3(0.7, 0.8, 0.7) * 0.25; // Muted green
            result = mix(result, result + middleHaloColor, middleHalo * intensity * 0.3);
            
            // Outer halo (red/orange) - subtle outer ring
            float outerHalo = smoothstep(0.16, 0.20, dist) * (1.0 - smoothstep(0.20, 0.24, dist));
            vec3 outerHaloColor = vec3(0.9, 0.7, 0.6) * 0.2; // Muted orange
            result = mix(result, result + outerHaloColor, outerHalo * intensity * 0.25);
          }
        }
        
        // Add subtle shimmer effect to simulate corneal edema
        float shimmer = sin(time * 1.5 + uv.x * 10.0 + uv.y * 8.0) * 0.05 * intensity;
        result += vec3(shimmer * 0.1, shimmer * 0.05, shimmer * 0.15);
        
        // Blend the effect more naturally
        result = mix(color, result, intensity * 0.8);
        
        return result;
      }
      
      // Progressive Vignetting - tunnel vision effect
      vec3 applyMiltonProgressiveVignetting(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        
        // Progressive tunnel vision - more severe than regular glaucoma
        float tunnelRadius = 0.4 - intensity * 0.35; // From 40% to 5% of screen
        
        // Add irregular edges to simulate progressive field loss
        float angle = atan(uv.y - center.y, uv.x - center.x);
        float irregularity = sin(angle * 6.0 + time * 0.2) * 0.03 * intensity;
        tunnelRadius += irregularity;
        
        // Create smooth transition from visible to dark
        float tunnelMask = smoothstep(tunnelRadius, tunnelRadius + 0.08, dist);
        
        // Additional darkening for areas further from center
        float distanceDarkening = smoothstep(tunnelRadius + 0.05, tunnelRadius + 0.15, dist);
        tunnelMask = min(tunnelMask, 1.0 - distanceDarkening * 0.8);
        
        return mix(vec3(0.0), color, tunnelMask);
      }
      
      // Progressive Scotomas - irregular blind spots
      vec3 applyMiltonScotomas(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec3 result = color;
        
        // Create multiple irregular scotomas
        for (int i = 0; i < 6; i++) {
          float scotomaX = 0.2 + float(i) * 0.12 + sin(time * 0.3 + float(i)) * 0.08;
          float scotomaY = 0.3 + float(i) * 0.1 + cos(time * 0.4 + float(i)) * 0.06;
          float scotomaSize = 0.03 + intensity * 0.04;
          
          // Make scotomas irregular in shape
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
      
      // Retinal Detachment Shadows - curtain effects
      vec3 applyMiltonRetinalDetachment(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec3 result = color;
        
        // Top curtain effect
        float topCurtain = smoothstep(0.0, 0.3, uv.y) * (1.0 - smoothstep(0.3, 0.4, uv.y));
        result = mix(result * 0.2, result, 1.0 - topCurtain * intensity);
        
        // Side curtain effects
        float leftCurtain = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.2, 0.3, uv.x));
        float rightCurtain = smoothstep(0.7, 0.8, uv.x) * (1.0 - smoothstep(0.8, 1.0, uv.x));
        
        result = mix(result * 0.3, result, 1.0 - leftCurtain * intensity * 0.7);
        result = mix(result * 0.3, result, 1.0 - rightCurtain * intensity * 0.7);
        
        // Add wavy distortion (metamorphopsia)
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
      
      // Extreme Photophobia - overwhelming brightness
      vec3 applyMiltonPhotophobia(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        // Overwhelming brightness that washes out details
        vec3 result = color;
        
        // Increase overall brightness dramatically
        result = result * (1.0 + intensity * 2.0);
        
        // Add white overlay that increases with intensity
        float whiteOverlay = intensity * 0.6;
        result = mix(result, vec3(1.0), whiteOverlay);
        
        // Add flickering effect to simulate light sensitivity
        float flicker = sin(time * 8.0) * 0.1 * intensity;
        result += vec3(flicker);
        
        // Reduce contrast to simulate overwhelming light
        float contrastReduction = intensity * 0.7;
        float avgLuminance = 0.8; // High average luminance
        result = mix(vec3(avgLuminance), result, 1.0 - contrastReduction);
        
        return result;
      }
      
      // Temporal Field Loss - side vision loss
      vec3 applyMiltonTemporalFieldLoss(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec3 result = color;
        
        // Left temporal field loss
        float leftLoss = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.2, 0.3, uv.x));
        result = mix(vec3(0.0), result, 1.0 - leftLoss * intensity);
        
        // Right temporal field loss
        float rightLoss = smoothstep(0.7, 0.8, uv.x) * (1.0 - smoothstep(0.8, 1.0, uv.x));
        result = mix(vec3(0.0), result, 1.0 - rightLoss * intensity);
        
        // Add gradual progression effect
        float progression = sin(time * 0.5) * 0.1 + 0.9;
        result = mix(vec3(0.0), result, progression);
        
        return result;
      }
      
      // Progressive Blindness - combines all effects with increasing severity
      vec3 applyMiltonProgressiveBlindness(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec3 result = color;
        
        // Early stage (0.0-0.3): Halos and temporal field loss
        if (intensity > 0.0) {
          result = applyMiltonGlaucomaHalos(result, uv, min(intensity * 2.0, 1.0), time);
          result = applyMiltonTemporalFieldLoss(result, uv, min(intensity * 1.5, 1.0), time);
        }
        
        // Middle stage (0.3-0.7): Scotomas and progressive vignetting
        if (intensity > 0.3) {
          result = applyMiltonScotomas(result, uv, (intensity - 0.3) * 2.5, time);
          result = applyMiltonProgressiveVignetting(result, uv, (intensity - 0.3) * 2.5, time);
        }
        
        // Late stage (0.7-1.0): Retinal detachment and photophobia
        if (intensity > 0.7) {
          result = applyMiltonRetinalDetachment(result, uv, (intensity - 0.7) * 3.33, time);
          result = applyMiltonPhotophobia(result, uv, (intensity - 0.7) * 3.33, time);
        }
        
        // Final stage: Complete blindness
        if (intensity >= 1.0) {
          result = vec3(0.0);
        }
        
        return result;
      }

      // Note: Myopia and Hyperopia are now handled by CSS filters for simpler, more straightforward blur effects

      // Galileo Galilei - Acute Angle-Closure Glaucoma Effects
      vec3 applyGalileoAcuteHalos(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        vec3 result = color;

        // Detect bright areas in the image to create halos around light sources
        float brightness = dot(color, vec3(0.299, 0.587, 0.114));

        // Only create halos around bright areas (light sources)
        if (brightness > 0.3) {
          // Create multiple halo centers based on bright areas
          vec2 center1 = vec2(0.5, 0.5); // Center of image
          vec2 center2 = vec2(0.3, 0.4); // Upper left area
          vec2 center3 = vec2(0.7, 0.6); // Lower right area

          // Create halos around each light source with pulsating effect
          for (int i = 0; i < 3; i++) {
            vec2 center = i == 0 ? center1 : (i == 1 ? center2 : center3);
            float dist = i == 0 ? distance(uv, center1) : (i == 1 ? distance(uv, center2) : distance(uv, center3));

            // Pulsating effect for acute attacks
            float pulse = 1.0 + 0.3 * sin(time * 3.0 + float(i) * 2.0);
            float adjustedDist = dist / pulse;

            // Inner halo (violet/blue) - more intense than Milton's
            float innerHalo = smoothstep(0.06, 0.10, adjustedDist) * (1.0 - smoothstep(0.10, 0.14, adjustedDist));
            vec3 innerHaloColor = vec3(0.9, 0.8, 1.0) * 0.6; // Bright violet
            result = mix(result, result + innerHaloColor, innerHalo * intensity * 0.8);

            // Middle halo (green) - more visible
            float middleHalo = smoothstep(0.10, 0.14, adjustedDist) * (1.0 - smoothstep(0.14, 0.18, adjustedDist));
            vec3 middleHaloColor = vec3(0.8, 1.0, 0.8) * 0.5; // Bright green
            result = mix(result, result + middleHaloColor, middleHalo * intensity * 0.7);

            // Outer halo (red/orange) - more pronounced
            float outerHalo = smoothstep(0.14, 0.18, adjustedDist) * (1.0 - smoothstep(0.18, 0.22, adjustedDist));
            vec3 outerHaloColor = vec3(1.0, 0.7, 0.6) * 0.4; // Bright orange
            result = mix(result, result + outerHaloColor, outerHalo * intensity * 0.6);
          }
        }

        // Add intense shimmer effect to simulate severe corneal edema
        float shimmer = sin(time * 2.0 + uv.x * 15.0 + uv.y * 12.0) * 0.1 * intensity;
        result += vec3(shimmer * 0.2, shimmer * 0.1, shimmer * 0.3);

        // Blend the effect more dramatically for acute attacks
        result = mix(color, result, intensity * 1.2);

        return result;
      }

      vec3 applyGalileoSevereBlurring(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        // Severe gaussian blur effect
        vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
        vec3 blurred = vec3(0.0);
        float total = 0.0;
        
        float blurRadius = intensity * 8.0; // Much more severe than normal blur
        
        for(float x = -blurRadius; x <= blurRadius; x += 1.0) {
          for(float y = -blurRadius; y <= blurRadius; y += 1.0) {
            float weight = 1.0 / (1.0 + (x * x + y * y) / (blurRadius * blurRadius));
            blurred += texture2D(tDiffuse, uv + vec2(x, y) * pixelSize).rgb * weight;
            total += weight;
          }
        }
        
        blurred /= total;
        
        // Add fog-like overlay
        vec3 fogColor = vec3(0.8, 0.8, 0.9);
        float fogAmount = intensity * 0.4;
        blurred = mix(blurred, fogColor, fogAmount);
        
        return mix(color, blurred, intensity);
      }

      vec3 applyGalileoRedEyeEffect(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        // Red tint overlay from conjunctival injection
        vec3 redTint = vec3(1.0, 0.7, 0.7);
        
        // Add some variation to simulate blood vessels
        float bloodVesselPattern = sin(uv.x * 20.0 + time * 0.5) * sin(uv.y * 15.0 + time * 0.3) * 0.1;
        redTint += vec3(bloodVesselPattern * 0.3, 0.0, 0.0);
        
        // Apply red tint with varying intensity
        float tintStrength = intensity * (0.6 + 0.4 * sin(time * 2.0));
        return mix(color, color * redTint, tintStrength);
      }

      vec3 applyGalileoExtremePhotophobia(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        vec3 result = color;

        // Brightness threshold for white-out effect
        float brightness = dot(color, vec3(0.299, 0.587, 0.114));
        float threshold = 0.4 - intensity * 0.3; // Lower threshold with higher intensity
        
        if (brightness > threshold) {
          // White-out effect for bright areas
          float whiteOutAmount = (brightness - threshold) / (1.0 - threshold);
          whiteOutAmount = pow(whiteOutAmount, 2.0); // Exponential increase
          
          vec3 whiteOut = vec3(1.0, 1.0, 1.0);
          result = mix(result, whiteOut, whiteOutAmount * intensity * 0.8);
        }

        // Add pain indicators (red edges)
        float edgeDistance = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
        float edgeEffect = smoothstep(0.0, 0.1, edgeDistance);
        vec3 painColor = vec3(1.0, 0.3, 0.3);
        result = mix(painColor, result, edgeEffect * (1.0 - intensity * 0.3));

        return result;
      }

      vec3 applyGalileoCornealHaziness(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        // Milky white veil overlay
        vec3 hazeColor = vec3(0.95, 0.95, 1.0);
        
        // Add some texture to the haze
        float noise = sin(uv.x * 30.0 + time * 0.5) * sin(uv.y * 25.0 + time * 0.3) * 0.05;
        hazeColor += vec3(noise);
        
        // Varying intensity to simulate corneal edema
        float hazeIntensity = intensity * (0.7 + 0.3 * sin(time * 1.5));
        
        return mix(color, hazeColor, hazeIntensity * 0.6);
      }

      vec3 applyGalileoSectoralDefects(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        vec3 result = color;

        // Superior-nasal sectoral defect (upper nose-side)
        vec2 center = vec2(0.3, 0.2); // Upper nasal area
        float angle = atan(uv.y - center.y, uv.x - center.x);
        float dist = distance(uv, center);
        
        // Create wedge-shaped defect
        float sectorStart = -1.0; // Start angle
        float sectorEnd = 0.5;    // End angle
        float sectorWidth = 1.5;  // Width of the sector
        
        if (angle > sectorStart && angle < sectorEnd && dist < sectorWidth) {
          float sectorEffect = smoothstep(0.0, 0.3, dist) * (1.0 - smoothstep(0.3, sectorWidth, dist));
          result = mix(vec3(0.0), result, 1.0 - sectorEffect * intensity);
        }

        return result;
      }

      vec3 applyGalileoArcuateScotomas(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;

        vec3 result = color;

        // Create arcuate (arc-shaped) scotomas following nerve fiber patterns
        for (int i = 0; i < 3; i++) {
          float arcCenterX = 0.5 + float(i) * 0.2 - 0.2;
          float arcCenterY = 0.5 + sin(float(i) * 2.0) * 0.1;
          
          // Create arc-shaped blind area
          float arcRadius = 0.2 + float(i) * 0.1;
          float arcAngle = atan(uv.y - arcCenterY, uv.x - arcCenterX);
          float arcDist = distance(uv, vec2(arcCenterX, arcCenterY));
          
          // Arc shape following nerve fiber pattern
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

        // Create multiple irregular blind spots
        for (int i = 0; i < 12; i++) {
          float spotX = 0.1 + float(i) * 0.08 + sin(time * 0.2 + float(i)) * 0.05;
          float spotY = 0.1 + float(i) * 0.07 + cos(time * 0.3 + float(i)) * 0.06;
          float spotSize = 0.03 + intensity * 0.04;
          
          // Make spots irregular in shape
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

        // Combine all acute attack symptoms
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

        // Progressive deterioration with stepped pattern
        // Early stage (0.0-0.3): Sectoral defects
        if (intensity > 0.0) {
          result = applyGalileoSectoralDefects(result, uv, min(intensity * 2.0, 1.0), time);
        }
        
        // Middle stage (0.3-0.6): Arcuate scotomas
        if (intensity > 0.3) {
          result = applyGalileoArcuateScotomas(result, uv, (intensity - 0.3) * 3.33, time);
        }
        
        // Late stage (0.6-1.0): Swiss cheese vision and severe tunnel vision
        if (intensity > 0.6) {
          result = applyGalileoSwissCheeseVision(result, uv, (intensity - 0.6) * 2.5, time);
          
          // Severe tunnel vision
          float centerDist = distance(uv, vec2(0.5, 0.5));
          float tunnelRadius = 0.3 - (intensity - 0.6) * 0.25; // Shrinking tunnel
          float tunnelEffect = smoothstep(tunnelRadius, tunnelRadius + 0.1, centerDist);
          result = mix(vec3(0.0), result, tunnelEffect);
        }

        return result;
      }

      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec3 color = texel.rgb;
        
        // Apply color blindness effects
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

        // Note: Blur effects are now handled by dedicated myopia and hyperopia functions

        // Apply Retinitis Pigmentosa effect
        if (retinitisPigmentosaIntensity > 0.0) {
          color = applyRetinitisPigmentosa(color, vUv, retinitisPigmentosaIntensity, time);
        }

        // Apply Monocular Diplopia effect
        if (diplopiaMonocularIntensity > 0.0) {
          color = applyMonocularDiplopia(color, vUv, diplopiaMonocularIntensity, diplopiaSeparation, diplopiaDirection);
        }

        // Apply Binocular Diplopia effect
        if (diplopiaBinocularIntensity > 0.0) {
          color = applyBinocularDiplopia(color, vUv, diplopiaBinocularIntensity, diplopiaSeparation, diplopiaDirection);
        }

        // Apply Stargardt Disease effect
        if (stargardtIntensity > 0.0) {
          color = applyStargardt(color, vUv, stargardtIntensity);
        }

        // Apply AMD effect
        if (amdIntensity > 0.0) {
          color = applyAMD(color, vUv, amdIntensity);
        }

        // Apply Diabetic Retinopathy effect
        if (diabeticRetinopathyIntensity > 0.0) {
          color = applyDiabeticRetinopathy(color, vUv, diabeticRetinopathyIntensity, time);
        }

        // Apply Glaucoma effect
        if (glaucomaIntensity > 0.0) {
          color = applyGlaucoma(color, vUv, glaucomaIntensity, time);
        }
        
        // Apply John Milton-specific effects
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
        
        // Galileo Galilei - Acute Angle-Closure Glaucoma Effects
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
        
        // Note: Myopia and Hyperopia effects are handled by CSS filters
        
        gl_FragColor = vec4(color, texel.a);
      }
    `
  });
};

/**
 * Updates shader material uniforms based on visual effects
 * 
 * @param material - The shader material to update
 * @param effects - Array of visual effects
 */
export const updateShaderUniforms = (
  material: THREE.ShaderMaterial, 
  effects: VisualEffect[],
  diplopiaSeparation: number = 1.0,
  diplopiaDirection: number = 0.0
): void => {
  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);
  
  // Helper function to update uniform values
  const updateUniform = (effectId: string, uniformName: string) => {
    const effect = getEffectById(effectMap, effectId);
    if (effect) {
      material.uniforms[uniformName].value = effect.enabled ? effect.intensity : 0;
    }
  };

  // Update effect uniforms based on current state
  updateUniform('protanopia', 'protanopiaIntensity');
  updateUniform('deuteranopia', 'deuteranopiaIntensity');
  updateUniform('tritanopia', 'tritanopiaIntensity');
  updateUniform('protanomaly', 'protanomalyIntensity');
  updateUniform('deuteranomaly', 'deuteranomalyIntensity');
  updateUniform('tritanomaly', 'tritanomalyIntensity');
  updateUniform('retinitisPigmentosa', 'retinitisPigmentosaIntensity');
  updateUniform('diplopiaMonocular', 'diplopiaMonocularIntensity');
  updateUniform('diplopiaBinocular', 'diplopiaBinocularIntensity');
  updateUniform('stargardt', 'stargardtIntensity');
  updateUniform('amd', 'amdIntensity');
  updateUniform('diabeticRetinopathy', 'diabeticRetinopathyIntensity');
  updateUniform('glaucoma', 'glaucomaIntensity');
  
  // Update John Milton-specific effect uniforms
  updateUniform('miltonGlaucomaHalos', 'miltonGlaucomaHalosIntensity');
  updateUniform('miltonProgressiveVignetting', 'miltonProgressiveVignettingIntensity');
  updateUniform('miltonScotomas', 'miltonScotomasIntensity');
  updateUniform('miltonRetinalDetachment', 'miltonRetinalDetachmentIntensity');
  updateUniform('miltonPhotophobia', 'miltonPhotophobiaIntensity');
  updateUniform('miltonTemporalFieldLoss', 'miltonTemporalFieldLossIntensity');
  updateUniform('miltonProgressiveBlindness', 'miltonProgressiveBlindnessIntensity');

  // Galileo Galilei-specific effects
  updateUniform('galileoAcuteHalos', 'galileoAcuteHalosIntensity');
  updateUniform('galileoSevereBlurring', 'galileoSevereBlurringIntensity');
  updateUniform('galileoRedEyeEffect', 'galileoRedEyeEffectIntensity');
  updateUniform('galileoExtremePhotophobia', 'galileoExtremePhotophobiaIntensity');
  updateUniform('galileoCornealHaziness', 'galileoCornealHazinessIntensity');
  updateUniform('galileoSectoralDefects', 'galileoSectoralDefectsIntensity');
  updateUniform('galileoArcuateScotomas', 'galileoArcuateScotomasIntensity');
  updateUniform('galileoSwissCheeseVision', 'galileoSwissCheeseVisionIntensity');
  updateUniform('galileoAcuteAttackMode', 'galileoAcuteAttackModeIntensity');
  updateUniform('galileoChronicProgression', 'galileoChronicProgressionIntensity');

  // Note: Myopia and Hyperopia are now handled by CSS filters

  // Update diplopia parameters
  material.uniforms.diplopiaSeparation.value = diplopiaSeparation;
  material.uniforms.diplopiaDirection.value = diplopiaDirection;

  // Update time for animated effects
  material.uniforms.time.value = performance.now() * 0.001;
};

/**
 * Creates a Three.js mesh with the color blindness shader material
 * 
 * @returns A configured mesh with the shader material
 */
export const createVisualizationMesh = (): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = createColorBlindnessShaderMaterial();
  return new THREE.Mesh(geometry, material);
};
