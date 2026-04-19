import * as THREE from 'three';

interface SceneManager {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
}

/**
 * Creates and configures a Three.js scene for visualization.
 *
 * Handles WebGL context loss (common on mobile when the GPU reclaims memory)
 * by listening for `webglcontextlost` / `webglcontextrestored` events.
 *
 * @param container - The DOM element to attach the renderer to
 * @returns Scene manager with scene, camera, renderer and cleanup function.
 *          Throws if WebGL is unavailable (caller should catch).
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

  // --- WebGL context loss / restore handlers ---
  // Mobile GPUs may reclaim the WebGL context under memory pressure.
  // Calling preventDefault() tells the browser we intend to restore.
  const canvas = renderer.domElement;

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.warn('WebGL context lost — waiting for restore');
  };

  const handleContextRestored = () => {
    // eslint-disable-next-line no-console
    console.info('WebGL context restored');
    // Re-apply renderer size after context is restored
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
  };

  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  // Cleanup function
  const dispose = () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
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
