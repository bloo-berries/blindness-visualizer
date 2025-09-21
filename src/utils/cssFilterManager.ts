import { VisualEffect } from '../types/visualEffects';
import { getColorVisionMatrix, isColorVisionCondition } from './colorVisionFilters';
import { getFirstEnabledEffect } from './effectLookup';

// Identity matrix removed as it was unused

/**
 * Generates CSS filter string for color blindness effects using accurate Machado 2009 matrices
 */
const generateColorBlindnessFilter = (effects: VisualEffect[]): string => {
  // Find the first enabled color vision condition using optimized lookup
  const colorVisionEffect = getFirstEnabledEffect(effects, e => isColorVisionCondition(e.id));
  
  if (!colorVisionEffect) {
    return '';
  }

  // Get the accurate matrix for this condition
  const matrix = getColorVisionMatrix(colorVisionEffect.id, colorVisionEffect.intensity);
  
  // Convert 3x3 matrix to 4x5 CSS matrix format
  // CSS matrix format: matrix(r1, r2, r3, 0, 0, g1, g2, g3, 0, 0, b1, b2, b3, 0, 0, 0, 0, 0, 1, 0)
  const cssMatrix = [
    matrix[0], matrix[1], matrix[2], 0, 0,
    matrix[3], matrix[4], matrix[5], 0, 0,
    matrix[6], matrix[7], matrix[8], 0, 0,
    0, 0, 0, 1, 0
  ];
  
  return `matrix(${cssMatrix.join(', ')})`;
};

/**
 * Generates blur filter for nearsightedness and farsightedness
 */
const generateBlurFilter = (effects: VisualEffect[]): string => {
  // More efficient: check specific IDs directly
  const nearSighted = effects.find(e => e.id === 'nearSighted' && e.enabled);
  const farSighted = effects.find(e => e.id === 'farSighted' && e.enabled);
  const blurEffect = nearSighted || farSighted;
  return blurEffect ? `blur(${blurEffect.intensity * 10}px)` : '';
};

/**
 * Generates CSS filters for Galileo Galilei acute glaucoma effects
 */
const generateGalileoFilters = (effects: VisualEffect[]): string => {
  const galileoEffects = effects.filter(e => 
    e.id.startsWith('galileo') && e.enabled
  );
  
  if (galileoEffects.length === 0) return '';
  
  const filters: string[] = [];
  
  // Check for specific Galileo effects
  const acuteAttack = effects.find(e => e.id === 'galileoAcuteAttackMode' && e.enabled);
  const chronicProgression = effects.find(e => e.id === 'galileoChronicProgression' && e.enabled);
  const severeBlurring = effects.find(e => e.id === 'galileoSevereBlurring' && e.enabled);
  const redEyeEffect = effects.find(e => e.id === 'galileoRedEyeEffect' && e.enabled);
  const cornealHaziness = effects.find(e => e.id === 'galileoCornealHaziness' && e.enabled);
  const extremePhotophobia = effects.find(e => e.id === 'galileoExtremePhotophobia' && e.enabled);
  
  // Acute Attack Mode combines multiple effects
  if (acuteAttack) {
    // Severe blurring
    filters.push(`blur(${acuteAttack.intensity * 8}px)`);
    // Red tint from conjunctival injection
    filters.push(`sepia(${acuteAttack.intensity * 30}%) saturate(${100 + acuteAttack.intensity * 50}%)`);
    // Corneal haziness (brightness and contrast reduction)
    filters.push(`brightness(${100 - acuteAttack.intensity * 20}%) contrast(${100 - acuteAttack.intensity * 40}%)`);
    // Extreme photophobia (brightness increase for bright areas)
    filters.push(`brightness(${100 + acuteAttack.intensity * 30}%)`);
  }
  
  // Individual effects
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
  
  // Chronic progression effects (simplified for CSS)
  if (chronicProgression) {
    // Progressive darkening and contrast reduction
    filters.push(`brightness(${100 - chronicProgression.intensity * 30}%) contrast(${100 - chronicProgression.intensity * 50}%)`);
    // Slight blur for vision deterioration
    filters.push(`blur(${chronicProgression.intensity * 2}px)`);
  }
  
  return filters.join(' ');
};

/**
 * Generates CSS filters for Claude Monet's cataracts effects
 */
const generateMonetFilters = (effects: VisualEffect[]): string => {
  const monetEffects = effects.filter(e => 
    e.id.startsWith('monet') && e.enabled
  );
  
  if (monetEffects.length === 0) return '';
  
  const filters: string[] = [];
  
  // Check for specific Monet effects
  const cataractsProgression = effects.find(e => e.id === 'monetCataractsProgression' && e.enabled);
  const cataractsFog = effects.find(e => e.id === 'monetCataractsFog' && e.enabled);
  const colorDistortion = effects.find(e => e.id === 'monetColorDistortion' && e.enabled);
  const progressiveLoss = effects.find(e => e.id === 'monetProgressiveLoss' && e.enabled);
  
  // Complete cataracts progression combines all effects
  if (cataractsProgression) {
    // Fog effect - much more opaque with stronger contrast reduction
    filters.push(`contrast(${100 - cataractsProgression.intensity * 75}%)`);
    filters.push(`brightness(${100 - cataractsProgression.intensity * 35}%)`);
    // Color distortion - much stronger yellowing that heavily affects cool colors
    filters.push(`sepia(${cataractsProgression.intensity * 50}%) saturate(${100 + cataractsProgression.intensity * 70}%)`);
    // Stronger hue shift to heavily suppress cool colors and accentuate warm tones
    filters.push(`hue-rotate(${cataractsProgression.intensity * 25}deg)`);
    // Progressive blur
    filters.push(`blur(${cataractsProgression.intensity * 5}px)`);
  }
  
  // Individual effects
  if (cataractsFog) {
    // Fog effect - much more opaque cloudy, hazy appearance
    filters.push(`contrast(${100 - cataractsFog.intensity * 80}%)`);
    filters.push(`brightness(${100 - cataractsFog.intensity * 30}%)`);
    filters.push(`blur(${cataractsFog.intensity * 4}px)`);
  }
  
  if (colorDistortion) {
    // Color distortion - much stronger yellowing that heavily affects cool colors
    filters.push(`sepia(${colorDistortion.intensity * 55}%)`);
    filters.push(`saturate(${100 + colorDistortion.intensity * 80}%)`);
    // Stronger hue shift to heavily suppress cool colors and accentuate warm tones
    filters.push(`hue-rotate(${colorDistortion.intensity * 30}deg)`);
    // Stronger contrast adjustment to make cool colors much harder to distinguish
    filters.push(`contrast(${100 - colorDistortion.intensity * 35}%)`);
  }
  
  if (progressiveLoss) {
    // Progressive vision loss - increasing blur and contrast reduction
    filters.push(`blur(${progressiveLoss.intensity * 4}px)`);
    filters.push(`contrast(${100 - progressiveLoss.intensity * 60}%)`);
    filters.push(`brightness(${100 - progressiveLoss.intensity * 30}%)`);
  }
  
  return filters.join(' ');
};

/**
 * Generates CSS filters for Christine Ha's NMO effects
 */
const generateChristineFilters = (effects: VisualEffect[]): string => {
  const christineEffects = effects.filter(e => 
    e.id.startsWith('christine') && e.enabled
  );
  
  if (christineEffects.length === 0) return '';
  
  const filters: string[] = [];
  
  // Check for specific Christine effects
  const nmoComplete = effects.find(e => e.id === 'christineNMOComplete' && e.enabled);
  const nmoBlur = effects.find(e => e.id === 'christineNMOBlur' && e.enabled);
  const steamyMirror = effects.find(e => e.id === 'christineSteamyMirror' && e.enabled);
  const lightScatter = effects.find(e => e.id === 'christineLightScatter' && e.enabled);
  const fogOverlay = effects.find(e => e.id === 'christineFogOverlay' && e.enabled);
  const fluctuatingVision = effects.find(e => e.id === 'christineFluctuatingVision' && e.enabled);
  
  // Complete NMO experience combines all effects
  if (nmoComplete) {
    // Extreme blur - 20/1000+ vision
    filters.push(`blur(${nmoComplete.intensity * 50}px)`);
    // Steamy mirror effect - fog overlay
    filters.push(`brightness(${100 + nmoComplete.intensity * 20}%) contrast(${100 - nmoComplete.intensity * 80}%)`);
    // Light scatter and halos
    filters.push(`saturate(${100 - nmoComplete.intensity * 60}%)`);
    // Color desaturation
    filters.push(`sepia(${nmoComplete.intensity * 30}%)`);
  }
  
  // Individual effects
  if (nmoBlur) {
    // Extreme Gaussian blur - uniform across entire field
    filters.push(`blur(${nmoBlur.intensity * 45}px)`);
  }
  
  if (steamyMirror) {
    // Steamy mirror effect - fog and condensation
    filters.push(`brightness(${100 + steamyMirror.intensity * 25}%) contrast(${100 - steamyMirror.intensity * 70}%)`);
    filters.push(`saturate(${100 - steamyMirror.intensity * 50}%)`);
  }
  
  if (lightScatter) {
    // Light scatter and halos
    filters.push(`brightness(${100 + lightScatter.intensity * 30}%)`);
    filters.push(`contrast(${100 - lightScatter.intensity * 40}%)`);
  }
  
  if (fogOverlay) {
    // Animated fog overlay effect
    filters.push(`brightness(${100 + fogOverlay.intensity * 15}%) contrast(${100 - fogOverlay.intensity * 60}%)`);
    filters.push(`saturate(${100 - fogOverlay.intensity * 40}%)`);
  }
  
  if (fluctuatingVision) {
    // Fluctuating vision with subtle variations
    filters.push(`brightness(${100 + fluctuatingVision.intensity * 10}%) contrast(${100 - fluctuatingVision.intensity * 30}%)`);
    filters.push(`blur(${fluctuatingVision.intensity * 5}px)`);
  }
  
  return filters.join(' ');
};

/**
 * Generates CSS filters for Lucy Edwards' incontinentia pigmenti effects
 */
const generateLucyFilters = (effects: VisualEffect[]): string => {
  const lucyEffects = effects.filter(e => 
    e.id.startsWith('lucy') && e.enabled
  );
  
  if (lucyEffects.length === 0) return '';
  
  const filters: string[] = [];
  
  // Check for specific Lucy effects
  const completeVision = effects.find(e => e.id === 'lucyCompleteVision' && e.enabled);
  const frostedGlass = effects.find(e => e.id === 'lucyFrostedGlass' && e.enabled);
  const heavyBlur = effects.find(e => e.id === 'lucyHeavyBlur' && e.enabled);
  const desaturation = effects.find(e => e.id === 'lucyDesaturation' && e.enabled);
  const lightDiffusion = effects.find(e => e.id === 'lucyLightDiffusion' && e.enabled);
  const textureOverlay = effects.find(e => e.id === 'lucyTextureOverlay' && e.enabled);
  
  // Complete vision combines all effects
  if (completeVision) {
    // Heavy blur - dark blurred effect
    filters.push(`blur(${completeVision.intensity * 60}px)`);
    // Dark appearance - much darker than frosted glass
    filters.push(`brightness(${100 - completeVision.intensity * 70}%) contrast(${100 - completeVision.intensity * 80}%)`);
    // Warm, muted colors - reddish-browns and earth tones
    filters.push(`saturate(${100 - completeVision.intensity * 60}%) sepia(${completeVision.intensity * 50}%)`);
    // Additional darkening for atmospheric effect
    filters.push(`hue-rotate(${completeVision.intensity * 20}deg)`);
  }
  
  // Individual effects
  if (frostedGlass) {
    // Dark blurred effect - not bright frosted glass
    filters.push(`blur(${frostedGlass.intensity * 50}px)`);
    filters.push(`brightness(${100 - frostedGlass.intensity * 60}%) contrast(${100 - frostedGlass.intensity * 75}%)`);
    filters.push(`saturate(${100 - frostedGlass.intensity * 50}%) sepia(${frostedGlass.intensity * 40}%)`);
  }
  
  if (heavyBlur) {
    // Extremely heavy blur with dark appearance
    filters.push(`blur(${heavyBlur.intensity * 55}px)`);
    filters.push(`brightness(${100 - heavyBlur.intensity * 50}%) contrast(${100 - heavyBlur.intensity * 70}%)`);
  }
  
  if (desaturation) {
    // Warm, muted colors - reddish-browns and earth tones
    filters.push(`saturate(${100 - desaturation.intensity * 70}%)`);
    filters.push(`sepia(${desaturation.intensity * 45}%) hue-rotate(${desaturation.intensity * 15}deg)`);
    filters.push(`brightness(${100 - desaturation.intensity * 30}%)`);
  }
  
  if (lightDiffusion) {
    // Dark atmospheric light diffusion
    filters.push(`brightness(${100 - lightDiffusion.intensity * 40}%)`);
    filters.push(`contrast(${100 - lightDiffusion.intensity * 60}%)`);
    filters.push(`saturate(${100 - lightDiffusion.intensity * 50}%) sepia(${lightDiffusion.intensity * 30}%)`);
  }
  
  if (textureOverlay) {
    // Dark amorphous texture overlay
    filters.push(`blur(${textureOverlay.intensity * 30}px)`);
    filters.push(`brightness(${100 - textureOverlay.intensity * 50}%) contrast(${100 - textureOverlay.intensity * 70}%)`);
    filters.push(`saturate(${100 - textureOverlay.intensity * 60}%) sepia(${textureOverlay.intensity * 35}%)`);
  }
  
  return filters.join(' ');
};

// David Paterson - Hemispheric Vision Loss Filters
const generateDavidFilters = (effects: VisualEffect[]): string => {
  const davidEffects = effects.filter(e =>
    e.id.startsWith('david') && e.enabled
  );

  if (davidEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'davidCompleteVision' && e.enabled);
  const leftEyeBlindness = effects.find(e => e.id === 'davidLeftEyeBlindness' && e.enabled);
  const rightEyeGlaucoma = effects.find(e => e.id === 'davidRightEyeGlaucoma' && e.enabled);
  const hemisphericVision = effects.find(e => e.id === 'davidHemisphericVision' && e.enabled);

  // Complete vision combines both hemispheric effects
  if (completeVision) {
    // No global CSS filters - hemispheric effects are handled entirely by overlays
    // This prevents the entire image from being affected by filters
  }

  // Individual effects - these are primarily handled by overlays
  // CSS filters would affect the entire image, which we don't want for hemispheric vision
  if (leftEyeBlindness) {
    // Left eye blindness is handled by overlay - no CSS filters needed
  }

  if (rightEyeGlaucoma) {
    // Right eye glaucoma is handled by overlay - no CSS filters needed
  }

  if (hemisphericVision) {
    // Hemispheric vision is handled by overlays - no CSS filters needed
  }

  return filters.join(' ');
};

// Marla Runyan - Stargardt Disease Filters
const generateMarlaFilters = (effects: VisualEffect[]): string => {
  const marlaEffects = effects.filter(e =>
    e.id.startsWith('marla') && e.enabled
  );

  if (marlaEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'marlaStargardtComplete' && e.enabled);
  const centralScotoma = effects.find(e => e.id === 'marlaCentralScotoma' && e.enabled);
  const peripheralVision = effects.find(e => e.id === 'marlaPeripheralVision' && e.enabled);
  const eccentricViewing = effects.find(e => e.id === 'marlaEccentricViewing' && e.enabled);
  const fillingIn = effects.find(e => e.id === 'marlaFillingIn' && e.enabled);
  const crowdingEffect = effects.find(e => e.id === 'marlaCrowdingEffect' && e.enabled);

  // Complete vision combines all effects - TRUE END-STAGE Stargardt
  if (completeVision) {
    // NO GLOBAL FILTERS - peripherals must be completely clear and unaffected
    // All effects are handled by overlays only to preserve peripheral clarity
    // This ensures the periphery remains completely unaffected by any visualization
  }

  // Individual effects - NO GLOBAL FILTERS to preserve peripheral clarity
  if (centralScotoma) {
    // NO CSS filters - all effects handled by overlays only
    // This ensures peripherals remain completely clear and unaffected
  }

  if (peripheralVision) {
    // NO CSS filters - peripheral vision enhancement handled by overlays only
    // This ensures peripherals remain completely clear and unaffected
  }

  if (eccentricViewing) {
    // NO CSS filters - eccentric viewing handled by overlays only
    // This ensures peripherals remain completely clear and unaffected
  }

  if (fillingIn) {
    // NO CSS filters - filling-in handled by overlays only
    // This ensures peripherals remain completely clear and unaffected
  }

  if (crowdingEffect) {
    // NO CSS filters - crowding effect handled by overlays only
    // This ensures peripherals remain completely clear and unaffected
  }

  return filters.join(' ');
};

// Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Filters
const generateMinkaraFilters = (effects: VisualEffect[]): string => {
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

  // End-stage complete vision combines all effects
  if (endStageComplete) {
    // Extreme contrast reduction for severe vision loss
    filters.push(`contrast(${100 - endStageComplete.intensity * 40}%)`);
    // Severe brightness reduction
    filters.push(`brightness(${100 - endStageComplete.intensity * 30}%)`);
    // Complete desaturation for achromatopsia
    filters.push(`saturate(0%)`);
    // Severe blur for remaining vision
    filters.push(`blur(${endStageComplete.intensity * 5}px)`);
  }

  // Individual effects
  if (centralScotoma) {
    // Central scotoma effects - severe contrast and brightness reduction
    filters.push(`contrast(${100 - centralScotoma.intensity * 50}%)`);
    filters.push(`brightness(${100 - centralScotoma.intensity * 40}%)`);
  }

  if (ringScotoma) {
    // Ring scotoma effects - moderate reduction
    filters.push(`contrast(${100 - ringScotoma.intensity * 30}%)`);
    filters.push(`brightness(${100 - ringScotoma.intensity * 20}%)`);
  }

  if (peripheralIslands) {
    // Peripheral islands - severe reduction
    filters.push(`contrast(${100 - peripheralIslands.intensity * 60}%)`);
    filters.push(`brightness(${100 - peripheralIslands.intensity * 50}%)`);
  }

  if (photophobia) {
    // Extreme photophobia - massive brightness and contrast boost
    filters.push(`brightness(${100 + photophobia.intensity * 200}%)`);
    filters.push(`contrast(${100 + photophobia.intensity * 300}%)`);
    // Severe blur for glare effect
    filters.push(`blur(${photophobia.intensity * 10}px)`);
  }

  if (achromatopsia) {
    // Complete achromatopsia - remove all color
    filters.push(`saturate(0%)`);
    // Slight contrast reduction
    filters.push(`contrast(${100 - achromatopsia.intensity * 20}%)`);
  }

  if (nightBlindness) {
    // Severe night blindness - extreme darkness
    filters.push(`brightness(${100 - nightBlindness.intensity * 80}%)`);
    filters.push(`contrast(${100 - nightBlindness.intensity * 60}%)`);
  }

  if (chemistryMode) {
    // Chemistry mode - enhance contrast for tactile/sound indicators
    filters.push(`contrast(${100 + chemistryMode.intensity * 20}%)`);
    filters.push(`brightness(${100 + chemistryMode.intensity * 10}%)`);
  }

  return filters.join(' ');
};

// Joshua Miele - Chemical Burn Complete Blindness Filters
const generateJoshuaFilters = (effects: VisualEffect[]): string => {
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

  // Complete blindness - no visual input whatsoever
  if (completeBlindness) {
    // Complete darkness - no light perception
    filters.push(`brightness(0%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  // Echolocation - enhance contrast for radar-like display
  if (echolocation) {
    filters.push(`contrast(${100 + echolocation.intensity * 50}%)`);
    filters.push(`brightness(${100 + echolocation.intensity * 20}%)`);
  }

  // Tactile maps - enhance for raised-line graphics
  if (tactileMaps) {
    filters.push(`contrast(${100 + tactileMaps.intensity * 30}%)`);
    filters.push(`brightness(${100 + tactileMaps.intensity * 15}%)`);
  }

  // Audio landscape - subtle enhancement for 3D audio visualization
  if (audioLandscape) {
    filters.push(`contrast(${100 + audioLandscape.intensity * 25}%)`);
    filters.push(`brightness(${100 + audioLandscape.intensity * 10}%)`);
  }

  // Accessibility mode - enhance for screen reader/braille display
  if (accessibilityMode) {
    filters.push(`contrast(${100 + accessibilityMode.intensity * 40}%)`);
    filters.push(`brightness(${100 + accessibilityMode.intensity * 20}%)`);
  }

  // Sonification - enhance for pitch/volume visualization
  if (sonification) {
    filters.push(`contrast(${100 + sonification.intensity * 35}%)`);
    filters.push(`brightness(${100 + sonification.intensity * 15}%)`);
  }

  return filters.join(' ');
};

// Diplopia effects are now handled by the getDiplopiaOverlay function in Visualizer.tsx
// This provides true double vision effects using iframe duplication instead of CSS filters

// Note: Glaucoma is now handled by DOM overlays for accurate visual field loss patterns

/**
 * Generates complete CSS filter string for all effects
 */
export const generateCSSFilters = (effects: VisualEffect[], diplopiaSeparation: number = 1.0, diplopiaDirection: number = 0.0): string => {
  return [generateColorBlindnessFilter(effects), generateBlurFilter(effects), generateGalileoFilters(effects), generateMonetFilters(effects), generateChristineFilters(effects), generateLucyFilters(effects), generateDavidFilters(effects), generateMarlaFilters(effects), generateMinkaraFilters(effects), generateJoshuaFilters(effects)]
    .filter(Boolean)
    .join(' ');
  // Note: Diplopia is handled by separate overlay system, not CSS filters
  // Note: Glaucoma is handled by DOM overlays, not CSS filters
  // Note: David Paterson's hemispheric vision is handled by DOM overlays, not CSS filters
  // Note: Marla Runyan's central scotoma is primarily handled by DOM overlays, with CSS filters for subtle effects
  // Note: Dr. Mona Minkara's combined vision loss uses both CSS filters and DOM overlays for maximum effect
  // Note: Joshua Miele's complete blindness uses both complete darkness and alternative sensory visualizations
};

/**
 * Generates base styles for media elements
 */
export const generateBaseStyles = (): React.CSSProperties => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };
};
