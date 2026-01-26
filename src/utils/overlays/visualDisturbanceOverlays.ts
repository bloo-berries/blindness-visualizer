import { VisualEffect } from '../../types/visualEffects';
import { createOverlay } from './overlayHelpers';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../overlayConstants';
import { CONTAINER_SELECTORS } from '../appConstants';

/**
 * Creates overlays for visual disturbance conditions
 * Includes: floaters, aura, visual snow, hallucinations
 */
export const createVisualDisturbanceOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const visualFloaters = getEffect('visualFloaters');
  const visualAura = getEffect('visualAura');
  const visualAuraLeft = getEffect('visualAuraLeft');
  const visualAuraRight = getEffect('visualAuraRight');
  const visualSnow = getEffect('visualSnow');
  const hallucinations = getEffect('hallucinations');

  // Visual Floaters
  if (visualFloaters?.enabled) {
    const intensity = visualFloaters.intensity;
    const floaterPattern = `
      radial-gradient(ellipse 15% 6% at 30% 30%, rgba(0,0,0,${0.6 * intensity}) 0%, rgba(0,0,0,0) 70%),
      radial-gradient(ellipse 12% 5% at 70% 40%, rgba(0,0,0,${0.5 * intensity}) 0%, rgba(0,0,0,0) 65%),
      radial-gradient(circle 8% at 50% 70%, rgba(0,0,0,${0.4 * intensity}) 0%, rgba(0,0,0,0) 60%)
    `;

    createOverlay(
      'visual-field-overlay-visualFloaters',
      floaterPattern,
      'multiply',
      Math.min(0.8, intensity).toString(),
      undefined,
      undefined,
      'visualFloaters'
    );
  }

  // Visual Snow Syndrome - persistent static overlay like TV noise or shaken snow globe
  if (visualSnow?.enabled) {
    const intensity = visualSnow.intensity;
    const snowIntensity = Math.min(intensity * 1.2, 1.0);

    // Create or get the main container overlay
    let overlayElement = document.getElementById('visual-field-overlay-visualSnow');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-visualSnow';

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

    // Apply base styles
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex('visualSnow', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Create SVG noise filter for persistent static effect (slow, gentle movement - not strobing)
    let svgFilter = document.getElementById('visual-snow-svg-filter');
    if (!svgFilter) {
      svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgFilter.id = 'visual-snow-svg-filter';
      svgFilter.setAttribute('width', '0');
      svgFilter.setAttribute('height', '0');
      svgFilter.style.position = 'absolute';
      // Slow animation (8s and 12s) for gentle drift, not rapid flashing
      svgFilter.innerHTML = `
        <defs>
          <filter id="visualSnowNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="1" result="noise1">
              <animate attributeName="seed" from="1" to="10" dur="8s" repeatCount="indefinite"/>
            </feTurbulence>
            <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="3" seed="50" result="noise2">
              <animate attributeName="seed" from="50" to="60" dur="12s" repeatCount="indefinite"/>
            </feTurbulence>
            <feBlend in="noise1" in2="noise2" mode="overlay" result="blendedNoise"/>
            <feColorMatrix type="saturate" values="0" result="grayNoise"/>
            <feComponentTransfer result="contrastNoise">
              <feFuncR type="linear" slope="1.8" intercept="-0.4"/>
              <feFuncG type="linear" slope="1.8" intercept="-0.4"/>
              <feFuncB type="linear" slope="1.8" intercept="-0.4"/>
              <feFuncA type="linear" slope="1" intercept="0"/>
            </feComponentTransfer>
          </filter>
        </defs>
      `;
      document.body.appendChild(svgFilter);
    }

    // Create primary static noise layer (persistent TV-static dots)
    let staticLayer = document.getElementById('visual-snow-static-layer');
    if (!staticLayer) {
      staticLayer = document.createElement('div');
      staticLayer.id = 'visual-snow-static-layer';
      overlayElement.appendChild(staticLayer);
    }
    Object.assign(staticLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      filter: 'url(#visualSnowNoise)',
      opacity: (0.2 + intensity * 0.35).toString(),
      mixBlendMode: 'overlay',
      pointerEvents: 'none'
    });

    // Create dot layer with grayish, semi-transparent dots (like snow globe particles)
    let dotLayer = document.getElementById('visual-snow-dot-layer');
    if (!dotLayer) {
      dotLayer = document.createElement('div');
      dotLayer.id = 'visual-snow-dot-layer';
      overlayElement.appendChild(dotLayer);
    }

    // Generate many tiny dots across the field - mix of light, dark, and slightly colored
    const dotPatterns: string[] = [];
    const numDots = Math.floor(40 + intensity * 60);
    for (let i = 0; i < numDots; i++) {
      const x = (i * 17.3) % 100; // Deterministic spread for consistency
      const y = (i * 23.7) % 100;
      const size = 0.5 + (i % 4) * 0.5; // Tiny dots: 0.5px to 2px
      const dotType = i % 5;
      let color: string;
      const baseOpacity = (0.15 + (i % 10) * 0.04) * intensity;

      if (dotType === 0) {
        // White/light dots
        color = `rgba(255,255,255,${baseOpacity})`;
      } else if (dotType === 1) {
        // Dark/black dots
        color = `rgba(0,0,0,${baseOpacity * 0.8})`;
      } else if (dotType === 2) {
        // Grayish dots
        color = `rgba(180,180,180,${baseOpacity * 0.9})`;
      } else if (dotType === 3) {
        // Slightly blue-tinted (common in visual snow)
        color = `rgba(200,210,230,${baseOpacity * 0.7})`;
      } else {
        // Transparent/faint dots
        color = `rgba(220,220,220,${baseOpacity * 0.5})`;
      }
      dotPatterns.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
    }

    Object.assign(dotLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: dotPatterns.join(', '),
      mixBlendMode: 'overlay',
      opacity: Math.min(0.85, snowIntensity).toString(),
      pointerEvents: 'none',
      // Slow, gentle drifting movement like particles in a snow globe
      animation: 'visualSnowDrift 6s ease-in-out infinite alternate'
    });

    // Create secondary moving dot layer for depth (particles at different "distances")
    let dotLayer2 = document.getElementById('visual-snow-dot-layer-2');
    if (!dotLayer2) {
      dotLayer2 = document.createElement('div');
      dotLayer2.id = 'visual-snow-dot-layer-2';
      overlayElement.appendChild(dotLayer2);
    }

    const dotPatterns2: string[] = [];
    const numDots2 = Math.floor(25 + intensity * 35);
    for (let i = 0; i < numDots2; i++) {
      const x = (i * 31.1 + 13) % 100;
      const y = (i * 19.9 + 7) % 100;
      const size = 0.8 + (i % 3) * 0.6;
      const opacity = (0.1 + (i % 8) * 0.03) * intensity;
      const isLight = i % 2 === 0;
      const color = isLight
        ? `rgba(240,240,245,${opacity})`
        : `rgba(60,60,70,${opacity * 0.7})`;
      dotPatterns2.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`);
    }

    Object.assign(dotLayer2.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: dotPatterns2.join(', '),
      mixBlendMode: 'overlay',
      opacity: Math.min(0.7, snowIntensity * 0.8).toString(),
      pointerEvents: 'none',
      // Different timing for parallax-like depth effect
      animation: 'visualSnowDrift 9s ease-in-out infinite alternate-reverse'
    });

    // Fine grain texture layer (the dense "poor TV reception" static)
    let grainLayer = document.getElementById('visual-snow-grain-layer');
    if (!grainLayer) {
      grainLayer = document.createElement('div');
      grainLayer.id = 'visual-snow-grain-layer';
      overlayElement.appendChild(grainLayer);
    }

    const grainOpacity = 0.08 + intensity * 0.12;
    Object.assign(grainLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: `
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 1px,
          rgba(200,200,200,${grainOpacity}) 1px,
          rgba(200,200,200,${grainOpacity}) 2px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 1px,
          rgba(150,150,150,${grainOpacity * 0.7}) 1px,
          rgba(150,150,150,${grainOpacity * 0.7}) 2px
        )
      `,
      backgroundSize: '2px 2px, 2px 2px',
      mixBlendMode: 'overlay',
      opacity: Math.min(0.6, intensity * 0.7).toString(),
      pointerEvents: 'none',
      animation: 'visualSnowGrain 4s linear infinite'
    });

    // Overall container opacity
    overlayElement.style.opacity = Math.min(0.95, 0.75 + snowIntensity * 0.2).toString();
  }

  // Visual Hallucinations - Mixed type with patterns, lights, shadows, and figures
  if (hallucinations?.enabled) {
    const intensity = hallucinations.intensity;

    // Create or get the main container overlay
    let overlayElement = document.getElementById('visual-field-overlay-hallucinations');

    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-hallucinations';

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
      zIndex: getOverlayZIndex('hallucinations', Z_INDEX.BASE),
      overflow: 'hidden'
    });

    // Layer 1: Geometric patterns (lattices, honeycomb-like structures)
    let patternLayer = document.getElementById('hallucination-pattern-layer');
    if (!patternLayer) {
      patternLayer = document.createElement('div');
      patternLayer.id = 'hallucination-pattern-layer';
      overlayElement.appendChild(patternLayer);
    }

    // Create honeycomb/lattice pattern that fades in peripheral areas
    const patternOpacity = 0.15 + intensity * 0.2;
    const latticePattern = `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 20px,
        rgba(100,80,120,${patternOpacity * 0.4}) 20px,
        rgba(100,80,120,${patternOpacity * 0.4}) 22px
      ),
      repeating-linear-gradient(
        60deg,
        transparent 0px,
        transparent 20px,
        rgba(80,100,120,${patternOpacity * 0.3}) 20px,
        rgba(80,100,120,${patternOpacity * 0.3}) 22px
      ),
      repeating-linear-gradient(
        120deg,
        transparent 0px,
        transparent 20px,
        rgba(120,100,80,${patternOpacity * 0.3}) 20px,
        rgba(120,100,80,${patternOpacity * 0.3}) 22px
      ),
      radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)
    `;

    Object.assign(patternLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: latticePattern,
      mixBlendMode: 'overlay',
      opacity: Math.min(0.6, intensity * 0.5).toString(),
      pointerEvents: 'none',
      animation: 'hallucinationPatternFade 8s ease-in-out infinite'
    });

    // Layer 2: Light phenomena (phosphene-like glows, bright spots)
    let lightLayer = document.getElementById('hallucination-light-layer');
    if (!lightLayer) {
      lightLayer = document.createElement('div');
      lightLayer.id = 'hallucination-light-layer';
      overlayElement.appendChild(lightLayer);
    }

    const lightElements: string[] = [];
    const numLights = Math.floor(4 + intensity * 6);
    for (let i = 0; i < numLights; i++) {
      // Position lights more toward periphery
      const angle = (i / numLights) * Math.PI * 2;
      const radius = 25 + (i % 3) * 10;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const size = 15 + (i % 4) * 10;
      const lightOpacity = (0.2 + (i % 3) * 0.1) * intensity;

      // Vary colors - warm and cool tones
      const hue = (i * 47) % 360;
      const saturation = 40 + (i % 3) * 20;
      lightElements.push(`
        radial-gradient(circle ${size}px at ${x}% ${y}%,
          hsla(${hue},${saturation}%,70%,${lightOpacity}) 0%,
          hsla(${hue},${saturation}%,60%,${lightOpacity * 0.5}) 40%,
          transparent 100%
        )
      `);
    }

    // Add some bright flash-like spots
    for (let i = 0; i < 3; i++) {
      const x = 20 + (i * 30);
      const y = 30 + (i * 20) % 40;
      lightElements.push(`
        radial-gradient(circle 8px at ${x}% ${y}%,
          rgba(255,255,255,${0.4 * intensity}) 0%,
          rgba(255,255,200,${0.2 * intensity}) 50%,
          transparent 100%
        )
      `);
    }

    Object.assign(lightLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: lightElements.join(', '),
      mixBlendMode: 'screen',
      opacity: Math.min(0.7, intensity * 0.6).toString(),
      pointerEvents: 'none',
      animation: 'hallucinationLightPulse 6s ease-in-out infinite'
    });

    // Layer 3: Shadowy figures (silhouettes in peripheral vision)
    let figureLayer = document.getElementById('hallucination-figure-layer');
    if (!figureLayer) {
      figureLayer = document.createElement('div');
      figureLayer.id = 'hallucination-figure-layer';
      overlayElement.appendChild(figureLayer);
    }

    const figureElements: string[] = [];
    const numFigures = Math.floor(2 + intensity * 3);

    // Human-like silhouettes positioned in peripheral areas
    const peripheralPositions = [
      { x: 8, y: 40 },   // Left edge
      { x: 92, y: 35 },  // Right edge
      { x: 15, y: 75 },  // Bottom left
      { x: 85, y: 70 },  // Bottom right
      { x: 10, y: 15 },  // Top left
    ];

    for (let i = 0; i < Math.min(numFigures, peripheralPositions.length); i++) {
      const pos = peripheralPositions[i];
      const figureOpacity = (0.25 + (i % 3) * 0.1) * intensity;
      const heightScale = 1 + (i % 2) * 0.3;

      // Head
      figureElements.push(`
        radial-gradient(ellipse 12px 14px at ${pos.x}% ${pos.y - 8 * heightScale}%,
          rgba(20,20,30,${figureOpacity}) 0%,
          rgba(20,20,30,${figureOpacity * 0.6}) 60%,
          transparent 100%
        )
      `);

      // Body
      figureElements.push(`
        radial-gradient(ellipse 18px ${35 * heightScale}px at ${pos.x}% ${pos.y + 10}%,
          rgba(15,15,25,${figureOpacity * 0.9}) 0%,
          rgba(15,15,25,${figureOpacity * 0.5}) 50%,
          rgba(15,15,25,${figureOpacity * 0.2}) 80%,
          transparent 100%
        )
      `);
    }

    // Add some smaller shadowy shapes (could be perceived as animals or objects)
    for (let i = 0; i < 3 + Math.floor(intensity * 2); i++) {
      const x = 15 + (i * 23) % 70;
      const y = 60 + (i * 17) % 30;
      const shapeOpacity = (0.15 + (i % 2) * 0.1) * intensity;
      const width = 20 + (i % 3) * 8;
      const height = 12 + (i % 2) * 6;

      figureElements.push(`
        radial-gradient(ellipse ${width}px ${height}px at ${x}% ${y}%,
          rgba(30,25,35,${shapeOpacity}) 0%,
          rgba(30,25,35,${shapeOpacity * 0.4}) 60%,
          transparent 100%
        )
      `);
    }

    Object.assign(figureLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: figureElements.join(', '),
      mixBlendMode: 'multiply',
      opacity: Math.min(0.8, intensity * 0.7).toString(),
      pointerEvents: 'none',
      animation: 'hallucinationFigureDrift 12s ease-in-out infinite'
    });

    // Layer 4: Face-like patterns (pareidolia - subtle suggestions of faces)
    let faceLayer = document.getElementById('hallucination-face-layer');
    if (!faceLayer) {
      faceLayer = document.createElement('div');
      faceLayer.id = 'hallucination-face-layer';
      overlayElement.appendChild(faceLayer);
    }

    const faceElements: string[] = [];
    const numFaces = Math.floor(1 + intensity * 2);
    const facePositions = [
      { x: 75, y: 25 },
      { x: 25, y: 30 },
      { x: 60, y: 65 },
    ];

    for (let i = 0; i < Math.min(numFaces, facePositions.length); i++) {
      const pos = facePositions[i];
      const faceOpacity = (0.12 + (i % 2) * 0.08) * intensity;
      const scale = 0.8 + (i % 2) * 0.3;

      // Face oval outline
      faceElements.push(`
        radial-gradient(ellipse ${25 * scale}px ${32 * scale}px at ${pos.x}% ${pos.y}%,
          transparent 70%,
          rgba(60,50,70,${faceOpacity * 0.5}) 85%,
          transparent 100%
        )
      `);

      // Eye-like shadows (left)
      faceElements.push(`
        radial-gradient(ellipse ${5 * scale}px ${3 * scale}px at ${pos.x - 5 * scale}% ${pos.y - 5 * scale}%,
          rgba(20,20,30,${faceOpacity}) 0%,
          transparent 100%
        )
      `);

      // Eye-like shadows (right)
      faceElements.push(`
        radial-gradient(ellipse ${5 * scale}px ${3 * scale}px at ${pos.x + 5 * scale}% ${pos.y - 5 * scale}%,
          rgba(20,20,30,${faceOpacity}) 0%,
          transparent 100%
        )
      `);

      // Mouth-like shadow
      faceElements.push(`
        radial-gradient(ellipse ${8 * scale}px ${3 * scale}px at ${pos.x}% ${pos.y + 8 * scale}%,
          rgba(30,20,35,${faceOpacity * 0.7}) 0%,
          transparent 100%
        )
      `);
    }

    Object.assign(faceLayer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: faceElements.join(', '),
      mixBlendMode: 'multiply',
      opacity: Math.min(0.6, intensity * 0.5).toString(),
      pointerEvents: 'none',
      filter: 'blur(1px)',
      animation: 'hallucinationFaceFade 10s ease-in-out infinite'
    });

    // Overall container opacity
    overlayElement.style.opacity = Math.min(0.95, 0.6 + intensity * 0.35).toString();
  }

  // Visual Aura
  if (visualAura?.enabled) {
    const intensity = visualAura.intensity;
    const scotomaSize = 25;
    const scotomaCenterX = 50;
    const scotomaCenterY = 50;
    
    const cShapeScotoma = `
      radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
        rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
        rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
        rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
        rgba(0,0,0,0) ${scotomaSize + 8}%
      )
    `;
    
    const scintillatingEdges = `
      conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(255,0,0,${0.6 * intensity}) 0deg,
        rgba(255,165,0,${0.7 * intensity}) 30deg,
        rgba(255,255,0,${0.5 * intensity}) 60deg,
        rgba(0,255,0,${0.6 * intensity}) 90deg,
        rgba(0,255,255,${0.4 * intensity}) 120deg,
        rgba(0,0,255,${0.5 * intensity}) 150deg,
        rgba(128,0,128,${0.6 * intensity}) 180deg,
        rgba(255,0,255,${0.4 * intensity}) 210deg,
        rgba(255,255,255,${0.7 * intensity}) 240deg,
        rgba(255,192,203,${0.3 * intensity}) 270deg,
        rgba(255,255,0,${0.5 * intensity}) 300deg,
        rgba(255,165,0,${0.6 * intensity}) 330deg,
        rgba(255,0,0,${0.6 * intensity}) 360deg
      )
    `;
    
    createOverlay(
      'visual-field-overlay-visualAura',
      `${cShapeScotoma}, ${scintillatingEdges}`,
      'overlay',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAura'
    );
  }

  // Visual Aura Left
  if (visualAuraLeft?.enabled) {
    const intensity = visualAuraLeft.intensity;
    const scotomaSize = 20;
    const scotomaCenterX = 25;
    const scotomaCenterY = 50;
    
    const cShapeScotoma = `
      radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
        rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
        rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
        rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
        rgba(0,0,0,0) ${scotomaSize + 8}%
      )
    `;
    
    const scintillatingEdges = `
      conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(255,0,0,${0.6 * intensity}) 0deg,
        rgba(255,165,0,${0.7 * intensity}) 30deg,
        rgba(255,255,0,${0.5 * intensity}) 60deg,
        rgba(0,255,0,${0.6 * intensity}) 90deg,
        rgba(0,255,255,${0.4 * intensity}) 120deg,
        rgba(0,0,255,${0.5 * intensity}) 150deg,
        rgba(128,0,128,${0.6 * intensity}) 180deg,
        rgba(255,0,255,${0.4 * intensity}) 210deg,
        rgba(255,255,255,${0.7 * intensity}) 240deg,
        rgba(255,192,203,${0.3 * intensity}) 270deg,
        rgba(255,255,0,${0.5 * intensity}) 300deg,
        rgba(255,165,0,${0.6 * intensity}) 330deg,
        rgba(255,0,0,${0.6 * intensity}) 360deg
      )
    `;
    
    createOverlay(
      'visual-field-overlay-visualAuraLeft',
      `${cShapeScotoma}, ${scintillatingEdges}`,
      'overlay',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAuraLeft'
    );
  }

  // Visual Aura Right
  if (visualAuraRight?.enabled) {
    const intensity = visualAuraRight.intensity;
    const scotomaSize = 20;
    const scotomaCenterX = 75;
    const scotomaCenterY = 50;
    
    const cShapeScotoma = `
      radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
        rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
        rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
        rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
        rgba(0,0,0,0) ${scotomaSize + 8}%
      )
    `;
    
    const scintillatingEdges = `
      conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
        rgba(255,0,0,${0.6 * intensity}) 0deg,
        rgba(255,165,0,${0.7 * intensity}) 30deg,
        rgba(255,255,0,${0.5 * intensity}) 60deg,
        rgba(0,255,0,${0.6 * intensity}) 90deg,
        rgba(0,255,255,${0.4 * intensity}) 120deg,
        rgba(0,0,255,${0.5 * intensity}) 150deg,
        rgba(128,0,128,${0.6 * intensity}) 180deg,
        rgba(255,0,255,${0.4 * intensity}) 210deg,
        rgba(255,255,255,${0.7 * intensity}) 240deg,
        rgba(255,192,203,${0.3 * intensity}) 270deg,
        rgba(255,255,0,${0.5 * intensity}) 300deg,
        rgba(255,165,0,${0.6 * intensity}) 330deg,
        rgba(255,0,0,${0.6 * intensity}) 360deg
      )
    `;
    
    createOverlay(
      'visual-field-overlay-visualAuraRight',
      `${cShapeScotoma}, ${scintillatingEdges}`,
      'overlay',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAuraRight'
    );
  }
};

