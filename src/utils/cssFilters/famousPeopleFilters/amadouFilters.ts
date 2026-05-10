import { VisualEffect } from '../../../types/visualEffects';
import { PhaseFilterConfig, generatePhaseFilters } from './phaseFilterUtils';

/**
 * Amadou Bagayoko's Congenital Cataract Progression
 * Four phases based on intensity:
 * 0-25%: Phase 1 (childhood haze) - milky overlay, soft blur, warm shift
 * 26-50%: Phase 2 (fog thickens) - heavy milky, strong blur, sepia cast
 * 51-75%: Phase 3 (light perception) - near white-out, minimal detail
 * 76-100%: Phase 4 (total blindness) - complete darkness
 */
const amadouConfig: PhaseFilterConfig = {
  prefix: 'amadou',
  progressionEffectId: 'amadouCataractProgression',
  phases: [
    {
      upperBound: 0.25,
      filters: (i) => [
        `blur(${8 + i * 4}px)`,
        `sepia(${30 + i * 15}%)`,
        `saturate(${70 - i * 20}%)`,
        `contrast(${90 - i * 15}%)`,
        `brightness(${100 + i * 8}%)`,
      ],
    },
    {
      upperBound: 0.5,
      filters: (i) => [
        `blur(${12 + i * 13}px)`,
        `sepia(${45 + i * 20}%)`,
        `saturate(${50 - i * 25}%)`,
        `contrast(${75 - i * 25}%)`,
        `brightness(${108 + i * 15}%)`,
      ],
    },
    {
      upperBound: 0.75,
      filters: (i) => [
        `blur(${25 + i * 25}px)`,
        `sepia(${65 + i * 20}%)`,
        `saturate(${25 - i * 20}%)`,
        `contrast(${50 - i * 35}%)`,
        `brightness(${123 + i * 40}%)`,
      ],
    },
    {
      upperBound: 1.0,
      filters: (i) => [
        `brightness(${163 - i * 163}%)`,
        `contrast(${15 - i * 15}%)`,
        `saturate(0%)`,
        `blur(${50 - i * 30}px)`,
      ],
    },
  ],
  individualEffects: [
    {
      effectId: 'amadouPhase1',
      filters: (i) => [
        `blur(${8 + i * 4}px)`,
        `sepia(${30 + i * 15}%)`,
        `saturate(${70 - i * 20}%)`,
        `contrast(${90 - i * 15}%)`,
        `brightness(${100 + i * 8}%)`,
      ],
    },
    {
      effectId: 'amadouPhase2',
      filters: (i) => [
        `blur(${12 + i * 13}px)`,
        `sepia(${45 + i * 20}%)`,
        `saturate(${50 - i * 25}%)`,
        `contrast(${75 - i * 25}%)`,
        `brightness(${108 + i * 15}%)`,
      ],
    },
    {
      effectId: 'amadouPhase3',
      filters: (i) => [
        `blur(${25 + i * 25}px)`,
        `sepia(${65 + i * 20}%)`,
        `saturate(${25 - i * 20}%)`,
        `contrast(${50 - i * 35}%)`,
        `brightness(${123 + i * 40}%)`,
      ],
    },
    {
      effectId: 'amadouPhase4',
      filters: (i) => [
        `brightness(${100 - i * 100}%)`,
        `contrast(0%)`,
        `saturate(0%)`,
      ],
    },
  ],
};

export const generateAmadouFilters = (effects: VisualEffect[]): string =>
  generatePhaseFilters(amadouConfig, effects);
