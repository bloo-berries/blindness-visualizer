import { VisualEffect } from '../../../types/visualEffects';

/**
 * Toph Beifong - Seismic Sense / Earthbending Vision
 *
 * Toph is completely blind but "sees" through seismic sense - detecting
 * vibrations through the earth via her feet. This creates a unique
 * form of perception:
 *
 * Visual Style:
 * - Topographic wireframe / displacement map rendering
 * - Dark background with pale green/blue-white phosphor glow
 * - Like sonar, LiDAR, or ground-penetrating radar output
 *
 * Mechanics:
 * - Only surfaces touching the ground are visible
 * - Airborne objects are completely invisible
 * - Solid rock/metal = high fidelity, crisp shapes
 * - Sand = blurry, low confidence (canonical weakness)
 * - Wood/organic = dim, partial geometry
 * - Living beings pulse with heartbeat (~1-1.5 Hz)
 * - Motion creates ripple waves from foot-strike points
 * - Can "see" through walls as semi-transparent shells
 * - Refreshes on each vibration event (footsteps, impacts)
 * - Fades to black in stillness or when not touching ground
 */
export const tophBeifongEffects: VisualEffect[] = [
  {
    id: 'tophSeismicSenseComplete',
    name: 'Seismic Sense (Toph Beifong)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete seismic sense simulation. The world renders as a topographic wireframe in phosphor green - like sonar or LiDAR. Only ground-coupled surfaces are visible; airborne objects are invisible. Solid rock/metal renders crisp; sand is blurry (her canonical weakness). Living beings pulse with heartbeat rhythm. Motion creates ripple waves. "Vision" fades in stillness and refreshes with each vibration event.',
    category: 'famousPeople',
    shader: 'none',
    overlay: 'tophSeismicSense',
    cssFilter: 'tophSeismic',
    animatedOverlay: true
  },
  {
    id: 'tophWireframeVision',
    name: 'Wireframe Terrain (Toph)',
    enabled: false,
    intensity: 1.0,
    description: 'Topographic wireframe rendering - the world appears as a monochromatic height-field mesh. No color, no texture, no optical light/shadow. Dark background with geometry in pale phosphor glow.',
    category: 'famousPeople'
  },
  {
    id: 'tophVibrationRipples',
    name: 'Vibration Ripples (Toph)',
    enabled: false,
    intensity: 1.0,
    description: 'Motion ripples emanating from contact points - concentric wave distortion rings like raindrops on a still pond. Intensity scales with force of impact.',
    category: 'famousPeople'
  },
  {
    id: 'tophHeartbeatDetection',
    name: 'Heartbeat Detection (Toph)',
    enabled: false,
    intensity: 1.0,
    description: 'Living beings render with subtle pulsing amplitude modulation synced to heartbeat (~1-1.5 Hz). Toph canonically detects heart rate through vibrations.',
    category: 'famousPeople'
  },
  {
    id: 'tophSandWeakness',
    name: 'Sand Blindness (Toph)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates Toph\'s canonical weakness on sand - poor vibration transmission creates blurry, low-confidence, unreliable perception. The "image" becomes fuzzy and uncertain.',
    category: 'famousPeople'
  }
];
