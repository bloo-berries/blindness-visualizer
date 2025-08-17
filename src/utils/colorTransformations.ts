import { ConditionType } from '../types/visualEffects';

/**
 * Accurate color vision deficiency simulation using Machado 2009 matrices
 * Based on established color science algorithms for realistic CVD simulation
 */

// Machado 2009 transformation matrices for dichromatic conditions
// These matrices transform from normal RGB to the deficient color space
export const ColorMatrices = {
  // Protanopia (red-blind) - affects 1.0-1.3% of males, 0.02% of females
  protanopia: [
    0.567, 0.433, 0.000,
    0.558, 0.442, 0.000,
    0.000, 0.242, 0.758
  ],
  
  // Deuteranopia (green-blind) - affects 1-1.2% of males, <0.01% of females
  deuteranopia: [
    0.625, 0.375, 0.000,
    0.700, 0.300, 0.000,
    0.000, 0.300, 0.700
  ],
  
  // Tritanopia (blue-blind) - affects <0.01% of population
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
 * Checks if a condition requires canvas-based color transformation
 */
export const isColorTransformCondition = (type: ConditionType): boolean => {
  return [
    'protanomaly',
    'protanopia',
    'deuteranomaly',
    'deuteranopia',
    'tritanomaly',
    'tritanopia',
    'monochromatic',
    'monochromacy'
  ].includes(type);
};

/**
 * Checks if condition should show color preview
 */
export const shouldShowColorPreview = (type: ConditionType): boolean => {
  return ![
    'amd',
    'retinitisPigmentosa',
    'glaucoma',
    'stargardt',
    'visualAura',
    'visualSnow',
    'astigmatism',
    'hemianopiaLeft',
    'hemianopiaRight',
    'blindnessLeftEye',
    'blindnessRightEye',
    'bitemporalHemianopia',
    'quadrantanopiaRight',
    'quadrantanopiaInferior',
    'quadrantanopiaSuperior',
    'visualFloaters',
    'hallucinations',
    'scotoma',
    'tunnelVision',
    'nearSighted',
    'farSighted'
  ].includes(type);
};

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
 * Matrix should be a 3x3 matrix in row-major order: [r1, r2, r3, g1, g2, g3, b1, b2, b3]
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
 * Gets the appropriate matrix for a condition type and severity
 */
export const getColorMatrix = (type: ConditionType, severity: number = 1.0): number[] => {
  switch (type) {
    case 'protanopia':
      return ColorMatrices.protanopia;
    
    case 'deuteranopia':
      return ColorMatrices.deuteranopia;
    
    case 'tritanopia':
      return ColorMatrices.tritanopia;
    
    case 'protanomaly':
      return interpolateMatrix(AnomalyMatrices.protanomaly, severity);
    
    case 'deuteranomaly':
      return interpolateMatrix(AnomalyMatrices.deuteranomaly, severity);
    
    case 'tritanomaly':
      return interpolateMatrix(AnomalyMatrices.tritanomaly, severity);
    
    case 'monochromatic':
    case 'monochromacy':
      return AchromatopsiaMatrix;
    
    default:
      return [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Identity matrix
  }
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
 * Applies color transformation to a canvas context
 */
export const applyColorTransformation = (
  canvas: HTMLCanvasElement,
  conditionType: ConditionType,
  intensity: number
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const matrix = getColorMatrix(conditionType, intensity);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to linear RGB
    const linear = srgbToLinear([r, g, b]);
    
    // Apply transformation
    const transformed = applyColorMatrix(linear, matrix);
    
    // Convert back to sRGB
    const srgb = linearToSrgb(transformed);
    
    // Apply intensity blending
    data[i] = r * (1 - intensity) + srgb[0] * intensity;
    data[i + 1] = g * (1 - intensity) + srgb[1] * intensity;
    data[i + 2] = b * (1 - intensity) + srgb[2] * intensity;
    // Alpha channel remains unchanged
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Gets the layer priority for different condition types
 */
export const getLayerPriority = (type: ConditionType): number => {
  // Prioritize specific condition types to ensure proper stacking
  // Field loss conditions should be below color/details conditions
  switch (type) {
    case 'blindnessLeftEye':
    case 'blindnessRightEye':
    case 'hemianopiaLeft':
    case 'hemianopiaRight':
    case 'bitemporalHemianopia':
    case 'quadrantanopiaRight':
    case 'quadrantanopiaInferior':
    case 'quadrantanopiaSuperior':
      return 1; // Lowest layer - field loss
    
    case 'scotoma':
    case 'glaucoma':
    case 'amd':
    case 'retinitisPigmentosa':
    case 'stargardt':
    case 'tunnelVision':
      return 2; // Second layer - focal loss
    
    case 'cataracts':
    case 'diabeticRetinopathy':
      return 3; // Third layer - overall degradation
      
    case 'visualSnow':
    case 'visualFloaters':
    case 'astigmatism':
      return 4; // Fourth layer - noise and distortion
      
    case 'visualAura':
    case 'visualAuraLeft':
    case 'visualAuraRight':
      return 5; // Fifth layer - transient visual effects
      
    case 'diplopiaMonocular':
    case 'diplopiaBinocular':
      return 6; // Top layer - double vision
    
    default:
      return 3;
  }
};
