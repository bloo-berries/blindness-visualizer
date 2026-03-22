/**
 * Main function that applies all effects
 */
export const MAIN_FUNCTION = `
  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;

    if (protanopiaIntensity > 0.0) {
      color = mix(color, applyProtanopia(color), protanopiaIntensity);
    }
    if (deuteranopiaIntensity > 0.0) {
      color = mix(color, applyDeuteranopia(color), deuteranopiaIntensity);
    }
    if (tritanopiaIntensity > 0.0) {
      color = mix(color, applyTritanopia(color), tritanopiaIntensity);
    }
    if (protanomalyIntensity > 0.0) {
      color = applyProtanomaly(color, protanomalyIntensity);
    }
    if (deuteranomalyIntensity > 0.0) {
      color = applyDeuteranomaly(color, deuteranomalyIntensity);
    }
    if (tritanomalyIntensity > 0.0) {
      color = applyTritanomaly(color, tritanomalyIntensity);
    }
    if (retinitisPigmentosaIntensity > 0.0) {
      color = applyRetinitisPigmentosa(color, vUv, retinitisPigmentosaIntensity, time);
    }
    if (diplopiaMonocularIntensity > 0.0) {
      color = applyMonocularDiplopia(color, vUv, diplopiaMonocularIntensity, diplopiaSeparation, diplopiaDirection);
    }
    if (diplopiaBinocularIntensity > 0.0) {
      color = applyBinocularDiplopia(color, vUv, diplopiaBinocularIntensity, diplopiaSeparation, diplopiaDirection);
    }
    if (stargardtIntensity > 0.0) {
      color = applyStargardt(color, vUv, stargardtIntensity);
    }
    if (amdIntensity > 0.0) {
      color = applyAMD(color, vUv, amdIntensity);
    }
    if (diabeticRetinopathyIntensity > 0.0) {
      color = applyDiabeticRetinopathy(color, vUv, diabeticRetinopathyIntensity, time);
    }
    if (glaucomaIntensity > 0.0) {
      color = applyGlaucoma(color, vUv, glaucomaIntensity, time);
    }
    if (miltonGlaucomaHalosIntensity > 0.0) {
      color = applyMiltonGlaucomaHalos(color, vUv, miltonGlaucomaHalosIntensity, time);
    }
    if (miltonProgressiveVignettingIntensity > 0.0) {
      color = applyMiltonProgressiveVignetting(color, vUv, miltonProgressiveVignettingIntensity, time);
    }
    if (miltonScotomasIntensity > 0.0) {
      color = applyMiltonScotomas(color, vUv, miltonScotomasIntensity, time);
    }
    if (miltonRetinalDetachmentIntensity > 0.0) {
      color = applyMiltonRetinalDetachment(color, vUv, miltonRetinalDetachmentIntensity, time);
    }
    if (miltonPhotophobiaIntensity > 0.0) {
      color = applyMiltonPhotophobia(color, vUv, miltonPhotophobiaIntensity, time);
    }
    if (miltonTemporalFieldLossIntensity > 0.0) {
      color = applyMiltonTemporalFieldLoss(color, vUv, miltonTemporalFieldLossIntensity, time);
    }
    if (miltonProgressiveBlindnessIntensity > 0.0) {
      color = applyMiltonProgressiveBlindness(color, vUv, miltonProgressiveBlindnessIntensity, time);
    }
    if (galileoAcuteHalosIntensity > 0.0) {
      color = applyGalileoAcuteHalos(color, vUv, galileoAcuteHalosIntensity, time);
    }
    if (galileoSevereBlurringIntensity > 0.0) {
      color = applyGalileoSevereBlurring(color, vUv, galileoSevereBlurringIntensity, time);
    }
    if (galileoRedEyeEffectIntensity > 0.0) {
      color = applyGalileoRedEyeEffect(color, vUv, galileoRedEyeEffectIntensity, time);
    }
    if (galileoExtremePhotophobiaIntensity > 0.0) {
      color = applyGalileoExtremePhotophobia(color, vUv, galileoExtremePhotophobiaIntensity, time);
    }
    if (galileoCornealHazinessIntensity > 0.0) {
      color = applyGalileoCornealHaziness(color, vUv, galileoCornealHazinessIntensity, time);
    }
    if (galileoSectoralDefectsIntensity > 0.0) {
      color = applyGalileoSectoralDefects(color, vUv, galileoSectoralDefectsIntensity, time);
    }
    if (galileoArcuateScotomasIntensity > 0.0) {
      color = applyGalileoArcuateScotomas(color, vUv, galileoArcuateScotomasIntensity, time);
    }
    if (galileoSwissCheeseVisionIntensity > 0.0) {
      color = applyGalileoSwissCheeseVision(color, vUv, galileoSwissCheeseVisionIntensity, time);
    }
    if (galileoAcuteAttackModeIntensity > 0.0) {
      color = applyGalileoAcuteAttackMode(color, vUv, galileoAcuteAttackModeIntensity, time);
    }
    if (galileoChronicProgressionIntensity > 0.0) {
      color = applyGalileoChronicProgression(color, vUv, galileoChronicProgressionIntensity, time);
    }

    gl_FragColor = vec4(color, texel.a);
  }
`;
