import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { CONTAINER_SELECTORS } from '../appConstants';
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  CBS_KEYFRAME_ANIMATIONS,
  getHallucinationsStartTime,
  resetHallucinationsStartTime
} from './cbsHallucinationPatterns';

/**
 * Creates overlays for visual disturbance conditions
 * Includes: floaters, aura, visual snow, hallucinations
 */
export const createVisualDisturbanceOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  // Helper to find container - uses passed container or falls back to selectors
  const findContainer = (): Element | null => {
    if (container) return container;

    for (const selector of CONTAINER_SELECTORS) {
      if (selector === 'iframe[src*="youtube"]') {
        const iframe = document.querySelector(selector);
        if (iframe) {
          return iframe.parentElement;
        }
      } else if (selector === 'canvas') {
        const canvas = document.querySelector(selector);
        if (canvas) {
          return canvas.parentElement;
        }
      } else {
        const element = document.querySelector(selector);
        if (element) {
          return element;
        }
      }
    }
    return null;
  };

  const visualFloaters = getEffect('visualFloaters');
  const visualAura = getEffect('visualAura');
  const visualAuraLeft = getEffect('visualAuraLeft');
  const visualAuraRight = getEffect('visualAuraRight');
  const visualSnow = getEffect('visualSnow');
  const visualSnowFlashing = getEffect('visualSnowFlashing');
  const visualSnowColored = getEffect('visualSnowColored');
  const visualSnowTransparent = getEffect('visualSnowTransparent');
  const visualSnowDense = getEffect('visualSnowDense');
  const hallucinations = getEffect('hallucinations');

  // Visual Floaters - Realistic implementation with varied morphologies and movement
  if (visualFloaters?.enabled) {
    const intensity = visualFloaters.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
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

  // Visual Snow Syndrome - persistent static throughout entire visual field
  // Based on medical descriptions: small, bilateral, diffuse, mobile, asynchronous dots
  // Two types: Pulse (dots match background) and Broadband (dots contrast with background)
  // Associated: blue field entoptic phenomenon, photopsia (light flashes), reduced contrast
  if (visualSnow?.enabled) {
    const intensity = visualSnow.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    // Apply base styles
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnow', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Layer 1: Dense static dots - the core "TV static" / "snow globe" effect
    // Mix of black and white dots for visibility against any background (broadband type)
    let staticDotsLayer = document.getElementById('visual-snow-static-dots');
    if (!staticDotsLayer) {
      staticDotsLayer = document.createElement('div');
      staticDotsLayer.id = 'visual-snow-static-dots';
      overlayElement.appendChild(staticDotsLayer);
    }

    const staticDots: string[] = [];
    const numStaticDots = Math.floor(80 + intensity * 120); // Dense coverage

    for (let i = 0; i < numStaticDots; i++) {
      // Distribute dots across entire field
      const x = (i * 13.7 + (i * i * 0.3)) % 100;
      const y = (i * 17.3 + (i * 0.7)) % 100;
      const size = 1 + (i % 3); // 1-3px dots

      // Alternate between black and white dots (broadband type - visible on any background)
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

    // Layer 3: Blue field entoptic phenomenon - tiny bright dots that shoot across vision
    // Especially noticeable against bright backgrounds (like blue sky)
    let blueFieldLayer = document.getElementById('visual-snow-blue-field');
    if (!blueFieldLayer) {
      blueFieldLayer = document.createElement('div');
      blueFieldLayer.id = 'visual-snow-blue-field';
      overlayElement.appendChild(blueFieldLayer);
    }

    const blueFieldDots: string[] = [];
    const numBlueFieldDots = Math.floor(8 + intensity * 12);

    for (let i = 0; i < numBlueFieldDots; i++) {
      // Scattered bright dots
      const x = (i * 29.3 + 5) % 100;
      const y = (i * 37.1 + 15) % 100;
      const size = 2 + (i % 2);
      const brightness = 0.6 + (i % 3) * 0.15;

      // Bright white/cyan dots characteristic of blue field entoptic phenomenon
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
      // Faster movement - these dots "shoot" across the visual field
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
      const x = (i * 31.7 + 20) % 80 + 10; // Keep away from edges
      const y = (i * 41.3 + 15) % 70 + 15;
      const size = 8 + (i % 3) * 4;
      const flashOpacity = (0.15 + (i % 2) * 0.1) * intensity;

      // Soft white/yellow flashes
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
      // Slow pulsing for flash effect
      animation: 'photopsiaFlash 5s ease-in-out infinite'
    });

    // Layer 5: Slight contrast reduction (photophobia effect)
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

    // Inject CSS animations if not already present
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

  // Visual Snow (Flashing Static) - Rapid flickering variant
  if (visualSnowFlashing?.enabled) {
    const intensity = visualSnowFlashing.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnowFlashing', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Flashing static - same dots but with rapid flicker animation
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

    // Inject flicker animation
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

  // Visual Snow (Colored Static) - Chromatic variant with colored dots
  if (visualSnowColored?.enabled) {
    const intensity = visualSnowColored.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnowColored', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Colored static - dots in various colors (red, green, blue, cyan, magenta, yellow)
    let coloredDotsLayer = document.getElementById('visual-snow-colored-dots');
    if (!coloredDotsLayer) {
      coloredDotsLayer = document.createElement('div');
      coloredDotsLayer.id = 'visual-snow-colored-dots';
      overlayElement.appendChild(coloredDotsLayer);
    }

    const coloredDots: string[] = [];
    const numDots = Math.floor(80 + intensity * 120);
    const colors = [
      'rgba(255,100,100', // Red
      'rgba(100,255,100', // Green
      'rgba(100,100,255', // Blue
      'rgba(100,255,255', // Cyan
      'rgba(255,100,255', // Magenta
      'rgba(255,255,100', // Yellow
      'rgba(255,150,50',  // Orange
      'rgba(150,100,255'  // Purple
    ];

    for (let i = 0; i < numDots; i++) {
      const x = (i * 13.7 + (i * i * 0.3)) % 100;
      const y = (i * 17.3 + (i * 0.7)) % 100;
      const size = 1 + (i % 3);
      const color = colors[i % colors.length];
      const baseOpacity = (0.4 + (i % 5) * 0.1) * intensity;

      coloredDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${baseOpacity}) 0%, transparent 100%)`);
    }

    // Add second layer with different positions
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

  // Visual Snow (Transparent Static) - Subtle, semi-transparent variant
  if (visualSnowTransparent?.enabled) {
    const intensity = visualSnowTransparent.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnowTransparent', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Transparent static - very faint, glass-like dots
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
      // Very low opacity for transparent effect
      const baseOpacity = (0.15 + (i % 5) * 0.05) * intensity;

      // Mix of slightly darker and lighter transparent dots
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

    // Add subtle glass-like distortion layer
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

  // Visual Snow (Dense Static) - Severe, high-density variant
  if (visualSnowDense?.enabled) {
    const intensity = visualSnowDense.intensity;

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

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnowDense', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Dense static - many more dots, larger, more opaque
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

    // Contrast reduction layer - more severe for dense type
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

  // Visual Hallucinations - Charles Bonnet Syndrome / Release Hallucinations
  // Common after stroke/TBI affecting visual pathways
  // Episodic variation: different hallucinations appear/disappear every 8-15 seconds
  // Simple: honeycomb, spiral, tessellation, concentric circles, zigzag, grid, photopsia
  // Complex: human silhouettes, faces, flowers, cats, buildings
  if (hallucinations?.enabled) {
    const intensity = hallucinations.intensity;
    const now = Date.now();
    // Get or initialize start time - ensures effect starts at beginning of episode
    const startTime = getHallucinationsStartTime();

    // Create or get the main container overlay
    let overlayElement = document.getElementById('visual-field-overlay-hallucinations');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-hallucinations';

      const targetContainer = findContainer();

      if (targetContainer) {
        targetContainer.appendChild(overlayElement);
      } else {
        document.body.appendChild(overlayElement);
      }

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('hallucinations', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Episode System - patterns change every 8-15 seconds with smooth transitions
    // Using startTime ensures effect begins at optimal point with full visibility
    const { episodeSeed, episodeOpacity } = getEpisodeTiming(now, intensity, startTime);
    const episodeConfig = selectEpisodeConfig(episodeSeed, intensity);

    // Animation phases for subtle movement
    const animationPhase = Math.sin(now / 3000) * 0.5 + 0.5;
    const flashPhase = Math.sin(now / 1500) * 0.5 + 0.5;

    // Base opacity scales with intensity
    const baseOpacity = (0.25 + intensity * 0.35) * episodeOpacity;

    // Layer 1: Episode-based patterns (simple + complex hallucinations combined)
    let patternLayer = document.getElementById('hallucination-pattern-layer');
    if (!patternLayer) {
      patternLayer = document.createElement('div');
      patternLayer.id = 'hallucination-pattern-layer';
      overlayElement.appendChild(patternLayer);
    }

    const patternElements = generateEpisodePatterns(
      episodeConfig,
      intensity,
      baseOpacity,
      animationPhase,
      episodeSeed
    );

    Object.assign(patternLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: patternElements.join(', ') || 'transparent',
      opacity: Math.min(0.85, 0.5 + intensity * 0.35).toString(),
      pointerEvents: 'none',
      animation: 'cbsPatternDrift 8s ease-in-out infinite',
      transition: 'opacity 0.5s ease-in-out'
    });

    // Layer 2: Persistent photopsia flashes (always present, intensity varies)
    let flashLayer = document.getElementById('hallucination-flash-layer');
    if (!flashLayer) {
      flashLayer = document.createElement('div');
      flashLayer.id = 'hallucination-flash-layer';
      overlayElement.appendChild(flashLayer);
    }

    const flashElements: string[] = [];
    const numFlashes = Math.floor(3 + intensity * 6);
    const flashOpacityBase = (0.25 + intensity * 0.25) * flashPhase;

    for (let i = 0; i < numFlashes; i++) {
      const x = 15 + (i * 19.7 + now / 5000) % 70;
      const y = 15 + (i * 23.3) % 70;
      const size = 6 + (i % 4) * 5;
      const flashOpacity = flashOpacityBase * (0.5 + (i % 3) * 0.25);

      flashElements.push(`
        radial-gradient(circle ${size}px at ${x}% ${y}%,
          rgba(255,255,255,${flashOpacity}) 0%,
          rgba(255,255,220,${flashOpacity * 0.5}) 40%,
          rgba(255,245,200,${flashOpacity * 0.2}) 70%,
          transparent 100%
        )
      `);
    }

    Object.assign(flashLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: flashElements.join(', '),
      mixBlendMode: 'screen',
      opacity: '1',
      pointerEvents: 'none',
      animation: 'cbsFlashPulse 4s ease-in-out infinite'
    });

    // Layer 3: Vision loss area indicator
    let visionLossLayer = document.getElementById('hallucination-vision-loss');
    if (!visionLossLayer) {
      visionLossLayer = document.createElement('div');
      visionLossLayer.id = 'hallucination-vision-loss';
      overlayElement.appendChild(visionLossLayer);
    }

    Object.assign(visionLossLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: createVisionLossGradient(intensity),
      pointerEvents: 'none'
    });

    // Inject CBS-specific animations
    if (!document.getElementById('cbs-hallucination-animations')) {
      const style = document.createElement('style');
      style.id = 'cbs-hallucination-animations';
      style.textContent = CBS_KEYFRAME_ANIMATIONS;
      document.head.appendChild(style);
    }

    // Clean up old layers that are no longer used
    const oldLayers = ['hallucination-geometric-layer', 'hallucination-figure-layer', 'hallucination-object-layer'];
    oldLayers.forEach(id => {
      const oldLayer = document.getElementById(id);
      if (oldLayer) {
        oldLayer.remove();
      }
    });

    overlayElement.style.opacity = '1';
  } else {
    // Reset start time when hallucinations are disabled so next enable starts fresh
    resetHallucinationsStartTime();
  }

  // Visual Aura - Improved with zigzag fortification pattern and proper scintillation
  if (visualAura?.enabled) {
    const intensity = visualAura.intensity;

    // Create or get the main container overlay for aura
    let overlayElement = document.getElementById('visual-field-overlay-visualAura');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-visualAura';

      const targetContainer = findContainer();

      if (targetContainer) {
        targetContainer.appendChild(overlayElement);
      } else {
        document.body.appendChild(overlayElement);
      }

      if (targetContainer && targetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(targetContainer);
        if (computedStyle.position === 'static') {
          targetContainer.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualAura', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    const scotomaCenterX = 50;
    const scotomaCenterY = 50;
    const scotomaSize = 18 + intensity * 8;
    const auraRingStart = scotomaSize + 3;
    const auraRingEnd = scotomaSize + 12 + intensity * 8;

    // Central scotoma (dark blind spot) - this is the actual visual loss
    let scotomaLayer = document.getElementById('aura-scotoma-layer');
    if (!scotomaLayer) {
      scotomaLayer = document.createElement('div');
      scotomaLayer.id = 'aura-scotoma-layer';
      overlayElement.appendChild(scotomaLayer);
    }

    const scotomaGradient = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
      rgba(40,35,45,${0.85 * intensity}) 0%,
      rgba(40,35,45,${0.8 * intensity}) ${scotomaSize - 5}%,
      rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
      rgba(60,55,65,${0.2 * intensity}) ${scotomaSize + 2}%,
      transparent ${scotomaSize + 5}%
    )`;

    Object.assign(scotomaLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: scotomaGradient,
      mixBlendMode: 'multiply',
      opacity: Math.min(0.9, intensity).toString(),
      pointerEvents: 'none'
    });

    // Zigzag fortification pattern layer (the characteristic "fortification spectra")
    let zigzagLayer = document.getElementById('aura-zigzag-layer');
    if (!zigzagLayer) {
      zigzagLayer = document.createElement('div');
      zigzagLayer.id = 'aura-zigzag-layer';
      overlayElement.appendChild(zigzagLayer);
    }

    // Create zigzag pattern using repeating gradients
    // Real aura has angular, castle-wall-like patterns
    const zigzagPatterns: string[] = [];
    const numSegments = 24; // Number of zigzag segments around the ring

    for (let i = 0; i < numSegments; i++) {
      const angle = (i / numSegments) * 360;
      const nextAngle = ((i + 1) / numSegments) * 360;

      // Alternate colors - muted/pale tones typical of real auras
      const colorIndex = i % 4;
      let color: string;
      const baseOpacity = (0.4 + (i % 3) * 0.15) * intensity;

      if (colorIndex === 0) {
        color = `rgba(200,180,220,${baseOpacity})`; // Pale lavender
      } else if (colorIndex === 1) {
        color = `rgba(180,200,220,${baseOpacity})`; // Pale blue
      } else if (colorIndex === 2) {
        color = `rgba(220,220,180,${baseOpacity})`; // Pale yellow
      } else {
        color = `rgba(255,255,255,${baseOpacity * 1.2})`; // Bright white (scintillating)
      }

      // Create angular segments for zigzag effect
      zigzagPatterns.push(`
        conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
          transparent 0deg,
          ${color} ${(nextAngle - angle) * 0.3}deg,
          transparent ${(nextAngle - angle) * 0.6}deg,
          ${color} ${nextAngle - angle}deg,
          transparent ${nextAngle - angle}deg
        )
      `);
    }

    // Ring mask to constrain the zigzag to the aura ring area
    const ringMask = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
      transparent 0%,
      transparent ${auraRingStart - 2}%,
      white ${auraRingStart}%,
      white ${auraRingEnd}%,
      transparent ${auraRingEnd + 2}%
    )`;

    Object.assign(zigzagLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: zigzagPatterns.slice(0, 8).join(', '),
      maskImage: ringMask,
      WebkitMaskImage: ringMask,
      mixBlendMode: 'screen',
      opacity: Math.min(0.8, intensity * 0.9).toString(),
      pointerEvents: 'none',
      // Scintillation animation (flickering at ~2-3 Hz)
      animation: 'auraScintillate 0.4s steps(2) infinite'
    });

    // Bright edge layer (the characteristic bright flickering edge)
    let brightEdgeLayer = document.getElementById('aura-bright-edge-layer');
    if (!brightEdgeLayer) {
      brightEdgeLayer = document.createElement('div');
      brightEdgeLayer.id = 'aura-bright-edge-layer';
      overlayElement.appendChild(brightEdgeLayer);
    }

    const brightEdge = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
      transparent 0%,
      transparent ${auraRingStart - 1}%,
      rgba(255,255,255,${0.6 * intensity}) ${auraRingStart}%,
      rgba(255,255,240,${0.4 * intensity}) ${auraRingStart + 2}%,
      rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
      rgba(255,255,255,${0.5 * intensity}) ${auraRingEnd - 2}%,
      rgba(255,255,255,${0.3 * intensity}) ${auraRingEnd}%,
      transparent ${auraRingEnd + 2}%
    )`;

    Object.assign(brightEdgeLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: brightEdge,
      mixBlendMode: 'screen',
      opacity: Math.min(0.85, intensity).toString(),
      pointerEvents: 'none',
      animation: 'auraFlicker 0.35s ease-in-out infinite alternate'
    });

    // Inject CSS animations for scintillation if not already present
    if (!document.getElementById('aura-animations')) {
      const style = document.createElement('style');
      style.id = 'aura-animations';
      style.textContent = `
        @keyframes auraScintillate {
          0% { opacity: 0.7; transform: rotate(0deg); }
          50% { opacity: 0.9; transform: rotate(3deg); }
          100% { opacity: 0.7; transform: rotate(0deg); }
        }
        @keyframes auraFlicker {
          0% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.3); }
          100% { opacity: 0.6; filter: brightness(1); }
        }
      `;
      document.head.appendChild(style);
    }

    overlayElement.style.opacity = Math.min(0.95, 0.7 + intensity * 0.25).toString();
  }

  // Visual Aura Left - Improved with zigzag pattern
  if (visualAuraLeft?.enabled) {
    const intensity = visualAuraLeft.intensity;
    const scotomaCenterX = 25;
    const scotomaCenterY = 50;
    const scotomaSize = 15 + intensity * 6;
    const auraRingStart = scotomaSize + 2;
    const auraRingEnd = scotomaSize + 10 + intensity * 6;

    // Scotoma with soft gray edges
    const scotomaGradient = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
      rgba(40,35,45,${0.8 * intensity}) 0%,
      rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
      transparent ${scotomaSize + 4}%
    )`;

    // Zigzag fortification ring with pale colors
    const zigzagSegments: string[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 360;
      const colorIndex = i % 4;
      const baseOpacity = (0.35 + (i % 3) * 0.12) * intensity;
      let color: string;

      if (colorIndex === 0) color = `rgba(200,180,220,${baseOpacity})`;
      else if (colorIndex === 1) color = `rgba(180,200,220,${baseOpacity})`;
      else if (colorIndex === 2) color = `rgba(220,220,180,${baseOpacity})`;
      else color = `rgba(255,255,255,${baseOpacity * 1.1})`;

      zigzagSegments.push(`
        conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
          transparent 0deg, ${color} 8deg, transparent 16deg, ${color} 22.5deg, transparent 22.5deg
        )
      `);
    }

    // Bright edge
    const brightEdge = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
      transparent ${auraRingStart - 1}%,
      rgba(255,255,255,${0.5 * intensity}) ${auraRingStart}%,
      rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
      rgba(255,255,255,${0.4 * intensity}) ${auraRingEnd}%,
      transparent ${auraRingEnd + 2}%
    )`;

    createOverlay(
      'visual-field-overlay-visualAuraLeft',
      `${scotomaGradient}, ${brightEdge}, ${zigzagSegments.slice(0, 6).join(', ')}`,
      'screen',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAuraLeft'
    );
  }

  // Visual Aura Right - Improved with zigzag pattern
  if (visualAuraRight?.enabled) {
    const intensity = visualAuraRight.intensity;
    const scotomaCenterX = 75;
    const scotomaCenterY = 50;
    const scotomaSize = 15 + intensity * 6;
    const auraRingStart = scotomaSize + 2;
    const auraRingEnd = scotomaSize + 10 + intensity * 6;

    // Scotoma with soft gray edges
    const scotomaGradient = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
      rgba(40,35,45,${0.8 * intensity}) 0%,
      rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
      transparent ${scotomaSize + 4}%
    )`;

    // Zigzag fortification ring with pale colors
    const zigzagSegments: string[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 360;
      const colorIndex = i % 4;
      const baseOpacity = (0.35 + (i % 3) * 0.12) * intensity;
      let color: string;

      if (colorIndex === 0) color = `rgba(200,180,220,${baseOpacity})`;
      else if (colorIndex === 1) color = `rgba(180,200,220,${baseOpacity})`;
      else if (colorIndex === 2) color = `rgba(220,220,180,${baseOpacity})`;
      else color = `rgba(255,255,255,${baseOpacity * 1.1})`;

      zigzagSegments.push(`
        conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
          transparent 0deg, ${color} 8deg, transparent 16deg, ${color} 22.5deg, transparent 22.5deg
        )
      `);
    }

    // Bright edge
    const brightEdge = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
      transparent ${auraRingStart - 1}%,
      rgba(255,255,255,${0.5 * intensity}) ${auraRingStart}%,
      rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
      rgba(255,255,255,${0.4 * intensity}) ${auraRingEnd}%,
      transparent ${auraRingEnd + 2}%
    )`;

    createOverlay(
      'visual-field-overlay-visualAuraRight',
      `${scotomaGradient}, ${brightEdge}, ${zigzagSegments.slice(0, 6).join(', ')}`,
      'screen',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAuraRight'
    );
  }
};

