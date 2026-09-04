/**
 * Type definitions for visual effects
 * Centralized to avoid circular dependencies
 *
 * ConditionType is composed from semantic sub-unions so that each category
 * can be referenced independently while the full union stays identical.
 */

// ── Color Vision ──
export type ColorVisionCondition =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'protanomaly'
  | 'deuteranomaly'
  | 'tritanomaly'
  | 'monochromacy'
  | 'monochromatic';

// ── Visual Field ──
export type VisualFieldCondition =
  | 'hemianopiaLeft'
  | 'hemianopiaRight'
  | 'quadrantanopiaLeft'
  | 'quadrantanopiaRight'
  | 'quadrantanopiaInferiorLeft'
  | 'quadrantanopiaInferiorRight'
  | 'quadrantanopiaSuperiorLeft'
  | 'quadrantanopiaSuperiorRight'
  | 'blindnessLeftEye'
  | 'blindnessRightEye'
  | 'bitemporalHemianopia'
  | 'scotoma'
  | 'tunnelVision';

// ── Visual Disturbances ──
export type VisualDisturbanceCondition =
  | 'visualAura'
  | 'visualAuraLeft'
  | 'visualAuraRight'
  | 'visualFloaters'
  | 'visualSnow'
  | 'visualSnowFlashing'
  | 'visualSnowColored'
  | 'visualSnowTransparent'
  | 'visualSnowDense'
  | 'hallucinations'
  | 'blueFieldPhenomena'
  | 'glare'
  | 'halos'
  | 'persistentPositiveVisualPhenomenon'
  | 'palinopsia'
  | 'trails'
  | 'starbursting';

// ── Retinal ──
export type RetinalCondition =
  | 'retinitisPigmentosa'
  | 'stargardt'
  | 'amd'
  | 'diabeticRetinopathy'
  | 'retinalDetachment'
  | 'vitreousHemorrhage';

// ── Ocular ──
export type OcularCondition =
  | 'cataracts'
  | 'posteriorSubcapsularCataract'
  | 'corticalCataract'
  | 'glaucoma'
  | 'astigmatism'
  | 'nearSighted'
  | 'farSighted'
  | 'diplopiaMonocular'
  | 'diplopiaBinocular'
  | 'dryEye'
  | 'keratoconus'
  | 'presbyopia'
  | 'blurryVision'
  | 'nightBlindness'
  | 'lossOfContrast';

// ── Famous People ──
export type FamousPeopleCondition =
  // Milton
  | 'miltonGlaucomaHalos'
  | 'miltonProgressiveVignetting'
  | 'miltonScotomas'
  | 'miltonRetinalDetachment'
  | 'miltonPhotophobia'
  | 'miltonTemporalFieldLoss'
  | 'miltonProgressiveBlindness'
  | 'completeBlindness'
  // Galileo
  | 'galileoAcuteHalos'
  | 'galileoSevereBlurring'
  | 'galileoRedEyeEffect'
  | 'galileoExtremePhotophobia'
  | 'galileoCornealHaziness'
  | 'galileoSectoralDefects'
  | 'galileoArcuateScotomas'
  | 'galileoSwissCheeseVision'
  | 'galileoAcuteAttackMode'
  | 'galileoChronicProgression'
  // Monet
  | 'monetCataractsFog'
  | 'monetColorDistortion'
  | 'monetProgressiveLoss'
  | 'monetCataractsProgression'
  // Ved Mehta
  | 'vedCompleteBlindness'
  | 'vedSpatialAwareness'
  | 'vedEchoLocation'
  | 'vedAirFlowSensors'
  | 'vedProximityRadar'
  | 'vedTemperatureMapping'
  | 'vedMehtaBlindness'
  // Christine Ha
  | 'christineNMOBlur'
  | 'christineSteamyMirror'
  | 'christineLightScatter'
  | 'christineFogOverlay'
  | 'christineFluctuatingVision'
  | 'christineNMOComplete'
  // Lucy Edwards
  | 'lucyFrostedGlass'
  | 'lucyHeavyBlur'
  | 'lucyDesaturation'
  | 'lucyLightDiffusion'
  | 'lucyTextureOverlay'
  | 'lucyCompleteVision'
  // David Paterson
  | 'davidLeftEyeBlindness'
  | 'davidRightEyeGlaucoma'
  | 'davidHemisphericVision'
  | 'davidCompleteVision'
  | 'davidPatersonBlindness'
  // David Brown
  | 'davidKawasakiEyes'
  | 'davidKawasakiGlaucomaComplete'
  | 'davidLeftEyeLoss'
  | 'davidMonocularHaze'
  | 'davidOutdoorNightmare'
  | 'davidIndoorNightmare'
  | 'davidSweetSpot'
  | 'davidPainIntrusions'
  | 'davidFinalCollapse'
  | 'davidOngoingPain'
  // Erik Weihenmayer
  | 'erikRetinoschisisIslands'
  | 'erikIslandFragmentation'
  | 'erikProgressiveLoss'
  | 'erikCompleteBlindness'
  | 'erikScanningBehavior'
  | 'erikCognitiveLoad'
  | 'erikWeihenmayerRetinoschisis'
  // Marla Runyan
  | 'marlaCentralScotoma'
  | 'marlaPeripheralVision'
  | 'marlaEccentricViewing'
  | 'marlaFillingIn'
  | 'marlaCrowdingEffect'
  | 'marlaStargardtComplete'
  | 'marlaRunyanStargardt'
  // Mona Minkara
  | 'minkaraEndStageComplete'
  | 'minkaraCentralScotoma'
  | 'minkaraRingScotoma'
  | 'minkaraPeripheralIslands'
  | 'minkaraPhotophobia'
  | 'minkaraAchromatopsia'
  | 'minkaraNightBlindness'
  | 'minkaraProgressiveTimeline'
  | 'minkaraChemistryMode'
  // Joshua Miele
  | 'joshuaCompleteBlindness'
  | 'joshuaEcholocation'
  | 'joshuaTactileMaps'
  | 'joshuaAudioLandscape'
  | 'joshuaAccessibilityMode'
  | 'joshuaSonification'
  | 'joshuaMieleBlindness'
  // Simple custom effects
  | 'helenKellerBlindness'
  | 'johnMiltonBlindness'
  | 'louisBrailleBlindness'
  | 'rayCharlesBlindness'
  | 'stevieWonderROP'
  | 'andreaBocelliBlindness'
  | 'mollyBurkeBlindness'
  // Infanta Margarita
  | 'margaritaLightPerceptionComplete'
  // Fujitora
  | 'fujitoraObservationHakiComplete'
  // Chirrut Imwe
  | 'chirrutForcePerceptionComplete'
  // Julia Carpenter
  | 'juliaCarpenterPsychicWebComplete'
  // Amadou Bagayoko
  | 'amadouCataractProgression'
  | 'amadouPhase1'
  | 'amadouPhase2'
  | 'amadouPhase3'
  | 'amadouPhase4'
  // Anselmo Ralph
  | 'anselmoOcularMyastheniaBlur'
  | 'anselmoOcularMyastheniaComplete'
  | 'anselmoOcularMyastheniaDiplopia'
  | 'anselmoOcularMyastheniaPhotophobia'
  | 'anselmoOcularMyastheniaPtosis'
  // Blindspot
  | 'blindspotDepthMapping'
  | 'blindspotEdgeDetection'
  | 'blindspotPingSweep'
  | 'blindspotSonarResolution'
  | 'blindspotSonarSenseComplete'
  | 'blindspotSoundShadow'
  // CrazzySteve
  | 'crazzySteveDreamlikeBlur'
  | 'crazzySteveLowContrast'
  | 'crazzysteveAphakicHalos'
  | 'crazzysteveComplete'
  | 'crazzysteveDesaturation'
  | 'crazzysteveGlaucomaTunnel'
  // Daredevil
  | 'daredevilEdgeDetection'
  | 'daredevilRadarSenseComplete'
  | 'daredevilRadarSweep'
  | 'daredevilRedMonochrome'
  | 'daredevilSoundReactive'
  // Euler
  | 'eulerCataractGlare'
  | 'eulerComplete'
  | 'eulerLateProgression'
  | 'eulerLeftEyeCataract'
  | 'eulerMidProgression'
  | 'eulerRightEyeBlind'
  // Geordi La Forge
  | 'geordiEMEnhancement'
  | 'geordiNoTrueDarkness'
  | 'geordiOverloadFlicker'
  | 'geordiScanLines'
  | 'geordiThermalSpectrum'
  | 'geordiVisorSenseComplete'
  // Heather Hutchison
  | 'heatherDiffuseLightBlobs'
  | 'heatherFluctuatingPerception'
  | 'heatherLightPerceptionComplete'
  | 'heatherNearTotalOpacity'
  | 'heatherNoColor'
  | 'heatherNystagmus'
  // Jose Cid
  | 'joseCidMonocularVision'
  // Judi Dench
  | 'judiAMDComplete'
  | 'judiCentralScotoma'
  | 'judiFaceBlindness'
  | 'judiPeripheralPreserved'
  | 'judiReadingLoss'
  // Kenshi
  | 'kenshiDarkVoid'
  | 'kenshiInertMatter'
  | 'kenshiIntentSensing'
  | 'kenshiOmnidirectionalAwareness'
  | 'kenshiRangeFalloff'
  | 'kenshiSentoResonance'
  | 'kenshiSoulDetection'
  | 'kenshiSpiritRealm'
  | 'kenshiTelekineticSenseComplete'
  | 'kenshiTelekineticStreams'
  // Lex Gillette
  | 'lexCumulativeDamage'
  | 'lexDailyFading'
  | 'lexFirstDetachment'
  | 'lexMonocularVision'
  | 'lexPostSurgeryRestoration'
  | 'lexRecurrentDetachmentCycle'
  | 'lexRedetachment'
  // Mila Kunis
  | 'milaCompleteVision'
  | 'milaLeftEyeOnly'
  | 'milaMildCataracts'
  | 'milaMildIritis'
  // Abraham Nemeth
  | 'nemethAcuityLoss'
  | 'nemethCentralScotoma'
  | 'nemethComplete'
  | 'nemethMidRingRemnant'
  | 'nemethNightBlindness'
  | 'nemethPartialRing'
  | 'nemethPeripheralConstriction'
  // Neo
  | 'neoMatrixCodeVisionComplete'
  // Joseph Plateau
  | 'plateauAcuityLoss'
  | 'plateauCentralScotoma'
  | 'plateauComplete'
  | 'plateauEarlyStage'
  | 'plateauGlobalDimming'
  | 'plateauLateStage'
  | 'plateauMidStage'
  | 'plateauPeripheralPreserved'
  | 'plateauPhotopsia'
  // Stephen Curry
  | 'stephenAsymmetry'
  | 'stephenComaAberration'
  | 'stephenGhosting'
  | 'stephenIrregularHalos'
  | 'stephenKeratoconusComplete'
  | 'stephenReducedContrast'
  | 'stephenWaviness'
  // Sugar Ray Leonard
  | 'sugarDarkCurtain'
  | 'sugarFloaters'
  | 'sugarHaziness'
  | 'sugarLeftEyePressure'
  | 'sugarPeripheralFlashes'
  | 'sugarRetinalDetachmentComplete'
  // Tofiri Kibuuka
  | 'tofiriBareLightPerception'
  | 'tofiriComplete'
  | 'tofiriNLP'
  // Toph Beifong
  | 'tophHeartbeatDetection'
  | 'tophSandWeakness'
  | 'tophSeismicSenseComplete'
  | 'tophVibrationRipples'
  | 'tophWireframeVision';

// ── Composed full union (structurally identical to previous flat union) ──
export type ConditionType =
  | ColorVisionCondition
  | VisualFieldCondition
  | VisualDisturbanceCondition
  | RetinalCondition
  | OcularCondition
  | FamousPeopleCondition;

export interface VisualEffect {
  id: ConditionType;
  name: string;
  enabled: boolean;
  intensity: number;
  description: string;
}

export type InputSource = 
  | { type: 'webcam' }  // Note: Keeping 'webcam' as the internal type for compatibility
  | { type: 'image'; url: string }
  | { type: 'youtube' };
