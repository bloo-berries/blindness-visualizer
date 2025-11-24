import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';
import { createMiltonOverlays } from './famousPeople/miltonOverlays';

/**
 * Creates overlays for famous people-specific conditions
 * Includes: Milton, Galileo, Ved, Christine, Lucy, David, Erik, Marla, Minkara, Joshua effects
 */
export const createFamousPeopleOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  // John Milton overlays
  createMiltonOverlays(effects, container);

  // Galileo effects
  const galileoSectoralDefects = getEffect('galileoSectoralDefects');
  const galileoArcuateScotomas = getEffect('galileoArcuateScotomas');
  const galileoSwissCheeseVision = getEffect('galileoSwissCheeseVision');
  const galileoChronicProgression = getEffect('galileoChronicProgression');

  // Ved Mehta effects
  const vedCompleteBlindness = getEffect('vedCompleteBlindness');
  const vedSpatialAwareness = getEffect('vedSpatialAwareness');
  const vedEchoLocation = getEffect('vedEchoLocation');
  const vedAirFlowSensors = getEffect('vedAirFlowSensors');
  const vedProximityRadar = getEffect('vedProximityRadar');
  const vedTemperatureMapping = getEffect('vedTemperatureMapping');

  // Christine Ha effects
  const christineSteamyMirror = getEffect('christineSteamyMirror');
  const christineLightScatter = getEffect('christineLightScatter');
  const christineFogOverlay = getEffect('christineFogOverlay');
  const christineFluctuatingVision = getEffect('christineFluctuatingVision');
  const christineNMOComplete = getEffect('christineNMOComplete');

  // Lucy Edwards effects
  const lucyFrostedGlass = getEffect('lucyFrostedGlass');
  const lucyHeavyBlur = getEffect('lucyHeavyBlur');
  const lucyDesaturation = getEffect('lucyDesaturation');
  const lucyLightDiffusion = getEffect('lucyLightDiffusion');
  const lucyTextureOverlay = getEffect('lucyTextureOverlay');
  const lucyCompleteVision = getEffect('lucyCompleteVision');

  // David Paterson effects
  const davidLeftEyeBlindness = getEffect('davidLeftEyeBlindness');
  const davidRightEyeGlaucoma = getEffect('davidRightEyeGlaucoma');
  const davidHemisphericVision = getEffect('davidHemisphericVision');
  const davidCompleteVision = getEffect('davidCompleteVision');

  // Erik Weihenmayer effects
  const erikRetinoschisisIslands = getEffect('erikRetinoschisisIslands');
  const erikIslandFragmentation = getEffect('erikIslandFragmentation');
  const erikProgressiveLoss = getEffect('erikProgressiveLoss');
  const erikCompleteBlindness = getEffect('erikCompleteBlindness');
  const erikScanningBehavior = getEffect('erikScanningBehavior');
  const erikCognitiveLoad = getEffect('erikCognitiveLoad');

  // Marla Runyan effects
  const marlaCentralScotoma = getEffect('marlaCentralScotoma');
  const marlaPeripheralVision = getEffect('marlaPeripheralVision');
  const marlaEccentricViewing = getEffect('marlaEccentricViewing');
  const marlaFillingIn = getEffect('marlaFillingIn');
  const marlaCrowdingEffect = getEffect('marlaCrowdingEffect');
  const marlaStargardtComplete = getEffect('marlaStargardtComplete');

  // Dr. Mona Minkara effects
  const minkaraEndStageComplete = getEffect('minkaraEndStageComplete');
  const minkaraCentralScotoma = getEffect('minkaraCentralScotoma');
  const minkaraRingScotoma = getEffect('minkaraRingScotoma');
  const minkaraPeripheralIslands = getEffect('minkaraPeripheralIslands');
  const minkaraPhotophobia = getEffect('minkaraPhotophobia');
  const minkaraAchromatopsia = getEffect('minkaraAchromatopsia');
  const minkaraNightBlindness = getEffect('minkaraNightBlindness');
  const minkaraChemistryMode = getEffect('minkaraChemistryMode');

  // Joshua Miele effects
  const joshuaCompleteBlindness = getEffect('joshuaCompleteBlindness');
  const joshuaEcholocation = getEffect('joshuaEcholocation');
  const joshuaTactileMaps = getEffect('joshuaTactileMaps');
  const joshuaAudioLandscape = getEffect('joshuaAudioLandscape');
  const joshuaAccessibilityMode = getEffect('joshuaAccessibilityMode');
  const joshuaSonification = getEffect('joshuaSonification');


  // Ved Mehta - Complete Blindness
  if (vedCompleteBlindness?.enabled) {
    const intensity = vedCompleteBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-vedCompleteBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'vedCompleteBlindness'
    );
  }

  // Ved Mehta - Spatial Awareness
  if (vedSpatialAwareness?.enabled) {
    const intensity = vedSpatialAwareness.intensity;
    
    createOverlay(
      'visual-field-overlay-vedSpatialAwareness',
      `radial-gradient(circle at 50% 50%, transparent 0%, rgba(80,80,80,${intensity * 0.2}) 20%, rgba(60,60,60,${intensity * 0.3}) 40%, rgba(40,40,40,${intensity * 0.4}) 60%, rgba(20,20,20,${intensity * 0.5}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedSpatialAwareness'
    );
  }

  // Ved Mehta - Echo Location
  if (vedEchoLocation?.enabled) {
    const intensity = vedEchoLocation.intensity;
    
    createOverlay(
      'visual-field-overlay-vedEchoLocation',
      `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(100,120,100,${intensity * 0.15}) 45deg, transparent 90deg, rgba(100,120,100,${intensity * 0.15}) 135deg, transparent 180deg, rgba(100,120,100,${intensity * 0.15}) 225deg, transparent 270deg, rgba(100,120,100,${intensity * 0.15}) 315deg, transparent 360deg)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedEchoLocation'
    );
  }

  // Ved Mehta - Air Flow Sensors
  if (vedAirFlowSensors?.enabled) {
    const intensity = vedAirFlowSensors.intensity;
    
    createOverlay(
      'visual-field-overlay-vedAirFlowSensors',
      `linear-gradient(45deg, transparent 0%, rgba(120,130,140,${intensity * 0.2}) 25%, transparent 50%, rgba(120,130,140,${intensity * 0.2}) 75%, transparent 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedAirFlowSensors'
    );
  }

  // Ved Mehta - Proximity Radar
  if (vedProximityRadar?.enabled) {
    const intensity = vedProximityRadar.intensity;
    
    createOverlay(
      'visual-field-overlay-vedProximityRadar',
      `radial-gradient(circle at 20% 20%, rgba(140,120,100,${intensity * 0.25}) 0%, transparent 10%), radial-gradient(circle at 80% 30%, rgba(140,120,100,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 80%, rgba(140,120,100,${intensity * 0.3}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedProximityRadar'
    );
  }

  // Ved Mehta - Temperature Mapping
  if (vedTemperatureMapping?.enabled) {
    const intensity = vedTemperatureMapping.intensity;
    
    createOverlay(
      'visual-field-overlay-vedTemperatureMapping',
      `linear-gradient(135deg, rgba(120,100,100,${intensity * 0.15}) 0%, rgba(130,120,100,${intensity * 0.2}) 25%, rgba(140,140,120,${intensity * 0.15}) 50%, rgba(100,130,130,${intensity * 0.2}) 75%, rgba(100,100,120,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedTemperatureMapping'
    );
  }

  // Christine Ha - Steamy Mirror
  if (christineSteamyMirror?.enabled) {
    const intensity = christineSteamyMirror.intensity;
    
    createOverlay(
      'visual-field-overlay-christineSteamyMirror',
      `rgba(255,255,255,${intensity * 0.7})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineSteamyMirror'
    );
  }

  // Christine Ha - Light Scatter
  if (christineLightScatter?.enabled) {
    const intensity = christineLightScatter.intensity;
    
    createOverlay(
      'visual-field-overlay-christineLightScatter',
      `radial-gradient(circle at 30% 20%, rgba(255,255,255,${intensity * 0.4}) 0%, transparent 15%), radial-gradient(circle at 70% 80%, rgba(255,255,255,${intensity * 0.3}) 0%, transparent 12%), radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.2}) 0%, transparent 20%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineLightScatter'
    );
  }

  // Christine Ha - Fog Overlay
  if (christineFogOverlay?.enabled) {
    const intensity = christineFogOverlay.intensity;
    
    createOverlay(
      'visual-field-overlay-christineFogOverlay',
      `linear-gradient(45deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(240,240,240,${intensity * 0.5}) 25%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(240,240,240,${intensity * 0.4}) 75%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFogOverlay'
    );
  }

  // Christine Ha - Fluctuating Vision
  if (christineFluctuatingVision?.enabled) {
    const intensity = christineFluctuatingVision.intensity;
    
    createOverlay(
      'visual-field-overlay-christineFluctuatingVision',
      `rgba(255,255,255,${intensity * 0.1})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFluctuatingVision'
    );
  }

  // Christine Ha - Complete NMO
  if (christineNMOComplete?.enabled) {
    const intensity = christineNMOComplete.intensity;
    
    createOverlay(
      'visual-field-overlay-christineNMOComplete',
      `rgba(255,255,255,${intensity * 0.6})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineNMOComplete'
    );
  }

  // Lucy Edwards - Frosted Glass
  if (lucyFrostedGlass?.enabled) {
    const intensity = lucyFrostedGlass.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyFrostedGlass',
      `rgba(80,60,40,${intensity * 0.6})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyFrostedGlass'
    );
  }

  // Lucy Edwards - Heavy Blur
  if (lucyHeavyBlur?.enabled) {
    const intensity = lucyHeavyBlur.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyHeavyBlur',
      `rgba(60,40,30,${intensity * 0.7})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyHeavyBlur'
    );
  }

  // Lucy Edwards - Desaturation
  if (lucyDesaturation?.enabled) {
    const intensity = lucyDesaturation.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyDesaturation',
      `linear-gradient(45deg, rgba(120,80,60,${intensity * 0.5}) 0%, rgba(100,70,50,${intensity * 0.4}) 50%, rgba(140,90,70,${intensity * 0.5}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyDesaturation'
    );
  }

  // Lucy Edwards - Light Diffusion
  if (lucyLightDiffusion?.enabled) {
    const intensity = lucyLightDiffusion.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyLightDiffusion',
      `radial-gradient(circle at 25% 25%, rgba(160,100,80,${intensity * 0.4}) 0%, transparent 20%), radial-gradient(circle at 75% 75%, rgba(140,90,70,${intensity * 0.3}) 0%, transparent 15%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyLightDiffusion'
    );
  }

  // Lucy Edwards - Texture Overlay
  if (lucyTextureOverlay?.enabled) {
    const intensity = lucyTextureOverlay.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyTextureOverlay',
      `radial-gradient(ellipse at 30% 20%, rgba(100,70,50,${intensity * 0.6}) 0%, transparent 25%), radial-gradient(ellipse at 70% 80%, rgba(80,60,40,${intensity * 0.5}) 0%, transparent 20%), radial-gradient(ellipse at 50% 50%, rgba(120,80,60,${intensity * 0.4}) 0%, transparent 30%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyTextureOverlay'
    );
  }

  // Lucy Edwards - Complete Vision
  if (lucyCompleteVision?.enabled) {
    const intensity = lucyCompleteVision.intensity;
    
    createOverlay(
      'visual-field-overlay-lucyCompleteVision',
      `rgba(90,60,40,${intensity * 0.8})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyCompleteVision'
    );
  }

  // David Paterson - Left Eye Blindness
  if (davidLeftEyeBlindness?.enabled) {
    const intensity = davidLeftEyeBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-davidLeftEyeBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidLeftEyeBlindness'
    );
  }

  // David Paterson - Right Eye Glaucoma
  if (davidRightEyeGlaucoma?.enabled) {
    const intensity = davidRightEyeGlaucoma.intensity;
    
    createOverlay(
      'visual-field-overlay-davidRightEyeGlaucoma',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.1}) 0%, rgba(255,255,200,${intensity * 0.18}) 50%, rgba(255,255,180,${intensity * 0.1}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidRightEyeGlaucoma'
    );
  }

  // David Paterson - Hemispheric Vision
  if (davidHemisphericVision?.enabled) {
    const intensity = davidHemisphericVision.intensity;
    
    createOverlay(
      'visual-field-overlay-davidHemisphericVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidHemisphericVision-left'
    );
    
    createOverlay(
      'visual-field-overlay-davidHemisphericVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidHemisphericVision-right'
    );
  }

  // David Paterson - Complete Vision
  if (davidCompleteVision?.enabled) {
    const intensity = davidCompleteVision.intensity;
    
    createOverlay(
      'visual-field-overlay-davidCompleteVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
      'davidCompleteVision-left'
    );
    
    createOverlay(
      'visual-field-overlay-davidCompleteVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
      'davidCompleteVision-right'
    );
  }

  // Erik Weihenmayer - Retinoschisis Islands
  if (erikRetinoschisisIslands?.enabled) {
    const intensity = erikRetinoschisisIslands.intensity;
    
    createOverlay(
      'visual-field-overlay-erikIsland1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(15% 10%, 35% 8%, 40% 25%, 25% 30%, 10% 20%)',
      'erikIsland1'
    );
    
    createOverlay(
      'visual-field-overlay-erikIsland2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(65% 40%, 85% 35%, 90% 55%, 75% 65%, 60% 50%)',
      'erikIsland2'
    );
    
    createOverlay(
      'visual-field-overlay-erikIsland3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(20% 70%, 45% 65%, 50% 85%, 30% 90%, 15% 80%)',
      'erikIsland3'
    );
  }

  // Erik Weihenmayer - Island Fragmentation
  if (erikIslandFragmentation?.enabled) {
    const intensity = erikIslandFragmentation.intensity;
    
    createOverlay(
      'visual-field-overlay-erikFragment1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(70% 15%, 80% 12%, 85% 25%, 75% 28%, 65% 20%)',
      'erikFragment1'
    );
    
    createOverlay(
      'visual-field-overlay-erikFragment2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(45% 45%, 55% 42%, 60% 55%, 50% 58%, 40% 50%)',
      'erikFragment2'
    );
    
    createOverlay(
      'visual-field-overlay-erikFragment3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(75% 75%, 90% 70%, 95% 85%, 80% 88%, 70% 80%)',
      'erikFragment3'
    );
  }

  // Erik Weihenmayer - Progressive Loss
  if (erikProgressiveLoss?.enabled) {
    const intensity = erikProgressiveLoss.intensity;
    
    createOverlay(
      'visual-field-overlay-erikProgressive1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(40% 20%, 60% 18%, 65% 35%, 45% 38%, 35% 25%)',
      'erikProgressive1'
    );
    
    createOverlay(
      'visual-field-overlay-erikProgressive2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      'polygon(35% 60%, 55% 58%, 60% 75%, 40% 78%, 30% 65%)',
      'erikProgressive2'
    );
  }

  // Erik Weihenmayer - Complete Blindness
  if (erikCompleteBlindness?.enabled) {
    const intensity = erikCompleteBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-erikCompleteBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCompleteBlindness'
    );
  }

  // Erik Weihenmayer - Scanning Behavior
  if (erikScanningBehavior?.enabled) {
    const intensity = erikScanningBehavior.intensity;
    
    createOverlay(
      'visual-field-overlay-erikScanningBehavior',
      `rgba(0,0,0,${intensity * 0.1})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikScanningBehavior'
    );
  }

  // Erik Weihenmayer - Cognitive Load
  if (erikCognitiveLoad?.enabled) {
    const intensity = erikCognitiveLoad.intensity;
    
    createOverlay(
      'visual-field-overlay-erikCognitiveLoad',
      `rgba(0,0,0,${intensity * 0.05})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCognitiveLoad'
    );
  }

  // Marla Runyan - Central Scotoma
  if (marlaCentralScotoma?.enabled) {
    const intensity = marlaCentralScotoma.intensity;
    const scotomaSize = Math.max(20, 15 + intensity * 25);
    const blackIntensity = intensity;
    
    createOverlay(
      'visual-field-overlay-marlaCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCentralScotoma'
    );
  }

  // Marla Runyan - Peripheral Vision
  if (marlaPeripheralVision?.enabled) {
    const intensity = marlaPeripheralVision.intensity;
    
    createOverlay(
      'visual-field-overlay-marlaPeripheralVision',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,${intensity * -0.1}) 60%, rgba(0,0,0,${intensity * -0.05}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaPeripheralVision'
    );
  }

  // Marla Runyan - Eccentric Viewing
  if (marlaEccentricViewing?.enabled) {
    const intensity = marlaEccentricViewing.intensity;
    
    createOverlay(
      'visual-field-overlay-marlaEccentricViewing',
      `radial-gradient(circle at 30% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaEccentricViewing'
    );
  }

  // Marla Runyan - Filling In
  if (marlaFillingIn?.enabled) {
    const intensity = marlaFillingIn.intensity;
    
    createOverlay(
      'visual-field-overlay-marlaFillingIn',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.3}) 0%, rgba(200,200,200,${intensity * 0.15}) 30%, transparent 40%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaFillingIn'
    );
  }

  // Marla Runyan - Crowding Effect
  if (marlaCrowdingEffect?.enabled) {
    const intensity = marlaCrowdingEffect.intensity;
    
    createOverlay(
      'visual-field-overlay-marlaCrowdingEffect',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,${intensity * 0.1}) 45%, rgba(0,0,0,${intensity * 0.05}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCrowdingEffect'
    );
  }

  // Marla Runyan - Complete Stargardt
  if (marlaStargardtComplete?.enabled) {
    const intensity = marlaStargardtComplete.intensity;
    
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(30,30,30,${intensity}) 0%, rgba(30,30,30,${intensity * 0.95}) 15%, rgba(30,30,30,${intensity * 0.8}) 25%, rgba(30,30,30,${intensity * 0.6}) 35%, rgba(30,30,30,${intensity * 0.4}) 45%, rgba(30,30,30,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma'
    );
    
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma-deep',
      `radial-gradient(circle at 50% 50%, rgba(20,20,20,${intensity}) 0%, rgba(20,20,20,${intensity * 0.95}) 15%, rgba(20,20,20,${intensity * 0.8}) 25%, rgba(20,20,20,${intensity * 0.6}) 35%, rgba(20,20,20,${intensity * 0.4}) 45%, rgba(20,20,20,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma-deep'
    );
    
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-filling',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.2}) 0%, rgba(200,200,200,${intensity * 0.1}) 25%, rgba(200,200,200,${intensity * 0.05}) 35%, rgba(200,200,200,${intensity * 0.02}) 45%, transparent 55%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-filling'
    );
    
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-eccentric',
      `radial-gradient(circle at 20% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 20% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-eccentric'
    );
  }

  // Dr. Mona Minkara - End Stage Complete
  if (minkaraEndStageComplete?.enabled) {
    const intensity = minkaraEndStageComplete.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-central',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.95}) 15%, rgba(0,0,0,${intensity * 0.9}) 25%, rgba(0,0,0,${intensity * 0.8}) 35%, transparent 40%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-central'
    );
    
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-ring',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-ring'
    );
    
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-peripheral',
      `radial-gradient(circle at 10% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 10% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-peripheral'
    );
    
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-photophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-photophobia'
    );
  }

  // Dr. Mona Minkara - Individual Effects
  if (minkaraCentralScotoma?.enabled) {
    const intensity = minkaraCentralScotoma.intensity;
    const scotomaSize = Math.max(35, 30 + intensity * 20);
    const blackIntensity = intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.95}) ${scotomaSize - 10}%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.8}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.5}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraCentralScotoma'
    );
  }

  if (minkaraRingScotoma?.enabled) {
    const intensity = minkaraRingScotoma.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraRingScotoma',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraRingScotoma'
    );
  }

  if (minkaraPeripheralIslands?.enabled) {
    const intensity = minkaraPeripheralIslands.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraPeripheralIslands',
      `radial-gradient(circle at 15% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 15% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPeripheralIslands'
    );
  }

  if (minkaraPhotophobia?.enabled) {
    const intensity = minkaraPhotophobia.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraPhotophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPhotophobia'
    );
  }

  if (minkaraAchromatopsia?.enabled) {
    const intensity = minkaraAchromatopsia.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraAchromatopsia',
      `linear-gradient(45deg, rgba(128,128,128,${intensity * 0.3}) 0%, rgba(128,128,128,${intensity * 0.2}) 50%, rgba(128,128,128,${intensity * 0.3}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraAchromatopsia'
    );
  }

  if (minkaraNightBlindness?.enabled) {
    const intensity = minkaraNightBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraNightBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity * 0.6}) 0%, rgba(0,0,0,${intensity * 0.4}) 50%, rgba(0,0,0,${intensity * 0.6}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraNightBlindness'
    );
  }

  if (minkaraChemistryMode?.enabled) {
    const intensity = minkaraChemistryMode.intensity;
    
    createOverlay(
      'visual-field-overlay-minkaraChemistryMode',
      `radial-gradient(circle at 20% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 20% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraChemistryMode'
    );
  }

  // Joshua Miele - Complete Blindness
  if (joshuaCompleteBlindness?.enabled) {
    const intensity = joshuaCompleteBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaCompleteBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaCompleteBlindness'
    );
  }

  // Joshua Miele - Echolocation
  if (joshuaEcholocation?.enabled) {
    const intensity = joshuaEcholocation.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaEcholocation',
      `radial-gradient(circle at 50% 50%, rgba(0,255,0,${intensity * 0.3}) 0%, rgba(0,255,0,${intensity * 0.2}) 20%, rgba(0,255,0,${intensity * 0.1}) 40%, transparent 60%), radial-gradient(circle at 30% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaEcholocation'
    );
  }

  // Joshua Miele - Tactile Maps
  if (joshuaTactileMaps?.enabled) {
    const intensity = joshuaTactileMaps.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaTactileMaps',
      `linear-gradient(0deg, rgba(255,255,255,${intensity * 0.4}) 0%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(255,255,255,${intensity * 0.4}) 100%), linear-gradient(90deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(255,255,255,${intensity * 0.1}) 50%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaTactileMaps'
    );
  }

  // Joshua Miele - Audio Landscape
  if (joshuaAudioLandscape?.enabled) {
    const intensity = joshuaAudioLandscape.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaAudioLandscape',
      `radial-gradient(circle at 20% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 20% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 50% 50%, rgba(0,0,255,${intensity * 0.2}) 0%, transparent 4%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAudioLandscape'
    );
  }

  // Joshua Miele - Accessibility Mode
  if (joshuaAccessibilityMode?.enabled) {
    const intensity = joshuaAccessibilityMode.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaAccessibilityMode',
      `linear-gradient(0deg, rgba(255,255,0,${intensity * 0.3}) 0%, rgba(255,255,0,${intensity * 0.1}) 50%, rgba(255,255,0,${intensity * 0.3}) 100%), linear-gradient(90deg, rgba(255,255,0,${intensity * 0.2}) 0%, rgba(255,255,0,${intensity * 0.05}) 50%, rgba(255,255,0,${intensity * 0.2}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAccessibilityMode'
    );
  }

  // Joshua Miele - Sonification
  if (joshuaSonification?.enabled) {
    const intensity = joshuaSonification.intensity;
    
    createOverlay(
      'visual-field-overlay-joshuaSonification',
      `radial-gradient(circle at 25% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 25% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaSonification'
    );
  }

  // Galileo - Sectoral Defects
  if (galileoSectoralDefects?.enabled) {
    const intensity = galileoSectoralDefects.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoSectoralDefects',
      `conic-gradient(from 45deg at 30% 20%, 
        rgba(0,0,0,${0.9 * intensity}) 0deg, 
        rgba(0,0,0,${0.9 * intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSectoralDefects'
    );
  }

  // Galileo - Arcuate Scotomas
  if (galileoArcuateScotomas?.enabled) {
    const intensity = galileoArcuateScotomas.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoArcuateScotomas',
      `radial-gradient(ellipse 200px 50px at 50% 50%, 
        rgba(0,0,0,0) 0%, 
        rgba(0,0,0,0) 40%, 
        rgba(0,0,0,${0.8 * intensity}) 45%, 
        rgba(0,0,0,${0.8 * intensity}) 55%, 
        rgba(0,0,0,0) 60%, 
        rgba(0,0,0,0) 100%
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoArcuateScotomas'
    );
  }

  // Galileo - Swiss Cheese Vision
  if (galileoSwissCheeseVision?.enabled) {
    const intensity = galileoSwissCheeseVision.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoSwissCheeseVision',
      `radial-gradient(circle at 20% 30%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 60% 20%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 4%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 80% 60%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 30% 70%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 2%, rgba(0,0,0,0) 2%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 70% 80%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSwissCheeseVision'
    );
  }

  // Galileo - Chronic Progression
  if (galileoChronicProgression?.enabled) {
    const intensity = galileoChronicProgression.intensity;
    const tunnelRadius = Math.max(10, 50 - intensity * 40);
    
    createOverlay(
      'visual-field-overlay-galileoChronicProgression',
      `radial-gradient(circle at 50% 50%,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 5}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'galileoChronicProgression'
    );
  }
};

