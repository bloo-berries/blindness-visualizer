import * as THREE from 'three';
import { getFragmentShader } from './fragmentShader';
import { createShaderUniforms } from './shaderUniforms';

/**
 * Creates a Three.js shader material for color blindness simulation
 *
 * @returns A configured ShaderMaterial with color blindness effects
 */
export const createColorBlindnessShaderMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: createShaderUniforms(),
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: getFragmentShader()
  });
};
