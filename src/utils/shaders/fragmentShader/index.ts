/**
 * Fragment shader for color blindness and vision condition simulation
 * This barrel re-exports all shader parts and provides the combined shader.
 */

import { UNIFORM_DECLARATIONS } from './uniformDeclarations';
import { COLOR_BLINDNESS_FUNCTIONS } from './colorBlindnessFunctions';
import { RETINAL_FUNCTIONS } from './retinalFunctions';
import { DIPLOPIA_FUNCTIONS } from './diplopiaFunctions';
import { UTILITY_FUNCTIONS } from './utilityFunctions';
import { GLAUCOMA_FUNCTION } from './glaucomaFunction';
import { MILTON_FUNCTIONS } from './miltonFunctions';
import { GALILEO_FUNCTIONS } from './galileoFunctions';
import { MAIN_FUNCTION } from './mainFunction';

export {
  UNIFORM_DECLARATIONS,
  COLOR_BLINDNESS_FUNCTIONS,
  RETINAL_FUNCTIONS,
  DIPLOPIA_FUNCTIONS,
  UTILITY_FUNCTIONS,
  GLAUCOMA_FUNCTION,
  MILTON_FUNCTIONS,
  GALILEO_FUNCTIONS,
  MAIN_FUNCTION,
};

/**
 * Combines all shader parts into the complete fragment shader
 */
export function getFragmentShader(): string {
  return `
    ${UNIFORM_DECLARATIONS}
    ${COLOR_BLINDNESS_FUNCTIONS}
    ${RETINAL_FUNCTIONS}
    ${DIPLOPIA_FUNCTIONS}
    ${UTILITY_FUNCTIONS}
    ${GLAUCOMA_FUNCTION}
    ${MILTON_FUNCTIONS}
    ${GALILEO_FUNCTIONS}
    ${MAIN_FUNCTION}
  `;
}
