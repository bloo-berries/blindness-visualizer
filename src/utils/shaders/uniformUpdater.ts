import * as THREE from 'three';
import { VisualEffect } from '../../types/visualEffects';
import { createEffectMap, getEffectById } from '../effectLookup';

/**
 * Updates shader material uniforms based on visual effects
 *
 * @param material - The shader material to update
 * @param effects - Array of visual effects
 */
export const updateShaderUniforms = (
  material: THREE.ShaderMaterial,
  effects: VisualEffect[],
  diplopiaSeparation: number = 1.0,
  diplopiaDirection: number = 0.0
): void => {
  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);

  // Helper function to update uniform values
  const updateUniform = (effectId: string, uniformName: string) => {
    const effect = getEffectById(effectMap, effectId);
    if (effect) {
      material.uniforms[uniformName].value = effect.enabled ? effect.intensity : 0;
    }
  };

  // Update effect uniforms based on current state
  updateUniform('protanopia', 'protanopiaIntensity');
  updateUniform('deuteranopia', 'deuteranopiaIntensity');
  updateUniform('tritanopia', 'tritanopiaIntensity');
  updateUniform('protanomaly', 'protanomalyIntensity');
  updateUniform('deuteranomaly', 'deuteranomalyIntensity');
  updateUniform('tritanomaly', 'tritanomalyIntensity');
  updateUniform('retinitisPigmentosa', 'retinitisPigmentosaIntensity');
  updateUniform('diplopiaMonocular', 'diplopiaMonocularIntensity');
  updateUniform('diplopiaBinocular', 'diplopiaBinocularIntensity');
  updateUniform('stargardt', 'stargardtIntensity');
  updateUniform('amd', 'amdIntensity');
  updateUniform('diabeticRetinopathy', 'diabeticRetinopathyIntensity');
  updateUniform('glaucoma', 'glaucomaIntensity');

  // Update John Milton-specific effect uniforms
  updateUniform('miltonGlaucomaHalos', 'miltonGlaucomaHalosIntensity');
  updateUniform('miltonProgressiveVignetting', 'miltonProgressiveVignettingIntensity');
  updateUniform('miltonScotomas', 'miltonScotomasIntensity');
  updateUniform('miltonRetinalDetachment', 'miltonRetinalDetachmentIntensity');
  updateUniform('miltonPhotophobia', 'miltonPhotophobiaIntensity');
  updateUniform('miltonTemporalFieldLoss', 'miltonTemporalFieldLossIntensity');
  updateUniform('miltonProgressiveBlindness', 'miltonProgressiveBlindnessIntensity');

  // Galileo Galilei-specific effects
  updateUniform('galileoAcuteHalos', 'galileoAcuteHalosIntensity');
  updateUniform('galileoSevereBlurring', 'galileoSevereBlurringIntensity');
  updateUniform('galileoRedEyeEffect', 'galileoRedEyeEffectIntensity');
  updateUniform('galileoExtremePhotophobia', 'galileoExtremePhotophobiaIntensity');
  updateUniform('galileoCornealHaziness', 'galileoCornealHazinessIntensity');
  updateUniform('galileoSectoralDefects', 'galileoSectoralDefectsIntensity');
  updateUniform('galileoArcuateScotomas', 'galileoArcuateScotomasIntensity');
  updateUniform('galileoSwissCheeseVision', 'galileoSwissCheeseVisionIntensity');
  updateUniform('galileoAcuteAttackMode', 'galileoAcuteAttackModeIntensity');
  updateUniform('galileoChronicProgression', 'galileoChronicProgressionIntensity');

  // Note: Myopia and Hyperopia are now handled by CSS filters

  // Update diplopia parameters
  material.uniforms.diplopiaSeparation.value = diplopiaSeparation;
  material.uniforms.diplopiaDirection.value = diplopiaDirection;

  // Update time for animated effects
  material.uniforms.time.value = performance.now() * 0.001;
};
