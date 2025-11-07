import { ConditionType } from '../../types/visualEffects';

/**
 * Condition categories for organizing effects in the control panel
 */
export const conditionCategories: Record<string, ConditionType[]> = {
  "Visual Field Loss": ['blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight', 'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior', 'scotoma', 'tunnelVision'],
  "Color Vision": ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy', 'monochromatic'],
  "Eye Conditions": ['cataracts', 'glaucoma', 'keratoconus', 'dryEye', 'vitreousHemorrhage', 'posteriorSubcapsularCataract'],
  "Refractive Errors": ['astigmatism', 'nearSighted', 'farSighted', 'presbyopia'],
  "Retinal Disorders": ['amd', 'diabeticRetinopathy', 'retinitisPigmentosa', 'stargardt', 'retinalDetachment'],
  "Visual Disturbances": ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'visualSnow', 'visualFloaters', 'hallucinations', 'blueFieldPhenomena', 'glare', 'blurryVision', 'nightBlindness', 'halos', 'persistentPositiveVisualPhenomenon', 'palinopsia', 'trails', 'lossOfContrast', 'starbursting'],
  "Double Vision": ['diplopiaMonocular', 'diplopiaBinocular']
};

