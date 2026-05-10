/**
 * Tests for shader system files (src/utils/shaders/)
 */

jest.mock('three', () => ({
  WebGLRenderer: jest.fn(),
  Scene: jest.fn(),
  OrthographicCamera: jest.fn(),
  PlaneGeometry: jest.fn().mockImplementation(function () {
    return { mockPlaneGeometry: true };
  }),
  ShaderMaterial: jest.fn().mockImplementation(function (config: any) {
    return {
      uniforms: config?.uniforms || {},
      vertexShader: config?.vertexShader || '',
      fragmentShader: config?.fragmentShader || '',
      dispose: jest.fn(),
    };
  }),
  Mesh: jest.fn().mockImplementation(function (geometry: any, material: any) {
    return {
      geometry: geometry,
      material: material,
    };
  }),
  VideoTexture: jest.fn(),
  TextureLoader: jest.fn(),
  LinearFilter: 'LinearFilter',
  ClampToEdgeWrapping: 'ClampToEdgeWrapping',
  SRGBColorSpace: 'srgb',
}));

import {
  getFragmentShader,
  UNIFORM_DECLARATIONS,
  COLOR_BLINDNESS_FUNCTIONS,
  RETINAL_FUNCTIONS,
  DIPLOPIA_FUNCTIONS,
  UTILITY_FUNCTIONS,
  GLAUCOMA_FUNCTION,
  MILTON_FUNCTIONS,
  GALILEO_FUNCTIONS,
  MAIN_FUNCTION,
} from '../../utils/shaders/fragmentShader';
import { createShaderUniforms } from '../../utils/shaders/shaderUniforms';
import { createColorBlindnessShaderMaterial } from '../../utils/shaders/shaderMaterial';
import { createVisualizationMesh } from '../../utils/shaders/meshCreator';
import * as THREE from 'three';

describe('Fragment Shader', () => {
  test('getFragmentShader returns a non-empty string', () => {
    const shader = getFragmentShader();
    expect(typeof shader).toBe('string');
    expect(shader.length).toBeGreaterThan(0);
  });

  test('fragment shader contains uniform declarations', () => {
    const shader = getFragmentShader();
    expect(shader).toContain('uniform');
    expect(shader).toContain('sampler2D tDiffuse');
  });

  test('fragment shader contains void main()', () => {
    const shader = getFragmentShader();
    expect(shader).toContain('void main()');
  });

  test('fragment shader contains texture2D call', () => {
    const shader = getFragmentShader();
    expect(shader).toContain('texture2D');
  });

  test('fragment shader references gl_FragColor', () => {
    const shader = getFragmentShader();
    expect(shader).toContain('gl_FragColor');
  });

  test('all shader parts are non-empty strings', () => {
    expect(UNIFORM_DECLARATIONS.length).toBeGreaterThan(0);
    expect(COLOR_BLINDNESS_FUNCTIONS.length).toBeGreaterThan(0);
    expect(RETINAL_FUNCTIONS.length).toBeGreaterThan(0);
    expect(DIPLOPIA_FUNCTIONS.length).toBeGreaterThan(0);
    expect(UTILITY_FUNCTIONS.length).toBeGreaterThan(0);
    expect(GLAUCOMA_FUNCTION.length).toBeGreaterThan(0);
    expect(MILTON_FUNCTIONS.length).toBeGreaterThan(0);
    expect(GALILEO_FUNCTIONS.length).toBeGreaterThan(0);
    expect(MAIN_FUNCTION.length).toBeGreaterThan(0);
  });

  test('UNIFORM_DECLARATIONS contains expected intensity uniforms', () => {
    expect(UNIFORM_DECLARATIONS).toContain('protanopiaIntensity');
    expect(UNIFORM_DECLARATIONS).toContain('deuteranopiaIntensity');
    expect(UNIFORM_DECLARATIONS).toContain('tritanopiaIntensity');
    expect(UNIFORM_DECLARATIONS).toContain('glaucomaIntensity');
  });

  test('MAIN_FUNCTION references color blindness application functions', () => {
    expect(MAIN_FUNCTION).toContain('applyProtanopia');
    expect(MAIN_FUNCTION).toContain('applyDeuteranopia');
    expect(MAIN_FUNCTION).toContain('applyTritanopia');
  });
});

describe('Shader Uniforms', () => {
  test('createShaderUniforms returns an object', () => {
    const uniforms = createShaderUniforms();
    expect(typeof uniforms).toBe('object');
  });

  test('uniforms contain tDiffuse with null initial value', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.tDiffuse).toBeDefined();
    expect(uniforms.tDiffuse.value).toBeNull();
  });

  test('uniforms contain color blindness intensity values initialized to 0', () => {
    const uniforms = createShaderUniforms();
    const colorBlindnessKeys = [
      'protanopiaIntensity', 'deuteranopiaIntensity', 'tritanopiaIntensity',
      'protanomalyIntensity', 'deuteranomalyIntensity', 'tritanomalyIntensity',
    ];
    for (const key of colorBlindnessKeys) {
      expect(uniforms[key]).toBeDefined();
      expect(uniforms[key].value).toBe(0.0);
    }
  });

  test('uniforms contain retinal disease keys', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.retinitisPigmentosaIntensity).toBeDefined();
    expect(uniforms.stargardtIntensity).toBeDefined();
    expect(uniforms.amdIntensity).toBeDefined();
    expect(uniforms.diabeticRetinopathyIntensity).toBeDefined();
  });

  test('uniforms contain diplopia keys', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.diplopiaMonocularIntensity).toBeDefined();
    expect(uniforms.diplopiaBinocularIntensity).toBeDefined();
    expect(uniforms.diplopiaSeparation).toBeDefined();
    expect(uniforms.diplopiaDirection).toBeDefined();
  });

  test('uniforms contain Milton-specific keys', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.miltonGlaucomaHalosIntensity).toBeDefined();
    expect(uniforms.miltonProgressiveBlindnessIntensity).toBeDefined();
  });

  test('uniforms contain Galileo-specific keys', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.galileoAcuteHalosIntensity).toBeDefined();
    expect(uniforms.galileoSwissCheeseVisionIntensity).toBeDefined();
  });

  test('uniforms contain time value', () => {
    const uniforms = createShaderUniforms();
    expect(uniforms.time).toBeDefined();
    expect(uniforms.time.value).toBe(0.0);
  });

  test('all uniform values are wrapped in { value } objects', () => {
    const uniforms = createShaderUniforms();
    for (const [, uniform] of Object.entries(uniforms)) {
      expect(uniform).toHaveProperty('value');
    }
  });
});

describe('Shader Material', () => {
  test('createColorBlindnessShaderMaterial calls ShaderMaterial constructor', () => {
    (THREE.ShaderMaterial as jest.Mock).mockClear();
    createColorBlindnessShaderMaterial();
    expect(THREE.ShaderMaterial).toHaveBeenCalledTimes(1);
  });

  test('ShaderMaterial is called with uniforms, vertexShader, and fragmentShader', () => {
    (THREE.ShaderMaterial as jest.Mock).mockClear();
    createColorBlindnessShaderMaterial();
    const callArgs = (THREE.ShaderMaterial as jest.Mock).mock.calls[0][0];
    expect(callArgs).toHaveProperty('uniforms');
    expect(callArgs).toHaveProperty('vertexShader');
    expect(callArgs).toHaveProperty('fragmentShader');
  });

  test('ShaderMaterial receives vertexShader with vUv varying', () => {
    (THREE.ShaderMaterial as jest.Mock).mockClear();
    createColorBlindnessShaderMaterial();
    const callArgs = (THREE.ShaderMaterial as jest.Mock).mock.calls[0][0];
    expect(callArgs.vertexShader).toContain('vUv');
    expect(callArgs.vertexShader).toContain('gl_Position');
  });

  test('ShaderMaterial receives non-empty fragmentShader', () => {
    (THREE.ShaderMaterial as jest.Mock).mockClear();
    createColorBlindnessShaderMaterial();
    const callArgs = (THREE.ShaderMaterial as jest.Mock).mock.calls[0][0];
    expect(callArgs.fragmentShader).toBeTruthy();
    expect(callArgs.fragmentShader.length).toBeGreaterThan(0);
  });

  test('ShaderMaterial uniforms include protanopiaIntensity', () => {
    (THREE.ShaderMaterial as jest.Mock).mockClear();
    createColorBlindnessShaderMaterial();
    const callArgs = (THREE.ShaderMaterial as jest.Mock).mock.calls[0][0];
    expect(callArgs.uniforms.protanopiaIntensity).toBeDefined();
    expect(callArgs.uniforms.protanopiaIntensity.value).toBe(0.0);
  });
});

describe('Mesh Creator', () => {
  test('createVisualizationMesh calls PlaneGeometry and Mesh', () => {
    (THREE.PlaneGeometry as jest.Mock).mockClear();
    (THREE.Mesh as jest.Mock).mockClear();
    createVisualizationMesh();
    expect(THREE.PlaneGeometry).toHaveBeenCalledWith(2, 2);
    expect(THREE.Mesh).toHaveBeenCalledTimes(1);
  });

  test('createVisualizationMesh returns a value', () => {
    const mesh = createVisualizationMesh();
    expect(mesh).toBeDefined();
  });
});
