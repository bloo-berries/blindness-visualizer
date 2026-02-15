import { VisualEffect } from '../../../types/visualEffects';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../../overlayConstants';
import { ensureRelativePositioning } from '../sharedOverlayUtils';
import { ContainerFinder } from './types';

/**
 * Creates the blue field entoptic phenomenon overlay
 * Scheerer's Phenomenon - tiny bright dots moving along capillary paths
 */
export function createBlueFieldOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Create or get the main container overlay
  let overlayElement = document.getElementById('visual-field-overlay-blueField');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-blueField';

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
    zIndex: getOverlayZIndex('blueFieldPhenomena', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  // Number of "sprites" scales with intensity
  const numSprites = Math.floor(8 + intensity * 12);

  // Create individual sprite elements for animation
  for (let i = 0; i < numSprites; i++) {
    const spriteId = `blue-field-sprite-${i}`;
    let sprite = document.getElementById(spriteId);

    if (!sprite) {
      sprite = document.createElement('div');
      sprite.id = spriteId;
      sprite.className = 'blue-field-sprite';
      overlayElement.appendChild(sprite);
    }

    // Randomized but deterministic path parameters
    const seed = i * 7.31;
    const pathSeed = Math.sin(seed) * 10000;

    // Start position in central area
    const centerOffset = 25;
    const startX = 50 + (Math.sin(pathSeed * 1.1) * centerOffset);
    const startY = 50 + (Math.cos(pathSeed * 1.3) * centerOffset);

    // Path length and direction
    const pathLength = 8 + Math.abs(Math.sin(pathSeed * 1.7)) * 12;
    const pathAngle = (Math.sin(pathSeed * 2.1) * 360);

    // End position
    const endX = startX + Math.cos(pathAngle * Math.PI / 180) * pathLength;
    const endY = startY + Math.sin(pathAngle * Math.PI / 180) * pathLength;

    // Control points for curved path
    const curve1X = startX + (endX - startX) * 0.3 + Math.sin(pathSeed * 2.7) * 5;
    const curve1Y = startY + (endY - startY) * 0.3 + Math.cos(pathSeed * 2.9) * 5;
    const curve2X = startX + (endX - startX) * 0.7 + Math.sin(pathSeed * 3.1) * 5;
    const curve2Y = startY + (endY - startY) * 0.7 + Math.cos(pathSeed * 3.3) * 5;

    // Animation timing
    const duration = 0.8 + Math.abs(Math.sin(pathSeed * 3.7)) * 0.6;
    const delay = (i * 0.15) % 1.2;

    // Sprite size
    const size = 3 + intensity * 2;

    // Brightness
    const brightness = 0.85 + Math.abs(Math.sin(pathSeed * 4.1)) * 0.15;

    Object.assign(sprite.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle,
        rgba(255,255,255,${brightness * intensity}) 0%,
        rgba(255,255,255,${brightness * intensity * 0.6}) 40%,
        rgba(200,220,255,${brightness * intensity * 0.3}) 70%,
        transparent 100%
      )`,
      boxShadow: `0 0 ${size}px rgba(255,255,255,${intensity * 0.5})`,
      left: `${startX}%`,
      top: `${startY}%`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      opacity: intensity.toString(),
      '--start-x': `${startX}%`,
      '--start-y': `${startY}%`,
      '--curve1-x': `${curve1X}%`,
      '--curve1-y': `${curve1Y}%`,
      '--curve2-x': `${curve2X}%`,
      '--curve2-y': `${curve2Y}%`,
      '--end-x': `${endX}%`,
      '--end-y': `${endY}%`,
      animation: `blueFieldSprite${i % 6} ${duration}s ease-in-out ${delay}s infinite`,
      willChange: 'left, top, opacity'
    } as CSSStyleDeclaration & Record<string, string>);
  }

  // Clean up extra sprites
  const existingSprites = overlayElement.querySelectorAll('.blue-field-sprite');
  existingSprites.forEach((sprite, index) => {
    if (index >= numSprites) {
      sprite.remove();
    }
  });

  // Inject blue field animations
  if (!document.getElementById('blue-field-animations')) {
    const style = document.createElement('style');
    style.id = 'blue-field-animations';

    const animations: string[] = [];
    for (let i = 0; i < 6; i++) {
      const wobble1 = Math.sin(i * 1.5) * 3;
      const wobble2 = Math.cos(i * 1.7) * 4;
      const wobble3 = Math.sin(i * 2.1) * 3;

      animations.push(`
        @keyframes blueFieldSprite${i} {
          0% {
            left: var(--start-x);
            top: var(--start-y);
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          25% {
            left: calc(var(--start-x) + (var(--curve1-x) - var(--start-x)) * 0.8 + ${wobble1}%);
            top: calc(var(--start-y) + (var(--curve1-y) - var(--start-y)) * 0.8 + ${wobble2}%);
          }
          50% {
            left: calc(var(--start-x) + (var(--end-x) - var(--start-x)) * 0.5 + ${wobble3}%);
            top: calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.5 + ${-wobble1}%);
          }
          75% {
            left: calc(var(--start-x) + (var(--curve2-x) - var(--start-x)) * 1.2 + ${wobble2}%);
            top: calc(var(--start-y) + (var(--curve2-y) - var(--start-y)) * 1.2 + ${-wobble3}%);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            left: var(--end-x);
            top: var(--end-y);
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
        }
      `);
    }

    animations.push(`
      @keyframes blueFieldPulse {
        0%, 100% { filter: brightness(1); }
        25% { filter: brightness(1.3); }
        30% { filter: brightness(1); }
        75% { filter: brightness(1.2); }
        80% { filter: brightness(1); }
      }
    `);

    style.textContent = animations.join('\n');
    document.head.appendChild(style);
  }

  overlayElement.style.animation = 'blueFieldPulse 1s ease-in-out infinite';
  overlayElement.style.opacity = '1';
}
