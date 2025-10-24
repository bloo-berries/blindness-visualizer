import { ConditionType } from '../types/visualEffects';
import { getColorVisionMatrix } from './colorVisionFilters';

/**
 * Updates SVG filter definitions dynamically based on intensity
 * This allows the severity slider to work with SVG filters
 */
export const updateSVGFilters = (effects: Array<{id: ConditionType, intensity: number, enabled: boolean}>) => {
  const colorVisionEffects = effects.filter(e => 
    ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id) && e.enabled
  );

  if (colorVisionEffects.length === 0) {
    // Reset all filters to default values
    resetSVGFilters();
    return;
  }

  // For now, use the first enabled color vision effect
  // TODO: Support multiple color vision effects
  const effect = colorVisionEffects[0];
  
  console.log('SVG Filter Manager: Processing effect:', effect.id, 'intensity:', effect.intensity);
  
  // Get the full matrix for this effect (without intensity scaling)
  const fullMatrix = getColorVisionMatrix(effect.id, 1.0);
  console.log('SVG Filter Manager: Full matrix:', fullMatrix);
  
  // Identity matrix for normal vision
  const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  
  // Blend between identity and full matrix based on intensity
  const blendedMatrix = fullMatrix.map((val, index) => 
    val * effect.intensity + identityMatrix[index] * (1 - effect.intensity)
  );
  
  console.log('SVG Filter Manager: Blended matrix:', blendedMatrix);
  
  // Update the corresponding SVG filter
  updateSVGFilter(effect.id, blendedMatrix);
};

/**
 * Updates a specific SVG filter with a new matrix
 */
const updateSVGFilter = (conditionId: ConditionType, matrix: number[]) => {
  const filterId = getFilterId(conditionId);
  console.log('SVG Filter Manager: Looking for filter with ID:', filterId);
  
  const filterElement = document.getElementById(filterId);
  
  if (!filterElement) {
    console.log('SVG Filter Manager: Filter element not found for ID:', filterId);
    return;
  }

  console.log('SVG Filter Manager: Found filter element:', filterElement);

  // Find the feColorMatrix element within the filter
  const feColorMatrix = filterElement.querySelector('feColorMatrix');
  if (!feColorMatrix) {
    console.log('SVG Filter Manager: feColorMatrix element not found');
    return;
  }

  console.log('SVG Filter Manager: Found feColorMatrix element:', feColorMatrix);

  // Convert matrix to CSS matrix format
  const cssMatrix = [
    matrix[0], matrix[1], matrix[2], 0, 0,
    matrix[3], matrix[4], matrix[5], 0, 0,
    matrix[6], matrix[7], matrix[8], 0, 0,
    0, 0, 0, 1, 0
  ];

  const matrixString = cssMatrix.join(', ');
  console.log('SVG Filter Manager: Setting matrix values:', matrixString);

  // Update the filter values
  feColorMatrix.setAttribute('values', matrixString);
  
  console.log('SVG Filter Manager: Matrix values set successfully');

};

/**
 * Resets all SVG filters to their default values
 */
const resetSVGFilters = () => {
  const defaultMatrices: Record<string, number[]> = {
    'protanopia': [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
    'deuteranopia': [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
    'tritanopia': [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
    'protanomaly': [0.817, 0.183, 0, 0, 0, 0.333, 0.667, 0, 0, 0, 0, 0.125, 0.875, 0, 0, 0, 0, 0, 1, 0],
    'deuteranomaly': [0.8, 0.2, 0, 0, 0, 0.258, 0.742, 0, 0, 0, 0, 0.142, 0.858, 0, 0, 0, 0, 0, 1, 0],
    'tritanomaly': [0.950, 0.050, 0, 0, 0, 0, 0.700, 0.300, 0, 0, 0, 0.300, 0.700, 0, 0, 0, 0, 0, 1, 0],
    'monochromacy': [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0]
  };

  Object.entries(defaultMatrices).forEach(([conditionId, matrix]) => {
    const filterId = getFilterId(conditionId as ConditionType);
    const filterElement = document.getElementById(filterId);
    
    if (filterElement) {
      const feColorMatrix = filterElement.querySelector('feColorMatrix');
      if (feColorMatrix) {
        feColorMatrix.setAttribute('values', matrix.join(', '));
      }
    }
  });
};

/**
 * Gets the SVG filter ID for a condition
 */
const getFilterId = (conditionId: ConditionType): string => {
  const filterMap: Partial<Record<ConditionType, string>> = {
    'protanopia': 'protanopia',
    'deuteranopia': 'deuteranopia',
    'tritanopia': 'tritanopia',
    'protanomaly': 'protanomaly',
    'deuteranomaly': 'deuteranomaly',
    'tritanomaly': 'tritanomaly',
    'monochromacy': 'monochromacy',
    'monochromatic': 'monochromacy'
  };
  
  return filterMap[conditionId] || conditionId;
};
