/**
 * Mobile/touch device detection and CSS filter approximations
 *
 * SVG url("#id") CSS filter references fail on touch browsers (iOS Safari,
 * Android Chrome, iPadOS Safari) regardless of SVG placement or URL format.
 * We detect these devices and use pure CSS filter approximations instead.
 */

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
export const getMobileCSSFilter = (type: string, intensity: number): string | null => {
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
