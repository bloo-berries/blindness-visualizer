import { VisualEffect } from '../../../types/visualEffects';

/**
 * David Brown - Kawasaki Disease to Glaucoma: Dual-Phase Asymmetric Progression
 * Left eye lost at age 3, right eye progressive glaucoma until sudden collapse at 13
 * Key elements: dirty-glass haze, rainbow halos, extreme light sensitivity, ongoing pain
 */
export const davidBrownEffects: VisualEffect[] = [
  {
    id: 'davidKawasakiEyes',
    name: 'Phase 1: Kawasaki Eyes (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Infancy to age 3 (1993-1995): Both eyes under assault from Kawasaki-induced glaucoma. Subtle overall haze like petroleum jelly on lens, washed-out colors, soft rainbow-tinged halos around light sources from corneal edema, peripheral edges beginning to soften and dim.'
  },
  {
    id: 'davidLeftEyeLoss',
    name: 'Left Eye Catastrophe (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 3: The left eye, damaged beyond repair by inflammation and pressure, stops sending meaningful signal. Not gradual - it simply ceases. Flat uniform dark gray (not black - a dead eye may still transmit some non-visual light sensation before atrophy).'
  },
  {
    id: 'davidMonocularHaze',
    name: 'Phase 2: Monocular Haze (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 3-8 (1995-2000): Right eye only, carrying entire burden. Overall dirty-glass haze, reduced contrast (40-50% less), beginning peripheral loss (soft vignette to 60-70% field), muted colors, shapes without detail. David thought everyone saw like this.'
  },
  {
    id: 'davidOutdoorNightmare',
    name: 'Outdoor Nightmare - Too Bright (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 6-12: The terror of going outside. Damaged retina cannot handle bright light - scene BLOWN OUT with painful glare. Sky becomes featureless white blaze, reflective surfaces produce searing starbursts, rainbow halos explode and overlap. Painful white fog with vague shapes swimming in it.'
  },
  {
    id: 'davidIndoorNightmare',
    name: 'Indoor Nightmare - Too Dark (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 6-12: The terror of dim interiors. Without sufficient light for compromised optic nerve, scene barely registers. Murky soupy near-darkness, furniture as slightly darker shadows, doorways as slightly lighter rectangles. The haze absorbs what little light exists.'
  },
  {
    id: 'davidSweetSpot',
    name: 'Sweet Spot - Narrow Tolerable Band (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'The narrow range between blinding outdoor glare and impenetrable indoor darkness where David can function: overcast days, shaded areas, well-lit indoor spaces. Tunnel vision advancing (40-50% field), thickening haze, intensifying halos, periodic pain intrusions.'
  },
  {
    id: 'davidPainIntrusions',
    name: 'Pain Intrusions (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Elevated eye pressure triggers waves of intense pain - crushing, migraine-like sensation behind the eye. During episodes, vision blurs further and flashes with visual artifacts (photopsias). A pulse of distortion - warping, constricting, throbbing - before settling to degraded baseline.'
  },
  {
    id: 'davidFinalCollapse',
    name: 'Phase 4: Final Collapse (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 13 (2005): Unlike slow fading, David\'s loss was sudden and catastrophic. The tunnel constricts rapidly, peripheral darkness rushes inward, haze thickens to near-opacity, colors drain to gray-brown then dim, a tiny island of dim light perception, then nothing. The optic nerve goes silent.'
  },
  {
    id: 'davidOngoingPain',
    name: 'Total Blindness with Ongoing Pain (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 13 onward: Complete permanent darkness, but not silent. The glaucoma continues building pressure, generating excruciating pain episodes. The darkness is periodically punctuated by waves of crushing pain behind an eye that can no longer see. The visual system is dead; the pain system is alive.'
  },
  {
    id: 'davidKawasakiGlaucomaComplete',
    name: 'Complete Kawasaki-Glaucoma Progression (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of David Brown\'s vision journey. Use intensity slider: 0-12% (Kawasaki eyes - bilateral haze/halos), 13-25% (left eye loss + monocular haze), 26-50% (light extremes - outdoor/indoor nightmares), 51-75% (advancing tunnel + sweet spot + pain), 76-90% (rapid final collapse), 91-100% (total blindness with ongoing pain). Confused adaptation → sudden devastation.'
  }
];
