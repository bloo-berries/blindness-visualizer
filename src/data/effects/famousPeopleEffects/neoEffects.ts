/**
 * Neo (Thomas Anderson) - Matrix Code Vision
 *
 * In The Matrix Revolutions, Neo is blinded during his final confrontation
 * with Agent Smith, but gains the ability to perceive the underlying code
 * of the Matrix itself - seeing the world as cascading streams of green
 * digital characters.
 *
 * Visual Elements:
 * - Falling columns of katakana, Latin, numerals, and symbols
 * - Phosphor green glow with afterimage trails
 * - Bright "head" characters leading each stream
 * - Glitch effects (chromatic aberration, scan lines)
 * - Dark green-black background
 */

import { VisualEffect } from '../../../types/visualEffects';

export const neoEffects: VisualEffect[] = [
  {
    id: 'neoMatrixCodeVisionComplete',
    name: 'Matrix Code Vision (Neo)',
    description: 'Complete Matrix code perception - seeing the world as cascading digital rain',
    enabled: false,
    intensity: 1.0,
    animatedOverlay: true
  }
];
