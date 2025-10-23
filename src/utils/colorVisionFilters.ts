import { ConditionType } from '../types/visualEffects';

/**
 * Accurate Color Vision Deficiency Simulation
 * 
 * This module provides scientifically accurate color vision deficiency simulation
 * using Machado 2009 transformation matrices and proper CSS filter implementations.
 * 
 * Based on established color science algorithms for realistic CVD simulation.
 */

// Machado 2009 transformation matrices for dichromatic conditions
// These are the scientifically accurate matrices for color vision deficiency simulation
export const ColorVisionMatrices = {
  // Protanopia (red-blind) - affects 1.0-1.3% of males, 0.02% of females
  // Complete absence of L-cones (long-wavelength sensitive)
  protanopia: [
    0.567, 0.433, 0.000,
    0.558, 0.442, 0.000,
    0.000, 0.242, 0.758
  ],
  
  // Deuteranopia (green-blind) - affects 1-1.2% of males, <0.01% of females
  // Complete absence of M-cones (medium-wavelength sensitive)
  deuteranopia: [
    0.625, 0.375, 0.000,
    0.700, 0.300, 0.000,
    0.000, 0.300, 0.700
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
export const AnomalyMatrices = {
  // Protanomaly severity matrices (0.0 = normal, 1.0 = protanopia)
  protanomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.800, 0.200, 0.000, 0.100, 0.900, 0.000, 0.000, 0.000, 1.000],
    0.6: [0.600, 0.400, 0.000, 0.200, 0.800, 0.000, 0.000, 0.000, 1.000],
    1.0: [0.567, 0.433, 0.000, 0.558, 0.442, 0.000, 0.000, 0.242, 0.758]
  },
  
  // Deuteranomaly severity matrices (0.0 = normal, 1.0 = deuteranopia)
  deuteranomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.800, 0.200, 0.000, 0.200, 0.800, 0.000, 0.000, 0.000, 1.000],
    0.6: [0.700, 0.300, 0.000, 0.300, 0.700, 0.000, 0.000, 0.000, 1.000],
    1.0: [0.625, 0.375, 0.000, 0.700, 0.300, 0.000, 0.000, 0.300, 0.700]
  },
  
  // Tritanomaly severity matrices (0.0 = normal, 1.0 = tritanopia)
  tritanomaly: {
    0.0: [1.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 1.000],
    0.3: [0.900, 0.100, 0.000, 0.000, 0.800, 0.200, 0.000, 0.200, 0.800],
    0.6: [0.950, 0.050, 0.000, 0.000, 0.600, 0.400, 0.000, 0.400, 0.600],
    1.0: [0.950, 0.050, 0.000, 0.000, 0.433, 0.567, 0.000, 0.475, 0.525]
  }
};

// Achromatopsia matrix (complete color blindness)
export const AchromatopsiaMatrix = [
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722
];

/**
 * Converts sRGB to linear RGB color space
 */
export const srgbToLinear = (rgb: number[]): number[] => {
  return rgb.map(c => {
    const normalized = c / 255;
    return normalized <= 0.04045 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
};

/**
 * Converts linear RGB to sRGB color space
 */
export const linearToSrgb = (rgb: number[]): number[] => {
  return rgb.map(c => {
    const srgb = c <= 0.0031308 
      ? c * 12.92 
      : 1.055 * Math.pow(c, 1/2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(srgb * 255)));
  });
};

/**
 * Applies a color matrix transformation
 */
export const applyColorMatrix = (rgb: number[], matrix: number[]): number[] => {
  const [r, g, b] = rgb;
  
  // Apply 3x3 matrix transformation
  const newR = r * matrix[0] + g * matrix[1] + b * matrix[2];
  const newG = r * matrix[3] + g * matrix[4] + b * matrix[5];
  const newB = r * matrix[6] + g * matrix[7] + b * matrix[8];
  
  return [newR, newG, newB];
};

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
  
  // For dichromatic conditions, blend with identity matrix based on severity
  if (['protanopia', 'deuteranopia', 'tritanopia'].includes(type)) {
    const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    return fullMatrix.map((val, index) => 
      val * severity + identityMatrix[index] * (1 - severity)
    );
  }
  
  return fullMatrix;
};

/**
 * Converts a color matrix to CSS filter values
 * Matrix should be in row-major order: [r1, r2, r3, g1, g2, g3, b1, b2, b3]
 */
export const matrixToCSSFilter = (matrix: number[]): string => {
  // CSS matrix format: matrix(r1, r2, r3, 0, 0, g1, g2, g3, 0, 0, b1, b2, b3, 0, 0, 0, 0, 0, 1, 0)
  // The matrix should be in the format: [r1, r2, r3, g1, g2, g3, b1, b2, b3]
  const cssMatrix = [
    matrix[0], matrix[1], matrix[2], 0, 0,
    matrix[3], matrix[4], matrix[5], 0, 0,
    matrix[6], matrix[7], matrix[8], 0, 0,
    0, 0, 0, 1, 0
  ];
  return `matrix(${cssMatrix.join(', ')})`;
};

/**
 * Generates CSS filter for color vision deficiency simulation
 */
export const getColorVisionFilter = (type: ConditionType, intensity: number = 1.0): string => {
  // For achromatopsia, use a simpler approach with saturate and contrast
  if (type === 'monochromatic' || type === 'monochromacy') {
    return `saturate(0) contrast(${100 + intensity * 20}%)`;
  }
  
  // Get the full matrix for the condition
  const fullMatrix = getColorVisionMatrix(type, 1.0);
  
  // Identity matrix for blending
  const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  
  // Blend between identity and full matrix based on intensity
  const blendedMatrix = fullMatrix.map((val, index) => 
    val * intensity + identityMatrix[index] * (1 - intensity)
  );
  
  // For other conditions, use the matrix transformation
  return matrixToCSSFilter(blendedMatrix);
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
