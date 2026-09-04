import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { findOverlayContainer, ensureRelativePositioning } from './sharedOverlayUtils';

/**
 * Creates a visual field overlay element with specified styles.
 *
 * When `targetContainer` is provided, the overlay is placed inside it
 * (scanning children for a position:relative or media-containing element).
 * Otherwise the overlay is appended to the standard overlay container
 * found by `findOverlayContainer()`.
 */
export const createOverlay = (
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

  // Resolve container: prefer explicit target, then auto-find
  let container: Element | null = targetContainer || findOverlayContainer();

  // If container is provided and has a child with position: relative, use that child instead
  // This handles the case where simulationContainerRef is the outer div but we need the inner div
  if (targetContainer && container && container instanceof HTMLElement) {
    const children = Array.from(container.children);
    for (const child of children) {
      if (child instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(child);
        const inlinePosition = child.style.position;
        if (computedStyle.position === 'relative' || inlinePosition === 'relative') {
          container = child;
          break;
        }
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
      document.body.appendChild(overlayElement);
    }
  } else if (targetContainer) {
    // If overlay already exists in wrong container, re-parent it
    if (container && overlayElement.parentElement !== container) {
      overlayElement.remove();
      container.appendChild(overlayElement);
    }
    if (conditionId === 'retinitisPigmentosa') {
      overlayElement.style.zIndex = Z_INDEX.VISUAL_FIELD_LOSS.toString();
    }
  }

  ensureRelativePositioning(container);

  Object.assign(overlayElement.style, {
    background: backgroundStyle,
    mixBlendMode: blendMode,
    opacity,
    ...(filter && { filter }),
    ...(clipPath && { clipPath })
  });
};

/** @deprecated Use `createOverlay` with the `targetContainer` parameter instead. */
export const createOverlayWithContainer = createOverlay;
