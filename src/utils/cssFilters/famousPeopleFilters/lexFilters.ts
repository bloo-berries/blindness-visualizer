import { VisualEffect } from '../../../types/visualEffects';
import { PhaseFilterConfig, generatePhaseFilters } from './phaseFilterUtils';

/**
 * Lex Gillette's Recurrent Retinal Detachments
 * Cyclical pattern reflecting hope and loss:
 * 0-15%: Monocular normal (right eye only)
 * 16-30%: First detachment symptoms
 * 31-45%: Post-surgery restoration (improved but scarred)
 * 46-60%: Re-detachment (larger shadow)
 * 61-80%: Cumulative damage (shrinking clear zone)
 * 81-100%: Daily fading to total blindness
 */
const lexConfig: PhaseFilterConfig = {
  prefix: 'lex',
  progressionEffectId: 'lexRecurrentDetachmentCycle',
  phases: [
    {
      upperBound: 0.15,
      filters: (i) => [
        `contrast(${100 - i * 5}%)`,
        `brightness(${100 - i * 3}%)`,
      ],
    },
    {
      upperBound: 0.30,
      filters: (i) => [
        `contrast(${95 - i * 12}%)`,
        `brightness(${97 - i * 8}%)`,
        `saturate(${100 - i * 15}%)`,
        `blur(${i * 0.8}px)`,
      ],
    },
    {
      upperBound: 0.45,
      filters: (i) => [
        `contrast(${83 + i * 10}%)`,
        `brightness(${89 + i * 6}%)`,
        `saturate(${85 + i * 8}%)`,
        `blur(${0.8 - i * 0.5}px)`,
      ],
    },
    {
      upperBound: 0.60,
      filters: (i) => [
        `contrast(${93 - i * 18}%)`,
        `brightness(${95 - i * 15}%)`,
        `saturate(${93 - i * 22}%)`,
        `blur(${0.3 + i * 1.2}px)`,
      ],
    },
    {
      upperBound: 0.80,
      filters: (i) => [
        `contrast(${75 - i * 25}%)`,
        `brightness(${80 - i * 25}%)`,
        `saturate(${71 - i * 30}%)`,
        `blur(${1.5 + i * 2}px)`,
      ],
    },
    {
      upperBound: 1.0,
      filters: (i) => [
        `brightness(${55 - i * 55}%)`,
        `contrast(${50 - i * 50}%)`,
        `saturate(${41 - i * 41}%)`,
        `blur(${3.5 - i * 2}px)`,
      ],
    },
  ],
  individualEffects: [
    {
      effectId: 'lexMonocularVision',
      filters: (i) => [`contrast(${100 - i * 5}%)`, `brightness(${100 - i * 3}%)`],
    },
    {
      effectId: 'lexFirstDetachment',
      filters: (i) => [
        `contrast(${95 - i * 12}%)`, `brightness(${97 - i * 10}%)`,
        `saturate(${100 - i * 18}%)`, `blur(${i * 1}px)`,
      ],
    },
    {
      effectId: 'lexPostSurgeryRestoration',
      filters: (i) => [
        `contrast(${92 - i * 8}%)`, `brightness(${95 - i * 5}%)`,
        `saturate(${95 - i * 10}%)`,
      ],
    },
    {
      effectId: 'lexRedetachment',
      filters: (i) => [
        `contrast(${90 - i * 20}%)`, `brightness(${92 - i * 18}%)`,
        `saturate(${88 - i * 25}%)`, `blur(${i * 1.5}px)`,
      ],
    },
    {
      effectId: 'lexCumulativeDamage',
      filters: (i) => [
        `contrast(${80 - i * 30}%)`, `brightness(${75 - i * 30}%)`,
        `saturate(${70 - i * 35}%)`, `blur(${i * 3}px)`,
      ],
    },
    {
      effectId: 'lexDailyFading',
      filters: (i) => [
        `brightness(${100 - i * 100}%)`, `contrast(${100 - i * 100}%)`,
        `saturate(${100 - i * 100}%)`,
      ],
    },
  ],
};

export const generateLexFilters = (effects: VisualEffect[]): string =>
  generatePhaseFilters(lexConfig, effects);
