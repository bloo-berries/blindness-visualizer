/**
 * DOM-injected SVG filter management
 *
 * Safari/WebKit does NOT support filter: url("data:image/svg+xml,...") (WebKit Bug #104169).
 * Instead, we inject <filter> elements into a hidden <svg> in the document body and
 * reference them via url("#cvd-{type}"), which works in ALL browsers.
 */

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
export const removeDOMFilter = (filterId: string): void => {
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

/** Returns the currently active filter ID (for use by other modules) */
export const getCurrentActiveFilterId = (): string | null => currentActiveFilterId;

/** Sets the currently active filter ID (for use by other modules) */
export const setCurrentActiveFilterId = (id: string | null): void => {
  currentActiveFilterId = id;
};

/**
 * Injects a DOM filter and returns a CSS url() reference to it.
 * Cleans up the previous filter if switching conditions.
 */
export const applyDOMFilter = (type: string, matrix: number[]): string => {
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
