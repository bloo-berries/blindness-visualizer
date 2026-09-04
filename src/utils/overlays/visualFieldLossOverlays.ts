import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';
import { clampOpacity, scaledOpacity } from './sharedOverlayUtils';

interface VFLConfig {
  conditionId: string;
  overlayId: string;
  gradient: (intensity: number) => string;
  opacity: (intensity: number) => string;
  filter?: string;
}

/** Helper: radial-gradient quadrant overlay from a corner position */
const quadrantGradient = (posX: string, posY: string) => (intensity: number) => {
  const alpha = scaledOpacity(intensity);
  return `radial-gradient(ellipse 100% 100% at ${posX} ${posY},
    rgba(50,50,50,${alpha}) 0%,
    rgba(50,50,50,${alpha}) 65%,
    rgba(50,50,50,${alpha * 0.6}) 72%,
    rgba(50,50,50,${alpha * 0.2}) 80%,
    rgba(50,50,50,0) 85%
  )`;
};

/** Helper: linear-gradient half-field overlay */
const hemianopiaGradient = (direction: string) => (intensity: number) => {
  const alpha = scaledOpacity(intensity);
  return `linear-gradient(${direction},
    rgba(50,50,50,${alpha}) 0%,
    rgba(50,50,50,${alpha}) 45%,
    rgba(50,50,50,0) 50%
  )`;
};

/** Helper: linear-gradient blindness overlay with gray-to-black transition */
const blindnessGradient = (direction: string) => (intensity: number) => {
  const isTotal = intensity === 1;
  const grayVal = isTotal ? 0 : 50;
  const alpha = scaledOpacity(intensity);
  return `linear-gradient(${direction},
    rgba(${grayVal},${grayVal},${grayVal},${alpha}) 0%,
    rgba(${grayVal},${grayVal},${grayVal},${alpha}) 47.5%,
    rgba(${grayVal},${grayVal},${grayVal},${alpha * 0.7}) 48.75%,
    rgba(${grayVal},${grayVal},${grayVal},${alpha * 0.4}) 50%,
    rgba(${grayVal},${grayVal},${grayVal},${alpha * 0.1}) 51.25%,
    rgba(0,0,0,0) 52.5%
  )`;
};

const clampStr = (intensity: number) => clampOpacity(intensity).toString();

const VFL_CONFIGS: VFLConfig[] = [
  {
    conditionId: 'tunnelVision',
    overlayId: 'visual-field-overlay-tunnelVision',
    gradient: (intensity) => `radial-gradient(circle at 50% 50%,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 20)}%,
      rgba(55,55,55,${0.85 * intensity}) ${Math.max(40, 55 - intensity * 20)}%,
      rgba(35,35,35,${0.85 * intensity}) 100%
    )`,
    opacity: (intensity) => Math.min(0.85, intensity).toString(),
    filter: 'blur(1px)',
  },
  {
    conditionId: 'quadrantanopiaLeft',
    overlayId: 'visual-field-overlay-quadrantanopiaLeft',
    gradient: (intensity) => {
      const alpha = scaledOpacity(intensity);
      return `conic-gradient(from 0deg at 50% 50%,
        rgba(50,50,50,0) 0deg,
        rgba(50,50,50,0) 90deg,
        rgba(50,50,50,${alpha}) 90deg,
        rgba(50,50,50,${alpha}) 180deg,
        rgba(50,50,50,0) 180deg,
        rgba(50,50,50,0) 360deg
      )`;
    },
    opacity: clampStr,
  },
  {
    conditionId: 'quadrantanopiaRight',
    overlayId: 'visual-field-overlay-quadrantanopiaRight',
    gradient: (intensity) => `radial-gradient(circle at 0% 100%,
      rgba(50,50,50,0) 0%,
      rgba(50,50,50,0) ${Math.max(25, 40 - intensity * 20)}%,
      rgba(50,50,50,1) ${Math.max(45, 60 - intensity * 20)}%,
      rgba(50,50,50,1) 100%
    )`,
    opacity: clampStr,
  },
  {
    conditionId: 'quadrantanopiaInferiorLeft',
    overlayId: 'visual-field-overlay-quadrantanopiaInferiorLeft',
    gradient: quadrantGradient('0%', '100%'),
    opacity: clampStr,
  },
  {
    conditionId: 'quadrantanopiaInferiorRight',
    overlayId: 'visual-field-overlay-quadrantanopiaInferiorRight',
    gradient: quadrantGradient('100%', '100%'),
    opacity: clampStr,
  },
  {
    conditionId: 'quadrantanopiaSuperiorLeft',
    overlayId: 'visual-field-overlay-quadrantanopiaSuperiorLeft',
    gradient: quadrantGradient('0%', '0%'),
    opacity: clampStr,
  },
  {
    conditionId: 'quadrantanopiaSuperiorRight',
    overlayId: 'visual-field-overlay-quadrantanopiaSuperiorRight',
    gradient: quadrantGradient('100%', '0%'),
    opacity: clampStr,
  },
  {
    conditionId: 'hemianopiaLeft',
    overlayId: 'visual-field-overlay-hemianopiaLeft',
    gradient: hemianopiaGradient('to right'),
    opacity: clampStr,
  },
  {
    conditionId: 'hemianopiaRight',
    overlayId: 'visual-field-overlay-hemianopiaRight',
    gradient: hemianopiaGradient('to left'),
    opacity: clampStr,
  },
  {
    conditionId: 'blindnessLeftEye',
    overlayId: 'visual-field-overlay-blindnessLeftEye',
    gradient: blindnessGradient('to right'),
    opacity: clampStr,
  },
  {
    conditionId: 'blindnessRightEye',
    overlayId: 'visual-field-overlay-blindnessRightEye',
    gradient: blindnessGradient('to left'),
    opacity: clampStr,
  },
  {
    conditionId: 'bitemporalHemianopia',
    overlayId: 'visual-field-overlay-bitemporalHemianopia',
    gradient: (intensity) => {
      const alpha = scaledOpacity(intensity);
      return `linear-gradient(to right,
        rgba(50,50,50,${alpha}) 0%,
        rgba(50,50,50,${alpha}) 22.5%,
        rgba(50,50,50,${alpha * 0.7}) 23.75%,
        rgba(50,50,50,${alpha * 0.4}) 25%,
        rgba(50,50,50,${alpha * 0.1}) 26.25%,
        rgba(50,50,50,0) 27.5%,
        rgba(50,50,50,0) 72.5%,
        rgba(50,50,50,${alpha * 0.1}) 73.75%,
        rgba(50,50,50,${alpha * 0.4}) 75%,
        rgba(50,50,50,${alpha * 0.7}) 76.25%,
        rgba(50,50,50,${alpha}) 77.5%,
        rgba(50,50,50,${alpha}) 100%
      )`;
    },
    opacity: clampStr,
  },
  {
    conditionId: 'scotoma',
    overlayId: 'visual-field-overlay-scotoma',
    gradient: (intensity) => {
      const size = Math.max(15, 10 + intensity * 20);
      return `radial-gradient(circle at 50% 50%, rgba(45,45,45,${0.85 * intensity}) 0%, rgba(45,45,45,${0.75 * intensity}) ${size - 5}%, rgba(45,45,45,${0.5 * intensity}) ${size}%, rgba(45,45,45,${0.25 * intensity}) ${size + 5}%, transparent ${size + 10}%)`;
    },
    opacity: (intensity) => Math.min(0.85, intensity).toString(),
    filter: 'blur(0.5px)',
  },
];

/**
 * Creates overlays for visual field loss conditions
 * Includes: hemianopia, quadrantanopia, tunnel vision, scotoma, blindness
 */
export const createVisualFieldLossOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  for (const config of VFL_CONFIGS) {
    const effect = effects.get(config.conditionId);
    if (effect?.enabled) {
      createOverlay(
        config.overlayId,
        config.gradient(effect.intensity),
        'normal',
        config.opacity(effect.intensity),
        config.filter,
        undefined,
        config.conditionId
      );
    }
  }
};
