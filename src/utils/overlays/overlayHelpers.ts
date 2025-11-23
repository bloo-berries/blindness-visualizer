import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { CONTAINER_SELECTORS } from '../appConstants';

/**
 * Creates a visual field overlay element with specified styles
 */
export const createOverlay = (
  id: string, 
  backgroundStyle: string, 
  blendMode: string, 
  opacity: string,
  filter?: string,
  clipPath?: string,
  conditionId?: string
): void => {
  let overlayElement = document.getElementById(id);
  
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = id;
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex(conditionId || '', Z_INDEX.BASE)
    });
    
    // Try multiple selectors to find the container
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
    
    if (container) {
      container.appendChild(overlayElement);
    } else {
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
    }
    
    // Force the container to have relative positioning if it doesn't
    if (container && container instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
      }
    }
  }
  
  Object.assign(overlayElement.style, {
    background: backgroundStyle,
    mixBlendMode: blendMode,
    opacity,
    ...(filter && { filter }),
    ...(clipPath && { clipPath })
  });
};

/**
 * Creates an overlay with a specific container
 */
export const createOverlayWithContainer = (
  id: string, 
  backgroundStyle: string, 
  blendMode: string, 
  opacity: string,
  filter?: string,
  clipPath?: string,
  conditionId?: string,
  targetContainer?: HTMLElement
): void => {
  let overlayElement = document.getElementById(id);
  
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = id;
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex(conditionId || '', Z_INDEX.BASE)
    });
    
    // Use provided container or try to find one
    let container: Element | null = targetContainer || null;
    
    if (!container) {
      // Try multiple selectors to find the container
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
    }
    
    if (container) {
      container.appendChild(overlayElement);
    } else {
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
    }
  }

  // Apply styles
  overlayElement.style.background = backgroundStyle;
  overlayElement.style.mixBlendMode = blendMode;
  overlayElement.style.opacity = opacity;
  
  if (filter) {
    overlayElement.style.filter = filter;
  }
  
  if (clipPath) {
    overlayElement.style.clipPath = clipPath;
  }
};

