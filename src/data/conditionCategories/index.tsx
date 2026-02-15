import { ConditionCategory, PUBLIC_URL } from './types';
import { visualFieldCategory } from './visualFieldConditions';
import { colorVisionCategory } from './colorVisionConditions';
import { eyeConditionsCategory } from './eyeConditions';
import { retinalConditionsCategory } from './retinalConditions';
import { neurologicalConditionsCategory } from './neurologicalConditions';
import { traumaInfectionConditionsCategory } from './traumaInfectionConditions';

export type { ConditionCategory };
export { PUBLIC_URL };
export { visualFieldCategory };
export { colorVisionCategory };
export { eyeConditionsCategory };
export { retinalConditionsCategory };
export { neurologicalConditionsCategory };
export { traumaInfectionConditionsCategory };

export const conditionCategories: ConditionCategory[] = [
  visualFieldCategory,
  colorVisionCategory,
  eyeConditionsCategory,
  retinalConditionsCategory,
  neurologicalConditionsCategory,
  traumaInfectionConditionsCategory
];
