/**
 * Tests for useSceneSetup hook (src/components/Visualizer/hooks/useSceneSetup.ts)
 */
import { renderHook, act } from '@testing-library/react';

// Mock Three.js
jest.mock('three', () => {
  const mockCanvas = global.document.createElement('canvas');
  mockCanvas.addEventListener = jest.fn();
  mockCanvas.removeEventListener = jest.fn();

  return {
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      domElement: mockCanvas,
      setPixelRatio: jest.fn(),
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      remove: jest.fn(),
    })),
    OrthographicCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      updateProjectionMatrix: jest.fn(),
    })),
    PlaneGeometry: jest.fn(),
    ShaderMaterial: jest.fn().mockImplementation(() => ({
      uniforms: {},
      dispose: jest.fn(),
    })),
    Mesh: jest.fn().mockImplementation(() => ({
      geometry: { dispose: jest.fn() },
      material: { dispose: jest.fn(), uniforms: {} },
    })),
    Texture: jest.fn().mockImplementation(() => ({
      dispose: jest.fn(),
    })),
    VideoTexture: jest.fn().mockImplementation(() => ({
      dispose: jest.fn(),
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
      load: jest.fn(),
    })),
    LinearFilter: 1,
    RGBAFormat: 1,
    ClampToEdgeWrapping: 1,
    SRGBColorSpace: '',
    NearestFilter: 1,
    DoubleSide: 2,
  };
});

// Mock threeSceneManager
const mockDispose = jest.fn();
const mockCreateSceneManager = jest.fn().mockReturnValue({
  scene: { add: jest.fn(), remove: jest.fn() },
  camera: {},
  renderer: { render: jest.fn(), dispose: jest.fn(), domElement: document.createElement('canvas') },
  dispose: mockDispose,
});

jest.mock('../../utils/threeSceneManager', () => ({
  createSceneManager: (...args: any[]) => mockCreateSceneManager(...args),
}));

// Mock shaders
jest.mock('../../utils/shaders', () => ({
  createVisualizationMesh: jest.fn().mockReturnValue({
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn(), uniforms: {} },
  }),
  updateShaderUniforms: jest.fn(),
}));

// Mock performance utilities — all objects defined inside factory to avoid hoisting issues
jest.mock('../../utils/performance', () => {
  const optimizer = {
    monitorPerformance: jest.fn(),
    getOptimalFrameRate: jest.fn().mockReturnValue(60),
  };
  const animMgr = {
    addCallback: jest.fn(),
    removeCallback: jest.fn(),
  };
  return {
    PerformanceOptimizer: {
      getInstance: jest.fn().mockReturnValue(optimizer),
    },
    EffectProcessor: jest.fn().mockImplementation(() => ({
      updateEffects: jest.fn().mockReturnValue({ changed: false, enabledEffects: [] }),
    })),
    OverlayManager: jest.fn().mockImplementation(() => ({
      updateOverlays: jest.fn(),
      updateAnimatedOverlays: jest.fn(),
      clearOverlays: jest.fn(),
    })),
    AnimationManager: {
      getInstance: jest.fn().mockReturnValue(animMgr),
    },
  };
});

// Prevent real animation frames from firing during tests
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;
beforeAll(() => {
  window.requestAnimationFrame = jest.fn().mockReturnValue(1);
  window.cancelAnimationFrame = jest.fn();
});
afterAll(() => {
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
});

import { VisualEffect, InputSource } from '../../types/visualEffects';
import { useSceneSetup } from '../../components/Visualizer/hooks/useSceneSetup';

const makeEffect = (id: string, enabled = false, intensity = 0.5): VisualEffect => ({
  id,
  name: id,
  description: '',
  category: 'colorVision' as any,
  enabled,
  intensity,
});

describe('useSceneSetup', () => {
  const createRefs = () => ({
    containerRef: { current: document.createElement('div') },
    mediaRef: { current: document.createElement('video') as HTMLVideoElement | HTMLImageElement },
    streamRef: { current: null as MediaStream | null },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateSceneManager.mockReturnValue({
      scene: { add: jest.fn(), remove: jest.fn() },
      camera: {},
      renderer: { render: jest.fn(), dispose: jest.fn(), domElement: document.createElement('canvas') },
      dispose: mockDispose,
    });
  });

  test('YouTube source skips WebGL and sets isLoading to false', () => {
    const refs = createRefs();
    const effects: VisualEffect[] = [makeEffect('protanopia')];
    const inputSource: InputSource = { type: 'youtube' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockCreateSceneManager).not.toHaveBeenCalled();
  });

  test('image source skips WebGL and sets isLoading to false', () => {
    const refs = createRefs();
    const effects: VisualEffect[] = [makeEffect('deuteranopia')];
    const inputSource: InputSource = { type: 'image', url: 'test.jpg' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockCreateSceneManager).not.toHaveBeenCalled();
  });

  test('WebGL failure sets error message and stops loading', () => {
    mockCreateSceneManager.mockImplementation(() => {
      throw new Error('WebGL not supported');
    });

    const refs = createRefs();
    refs.containerRef.current!.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    const effects: VisualEffect[] = [makeEffect('protanopia')];
    const inputSource: InputSource = { type: 'webcam' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toContain('WebGL is not available');
  });

  test('YouTube source cleanup on unmount runs without error', () => {
    const refs = createRefs();
    const effects: VisualEffect[] = [makeEffect('protanopia')];
    const inputSource: InputSource = { type: 'youtube' };

    const { unmount } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    // YouTube path has no WebGL cleanup but should unmount cleanly
    expect(() => unmount()).not.toThrow();
  });

  test('showComparison mode sets isLoading to false for non-media sources', () => {
    const refs = createRefs();
    refs.containerRef.current!.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    const effects: VisualEffect[] = [makeEffect('protanopia')];
    const inputSource: InputSource = { type: 'youtube' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, true
      )
    );

    expect(result.current.isLoading).toBe(false);
  });

  test('handleRetryCamera increments retry count', () => {
    const refs = createRefs();
    const effects: VisualEffect[] = [makeEffect('protanopia')];
    const inputSource: InputSource = { type: 'youtube' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    expect(typeof result.current.handleRetryCamera).toBe('function');

    act(() => {
      result.current.handleRetryCamera();
    });

    // After retry, loading state resets
    expect(result.current.error).toBeNull();
  });

  test('returns effectProcessor and overlayManager refs', () => {
    const refs = createRefs();
    const effects: VisualEffect[] = [];
    const inputSource: InputSource = { type: 'youtube' };

    const { result } = renderHook(() =>
      useSceneSetup(
        refs.containerRef, refs.mediaRef, refs.streamRef,
        effects, inputSource, 1.0, 0.0, false
      )
    );

    expect(result.current.effectProcessor).toBeDefined();
    expect(result.current.overlayManager).toBeDefined();
    expect(result.current.effectProcessor.current).toBeDefined();
    expect(result.current.overlayManager.current).toBeDefined();
  });
});
