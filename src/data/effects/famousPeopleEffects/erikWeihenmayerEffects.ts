import { VisualEffect } from '../../../types/visualEffects';

/**
 * Erik Weihenmayer - Retinoschisis
 */
export const erikWeihenmayerEffects: VisualEffect[] = [
  {
    id: 'erikRetinoschisisIslands',
    name: 'Retinoschisis Islands (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Random, irregular "islands" of vision scattered across the visual field with sharp boundaries. Each island has independent clarity, color saturation, and brightness. Represents the unique fragmenting pattern of retinoschisis where vision breaks into disconnected pieces rather than gradual loss.'
  },
  {
    id: 'erikIslandFragmentation',
    name: 'Island Fragmentation (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive fragmentation where islands become smaller, more scattered, and less clear over time. Simulates the "lights being turned off in different rooms" effect that Erik described, with sharp edges between seeing and blind areas.'
  },
  {
    id: 'erikProgressiveLoss',
    name: 'Progressive Island Loss (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the progression from multiple islands to fewer islands to complete blindness. Shows how Erik\'s vision deteriorated from scattered fragments to complete darkness by age 13, with each island disappearing independently.'
  },
  {
    id: 'erikCompleteBlindness',
    name: 'Complete Blindness (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete vision loss with no light perception - total darkness. Represents Erik\'s current state since age 13, where all islands have disappeared and he relies entirely on spatial/tactile navigation, echolocation, and mental mapping.'
  },
  {
    id: 'erikScanningBehavior',
    name: 'Scanning Behavior (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the constant head and eye scanning required to find remaining islands of vision. User must actively search to locate scattered fragments, representing the cognitive effort of assembling partial visual information.'
  },
  {
    id: 'erikCognitiveLoad',
    name: 'Cognitive Load (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Represents the mental effort required to piece together information from scattered islands. Shows how incomplete visual data creates cognitive burden and requires constant mental mapping to understand spatial relationships.'
  }
];
