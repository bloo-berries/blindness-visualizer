import { VisualEffect } from '../../../types/visualEffects';

/**
 * Christine Ha - Neuromyelitis Optica (NMO)
 */
export const christineHaEffects: VisualEffect[] = [
  {
    id: 'christineNMOBlur',
    name: 'NMO Extreme Blur (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Extreme Gaussian blur representing the severe vision loss from NMO optic neuritis. Uniform blur across entire visual field with no focal point, simulating 20/1000+ vision where even high contrast edges are completely softened.'
  },
  {
    id: 'christineSteamyMirror',
    name: 'Steamy Mirror Effect (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'The characteristic "steamy mirror" effect that Christine describes - like looking through a bathroom mirror completely fogged with condensation. Creates an impenetrable fog over everything with no clear zones.'
  },
  {
    id: 'christineLightScatter',
    name: 'Light Scatter & Halos (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Light scatter effects where bright lights create large, soft halos and extensive blooming. Represents how Christine can detect light sources and windows but with severe light scatter and no sharp shadows.'
  },
  {
    id: 'christineFogOverlay',
    name: 'Animated Fog Overlay (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Animated fog/steam overlay that shifts and moves like real steam. Creates uneven visibility with denser areas and represents the wavering distortion effect of looking through water.'
  },
  {
    id: 'christineFluctuatingVision',
    name: 'Fluctuating Vision (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the day-to-day variation and heat sensitivity (Uhthoff\'s phenomenon) of NMO. Vision fluctuates with subtle wavering and swimming effects, worse with exertion and throughout the day.'
  },
  {
    id: 'christineNMOComplete',
    name: 'Complete NMO Experience (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Christine Ha\'s NMO experience combining extreme blur, steamy mirror effect, light scatter, fog overlay, and fluctuating vision. Represents her 20/1000+ vision with 10-12 inch functional range.'
  }
];
