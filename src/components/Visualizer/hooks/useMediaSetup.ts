import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { InputSource } from '../../../types/visualEffects';

interface MediaSetupResult {
  mediaRef: React.RefObject<HTMLVideoElement | HTMLImageElement>;
  streamRef: React.RefObject<MediaStream | null>;
  texture: THREE.Texture | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  handleRetryCamera: () => void;
}

/**
 * Hook to manage media source setup (webcam, image, youtube)
 */
export const useMediaSetup = (inputSource: InputSource): MediaSetupResult => {
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetryCamera = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        if (inputSource.type === 'webcam') {
          // Camera feature is disabled - show error message
          setError('Camera feature is currently disabled. This is a premium feature coming soon.');
          setIsLoading(false);
          return;

        } else if (inputSource.type === 'image' && inputSource.url) {
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
          setTexture(imageTexture);
          setIsLoading(false);
        } else if (inputSource.type === 'youtube') {
          // For YouTube, we'll use CSS filters instead of WebGL textures
          setTexture(null);
          setIsLoading(false);
        }
      } catch (err) {
        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and refresh the page.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera and try again.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera is already in use by another application. Please close other camera applications and try again.');
          } else if (err.name === 'OverconstrainedError') {
            setError('Camera constraints cannot be satisfied. Trying with basic settings...');
            // Try again with basic constraints
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

    setIsLoading(true);
    setError(null);
    setupMedia();
  }, [inputSource, retryCount]);

  return {
    mediaRef,
    streamRef,
    texture,
    isLoading,
    error,
    retryCount,
    handleRetryCamera
  };
};
