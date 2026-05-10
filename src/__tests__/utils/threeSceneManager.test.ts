/**
 * Tests for Three.js scene manager (src/utils/threeSceneManager.ts)
 */

// Mock domElement with jest.fn spies for event listener tracking
const mockDomElement: Record<string, any> = {};

jest.mock('three', () => {
  // All mock functions must be created inside the factory
  // since jest.mock is hoisted above variable declarations

  const WebGLRenderer = jest.fn();
  WebGLRenderer.prototype.setSize = jest.fn();
  WebGLRenderer.prototype.render = jest.fn();
  WebGLRenderer.prototype.dispose = jest.fn();
  WebGLRenderer.prototype.setPixelRatio = jest.fn();

  const Scene = jest.fn();
  Scene.prototype.add = jest.fn();
  Scene.prototype.remove = jest.fn();
  Scene.prototype.children = [];

  const OrthographicCamera = jest.fn();
  OrthographicCamera.prototype.position = { set: jest.fn() };
  OrthographicCamera.prototype.updateProjectionMatrix = jest.fn();

  return {
    WebGLRenderer,
    Scene,
    OrthographicCamera,
    PlaneGeometry: jest.fn(),
    ShaderMaterial: jest.fn(),
    Mesh: jest.fn(),
  };
});

import * as THREE from 'three';

describe('createSceneManager', () => {
  let createSceneManager: (container: HTMLDivElement) => any;
  let container: HTMLDivElement;

  beforeAll(() => {
    createSceneManager = require('../../utils/threeSceneManager').createSceneManager;
  });

  beforeEach(() => {
    // Reset prototype mock functions
    (THREE.WebGLRenderer.prototype.setSize as jest.Mock).mockClear();
    (THREE.WebGLRenderer.prototype.dispose as jest.Mock).mockClear();
    (THREE.WebGLRenderer as jest.Mock).mockClear();
    (THREE.Scene as jest.Mock).mockClear();
    (THREE.OrthographicCamera as jest.Mock).mockClear();

    // Create fresh domElement mock for each test
    mockDomElement.addEventListener = jest.fn();
    mockDomElement.removeEventListener = jest.fn();
    mockDomElement.getContext = jest.fn();
    mockDomElement.style = {};

    // Assign the mock domElement to the prototype so new instances get it
    Object.defineProperty(THREE.WebGLRenderer.prototype, 'domElement', {
      get: () => mockDomElement,
      configurable: true,
    });

    container = document.createElement('div');
    container.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    // Mock appendChild/removeChild to handle our mock domElement
    container.appendChild = jest.fn().mockReturnValue(mockDomElement) as any;
    container.removeChild = jest.fn().mockReturnValue(mockDomElement) as any;
  });

  test('returns an object with scene, camera, renderer, and dispose', () => {
    const manager = createSceneManager(container);
    expect(manager).toHaveProperty('scene');
    expect(manager).toHaveProperty('camera');
    expect(manager).toHaveProperty('renderer');
    expect(manager).toHaveProperty('dispose');
    expect(typeof manager.dispose).toBe('function');
  });

  test('creates a Scene instance', () => {
    createSceneManager(container);
    expect(THREE.Scene).toHaveBeenCalledTimes(1);
  });

  test('creates an OrthographicCamera with correct parameters', () => {
    createSceneManager(container);
    expect(THREE.OrthographicCamera).toHaveBeenCalledWith(-1, 1, 1, -1, 0, 1);
  });

  test('creates a WebGLRenderer with alpha enabled', () => {
    createSceneManager(container);
    expect(THREE.WebGLRenderer).toHaveBeenCalledWith({ alpha: true });
  });

  test('sets renderer size to match container dimensions', () => {
    createSceneManager(container);
    expect(THREE.WebGLRenderer.prototype.setSize).toHaveBeenCalledWith(800, 600);
  });

  test('appends renderer canvas to container', () => {
    createSceneManager(container);
    expect(container.appendChild).toHaveBeenCalledWith(mockDomElement);
  });

  test('dispose calls renderer.dispose()', () => {
    const manager = createSceneManager(container);
    manager.dispose();
    expect(THREE.WebGLRenderer.prototype.dispose).toHaveBeenCalled();
  });

  test('dispose removes canvas from container', () => {
    const manager = createSceneManager(container);
    manager.dispose();
    expect(container.removeChild).toHaveBeenCalledWith(mockDomElement);
  });

  test('registers webglcontextlost and webglcontextrestored listeners', () => {
    createSceneManager(container);
    expect(mockDomElement.addEventListener).toHaveBeenCalledWith(
      'webglcontextlost', expect.any(Function)
    );
    expect(mockDomElement.addEventListener).toHaveBeenCalledWith(
      'webglcontextrestored', expect.any(Function)
    );
  });

  test('dispose removes event listeners', () => {
    const manager = createSceneManager(container);
    manager.dispose();
    expect(mockDomElement.removeEventListener).toHaveBeenCalledWith(
      'webglcontextlost', expect.any(Function)
    );
    expect(mockDomElement.removeEventListener).toHaveBeenCalledWith(
      'webglcontextrestored', expect.any(Function)
    );
  });

  test('webglcontextlost handler calls preventDefault', () => {
    createSceneManager(container);
    const contextLostCall = mockDomElement.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'webglcontextlost'
    );
    expect(contextLostCall).toBeDefined();

    const handler = contextLostCall[1] as (event: any) => void;
    const mockEvent = { preventDefault: jest.fn() };
    handler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('webglcontextrestored handler re-applies renderer size', () => {
    createSceneManager(container);
    const contextRestoredCall = mockDomElement.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'webglcontextrestored'
    );
    expect(contextRestoredCall).toBeDefined();

    (THREE.WebGLRenderer.prototype.setSize as jest.Mock).mockClear();
    const handler = contextRestoredCall[1] as () => void;
    handler();
    expect(THREE.WebGLRenderer.prototype.setSize).toHaveBeenCalledWith(800, 600);
  });
});
