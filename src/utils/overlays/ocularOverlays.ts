import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { CONTAINER_SELECTORS } from '../appConstants';

/**
 * Creates overlays for ocular conditions
 * Includes: cataracts (nuclear, cortical, posterior subcapsular), keratoconus
 */
export const createOcularOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const posteriorSubcapsularCataract = getEffect('posteriorSubcapsularCataract');
  const corticalCataract = getEffect('corticalCataract');
  const nuclearCataract = getEffect('cataracts');

  // Nuclear Sclerotic Cataract - Yellowing haze overlay (supplements CSS filter)
  if (nuclearCataract?.enabled) {
    const intensity = nuclearCataract.intensity;

    // Yellow-brown haze that intensifies toward the center (lens nucleus yellowing)
    const yellowHaze = `radial-gradient(circle at 50% 50%,
      rgba(180,150,80,${0.15 * intensity}) 0%,
      rgba(160,130,60,${0.12 * intensity}) 30%,
      rgba(140,110,50,${0.08 * intensity}) 60%,
      rgba(120,90,40,${0.04 * intensity}) 85%,
      transparent 100%
    )`;

    // Light scatter effect (diffuse glow)
    const lightScatter = `radial-gradient(circle at 50% 50%,
      rgba(255,250,220,${0.1 * intensity}) 0%,
      rgba(255,245,200,${0.06 * intensity}) 40%,
      transparent 70%
    )`;

    createOverlay(
      'visual-field-overlay-nuclearCataract',
      `${yellowHaze}, ${lightScatter}`,
      'overlay',
      Math.min(0.7, intensity * 0.8).toString(),
      undefined,
      undefined,
      'cataracts'
    );
  }

  // Posterior Subcapsular Cataract - Central glare pattern
  if (posteriorSubcapsularCataract?.enabled) {
    const intensity = posteriorSubcapsularCataract.intensity;

    // Create or get the main container overlay
    let overlayElement = document.getElementById('visual-field-overlay-posteriorSubcapsular');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-posteriorSubcapsular';

      let container: Element | null = null;
      for (const selector of CONTAINER_SELECTORS) {
        if (selector === 'iframe[src*="youtube"]') {
          const iframe = document.querySelector(selector);
          if (iframe) {
            container = iframe.parentElement;
            break;
          }
        } else if (selector === 'canvas') {
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
        document.body.appendChild(overlayElement);
      }

      if (container && container instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
          container.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('posteriorSubcapsularCataract', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Central cloudy/milky patch (the PSC opacity)
    let cloudyPatch = document.getElementById('psc-cloudy-patch');
    if (!cloudyPatch) {
      cloudyPatch = document.createElement('div');
      cloudyPatch.id = 'psc-cloudy-patch';
      overlayElement.appendChild(cloudyPatch);
    }

    const patchSize = 15 + intensity * 20; // Central opacity grows with severity
    const cloudyGradient = `radial-gradient(circle at 50% 50%,
      rgba(255,255,255,${0.5 * intensity}) 0%,
      rgba(255,255,245,${0.4 * intensity}) ${patchSize * 0.3}%,
      rgba(250,250,240,${0.3 * intensity}) ${patchSize * 0.6}%,
      rgba(245,245,235,${0.15 * intensity}) ${patchSize * 0.85}%,
      transparent ${patchSize}%
    )`;

    Object.assign(cloudyPatch.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: cloudyGradient,
      mixBlendMode: 'screen',
      opacity: Math.min(0.85, intensity).toString(),
      pointerEvents: 'none'
    });

    // Glare rays emanating from center (light scatter through PSC)
    let glareRays = document.getElementById('psc-glare-rays');
    if (!glareRays) {
      glareRays = document.createElement('div');
      glareRays.id = 'psc-glare-rays';
      overlayElement.appendChild(glareRays);
    }

    // Create radial glare pattern
    const glarePatterns: string[] = [];
    const numRays = 12;

    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * 360;
      const rayOpacity = (0.15 + (i % 3) * 0.08) * intensity;

      glarePatterns.push(`
        conic-gradient(from ${angle}deg at 50% 50%,
          transparent 0deg,
          rgba(255,255,240,${rayOpacity}) ${15 / numRays * 180}deg,
          transparent ${30 / numRays * 180}deg
        )
      `);
    }

    Object.assign(glareRays.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: glarePatterns.slice(0, 6).join(', '),
      mixBlendMode: 'screen',
      opacity: Math.min(0.6, intensity * 0.7).toString(),
      pointerEvents: 'none',
      filter: 'blur(3px)'
    });

    overlayElement.style.opacity = Math.min(0.95, 0.6 + intensity * 0.35).toString();
  }

  // Cortical Cataract - Wedge-shaped spoke opacities
  if (corticalCataract?.enabled) {
    const intensity = corticalCataract.intensity;

    // Create or get the main container overlay
    let overlayElement = document.getElementById('visual-field-overlay-corticalCataract');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-corticalCataract';

      let container: Element | null = null;
      for (const selector of CONTAINER_SELECTORS) {
        if (selector === 'iframe[src*="youtube"]') {
          const iframe = document.querySelector(selector);
          if (iframe) {
            container = iframe.parentElement;
            break;
          }
        } else if (selector === 'canvas') {
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
        document.body.appendChild(overlayElement);
      }

      if (container && container instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
          container.style.position = 'relative';
        }
      }
    }

    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('corticalCataract', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Create spoke/wedge pattern layer
    let spokeLayer = document.getElementById('cortical-spoke-layer');
    if (!spokeLayer) {
      spokeLayer = document.createElement('div');
      spokeLayer.id = 'cortical-spoke-layer';
      overlayElement.appendChild(spokeLayer);
    }

    // Generate wedge-shaped spokes extending from periphery toward center
    const spokePatterns: string[] = [];
    const numSpokes = 8 + Math.floor(intensity * 6); // More spokes as condition progresses

    // Seeded pseudo-random for consistent spoke positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numSpokes; i++) {
      const seed = i * 3.71;
      // Spokes are distributed around the periphery
      const baseAngle = (i / numSpokes) * 360 + seededRandom(seed) * 20 - 10;
      const spokeWidth = 8 + seededRandom(seed + 1) * 12; // Angular width in degrees
      const spokeOpacity = (0.25 + seededRandom(seed + 2) * 0.25) * intensity;

      // Wedge-shaped opacity (whitish, like lens cortex opacities)
      spokePatterns.push(`
        conic-gradient(from ${baseAngle - spokeWidth / 2}deg at 50% 50%,
          transparent 0deg,
          rgba(255,255,250,${spokeOpacity * 0.3}) ${spokeWidth * 0.1}deg,
          rgba(255,255,245,${spokeOpacity}) ${spokeWidth * 0.4}deg,
          rgba(255,255,245,${spokeOpacity}) ${spokeWidth * 0.6}deg,
          rgba(255,255,250,${spokeOpacity * 0.3}) ${spokeWidth * 0.9}deg,
          transparent ${spokeWidth}deg
        )
      `);
    }

    // Ring mask to limit spokes to the peripheral-to-mid region
    const innerClearRadius = Math.max(15, 60 - intensity * 45);
    const spokeMask = `radial-gradient(circle at 50% 50%,
      transparent 0%,
      transparent ${innerClearRadius}%,
      white ${innerClearRadius + 5}%,
      white 90%,
      transparent 95%
    )`;

    Object.assign(spokeLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: spokePatterns.join(', '),
      maskImage: spokeMask,
      WebkitMaskImage: spokeMask,
      mixBlendMode: 'screen',
      opacity: Math.min(0.8, intensity * 0.9).toString(),
      pointerEvents: 'none'
    });

    // Add peripheral haze layer (general cortical cloudiness)
    let hazeLayer = document.getElementById('cortical-haze-layer');
    if (!hazeLayer) {
      hazeLayer = document.createElement('div');
      hazeLayer.id = 'cortical-haze-layer';
      overlayElement.appendChild(hazeLayer);
    }

    const hazeGradient = `radial-gradient(circle at 50% 50%,
      transparent 0%,
      transparent ${innerClearRadius}%,
      rgba(240,240,235,${0.15 * intensity}) ${innerClearRadius + 10}%,
      rgba(235,235,230,${0.25 * intensity}) 70%,
      rgba(230,230,225,${0.2 * intensity}) 85%,
      transparent 95%
    )`;

    Object.assign(hazeLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: hazeGradient,
      mixBlendMode: 'screen',
      opacity: Math.min(0.7, intensity * 0.8).toString(),
      pointerEvents: 'none'
    });

    overlayElement.style.opacity = Math.min(0.95, 0.5 + intensity * 0.45).toString();
  }
};
