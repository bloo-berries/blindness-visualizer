import { VisualEffect } from '../../../types/visualEffects';

/**
 * Kenshi Takahashi - Telekinetic Psychic Perception
 * Blind swordsman with telekinetic powers - perceives through psychic fields
 * Key features: soul/life-force detection, spirit realm visibility, 360° awareness
 */
export const kenshiEffects: VisualEffect[] = [
  {
    id: 'kenshiDarkVoid',
    name: 'Dark Void Base (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'The world is dark by default - black/deep indigo void with no ambient light. Illumination comes only from psychic energy perception. This is the baseline "nothing" that Kenshi perceives without telekinetic sensing.'
  },
  {
    id: 'kenshiSoulDetection',
    name: 'Soul/Life-Force Detection (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'Living beings radiate luminous energy in cool blue-white/spectral cyan. People and creatures register intensely with pulsing life force that follows a gentle heartbeat rhythm. Powerful fighters glow brighter than ordinary people. The intensity corresponds to soul energy/power level.'
  },
  {
    id: 'kenshiInertMatter',
    name: 'Inert Matter Outlines (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'Inanimate objects register as faint contour lines in deep blue/violet - present but understated compared to living beings. Denser materials (stone, metal) appear slightly brighter than soft materials. Only mass/density information, no surface detail, texture, or color.'
  },
  {
    id: 'kenshiIntentSensing',
    name: 'Intent/Threat Sensing (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'As a psychokinetic, Kenshi senses hostility, fear, and deception. Combat intent flares bright white/amber BEFORE a physical attack lands - a predictive layer with no visual analogue. When an enemy prepares to strike, a bright flash emanates in the direction of their intended attack.'
  },
  {
    id: 'kenshiSpiritRealm',
    name: 'Spirit Realm Visibility (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'Kenshi\'s blindfold retains vestigial powers allowing him to peer into the spirit realm. Ghosts, soul constructs, and spiritual entities appear as translucent, spectral wisps drifting through the scene - visible to him when invisible to sighted people. Ancestral spirits and soul echoes pass through his perception.'
  },
  {
    id: 'kenshiSentoResonance',
    name: 'Sento Sword Resonance (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'When holding the ancestral sword Sento, a warm amber/gold pulsing aura extends outward from the blade, brightening the entire perception field. The sword itself glows warmly - the one warm-toned element in an otherwise cool-spectrum perception. The blade connects him to his ancestors\' souls.'
  },
  {
    id: 'kenshiRangeFalloff',
    name: 'Psychic Range Limit (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'Hard perceptual boundary at the edge of telekinetic range (~20-50m in combat). Beyond it - absolute void. Not a gradual fade like fog, but a crisp boundary where awareness simply ends. The darkness beyond is complete and impenetrable.'
  },
  {
    id: 'kenshiTelekineticStreams',
    name: 'Telekinetic Force Streams (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'When actively using telekinesis, visible force streams appear - arcs or tendrils of cyan/blue light connecting his mind to the object being manipulated. This represents him "seeing" his own power interact with the world, the psychic energy made visible.'
  },
  {
    id: 'kenshiOmnidirectionalAwareness',
    name: '360° Spatial Awareness (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'No fixed field of view. Perception radiates outward omnidirectionally like a sphere of awareness. No "looking at" something - everything within range is simultaneously felt. No center-vs-periphery distinction, no vignette, no hard FOV edges. True 360° presence-based perception.'
  },
  {
    id: 'kenshiTelekineticSenseComplete',
    name: 'Complete Telekinetic Sense (Kenshi)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Kenshi Takahashi\'s telekinetic perception from Mortal Kombat. Features: dark void base (no ambient light), soul/life-force glow on living beings (cool blue-white/cyan with heartbeat pulsing - powerful fighters brighter), faint inert matter outlines in deep blue/violet (mass/density only), intent/threat flares in hot white/amber (precognitive combat awareness), 360° omnidirectional spatial awareness (no FOV limits), spirit realm bleed-through (ghostly wisps visible), Sento sword resonance (warm amber/gold pulsing), telekinetic force streams (visible energy arcs), and hard range falloff at psychic limit. No surface detail, no texture, no color, no facial features - only mass, energy, motion, and life force. Pure energy topology.'
  }
];
