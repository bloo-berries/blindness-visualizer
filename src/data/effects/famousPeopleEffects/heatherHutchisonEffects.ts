import { VisualEffect } from '../../../types/visualEffects';

/**
 * Heather Hutchison - Light Perception (LP) Only Vision
 *
 * Technical Parameters:
 * 1. Extreme Gaussian blur (80-120px) - destroys all edge, form, and detail
 * 2. Near-total desaturation (0-5%) - color perception functionally absent
 * 3. Severe contrast reduction (10-20%) - shadows and midtones collapse
 * 4. High brightness (180%+) - perception skews toward "washed-out white"
 * 5. White fog overlay (70-85% opacity) - diffuse, fog-like quality
 * 6. Fluctuating perception - slow oscillation (3-5s period, ±10% variation)
 * 7. Nystagmus jitter - horizontal oscillation at 2-5 Hz
 *
 * LP vision is described as seeing "various shades of white" - only the
 * broadest luminance regions remain as vague gradients. No shapes, no
 * faces, no text - only the strongest light-vs-dark transitions register.
 */
export const heatherHutchisonEffects: VisualEffect[] = [
  {
    id: 'heatherNearTotalOpacity',
    name: 'Washed-Out White (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'High luminance "washed-out white" perception. LP vision skews heavily toward white/light gray - not darkness, but a diffuse, fog-like brightness where everything appears as various shades of white.'
  },
  {
    id: 'heatherDiffuseLightBlobs',
    name: 'Diffuse Light Blobs (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Light sources rendered as soft, unfocused, amorphous bright patches with no edges or shape. Extreme Gaussian blur (80-120px) transforms any light into formless glows. Only the strongest light-vs-dark transitions (e.g., a window vs. a dark wall) register as vague gradients.'
  },
  {
    id: 'heatherNystagmus',
    name: 'Nystagmus Jitter (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle, continuous horizontal oscillation of the entire visual field. Small-amplitude sinusoidal shake at 2-5 Hz frequency. Creates the characteristic involuntary eye movement pattern of congenital nystagmus.'
  },
  {
    id: 'heatherNoColor',
    name: 'Color Stripped (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete or near-complete absence of color perception (0-5% saturation). Light perception vision does not resolve wavelength - only luminance variation is perceived. Everything appears in shades of white/gray.'
  },
  {
    id: 'heatherFluctuatingPerception',
    name: 'Fluctuating Perception (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle modulation of brightness and blur over time (3-5 second period, ±10% variation). Simulates the fluctuating, unstable nature of light perception - sometimes slightly clearer, sometimes more washed out, but never resolving to form.'
  },
  {
    id: 'heatherLightPerceptionComplete',
    name: 'Complete Light Perception Vision (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Light Perception (LP) only vision. Extreme blur (80-120px) destroys all form and detail. Near-total desaturation strips color. Severe contrast reduction collapses shadows and midtones. High brightness creates "washed-out white" perception - described as seeing "various shades of white." White fog overlay (70-85% opacity) adds diffuse quality. Nystagmus provides characteristic eye movement jitter. Perception fluctuates slowly over time. Only the broadest luminance regions remain as vague gradients.'
  }
];
