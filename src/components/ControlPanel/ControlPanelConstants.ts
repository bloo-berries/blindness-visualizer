import { ConditionType } from '../../types/visualEffects';

/**
 * Configuration for conditions that have left/right orientation options.
 * These conditions will be displayed as a single item with an orientation toggle.
 */
export interface OrientationGroup {
  displayName: string;
  description: string;
  leftCondition: ConditionType;
  rightCondition: ConditionType;
}

export const orientationGroups: Record<string, OrientationGroup> = {
  'hemianopia': {
    displayName: 'Homonymous Hemianopia',
    description: 'Loss of half of the visual field in both eyes. Caused by damage to one side of the brain\'s visual pathways. May cause difficulty seeing objects to one side and problems with navigation.',
    leftCondition: 'hemianopiaLeft',
    rightCondition: 'hemianopiaRight'
  },
  'quadrantanopiaInferior': {
    displayName: 'Homonymous Inferior Quadrantanopia',
    description: 'Loss of vision in the lower quadrant of visual field in both eyes. Caused by damage to the superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.',
    leftCondition: 'quadrantanopiaInferiorLeft',
    rightCondition: 'quadrantanopiaInferiorRight'
  },
  'quadrantanopiaSuperior': {
    displayName: 'Homonymous Superior Quadrantanopia',
    description: 'Loss of vision in the upper quadrant of visual field in both eyes. Caused by damage to the inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.',
    leftCondition: 'quadrantanopiaSuperiorLeft',
    rightCondition: 'quadrantanopiaSuperiorRight'
  }
};

// Get all orientation group condition IDs for filtering
export const orientationGroupConditions: ConditionType[] = Object.values(orientationGroups)
  .flatMap(group => [group.leftCondition, group.rightCondition]);

/**
 * Condition categories for organizing effects in the control panel
 */
export const conditionCategories: Record<string, ConditionType[]> = {
  "Visual Field Loss": ['blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight', 'quadrantanopiaInferiorLeft', 'quadrantanopiaInferiorRight', 'quadrantanopiaSuperiorLeft', 'quadrantanopiaSuperiorRight', 'bitemporalHemianopia', 'quadrantanopiaRight', 'scotoma', 'tunnelVision'],
  "Color Vision": ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy', 'monochromatic'],
  "Eye Conditions": ['cataracts', 'glaucoma', 'keratoconus', 'dryEye', 'vitreousHemorrhage', 'posteriorSubcapsularCataract'],
  "Refractive Errors": ['astigmatism', 'nearSighted', 'farSighted', 'presbyopia'],
  "Retinal Disorders": ['amd', 'diabeticRetinopathy', 'retinitisPigmentosa', 'stargardt', 'retinalDetachment'],
  "Visual Disturbances": ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'visualSnow', 'visualFloaters', 'hallucinations', 'blueFieldPhenomena', 'glare', 'blurryVision', 'nightBlindness', 'halos', 'persistentPositiveVisualPhenomenon', 'palinopsia', 'trails', 'lossOfContrast', 'starbursting'],
  "Double Vision": ['diplopiaMonocular', 'diplopiaBinocular']
};

