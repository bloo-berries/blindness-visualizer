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
export const ColorVisionMatrices = {
  // Protanopia (red-blind) - affects 1.0-1.3% of males, 0.02% of females
  // Complete absence of L-cones (long-wavelength sensitive)
  protanopia: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998
  ],
  
  // Deuteranopia (green-blind) - affects 1-1.2% of males, <0.01% of females
  // Complete absence of M-cones (medium-wavelength sensitive)
  deuteranopia: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.011820, 0.042940, 0.968881
  ],
  
  // Tritanopia (blue-blind) - affects <0.01% of population
  // Complete absence of S-cones (short-wavelength sensitive)
  tritanopia: [
    1.255528, -0.076749, -0.178779,
    -0.078411, 0.930809, 0.147602,
    0.004733, 0.691367, 0.303900
  ]
};

// Severity-based matrices for anomalous trichromacy
export const AnomalyMatrices = {
  // Protanomaly severity matrices (0.0 = normal, 1.0 = protanopia)
  protanomaly: {
    0.0: [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000],
    0.1: [0.856167, 0.182038, -0.038205, 0.029342, 0.955115, 0.015544, -0.002880, -0.001563, 1.004443],
    0.3: [0.630323, 0.465641, -0.095964, 0.069181, 0.890046, 0.040773, -0.006308, -0.007724, 1.014032],
    0.5: [0.458064, 0.679578, -0.137642, 0.092785, 0.846313, 0.060902, -0.007494, -0.016807, 1.024301],
    0.7: [0.319627, 0.849633, -0.169261, 0.106241, 0.815969, 0.077790, -0.007025, -0.028051, 1.035076],
    0.9: [0.203876, 0.990338, -0.194214, 0.112975, 0.794542, 0.092483, -0.005222, -0.041043, 1.046265],
    1.0: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998]
  },
  
  // Deuteranomaly severity matrices (0.0 = normal, 1.0 = deuteranopia)
  deuteranomaly: {
    0.0: [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000],
    0.1: [0.866435, 0.177704, -0.044139, 0.049567, 0.939063, 0.011370, -0.003453, 0.007233, 0.996220],
    0.3: [0.600760, 0.556340, -0.157100, 0.111150, 0.814340, 0.074510, -0.004410, 0.019550, 0.984860],
    0.5: [0.439409, 0.748285, -0.187694, 0.160427, 0.738130, 0.101443, -0.006572, 0.032510, 0.974062],
    0.7: [0.318286, 0.880704, -0.198990, 0.209492, 0.676132, 0.114376, -0.007442, 0.044320, 0.963122],
    0.9: [0.222751, 0.974060, -0.196811, 0.255367, 0.618361, 0.126272, -0.007456, 0.055447, 0.952009],
    1.0: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881]
  },
  
  // Tritanomaly severity matrices (0.0 = normal, 1.0 = tritanopia)
  tritanomaly: {
    0.0: [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000],
    0.1: [0.926670, 0.092514, -0.019184, 0.021191, 0.964503, 0.014306, 0.008437, 0.054813, 0.936750],
    0.3: [0.895720, 0.133330, -0.029050, 0.029997, 0.945400, 0.024603, 0.013027, 0.104707, 0.882266],
    0.5: [0.905871, 0.127791, -0.033662, -0.002480, 0.931805, 0.070675, 0.013856, 0.196616, 0.789528],
    0.7: [0.948035, 0.089490, -0.037525, -0.007986, 0.931756, 0.076230, 0.015643, 0.269786, 0.714571],
    0.9: [1.017277, 0.027029, -0.044306, -0.006113, 0.958479, 0.047634, 0.006379, 0.248708, 0.744913],
    1.0: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900]
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
