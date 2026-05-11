import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Visual effects for Jose Cid's monocular vision condition
 *
 * Condition: Left eye anophthalmic (prosthetic) - complete vision loss
 * Right eye: Normal/corrected vision
 *
 * Functional impacts:
 * - Field of view reduced from ~200 to ~150
 * - Left peripheral field (~30-50) lost
 * - No stereoscopic depth perception
 * - Slightly reduced contrast sensitivity
 */

export const joseCidMonocularVision: VisualEffect = effect('joseCidMonocularVision', 'Jose Cid - Monocular Vision', 'Left eye anophthalmic/prosthetic with complete vision loss. Left peripheral field eliminated, central and right vision intact.');

export const joseCidEffects: VisualEffect[] = [
  joseCidMonocularVision
];
