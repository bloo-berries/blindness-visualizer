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
