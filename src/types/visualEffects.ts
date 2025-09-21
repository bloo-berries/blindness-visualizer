/**
 * Type definitions for visual effects
 * Centralized to avoid circular dependencies
 */

export type ConditionType = 
  | 'protanopia' 
  | 'deuteranopia' 
  | 'tritanopia' 
  | 'protanomaly' 
  | 'deuteranomaly' 
  | 'tritanomaly' 
  | 'hemianopiaLeft'
  | 'hemianopiaRight'
  | 'quadrantanopiaLeft'
  | 'quadrantanopiaRight'
  | 'quadrantanopiaInferior'
  | 'quadrantanopiaSuperior'
  | 'blindnessLeftEye'
  | 'blindnessRightEye'
  | 'bitemporalHemianopia'
  | 'scotoma'
  | 'visualAura'
  | 'visualAuraLeft'
  | 'visualAuraRight'
  | 'visualFloaters'
  | 'visualSnow'
  | 'tunnelVision'
  | 'aura'
  | 'glaucoma'
  | 'amd'
  | 'diabeticRetinopathy'
  | 'astigmatism'
  | 'retinitisPigmentosa'
  | 'stargardt'
  | 'nearSighted'
  | 'farSighted'
  | 'monochromacy'
  | 'monochromatic'
  | 'cataracts'
  | 'hallucinations'
  | 'diplopiaMonocular'
  | 'diplopiaBinocular'
  | 'miltonGlaucomaHalos'
  | 'miltonProgressiveVignetting'
  | 'miltonScotomas'
  | 'miltonRetinalDetachment'
  | 'miltonPhotophobia'
  | 'miltonTemporalFieldLoss'
  | 'miltonProgressiveBlindness'
  | 'completeBlindness'
  | 'galileoAcuteHalos'
  | 'galileoSevereBlurring'
  | 'galileoRedEyeEffect'
  | 'galileoExtremePhotophobia'
  | 'galileoCornealHaziness'
  | 'galileoSectoralDefects'
  | 'galileoArcuateScotomas'
  | 'galileoSwissCheeseVision'
  | 'galileoAcuteAttackMode'
  | 'galileoChronicProgression';

export interface VisualEffect {
  id: ConditionType;
  name: string;
  enabled: boolean;
  intensity: number;
  description: string;
}

export type InputSource = 
  | { type: 'webcam' }
  | { type: 'image'; url: string }
  | { type: 'youtube' };
