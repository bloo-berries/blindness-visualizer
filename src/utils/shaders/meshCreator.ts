import * as THREE from 'three';
import { createColorBlindnessShaderMaterial } from './shaderMaterial';

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
