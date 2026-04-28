import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../../../types/visualEffects';
import { createSceneManager } from '../../../utils/threeSceneManager';
import { createVisualizationMesh, updateShaderUniforms } from '../../../utils/shaders';
import { PerformanceOptimizer, EffectProcessor, OverlayManager, AnimationManager } from '../../../utils/performance';

interface SceneSetupResult {
  isLoading: boolean;
  error: string | null;
  handleRetryCamera: () => void;
  effectProcessor: React.MutableRefObject<EffectProcessor>;
  overlayManager: React.MutableRefObject<OverlayManager>;
}

/**
 * Hook that manages the Three.js scene lifecycle:
 * - Creates the WebGL scene, camera, and renderer
 * - Sets up media input (image texture or YouTube passthrough)
 * - Runs the animation/render loop with performance throttling
 * - Manages overlay animations for scotoma/floaters/etc.
 * - Handles cleanup on unmount or dependency changes
 *
 * Returns the texture, loading/error state, retry handler, and shared
 * effectProcessor / overlayManager refs that other parts of the
 * Visualizer need.
 */
export function useSceneSetup(
  containerRef: React.RefObject<HTMLDivElement>,
  mediaRef: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  effects: VisualEffect[],
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  showComparison: boolean,
): SceneSetupResult {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Performance optimization instances — exposed so the Visualizer can
  // share them with overlay effects and the diplopia hook.
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const effectProcessor = useRef(new EffectProcessor());
  const overlayManager = useRef(new OverlayManager());
  const animationManager = useRef(AnimationManager.getInstance());

  const handleRetryCamera = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  }, []);

  // Main scene setup effect
  useEffect(() => {
    if (!containerRef.current) return;

    if (showComparison) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let sceneManager: ReturnType<typeof createSceneManager> | null = null;
    try {
      sceneManager = createSceneManager(containerRef.current);
    } catch {
      // WebGL unavailable — CSS filters & DOM overlays still work for YouTube/image.
      // Don't block rendering; just skip shader-based effects.
      // eslint-disable-next-line no-console
      console.warn('WebGL is not available on this device. Falling back to CSS-only rendering.');
      setIsLoading(false);
      // For YouTube/image sources, CSS filters handle color vision, overlays handle field loss.
      // Only WebGL canvas rendering is lost (webcam texture processing).
      if (inputSource.type === 'youtube' || inputSource.type === 'image') {
        return; // CSS rendering will continue via the JSX path below
      }
      setError('WebGL is not available on this device. Some visual effects may be limited.');
      return;
    }
    const { scene, camera, renderer, dispose } = sceneManager;

    const currentAnimationManager = animationManager.current;
    const currentOverlayManager = overlayManager.current;

    const enabledEffectsCount = effects.filter(e => e.enabled).length;
    const needsAnimation = effects.some(e =>
      (e.id === 'scotoma' || e.id === 'visualFloaters' || e.id === 'retinitisPigmentosa' || e.id === 'vitreousHemorrhage') && e.enabled
    );

    const updateOverlays = () => {
      const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);

      if (changed && containerRef.current) {
        overlayManager.current.updateOverlays(enabledEffects, containerRef.current);
      }

      overlayManager.current.updateAnimatedOverlays(enabledEffects);
    };

    if (needsAnimation && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      animationManager.current.addCallback(updateOverlays);
    }

    // Handle different input sources
    const setupMedia = async () => {
      try {
        if (inputSource.type === 'webcam') {
          setError('Camera feature is currently disabled. This is a premium feature coming soon.');
          setIsLoading(false);
          return;

        } else if (inputSource.type === 'image' && inputSource.url) {
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
          setTexture(imageTexture);
          setIsLoading(false);
        } else if (inputSource.type === 'youtube') {
          setTexture(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (inputSource.type === 'image') {
          setError('Failed to load image. The file may be corrupted or unsupported. Please try uploading again.');
        } else if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and refresh the page.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera and try again.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera is already in use by another application. Please close other camera applications and try again.');
          } else if (err.name === 'OverconstrainedError') {
            setError('Camera constraints cannot be satisfied. Trying with basic settings...');
            try {
              const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
              streamRef.current = basicStream;
              const video = mediaRef.current as HTMLVideoElement;
              video.srcObject = basicStream;
              await video.play();
              const videoTexture = new THREE.VideoTexture(video);
              setTexture(videoTexture);
              setIsLoading(false);
              return;
            } catch {
              setError('Failed to access camera with basic settings. Please check your camera permissions.');
            }
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('Failed to load media');
        }
        setIsLoading(false);
      }
    };

    setupMedia();

    const mesh = createVisualizationMesh();
    scene.add(mesh);

    let rafId: number;
    let rafTimeoutId: ReturnType<typeof setTimeout>;

    const animate = () => {
      if (showComparison) return;

      optimizer.current.monitorPerformance();

      if (mesh && texture) {
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.tDiffuse.value = texture;

        const { changed } = effectProcessor.current.updateEffects(effects);
        if (changed) {
          updateShaderUniforms(material, effects, diplopiaSeparation, diplopiaDirection);
        }

        renderer.render(scene, camera);
      }

      const frameRate = optimizer.current.getOptimalFrameRate(enabledEffectsCount);
      if (frameRate < 60) {
        rafTimeoutId = setTimeout(() => { rafId = requestAnimationFrame(animate); }, 1000 / frameRate - 16.67);
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    if (!showComparison) {
      animate();
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(rafTimeoutId);
      if (inputSource.type === 'webcam') return;
      currentAnimationManager.removeCallback(updateOverlays);
      currentOverlayManager.clearOverlays();
      dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSource, retryCount, diplopiaDirection, diplopiaSeparation, effects, texture, showComparison]);

  return { isLoading, error, handleRetryCamera, effectProcessor, overlayManager };
}
