/**
 * Uniform declarations for all vision condition intensities
 */
export const UNIFORM_DECLARATIONS = `
  uniform sampler2D tDiffuse;
  uniform float protanopiaIntensity;
  uniform float deuteranopiaIntensity;
  uniform float tritanopiaIntensity;
  uniform float protanomalyIntensity;
  uniform float deuteranomalyIntensity;
  uniform float tritanomalyIntensity;
  uniform float retinitisPigmentosaIntensity;
  uniform float diplopiaMonocularIntensity;
  uniform float diplopiaBinocularIntensity;
  uniform float diplopiaSeparation;
  uniform float diplopiaDirection;
  uniform float stargardtIntensity;
  uniform float amdIntensity;
  uniform float diabeticRetinopathyIntensity;
  uniform float glaucomaIntensity;
  uniform float time;
  // John Milton-specific effects
  uniform float miltonGlaucomaHalosIntensity;
  uniform float miltonProgressiveVignettingIntensity;
  uniform float miltonScotomasIntensity;
  uniform float miltonRetinalDetachmentIntensity;
  uniform float miltonPhotophobiaIntensity;
  uniform float miltonTemporalFieldLossIntensity;
  uniform float miltonProgressiveBlindnessIntensity;
  // Galileo Galilei-specific effects
  uniform float galileoAcuteHalosIntensity;
  uniform float galileoSevereBlurringIntensity;
  uniform float galileoRedEyeEffectIntensity;
  uniform float galileoExtremePhotophobiaIntensity;
  uniform float galileoCornealHazinessIntensity;
  uniform float galileoSectoralDefectsIntensity;
  uniform float galileoArcuateScotomasIntensity;
  uniform float galileoSwissCheeseVisionIntensity;
  uniform float galileoAcuteAttackModeIntensity;
  uniform float galileoChronicProgressionIntensity;
  varying vec2 vUv;
`;
