import { VisualEffect } from '../../../types/visualEffects';

/**
 * Amadou Bagayoko - Congenital Cataracts Progression to Total Blindness
 * Four phases: Early childhood haze → Fog thickens → Light perception only → Total blindness
 */
export const amadouBagayokoEffects: VisualEffect[] = [
  {
    id: 'amadouPhase1',
    name: 'Phase 1: Early Childhood Haze (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 5-8: Uniform milky haze like viewing through frosted glass. Muted warm-shifted colors (yellows/browns emphasized), soft 8-12px blur, and mild diffuse halos around lights. The world Amadou was born into - never knowing clear vision.'
  },
  {
    id: 'amadouPhase2',
    name: 'Phase 2: The Fog Thickens (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 10-13: Cataracts maturing. Heavy milky overlay like a steamed bathroom window. Pronounced yellowish-brown cast, 18-25px blur making faces unrecognizable. Light sources create expansive blooms that wash out surrounding detail.'
  },
  {
    id: 'amadouPhase3',
    name: 'Phase 3: Light Perception Only (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 14-16: Near-total white-out. Dense warm milky-white fog dominates. Only the strongest light sources register as brighter patches of warm glow. No shapes, no edges, no faces - just diffuse light and dark, and even that distinction is fading.'
  },
  {
    id: 'amadouPhase4',
    name: 'Phase 4: Total Blindness (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 16 onward (54+ years): Complete, absolute darkness. Not the black of a dark room - the black of no visual processing whatsoever. The darkness Amadou filled with the ring of guitar strings, the pulse of the djembe, and the voice of Mariam beside him.'
  },
  {
    id: 'amadouCataractProgression',
    name: 'Complete Cataract Progression (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Amadou Bagayoko\'s congenital cataract progression. Use intensity slider to move through all four phases: 0-25% (childhood haze), 26-50% (fog thickens), 51-75% (light perception only), 76-100% (total blindness). A slow, inevitable, graceful dimming - like a long sunset ending in night.'
  }
];
