import { ConditionCategory } from './types';
import { visualFieldCategory } from './visualFieldConditions';
import { colorVisionCategory } from './colorVisionConditions';
import { eyeConditionsCategory } from './eyeConditions';
import { retinalConditionsCategory } from './retinalConditions';
import { neurologicalConditionsCategory } from './neurologicalConditions';
import { traumaInfectionConditionsCategory } from './traumaInfectionConditions';

export type { ConditionCategory };

export const conditionCategories: ConditionCategory[] = [
  visualFieldCategory,
  colorVisionCategory,
  eyeConditionsCategory,
  retinalConditionsCategory,
  neurologicalConditionsCategory,
  traumaInfectionConditionsCategory
];
