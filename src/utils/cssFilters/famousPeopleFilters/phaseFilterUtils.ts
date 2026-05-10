import { VisualEffect } from '../../../types/visualEffects';

/**
 * Sub-phase within a phase (e.g., outdoor/indoor/sweet-spot variations).
 */
interface SubPhaseDefinition {
  upperBound: number;
  filters: (normalizedIntensity: number) => string[];
}

/**
 * A phase within an intensity-based progression.
 * Either `filters` or `subPhases` should be provided.
 */
interface PhaseDefinition {
  /** Phase ends at this intensity value (exclusive, except the last phase). */
  upperBound: number;
  /** Filter generator for this phase. Receives normalized 0-1 intensity within the phase. */
  filters?: (normalizedIntensity: number) => string[];
  /** Sub-phases for more granular control within this phase. */
  subPhases?: SubPhaseDefinition[];
}

/**
 * An individual effect that applies when the progression effect is not active.
 */
interface IndividualEffect {
  effectId: string;
  filters: (intensity: number) => string[];
}

/**
 * Configuration for a phase-based filter progression.
 */
export interface PhaseFilterConfig {
  /** Effect ID prefix for quick-filtering (e.g., 'amadou', 'lex'). */
  prefix: string;
  /** The progression effect ID that controls phases. */
  progressionEffectId: string;
  /** Phase definitions ordered by intensity. */
  phases: PhaseDefinition[];
  /** Individual phase effects (active only when progression is off). */
  individualEffects: IndividualEffect[];
}

/**
 * Generates CSS filter strings from a phase-based configuration.
 * Handles progression phases, sub-phases, and individual fallback effects.
 */
export function generatePhaseFilters(config: PhaseFilterConfig, effects: VisualEffect[]): string {
  const prefixEffects = effects.filter(e => e.id.startsWith(config.prefix) && e.enabled);
  if (prefixEffects.length === 0) return '';

  const filters: string[] = [];
  const progression = effects.find(e => e.id === config.progressionEffectId && e.enabled);

  if (progression) {
    const intensity = progression.intensity;
    let prevBound = 0;

    for (const phase of config.phases) {
      if (intensity <= phase.upperBound || phase === config.phases[config.phases.length - 1]) {
        const range = phase.upperBound - prevBound;
        const normalizedI = range > 0 ? (intensity - prevBound) / range : 0;
        const clampedI = Math.max(0, Math.min(1, normalizedI));

        if (phase.subPhases) {
          let subPrev = 0;
          const lastSub = phase.subPhases[phase.subPhases.length - 1];
          for (const sub of phase.subPhases) {
            if (clampedI <= sub.upperBound || sub === lastSub) {
              const subRange = sub.upperBound - subPrev;
              const subI = subRange > 0 ? (clampedI - subPrev) / subRange : 0;
              filters.push(...sub.filters(Math.max(0, Math.min(1, subI))));
              break;
            }
            subPrev = sub.upperBound;
          }
        } else if (phase.filters) {
          filters.push(...phase.filters(clampedI));
        }
        break;
      }
      prevBound = phase.upperBound;
    }
  }

  // Individual effects (only when progression is not active)
  for (const individual of config.individualEffects) {
    const effect = effects.find(e => e.id === individual.effectId && e.enabled);
    if (effect && !progression) {
      filters.push(...individual.filters(effect.intensity));
    }
  }

  return filters.join(' ');
}
