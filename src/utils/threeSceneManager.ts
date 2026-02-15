import * as THREE from 'three';

export interface SceneManager {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
}

/**
 * Creates and configures a Three.js scene for visualization
 * 
 * @param container - The DOM element to attach the renderer to
 * @returns Scene manager with scene, camera, renderer and cleanup function
 */
export const createSceneManager = (container: HTMLDivElement): SceneManager => {
  // Set up Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  
  // Configure renderer to match container dimensions
  const containerRect = container.getBoundingClientRect();

  renderer.setSize(containerRect.width, containerRect.height);

  container.appendChild(renderer.domElement);

  // Cleanup function
  const dispose = () => {
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    dispose
  };
};
