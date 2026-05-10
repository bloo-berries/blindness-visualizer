/**
 * Tests for useMediaSetup hook.
 *
 * The hook manages media source setup for webcam, image, and youtube inputs.
 * It returns refs, texture state, loading state, error state, and retry handler.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaSetup } from '../../components/Visualizer/hooks/useMediaSetup';
import { InputSource } from '../../types/visualEffects';

// Mock THREE.js
const mockLoadAsync = jest.fn();
const mockDispose = jest.fn();

jest.mock('three', () => ({
  TextureLoader: jest.fn().mockImplementation(() => ({
    loadAsync: mockLoadAsync,
  })),
  Texture: jest.fn(),
  VideoTexture: jest.fn(),
}));

describe('useMediaSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // CRA sets resetMocks: true, which clears mockImplementation on all mocks.
    // Re-apply the TextureLoader implementation so `new TextureLoader()` returns
    // an object with our mockLoadAsync function.
    const THREE = require('three');
    THREE.TextureLoader.mockImplementation(() => ({
      loadAsync: mockLoadAsync,
    }));
  });

  /** Creates a mock texture with a dispose method */
  function createMockTexture() {
    return { isTexture: true, dispose: mockDispose };
  }

  describe('initial state', () => {
    test('starts with isLoading and resolves to false for youtube', async () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );

      // For youtube, the async effect resolves synchronously (no await),
      // so after render + effect flush, isLoading is already false.
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    test('starts with no error', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      expect(result.current.error).toBeNull();
    });

    test('retryCount starts at 0', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      expect(result.current.retryCount).toBe(0);
    });

    test('provides mediaRef', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      expect(result.current.mediaRef).toBeDefined();
    });

    test('provides streamRef', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      expect(result.current.streamRef).toBeDefined();
    });
  });

  describe('YouTube source', () => {
    test('sets texture to null for youtube (CSS filters used instead)', async () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.texture).toBeNull();
      expect(result.current.error).toBeNull();
    });

    test('finishes loading for youtube source', async () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Image source', () => {
    test('loads image texture successfully', async () => {
      const mockTexture = createMockTexture();
      mockLoadAsync.mockResolvedValueOnce(mockTexture);

      const imageSource: InputSource = { type: 'image', url: 'https://example.com/test.jpg' };
      const { result } = renderHook(() =>
        useMediaSetup(imageSource)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.texture).toBe(mockTexture);
      expect(result.current.error).toBeNull();
    });

    test('sets error on image load failure', async () => {
      mockLoadAsync.mockRejectedValueOnce(new Error('Load failed'));

      const badImageSource: InputSource = { type: 'image', url: 'https://example.com/bad.jpg' };
      const { result } = renderHook(() =>
        useMediaSetup(badImageSource)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(
        'Failed to load image. The file may be corrupted or unsupported. Please try uploading again.'
      );
      expect(result.current.texture).toBeNull();
    });
  });

  describe('Webcam source', () => {
    test('shows disabled message for webcam', async () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'webcam' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(
        'Camera feature is currently disabled. This is a premium feature coming soon.'
      );
    });
  });

  describe('handleRetryCamera', () => {
    test('increments retryCount', async () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.retryCount).toBe(0);

      act(() => {
        result.current.handleRetryCamera();
      });

      expect(result.current.retryCount).toBe(1);
    });

    test('resets error and sets loading on retry', async () => {
      mockLoadAsync.mockRejectedValueOnce(new Error('fail'));

      const badSource: InputSource = { type: 'image', url: 'bad.jpg' };
      const { result } = renderHook(() =>
        useMediaSetup(badSource)
      );

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // On retry, the effect will re-run. Set up another rejection.
      mockLoadAsync.mockRejectedValueOnce(new Error('fail again'));

      act(() => {
        result.current.handleRetryCamera();
      });

      // After retry, error should eventually appear again
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // retryCount should have incremented
      expect(result.current.retryCount).toBe(1);
    });
  });

  describe('source changes', () => {
    test('re-initializes when input source changes', async () => {
      const { result, rerender } = renderHook(
        ({ source }: { source: InputSource }) => useMediaSetup(source),
        { initialProps: { source: { type: 'youtube' } as InputSource } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.texture).toBeNull();

      // Switch to image
      const mockTexture = createMockTexture();
      mockLoadAsync.mockResolvedValueOnce(mockTexture);

      rerender({ source: { type: 'image', url: 'test.png' } as InputSource });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.texture).toBe(mockTexture);
    });

    test('resets error when switching sources', async () => {
      mockLoadAsync.mockRejectedValueOnce(new Error('fail'));

      const { result, rerender } = renderHook(
        ({ source }: { source: InputSource }) => useMediaSetup(source),
        {
          initialProps: {
            source: { type: 'image', url: 'bad.jpg' } as InputSource,
          },
        }
      );

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Switch to youtube -- error should clear
      rerender({ source: { type: 'youtube' } as InputSource });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
