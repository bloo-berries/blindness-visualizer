import { VisualEffect } from '../../../types/visualEffects';

/**
 * Blindspot (Samuel Baines) - Sonar-Based Echolocation Vision
 */
export const blindspotEffects: VisualEffect[] = [
  {
    id: 'blindspotSonarSenseComplete',
    name: 'Complete Sonar Sense (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Blindspot\'s sonar-based echolocation vision. The technology emits sound waves that bounce off surfaces, returning depth and shape data. Features: monochrome blue-green palette (submarine sonar aesthetic), depth-mapped brightness (near = bright, far = dim), edge-dominant rendering (geometry only, no surface detail), radial ping sweeps like a radar display, ripple wavefronts from active pinging, and hard perceptual boundary beyond sonar range (~20-30m). Sound-shadow zones appear behind solid objects. Hard surfaces (metal, glass) are bright; soft surfaces (fabric, flesh) are dim or absent.'
  },
  {
    id: 'blindspotDepthMapping',
    name: 'Depth Mapping (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Depth-mapped brightness visualization. Near objects appear bright and sharp, while distant objects fade to dim and fuzzy. Hard falloff beyond ~15-20m range. No color information - only distance data converted to brightness.'
  },
  {
    id: 'blindspotEdgeDetection',
    name: 'Edge Detection (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Strong edge detection rendering. Only 3D contours and depth register - flat textures, text, color, and fine detail are invisible. Fill areas between edges with flat, low-detail shading. Hard surfaces (metal, walls, glass) render bright and crisp; soft materials (clothing, plants) render faint or nearly absent.'
  },
  {
    id: 'blindspotPingSweep',
    name: 'Ping Sweep (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Radial ping sweep rotating outward from center, like a radar display. Sonar isn\'t continuous - it pings and refreshes at ~2-4 Hz, creating a subtle strobe or sweep quality. Ripple wavefronts emanate from the emitter point, suggesting the wave nature of perception.'
  },
  {
    id: 'blindspotSoundShadow',
    name: 'Sound Shadow (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Sound-shadow occlusion zones. Objects behind other objects are invisible (sonar is line-of-"ping"). Soft/absorptive materials (fabric, carpet, foam) reflect poorly and appear as dark voids. The world has harsh perceptual boundaries - anything beyond sonar range is pure void.'
  },
  {
    id: 'blindspotSonarResolution',
    name: 'Sonar Resolution (Blindspot)',
    enabled: false,
    intensity: 1.0,
    description: 'Resolution tied to frequency. Mid-range compromise - enough to navigate rooms and detect people, not enough to read or recognize faces. Moving objects between pings produce ghosting/trailing artifacts as position updates discretely, not continuously.'
  }
];
