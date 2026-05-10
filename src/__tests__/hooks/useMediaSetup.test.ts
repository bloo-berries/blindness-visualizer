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
    mockLoadAsync.mockReset();
  });

  describe('initial state', () => {
    test('starts with isLoading=true', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      // isLoading starts true before the async effect runs
      expect(result.current.isLoading).toBe(true);
    });

    test('starts with no error', () => {
      const { result } = renderHook(() =>
        useMediaSetup({ type: 'youtube' })
      );
      // Initially no error
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
      const mockTexture = { isTexture: true };
      mockLoadAsync.mockResolvedValueOnce(mockTexture);

      const { result } = renderHook(() =>
        useMediaSetup({ type: 'image', url: 'https://example.com/test.jpg' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.texture).toBe(mockTexture);
      expect(result.current.error).toBeNull();
    });

    test('sets error on image load failure', async () => {
      mockLoadAsync.mockRejectedValueOnce(new Error('Load failed'));

      const { result } = renderHook(() =>
        useMediaSetup({ type: 'image', url: 'https://example.com/bad.jpg' })
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

    test('resets error and sets loading', async () => {
      mockLoadAsync.mockRejectedValueOnce(new Error('fail'));

      const { result } = renderHook(() =>
        useMediaSetup({ type: 'image', url: 'bad.jpg' })
      );

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // On retry with same bad image, it will re-attempt and fail again.
      // But we verify the state resets during the retry.
      mockLoadAsync.mockRejectedValueOnce(new Error('fail again'));

      act(() => {
        result.current.handleRetryCamera();
      });

      // isLoading should be true immediately after retry
      expect(result.current.isLoading).toBe(true);
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
      const mockTexture = { isTexture: true };
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
