import { VisualEffect } from '../../../types/visualEffects';

/**
 * Stephen Curry - Keratoconus (Mild-to-Moderate, Both Eyes)
 * Directional smearing, ghosting, irregular halos, waviness, reduced contrast
 */
export const stephenCurryEffects: VisualEffect[] = [
  {
    id: 'stephenComaAberration',
    name: 'Coma Aberration/Directional Smear (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Asymmetric directional blur where each point of light or contrast edge produces a comet-shaped tail trailing in one consistent direction (inferior/downward). NOT a uniform Gaussian blur - more like looking through a warped pane of glass with motion blur frozen in one direction.'
  },
  {
    id: 'stephenGhosting',
    name: 'Monocular Polyopia/Ghosting (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: '2-4 faint duplicate ghost images offset from the true position. High-contrast objects produce messy, chaotic scattering of semi-transparent echoes - not clean double vision but a "dirty" visual impression with ghosts spreading in a consistent directional pattern.'
  },
  {
    id: 'stephenIrregularHalos',
    name: 'Irregular Halos & Streaking (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Exaggerated, elongated halos around lights that are irregular and asymmetric with comet-like tails. NOT neat circular halos - they streak outward with smeared rays extending primarily in one direction. Bright lights bleed aggressively into surroundings.'
  },
  {
    id: 'stephenWaviness',
    name: 'Irregular Waviness (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle but unmistakable waviness in straight lines - like viewing through slightly melted or heat-warped lens. Non-uniform undulation reflecting irregular corneal thinning. Feels like looking through old imperfect window glass with subtle ripples.'
  },
  {
    id: 'stephenReducedContrast',
    name: 'Reduced Contrast & Haze (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Mildly reduced contrast with subtle diffuse light scatter - blacks aren\'t as black, whites aren\'t as white. A faint milky film caused by light scattering off the irregularly shaped cornea. Colors remain but lack their normal punch and saturation.'
  },
  {
    id: 'stephenAsymmetry',
    name: 'Asymmetric Eye Distortion (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Slightly different distortion between eyes - keratoconus is typically bilateral but asymmetric. One half is more smeared and ghosted than the other, creating subtle dissonance as the brain tries to fuse two imperfect images that don\'t quite match.'
  },
  {
    id: 'stephenKeratoconusComplete',
    name: 'Complete Keratoconus Vision (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Stephen Curry\'s mild-to-moderate keratoconus before contact lens correction: directional coma aberration smearing, monocular polyopia ghosting, irregular streaking halos around lights, wavy distortion, reduced contrast with diffuse haze, and asymmetric distortion between eyes. The world refuses to come into sharp focus - every edge bleeds, every light smears, every detail is a soft, ghosted, wavy approximation.'
  }
];
