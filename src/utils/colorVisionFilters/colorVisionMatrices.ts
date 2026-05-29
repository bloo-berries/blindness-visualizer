/**
 * Machado 2009 color vision deficiency matrices and interpolation
 *
 * Provides physiologically accurate transformation matrices for color vision
 * deficiency simulation in linearRGB space.
 */

import { ConditionType } from '../../types/visualEffects';

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
