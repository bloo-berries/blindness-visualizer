import * as THREE from 'three';
import { VisualEffect } from '../types/visualEffects';

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
        
        // Multiple dark spots (microaneurysms and hemorrhages)
        vec3 result = color;
        
        // Create multiple dark spots across the image
        for (int i = 0; i < 8; i++) {
          float spotX = 0.2 + float(i) * 0.1 + sin(time * 0.5 + float(i)) * 0.05;
          float spotY = 0.3 + float(i) * 0.08 + cos(time * 0.3 + float(i)) * 0.06;
          float spotSize = 0.02 + intensity * 0.03;
          
          float spotDist = distance(uv, vec2(spotX, spotY));
          float spotEffect = smoothstep(spotSize, spotSize + 0.01, spotDist);
          
          // Darken areas with spots
          result = mix(result * 0.3, result, spotEffect);
        }
        
        // Overall color desaturation
        float luminance = dot(result, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.4;
        result = mix(result, vec3(luminance), desaturationAmount);
        
        // Slight blur effect
        float blurAmount = intensity * 0.5;
        if (blurAmount > 0.0) {
          vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
          vec3 blurred = vec3(0.0);
          float total = 0.0;
          
          for(float x = -2.0; x <= 2.0; x++) {
            for(float y = -2.0; y <= 2.0; y++) {
              float weight = 1.0 / (1.0 + x * x + y * y);
              blurred += texture2D(tDiffuse, uv + vec2(x, y) * pixelSize * blurAmount).rgb * weight;
              total += weight;
            }
          }
          blurred /= total;
          result = mix(result, blurred, blurAmount);
        }
        
        return result;
      }

      // Glaucoma effects - complex peripheral vision loss with scotomas
      vec3 applyGlaucoma(vec3 color, vec2 uv, float intensity, float time) {
        if (intensity <= 0.0) return color;
        
        vec2 center = vec2(0.5, 0.5);
        vec2 offset = uv - center;
        float dist = length(offset);
        float angle = atan(offset.y, offset.x);
        
        // Create multiple scotomas (blind spots) at different locations
        vec3 result = color;
        
        // Early stage: Small paracentral scotomas (10-20 degrees from center)
        if (intensity > 0.1) {
          // Superior paracentral scotoma
          vec2 scotoma1 = center + vec2(0.15, 0.1);
          float scotoma1Dist = distance(uv, scotoma1);
          float scotoma1Size = 0.05 + intensity * 0.03;
          float scotoma1Effect = smoothstep(scotoma1Size, scotoma1Size + 0.02, scotoma1Dist);
          
          // Inferior paracentral scotoma
          vec2 scotoma2 = center + vec2(-0.12, -0.08);
          float scotoma2Dist = distance(uv, scotoma2);
          float scotoma2Size = 0.04 + intensity * 0.025;
          float scotoma2Effect = smoothstep(scotoma2Size, scotoma2Size + 0.02, scotoma2Dist);
          
          // Combine scotomas
          float scotomaMask = min(scotoma1Effect, scotoma2Effect);
          result = mix(vec3(0.0), result, scotomaMask);
        }
        
        // Moderate stage: Arc-shaped defects (arcuate scotomas)
        if (intensity > 0.3) {
          // Superior arcuate scotoma
          float superiorArc = 0.0;
          if (offset.y > 0.0) { // Superior field
            float arcDist = abs(offset.y - 0.1);
            float arcWidth = 0.08 + intensity * 0.05;
            superiorArc = smoothstep(arcWidth, arcWidth + 0.03, arcDist);
          }
          
          // Inferior arcuate scotoma
          float inferiorArc = 0.0;
          if (offset.y < 0.0) { // Inferior field
            float arcDist = abs(offset.y + 0.08);
            float arcWidth = 0.06 + intensity * 0.04;
            inferiorArc = smoothstep(arcWidth, arcWidth + 0.03, arcDist);
          }
          
          float arcuateMask = min(superiorArc, inferiorArc);
          result = mix(vec3(0.0), result, arcuateMask);
        }
        
        // Advanced stage: Peripheral constriction (tunnel vision)
        if (intensity > 0.5) {
          // Create tunnel vision with irregular edges
          float tunnelRadius = 0.4 - intensity * 0.3; // From 40% to 10% of screen
          
          // Add irregularity to tunnel edges
          float irregularity = sin(angle * 8.0 + time * 0.5) * 0.02;
          tunnelRadius += irregularity;
          
          float tunnelMask = smoothstep(tunnelRadius, tunnelRadius + 0.05, dist);
          result = mix(vec3(0.0), result, tunnelMask);
        }
        
        // End stage: Severe constriction
        if (intensity > 0.8) {
          float severeRadius = 0.15 - (intensity - 0.8) * 0.1; // Down to 5% of screen
          float severeMask = smoothstep(severeRadius, severeRadius + 0.03, dist);
          result = mix(vec3(0.0), result, severeMask);
        }
        
        // Color vision deficits - blue-yellow color blindness
        if (intensity > 0.2) {
          // Reduce blue-yellow sensitivity
          float blueYellowDeficit = intensity * 0.4;
          float luminance = dot(result, vec3(0.299, 0.587, 0.114));
          
          // Desaturate blues and yellows more than reds and greens
          vec3 blueYellowDesaturated = mix(result, vec3(luminance), blueYellowDeficit);
          result = mix(result, blueYellowDesaturated, 0.6);
        }
        
        // Contrast sensitivity reduction
        if (intensity > 0.1) {
          float contrastReduction = intensity * 0.3;
          float avgLuminance = 0.5;
          result = mix(vec3(avgLuminance), result, 1.0 - contrastReduction);
        }
        
        // Add slight shimmer/fluctuation to represent unstable areas
        if (intensity > 0.3) {
          float shimmer = sin(time * 2.0 + dist * 10.0) * 0.02 * intensity;
          result = mix(result, result * 0.8, abs(shimmer));
        }
        
        return result;
      }

      // Note: Myopia and Hyperopia are now handled by CSS filters for simpler, more straightforward blur effects

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
  const effectMap = new Map(effects.map(e => [e.id, e]));
  
  // Helper function to update uniform values
  const updateUniform = (effectId: string, uniformName: string) => {
    const effect = effectMap.get(effectId as any);
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
