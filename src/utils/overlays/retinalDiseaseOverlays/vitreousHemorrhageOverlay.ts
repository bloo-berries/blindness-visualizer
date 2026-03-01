import { VisualEffect } from '../../../types/visualEffects';
import { OVERLAY_BASE_STYLES, Z_INDEX } from '../../overlayConstants';
import { findOverlayContainer, ensureRelativePositioning } from '../sharedOverlayUtils';

/**
 * Creates Vitreous Hemorrhage overlay - Blood in the vitreous humor
 * Individual randomized blob/splatter shapes with enhanced red coloring
 * Includes gravitational settling animation data
 */
export function createVitreousHemorrhageOverlay(
  effect: VisualEffect | undefined,
  container?: HTMLElement
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Generate floater positions (deterministic for consistency)
  const floaterCount = Math.max(10, Math.floor(10 + intensity * 18));
  const floaters: Array<{type: 'dot' | 'cobweb' | 'streak' | 'blob', x: number, y: number, size: number, opacity: number, angle?: number}> = [];

  for (let i = 0; i < floaterCount; i++) {
    const rand = (i * 0.618) % 1;
    let type: 'dot' | 'cobweb' | 'streak' | 'blob';
    let size: number;
    let opacity: number;
    let angle: number | undefined;

    if (rand < 0.25) {
      type = 'dot';
      size = 1.5 + (i % 4) * 0.8;
      opacity = 0.5 + (i % 5) * 0.1;
    } else if (rand < 0.5) {
      type = 'cobweb';
      size = 2 + (i % 4) * 1.2;
      opacity = 0.5 + (i % 5) * 0.1;
      angle = (i * 67) % 360;
    } else if (rand < 0.75) {
      type = 'streak';
      size = 1.5 + (i % 3) * 1.5;
      opacity = 0.5 + (i % 5) * 0.1;
      angle = (i * 89) % 360;
    } else {
      type = 'blob';
      size = 2.5 + (i % 5) * 1.5;
      opacity = 0.5 + (i % 5) * 0.1;
    }

    floaters.push({
      type,
      x: ((i * 31) % 90) + 5,
      y: ((i * 47) % 85) + 7,
      size,
      opacity: opacity * intensity,
      angle
    });
  }

  // Generate background gradients for floaters
  const floaterGradients = floaters.map(floater => {
    const baseColor = `rgba(180,20,20,${floater.opacity})`;
    const darkRed = `rgba(140,10,10,${floater.opacity * 0.9})`;

    switch (floater.type) {
      case 'dot':
        return `radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, transparent ${floater.size}%)`;
      case 'cobweb':
        const webAngle = floater.angle || 0;
        return `
          radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, transparent ${floater.size * 0.6}%),
          linear-gradient(${webAngle}deg, ${baseColor} 0%, transparent ${floater.size * 0.4}%)
        `;
      case 'streak':
        const streakAngle = floater.angle || 0;
        return `linear-gradient(${streakAngle}deg, ${darkRed} 0%, ${baseColor} ${floater.size * 0.3}%, transparent ${floater.size}%)`;
      case 'blob':
        return `radial-gradient(ellipse ${floater.size * 1.3}% ${floater.size}% at ${floater.x}% ${floater.y}%, ${baseColor} 0%, ${darkRed} ${floater.size * 0.4}%, transparent ${floater.size}%)`;
      default:
        return '';
    }
  }).filter(g => g).join(', ');

  const redTint = `rgba(180,25,25,${0.18 * intensity})`;
  const hazeGradient = `
    radial-gradient(ellipse 100% 100% at 50% 50%, rgba(160,20,20,${0.2 * intensity}) 0%, transparent 70%),
    radial-gradient(ellipse 80% 80% at 30% 40%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%),
    radial-gradient(ellipse 80% 80% at 70% 60%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%)
  `;
  const bottomAccumulation = `
    linear-gradient(to bottom, transparent 75%, rgba(150,15,15,${0.3 * intensity}) 90%, rgba(130,10,10,${0.4 * intensity}) 100%)
  `;

  const vitreousBackground = `
    ${floaterGradients},
    ${hazeGradient},
    ${bottomAccumulation},
    ${redTint}
  `.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');

  const overlayId = 'visual-field-overlay-vitreousHemorrhage';
  let overlayElement = document.getElementById(overlayId);

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = overlayId;
    overlayElement.className = 'vitreous-hemorrhage-overlay';
    overlayElement.setAttribute('data-floaters', JSON.stringify(floaters));
    overlayElement.setAttribute('data-intensity', intensity.toString());

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: (Z_INDEX.BASE + 50).toString(),
      background: vitreousBackground,
      mixBlendMode: 'multiply',
      opacity: Math.min(0.85, 0.55 + intensity * 0.3).toString(),
    });

    overlayElement.classList.add('vitreous-hemorrhage-animated');

    const targetContainer: Element | null = container || findOverlayContainer();

    if (targetContainer) {
      targetContainer.appendChild(overlayElement);
      ensureRelativePositioning(targetContainer);
    } else {
      document.body.appendChild(overlayElement);
    }
  } else {
    overlayElement.setAttribute('data-floaters', JSON.stringify(floaters));
    overlayElement.setAttribute('data-intensity', intensity.toString());
    overlayElement.style.background = vitreousBackground;
    overlayElement.style.opacity = Math.min(0.9, 0.6 + intensity * 0.3).toString();
    overlayElement.style.zIndex = (Z_INDEX.BASE + 50).toString();

    if (!overlayElement.classList.contains('vitreous-hemorrhage-animated')) {
      overlayElement.classList.add('vitreous-hemorrhage-animated');
    }

    if (!overlayElement.parentElement) {
      const targetContainer: Element | null = container || findOverlayContainer();
      if (targetContainer) {
        targetContainer.appendChild(overlayElement);
      } else {
        document.body.appendChild(overlayElement);
      }
    }
  }
}
