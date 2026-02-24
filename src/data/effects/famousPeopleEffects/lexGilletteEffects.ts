import { VisualEffect } from '../../../types/visualEffects';

/**
 * Lex Gillette - Recurrent Retinal Detachments (ROP → Multiple Detachments → Total Blindness)
 * Cyclical pattern: hope → loss → hope → loss → final darkness
 * Right eye only (left always blind from ROP), cycles of detachment and surgical restoration
 */
export const lexGilletteEffects: VisualEffect[] = [
  {
    id: 'lexMonocularVision',
    name: 'Monocular Vision (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Single-eye vision from right eye only. Left eye blind from birth (ROP). Creates slight depth perception loss with the left visual field showing complete blackness. The "normal" Lex knew before the first detachment.'
  },
  {
    id: 'lexFirstDetachment',
    name: 'First Detachment (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'First retinal detachment symptoms in the right eye at age 8. Floaters drifting across vision, peripheral flashes like distant lightning, and a dark shadow beginning to creep from the upper edge - covering 15-20% of remaining vision.'
  },
  {
    id: 'lexPostSurgeryRestoration',
    name: 'Post-Surgery Restoration (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'After surgical reattachment - vision returns but not quite the same. Clearer center with peripheral scotomas where laser scarring occurred. A fragile restoration, better but imperfect, with hope tinged by uncertainty.'
  },
  {
    id: 'lexRedetachment',
    name: 'Re-Detachment (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'The retina detaches again despite surgery. Larger shadow now covering 30-40% of vision, more floaters, the curtain advancing faster this time. The familiar terror returning - "not again."'
  },
  {
    id: 'lexCumulativeDamage',
    name: 'Cumulative Damage (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Multiple cycles of detachment and repair leave cumulative damage. Clear zone shrinking to a small central island (50-70% occluded), permanent floater clouds, surgical scars creating blind patches. Each "fix" leaves the retina weaker.'
  },
  {
    id: 'lexDailyFading',
    name: 'Daily Fading (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'The final stage - "a little less each morning." No dramatic event, just gradual dimming day by day. The central island shrinking, edges going dark, until one morning there\'s nothing left. The quiet ending of a long fight.'
  },
  {
    id: 'lexRecurrentDetachmentCycle',
    name: 'Complete Recurrent Detachment Cycle (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete cyclical simulation of Lex Gillette\'s recurrent retinal detachments. Use intensity slider to experience: 0-15% (monocular normal), 16-30% (first detachment), 31-45% (post-surgery restoration), 46-60% (re-detachment), 61-80% (cumulative damage), 81-100% (daily fading to total blindness). NOT straight progression but oscillating hope and loss.'
  }
];
