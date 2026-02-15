import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { findOverlayContainer, ensureRelativePositioning } from './sharedOverlayUtils';

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

    const container = findOverlayContainer();

    if (container) {
      container.appendChild(overlayElement);
    } else {
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
    }

    ensureRelativePositioning(container);
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
  
  // Use provided container or try to find one
  let container: Element | null = targetContainer || findOverlayContainer();
  
  // If container is provided and has a child with position: relative, use that child instead
  // This handles the case where simulationContainerRef is the outer div but we need the inner div
  if (container && container instanceof HTMLElement) {
    // Look for a direct child div with position: relative
    // Check both computed style and inline style
    const children = Array.from(container.children);
    for (const child of children) {
      if (child instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(child);
        const inlinePosition = child.style.position;
        // Check if position is relative (either computed or inline)
        if (computedStyle.position === 'relative' || inlinePosition === 'relative') {
          container = child;
          break;
        }
        // Also check if it contains an iframe or img (likely the media container)
        if (child.querySelector('iframe, img')) {
          container = child;
          break;
        }
      }
    }
  }
  
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = id;
    const baseZIndex = getOverlayZIndex(conditionId || '', Z_INDEX.BASE);
    // Ensure retinitis pigmentosa and other visual field overlays have high enough z-index
    // to appear above YouTube iframes and other content
    const finalZIndex = conditionId === 'retinitisPigmentosa' 
      ? Math.max(parseInt(baseZIndex), Z_INDEX.VISUAL_FIELD_LOSS).toString()
      : baseZIndex;
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: finalZIndex
    });
    
    if (container) {
      container.appendChild(overlayElement);
    } else {
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
    }
  } else {
    // If overlay already exists, check if it's in the correct container
    // If not, move it to the correct container
    if (container && overlayElement.parentElement !== container) {
      overlayElement.remove();
      container.appendChild(overlayElement);
    }
    // Update z-index to ensure it's high enough
    if (conditionId === 'retinitisPigmentosa') {
      overlayElement.style.zIndex = Z_INDEX.VISUAL_FIELD_LOSS.toString();
    }
  }
  
  ensureRelativePositioning(container);

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

