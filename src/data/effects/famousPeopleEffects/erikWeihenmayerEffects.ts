import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Erik Weihenmayer - Retinoschisis
 */
export const erikWeihenmayerEffects: VisualEffect[] = [
  effect('erikRetinoschisisIslands', 'Retinoschisis Islands (Erik Weihenmayer)', 'Random, irregular "islands" of vision scattered across the visual field with sharp boundaries. Each island has independent clarity, color saturation, and brightness. Represents the unique fragmenting pattern of retinoschisis where vision breaks into disconnected pieces rather than gradual loss.'),
  effect('erikIslandFragmentation', 'Island Fragmentation (Erik Weihenmayer)', 'Progressive fragmentation where islands become smaller, more scattered, and less clear over time. Simulates the "lights being turned off in different rooms" effect that Erik described, with sharp edges between seeing and blind areas.'),
  effect('erikProgressiveLoss', 'Progressive Island Loss (Erik Weihenmayer)', 'Simulates the progression from multiple islands to fewer islands to complete blindness. Shows how Erik\'s vision deteriorated from scattered fragments to complete darkness by age 13, with each island disappearing independently.'),
  effect('erikCompleteBlindness', 'Complete Blindness (Erik Weihenmayer)', 'Complete vision loss with no light perception - total darkness. Represents Erik\'s current state since age 13, where all islands have disappeared and he relies entirely on spatial/tactile navigation, echolocation, and mental mapping.'),
  effect('erikScanningBehavior', 'Scanning Behavior (Erik Weihenmayer)', 'Simulates the constant head and eye scanning required to find remaining islands of vision. User must actively search to locate scattered fragments, representing the cognitive effort of assembling partial visual information.'),
  effect('erikCognitiveLoad', 'Cognitive Load (Erik Weihenmayer)', 'Represents the mental effort required to piece together information from scattered islands. Shows how incomplete visual data creates cognitive burden and requires constant mental mapping to understand spatial relationships.'),
];
