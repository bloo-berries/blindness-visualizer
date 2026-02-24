import { VisualEffect } from '../../../types/visualEffects';

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
      const phaseI = i / 0.15; // 0-1 within phase
      filters.push(`contrast(${100 - phaseI * 5}%)`);
      filters.push(`brightness(${100 - phaseI * 3}%)`);
    } else if (i <= 0.30) {
      // Phase 2: First detachment symptoms (16-30%)
      const phaseI = (i - 0.15) / 0.15; // 0-1 within phase
      filters.push(`contrast(${95 - phaseI * 12}%)`);
      filters.push(`brightness(${97 - phaseI * 8}%)`);
      filters.push(`saturate(${100 - phaseI * 15}%)`);
      filters.push(`blur(${phaseI * 0.8}px)`);
    } else if (i <= 0.45) {
      // Phase 3: Post-surgery restoration (31-45%)
      const phaseI = (i - 0.30) / 0.15; // 0-1 within phase
      filters.push(`contrast(${83 + phaseI * 10}%)`);
      filters.push(`brightness(${89 + phaseI * 6}%)`);
      filters.push(`saturate(${85 + phaseI * 8}%)`);
      filters.push(`blur(${0.8 - phaseI * 0.5}px)`);
    } else if (i <= 0.60) {
      // Phase 4: Re-detachment (46-60%)
      const phaseI = (i - 0.45) / 0.15; // 0-1 within phase
      filters.push(`contrast(${93 - phaseI * 18}%)`);
      filters.push(`brightness(${95 - phaseI * 15}%)`);
      filters.push(`saturate(${93 - phaseI * 22}%)`);
      filters.push(`blur(${0.3 + phaseI * 1.2}px)`);
    } else if (i <= 0.80) {
      // Phase 5: Cumulative damage (61-80%)
      const phaseI = (i - 0.60) / 0.20; // 0-1 within phase
      filters.push(`contrast(${75 - phaseI * 25}%)`);
      filters.push(`brightness(${80 - phaseI * 25}%)`);
      filters.push(`saturate(${71 - phaseI * 30}%)`);
      filters.push(`blur(${1.5 + phaseI * 2}px)`);
    } else {
      // Phase 6: Daily fading to total blindness (81-100%)
      const phaseI = (i - 0.80) / 0.20; // 0-1 within phase
      filters.push(`brightness(${55 - phaseI * 55}%)`);
      filters.push(`contrast(${50 - phaseI * 50}%)`);
      filters.push(`saturate(${41 - phaseI * 41}%)`);
      filters.push(`blur(${3.5 - phaseI * 2}px)`);
    }
  }

  // Individual phase effects
  if (monocular && !recurrentCycle) {
    const i = monocular.intensity;
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
    filters.push(`brightness(${100 - i * 100}%)`);
    filters.push(`contrast(${100 - i * 100}%)`);
    filters.push(`saturate(${100 - i * 100}%)`);
  }

  return filters.join(' ');
};
