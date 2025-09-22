/**
 * Shared utilities for overlay creation and management
 * Centralized to avoid duplication across components
 */

import { OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';

/**
 * Creates a simple overlay element with consistent styling
 * @param id - The ID for the overlay element
 * @param container - The container element to append to
 * @param additionalStyles - Additional styles to apply
 * @returns The created overlay element
 */
export const createSimpleOverlay = (
  id: string,
  container: HTMLElement,
  additionalStyles: React.CSSProperties = {}
): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = id;
  
  Object.assign(overlay.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: Z_INDEX.ANIMATED.toString(),
    ...additionalStyles
  });
  
  container.appendChild(overlay);
  return overlay;
};

/**
 * Finds the appropriate container for overlays
 * @returns The container element or null if not found
 */
export const findOverlayContainer = (): HTMLElement | null => {
  const selectors = [
    '.visualizer-container',
    '[class*="visualizer"]',
    '[style*="position: relative"]'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      return element;
    }
  }
  
  return null;
};
