import { VisualEffect } from '../../../types/visualEffects';

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
      filters.push(`blur(${1 + phaseI * 2}px)`);
      filters.push(`contrast(${100 - phaseI * 20}%)`);
      filters.push(`saturate(${100 - phaseI * 25}%)`);
      filters.push(`brightness(${100 + phaseI * 8}%)`);
    } else if (i <= 0.25) {
      // Phase 2: Left eye loss + monocular haze (13-25%)
      const phaseI = (i - 0.12) / 0.13; // 0-1 within phase
      filters.push(`blur(${3 + phaseI * 1.5}px)`);
      filters.push(`contrast(${80 - phaseI * 15}%)`);
      filters.push(`saturate(${75 - phaseI * 15}%)`);
      filters.push(`brightness(${108 - phaseI * 5}%)`);
    } else if (i <= 0.50) {
      // Phase 3: Light extremes (26-50%)
      const phaseI = (i - 0.25) / 0.25; // 0-1 within phase

      if (phaseI < 0.4) {
        // Outdoor nightmare - too bright (26-35%)
        const subI = phaseI / 0.4;
        filters.push(`brightness(${120 + subI * 80}%)`);
        filters.push(`contrast(${65 - subI * 40}%)`);
        filters.push(`saturate(${60 - subI * 35}%)`);
        filters.push(`blur(${4 + subI * 3}px)`);
      } else if (phaseI < 0.7) {
        // Indoor nightmare - too dark (36-42%)
        const subI = (phaseI - 0.4) / 0.3;
        filters.push(`brightness(${30 + subI * 15}%)`);
        filters.push(`contrast(${25 + subI * 20}%)`);
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
      filters.push(`blur(${8 - phaseI * 4}px)`);
      filters.push(`contrast(${35 - phaseI * 30}%)`);
      filters.push(`saturate(${25 - phaseI * 25}%)`);
      filters.push(`brightness(${65 - phaseI * 60}%)`);
      filters.push(`sepia(${phaseI * 40}%)`);
    } else {
      // Phase 6: Total blindness with ongoing pain (91-100%)
      const phaseI = (i - 0.90) / 0.10; // 0-1 within phase
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
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(0%)`);
    filters.push(`saturate(0%)`);
  }

  return filters.join(' ');
};
