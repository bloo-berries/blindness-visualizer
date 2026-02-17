import * as THREE from 'three';
import { getFragmentShader } from './fragmentShader';

/**
 * Creates a Three.js shader material for color blindness simulation
 *
 * @returns A configured ShaderMaterial with color blindness effects
 */
export const createColorBlindnessShaderMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      protanopiaIntensity: { value: 0.0 },
      deuteranopiaIntensity: { value: 0.0 },
      tritanopiaIntensity: { value: 0.0 },
      protanomalyIntensity: { value: 0.0 },
      deuteranomalyIntensity: { value: 0.0 },
      tritanomalyIntensity: { value: 0.0 },
      retinitisPigmentosaIntensity: { value: 0.0 },
      diplopiaMonocularIntensity: { value: 0.0 },
      diplopiaBinocularIntensity: { value: 0.0 },
      diplopiaSeparation: { value: 0.1 },
      diplopiaDirection: { value: 0.0 }, // 0 = horizontal, 1 = vertical, 2 = diagonal
      stargardtIntensity: { value: 0.0 },
      amdIntensity: { value: 0.0 },
      diabeticRetinopathyIntensity: { value: 0.0 },
      glaucomaIntensity: { value: 0.0 },
      time: { value: 0.0 },
      // John Milton-specific effects
      miltonGlaucomaHalosIntensity: { value: 0.0 },
      miltonProgressiveVignettingIntensity: { value: 0.0 },
      miltonScotomasIntensity: { value: 0.0 },
      miltonRetinalDetachmentIntensity: { value: 0.0 },
      miltonPhotophobiaIntensity: { value: 0.0 },
      miltonTemporalFieldLossIntensity: { value: 0.0 },
      miltonProgressiveBlindnessIntensity: { value: 0.0 },
      // Galileo Galilei-specific effects
      galileoAcuteHalosIntensity: { value: 0.0 },
      galileoSevereBlurringIntensity: { value: 0.0 },
      galileoRedEyeEffectIntensity: { value: 0.0 },
      galileoExtremePhotophobiaIntensity: { value: 0.0 },
      galileoCornealHazinessIntensity: { value: 0.0 },
      galileoSectoralDefectsIntensity: { value: 0.0 },
      galileoArcuateScotomasIntensity: { value: 0.0 },
      galileoSwissCheeseVisionIntensity: { value: 0.0 },
      galileoAcuteAttackModeIntensity: { value: 0.0 },
      galileoChronicProgressionIntensity: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: getFragmentShader()
  });
};
