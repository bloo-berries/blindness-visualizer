import { VisualEffect } from '../../types/visualEffects';

/**
 * Generates CSS filters for Galileo Galilei acute glaucoma effects
 */
export const generateGalileoFilters = (effects: VisualEffect[]): string => {
  const galileoEffects = effects.filter(e =>
    e.id.startsWith('galileo') && e.enabled
  );

  if (galileoEffects.length === 0) return '';

  const filters: string[] = [];

  const acuteAttack = effects.find(e => e.id === 'galileoAcuteAttackMode' && e.enabled);
  const chronicProgression = effects.find(e => e.id === 'galileoChronicProgression' && e.enabled);
  const severeBlurring = effects.find(e => e.id === 'galileoSevereBlurring' && e.enabled);
  const redEyeEffect = effects.find(e => e.id === 'galileoRedEyeEffect' && e.enabled);
  const cornealHaziness = effects.find(e => e.id === 'galileoCornealHaziness' && e.enabled);
  const extremePhotophobia = effects.find(e => e.id === 'galileoExtremePhotophobia' && e.enabled);

  if (acuteAttack) {
    filters.push(`blur(${acuteAttack.intensity * 8}px)`);
    filters.push(`sepia(${acuteAttack.intensity * 30}%) saturate(${100 + acuteAttack.intensity * 50}%)`);
    filters.push(`brightness(${100 - acuteAttack.intensity * 20}%) contrast(${100 - acuteAttack.intensity * 40}%)`);
    filters.push(`brightness(${100 + acuteAttack.intensity * 30}%)`);
  }

  if (severeBlurring) {
    filters.push(`blur(${severeBlurring.intensity * 8}px)`);
  }

  if (redEyeEffect) {
    filters.push(`sepia(${redEyeEffect.intensity * 30}%) saturate(${100 + redEyeEffect.intensity * 50}%)`);
  }

  if (cornealHaziness) {
    filters.push(`brightness(${100 - cornealHaziness.intensity * 20}%) contrast(${100 - cornealHaziness.intensity * 40}%)`);
  }

  if (extremePhotophobia) {
    filters.push(`brightness(${100 + extremePhotophobia.intensity * 30}%)`);
  }

  if (chronicProgression) {
    filters.push(`brightness(${100 - chronicProgression.intensity * 30}%) contrast(${100 - chronicProgression.intensity * 50}%)`);
    filters.push(`blur(${chronicProgression.intensity * 2}px)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Claude Monet's cataracts effects
 */
export const generateMonetFilters = (effects: VisualEffect[]): string => {
  const monetEffects = effects.filter(e =>
    e.id.startsWith('monet') && e.enabled
  );

  if (monetEffects.length === 0) return '';

  const filters: string[] = [];

  const cataractsProgression = effects.find(e => e.id === 'monetCataractsProgression' && e.enabled);
  const cataractsFog = effects.find(e => e.id === 'monetCataractsFog' && e.enabled);
  const colorDistortion = effects.find(e => e.id === 'monetColorDistortion' && e.enabled);
  const progressiveLoss = effects.find(e => e.id === 'monetProgressiveLoss' && e.enabled);

  if (cataractsProgression) {
    filters.push(`contrast(${100 - cataractsProgression.intensity * 75}%)`);
    filters.push(`brightness(${100 - cataractsProgression.intensity * 35}%)`);
    filters.push(`sepia(${cataractsProgression.intensity * 50}%) saturate(${100 + cataractsProgression.intensity * 70}%)`);
    filters.push(`hue-rotate(${cataractsProgression.intensity * 25}deg)`);
    filters.push(`blur(${cataractsProgression.intensity * 5}px)`);
  }

  if (cataractsFog) {
    filters.push(`contrast(${100 - cataractsFog.intensity * 80}%)`);
    filters.push(`brightness(${100 - cataractsFog.intensity * 30}%)`);
    filters.push(`blur(${cataractsFog.intensity * 4}px)`);
  }

  if (colorDistortion) {
    filters.push(`sepia(${colorDistortion.intensity * 55}%)`);
    filters.push(`saturate(${100 + colorDistortion.intensity * 80}%)`);
    filters.push(`hue-rotate(${colorDistortion.intensity * 30}deg)`);
    filters.push(`contrast(${100 - colorDistortion.intensity * 35}%)`);
  }

  if (progressiveLoss) {
    filters.push(`blur(${progressiveLoss.intensity * 4}px)`);
    filters.push(`contrast(${100 - progressiveLoss.intensity * 60}%)`);
    filters.push(`brightness(${100 - progressiveLoss.intensity * 30}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Christine Ha's NMO effects
 */
export const generateChristineFilters = (effects: VisualEffect[]): string => {
  const christineEffects = effects.filter(e =>
    e.id.startsWith('christine') && e.enabled
  );

  if (christineEffects.length === 0) return '';

  const filters: string[] = [];

  const nmoComplete = effects.find(e => e.id === 'christineNMOComplete' && e.enabled);
  const nmoBlur = effects.find(e => e.id === 'christineNMOBlur' && e.enabled);
  const steamyMirror = effects.find(e => e.id === 'christineSteamyMirror' && e.enabled);
  const lightScatter = effects.find(e => e.id === 'christineLightScatter' && e.enabled);
  const fogOverlay = effects.find(e => e.id === 'christineFogOverlay' && e.enabled);
  const fluctuatingVision = effects.find(e => e.id === 'christineFluctuatingVision' && e.enabled);

  if (nmoComplete) {
    // Requirement 2: Heavy blur (25-35px range) - reduced from 50px
    // "Counting fingers at 10-12 inches" - shapes should still be vaguely visible
    filters.push(`blur(${25 + nmoComplete.intensity * 10}px)`);
    // Requirement 7: Elevated brightness to prevent total darkness
    filters.push(`brightness(${105 + nmoComplete.intensity * 10}%)`);
    // Requirement 3: Low contrast for vague shapes only
    filters.push(`contrast(${50 - nmoComplete.intensity * 25}%)`);
    // Requirement 4: Heavy desaturation but not grayscale (muted, washed-out colors)
    filters.push(`saturate(${35 - nmoComplete.intensity * 20}%)`);
    // Slight warmth (steam has a warm quality)
    filters.push(`sepia(${nmoComplete.intensity * 20}%)`);
  }

  if (nmoBlur) {
    // Standalone blur effect for NMO - reduced to more realistic range
    filters.push(`blur(${22 + nmoBlur.intensity * 13}px)`);
    filters.push(`brightness(${102 + nmoBlur.intensity * 8}%)`);
  }

  if (steamyMirror) {
    // "Looking at a foggy mirror after hot shower" - high brightness, very low contrast
    filters.push(`brightness(${108 + steamyMirror.intensity * 12}%)`);
    filters.push(`contrast(${45 - steamyMirror.intensity * 30}%)`);
    filters.push(`saturate(${40 - steamyMirror.intensity * 25}%)`);
    filters.push(`blur(${20 + steamyMirror.intensity * 12}px)`);
  }

  if (lightScatter) {
    // Light sensitivity and scattering - makes bright areas bloom
    filters.push(`brightness(${110 + lightScatter.intensity * 20}%)`);
    filters.push(`contrast(${60 - lightScatter.intensity * 35}%)`);
    filters.push(`saturate(${50 - lightScatter.intensity * 25}%)`);
  }

  if (fogOverlay) {
    // Additional fog layer - adds to overall haziness
    filters.push(`brightness(${106 + fogOverlay.intensity * 10}%)`);
    filters.push(`contrast(${55 - fogOverlay.intensity * 35}%)`);
    filters.push(`saturate(${45 - fogOverlay.intensity * 30}%)`);
  }

  if (fluctuatingVision) {
    // Uhthoff's phenomenon - vision varies with temperature/fatigue
    // Minimal CSS filter contribution as main effect is in animated overlay
    filters.push(`brightness(${102 + fluctuatingVision.intensity * 5}%)`);
    filters.push(`contrast(${80 - fluctuatingVision.intensity * 20}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Lucy Edwards' incontinentia pigmenti effects
 */
export const generateLucyFilters = (effects: VisualEffect[]): string => {
  const lucyEffects = effects.filter(e =>
    e.id.startsWith('lucy') && e.enabled
  );

  if (lucyEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'lucyCompleteVision' && e.enabled);
  const frostedGlass = effects.find(e => e.id === 'lucyFrostedGlass' && e.enabled);
  const heavyBlur = effects.find(e => e.id === 'lucyHeavyBlur' && e.enabled);
  const desaturation = effects.find(e => e.id === 'lucyDesaturation' && e.enabled);
  const lightDiffusion = effects.find(e => e.id === 'lucyLightDiffusion' && e.enabled);
  const textureOverlay = effects.find(e => e.id === 'lucyTextureOverlay' && e.enabled);

  if (completeVision) {
    filters.push(`blur(${completeVision.intensity * 60}px)`);
    filters.push(`brightness(${100 - completeVision.intensity * 70}%) contrast(${100 - completeVision.intensity * 80}%)`);
    filters.push(`saturate(${100 - completeVision.intensity * 60}%) sepia(${completeVision.intensity * 50}%)`);
    filters.push(`hue-rotate(${completeVision.intensity * 20}deg)`);
  }

  if (frostedGlass) {
    filters.push(`blur(${frostedGlass.intensity * 50}px)`);
    filters.push(`brightness(${100 - frostedGlass.intensity * 60}%) contrast(${100 - frostedGlass.intensity * 75}%)`);
    filters.push(`saturate(${100 - frostedGlass.intensity * 50}%) sepia(${frostedGlass.intensity * 40}%)`);
  }

  if (heavyBlur) {
    filters.push(`blur(${heavyBlur.intensity * 55}px)`);
    filters.push(`brightness(${100 - heavyBlur.intensity * 50}%) contrast(${100 - heavyBlur.intensity * 70}%)`);
  }

  if (desaturation) {
    filters.push(`saturate(${100 - desaturation.intensity * 70}%)`);
    filters.push(`sepia(${desaturation.intensity * 45}%) hue-rotate(${desaturation.intensity * 15}deg)`);
    filters.push(`brightness(${100 - desaturation.intensity * 30}%)`);
  }

  if (lightDiffusion) {
    filters.push(`brightness(${100 - lightDiffusion.intensity * 40}%)`);
    filters.push(`contrast(${100 - lightDiffusion.intensity * 60}%)`);
    filters.push(`saturate(${100 - lightDiffusion.intensity * 50}%) sepia(${lightDiffusion.intensity * 30}%)`);
  }

  if (textureOverlay) {
    filters.push(`blur(${textureOverlay.intensity * 30}px)`);
    filters.push(`brightness(${100 - textureOverlay.intensity * 50}%) contrast(${100 - textureOverlay.intensity * 70}%)`);
    filters.push(`saturate(${100 - textureOverlay.intensity * 60}%) sepia(${textureOverlay.intensity * 35}%)`);
  }

  return filters.join(' ');
};

// David Paterson - Hemispheric Vision Loss Filters
export const generateDavidFilters = (effects: VisualEffect[]): string => {
  const davidEffects = effects.filter(e =>
    e.id.startsWith('david') && e.enabled
  );

  if (davidEffects.length === 0) return '';

  const filters: string[] = [];
  // David's hemispheric effects are handled entirely by overlays
  return filters.join(' ');
};

// Marla Runyan - Stargardt Disease Filters
export const generateMarlaFilters = (effects: VisualEffect[]): string => {
  const marlaEffects = effects.filter(e =>
    e.id.startsWith('marla') && e.enabled
  );

  if (marlaEffects.length === 0) return '';

  const filters: string[] = [];
  // Marla's Stargardt effects are handled entirely by overlays to preserve peripheral clarity
  return filters.join(' ');
};

// Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Filters
export const generateMinkaraFilters = (effects: VisualEffect[]): string => {
  const minkaraEffects = effects.filter(e =>
    e.id.startsWith('minkara') && e.enabled
  );

  if (minkaraEffects.length === 0) return '';

  const filters: string[] = [];

  const endStageComplete = effects.find(e => e.id === 'minkaraEndStageComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'minkaraCentralScotoma' && e.enabled);
  const ringScotoma = effects.find(e => e.id === 'minkaraRingScotoma' && e.enabled);
  const peripheralIslands = effects.find(e => e.id === 'minkaraPeripheralIslands' && e.enabled);
  const photophobia = effects.find(e => e.id === 'minkaraPhotophobia' && e.enabled);
  const achromatopsia = effects.find(e => e.id === 'minkaraAchromatopsia' && e.enabled);
  const nightBlindness = effects.find(e => e.id === 'minkaraNightBlindness' && e.enabled);
  const chemistryMode = effects.find(e => e.id === 'minkaraChemistryMode' && e.enabled);

  if (endStageComplete) {
    filters.push(`contrast(${100 - endStageComplete.intensity * 40}%)`);
    filters.push(`brightness(${100 - endStageComplete.intensity * 30}%)`);
    filters.push(`saturate(0%)`);
    filters.push(`blur(${endStageComplete.intensity * 5}px)`);
  }

  if (centralScotoma) {
    filters.push(`contrast(${100 - centralScotoma.intensity * 50}%)`);
    filters.push(`brightness(${100 - centralScotoma.intensity * 40}%)`);
  }

  if (ringScotoma) {
    filters.push(`contrast(${100 - ringScotoma.intensity * 30}%)`);
    filters.push(`brightness(${100 - ringScotoma.intensity * 20}%)`);
  }

  if (peripheralIslands) {
    filters.push(`contrast(${100 - peripheralIslands.intensity * 60}%)`);
    filters.push(`brightness(${100 - peripheralIslands.intensity * 50}%)`);
  }

  if (photophobia) {
    filters.push(`brightness(${100 + photophobia.intensity * 200}%)`);
    filters.push(`contrast(${100 + photophobia.intensity * 300}%)`);
    filters.push(`blur(${photophobia.intensity * 10}px)`);
  }

  if (achromatopsia) {
    filters.push(`saturate(0%)`);
    filters.push(`contrast(${100 - achromatopsia.intensity * 20}%)`);
  }

  if (nightBlindness) {
    filters.push(`brightness(${100 - nightBlindness.intensity * 80}%)`);
    filters.push(`contrast(${100 - nightBlindness.intensity * 60}%)`);
  }

  if (chemistryMode) {
    filters.push(`contrast(${100 + chemistryMode.intensity * 20}%)`);
    filters.push(`brightness(${100 + chemistryMode.intensity * 10}%)`);
  }

  return filters.join(' ');
};

// Joshua Miele - Chemical Burn Complete Blindness Filters
export const generateJoshuaFilters = (effects: VisualEffect[]): string => {
  const joshuaEffects = effects.filter(e =>
    e.id.startsWith('joshua') && e.enabled
  );

  if (joshuaEffects.length === 0) return '';

  const filters: string[] = [];

  const completeBlindness = effects.find(e => e.id === 'joshuaCompleteBlindness' && e.enabled);
  const echolocation = effects.find(e => e.id === 'joshuaEcholocation' && e.enabled);
  const tactileMaps = effects.find(e => e.id === 'joshuaTactileMaps' && e.enabled);
  const audioLandscape = effects.find(e => e.id === 'joshuaAudioLandscape' && e.enabled);
  const accessibilityMode = effects.find(e => e.id === 'joshuaAccessibilityMode' && e.enabled);
  const sonification = effects.find(e => e.id === 'joshuaSonification' && e.enabled);

  if (completeBlindness) {
    filters.push(`brightness(0%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  if (echolocation) {
    filters.push(`contrast(${100 + echolocation.intensity * 50}%)`);
    filters.push(`brightness(${100 + echolocation.intensity * 20}%)`);
  }

  if (tactileMaps) {
    filters.push(`contrast(${100 + tactileMaps.intensity * 30}%)`);
    filters.push(`brightness(${100 + tactileMaps.intensity * 15}%)`);
  }

  if (audioLandscape) {
    filters.push(`contrast(${100 + audioLandscape.intensity * 25}%)`);
    filters.push(`brightness(${100 + audioLandscape.intensity * 10}%)`);
  }

  if (accessibilityMode) {
    filters.push(`contrast(${100 + accessibilityMode.intensity * 40}%)`);
    filters.push(`brightness(${100 + accessibilityMode.intensity * 20}%)`);
  }

  if (sonification) {
    filters.push(`contrast(${100 + sonification.intensity * 35}%)`);
    filters.push(`brightness(${100 + sonification.intensity * 15}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Mila Kunis' mild iritis and cataracts
 * Her condition is very mild - she can see the vast majority of her environment
 */
export const generateMilaFilters = (effects: VisualEffect[]): string => {
  const milaEffects = effects.filter(e =>
    e.id.startsWith('mila') && e.enabled
  );

  if (milaEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'milaCompleteVision' && e.enabled);
  const mildIritis = effects.find(e => e.id === 'milaMildIritis' && e.enabled);
  const mildCataracts = effects.find(e => e.id === 'milaMildCataracts' && e.enabled);
  const leftEyeOnly = effects.find(e => e.id === 'milaLeftEyeOnly' && e.enabled);

  // Complete vision - very mild effects, mostly normal vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Very subtle blur (only 1-3px)
    filters.push(`blur(${i * 2}px)`);
    // Mild brightness increase for slight light sensitivity
    filters.push(`brightness(${100 + i * 8}%)`);
    // Slight contrast reduction
    filters.push(`contrast(${100 - i * 12}%)`);
    // Very subtle desaturation
    filters.push(`saturate(${100 - i * 10}%)`);
  }

  if (mildIritis) {
    const i = mildIritis.intensity;
    // Light sensitivity from iritis
    filters.push(`brightness(${100 + i * 10}%)`);
    filters.push(`contrast(${100 - i * 8}%)`);
  }

  if (mildCataracts) {
    const i = mildCataracts.intensity;
    // Very mild cataract haze
    filters.push(`blur(${i * 1.5}px)`);
    filters.push(`contrast(${100 - i * 10}%)`);
    filters.push(`saturate(${100 - i * 8}%)`);
  }

  if (leftEyeOnly) {
    // Minimal effect - right eye compensates well
    const i = leftEyeOnly.intensity;
    filters.push(`contrast(${100 - i * 5}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Dame Judi Dench's AMD
 * Central vision loss but peripheral preserved - minimal global filters
 * "I can see your outline" - shapes visible, details lost
 */
export const generateJudiFilters = (effects: VisualEffect[]): string => {
  const judiEffects = effects.filter(e =>
    e.id.startsWith('judi') && e.enabled
  );

  if (judiEffects.length === 0) return '';

  const filters: string[] = [];

  const completeAMD = effects.find(e => e.id === 'judiAMDComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'judiCentralScotoma' && e.enabled);
  const faceLoss = effects.find(e => e.id === 'judiFaceBlindness' && e.enabled);
  const readingLoss = effects.find(e => e.id === 'judiReadingLoss' && e.enabled);

  // Complete AMD - minimal global filters, main effect is overlay-based central scotoma
  if (completeAMD) {
    const i = completeAMD.intensity;
    // Very slight overall contrast reduction (peripheral still functional)
    filters.push(`contrast(${100 - i * 8}%)`);
    // Minimal brightness adjustment
    filters.push(`brightness(${100 - i * 5}%)`);
    // Slight saturation loss in central area (handled by overlay)
    filters.push(`saturate(${100 - i * 12}%)`);
  }

  if (centralScotoma) {
    const i = centralScotoma.intensity;
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (faceLoss) {
    const i = faceLoss.intensity;
    // Face recognition requires central vision detail
    filters.push(`contrast(${100 - i * 8}%)`);
  }

  if (readingLoss) {
    const i = readingLoss.intensity;
    filters.push(`contrast(${100 - i * 6}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Sugar Ray Leonard's Retinal Detachment
 * Haziness, muted colors, slight contrast loss - the "dirty glass" effect
 */
export const generateSugarFilters = (effects: VisualEffect[]): string => {
  const sugarEffects = effects.filter(e =>
    e.id.startsWith('sugar') && e.enabled
  );

  if (sugarEffects.length === 0) return '';

  const filters: string[] = [];

  const completeDetachment = effects.find(e => e.id === 'sugarRetinalDetachmentComplete' && e.enabled);
  const haziness = effects.find(e => e.id === 'sugarHaziness' && e.enabled);
  const darkCurtain = effects.find(e => e.id === 'sugarDarkCurtain' && e.enabled);

  // Complete retinal detachment - overall haziness like dirty glass
  if (completeDetachment) {
    const i = completeDetachment.intensity;
    // Mild contrast reduction (vitreous clouding)
    filters.push(`contrast(${100 - i * 15}%)`);
    // Slight brightness reduction
    filters.push(`brightness(${100 - i * 8}%)`);
    // Muted colors
    filters.push(`saturate(${100 - i * 20}%)`);
    // Very subtle blur for the haze effect
    filters.push(`blur(${i * 0.5}px)`);
  }

  if (haziness) {
    const i = haziness.intensity;
    filters.push(`contrast(${100 - i * 18}%)`);
    filters.push(`saturate(${100 - i * 15}%)`);
    filters.push(`blur(${i * 0.8}px)`);
  }

  if (darkCurtain) {
    const i = darkCurtain.intensity;
    // Slight overall darkening
    filters.push(`brightness(${100 - i * 10}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for custom famous people effects
 */
export const generateCustomFamousPeopleFilters = (effects: VisualEffect[]): string => {
  const customEffects = effects.filter(e =>
    (e.id === 'helenKellerBlindness' ||
     e.id === 'johnMiltonBlindness' ||
     e.id === 'louisBrailleBlindness' ||
     e.id === 'erikWeihenmayerRetinoschisis' ||
     e.id === 'marlaRunyanStargardt' ||
     e.id === 'joshuaMieleBlindness' ||
     e.id === 'davidPatersonBlindness' ||
     e.id === 'rayCharlesBlindness' ||
     e.id === 'stevieWonderROP' ||
     e.id === 'andreaBocelliBlindness' ||
     e.id === 'vedMehtaBlindness') && e.enabled
  );

  if (customEffects.length === 0) return '';

  const filters: string[] = [];

  const completeBlindnessEffects = customEffects.filter(e =>
    e.id === 'helenKellerBlindness' ||
    e.id === 'louisBrailleBlindness' ||
    e.id === 'joshuaMieleBlindness' ||
    e.id === 'rayCharlesBlindness' ||
    e.id === 'andreaBocelliBlindness' ||
    e.id === 'vedMehtaBlindness'
  );

  if (completeBlindnessEffects.length > 0) {
    filters.push(`brightness(0%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
    filters.push(`hue-rotate(0deg)`);
    filters.push(`sepia(100%)`);
  }

  const johnMiltonEffect = customEffects.find(e => e.id === 'johnMiltonBlindness');
  if (johnMiltonEffect) {
    filters.push(`brightness(${100 - johnMiltonEffect.intensity * 95}%)`);
    filters.push(`contrast(${100 - johnMiltonEffect.intensity * 90}%)`);
  }

  const stevieWonderEffect = customEffects.find(e => e.id === 'stevieWonderROP');
  if (stevieWonderEffect) {
    filters.push(`brightness(${100 - stevieWonderEffect.intensity * 98}%)`);
    filters.push(`contrast(${100 - stevieWonderEffect.intensity * 95}%)`);
  }

  const davidPatersonEffect = customEffects.find(e => e.id === 'davidPatersonBlindness');
  if (davidPatersonEffect) {
    filters.push(`blur(${davidPatersonEffect.intensity * 8}px)`);
    filters.push(`brightness(${100 - davidPatersonEffect.intensity * 70}%)`);
    filters.push(`contrast(${100 - davidPatersonEffect.intensity * 80}%)`);
  }

  const marlaRunyanEffect = customEffects.find(e => e.id === 'marlaRunyanStargardt');
  if (marlaRunyanEffect) {
    const intensity = marlaRunyanEffect.intensity;
    filters.push(`saturate(${100 - intensity * 40}%)`);
  }

  const erikWeihenmayerEffect = customEffects.find(e => e.id === 'erikWeihenmayerRetinoschisis');
  if (erikWeihenmayerEffect) {
    filters.push(`brightness(${100 - erikWeihenmayerEffect.intensity * 60}%)`);
    filters.push(`contrast(${100 - erikWeihenmayerEffect.intensity * 70}%)`);
  }

  return filters.join(' ');
};
