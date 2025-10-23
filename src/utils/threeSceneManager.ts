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

/**
 * Handles window resize events for the Three.js scene
 * 
 * @param renderer - The Three.js renderer
 * @param camera - The Three.js camera
 */
export const handleResize = (
  renderer: THREE.WebGLRenderer, 
  camera: THREE.OrthographicCamera
): void => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  renderer.setSize(width, height);
  
  // Update camera aspect ratio if needed
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
};

/**
 * Creates a texture from a media element (video or image)
 * 
 * @param mediaElement - HTML video or image element
 * @returns Promise that resolves to a Three.js texture
 */
export const createTextureFromMedia = (
  mediaElement: HTMLVideoElement | HTMLImageElement
): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    const texture = new THREE.Texture(mediaElement);
    
    if (mediaElement instanceof HTMLVideoElement) {
      // For video elements, we need to wait for metadata
      mediaElement.addEventListener('loadedmetadata', () => {
        texture.needsUpdate = true;
        resolve(texture);
      });
      
      mediaElement.addEventListener('error', reject);
    } else {
      // For image elements, we can resolve immediately
      texture.needsUpdate = true;
      resolve(texture);
    }
  });
};

/**
 * Applies visual effects to a Three.js texture
 * 
 * @param texture - The Three.js texture to modify
 * @param effects - Array of visual effects to apply
 */
export const applyEffectsToTexture = (
  texture: THREE.Texture, 
  effects: any[]
): void => {
  // This is a placeholder for texture effect application
  // In a real implementation, you would apply shader effects here
  texture.needsUpdate = true;
};
