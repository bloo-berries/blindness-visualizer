import { VisualEffect } from '../types/visualEffects';
import { getOverlayZIndex, OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';
import { createEffectMap, getEffectById } from './effectLookup';
import { CONTAINER_SELECTORS } from './appConstants';
import { createVisualFieldLossOverlays } from './overlays/visualFieldLossOverlays';
import { createVisualDisturbanceOverlays } from './overlays/visualDisturbanceOverlays';
import { createRetinalDiseaseOverlays } from './overlays/retinalDiseaseOverlays';
import { createFamousPeopleOverlays } from './overlays/famousPeopleOverlays';
import { createOverlay as createOverlayHelper, createOverlayWithContainer as createOverlayWithContainerHelper } from './overlays/overlayHelpers';

/**
 * Creates a simple overlay element with consistent styling
 * @param id - The ID for the overlay element
 * @param container - The container element to append to
 * @param additionalStyles - Additional styles to apply
 * @returns The created overlay element
 */
export const createSimpleOverlay = (
  id: string,
  container: HTMLElement,
  additionalStyles: React.CSSProperties = {}
): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = id;
  
  Object.assign(overlay.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: Z_INDEX.ANIMATED.toString(),
    ...additionalStyles
  });
  
  container.appendChild(overlay);
  return overlay;
};

/**
 * Finds the appropriate container for overlays
 * @returns The container element or null if not found
 */
export const findOverlayContainer = (): HTMLElement | null => {
  const selectors = [
    '.visualizer-container',
    '[class*="visualizer"]',
    '[style*="position: relative"]',
    'iframe[src*="youtube"]', // For YouTube videos, find the iframe parent
    'canvas' // For WebGL content, find the canvas parent
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      // For iframe and canvas, get their parent container
      if (selector.includes('iframe') || selector.includes('canvas')) {
        const parent = element.parentElement;
        if (parent && parent instanceof HTMLElement) {
          return parent;
        }
      }
      return element;
    }
  }
  
  return null;
};

/**
 * Creates a visual field overlay element with specified styles
 * Re-exported from overlayHelpers for backward compatibility
 */
export const createOverlay = createOverlayHelper;

/**
 * Creates an overlay with a specific container
 * Re-exported from overlayHelpers for backward compatibility
 */
export const createOverlayWithContainer = createOverlayWithContainerHelper;

/**
 * Creates visual field overlays for all enabled effects
 */
export const createVisualFieldOverlays = (effects: VisualEffect[], container?: HTMLElement): void => {
  
  // Log all effects for debugging
  
  // Remove existing overlays first
  document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());

  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);
  const getEffect = (id: string) => getEffectById(effectMap, id);
  
  // Use category-based overlay generators for better organization
  // Visual Field Loss Overlays
  createVisualFieldLossOverlays(effectMap, container);
  
  // Visual Disturbance Overlays
  createVisualDisturbanceOverlays(effectMap);
  
  // Retinal Disease Overlays
  createRetinalDiseaseOverlays(effectMap, container);
  
  // Famous People Overlays
  createFamousPeopleOverlays(effectMap, container);
  
  // Get remaining effects for other categories (not handled by category modules)
  const [
    keratoconus, vitreousHemorrhage
  ] = [
    'keratoconus', 'vitreousHemorrhage'
  ].map(getEffect);
  // Note: diplopia is handled by shader effects, not overlays
  // Retinitis Pigmentosa is now handled by both shaders (for webcam) and overlays (for YouTube/images)

  // Visual Snow (Static Particles) - Persistent static noise pattern
  if (visualSnow?.enabled) {
    const intensity = visualSnow.intensity;
    // Visual Snow: Tiny, static dots across entire visual field
    // Similar to static noise on an untuned television screen
    // Uses repeating patterns for performance instead of individual particles
    
    const snowIntensity = Math.min(intensity * 1.5, 1.0);
    const snowDensity = Math.min(intensity * 0.8, 0.6); // Reduced density for performance
    
    // Create a repeating pattern using repeating-linear-gradient
    // This is much more efficient than thousands of individual gradients
    const visualSnowBackground = `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        rgba(255,255,255,${snowDensity * 0.3}) 2px,
        rgba(255,255,255,${snowDensity * 0.3}) 3px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 2px,
        rgba(255,255,255,${snowDensity * 0.2}) 2px,
        rgba(255,255,255,${snowDensity * 0.2}) 3px
      ),
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        transparent 3px,
        rgba(255,255,255,${snowDensity * 0.1}) 3px,
        rgba(255,255,255,${snowDensity * 0.1}) 4px
      )
    `;
    
    // Create overlay element
    let overlayElement = document.getElementById('visual-field-overlay-visualSnow');
    
    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = 'visual-field-overlay-visualSnow';
      Object.assign(overlayElement.style, {
        ...OVERLAY_BASE_STYLES,
        zIndex: getOverlayZIndex('visualSnow', Z_INDEX.BASE),
        background: visualSnowBackground,
        backgroundSize: '4px 4px, 4px 4px, 6px 6px',
        mixBlendMode: 'screen',
        opacity: Math.min(0.8, snowIntensity).toString()
      });
      
      // Find container
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
      
      // Force container to have relative positioning
      if (container && container instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
          container.style.position = 'relative';
        }
      }
    } else {
      // Update existing overlay
      overlayElement.style.background = visualSnowBackground;
      overlayElement.style.backgroundSize = '4px 4px, 4px 4px, 6px 6px';
      overlayElement.style.mixBlendMode = 'screen';
      overlayElement.style.opacity = Math.min(0.8, snowIntensity).toString();
    }
  }

  // Visual Hallucinations - Realistic-appearing objects and figures that aren't actually there
  if (hallucinations?.enabled) {
    const intensity = hallucinations.intensity;
    const hallucinationIntensity = Math.min(intensity * 1.8, 1.0);
    
    // Create multiple hallucination elements with realistic characteristics
    const hallucinationElements: string[] = [];
    
    // Human-like figures (common hallucination) - static positions
    for (let i = 0; i < 2 + Math.floor(intensity * 3); i++) {
      const baseX = 20 + (i * 25) % 60;
      const baseY = 30 + (i * 35) % 40;
      const figureOpacity = 0.3 + (i % 3) * 0.1; // Varying opacity
      
      // Human silhouette
      hallucinationElements.push(`
        radial-gradient(ellipse 15px 25px at ${baseX}% ${baseY}%, 
          rgba(0,0,0,${figureOpacity * hallucinationIntensity}) 0%, 
          rgba(0,0,0,${figureOpacity * 0.6 * hallucinationIntensity}) 40%,
          rgba(0,0,0,${figureOpacity * 0.3 * hallucinationIntensity}) 70%,
          rgba(0,0,0,0) 100%
        )
      `);
    }
    
    // Objects and shapes (furniture, animals, etc.) - static positions
    for (let i = 0; i < 3 + Math.floor(intensity * 4); i++) {
      const baseX = 10 + (i * 30) % 70;
      const baseY = 20 + (i * 25) % 60;
      const objectOpacity = 0.2 + (i % 2) * 0.1;
      const objectSize = 8 + (i % 3) * 2;
      
      // Alternate between circle and ellipse
      if (i % 2 === 0) {
        hallucinationElements.push(`
          radial-gradient(circle ${objectSize}px at ${baseX}% ${baseY}%, 
            rgba(100,100,100,${objectOpacity * hallucinationIntensity}) 0%, 
            rgba(100,100,100,${objectOpacity * 0.5 * hallucinationIntensity}) 60%,
            rgba(100,100,100,0) 100%
          )
        `);
      } else {
        hallucinationElements.push(`
          radial-gradient(ellipse ${objectSize}px ${objectSize * 1.5}px at ${baseX}% ${baseY}%, 
            rgba(80,80,80,${objectOpacity * hallucinationIntensity}) 0%, 
            rgba(80,80,80,${objectOpacity * 0.4 * hallucinationIntensity}) 70%,
            rgba(80,80,80,0) 100%
          )
        `);
      }
    }
    
    // Floating orbs and lights (common in visual hallucinations) - static positions
    for (let i = 0; i < 2 + Math.floor(intensity * 2); i++) {
      const baseX = 15 + (i * 40) % 70;
      const baseY = 15 + (i * 30) % 70;
      const orbOpacity = 0.4 + (i % 2) * 0.2;
      const orbSize = 6 + (i % 2) * 2;
      
      // Glowing orb effect
      hallucinationElements.push(`
        radial-gradient(circle ${orbSize}px at ${baseX}% ${baseY}%, 
          rgba(255,255,255,${orbOpacity * hallucinationIntensity}) 0%, 
          rgba(255,255,200,${orbOpacity * 0.7 * hallucinationIntensity}) 30%,
          rgba(255,200,100,${orbOpacity * 0.4 * hallucinationIntensity}) 60%,
          rgba(255,255,255,0) 100%
        )
      `);
    }
    
    // Shadowy figures in peripheral vision
    for (let i = 0; i < 1 + Math.floor(intensity * 2); i++) {
      const edgeX = i % 2 === 0 ? 5 : 95;
      const edgeY = 20 + (i * 60) % 60;
      const shadowOpacity = 0.25 + (i % 2) * 0.1;
      
      hallucinationElements.push(`
        radial-gradient(ellipse 20px 30px at ${edgeX}% ${edgeY}%, 
          rgba(0,0,0,${shadowOpacity * hallucinationIntensity}) 0%, 
          rgba(0,0,0,${shadowOpacity * 0.5 * hallucinationIntensity}) 50%,
          rgba(0,0,0,0) 100%
        )
      `);
    }
    
    // Combine all hallucination elements
    const hallucinationsBackground = hallucinationElements.join(', ');
    
    createOverlay(
      'visual-field-overlay-hallucinations',
      hallucinationsBackground,
      'normal',
      Math.min(0.9, hallucinationIntensity).toString(),
      undefined,
      undefined,
      'hallucinations'
    );
  }

  // Visual Aura effects - Scintillating Scotoma (Fortification Spectrum)
  if (visualAura?.enabled) {
    const intensity = visualAura.intensity;
    // Visual Aura: C-shaped scotoma with scintillating edges
    // Static representation of the migrating scotoma pattern
    const scotomaSize = 25; // Medium size scotoma
    const scotomaCenterX = 50; // Centered horizontally
    const scotomaCenterY = 50; // Centered vertically
    
    // C-shaped scotoma (crescent pattern) - weighted to one side
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
    
    // Scintillating edges with prismatic colors
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
    
    // Combine scotoma and scintillating edges
    const visualAuraBackground = `${cShapeScotoma}, ${scintillatingEdges}`;
    
    createOverlay(
      'visual-field-overlay-visualAura',
      visualAuraBackground,
      'overlay',
      Math.min(0.9, intensity).toString(),
      undefined,
      undefined,
      'visualAura'
    );
  }

  if (visualAuraLeft?.enabled) {
    const intensity = visualAuraLeft.intensity;
    const scotomaSize = 20;
    const scotomaCenterX = 25; // Left side
    const scotomaCenterY = 50;
    
    // C-shaped scotoma on left side
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
    
    // Scintillating edges
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

  if (visualAuraRight?.enabled) {
    const intensity = visualAuraRight.intensity;
    const scotomaSize = 20;
    const scotomaCenterX = 75; // Right side
    const scotomaCenterY = 50;
    
    // C-shaped scotoma on right side
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
    
    // Scintillating edges
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

  // Retinal disease and famous people overlays are now handled by category modules above
  // (createRetinalDiseaseOverlays and createFamousPeopleOverlays)

  // Keratoconus - Progressive corneal thinning with irregular cone shape
  if (keratoconus?.enabled) {
    const intensity = keratoconus.intensity;
    
    // Create multiple ghost images (monocular diplopia/polyopia)
    // 2-8+ overlapping copies with slight offsets - ENHANCED CONTRAST
    const ghostCount = Math.max(2, Math.floor(2 + intensity * 6)); // 2-8 ghosts based on intensity
    const ghostOffsets = [];
    
    for (let i = 0; i < ghostCount; i++) {
      const angle = (i / ghostCount) * Math.PI * 2;
      const distance = 2 + intensity * 5; // 2-7px offset (increased for higher contrast)
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      ghostOffsets.push(`translate(${offsetX}px, ${offsetY}px)`);
    }
    
    // Create streaking and comet tails effect - ENHANCED CONTRAST
    const streakIntensity = intensity * 1.2; // Increased intensity
    const streakLength = 30 + intensity * 40; // 30-70px streaks (longer for more dramatic effect)
    
    // Create halos around lights - ENHANCED CONTRAST
    const haloIntensity = intensity * 1.0; // Increased intensity
    const haloSize = 15 + intensity * 25; // 15-40px halos (larger for more visibility)
    
    // Create wavy distortion for text - ENHANCED
    const waveIntensity = intensity * 0.8; // Increased distortion
    
    // High contrast loss - ENHANCED
    const contrastLoss = intensity * 1.0; // Increased contrast loss
    
    // Create comprehensive keratoconus overlay with ENHANCED CONTRAST
    createOverlay(
      'visual-field-overlay-keratoconus',
      `
        /* Multiple ghost images - ENHANCED CONTRAST */
        ${ghostOffsets.map((offset, i) => `
          linear-gradient(${45 + i * 15}deg, 
            rgba(255,255,255,${intensity * 0.3}) 0%, 
            rgba(255,255,255,${intensity * 0.2}) 50%, 
            rgba(255,255,255,${intensity * 0.1}) 80%,
            transparent 100%
          )
        `).join(', ')}
        /* Streaking and comet tails - ENHANCED CONTRAST */
        , linear-gradient(90deg, 
          rgba(255,255,255,${streakIntensity * 0.6}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.4}) ${streakLength * 0.3}%, 
          rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.6}%,
          rgba(255,255,255,${streakIntensity * 0.1}) ${streakLength}%, 
          transparent 100%
        )
        , linear-gradient(45deg, 
          rgba(255,255,255,${streakIntensity * 0.5}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.3}) ${streakLength * 0.4}%, 
          rgba(255,255,255,${streakIntensity * 0.15}) ${streakLength * 0.8}%, 
          transparent 100%
        )
        , linear-gradient(135deg, 
          rgba(255,255,255,${streakIntensity * 0.4}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.5}%, 
          transparent 100%
        )
        /* Halos around lights - ENHANCED CONTRAST */
        , radial-gradient(circle at 20% 20%, 
          rgba(255,255,255,${haloIntensity * 0.8}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.6}) ${haloSize * 0.3}%, 
          rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.6}%,
          rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
          transparent ${haloSize * 2}%
        )
        , radial-gradient(circle at 80% 30%, 
          rgba(255,255,255,${haloIntensity * 0.7}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.5}) ${haloSize * 0.4}%, 
          rgba(255,255,255,${haloIntensity * 0.3}) ${haloSize * 0.8}%,
          rgba(255,255,255,${haloIntensity * 0.15}) ${haloSize * 1.2}%, 
          transparent ${haloSize * 2}%
        )
        , radial-gradient(circle at 50% 80%, 
          rgba(255,255,255,${haloIntensity * 0.6}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.5}%, 
          rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
          transparent ${haloSize * 1.5}%
        )
        /* High contrast loss - ENHANCED */
        , rgba(0,0,0,${contrastLoss * 0.5})
        , rgba(128,128,128,${contrastLoss * 0.3})
      `,
      'multiply',
      intensity.toString(),
      `
        /* Enhanced wavy distortion filter */
        blur(${waveIntensity * 3}px) 
        contrast(${100 - contrastLoss * 60}%) 
        brightness(${100 + intensity * 30}%)
        saturate(${100 - intensity * 40}%)
      `,
      undefined,
      'keratoconus'
    );
  }

  // Vitreous Hemorrhage - Blood in the vitreous humor causing red-tinted vision
  if (vitreousHemorrhage?.enabled) {
    const intensity = vitreousHemorrhage.intensity;
    
    // Create highly intensified hazy, semi-random dark reddish floaters with extensive blood streaks and pools
    let vitreousBackground = `
      /* Blood streaks at various angles - intensified */
      linear-gradient(45deg, rgba(139,0,0,${0.7 * intensity}) 0%, transparent 30%),
      linear-gradient(-45deg, rgba(139,0,0,${0.6 * intensity}) 0%, transparent 25%),
      linear-gradient(90deg, rgba(139,0,0,${0.65 * intensity}) 0%, transparent 35%),
      linear-gradient(135deg, rgba(139,0,0,${0.55 * intensity}) 0%, transparent 22%),
      linear-gradient(15deg, rgba(139,0,0,${0.5 * intensity}) 0%, transparent 18%),
      linear-gradient(75deg, rgba(139,0,0,${0.45 * intensity}) 0%, transparent 15%),
      linear-gradient(105deg, rgba(139,0,0,${0.55 * intensity}) 0%, transparent 25%),
      linear-gradient(165deg, rgba(139,0,0,${0.48 * intensity}) 0%, transparent 20%),
      linear-gradient(30deg, rgba(139,0,0,${0.4 * intensity}) 0%, transparent 16%),
      linear-gradient(60deg, rgba(139,0,0,${0.42 * intensity}) 0%, transparent 14%),
      linear-gradient(120deg, rgba(139,0,0,${0.38 * intensity}) 0%, transparent 12%),
      linear-gradient(150deg, rgba(139,0,0,${0.35 * intensity}) 0%, transparent 10%),
      /* Blood pools and dots - intensified */
      radial-gradient(circle at 30% 40%, rgba(139,0,0,${0.6 * intensity}) 0%, transparent 15%),
      radial-gradient(circle at 70% 60%, rgba(139,0,0,${0.55 * intensity}) 0%, transparent 12%),
      radial-gradient(circle at 20% 80%, rgba(139,0,0,${0.5 * intensity}) 0%, transparent 10%),
      radial-gradient(circle at 80% 20%, rgba(139,0,0,${0.45 * intensity}) 0%, transparent 8%),
      radial-gradient(circle at 50% 50%, rgba(139,0,0,${0.4 * intensity}) 0%, transparent 18%),
      radial-gradient(circle at 15% 25%, rgba(139,0,0,${0.52 * intensity}) 0%, transparent 9%),
      radial-gradient(circle at 85% 35%, rgba(139,0,0,${0.48 * intensity}) 0%, transparent 11%),
      radial-gradient(circle at 25% 75%, rgba(139,0,0,${0.46 * intensity}) 0%, transparent 7%),
      radial-gradient(circle at 75% 85%, rgba(139,0,0,${0.44 * intensity}) 0%, transparent 10%),
      radial-gradient(circle at 40% 15%, rgba(139,0,0,${0.42 * intensity}) 0%, transparent 8%),
      radial-gradient(circle at 60% 90%, rgba(139,0,0,${0.40 * intensity}) 0%, transparent 6%),
      radial-gradient(circle at 10% 60%, rgba(139,0,0,${0.38 * intensity}) 0%, transparent 5%),
      radial-gradient(circle at 90% 40%, rgba(139,0,0,${0.36 * intensity}) 0%, transparent 7%),
      radial-gradient(circle at 35% 85%, rgba(139,0,0,${0.34 * intensity}) 0%, transparent 6%),
      radial-gradient(circle at 65% 10%, rgba(139,0,0,${0.32 * intensity}) 0%, transparent 8%),
      /* Irregular blood patches - intensified */
      radial-gradient(ellipse at 35% 65%, rgba(139,0,0,${0.28 * intensity}) 0%, transparent 16%),
      radial-gradient(ellipse at 65% 25%, rgba(139,0,0,${0.26 * intensity}) 0%, transparent 13%),
      radial-gradient(ellipse at 10% 50%, rgba(139,0,0,${0.24 * intensity}) 0%, transparent 11%),
      radial-gradient(ellipse at 90% 70%, rgba(139,0,0,${0.22 * intensity}) 0%, transparent 9%),
      radial-gradient(ellipse at 20% 30%, rgba(139,0,0,${0.20 * intensity}) 0%, transparent 8%),
      radial-gradient(ellipse at 80% 80%, rgba(139,0,0,${0.18 * intensity}) 0%, transparent 7%),
      radial-gradient(ellipse at 45% 10%, rgba(139,0,0,${0.16 * intensity}) 0%, transparent 6%),
      radial-gradient(ellipse at 55% 90%, rgba(139,0,0,${0.14 * intensity}) 0%, transparent 5%),
      /* Overall red tint veil */
      rgba(139,0,0,${0.2 * intensity})
    `;
    
    // Remove trailing comma and clean up
    vitreousBackground = vitreousBackground.trim().replace(/,\s*$/, '');
    
    // Use createOverlayWithContainer if container is provided, otherwise use createOverlay
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-vitreousHemorrhage',
        vitreousBackground,
        'multiply',
        Math.min(0.9, intensity).toString(), // Match preview opacity
        undefined,
        undefined,
        'vitreousHemorrhage',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-vitreousHemorrhage',
        vitreousBackground,
        'multiply',
        Math.min(0.9, intensity).toString(), // Match preview opacity
        undefined,
        undefined,
        'vitreousHemorrhage'
      );
    }
  }
};

/**
 * Removes all visual field overlays
 */
export const removeVisualFieldOverlays = (): void => {
  const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
  overlays.forEach(overlay => overlay.remove());
  
  // Diplopia effects are now handled by WebGL shaders, no DOM cleanup needed
}; 
