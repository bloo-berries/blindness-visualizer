import { VisualEffect } from '../../../types/visualEffects';

/**
 * Heather Hutchison - Congenital Light Perception Only Vision with Nystagmus
 * Near-total blindness with only diffuse light perception, no form vision
 * Features: milky/washed-out glow, diffuse light blobs, nystagmus jitter, no color
 */
export const heatherHutchisonEffects: VisualEffect[] = [
  {
    id: 'heatherNearTotalOpacity',
    name: 'Near-Total Opacity (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Near-total visual occlusion (92-98% opacity). Not pure black - a dim, milky/washed-out glow. Represents the baseline darkness of light perception only vision where form cannot be resolved.'
  },
  {
    id: 'heatherDiffuseLightBlobs',
    name: 'Diffuse Light Blobs (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Light sources rendered as soft, unfocused, amorphous bright patches with no edges or shape. Extreme Gaussian blur (80-120px+) transforms any light into formless glows. Bright areas produce faint diffuse patches; dark areas are indistinguishable void.'
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
    description: 'Complete or near-complete absence of color perception. Light perception vision does not resolve wavelength - only luminance variation is perceived. Everything appears in dim grayscale.'
  },
  {
    id: 'heatherFluctuatingPerception',
    name: 'Fluctuating Perception (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle modulation of overall opacity and blur over time. Simulates the fluctuating nature of light perception - sometimes slightly clearer, sometimes dimmer, but never resolving to form.'
  },
  {
    id: 'heatherLightPerceptionComplete',
    name: 'Complete Light Perception Vision (Heather Hutchison)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Heather Hutchison\'s congenital light perception only vision. Near-total opacity with milky/washed-out glow (not pure black). Diffuse amorphous light blobs with extreme blur - no edges, no shapes, only formless bright patches. Continuous nystagmus jitter (2-5 Hz horizontal oscillation). No color - only dim luminance variation. Fluctuating perception over time. This is what "counting fingers at best" vision looks like - or more accurately, doesn\'t look like.'
  }
];
