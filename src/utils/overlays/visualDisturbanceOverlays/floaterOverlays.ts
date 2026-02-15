import { VisualEffect } from '../../../types/visualEffects';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../../overlayConstants';
import { ensureRelativePositioning } from '../sharedOverlayUtils';
import { ContainerFinder } from './types';

/**
 * Creates the visual floaters overlay
 * Realistic implementation with varied morphologies and movement
 */
export function createFloaterOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Create or get the main container overlay
  let overlayElement = document.getElementById('visual-field-overlay-visualFloaters');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualFloaters';

    const targetContainer = findContainer();

    if (targetContainer) {
      targetContainer.appendChild(overlayElement);
    } else {
      document.body.appendChild(overlayElement);
    }

    ensureRelativePositioning(targetContainer);
  }

  Object.assign(overlayElement.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: getOverlayZIndex('visualFloaters', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  // Generate visible black floaters matching the preview panel implementation
  const opacity = 0.6 + intensity * 0.3;

  // Create main floater layer - using pure black for visibility against any background
  let floaterLayer = document.getElementById('visual-floaters-main-layer');
  if (!floaterLayer) {
    floaterLayer = document.createElement('div');
    floaterLayer.id = 'visual-floaters-main-layer';
    overlayElement.appendChild(floaterLayer);
  }

  // Fixed positions for consistent, visible floaters (pixel-based sizes work better)
  const floaterPatterns = [
    `radial-gradient(ellipse 60px 25px at 25% 30%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 50px 20px at 70% 40%, rgba(0,0,0,${opacity * 0.9}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 30px at 50% 65%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 45px 18px at 60% 25%, rgba(0,0,0,${opacity * 0.8}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 35px 15px at 35% 75%, rgba(0,0,0,${opacity * 0.75}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 20px at 80% 55%, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 55px 22px at 15% 50%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 25px at 85% 30%, rgba(0,0,0,${opacity * 0.65}) 0%, rgba(0,0,0,0) 70%)`
  ];

  Object.assign(floaterLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: floaterPatterns.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    // Slow drifting movement simulating floaters lagging behind eye movement
    animation: 'floaterDrift 8s ease-in-out infinite alternate'
  });

  // Add second layer with offset timing for depth effect
  let floaterLayer2 = document.getElementById('visual-floaters-depth-layer');
  if (!floaterLayer2) {
    floaterLayer2 = document.createElement('div');
    floaterLayer2.id = 'visual-floaters-depth-layer';
    overlayElement.appendChild(floaterLayer2);
  }

  // Second layer of floaters at different positions for depth
  const depthPatterns = [
    `radial-gradient(ellipse 40px 18px at 40% 20%, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(circle 22px at 65% 70%, rgba(0,0,0,${opacity * 0.65}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 48px 20px at 20% 60%, rgba(0,0,0,${opacity * 0.75}) 0%, rgba(0,0,0,0) 70%)`,
    `radial-gradient(ellipse 32px 14px at 75% 45%, rgba(0,0,0,${opacity * 0.6}) 0%, rgba(0,0,0,0) 70%)`
  ];

  Object.assign(floaterLayer2.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: depthPatterns.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    // Different timing creates parallax depth effect
    animation: 'floaterDrift 12s ease-in-out infinite alternate-reverse'
  });

  // Inject CSS animation if not already present
  if (!document.getElementById('floater-animations')) {
    const style = document.createElement('style');
    style.id = 'floater-animations';
    style.textContent = `
      @keyframes floaterDrift {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-2px, 3px); }
        50% { transform: translate(1px, -2px); }
        75% { transform: translate(3px, 1px); }
        100% { transform: translate(-1px, -3px); }
      }
    `;
    document.head.appendChild(style);
  }

  overlayElement.style.opacity = '1';
}
