import { OverlayConfig } from './overlayConfig';

/**
 * Erik Weihenmayer - Retinoschisis
 */
export const erikWeihenmayerOverlays: OverlayConfig[] = [
  // Retinoschisis Islands (3 overlays)
  {
    effectId: 'erikRetinoschisisIslands',
    overlayId: 'visual-field-overlay-erikIsland1',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(15% 10%, 35% 8%, 40% 25%, 25% 30%, 10% 20%)',
  },
  {
    effectId: 'erikRetinoschisisIslands',
    overlayId: 'visual-field-overlay-erikIsland2',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(65% 40%, 85% 35%, 90% 55%, 75% 65%, 60% 50%)',
  },
  {
    effectId: 'erikRetinoschisisIslands',
    overlayId: 'visual-field-overlay-erikIsland3',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(20% 70%, 45% 65%, 50% 85%, 30% 90%, 15% 80%)',
  },
  // Island Fragmentation (3 overlays)
  {
    effectId: 'erikIslandFragmentation',
    overlayId: 'visual-field-overlay-erikFragment1',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(70% 15%, 80% 12%, 85% 25%, 75% 28%, 65% 20%)',
  },
  {
    effectId: 'erikIslandFragmentation',
    overlayId: 'visual-field-overlay-erikFragment2',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(45% 45%, 55% 42%, 60% 55%, 50% 58%, 40% 50%)',
  },
  {
    effectId: 'erikIslandFragmentation',
    overlayId: 'visual-field-overlay-erikFragment3',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(75% 75%, 90% 70%, 95% 85%, 80% 88%, 70% 80%)',
  },
  // Progressive Loss (2 overlays)
  {
    effectId: 'erikProgressiveLoss',
    overlayId: 'visual-field-overlay-erikProgressive1',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(40% 20%, 60% 18%, 65% 35%, 45% 38%, 35% 25%)',
  },
  {
    effectId: 'erikProgressiveLoss',
    overlayId: 'visual-field-overlay-erikProgressive2',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(35% 60%, 55% 58%, 60% 75%, 40% 78%, 30% 65%)',
  },
  // Complete Blindness
  {
    effectId: 'erikCompleteBlindness',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
  },
  // Scanning Behavior
  {
    effectId: 'erikScanningBehavior',
    background: i => `rgba(0,0,0,${i * 0.1})`,
    blendMode: 'multiply',
  },
  // Cognitive Load
  {
    effectId: 'erikCognitiveLoad',
    background: i => `rgba(0,0,0,${i * 0.05})`,
    blendMode: 'multiply',
  },
];
