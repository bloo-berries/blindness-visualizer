import { VisualEffect } from '../../../types/visualEffects';
import { PhaseFilterConfig, generatePhaseFilters } from './phaseFilterUtils';

/**
 * David Brown's Kawasaki Disease to Glaucoma
 * Dual-phase asymmetric progression:
 * 0-12%: Kawasaki eyes (bilateral haze, rainbow halos)
 * 13-25%: Left eye loss + monocular haze
 * 26-50%: Light extremes (outdoor/indoor nightmares)
 * 51-75%: Advancing tunnel + sweet spot + pain intrusions
 * 76-90%: Rapid final collapse
 * 91-100%: Total blindness with ongoing pain
 */
const davidBrownConfig: PhaseFilterConfig = {
  prefix: 'david',
  progressionEffectId: 'davidKawasakiGlaucomaComplete',
  phases: [
    {
      upperBound: 0.12,
      filters: (i) => [
        `blur(${1 + i * 2}px)`,
        `contrast(${100 - i * 20}%)`,
        `saturate(${100 - i * 25}%)`,
        `brightness(${100 + i * 8}%)`,
      ],
    },
    {
      upperBound: 0.25,
      filters: (i) => [
        `blur(${3 + i * 1.5}px)`,
        `contrast(${80 - i * 15}%)`,
        `saturate(${75 - i * 15}%)`,
        `brightness(${108 - i * 5}%)`,
      ],
    },
    {
      upperBound: 0.50,
      subPhases: [
        {
          upperBound: 0.4,
          filters: (subI) => [
            `brightness(${120 + subI * 80}%)`,
            `contrast(${65 - subI * 40}%)`,
            `saturate(${60 - subI * 35}%)`,
            `blur(${4 + subI * 3}px)`,
          ],
        },
        {
          upperBound: 0.7,
          filters: (subI) => [
            `brightness(${30 + subI * 15}%)`,
            `contrast(${25 + subI * 20}%)`,
            `saturate(${25 + subI * 15}%)`,
            `blur(${5 - subI * 1}px)`,
          ],
        },
        {
          upperBound: 1.0,
          filters: (subI) => [
            `brightness(${95 - subI * 10}%)`,
            `contrast(${65 - subI * 10}%)`,
            `saturate(${60 - subI * 15}%)`,
            `blur(${4 + subI * 1}px)`,
          ],
        },
      ],
    },
    {
      upperBound: 0.75,
      filters: (i) => [
        `blur(${5 + i * 3}px)`,
        `contrast(${55 - i * 20}%)`,
        `saturate(${45 - i * 20}%)`,
        `brightness(${85 - i * 20}%)`,
      ],
    },
    {
      upperBound: 0.90,
      filters: (i) => [
        `blur(${8 - i * 4}px)`,
        `contrast(${35 - i * 30}%)`,
        `saturate(${25 - i * 25}%)`,
        `brightness(${65 - i * 60}%)`,
        `sepia(${i * 40}%)`,
      ],
    },
    {
      upperBound: 1.0,
      filters: (i) => [
        `brightness(${5 - i * 5}%)`,
        `contrast(${5 - i * 5}%)`,
        `saturate(0%)`,
      ],
    },
  ],
  individualEffects: [
    {
      effectId: 'davidKawasakiEyes',
      filters: (i) => [
        `blur(${1 + i * 2}px)`, `contrast(${100 - i * 20}%)`,
        `saturate(${100 - i * 25}%)`, `brightness(${100 + i * 8}%)`,
      ],
    },
    {
      effectId: 'davidLeftEyeLoss',
      filters: (i) => [`contrast(${100 - i * 10}%)`],
    },
    {
      effectId: 'davidMonocularHaze',
      filters: (i) => [
        `blur(${3 + i * 2}px)`, `contrast(${80 - i * 20}%)`,
        `saturate(${75 - i * 20}%)`, `brightness(${103 - i * 8}%)`,
      ],
    },
    {
      effectId: 'davidOutdoorNightmare',
      filters: (i) => [
        `brightness(${140 + i * 80}%)`, `contrast(${50 - i * 30}%)`,
        `saturate(${50 - i * 30}%)`, `blur(${5 + i * 4}px)`,
      ],
    },
    {
      effectId: 'davidIndoorNightmare',
      filters: (i) => [
        `brightness(${35 - i * 20}%)`, `contrast(${30 + i * 15}%)`,
        `saturate(${30 - i * 15}%)`, `blur(${4 + i * 2}px)`,
      ],
    },
    {
      effectId: 'davidSweetSpot',
      filters: (i) => [
        `brightness(${90 - i * 15}%)`, `contrast(${60 - i * 15}%)`,
        `saturate(${55 - i * 20}%)`, `blur(${4 + i * 2}px)`,
      ],
    },
    {
      effectId: 'davidPainIntrusions',
      filters: (i) => [
        `contrast(${70 - i * 25}%)`, `brightness(${90 + i * 20}%)`,
        `blur(${i * 4}px)`,
      ],
    },
    {
      effectId: 'davidFinalCollapse',
      filters: (i) => [
        `brightness(${70 - i * 70}%)`, `contrast(${40 - i * 40}%)`,
        `saturate(${30 - i * 30}%)`, `sepia(${i * 50}%)`,
      ],
    },
    {
      effectId: 'davidOngoingPain',
      filters: (i) => [
        `brightness(${100 - i * 100}%)`, `contrast(0%)`, `saturate(0%)`,
      ],
    },
  ],
};

export const generateDavidBrownFilters = (effects: VisualEffect[]): string =>
  generatePhaseFilters(davidBrownConfig, effects);
