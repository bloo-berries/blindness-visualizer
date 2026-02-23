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
 * Generates CSS filters for Amadou Bagayoko's Congenital Cataract Progression
 * Four phases based on intensity:
 * 0-25%: Phase 1 (childhood haze) - milky overlay, soft blur, warm shift
 * 26-50%: Phase 2 (fog thickens) - heavy milky, strong blur, sepia cast
 * 51-75%: Phase 3 (light perception) - near white-out, minimal detail
 * 76-100%: Phase 4 (total blindness) - complete darkness
 */
export const generateAmadouFilters = (effects: VisualEffect[]): string => {
  const amadouEffects = effects.filter(e =>
    e.id.startsWith('amadou') && e.enabled
  );

  if (amadouEffects.length === 0) return '';

  const filters: string[] = [];

  const cataractProgression = effects.find(e => e.id === 'amadouCataractProgression' && e.enabled);
  const phase1 = effects.find(e => e.id === 'amadouPhase1' && e.enabled);
  const phase2 = effects.find(e => e.id === 'amadouPhase2' && e.enabled);
  const phase3 = effects.find(e => e.id === 'amadouPhase3' && e.enabled);
  const phase4 = effects.find(e => e.id === 'amadouPhase4' && e.enabled);

  // Complete progression - intensity controls which phase
  if (cataractProgression) {
    const i = cataractProgression.intensity;

    if (i <= 0.25) {
      // Phase 1: Childhood haze (ages 5-8)
      const phaseI = i * 4; // 0-1 within phase
      filters.push(`blur(${8 + phaseI * 4}px)`); // 8-12px blur
      filters.push(`sepia(${30 + phaseI * 15}%)`); // Warm yellow-brown shift
      filters.push(`saturate(${70 - phaseI * 20}%)`); // Muted colors
      filters.push(`contrast(${90 - phaseI * 15}%)`); // Reduced contrast
      filters.push(`brightness(${100 + phaseI * 8}%)`); // Slight brightness from scatter
    } else if (i <= 0.5) {
      // Phase 2: Fog thickens (ages 10-13)
      const phaseI = (i - 0.25) * 4; // 0-1 within phase
      filters.push(`blur(${12 + phaseI * 13}px)`); // 12-25px blur
      filters.push(`sepia(${45 + phaseI * 20}%)`); // Stronger brown cast
      filters.push(`saturate(${50 - phaseI * 25}%)`); // Further desaturation
      filters.push(`contrast(${75 - phaseI * 25}%)`); // Lower contrast
      filters.push(`brightness(${108 + phaseI * 15}%)`); // Brighter from scatter
    } else if (i <= 0.75) {
      // Phase 3: Light perception only (ages 14-16)
      const phaseI = (i - 0.5) * 4; // 0-1 within phase
      filters.push(`blur(${25 + phaseI * 25}px)`); // 25-50px blur
      filters.push(`sepia(${65 + phaseI * 20}%)`); // Strong sepia
      filters.push(`saturate(${25 - phaseI * 20}%)`); // Nearly monochrome
      filters.push(`contrast(${50 - phaseI * 35}%)`); // Very low contrast
      filters.push(`brightness(${123 + phaseI * 40}%)`); // Wash toward white
    } else {
      // Phase 4: Total blindness (age 16+)
      const phaseI = (i - 0.75) * 4; // 0-1 within phase
      // Transition from washed-out white to total black
      filters.push(`brightness(${163 - phaseI * 163}%)`); // 163% to 0%
      filters.push(`contrast(${15 - phaseI * 15}%)`); // Minimal to zero
      filters.push(`saturate(0%)`); // No color
      filters.push(`blur(${50 - phaseI * 30}px)`); // Blur decreases as darkness takes over
    }
  }

  // Individual phase effects
  if (phase1 && !cataractProgression) {
    const i = phase1.intensity;
    filters.push(`blur(${8 + i * 4}px)`);
    filters.push(`sepia(${30 + i * 15}%)`);
    filters.push(`saturate(${70 - i * 20}%)`);
    filters.push(`contrast(${90 - i * 15}%)`);
    filters.push(`brightness(${100 + i * 8}%)`);
  }

  if (phase2 && !cataractProgression) {
    const i = phase2.intensity;
    filters.push(`blur(${12 + i * 13}px)`);
    filters.push(`sepia(${45 + i * 20}%)`);
    filters.push(`saturate(${50 - i * 25}%)`);
    filters.push(`contrast(${75 - i * 25}%)`);
    filters.push(`brightness(${108 + i * 15}%)`);
  }

  if (phase3 && !cataractProgression) {
    const i = phase3.intensity;
    filters.push(`blur(${25 + i * 25}px)`);
    filters.push(`sepia(${65 + i * 20}%)`);
    filters.push(`saturate(${25 - i * 20}%)`);
    filters.push(`contrast(${50 - i * 35}%)`);
    filters.push(`brightness(${123 + i * 40}%)`);
  }

  if (phase4 && !cataractProgression) {
    const i = phase4.intensity;
    // Total blackness
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Stephen Curry's Keratoconus
 * Directional blur can't be achieved with CSS filters alone, but we handle:
 * - Reduced contrast (light scatter)
 * - Diffuse haze
 * - Desaturated colors ("lacking punch")
 * Main visual effects handled by overlays and animated components
 */
export const generateStephenFilters = (effects: VisualEffect[]): string => {
  const stephenEffects = effects.filter(e =>
    e.id.startsWith('stephen') && e.enabled
  );

  if (stephenEffects.length === 0) return '';

  const filters: string[] = [];

  const completeKeratoconus = effects.find(e => e.id === 'stephenKeratoconusComplete' && e.enabled);
  const comaAberration = effects.find(e => e.id === 'stephenComaAberration' && e.enabled);
  const ghosting = effects.find(e => e.id === 'stephenGhosting' && e.enabled);
  const irregularHalos = effects.find(e => e.id === 'stephenIrregularHalos' && e.enabled);
  const waviness = effects.find(e => e.id === 'stephenWaviness' && e.enabled);
  const reducedContrast = effects.find(e => e.id === 'stephenReducedContrast' && e.enabled);
  const asymmetry = effects.find(e => e.id === 'stephenAsymmetry' && e.enabled);

  // Complete keratoconus - combination of all effects
  if (completeKeratoconus) {
    const i = completeKeratoconus.intensity;
    // Reduced contrast from irregular corneal surface scattering light
    filters.push(`contrast(${100 - i * 25}%)`);
    // Slight brightness increase from light scatter
    filters.push(`brightness(${100 + i * 8}%)`);
    // Colors "lack punch" - desaturated
    filters.push(`saturate(${100 - i * 20}%)`);
    // Very subtle blur for the diffuse haze (main blur in overlays)
    filters.push(`blur(${i * 1.5}px)`);
  }

  if (comaAberration) {
    const i = comaAberration.intensity;
    // Directional smear handled by overlays, but add slight blur
    filters.push(`blur(${i * 1.2}px)`);
    filters.push(`contrast(${100 - i * 15}%)`);
  }

  if (ghosting) {
    const i = ghosting.intensity;
    // Ghosting creates "dirty" visual impression
    filters.push(`contrast(${100 - i * 18}%)`);
    filters.push(`brightness(${100 + i * 5}%)`);
  }

  if (irregularHalos) {
    const i = irregularHalos.intensity;
    // Light bleeding - increased brightness in highlights
    filters.push(`brightness(${100 + i * 12}%)`);
    filters.push(`contrast(${100 - i * 20}%)`);
  }

  if (waviness) {
    const i = waviness.intensity;
    // Waviness creates visual "noise" - slight contrast reduction
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (reducedContrast) {
    const i = reducedContrast.intensity;
    // "Blacks aren't as black, whites aren't as white"
    filters.push(`contrast(${100 - i * 30}%)`);
    // "Faint milky film" - slight brightness increase
    filters.push(`brightness(${100 + i * 10}%)`);
    // Colors lack saturation
    filters.push(`saturate(${100 - i * 25}%)`);
  }

  if (asymmetry) {
    const i = asymmetry.intensity;
    // Asymmetry creates visual dissonance - mild overall degradation
    filters.push(`contrast(${100 - i * 12}%)`);
    filters.push(`blur(${i * 0.8}px)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for David Brown's Kawasaki Disease to Glaucoma
 * Dual-phase asymmetric progression:
 * 0-12%: Kawasaki eyes (bilateral haze, rainbow halos)
 * 13-25%: Left eye loss + monocular haze
 * 26-50%: Light extremes (outdoor/indoor nightmares)
 * 51-75%: Advancing tunnel + sweet spot + pain intrusions
 * 76-90%: Rapid final collapse
 * 91-100%: Total blindness with ongoing pain
 */
export const generateDavidBrownFilters = (effects: VisualEffect[]): string => {
  const davidEffects = effects.filter(e =>
    e.id.startsWith('david') && e.enabled
  );

  if (davidEffects.length === 0) return '';

  const filters: string[] = [];

  const kawasakiComplete = effects.find(e => e.id === 'davidKawasakiGlaucomaComplete' && e.enabled);
  const kawasakiEyes = effects.find(e => e.id === 'davidKawasakiEyes' && e.enabled);
  const leftEyeLoss = effects.find(e => e.id === 'davidLeftEyeLoss' && e.enabled);
  const monocularHaze = effects.find(e => e.id === 'davidMonocularHaze' && e.enabled);
  const outdoorNightmare = effects.find(e => e.id === 'davidOutdoorNightmare' && e.enabled);
  const indoorNightmare = effects.find(e => e.id === 'davidIndoorNightmare' && e.enabled);
  const sweetSpot = effects.find(e => e.id === 'davidSweetSpot' && e.enabled);
  const painIntrusions = effects.find(e => e.id === 'davidPainIntrusions' && e.enabled);
  const finalCollapse = effects.find(e => e.id === 'davidFinalCollapse' && e.enabled);
  const ongoingPain = effects.find(e => e.id === 'davidOngoingPain' && e.enabled);

  // Complete Kawasaki-Glaucoma progression
  if (kawasakiComplete) {
    const i = kawasakiComplete.intensity;

    if (i <= 0.12) {
      // Phase 1: Kawasaki Eyes (0-12%) - bilateral damage, haze, halos
      const phaseI = i / 0.12; // 0-1 within phase
      // Dirty glass haze effect
      filters.push(`blur(${1 + phaseI * 2}px)`);
      // Washed out colors
      filters.push(`contrast(${100 - phaseI * 20}%)`);
      filters.push(`saturate(${100 - phaseI * 25}%)`);
      // Slight brightness increase from corneal edema
      filters.push(`brightness(${100 + phaseI * 8}%)`);
    } else if (i <= 0.25) {
      // Phase 2: Left eye loss + monocular haze (13-25%)
      const phaseI = (i - 0.12) / 0.13; // 0-1 within phase
      // Dirty glass effect intensifies
      filters.push(`blur(${3 + phaseI * 1.5}px)`);
      // Reduced contrast (40-50% less)
      filters.push(`contrast(${80 - phaseI * 15}%)`);
      filters.push(`saturate(${75 - phaseI * 15}%)`);
      filters.push(`brightness(${108 - phaseI * 5}%)`);
    } else if (i <= 0.50) {
      // Phase 3: Light extremes (26-50%) - this varies based on sub-phase
      const phaseI = (i - 0.25) / 0.25; // 0-1 within phase

      if (phaseI < 0.4) {
        // Outdoor nightmare - too bright (26-35%)
        const subI = phaseI / 0.4;
        filters.push(`brightness(${120 + subI * 80}%)`); // Blown out
        filters.push(`contrast(${65 - subI * 40}%)`); // Washed out
        filters.push(`saturate(${60 - subI * 35}%)`);
        filters.push(`blur(${4 + subI * 3}px)`);
      } else if (phaseI < 0.7) {
        // Indoor nightmare - too dark (36-42%)
        const subI = (phaseI - 0.4) / 0.3;
        filters.push(`brightness(${30 + subI * 15}%)`); // Very dark
        filters.push(`contrast(${25 + subI * 20}%)`); // Low contrast in darkness
        filters.push(`saturate(${25 + subI * 15}%)`);
        filters.push(`blur(${5 - subI * 1}px)`);
      } else {
        // Sweet spot - tolerable band (43-50%)
        const subI = (phaseI - 0.7) / 0.3;
        filters.push(`brightness(${95 - subI * 10}%)`);
        filters.push(`contrast(${65 - subI * 10}%)`);
        filters.push(`saturate(${60 - subI * 15}%)`);
        filters.push(`blur(${4 + subI * 1}px)`);
      }
    } else if (i <= 0.75) {
      // Phase 4: Advancing tunnel + sweet spot + pain (51-75%)
      const phaseI = (i - 0.50) / 0.25; // 0-1 within phase
      filters.push(`blur(${5 + phaseI * 3}px)`);
      filters.push(`contrast(${55 - phaseI * 20}%)`);
      filters.push(`saturate(${45 - phaseI * 20}%)`);
      filters.push(`brightness(${85 - phaseI * 20}%)`);
    } else if (i <= 0.90) {
      // Phase 5: Rapid final collapse (76-90%)
      const phaseI = (i - 0.75) / 0.15; // 0-1 within phase
      // Rapid deterioration
      filters.push(`blur(${8 - phaseI * 4}px)`); // Blur decreases as darkness takes over
      filters.push(`contrast(${35 - phaseI * 30}%)`);
      filters.push(`saturate(${25 - phaseI * 25}%)`);
      filters.push(`brightness(${65 - phaseI * 60}%)`);
      // Sepia shift as colors drain to gray-brown
      filters.push(`sepia(${phaseI * 40}%)`);
    } else {
      // Phase 6: Total blindness with ongoing pain (91-100%)
      const phaseI = (i - 0.90) / 0.10; // 0-1 within phase
      // Complete darkness
      filters.push(`brightness(${5 - phaseI * 5}%)`);
      filters.push(`contrast(${5 - phaseI * 5}%)`);
      filters.push(`saturate(0%)`);
    }
  }

  // Individual phase effects
  if (kawasakiEyes && !kawasakiComplete) {
    const i = kawasakiEyes.intensity;
    filters.push(`blur(${1 + i * 2}px)`);
    filters.push(`contrast(${100 - i * 20}%)`);
    filters.push(`saturate(${100 - i * 25}%)`);
    filters.push(`brightness(${100 + i * 8}%)`);
  }

  if (leftEyeLoss && !kawasakiComplete) {
    // Left eye loss is handled by overlays, minimal filter
    const i = leftEyeLoss.intensity;
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (monocularHaze && !kawasakiComplete) {
    const i = monocularHaze.intensity;
    filters.push(`blur(${3 + i * 2}px)`);
    filters.push(`contrast(${80 - i * 20}%)`);
    filters.push(`saturate(${75 - i * 20}%)`);
    filters.push(`brightness(${103 - i * 8}%)`);
  }

  if (outdoorNightmare && !kawasakiComplete) {
    const i = outdoorNightmare.intensity;
    filters.push(`brightness(${140 + i * 80}%)`);
    filters.push(`contrast(${50 - i * 30}%)`);
    filters.push(`saturate(${50 - i * 30}%)`);
    filters.push(`blur(${5 + i * 4}px)`);
  }

  if (indoorNightmare && !kawasakiComplete) {
    const i = indoorNightmare.intensity;
    filters.push(`brightness(${35 - i * 20}%)`);
    filters.push(`contrast(${30 + i * 15}%)`);
    filters.push(`saturate(${30 - i * 15}%)`);
    filters.push(`blur(${4 + i * 2}px)`);
  }

  if (sweetSpot && !kawasakiComplete) {
    const i = sweetSpot.intensity;
    filters.push(`brightness(${90 - i * 15}%)`);
    filters.push(`contrast(${60 - i * 15}%)`);
    filters.push(`saturate(${55 - i * 20}%)`);
    filters.push(`blur(${4 + i * 2}px)`);
  }

  if (painIntrusions && !kawasakiComplete) {
    const i = painIntrusions.intensity;
    // Pain creates visual distortion
    filters.push(`contrast(${70 - i * 25}%)`);
    filters.push(`brightness(${90 + i * 20}%)`);
    filters.push(`blur(${i * 4}px)`);
  }

  if (finalCollapse && !kawasakiComplete) {
    const i = finalCollapse.intensity;
    filters.push(`brightness(${70 - i * 70}%)`);
    filters.push(`contrast(${40 - i * 40}%)`);
    filters.push(`saturate(${30 - i * 30}%)`);
    filters.push(`sepia(${i * 50}%)`);
  }

  if (ongoingPain && !kawasakiComplete) {
    const i = ongoingPain.intensity;
    // Total darkness
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Lex Gillette's Recurrent Retinal Detachments
 * Cyclical pattern reflecting hope and loss:
 * 0-15%: Monocular normal (right eye only)
 * 16-30%: First detachment symptoms
 * 31-45%: Post-surgery restoration (improved but scarred)
 * 46-60%: Re-detachment (larger shadow)
 * 61-80%: Cumulative damage (shrinking clear zone)
 * 81-100%: Daily fading to total blindness
 */
export const generateLexFilters = (effects: VisualEffect[]): string => {
  const lexEffects = effects.filter(e =>
    e.id.startsWith('lex') && e.enabled
  );

  if (lexEffects.length === 0) return '';

  const filters: string[] = [];

  const recurrentCycle = effects.find(e => e.id === 'lexRecurrentDetachmentCycle' && e.enabled);
  const monocular = effects.find(e => e.id === 'lexMonocularVision' && e.enabled);
  const firstDetachment = effects.find(e => e.id === 'lexFirstDetachment' && e.enabled);
  const postSurgery = effects.find(e => e.id === 'lexPostSurgeryRestoration' && e.enabled);
  const redetachment = effects.find(e => e.id === 'lexRedetachment' && e.enabled);
  const cumulative = effects.find(e => e.id === 'lexCumulativeDamage' && e.enabled);
  const dailyFading = effects.find(e => e.id === 'lexDailyFading' && e.enabled);

  // Complete recurrent detachment cycle
  if (recurrentCycle) {
    const i = recurrentCycle.intensity;

    if (i <= 0.15) {
      // Phase 1: Monocular normal vision (0-15%)
      // Right eye working, left eye always blind from ROP
      // Minimal filter effects - vision is relatively clear
      const phaseI = i / 0.15; // 0-1 within phase
      filters.push(`contrast(${100 - phaseI * 5}%)`);
      filters.push(`brightness(${100 - phaseI * 3}%)`);
    } else if (i <= 0.30) {
      // Phase 2: First detachment symptoms (16-30%)
      // Floaters, flashes, encroaching shadow (15-20%)
      const phaseI = (i - 0.15) / 0.15; // 0-1 within phase
      filters.push(`contrast(${95 - phaseI * 12}%)`);
      filters.push(`brightness(${97 - phaseI * 8}%)`);
      filters.push(`saturate(${100 - phaseI * 15}%)`);
      // Slight blur from floaters
      filters.push(`blur(${phaseI * 0.8}px)`);
    } else if (i <= 0.45) {
      // Phase 3: Post-surgery restoration (31-45%)
      // Vision returns but imperfect - better than detachment
      const phaseI = (i - 0.30) / 0.15; // 0-1 within phase
      // Improving clarity (going "up" not down)
      filters.push(`contrast(${83 + phaseI * 10}%)`);
      filters.push(`brightness(${89 + phaseI * 6}%)`);
      filters.push(`saturate(${85 + phaseI * 8}%)`);
      filters.push(`blur(${0.8 - phaseI * 0.5}px)`);
    } else if (i <= 0.60) {
      // Phase 4: Re-detachment (46-60%)
      // Shadow returns, larger this time (30-40%)
      const phaseI = (i - 0.45) / 0.15; // 0-1 within phase
      filters.push(`contrast(${93 - phaseI * 18}%)`);
      filters.push(`brightness(${95 - phaseI * 15}%)`);
      filters.push(`saturate(${93 - phaseI * 22}%)`);
      filters.push(`blur(${0.3 + phaseI * 1.2}px)`);
    } else if (i <= 0.80) {
      // Phase 5: Cumulative damage (61-80%)
      // Multiple cycles leave permanent damage, shrinking clear zone
      const phaseI = (i - 0.60) / 0.20; // 0-1 within phase
      filters.push(`contrast(${75 - phaseI * 25}%)`);
      filters.push(`brightness(${80 - phaseI * 25}%)`);
      filters.push(`saturate(${71 - phaseI * 30}%)`);
      filters.push(`blur(${1.5 + phaseI * 2}px)`);
    } else {
      // Phase 6: Daily fading to total blindness (81-100%)
      // "A little less each morning" - gradual dimming
      const phaseI = (i - 0.80) / 0.20; // 0-1 within phase
      // Transition to complete darkness
      filters.push(`brightness(${55 - phaseI * 55}%)`);
      filters.push(`contrast(${50 - phaseI * 50}%)`);
      filters.push(`saturate(${41 - phaseI * 41}%)`);
      filters.push(`blur(${3.5 - phaseI * 2}px)`); // Blur decreases as darkness takes over
    }
  }

  // Individual phase effects
  if (monocular && !recurrentCycle) {
    const i = monocular.intensity;
    // Monocular vision - slight depth perception issues
    filters.push(`contrast(${100 - i * 5}%)`);
    filters.push(`brightness(${100 - i * 3}%)`);
  }

  if (firstDetachment && !recurrentCycle) {
    const i = firstDetachment.intensity;
    filters.push(`contrast(${95 - i * 12}%)`);
    filters.push(`brightness(${97 - i * 10}%)`);
    filters.push(`saturate(${100 - i * 18}%)`);
    filters.push(`blur(${i * 1}px)`);
  }

  if (postSurgery && !recurrentCycle) {
    const i = postSurgery.intensity;
    // Better but not perfect
    filters.push(`contrast(${92 - i * 8}%)`);
    filters.push(`brightness(${95 - i * 5}%)`);
    filters.push(`saturate(${95 - i * 10}%)`);
  }

  if (redetachment && !recurrentCycle) {
    const i = redetachment.intensity;
    filters.push(`contrast(${90 - i * 20}%)`);
    filters.push(`brightness(${92 - i * 18}%)`);
    filters.push(`saturate(${88 - i * 25}%)`);
    filters.push(`blur(${i * 1.5}px)`);
  }

  if (cumulative && !recurrentCycle) {
    const i = cumulative.intensity;
    filters.push(`contrast(${80 - i * 30}%)`);
    filters.push(`brightness(${75 - i * 30}%)`);
    filters.push(`saturate(${70 - i * 35}%)`);
    filters.push(`blur(${i * 3}px)`);
  }

  if (dailyFading && !recurrentCycle) {
    const i = dailyFading.intensity;
    // Gradual fade to black
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(${100 - i * 100}%)`);
    filters.push(`saturate(${100 - i * 100}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Crazzy Steve's Bilateral Aphakia + Secondary Glaucoma
 * Key visual characteristics:
 * - Heavy Gaussian blur (30-50px) - nothing resolves to sharp edges
 * - Severe desaturation (40-60%) - colors appear washed out/faded
 * - Low contrast (~50% reduction) - dark objects against dark backgrounds disappear
 * - Overall dreamlike quality - "hazy aftermath of a dream"
 * - Tunnel vision handled by visual field overlay
 */
export const generateCrazzysteveFilters = (effects: VisualEffect[]): string => {
  const crazzysteveEffects = effects.filter(e =>
    e.id.startsWith('crazzysteve') || e.id.startsWith('crazzySteve')
  );

  if (crazzysteveEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'crazzysteveComplete' && e.enabled);
  const dreamlikeBlur = effects.find(e => e.id === 'crazzySteveDreamlikeBlur' && e.enabled);
  const desaturation = effects.find(e => e.id === 'crazzysteveDesaturation' && e.enabled);
  const glaucomaTunnel = effects.find(e => e.id === 'crazzysteveGlaucomaTunnel' && e.enabled);
  const lowContrast = effects.find(e => e.id === 'crazzySteveLowContrast' && e.enabled);
  const aphakicHalos = effects.find(e => e.id === 'crazzysteveAphakicHalos' && e.enabled);

  // Complete Aphakia + Glaucoma vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Heavy blur (30-50px range) - "like looking through frost or waking from deep sleep"
    filters.push(`blur(${30 + i * 20}px)`);
    // Severe desaturation (40-60%) - colors present but muted, washed out
    filters.push(`saturate(${60 - i * 20}%)`);
    // Low contrast (~50% reduction) - dark objects disappear against dark backgrounds
    filters.push(`contrast(${50 - i * 10}%)`);
    // Slight brightness increase from light scatter (aphakic eyes lack UV filtering)
    filters.push(`brightness(${100 + i * 15}%)`);
  }

  // Individual effects for customization
  if (dreamlikeBlur && !completeVision) {
    const i = dreamlikeBlur.intensity;
    // Heavy Gaussian blur - nothing resolves to sharp edges
    filters.push(`blur(${30 + i * 20}px)`);
    // Slight brightness from scatter
    filters.push(`brightness(${100 + i * 10}%)`);
  }

  if (desaturation && !completeVision) {
    const i = desaturation.intensity;
    // Washed out colors from missing natural lens filtering
    filters.push(`saturate(${60 - i * 30}%)`);
  }

  if (glaucomaTunnel && !completeVision) {
    // Tunnel vision is primarily handled by visual field overlay
    // Add slight overall darkening for the peripheral loss
    const i = glaucomaTunnel.intensity;
    filters.push(`brightness(${100 - i * 15}%)`);
  }

  if (lowContrast && !completeVision) {
    const i = lowContrast.intensity;
    // Severely reduced contrast - only high-contrast boundaries register
    filters.push(`contrast(${50 - i * 20}%)`);
  }

  if (aphakicHalos && !completeVision) {
    const i = aphakicHalos.intensity;
    // Light scatter and chromatic aberration
    filters.push(`brightness(${100 + i * 20}%)`);
    filters.push(`contrast(${100 - i * 15}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Tofiri Kibuuka's B1/T11 Blindness
 * Two variants supported:
 * - NLP (No Light Perception): Complete darkness, brightness 0%
 * - Bare LP: Near-total darkness (98-100% opacity) with extremely subtle
 *   ambient luminance variation - no spatial info, just "light exists somewhere"
 */
export const generateTofiriFilters = (effects: VisualEffect[]): string => {
  const tofiriEffects = effects.filter(e =>
    e.id.startsWith('tofiri') && e.enabled
  );

  if (tofiriEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'tofiriComplete' && e.enabled);
  const nlp = effects.find(e => e.id === 'tofiriNLP' && e.enabled);
  const bareLightPerception = effects.find(e => e.id === 'tofiriBareLightPerception' && e.enabled);

  // No Light Perception - complete darkness
  if (nlp) {
    filters.push('brightness(0%)');
    filters.push('contrast(0%)');
    filters.push('saturate(0%)');
    return filters.join(' ');
  }

  // Bare Light Perception or Complete B1/T11 vision
  // Near-total darkness with extremely subtle ambient luminance
  if (completeVision || bareLightPerception) {
    const i = (completeVision || bareLightPerception)!.intensity;
    // Near-total darkness: brightness at 2-5% (just barely perceptible luminance variation)
    filters.push(`brightness(${2 + i * 3}%)`);
    // Minimal contrast - no edges, no shapes
    filters.push(`contrast(${5 - i * 3}%)`);
    // Complete desaturation - no color perception
    filters.push('saturate(0%)');
    // Extreme blur to eliminate any spatial information
    filters.push(`blur(${80 + i * 40}px)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Joseph Plateau's Solar Retinopathy
 * Key visual characteristics:
 * - Central scotoma (handled by overlay)
 * - Blur increasing toward center (overall blur for CSS)
 * - Reduced brightness/contrast globally (progressive dimming)
 * - Desaturation from retinal damage
 * Progression: Early (preserved peripheral) → Mid (dimming) → Late (near-blind) → Total
 */
export const generatePlateauFilters = (effects: VisualEffect[]): string => {
  const plateauEffects = effects.filter(e =>
    e.id.startsWith('plateau') && e.enabled
  );

  if (plateauEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'plateauComplete' && e.enabled);
  const earlyStage = effects.find(e => e.id === 'plateauEarlyStage' && e.enabled);
  const midStage = effects.find(e => e.id === 'plateauMidStage' && e.enabled);
  const lateStage = effects.find(e => e.id === 'plateauLateStage' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'plateauCentralScotoma' && e.enabled);
  const acuityLoss = effects.find(e => e.id === 'plateauAcuityLoss' && e.enabled);
  const photopsia = effects.find(e => e.id === 'plateauPhotopsia' && e.enabled);
  const globalDimming = effects.find(e => e.id === 'plateauGlobalDimming' && e.enabled);

  // Complete simulation (mid-stage representation for educational value)
  if (completeVision) {
    const i = completeVision.intensity;
    // Moderate blur representing acuity loss
    filters.push(`blur(${3 + i * 4}px)`);
    // Reduced brightness (global dimming beginning)
    filters.push(`brightness(${85 - i * 20}%)`);
    // Reduced contrast
    filters.push(`contrast(${80 - i * 15}%)`);
    // Slight desaturation from retinal damage
    filters.push(`saturate(${85 - i * 20}%)`);
  }

  // Early stage - minimal global effects, central scotoma via overlay
  if (earlyStage && !completeVision) {
    const i = earlyStage.intensity;
    // Mild blur (peripheral still relatively clear)
    filters.push(`blur(${1 + i * 2}px)`);
    // Slight brightness reduction
    filters.push(`brightness(${95 - i * 10}%)`);
    // Mild contrast loss
    filters.push(`contrast(${95 - i * 10}%)`);
  }

  // Mid stage - increasing global degradation
  if (midStage && !completeVision) {
    const i = midStage.intensity;
    // Moderate blur
    filters.push(`blur(${3 + i * 4}px)`);
    // Notable brightness reduction
    filters.push(`brightness(${80 - i * 20}%)`);
    // Significant contrast loss
    filters.push(`contrast(${75 - i * 20}%)`);
    // Color desaturation
    filters.push(`saturate(${80 - i * 25}%)`);
  }

  // Late stage - severe degradation, near-blindness
  if (lateStage && !completeVision) {
    const i = lateStage.intensity;
    // Heavy blur
    filters.push(`blur(${6 + i * 8}px)`);
    // Severe brightness reduction
    filters.push(`brightness(${50 - i * 35}%)`);
    // Very low contrast
    filters.push(`contrast(${50 - i * 35}%)`);
    // Heavy desaturation
    filters.push(`saturate(${40 - i * 30}%)`);
  }

  // Individual effect components
  if (centralScotoma && !completeVision && !earlyStage && !midStage && !lateStage) {
    // Central scotoma mainly handled by overlay, mild blur for surrounding
    const i = centralScotoma.intensity;
    filters.push(`blur(${i * 2}px)`);
  }

  if (acuityLoss && !completeVision && !earlyStage && !midStage && !lateStage) {
    const i = acuityLoss.intensity;
    filters.push(`blur(${2 + i * 5}px)`);
    filters.push(`contrast(${90 - i * 20}%)`);
  }

  if (photopsia && !completeVision && !earlyStage && !midStage && !lateStage) {
    // Photopsia creates visual artifacts - slight brightness fluctuation
    const i = photopsia.intensity;
    filters.push(`brightness(${100 + i * 15}%)`);
    filters.push(`contrast(${100 - i * 10}%)`);
  }

  if (globalDimming && !completeVision && !earlyStage && !midStage && !lateStage) {
    const i = globalDimming.intensity;
    filters.push(`brightness(${100 - i * 60}%)`);
    filters.push(`contrast(${100 - i * 50}%)`);
    filters.push(`saturate(${100 - i * 40}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Leonhard Euler's Asymmetric Vision Loss
 * Key visual characteristics:
 * - Right eye: Complete black (dead from infection ~1738) - handled by overlay
 * - Left eye: Progressive cataract - milky blur, reduced contrast, desaturation, glare
 * - Uniform diffuse fog (not scotomas or field cuts)
 * - Glare sensitivity with halo artifacts
 * - End state: Milky white opacity (not sharp black like retinal damage)
 */
export const generateEulerFilters = (effects: VisualEffect[]): string => {
  const eulerEffects = effects.filter(e =>
    e.id.startsWith('euler') && e.enabled
  );

  if (eulerEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'eulerComplete' && e.enabled);
  const midProgression = effects.find(e => e.id === 'eulerMidProgression' && e.enabled);
  const lateProgression = effects.find(e => e.id === 'eulerLateProgression' && e.enabled);
  const leftEyeCataract = effects.find(e => e.id === 'eulerLeftEyeCataract' && e.enabled);
  const cataractGlare = effects.find(e => e.id === 'eulerCataractGlare' && e.enabled);

  // Complete simulation (mid-to-late progression)
  // CSS filters affect the entire view - cataract effects for left eye
  // Right eye blackout handled by overlay
  if (completeVision) {
    const i = completeVision.intensity;
    // Milky/foggy blur - looking through frosted glass
    filters.push(`blur(${8 + i * 12}px)`);
    // Washed-out contrast
    filters.push(`contrast(${70 - i * 25}%)`);
    // Elevated brightness from milky cataract (white fog, not darkness)
    filters.push(`brightness(${100 + i * 20}%)`);
    // Color desaturation
    filters.push(`saturate(${60 - i * 25}%)`);
    // Slight sepia for warm milky quality
    filters.push(`sepia(${i * 15}%)`);
  }

  // Mid progression - moderate cataract
  if (midProgression && !completeVision) {
    const i = midProgression.intensity;
    filters.push(`blur(${5 + i * 8}px)`);
    filters.push(`contrast(${80 - i * 20}%)`);
    filters.push(`brightness(${100 + i * 15}%)`);
    filters.push(`saturate(${70 - i * 20}%)`);
    filters.push(`sepia(${i * 10}%)`);
  }

  // Late progression - severe cataract, near-opaque
  if (lateProgression && !completeVision) {
    const i = lateProgression.intensity;
    // Dense milky white fog
    filters.push(`blur(${15 + i * 20}px)`);
    filters.push(`contrast(${50 - i * 35}%)`);
    // High brightness - milky white, not black
    filters.push(`brightness(${110 + i * 40}%)`);
    filters.push(`saturate(${40 - i * 30}%)`);
    filters.push(`sepia(${i * 20}%)`);
  }

  // Individual left eye cataract
  if (leftEyeCataract && !completeVision && !midProgression && !lateProgression) {
    const i = leftEyeCataract.intensity;
    filters.push(`blur(${6 + i * 10}px)`);
    filters.push(`contrast(${75 - i * 25}%)`);
    filters.push(`brightness(${105 + i * 15}%)`);
    filters.push(`saturate(${65 - i * 25}%)`);
  }

  // Glare sensitivity
  if (cataractGlare && !completeVision && !midProgression && !lateProgression) {
    const i = cataractGlare.intensity;
    // Bright areas bloom outward
    filters.push(`brightness(${110 + i * 30}%)`);
    filters.push(`contrast(${85 - i * 30}%)`);
    filters.push(`blur(${i * 3}px)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Heather Hutchison's Light Perception Only Vision
 * Key visual characteristics:
 * - Extreme Gaussian blur (80-120px+) - nothing resolves to form
 * - No color - saturation stripped to near-zero
 * - Very low contrast - only brightness variation
 * - Near-total opacity handled by animated overlay
 */
export const generateHeatherFilters = (effects: VisualEffect[]): string => {
  const heatherEffects = effects.filter(e =>
    e.id.startsWith('heather') && e.enabled
  );

  if (heatherEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'heatherLightPerceptionComplete' && e.enabled);
  const nearTotalOpacity = effects.find(e => e.id === 'heatherNearTotalOpacity' && e.enabled);
  const diffuseLightBlobs = effects.find(e => e.id === 'heatherDiffuseLightBlobs' && e.enabled);
  const noColor = effects.find(e => e.id === 'heatherNoColor' && e.enabled);

  // Complete Light Perception vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Extreme blur - nothing resolves to form (80-120px range)
    filters.push(`blur(${80 + i * 40}px)`);
    // Strip all color - LP vision doesn't resolve wavelength
    filters.push('saturate(0%)');
    // Very low contrast - only brightness variation matters
    filters.push(`contrast(${20 - i * 15}%)`);
    // Reduced brightness overall
    filters.push(`brightness(${30 - i * 15}%)`);
  }

  // Near-total opacity (standalone)
  if (nearTotalOpacity && !completeVision) {
    const i = nearTotalOpacity.intensity;
    filters.push(`brightness(${25 - i * 20}%)`);
    filters.push(`contrast(${15 - i * 10}%)`);
  }

  // Diffuse light blobs (standalone)
  if (diffuseLightBlobs && !completeVision) {
    const i = diffuseLightBlobs.intensity;
    filters.push(`blur(${80 + i * 40}px)`);
    filters.push(`contrast(${25 - i * 15}%)`);
  }

  // No color (standalone)
  if (noColor && !completeVision) {
    filters.push('saturate(0%)');
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Abraham Nemeth's Congenital Dual-Attack Blindness
 * Key visual characteristics:
 * - Central scotoma (macular component) + peripheral constriction (RP component)
 * - Only a fragile mid-peripheral ring survives (if any)
 * - Heavy Gaussian blur globally - even surviving ring has poor resolution
 * - Severe desaturation and contrast loss
 * - Night blindness component
 * - End state: near-total darkness, functionally blind from birth
 */
export const generateNemethFilters = (effects: VisualEffect[]): string => {
  const nemethEffects = effects.filter(e =>
    e.id.startsWith('nemeth') && e.enabled
  );

  if (nemethEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'nemethComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'nemethCentralScotoma' && e.enabled);
  const peripheralConstriction = effects.find(e => e.id === 'nemethPeripheralConstriction' && e.enabled);
  const midRingRemnant = effects.find(e => e.id === 'nemethMidRingRemnant' && e.enabled);
  const nightBlindness = effects.find(e => e.id === 'nemethNightBlindness' && e.enabled);
  const acuityLoss = effects.find(e => e.id === 'nemethAcuityLoss' && e.enabled);
  const partialRing = effects.find(e => e.id === 'nemethPartialRing' && e.enabled);

  // Complete dual-attack blindness - near-total darkness
  // Nemeth functioned as totally blind throughout life
  if (completeVision) {
    const i = completeVision.intensity;
    // Near-total darkness - brightness approaching 0
    filters.push(`brightness(${8 - i * 7}%)`);
    // Minimal contrast - no edges, no detail
    filters.push(`contrast(${15 - i * 12}%)`);
    // Complete desaturation
    filters.push(`saturate(${10 - i * 10}%)`);
    // Heavy blur eliminates any spatial information
    filters.push(`blur(${40 + i * 30}px)`);
  }

  // Central scotoma - darkening toward center
  if (centralScotoma && !completeVision) {
    const i = centralScotoma.intensity;
    // Overlay handles main scotoma, filter adds overall degradation
    filters.push(`brightness(${85 - i * 25}%)`);
    filters.push(`contrast(${80 - i * 30}%)`);
    filters.push(`blur(${i * 5}px)`);
  }

  // Peripheral constriction
  if (peripheralConstriction && !completeVision) {
    const i = peripheralConstriction.intensity;
    // Overlay handles tunnel effect, filter adds overall darkening
    filters.push(`brightness(${80 - i * 30}%)`);
    filters.push(`contrast(${75 - i * 25}%)`);
  }

  // Mid-ring remnant - the only surviving vision
  if (midRingRemnant && !completeVision) {
    const i = midRingRemnant.intensity;
    // Heavy blur - even surviving ring has poor resolution
    filters.push(`blur(${15 + i * 20}px)`);
    // Severe desaturation
    filters.push(`saturate(${40 - i * 30}%)`);
    // Low contrast
    filters.push(`contrast(${60 - i * 30}%)`);
    // Dimmed brightness
    filters.push(`brightness(${70 - i * 30}%)`);
  }

  // Night blindness - dramatic darkening in low light
  if (nightBlindness && !completeVision) {
    const i = nightBlindness.intensity;
    // Far beyond normal darkness adaptation
    filters.push(`brightness(${30 - i * 25}%)`);
    filters.push(`contrast(${40 - i * 30}%)`);
    filters.push(`saturate(${20 - i * 15}%)`);
  }

  // Severe global acuity loss
  if (acuityLoss && !completeVision) {
    const i = acuityLoss.intensity;
    // Heavy Gaussian blur across entire visual field
    filters.push(`blur(${20 + i * 25}px)`);
    filters.push(`contrast(${70 - i * 35}%)`);
  }

  // Partial ring vision (for educational purposes - what minimal vision might look like)
  if (partialRing && !completeVision) {
    const i = partialRing.intensity;
    // Moderate blur for the surviving ring
    filters.push(`blur(${8 + i * 12}px)`);
    // Desaturated
    filters.push(`saturate(${50 - i * 30}%)`);
    // Low contrast
    filters.push(`contrast(${65 - i * 30}%)`);
    // Dimmed
    filters.push(`brightness(${60 - i * 25}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Daredevil's Radar Sense
 * Key visual characteristics:
 * - Transparent red tint over the scene (like the comics)
 * - Scene remains visible through the red filter
 * - Subtle desaturation to emphasize the red overlay
 * - Main red effect comes from the animated overlay using multiply blend
 */
export const generateDaredevilFilters = (effects: VisualEffect[]): string => {
  const daredevilEffects = effects.filter(e =>
    e.id.startsWith('daredevil') && e.enabled
  );

  if (daredevilEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'daredevilRadarSenseComplete' && e.enabled);
  const redMonochrome = effects.find(e => e.id === 'daredevilRedMonochrome' && e.enabled);

  // Complete Radar Sense - subtle filter to complement the overlay
  if (completeVision) {
    const i = completeVision.intensity;
    // Slight desaturation to let the red overlay dominate
    filters.push(`saturate(${70 - i * 20}%)`);
    // Subtle contrast boost
    filters.push(`contrast(${105 + i * 10}%)`);
    // Slight brightness adjustment
    filters.push(`brightness(${95 + i * 5}%)`);
    // Slight blur for the "radar sense" softness
    filters.push(`blur(${1 + i * 1.5}px)`);
  }

  // Red monochrome only (stronger effect)
  if (redMonochrome && !completeVision) {
    const i = redMonochrome.intensity;
    filters.push(`saturate(${60 - i * 30}%)`);
    filters.push(`contrast(${110 + i * 15}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Geordi La Forge's VISOR Sense
 * Key visual characteristics:
 * - False-color thermal/spectral palette - remap to non-natural colors
 * - No true darkness - minimum brightness floor (0.15-0.2)
 * - Enhanced contrast for EM edge detection
 * - Chromatic shift away from natural greens/earth tones
 */
export const generateGeordiFilters = (effects: VisualEffect[]): string => {
  const geordiEffects = effects.filter(e =>
    e.id.startsWith('geordi') && e.enabled
  );

  if (geordiEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'geordiVisorSenseComplete' && e.enabled);
  const thermalSpectrum = effects.find(e => e.id === 'geordiThermalSpectrum' && e.enabled);
  const emEnhancement = effects.find(e => e.id === 'geordiEMEnhancement' && e.enabled);
  const noTrueDarkness = effects.find(e => e.id === 'geordiNoTrueDarkness' && e.enabled);

  // Complete VISOR Sense - false-color spectral vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Shift hue significantly - move away from natural colors
    // Rotate toward blue/violet/magenta spectrum (thermal palette)
    filters.push(`hue-rotate(${180 + i * 40}deg)`);
    // Boost saturation for vibrant false-color effect
    filters.push(`saturate(${130 + i * 40}%)`);
    // Increased contrast for edge enhancement / EM boundaries
    filters.push(`contrast(${115 + i * 20}%)`);
    // Minimum brightness floor - no true darkness (violet floor)
    filters.push(`brightness(${85 + i * 15}%)`);
    // Slight invert-like effect via sepia + hue for thermal look
    filters.push(`sepia(${i * 15}%)`);
  }

  // Thermal spectrum effect (standalone)
  if (thermalSpectrum && !completeVision) {
    const i = thermalSpectrum.intensity;
    // Dramatic hue shift to thermal colors
    filters.push(`hue-rotate(${200 + i * 60}deg)`);
    filters.push(`saturate(${140 + i * 50}%)`);
    filters.push(`sepia(${i * 20}%)`);
  }

  // EM enhancement (standalone)
  if (emEnhancement && !completeVision) {
    const i = emEnhancement.intensity;
    // High contrast for edge detection appearance
    filters.push(`contrast(${120 + i * 30}%)`);
    filters.push(`brightness(${105 + i * 15}%)`);
    filters.push(`saturate(${120 + i * 30}%)`);
  }

  // No true darkness (standalone)
  if (noTrueDarkness && !completeVision) {
    const i = noTrueDarkness.intensity;
    // Ensure minimum brightness floor
    filters.push(`brightness(${115 + i * 25}%)`);
    // Lift shadows
    filters.push(`contrast(${90 - i * 15}%)`);
  }

  return filters.join(' ');
};

/**
 * Generates CSS filters for Blindspot's Sonar Sense
 * Key visual characteristics:
 * - Monochrome blue-green palette (submarine sonar aesthetic)
 * - No color information - only depth/distance
 * - High contrast for edge detection (hard surfaces reflect strongly)
 * - Slight blur representing sonar resolution limits
 */
export const generateBlindspotFilters = (effects: VisualEffect[]): string => {
  const blindspotEffects = effects.filter(e =>
    e.id.startsWith('blindspot') && e.enabled
  );

  if (blindspotEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'blindspotSonarSenseComplete' && e.enabled);
  const depthMapping = effects.find(e => e.id === 'blindspotDepthMapping' && e.enabled);
  const edgeDetection = effects.find(e => e.id === 'blindspotEdgeDetection' && e.enabled);
  const sonarResolution = effects.find(e => e.id === 'blindspotSonarResolution' && e.enabled);

  // Complete Sonar Sense - monochrome depth-mapped vision
  if (completeVision) {
    const i = completeVision.intensity;
    // Strip color - sonar provides no wavelength information
    filters.push(`saturate(${15 - i * 10}%)`);
    // Shift to blue-green monochrome (submarine sonar look)
    filters.push(`hue-rotate(${160 + i * 20}deg)`);
    // High contrast for edge detection (hard surfaces)
    filters.push(`contrast(${120 + i * 25}%)`);
    // Reduced brightness - sonar world is darker
    filters.push(`brightness(${75 - i * 15}%)`);
    // Slight blur representing resolution limits
    filters.push(`blur(${0.5 + i * 1}px)`);
  }

  // Depth mapping only
  if (depthMapping && !completeVision) {
    const i = depthMapping.intensity;
    filters.push(`saturate(${20 - i * 15}%)`);
    filters.push(`hue-rotate(${170 + i * 15}deg)`);
    filters.push(`brightness(${80 - i * 20}%)`);
  }

  // Edge detection emphasis
  if (edgeDetection && !completeVision) {
    const i = edgeDetection.intensity;
    filters.push(`contrast(${130 + i * 35}%)`);
    filters.push(`brightness(${90 - i * 10}%)`);
  }

  // Sonar resolution limits
  if (sonarResolution && !completeVision) {
    const i = sonarResolution.intensity;
    filters.push(`blur(${0.8 + i * 1.5}px)`);
    filters.push(`contrast(${110 + i * 15}%)`);
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
