import { VisualEffect } from '../../../types/visualEffects';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../../overlayConstants';
import { ensureRelativePositioning } from '../sharedOverlayUtils';
import { ContainerFinder } from './types';

/**
 * Creates the main visual snow overlay
 * Persistent static throughout entire visual field
 */
export function createVisualSnowOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Create or get the main container overlay
  let overlayElement = document.getElementById('visual-field-overlay-visualSnow');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualSnow';

    const targetContainer = findContainer();

    if (targetContainer) {
      targetContainer.appendChild(overlayElement);
    } else {
      document.body.appendChild(overlayElement);
    }

    ensureRelativePositioning(targetContainer);
  }

  // Apply base styles
  Object.assign(overlayElement.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: getOverlayZIndex('visualSnow', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  // Layer 1: Dense static dots - the core "TV static" / "snow globe" effect
  let staticDotsLayer = document.getElementById('visual-snow-static-dots');
  if (!staticDotsLayer) {
    staticDotsLayer = document.createElement('div');
    staticDotsLayer.id = 'visual-snow-static-dots';
    overlayElement.appendChild(staticDotsLayer);
  }

  const staticDots: string[] = [];
  const numStaticDots = Math.floor(80 + intensity * 120);

  for (let i = 0; i < numStaticDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 1 + (i % 3);
    const isBlack = i % 2 === 0;
    const baseOpacity = (0.4 + (i % 5) * 0.1) * intensity;

    if (isBlack) {
      staticDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      staticDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(staticDotsLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: staticDots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 6s ease-in-out infinite alternate'
  });

  // Layer 2: Secondary dots at different positions for asynchronous movement
  let staticDotsLayer2 = document.getElementById('visual-snow-static-dots-2');
  if (!staticDotsLayer2) {
    staticDotsLayer2 = document.createElement('div');
    staticDotsLayer2.id = 'visual-snow-static-dots-2';
    overlayElement.appendChild(staticDotsLayer2);
  }

  const staticDots2: string[] = [];
  const numStaticDots2 = Math.floor(50 + intensity * 80);

  for (let i = 0; i < numStaticDots2; i++) {
    const x = (i * 23.1 + 7) % 100;
    const y = (i * 19.3 + 11) % 100;
    const size = 1 + (i % 2);
    const isBlack = (i + 1) % 2 === 0;
    const baseOpacity = (0.35 + (i % 4) * 0.08) * intensity;

    if (isBlack) {
      staticDots2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      staticDots2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(staticDotsLayer2.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: staticDots2.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 9s ease-in-out infinite alternate-reverse'
  });

  // Layer 3: Blue field entoptic phenomenon
  let blueFieldLayer = document.getElementById('visual-snow-blue-field');
  if (!blueFieldLayer) {
    blueFieldLayer = document.createElement('div');
    blueFieldLayer.id = 'visual-snow-blue-field';
    overlayElement.appendChild(blueFieldLayer);
  }

  const blueFieldDots: string[] = [];
  const numBlueFieldDots = Math.floor(8 + intensity * 12);

  for (let i = 0; i < numBlueFieldDots; i++) {
    const x = (i * 29.3 + 5) % 100;
    const y = (i * 37.1 + 15) % 100;
    const size = 2 + (i % 2);
    const brightness = 0.6 + (i % 3) * 0.15;

    blueFieldDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${brightness * intensity}) 0%, rgba(200,230,255,${brightness * intensity * 0.5}) 50%, transparent 100%)`);
  }

  Object.assign(blueFieldLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: blueFieldDots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'blueFieldShoot 4s linear infinite'
  });

  // Layer 4: Photopsia - occasional spontaneous light flashes
  let photopsiaLayer = document.getElementById('visual-snow-photopsia');
  if (!photopsiaLayer) {
    photopsiaLayer = document.createElement('div');
    photopsiaLayer.id = 'visual-snow-photopsia';
    overlayElement.appendChild(photopsiaLayer);
  }

  const flashSpots: string[] = [];
  const numFlashes = Math.floor(3 + intensity * 5);

  for (let i = 0; i < numFlashes; i++) {
    const x = (i * 31.7 + 20) % 80 + 10;
    const y = (i * 41.3 + 15) % 70 + 15;
    const size = 8 + (i % 3) * 4;
    const flashOpacity = (0.15 + (i % 2) * 0.1) * intensity;

    flashSpots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,240,${flashOpacity}) 0%, rgba(255,255,200,${flashOpacity * 0.3}) 50%, transparent 100%)`);
  }

  Object.assign(photopsiaLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: flashSpots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'photopsiaFlash 5s ease-in-out infinite'
  });

  // Layer 5: Slight contrast reduction
  let contrastLayer = document.getElementById('visual-snow-contrast');
  if (!contrastLayer) {
    contrastLayer = document.createElement('div');
    contrastLayer.id = 'visual-snow-contrast';
    overlayElement.appendChild(contrastLayer);
  }

  Object.assign(contrastLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: `rgba(128,128,128,${0.05 + intensity * 0.1})`,
    mixBlendMode: 'overlay',
    pointerEvents: 'none'
  });

  // Inject CSS animations
  if (!document.getElementById('visual-snow-animations')) {
    const style = document.createElement('style');
    style.id = 'visual-snow-animations';
    style.textContent = `
      @keyframes blueFieldShoot {
        0% { transform: translate(0, 0); }
        25% { transform: translate(3px, -2px); }
        50% { transform: translate(-2px, 3px); }
        75% { transform: translate(2px, 1px); }
        100% { transform: translate(0, 0); }
      }
      @keyframes photopsiaFlash {
        0%, 100% { opacity: 0.3; }
        15% { opacity: 1; }
        30% { opacity: 0.2; }
        50% { opacity: 0.8; }
        70% { opacity: 0.1; }
        85% { opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }

  overlayElement.style.opacity = '1';
}

/**
 * Creates the flashing visual snow overlay
 */
export function createVisualSnowFlashingOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  let overlayElement = document.getElementById('visual-field-overlay-visualSnowFlashing');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualSnowFlashing';

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
    zIndex: getOverlayZIndex('visualSnowFlashing', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  let flashingDotsLayer = document.getElementById('visual-snow-flashing-dots');
  if (!flashingDotsLayer) {
    flashingDotsLayer = document.createElement('div');
    flashingDotsLayer.id = 'visual-snow-flashing-dots';
    overlayElement.appendChild(flashingDotsLayer);
  }

  const flashingDots: string[] = [];
  const numDots = Math.floor(100 + intensity * 150);

  for (let i = 0; i < numDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 1 + (i % 3);
    const isBlack = i % 2 === 0;
    const baseOpacity = (0.5 + (i % 4) * 0.1) * intensity;

    if (isBlack) {
      flashingDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      flashingDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(flashingDotsLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: flashingDots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowFlicker 0.15s steps(2) infinite'
  });

  if (!document.getElementById('visual-snow-flashing-animations')) {
    const style = document.createElement('style');
    style.id = 'visual-snow-flashing-animations';
    style.textContent = `
      @keyframes visualSnowFlicker {
        0%, 49% { opacity: 1; transform: translate(0, 0); }
        50%, 100% { opacity: 0.7; transform: translate(1px, -1px); }
      }
    `;
    document.head.appendChild(style);
  }

  overlayElement.style.opacity = '1';
}

/**
 * Creates the colored visual snow overlay
 */
export function createVisualSnowColoredOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  let overlayElement = document.getElementById('visual-field-overlay-visualSnowColored');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualSnowColored';

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
    zIndex: getOverlayZIndex('visualSnowColored', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  let coloredDotsLayer = document.getElementById('visual-snow-colored-dots');
  if (!coloredDotsLayer) {
    coloredDotsLayer = document.createElement('div');
    coloredDotsLayer.id = 'visual-snow-colored-dots';
    overlayElement.appendChild(coloredDotsLayer);
  }

  const coloredDots: string[] = [];
  const numDots = Math.floor(80 + intensity * 120);
  const colors = [
    'rgba(255,100,100',
    'rgba(100,255,100',
    'rgba(100,100,255',
    'rgba(100,255,255',
    'rgba(255,100,255',
    'rgba(255,255,100',
    'rgba(255,150,50',
    'rgba(150,100,255'
  ];

  for (let i = 0; i < numDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 1 + (i % 3);
    const color = colors[i % colors.length];
    const baseOpacity = (0.4 + (i % 5) * 0.1) * intensity;

    coloredDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${baseOpacity}) 0%, transparent 100%)`);
  }

  for (let i = 0; i < numDots / 2; i++) {
    const x = (i * 23.1 + 7) % 100;
    const y = (i * 19.3 + 11) % 100;
    const size = 1 + (i % 2);
    const color = colors[(i + 3) % colors.length];
    const baseOpacity = (0.35 + (i % 4) * 0.08) * intensity;

    coloredDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${baseOpacity}) 0%, transparent 100%)`);
  }

  Object.assign(coloredDotsLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: coloredDots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 6s ease-in-out infinite alternate'
  });

  overlayElement.style.opacity = '1';
}

/**
 * Creates the transparent visual snow overlay
 */
export function createVisualSnowTransparentOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  let overlayElement = document.getElementById('visual-field-overlay-visualSnowTransparent');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualSnowTransparent';

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
    zIndex: getOverlayZIndex('visualSnowTransparent', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  let transparentDotsLayer = document.getElementById('visual-snow-transparent-dots');
  if (!transparentDotsLayer) {
    transparentDotsLayer = document.createElement('div');
    transparentDotsLayer.id = 'visual-snow-transparent-dots';
    overlayElement.appendChild(transparentDotsLayer);
  }

  const transparentDots: string[] = [];
  const numDots = Math.floor(100 + intensity * 150);

  for (let i = 0; i < numDots; i++) {
    const x = (i * 13.7 + (i * i * 0.3)) % 100;
    const y = (i * 17.3 + (i * 0.7)) % 100;
    const size = 2 + (i % 4);
    const baseOpacity = (0.15 + (i % 5) * 0.05) * intensity;

    if (i % 2 === 0) {
      transparentDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      transparentDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(transparentDotsLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: transparentDots.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 8s ease-in-out infinite alternate'
  });

  let glassLayer = document.getElementById('visual-snow-transparent-glass');
  if (!glassLayer) {
    glassLayer = document.createElement('div');
    glassLayer.id = 'visual-snow-transparent-glass';
    overlayElement.appendChild(glassLayer);
  }

  Object.assign(glassLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: `rgba(200,200,200,${0.03 + intensity * 0.05})`,
    mixBlendMode: 'overlay',
    pointerEvents: 'none'
  });

  overlayElement.style.opacity = '1';
}

/**
 * Creates the dense visual snow overlay
 */
export function createVisualSnowDenseOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  let overlayElement = document.getElementById('visual-field-overlay-visualSnowDense');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualSnowDense';

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
    zIndex: getOverlayZIndex('visualSnowDense', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  // First dense layer
  let denseDotsLayer1 = document.getElementById('visual-snow-dense-dots-1');
  if (!denseDotsLayer1) {
    denseDotsLayer1 = document.createElement('div');
    denseDotsLayer1.id = 'visual-snow-dense-dots-1';
    overlayElement.appendChild(denseDotsLayer1);
  }

  const denseDots1: string[] = [];
  const numDots1 = Math.floor(150 + intensity * 200);

  for (let i = 0; i < numDots1; i++) {
    const x = (i * 11.3 + (i * i * 0.2)) % 100;
    const y = (i * 13.7 + (i * 0.5)) % 100;
    const size = 2 + (i % 4);
    const isBlack = i % 2 === 0;
    const baseOpacity = (0.5 + (i % 4) * 0.12) * intensity;

    if (isBlack) {
      denseDots1.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      denseDots1.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(denseDotsLayer1.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: denseDots1.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 5s ease-in-out infinite alternate'
  });

  // Second dense layer
  let denseDotsLayer2 = document.getElementById('visual-snow-dense-dots-2');
  if (!denseDotsLayer2) {
    denseDotsLayer2 = document.createElement('div');
    denseDotsLayer2.id = 'visual-snow-dense-dots-2';
    overlayElement.appendChild(denseDotsLayer2);
  }

  const denseDots2: string[] = [];
  const numDots2 = Math.floor(120 + intensity * 180);

  for (let i = 0; i < numDots2; i++) {
    const x = (i * 17.1 + 5) % 100;
    const y = (i * 21.3 + 9) % 100;
    const size = 2 + (i % 3);
    const isBlack = (i + 1) % 2 === 0;
    const baseOpacity = (0.45 + (i % 5) * 0.1) * intensity;

    if (isBlack) {
      denseDots2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      denseDots2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(denseDotsLayer2.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: denseDots2.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 7s ease-in-out infinite alternate-reverse'
  });

  // Third layer for maximum density
  let denseDotsLayer3 = document.getElementById('visual-snow-dense-dots-3');
  if (!denseDotsLayer3) {
    denseDotsLayer3 = document.createElement('div');
    denseDotsLayer3.id = 'visual-snow-dense-dots-3';
    overlayElement.appendChild(denseDotsLayer3);
  }

  const denseDots3: string[] = [];
  const numDots3 = Math.floor(80 + intensity * 120);

  for (let i = 0; i < numDots3; i++) {
    const x = (i * 23.7 + 13) % 100;
    const y = (i * 19.1 + 17) % 100;
    const size = 3 + (i % 3);
    const isBlack = i % 2 === 0;
    const baseOpacity = (0.4 + (i % 4) * 0.1) * intensity;

    if (isBlack) {
      denseDots3.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
    } else {
      denseDots3.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
    }
  }

  Object.assign(denseDotsLayer3.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: denseDots3.join(', '),
    opacity: '1',
    pointerEvents: 'none',
    animation: 'visualSnowDrift 9s ease-in-out infinite alternate'
  });

  // Contrast reduction layer
  let denseContrastLayer = document.getElementById('visual-snow-dense-contrast');
  if (!denseContrastLayer) {
    denseContrastLayer = document.createElement('div');
    denseContrastLayer.id = 'visual-snow-dense-contrast';
    overlayElement.appendChild(denseContrastLayer);
  }

  Object.assign(denseContrastLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: `rgba(128,128,128,${0.1 + intensity * 0.15})`,
    mixBlendMode: 'overlay',
    pointerEvents: 'none'
  });

  overlayElement.style.opacity = '1';
}
