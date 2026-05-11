import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Daredevil / Matt Murdock - Radar Sense (Fictional)
 * "World on Fire" - echolocation/sonar-like perception
 * Red monochrome, edge detection, pulsing radar sweeps
 */
export const daredevilEffects: VisualEffect[] = [
  effect('daredevilRadarSweep', 'Radar Sweep (Daredevil)', 'Rotating conic gradient that simulates the "radar sweep" of Daredevil\'s 360\u00b0 awareness. The sweep rotates continuously, highlighting edges and forms as it passes over them like sonar.'),
  effect('daredevilEdgeDetection', 'Edge Detection (Daredevil)', 'High contrast rendering that emphasizes edges and contours while eliminating flat surfaces and fine detail. Only silhouettes and depth are perceived - no textures, no 2D information like text or images.'),
  effect('daredevilSoundReactive', 'Sound-Reactive Glow (Daredevil)', 'Objects producing sound render with sharper, brighter red edges that pulse with intensity. Silent or still objects appear fainter or absent entirely. Motion creates emphasis.'),
  effect('daredevilRedMonochrome', 'Red Monochrome (Daredevil)', 'The signature "World on Fire" red color scheme. All color is stripped and replaced with shades of red and dark red. The world appears as a dark red void with brighter red edges where forms are sensed.'),
  effect('daredevilRadarSenseComplete', 'Complete Radar Sense (Daredevil)', 'Complete simulation of Daredevil\'s radar sense - the "World on Fire" visualization from the Netflix series. Red/dark red monochrome color scheme with edge-detection style rendering. Rotating radar sweeps suggest 360\u00b0 awareness. Sound-producing objects glow brighter with pulsing intensity. Only contours, silhouettes, and depth are visible - no flat surfaces, textures, or fine detail. Moving objects pulse more intensely than static geometry.'),
];
