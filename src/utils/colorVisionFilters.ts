import { ConditionType } from '../types/visualEffects';

/**
 * Accurate Color Vision Deficiency Simulation
 *
 * This module provides scientifically accurate color vision deficiency simulation
 * using Machado 2009 transformation matrices and proper CSS filter implementations.
 *
 * Based on established color science algorithms for realistic CVD simulation.
 *
 * Desktop: Uses SVG feColorMatrix filters injected into the DOM for pixel-accurate
 * color transformation (Machado 2009 matrices in linearRGB space).
 *
 * Mobile: Uses inline SVG feColorMatrix via the <ColorVisionFilterSVG> component
 * rendered in the same subtree as the filtered element. This avoids the mobile
 * WebKit/Blink issue where body-injected SVG url("#id") references fail after
 * pushState navigation. The inline approach works reliably on iOS Safari 15+.
 *
 * Legacy CSS filter approximations (sepia, hue-rotate, saturate) are retained
 * in getMobileCSSFilter() but no longer used by default — they produced
 * inaccurate monochrome green/yellow tints instead of correct CVD simulation.
 */

// --- Mobile/touch device detection ---
// SVG url("#id") CSS filter references fail on touch browsers (iOS Safari,
// Android Chrome, iPadOS Safari) regardless of SVG placement or URL format.
// We detect these devices and use pure CSS filter approximations instead.
// Cache the result since the answer doesn't change during a session.
let _isMobile: boolean | null = null;

/** Reset cached mobile detection (for testing) */
export const _resetMobileDetection = (): void => { _isMobile = null; };

/**
 * Detects whether the current browser is a mobile/touch device where
 * SVG url("#id") CSS filter references do not work.
 */
export const isMobileBrowser = (): boolean => {
  if (_isMobile !== null) return _isMobile;

  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    _isMobile = false;
    return false;
  }

  // Primary pointer is coarse (finger/stylus) with no fine pointer (mouse) =
  // phone or tablet. Touch-enabled laptops have BOTH coarse + fine pointers,
  // so checking "coarse and NOT fine" avoids degrading desktop touch laptops.
  const mm = typeof matchMedia !== 'undefined';
  const primaryIsCoarse = mm && matchMedia('(pointer: coarse)').matches;
  const primaryIsFine = mm && matchMedia('(pointer: fine)').matches;
  const isTouchOnly = primaryIsCoarse && !primaryIsFine;

  // UA-based check (catches most phones + older iPads)
  const mobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);

  // iPadOS 13+ sends a desktop Mac UA but still has touch points.
  // Also require pointer:coarse to distinguish actual iPadOS from Mac
  // desktops that may report maxTouchPoints > 1 (e.g., Sidecar, external
  // touch displays, or recent macOS versions).
  const isIPadOS = /Macintosh/i.test(navigator.userAgent) &&
    navigator.maxTouchPoints > 1 &&
    primaryIsCoarse;

  _isMobile = isTouchOnly || mobileUA || isIPadOS;
  return _isMobile;
};

// --- CSS filter approximations for mobile ---
// These use combinations of sepia(), hue-rotate(), saturate(), and brightness()
// to approximate color vision deficiency effects. Less accurate than feColorMatrix
// but pure CSS — guaranteed to work on all mobile browsers.

interface CSSFilterApprox {
  /** CSS filter string at full intensity */
  filter: string;
}

const CSS_FILTER_APPROXIMATIONS: Record<string, CSSFilterApprox> = {
  // Protanopia (red-blind): world shifts to blue-yellow, reds appear dark.
  // Low sepia preserves color variety; subtle hue-rotate shifts red-green
  // confusion axis without collapsing everything to monochrome green/yellow.
  protanopia: {
    filter: 'saturate(35%) sepia(15%) hue-rotate(345deg) saturate(125%) brightness(94%) contrast(95%)',
  },

  // Deuteranopia (green-blind): similar to protanopia (blue-yellow world)
  // but reds are slightly brighter. Slightly different hue shift angle.
  deuteranopia: {
    filter: 'saturate(40%) sepia(12%) hue-rotate(350deg) saturate(120%) brightness(96%) contrast(93%)',
  },

  // Tritanopia (blue-blind): blues disappear, world appears warm/pinkish.
  // Higher saturate retention preserves the red-green distinction that
  // tritanopes still have. Slight positive hue-rotate keeps warm tones.
  tritanopia: {
    filter: 'saturate(45%) sepia(10%) hue-rotate(30deg) saturate(130%) brightness(94%) contrast(97%)',
  },

  // Anomalous trichromacy — reduced severity versions of the above.
  // Higher saturate retention since color vision is reduced, not absent.
  protanomaly: {
    filter: 'saturate(60%) sepia(8%) hue-rotate(350deg) saturate(110%) brightness(97%) contrast(97%)',
  },

  deuteranomaly: {
    filter: 'saturate(65%) sepia(6%) hue-rotate(355deg) saturate(108%) brightness(98%) contrast(96%)',
  },

  tritanomaly: {
    filter: 'saturate(65%) sepia(5%) hue-rotate(15deg) saturate(115%) brightness(97%) contrast(98%)',
  },
};

/**
 * Returns a pure CSS filter string for mobile devices, or null if the
 * condition type doesn't have a CSS approximation (e.g. monochromacy,
 * which already uses pure CSS).
 */
const getMobileCSSFilter = (type: string, intensity: number): string | null => {
  const approx = CSS_FILTER_APPROXIMATIONS[type];
  if (!approx) return null;

  // At full intensity, use the approximation directly
  if (intensity >= 1.0) return approx.filter;

  // Scale each filter function's deviation from identity proportionally.
  // Identity values: sepia(0%), hue-rotate(0deg), saturate(100%), brightness(100%).
  // Use replaceAll since saturate() may appear more than once in the chain.
  let result = approx.filter;

  result = result.replace(/sepia\((\d+)%?\)/g, (_, v) =>
    `sepia(${Math.round(parseFloat(v) * intensity)}%)`
  );
  result = result.replace(/hue-rotate\((\d+)deg\)/g, (_, v) =>
    `hue-rotate(${Math.round(parseFloat(v) * intensity)}deg)`
  );
  result = result.replace(/saturate\((\d+)%?\)/g, (_, v) => {
    const target = parseFloat(v);
    const interpolated = Math.round(100 + (target - 100) * intensity);
    return `saturate(${interpolated}%)`;
  });
  result = result.replace(/brightness\((\d+)%?\)/g, (_, v) => {
    const target = parseFloat(v);
    const interpolated = Math.round(100 + (target - 100) * intensity);
    return `brightness(${interpolated}%)`;
  });
  result = result.replace(/contrast\((\d+)%?\)/g, (_, v) => {
    const target = parseFloat(v);
    const interpolated = Math.round(100 + (target - 100) * intensity);
    return `contrast(${interpolated}%)`;
  });

  return result;
};

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

// --- DOM-injected SVG filter management ---
// Safari/WebKit does NOT support filter: url("data:image/svg+xml,...") (WebKit Bug #104169).
// Instead, we inject <filter> elements into a hidden <svg> in the document body and
// reference them via url("#cvd-{type}"), which works in ALL browsers.

const SVG_CONTAINER_ID = 'cvd-svg-filters';
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Track the currently active filter so we can clean up when switching conditions */
let currentActiveFilterId: string | null = null;

/** Creates or returns the hidden SVG container in the document body.
 *  Safari/WebKit requires:
 *  - No zero width/height SVG attributes (use CSS hiding instead)
 *  - Filters wrapped in <defs> for proper processing
 *  - SVG must not use display:none or visibility:hidden
 */
const ensureSVGContainer = (): SVGSVGElement => {
  let container = document.getElementById(SVG_CONTAINER_ID) as unknown as SVGSVGElement;
  if (!container) {
    container = document.createElementNS(SVG_NS, 'svg');
    container.setAttribute('id', SVG_CONTAINER_ID);
    // IMPORTANT: Do NOT set width="0" height="0" as SVG attributes — Safari
    // ignores filter definitions inside zero-sized SVG viewports.
    // Instead, use CSS to visually hide the container while keeping it active.
    container.style.position = 'absolute';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.overflow = 'hidden';
    container.style.clip = 'rect(0, 0, 0, 0)';
    container.style.clipPath = 'inset(50%)';
    container.style.whiteSpace = 'nowrap';
    container.style.pointerEvents = 'none';

    // Wrap filters in <defs> — the proper SVG way, required by Safari/WebKit
    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.setAttribute('id', `${SVG_CONTAINER_ID}-defs`);
    container.appendChild(defs);

    document.body.appendChild(container);
  }
  return container;
};

/** Creates or updates a <filter> element inside the SVG container's <defs> */
const injectDOMFilter = (filterId: string, cssMatrix: string): void => {
  const container = ensureSVGContainer();
  const defs = container.querySelector('defs') || container;
  let filterEl = document.getElementById(filterId) as unknown as SVGFilterElement;

  if (!filterEl) {
    filterEl = document.createElementNS(SVG_NS, 'filter') as unknown as SVGFilterElement;
    filterEl.setAttribute('id', filterId);
    filterEl.setAttribute('color-interpolation-filters', 'linearRGB');
    const feColorMatrix = document.createElementNS(SVG_NS, 'feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('values', cssMatrix);
    filterEl.appendChild(feColorMatrix);
    defs.appendChild(filterEl);
  } else {
    // Update existing filter's matrix values
    const feColorMatrix = filterEl.querySelector('feColorMatrix');
    if (feColorMatrix) {
      feColorMatrix.setAttribute('values', cssMatrix);
    }
  }
};

/** Removes a specific filter element from the DOM */
const removeDOMFilter = (filterId: string): void => {
  const filterEl = document.getElementById(filterId);
  if (filterEl) {
    filterEl.remove();
  }
};

/** Removes the entire SVG filter container from the DOM */
export const cleanupAllDOMFilters = (): void => {
  const container = document.getElementById(SVG_CONTAINER_ID);
  if (container) {
    container.remove();
  }
  currentActiveFilterId = null;
};

/**
 * Injects a DOM filter and returns a CSS url() reference to it.
 * Cleans up the previous filter if switching conditions.
 */
const applyDOMFilter = (type: string, matrix: number[]): string => {
  const filterId = `cvd-${type}`;

  // Clean up old filter if switching conditions
  if (currentActiveFilterId && currentActiveFilterId !== filterId) {
    removeDOMFilter(currentActiveFilterId);
  }

  // Convert 3x3 matrix to 5x4 feColorMatrix format (add zero bias columns + alpha row)
  const cssMatrix = [
    matrix[0], matrix[1], matrix[2], 0, 0,
    matrix[3], matrix[4], matrix[5], 0, 0,
    matrix[6], matrix[7], matrix[8], 0, 0,
    0, 0, 0, 1, 0
  ].join(' ');

  injectDOMFilter(filterId, cssMatrix);
  currentActiveFilterId = filterId;

  // Use absolute URL for the SVG filter reference. Mobile browsers (iOS Safari,
  // Android WebView) fail to resolve bare `url("#id")` when the page URL has
  // been changed via pushState (React Router), because WebKit resolves the
  // fragment relative to the current URL path rather than the document root.
  const baseUrl = window.location.href.split('#')[0];
  return `url("${baseUrl}#${filterId}")`;
};

/**
 * Generates CSS filter for color vision deficiency simulation.
 *
 * Desktop: Injects SVG <filter> elements into the DOM and returns url("#id")
 * references for pixel-accurate Machado 2009 simulation.
 *
 * Mobile: Returns pure CSS filter function approximations (sepia, hue-rotate,
 * saturate, brightness) because SVG url("#id") references do not work on
 * mobile WebKit/Blink regardless of SVG placement or URL format.
 */
export const getColorVisionFilter = (type: ConditionType, intensity: number = 1.0): string => {

  // For achromatopsia, use a simpler approach with saturate and contrast
  // (works on both desktop and mobile — pure CSS)
  if (type === 'monochromatic' || type === 'monochromacy') {
    // At 0% intensity, show normal color vision (no filter)
    if (intensity === 0) {
      return '';
    }
    // Clean up any active DOM filter when switching to monochromacy
    if (currentActiveFilterId) {
      removeDOMFilter(currentActiveFilterId);
      currentActiveFilterId = null;
    }
    // Gradually increase desaturation and contrast as intensity increases
    const filter = `saturate(${100 - intensity * 100}%) contrast(${100 + intensity * 20}%)`;
    return filter;
  }

  // For all other color vision conditions, ensure 0% intensity shows normal vision
  if (intensity === 0) {
    // Clean up any active DOM filter
    if (currentActiveFilterId) {
      removeDOMFilter(currentActiveFilterId);
      currentActiveFilterId = null;
    }
    return '';
  }

  // Mobile: use pure CSS filter approximations (SVG url() doesn't work)
  if (isMobileBrowser()) {
    // Clean up any lingering DOM filter
    if (currentActiveFilterId) {
      removeDOMFilter(currentActiveFilterId);
      currentActiveFilterId = null;
    }
    const cssFilter = getMobileCSSFilter(type, intensity);
    if (cssFilter) return cssFilter;
    // Fall through to SVG if no CSS approximation (shouldn't happen)
  }

  // Desktop: use SVG feColorMatrix for accurate simulation
  // Get the full matrix for this condition
  const fullMatrix = getColorVisionMatrix(type, 1.0);

  // Identity matrix for normal vision
  const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  // Blend between identity and full matrix based on intensity
  const blendedMatrix = fullMatrix.map((val, index) =>
    val * intensity + identityMatrix[index] * (1 - intensity)
  );

  return applyDOMFilter(type, blendedMatrix);
};

/**
 * Pure data function: returns filter ID and matrix values for a color vision
 * condition WITHOUT any DOM side effects. Used by React components to render
 * inline SVG filter definitions (required for mobile WebKit compatibility).
 */
export interface ColorVisionFilterData {
  filterId: string;
  matrixValues: string;
}

export const getColorVisionFilterData = (
  type: ConditionType,
  intensity: number = 1.0
): ColorVisionFilterData | null => {
  // Monochromacy uses pure CSS filters, no SVG needed
  if (type === 'monochromatic' || type === 'monochromacy') return null;
  if (intensity === 0) return null;

  const fullMatrix = getColorVisionMatrix(type, 1.0);
  const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const blended = fullMatrix.map((val, i) =>
    val * intensity + identityMatrix[i] * (1 - intensity)
  );

  const filterId = `cvd-${type}`;
  const matrixValues = [
    blended[0], blended[1], blended[2], 0, 0,
    blended[3], blended[4], blended[5], 0, 0,
    blended[6], blended[7], blended[8], 0, 0,
    0, 0, 0, 1, 0
  ].join(' ');

  return { filterId, matrixValues };
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
