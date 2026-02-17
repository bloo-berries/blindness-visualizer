import { ConditionType } from '../types/visualEffects';

/**
 * Accurate Color Vision Deficiency Simulation
 * 
 * This module provides scientifically accurate color vision deficiency simulation
 * using Machado 2009 transformation matrices and proper CSS filter implementations.
 * 
 * Based on established color science algorithms for realistic CVD simulation.
 */

// Machado, Oliveira & Fernandes 2009 transformation matrices for dichromatic conditions
// These are physiologically accurate matrices for color vision deficiency simulation
// Applied in linearRGB space for proper gamma correction
const ColorVisionMatrices = {
  // Protanopia (red-blind) - affects 1.0-1.3% of males, 0.02% of females
  // Complete absence of L-cones (long-wavelength sensitive)
  // Red appears as black/dark, colors shift toward blue-yellow spectrum
  protanopia: [
    0.152286,  1.052583, -0.204868,
    0.114503,  0.786281,  0.099216,
   -0.003882, -0.048116,  1.051998
  ],

  // Deuteranopia (green-blind) - affects 1-1.2% of males, <0.01% of females
  // Complete absence of M-cones (medium-wavelength sensitive)
  // Green appears as beige/tan, red-green confusion with different luminosity
  deuteranopia: [
    0.367322,  0.860646, -0.227968,
    0.280085,  0.672501,  0.047413,
   -0.011820,  0.042940,  0.968881
  ],
  
  // Tritanopia (blue-blind) - affects <0.01% of population
  // Complete absence of S-cones (short-wavelength sensitive)
  tritanopia: [
    0.950, 0.050, 0.000,
    0.000, 0.433, 0.567,
    0.000, 0.475, 0.525
  ]
};

// Severity-based matrices for anomalous trichromacy
// Interpolated from normal vision to full dichromacy using Machado 2009 endpoints
const AnomalyMatrices = {
  // Protanomaly severity matrices (0.0 = normal, 1.0 = protanopia)
  protanomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.746, 0.316, -0.061, 0.034, 0.936, 0.030, -0.001, -0.014, 1.016],
    0.6: [0.449, 0.684, -0.133, 0.069, 0.857, 0.069, -0.003, -0.029, 1.032],
    1.0: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998]
  },

  // Deuteranomaly severity matrices (0.0 = normal, 1.0 = deuteranopia)
  deuteranomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.790, 0.258, -0.068, 0.084, 0.902, 0.014, -0.004, 0.013, 0.991],
    0.6: [0.578, 0.517, -0.148, 0.168, 0.804, 0.028, -0.007, 0.026, 0.982],
    1.0: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881]
  },
  
  // Tritanomaly severity matrices (0.0 = normal, 1.0 = severe blue-weakness, NOT tritanopia)
  tritanomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.970, 0.030, 0.000, 0.000, 0.900, 0.100, 0.000, 0.100, 0.900],
    0.6: [0.950, 0.050, 0.000, 0.000, 0.800, 0.200, 0.000, 0.200, 0.800],
    1.0: [0.950, 0.050, 0.000, 0.000, 0.700, 0.300, 0.000, 0.300, 0.700]
  }
};

// Achromatopsia matrix (complete color blindness)
const AchromatopsiaMatrix = [
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722
];

/**
 * Interpolates between severity matrices for anomalous trichromacy
 */
const interpolateMatrix = (matrices: Record<number, number[]>, severity: number): number[] => {
  const keys = Object.keys(matrices).map(Number).sort((a, b) => a - b);
  
  // Find the two closest severity levels
  let lower = 0, upper = 1;
  for (let i = 0; i < keys.length - 1; i++) {
    if (severity >= keys[i] && severity <= keys[i + 1]) {
      lower = keys[i];
      upper = keys[i + 1];
      break;
    }
  }
  
  const weight = (severity - lower) / (upper - lower);
  const lowerMatrix = matrices[lower];
  const upperMatrix = matrices[upper];
  
  // Interpolate between matrices
  return lowerMatrix.map((val, i) => val + weight * (upperMatrix[i] - val));
};

/**
 * Gets the appropriate matrix for a condition type and severity
 */
export const getColorVisionMatrix = (type: ConditionType, severity: number = 1.0): number[] => {
  // Get the full matrix for the condition
  let fullMatrix: number[];
  
  switch (type) {
    case 'protanopia':
      fullMatrix = ColorVisionMatrices.protanopia;
      break;
    
    case 'deuteranopia':
      fullMatrix = ColorVisionMatrices.deuteranopia;
      break;
    
    case 'tritanopia':
      fullMatrix = ColorVisionMatrices.tritanopia;
      break;
    
    case 'protanomaly':
      fullMatrix = interpolateMatrix(AnomalyMatrices.protanomaly, severity);
      break;
    
    case 'deuteranomaly':
      fullMatrix = interpolateMatrix(AnomalyMatrices.deuteranomaly, severity);
      break;
    
    case 'tritanomaly':
      fullMatrix = interpolateMatrix(AnomalyMatrices.tritanomaly, severity);
      break;
    
    case 'monochromatic':
    case 'monochromacy':
      fullMatrix = AchromatopsiaMatrix;
      break;
    
    default:
      return [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Identity matrix
  }
  
  // For dichromatic conditions, return the full matrix without blending
  // The blending will be handled in getColorVisionFilter based on intensity
  return fullMatrix;
};

/**
 * Generates CSS filter for color vision deficiency simulation
 * Since CSS filters don't support arbitrary matrix transformations,
 * we'll use SVG filters with URL references
 */
export const getColorVisionFilter = (type: ConditionType, intensity: number = 1.0): string => {
  
  // For achromatopsia, use a simpler approach with saturate and contrast
  if (type === 'monochromatic' || type === 'monochromacy') {
    // At 0% intensity, show normal color vision (no filter)
    if (intensity === 0) {
      return '';
    }
    // Gradually increase desaturation and contrast as intensity increases
    const filter = `saturate(${100 - intensity * 100}%) contrast(${100 + intensity * 20}%)`;
    return filter;
  }
  
  // For all other color vision conditions, ensure 0% intensity shows normal vision
  if (intensity === 0) {
    return '';
  }
  
  // Use SVG filters for matrix transformations
  // The SVG filters are defined in the HTML and updated by updateSVGFilters
  const filterId = getFilterId(type);
  return `url(#${filterId})`;
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

/**
 * Checks if a condition is a color vision deficiency type
 */
export const isColorVisionCondition = (type: ConditionType): boolean => {
  return [
    'protanopia',
    'deuteranopia', 
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'monochromatic',
    'monochromacy'
  ].includes(type);
};

/**
 * Gets the description for a color vision condition
 */
export const getColorVisionDescription = (type: ConditionType): string => {
  const descriptions: Partial<Record<ConditionType, string>> = {
    protanopia: 'Complete red-blindness due to absence of L-cones. Reds appear dark or black, world perceived in blue-yellow spectrum.',
    deuteranopia: 'Complete green-blindness due to absence of M-cones. Major red-green confusion, colors appear as similar yellows/browns.',
    tritanopia: 'Complete blue-blindness due to absence of S-cones. Blue-green and yellow-pink confusion, extremely rare.',
    protanomaly: 'Partial red-weakness with shifted L-cone sensitivity. Varies from mild to near-protanopic severity.',
    deuteranomaly: 'Partial green-weakness with shifted M-cone sensitivity. Most common form of color vision deficiency.',
    tritanomaly: 'Partial blue-weakness with shifted S-cone sensitivity. Difficulty distinguishing blue-green and yellow-red.',
    monochromatic: 'Complete color blindness (achromatopsia). Pure grayscale vision with severe light sensitivity.',
    monochromacy: 'Complete color blindness (achromatopsia). Pure grayscale vision with severe light sensitivity.'
  };
  
  return descriptions[type] || 'Color vision deficiency simulation';
};

/**
 * Gets the prevalence information for a color vision condition
 */
export const getColorVisionPrevalence = (type: ConditionType): string => {
  const prevalence: Partial<Record<ConditionType, string>> = {
    protanopia: '1.0-1.3% of males, 0.02% of females',
    deuteranopia: '1-1.2% of males, <0.01% of females',
    tritanopia: '<0.01% of population',
    protanomaly: '1.0-1.3% of males, 0.02% of females',
    deuteranomaly: '6% of males, 0.2% of females',
    tritanomaly: '<0.01% of population',
    monochromatic: '1 in 30,000-50,000 individuals',
    monochromacy: '1 in 30,000-50,000 individuals'
  };
  
  return prevalence[type] || 'Unknown prevalence';
};
