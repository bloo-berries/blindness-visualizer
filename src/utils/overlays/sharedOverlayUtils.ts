import { CONTAINER_SELECTORS } from '../appConstants';

/**
 * Shared utility functions for overlay generation.
 * Consolidates common patterns used across multiple overlay files.
 */

/**
 * Seeded pseudo-random number generator for deterministic patterns.
 * Given the same seed, always produces the same result.
 * Useful for consistent visual patterns that don't change on re-render.
 *
 * @param seed - The seed value
 * @returns A pseudo-random number between 0 and 1
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Finds the appropriate container element for overlay placement.
 * Searches through CONTAINER_SELECTORS in order, with special handling
 * for iframes and canvas elements (uses their parent).
 *
 * @returns The container element, or null if none found
 */
export function findOverlayContainer(): Element | null {
  let container: Element | null = null;

  for (const selector of CONTAINER_SELECTORS) {
    if (selector === 'iframe[src*="youtube"]') {
      // Special handling for iframe - get its parent
      const iframe = document.querySelector(selector);
      if (iframe) {
        container = iframe.parentElement;
        break;
      }
    } else if (selector === 'canvas') {
      // Special handling for canvas - get its parent
      const canvas = document.querySelector(selector);
      if (canvas) {
        container = canvas.parentElement;
        break;
      }
    } else {
      container = document.querySelector(selector);
      if (container) {
        break;
      }
    }
  }

  return container;
}

/**
 * Ensures a container element has relative positioning.
 * Required for absolute-positioned overlays to be positioned correctly.
 *
 * @param container - The container element to check/update
 */
export function ensureRelativePositioning(container: Element | null): void {
  if (container && container instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === 'static') {
      container.style.position = 'relative';
    }
  }
}
