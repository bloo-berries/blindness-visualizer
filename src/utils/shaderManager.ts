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
      blurIntensity: { value: 0.0 },
      retinitisPigmentosaIntensity: { value: 0.0 },
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
      uniform float blurIntensity;
      uniform float retinitisPigmentosaIntensity;
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

      vec3 applyProtanomaly(vec3 color) {
        return vec3(
          0.817 * color.r + 0.183 * color.g + 0.000 * color.b,
          0.333 * color.r + 0.667 * color.g + 0.000 * color.b,
          0.000 * color.r + 0.125 * color.g + 0.875 * color.b
        );
      }

      vec3 applyDeuteranomaly(vec3 color) {
        return vec3(
          0.800 * color.r + 0.200 * color.g + 0.000 * color.b,
          0.258 * color.r + 0.742 * color.g + 0.000 * color.b,
          0.000 * color.r + 0.142 * color.g + 0.858 * color.b
        );
      }

      vec3 applyTritanomaly(vec3 color) {
        return vec3(
          0.967 * color.r + 0.033 * color.g + 0.000 * color.b,
          0.000 * color.r + 0.733 * color.g + 0.267 * color.b,
          0.000 * color.r + 0.183 * color.g + 0.817 * color.b
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
        
        // Create irregular tunnel shape (not perfect circle)
        vec2 offset = vec2(
          sin(uv.x * 8.0 + time * 0.2) * 0.03,
          cos(uv.y * 6.0 + time * 0.15) * 0.02
        );
        float irregularDist = distance(uv + offset, center);
        
        // Progressive tunnel vision - much more severe constriction
        float tunnelRadius = 0.12 - intensity * 0.09; // From 0.12 to 0.03 (very narrow)
        float tunnelEffect = smoothstep(tunnelRadius, tunnelRadius + 0.06, irregularDist);
        
        // Heavy peripheral blur and darkening
        float peripheralBlur = smoothstep(tunnelRadius + 0.03, tunnelRadius + 0.12, irregularDist);
        float peripheralDarkening = smoothstep(tunnelRadius + 0.01, tunnelRadius + 0.08, irregularDist);
        
        // Night blindness - progressively darken the image
        float nightBlindness = 1.0 - intensity * 0.3;
        
        // Color desaturation - more aggressive in peripheral areas
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        float desaturationAmount = intensity * 0.7 + peripheralBlur * 0.5;
        vec3 desaturated = mix(color, vec3(luminance), desaturationAmount);
        
        // Glare effects - emanating from bright areas
        float glare = 0.0;
        if (intensity > 0.1) {
          // Find bright areas in the image
          float brightness = dot(color, vec3(0.299, 0.587, 0.114));
          
          // Create glare streaks from bright areas
          if (brightness > 0.6) {
            vec2 glareDir = normalize(uv - center);
            float glareDist = distance(uv, center);
            float glareIntensity = (brightness - 0.6) * 4.0 * intensity;
            
            // Create radiating glare streaks
            float glarePattern = sin(dot(glareDir, vec2(1.0, 0.0)) * 12.0 + time * 2.5) * 
                                sin(dot(glareDir, vec2(0.0, 1.0)) * 10.0 + time * 2.0);
            glare = max(0.0, glarePattern - 0.2) * glareIntensity * 
                   smoothstep(0.0, 0.2, glareDist) * 
                   smoothstep(0.5, 0.2, glareDist);
          }
        }
        
        // Apply heavy blur to peripheral areas
        vec3 blurred = color;
        if (peripheralBlur > 0.0) {
          // Enhanced blur approximation
          vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
          vec3 blur = vec3(0.0);
          float total = 0.0;
          
          for(float x = -3.0; x <= 3.0; x++) {
            for(float y = -3.0; y <= 3.0; y++) {
              float weight = 1.0 / (1.0 + x * x + y * y);
              blur += texture2D(tDiffuse, vUv + vec2(x, y) * pixelSize * (3.0 + peripheralBlur * 4.0)).rgb * weight;
              total += weight;
            }
          }
          blurred = blur / total;
        }
        
        // Combine effects
        vec3 result = mix(desaturated, blurred, peripheralBlur) * nightBlindness;
        
        // Apply tunnel vision effect with heavy darkening
        result = mix(result, vec3(0.0), tunnelEffect * (0.95 + intensity * 0.05));
        
        // Add peripheral darkening
        result = mix(result, vec3(0.0), peripheralDarkening * 0.9);
        
        // Add glare on top
        result = mix(result, vec3(1.0), glare);
        
        // At very high intensities (>0.8), further darken everything
        if (intensity > 0.8) {
          float finalDarkening = (intensity - 0.8) * 5.0; // 0 to 1.0
          result = mix(result, vec3(0.0), finalDarkening);
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
          color = mix(color, applyProtanomaly(color), protanomalyIntensity);
        }
        if (deuteranomalyIntensity > 0.0) {
          color = mix(color, applyDeuteranomaly(color), deuteranomalyIntensity);
        }
        if (tritanomalyIntensity > 0.0) {
          color = mix(color, applyTritanomaly(color), tritanomalyIntensity);
        }

        // Apply blur effect
        if (blurIntensity > 0.0) {
          vec2 pixelSize = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
          vec4 blur = vec4(0.0);
          float total = 0.0;
          
          for(float x = -4.0; x <= 4.0; x++) {
            for(float y = -4.0; y <= 4.0; y++) {
              float weight = 1.0 / (1.0 + x * x + y * y);
              blur += texture2D(tDiffuse, vUv + vec2(x, y) * pixelSize * blurIntensity) * weight;
              total += weight;
            }
          }
          
          color = mix(color, blur.rgb, blurIntensity);
        }

        // Apply Retinitis Pigmentosa effect
        if (retinitisPigmentosaIntensity > 0.0) {
          color = applyRetinitisPigmentosa(color, vUv, retinitisPigmentosaIntensity, time);
        }
        
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
  effects: VisualEffect[]
): void => {
  // Update effect uniforms based on current state
  const protanopia = effects.find(e => e.id === 'protanopia');
  if (protanopia) {
    material.uniforms.protanopiaIntensity.value = protanopia.enabled ? protanopia.intensity : 0;
  }

  const deuteranopia = effects.find(e => e.id === 'deuteranopia');
  if (deuteranopia) {
    material.uniforms.deuteranopiaIntensity.value = deuteranopia.enabled ? deuteranopia.intensity : 0;
  }

  const tritanopia = effects.find(e => e.id === 'tritanopia');
  if (tritanopia) {
    material.uniforms.tritanopiaIntensity.value = tritanopia.enabled ? tritanopia.intensity : 0;
  }

  const protanomaly = effects.find(e => e.id === 'protanomaly');
  if (protanomaly) {
    material.uniforms.protanomalyIntensity.value = protanomaly.enabled ? protanomaly.intensity : 0;
  }

  const deuteranomaly = effects.find(e => e.id === 'deuteranomaly');
  if (deuteranomaly) {
    material.uniforms.deuteranomalyIntensity.value = deuteranomaly.enabled ? deuteranomaly.intensity : 0;
  }

  const tritanomaly = effects.find(e => e.id === 'tritanomaly');
  if (tritanomaly) {
    material.uniforms.tritanomalyIntensity.value = tritanomaly.enabled ? tritanomaly.intensity : 0;
  }

  const nearSighted = effects.find(e => e.id === 'nearSighted');
  if (nearSighted) {
    material.uniforms.blurIntensity.value = nearSighted.enabled ? nearSighted.intensity : 0;
  }

  const retinitisPigmentosa = effects.find(e => e.id === 'retinitisPigmentosa');
  if (retinitisPigmentosa) {
    material.uniforms.retinitisPigmentosaIntensity.value = retinitisPigmentosa.enabled ? retinitisPigmentosa.intensity : 0;
  }

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
