import { VisualEffect } from '../types/visualEffects';
import { getOverlayZIndex, OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';
import { createEffectMap, getEffectById } from './effectLookup';
import { CONTAINER_SELECTORS } from './appConstants';

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
 */
const createOverlay = (
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
    
    // Try multiple selectors to find the container
    let container: Element | null = null;
    
    for (const selector of CONTAINER_SELECTORS) {
      if (selector === 'iframe[src*="youtube"]') {
        // Special handling for iframe - get its parent
        const iframe = document.querySelector(selector);
        if (iframe) {
          container = iframe.parentElement;
          break;
        }
      } else if (selector === 'canvas') {
        // Special handling for canvas - get its parent
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
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
    }
    
    // Force the container to have relative positioning if it doesn't
    if (container && container instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
      }
    }
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
const createOverlayWithContainer = (
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
  
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = id;
    Object.assign(overlayElement.style, {
      ...OVERLAY_BASE_STYLES,
      zIndex: getOverlayZIndex(conditionId || '', Z_INDEX.BASE)
    });
    
    // Use provided container or try to find one
    let container: Element | null = targetContainer || null;
    
    if (!container) {
      // Try multiple selectors to find the container
      for (const selector of CONTAINER_SELECTORS) {
        if (selector === 'iframe[src*="youtube"]') {
          // Special handling for iframe - get its parent
          const iframe = document.querySelector(selector);
          if (iframe) {
            container = iframe.parentElement;
            break;
          }
        } else if (selector === 'canvas') {
          // Special handling for canvas - get its parent
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
    }
    
    if (container) {
      container.appendChild(overlayElement);

    } else {
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);

    }
  }

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
  
  const [
    tunnelVision, quadrantanopiaLeft, quadrantanopiaRight, quadrantanopiaInferior, quadrantanopiaSuperior,
    hemianopiaLeft, hemianopiaRight, blindnessLeftEye, blindnessRightEye, bitemporalHemianopia, scotoma, 
    visualFloaters, visualAura, visualAuraLeft, visualAuraRight, visualSnow, hallucinations, glaucoma, amd, diabeticRetinopathy, stargardt, retinitisPigmentosa, retinalDetachment,
    miltonProgressiveVignetting, miltonRetinalDetachment, miltonGlaucomaHalos,
    miltonPhotophobia, miltonTemporalFieldLoss, completeBlindness,
    galileoSectoralDefects, galileoArcuateScotomas, galileoSwissCheeseVision, galileoChronicProgression,
    vedCompleteBlindness, vedSpatialAwareness, vedEchoLocation, vedAirFlowSensors, vedProximityRadar, vedTemperatureMapping,
    christineSteamyMirror, christineLightScatter, christineFogOverlay, christineFluctuatingVision, christineNMOComplete,
    lucyFrostedGlass, lucyHeavyBlur, lucyDesaturation, lucyLightDiffusion, lucyTextureOverlay, lucyCompleteVision,
    davidLeftEyeBlindness, davidRightEyeGlaucoma, davidHemisphericVision, davidCompleteVision,
    erikRetinoschisisIslands, erikIslandFragmentation, erikProgressiveLoss, erikCompleteBlindness, erikScanningBehavior, erikCognitiveLoad,
    marlaCentralScotoma, marlaPeripheralVision, marlaEccentricViewing, marlaFillingIn, marlaCrowdingEffect, marlaStargardtComplete,
    minkaraEndStageComplete, minkaraCentralScotoma, minkaraRingScotoma, minkaraPeripheralIslands, minkaraPhotophobia, minkaraAchromatopsia, minkaraNightBlindness, minkaraChemistryMode,
    joshuaCompleteBlindness, joshuaEcholocation, joshuaTactileMaps, joshuaAudioLandscape, joshuaAccessibilityMode, joshuaSonification,
    keratoconus, vitreousHemorrhage
  ] = [
    'tunnelVision', 'quadrantanopiaLeft', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior',
    'hemianopiaLeft', 'hemianopiaRight', 'blindnessLeftEye', 'blindnessRightEye', 'bitemporalHemianopia', 'scotoma',
    'visualFloaters', 'visualAura', 'visualAuraLeft', 'visualAuraRight', 'visualSnow', 'hallucinations', 'glaucoma', 'amd', 'diabeticRetinopathy', 'stargardt', 'retinitisPigmentosa', 'retinalDetachment',
    'miltonProgressiveVignetting', 'miltonRetinalDetachment', 'miltonGlaucomaHalos',
    'miltonPhotophobia', 'miltonTemporalFieldLoss', 'completeBlindness',
    'galileoSectoralDefects', 'galileoArcuateScotomas', 'galileoSwissCheeseVision', 'galileoChronicProgression',
    'vedCompleteBlindness', 'vedSpatialAwareness', 'vedEchoLocation', 'vedAirFlowSensors', 'vedProximityRadar', 'vedTemperatureMapping',
    'christineSteamyMirror', 'christineLightScatter', 'christineFogOverlay', 'christineFluctuatingVision', 'christineNMOComplete',
    'lucyFrostedGlass', 'lucyHeavyBlur', 'lucyDesaturation', 'lucyLightDiffusion', 'lucyTextureOverlay', 'lucyCompleteVision',
    'davidLeftEyeBlindness', 'davidRightEyeGlaucoma', 'davidHemisphericVision', 'davidCompleteVision',
    'erikRetinoschisisIslands', 'erikIslandFragmentation', 'erikProgressiveLoss', 'erikCompleteBlindness', 'erikScanningBehavior', 'erikCognitiveLoad',
    'marlaCentralScotoma', 'marlaPeripheralVision', 'marlaEccentricViewing', 'marlaFillingIn', 'marlaCrowdingEffect', 'marlaStargardtComplete',
    'minkaraEndStageComplete', 'minkaraCentralScotoma', 'minkaraRingScotoma', 'minkaraPeripheralIslands', 'minkaraPhotophobia', 'minkaraAchromatopsia', 'minkaraNightBlindness', 'minkaraChemistryMode',
    'joshuaCompleteBlindness', 'joshuaEcholocation', 'joshuaTactileMaps', 'joshuaAudioLandscape', 'joshuaAccessibilityMode', 'joshuaSonification',
    'keratoconus', 'vitreousHemorrhage'
  ].map(getEffect);
  // Note: diplopia is handled by shader effects, not overlays
  // Retinitis Pigmentosa is now handled by both shaders (for webcam) and overlays (for YouTube/images)

  // Create overlays for each enabled effect
  if (tunnelVision?.enabled) {
    createOverlay(
      'visual-field-overlay-tunnelVision',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(20, 35 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) ${Math.max(40, 55 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, tunnelVision.intensity).toString(),
      undefined,
      undefined,
      'tunnelVision'
    );
  }

  if (quadrantanopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaLeft',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaLeft.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaLeft'
    );
  }

  if (quadrantanopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaRight',
      `radial-gradient(circle at 0% 100%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(25, 40 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,1) ${Math.max(45, 60 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,1) 100%
      )`,
      'normal',
      '1',
      undefined,
      undefined,
      'quadrantanopiaRight'
    );
  }

  if (quadrantanopiaInferior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,${quadrantanopiaInferior.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferior.intensity}) 0deg, 
        rgba(0,0,0,${quadrantanopiaInferior.intensity === 1 ? 1 : 0.95 * quadrantanopiaInferior.intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      quadrantanopiaInferior.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaInferior.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaInferior.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaInferior'
    );
  }

  if (quadrantanopiaSuperior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${quadrantanopiaSuperior.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperior.intensity}) 90deg, 
        rgba(0,0,0,${quadrantanopiaSuperior.intensity === 1 ? 1 : 0.95 * quadrantanopiaSuperior.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      quadrantanopiaSuperior.intensity === 1 ? 'normal' : 'multiply',
      quadrantanopiaSuperior.intensity === 1 ? '1' : Math.min(0.95, quadrantanopiaSuperior.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperior'
    );
  }

  if (hemianopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaLeft',
      `linear-gradient(to right, 
        rgba(0,0,0,${hemianopiaLeft.intensity === 1 ? 1 : 0.95 * hemianopiaLeft.intensity}) 0%, 
        rgba(0,0,0,${hemianopiaLeft.intensity === 1 ? 1 : 0.95 * hemianopiaLeft.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      hemianopiaLeft.intensity === 1 ? 'normal' : 'multiply',
      hemianopiaLeft.intensity === 1 ? '1' : Math.min(0.95, hemianopiaLeft.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaLeft'
    );
  }

  if (hemianopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaRight',
      `linear-gradient(to left, 
        rgba(0,0,0,${hemianopiaRight.intensity === 1 ? 1 : 0.95 * hemianopiaRight.intensity}) 0%, 
        rgba(0,0,0,${hemianopiaRight.intensity === 1 ? 1 : 0.95 * hemianopiaRight.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      hemianopiaRight.intensity === 1 ? 'normal' : 'multiply',
      hemianopiaRight.intensity === 1 ? '1' : Math.min(0.95, hemianopiaRight.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaRight'
    );
  }

  if (blindnessLeftEye?.enabled) {
    createOverlay(
      'visual-field-overlay-blindnessLeftEye',
      `linear-gradient(to right, 
        rgba(0,0,0,${blindnessLeftEye.intensity === 1 ? 1 : 0.95 * blindnessLeftEye.intensity}) 0%, 
        rgba(0,0,0,${blindnessLeftEye.intensity === 1 ? 1 : 0.95 * blindnessLeftEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
      )`,
      blindnessLeftEye.intensity === 1 ? 'normal' : 'multiply',
      blindnessLeftEye.intensity === 1 ? '1' : Math.min(0.95, blindnessLeftEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessLeftEye'
    );
  }

  if (blindnessRightEye?.enabled) {
    createOverlay(
      'visual-field-overlay-blindnessRightEye',
      `linear-gradient(to left, 
        rgba(0,0,0,${blindnessRightEye.intensity === 1 ? 1 : 0.95 * blindnessRightEye.intensity}) 0%, 
        rgba(0,0,0,${blindnessRightEye.intensity === 1 ? 1 : 0.95 * blindnessRightEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
      )`,
      blindnessRightEye.intensity === 1 ? 'normal' : 'multiply',
      blindnessRightEye.intensity === 1 ? '1' : Math.min(0.95, blindnessRightEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessRightEye'
    );
  }

  if (bitemporalHemianopia?.enabled) {
    createOverlay(
      'visual-field-overlay-bitemporalHemianopia',
      `linear-gradient(to right, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 0%, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 25%, 
        rgba(0,0,0,0) 25%,
        rgba(0,0,0,0) 75%,
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 75%, 
        rgba(0,0,0,${bitemporalHemianopia.intensity === 1 ? 1 : 0.95 * bitemporalHemianopia.intensity}) 100%
      )`,
      bitemporalHemianopia.intensity === 1 ? 'normal' : 'multiply',
      bitemporalHemianopia.intensity === 1 ? '1' : Math.min(0.95, bitemporalHemianopia.intensity).toString(),
      undefined,
      undefined,
      'bitemporalHemianopia'
    );
  }

  if (scotoma?.enabled) {
    const intensity = scotoma.intensity;
    
    // Calculate scotoma size based on intensity - larger at 100%
    const scotomaSize = Math.max(15, 10 + intensity * 20); // 15% at 0%, 30% at 100%
    const blackIntensity = intensity; // Full black at 100%
    
    // Create centered scotoma using radial gradient
    createOverlay(
      'visual-field-overlay-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'scotoma'
    );
  }

  if (visualFloaters?.enabled) {
    // Simplified visual floaters for better performance
    const intensity = visualFloaters.intensity;
    
    // Use simpler, static patterns instead of complex animated calculations
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

  if (glaucoma?.enabled) {
    const intensity = glaucoma.intensity;
    
    // Create complex glaucoma overlay with multiple scotomas and peripheral loss
    let glaucomaBackground = '';
    
    // Early stage: Small paracentral scotomas (10-20 degrees from center)
    if (intensity > 0.1) {
      // Superior paracentral scotoma
      glaucomaBackground += `
        radial-gradient(circle at 65% 40%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(3, 8 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(8, 15 - intensity * 7)}%,
          rgba(0,0,0,0) ${Math.max(15, 25 - intensity * 10)}%
        ),
      `;
      
      // Inferior paracentral scotoma
      glaucomaBackground += `
        radial-gradient(circle at 35% 60%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(2, 6 - intensity * 4)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(6, 12 - intensity * 6)}%,
          rgba(0,0,0,0) ${Math.max(12, 20 - intensity * 8)}%
        ),
      `;
    }
    
    // Moderate stage: Arc-shaped defects (arcuate scotomas)
    if (intensity > 0.3) {
      // Superior arcuate scotoma
      glaucomaBackground += `
        conic-gradient(from 0deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 120deg, 
          rgba(0,0,0,0) 120deg, 
          rgba(0,0,0,0) 360deg
        ),
      `;
      
      // Inferior arcuate scotoma
      glaucomaBackground += `
        conic-gradient(from 180deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 60deg, 
          rgba(0,0,0,${0.85 * intensity}) 60deg, 
          rgba(0,0,0,${0.85 * intensity}) 120deg, 
          rgba(0,0,0,0) 120deg, 
          rgba(0,0,0,0) 360deg
        ),
      `;
    }
    
    // Advanced stage: Peripheral constriction (tunnel vision)
    if (intensity > 0.5) {
      const tunnelRadius = Math.max(20, 60 - intensity * 50); // From 60% to 20% of screen
      glaucomaBackground += `
        radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${tunnelRadius - 10}%,
          rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        ),
      `;
    }
    
    // End stage: Severe constriction
    if (intensity > 0.8) {
      const severeRadius = Math.max(5, 20 - (intensity - 0.8) * 15); // Down to 5% of screen
      glaucomaBackground += `
        radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${severeRadius - 3}%,
          rgba(0,0,0,${0.98 * intensity}) ${severeRadius}%,
          rgba(0,0,0,${0.98 * intensity}) 100%
        ),
      `;
    }
    
    // Only create overlay if we have a background to apply
    if (glaucomaBackground.trim().length > 0) {
      // Remove trailing comma
      glaucomaBackground = glaucomaBackground.trim().replace(/,\s*$/, '');
      
      // Use createOverlayWithContainer if container is provided, otherwise use createOverlay
      if (container) {
        createOverlayWithContainer(
          'visual-field-overlay-glaucoma',
          glaucomaBackground,
          'multiply',
          Math.min(0.95, intensity).toString(),
          undefined,
          undefined,
          'glaucoma',
          container
        );
      } else {
        createOverlay(
          'visual-field-overlay-glaucoma',
          glaucomaBackground,
          'multiply',
          Math.min(0.95, intensity).toString(),
          undefined,
          undefined,
          'glaucoma'
        );
      }
    } else {
      // For very low intensity, create a subtle overlay to ensure visibility
      const subtleBackground = `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,${0.1 * intensity}) 80%,
        rgba(0,0,0,${0.2 * intensity}) 100%
      )`;
      
      if (container) {
        createOverlayWithContainer(
          'visual-field-overlay-glaucoma',
          subtleBackground,
          'multiply',
          Math.min(0.3, intensity).toString(),
          undefined,
          undefined,
          'glaucoma',
          container
        );
      } else {
        createOverlay(
          'visual-field-overlay-glaucoma',
          subtleBackground,
          'multiply',
          Math.min(0.3, intensity).toString(),
          undefined,
          undefined,
          'glaucoma'
        );
      }
    }
  }

  if (stargardt?.enabled) {
    const intensity = stargardt.intensity;
    const scotomaRadius = 17 + intensity * 53; // 17% to 70% of screen
    
    createOverlay(
      'visual-field-overlay-stargardt',
      `radial-gradient(circle at 50% 50%, 
        rgba(10,10,10,${0.99 * intensity}) 0%, 
        rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
        rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
        rgba(0,0,0,0) ${scotomaRadius + 5}%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      `saturate(${1 - intensity * 0.4})`, // Color desaturation
      undefined,
      'stargardt'
    );
  }

  // Age-Related Macular Degeneration (AMD) - Central scotoma
  if (amd?.enabled) {
    const intensity = amd.intensity;
    // AMD causes central vision loss (central scotoma) while preserving peripheral vision
    // Based on NIH research: "Central vision loss makes things appear blurry or distorted, particularly when you look at them directly"
    const amdRadius = Math.max(15, 52 - intensity * 37); // Central scotoma size based on intensity (30% larger at 100%)
    
    createOverlay(
      'visual-field-overlay-amd',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
        rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
        rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
        rgba(0,0,0,0) ${amdRadius + 10}%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'amd'
    );
  }

  // Diabetic Retinopathy - Multiple symptoms: microaneurysms, cotton wool spots, vitreous hemorrhages, macular edema
  if (diabeticRetinopathy?.enabled) {
    const intensity = diabeticRetinopathy.intensity;
    // Based on detailed medical description: microaneurysms, cotton wool spots, macular edema, vitreous hemorrhages
    
    // Microaneurysms and small hemorrhages - dark spots scattered across the retina
    const microaneurysms = `
      radial-gradient(circle 3px at 25% 35%, 
        rgba(0,0,0,${0.9 * intensity}) 0%, 
        rgba(0,0,0,${0.6 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 65% 55%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 4px at 45% 75%, 
        rgba(0,0,0,${0.7 * intensity}) 0%, 
        rgba(0,0,0,${0.4 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2.5px at 80% 25%, 
        rgba(0,0,0,${0.85 * intensity}) 0%, 
        rgba(0,0,0,${0.55 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 3px at 30% 60%, 
        rgba(0,0,0,${0.75 * intensity}) 0%, 
        rgba(0,0,0,${0.45 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 70% 40%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      )
    `;
    
    // Cotton wool spots - larger, more prominent white areas
    const cottonWoolSpots = `
      radial-gradient(ellipse 15px 10px at 60% 40%, 
        rgba(255,255,255,${0.6 * intensity}) 0%, 
        rgba(255,255,255,${0.3 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 12px 8px at 30% 70%, 
        rgba(255,255,255,${0.5 * intensity}) 0%, 
        rgba(255,255,255,${0.25 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 10px 7px at 55% 20%, 
        rgba(255,255,255,${0.4 * intensity}) 0%, 
        rgba(255,255,255,${0.2 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      )
    `;
    
    // Vitreous hemorrhage - reddish tint over central area
    const vitreousHemorrhage = `
      radial-gradient(circle at 50% 50%, 
        rgba(139,0,0,${0.3 * intensity}) 0%, 
        rgba(139,0,0,${0.2 * intensity}) 30%,
        rgba(139,0,0,${0.1 * intensity}) 60%,
        rgba(139,0,0,0) 100%
      )
    `;
    
    // Combine all symptoms
    const diabeticRetinopathyBackground = `${microaneurysms}, ${cottonWoolSpots}, ${vitreousHemorrhage}`;
    
    createOverlay(
      'visual-field-overlay-diabeticRetinopathy',
      diabeticRetinopathyBackground,
      'normal',
      Math.min(0.9, intensity).toString(),
      // Macular edema effects: blur, brightness, contrast, saturation, sepia
      `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`,
      undefined,
      'diabeticRetinopathy'
    );
  }

  // Retinal Detachment - Curtain-like shadow moving across vision
  if (retinalDetachment?.enabled) {
    const intensity = retinalDetachment.intensity;
    // Medical emergency where the retina separates from underlying tissue
    // Symptoms include sudden increase in floaters, flashes of light, and a curtain-like shadow moving across vision
    // At detachment margins, vision may be distorted (metamorphopsia)
    
    // Curtain-like shadow progressing from top (most common presentation)
    // The shadow can also come from sides or bottom depending on detachment location
    createOverlay(
      'visual-field-overlay-retinalDetachment',
      `linear-gradient(to bottom, 
        rgba(0,0,0,${0.9 * intensity}) 0%,
        rgba(0,0,0,${0.8 * intensity}) 15%,
        rgba(0,0,0,${0.6 * intensity}) 30%,
        rgba(0,0,0,${0.4 * intensity}) 45%,
        rgba(0,0,0,${0.2 * intensity}) 60%,
        rgba(0,0,0,0) 75%
      )`,
      'multiply',
      Math.min(0.8, intensity).toString(),
      // Metamorphopsia (distortion at detachment margins): blur and slight hue rotation
      `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`,
      undefined,
      'retinalDetachment'
    );
  }

  // Hyperopia is now handled by CSS filters (like Myopia), not DOM overlays

  // Diplopia effects are handled by WebGL shaders, not DOM overlays
  // This ensures consistent diplopia rendering across all content types

  // Retinitis Pigmentosa - Progressive tunnel vision with peripheral vision loss
  // Now handled by both shaders (for webcam) and overlays (for YouTube/images)
  if (retinitisPigmentosa?.enabled) {
    const intensity = retinitisPigmentosa.intensity;
    // Create severe tunnel vision effect - very narrow central vision
    // At 100% intensity, tunnel should be extremely narrow (3-5% of screen)
    const tunnelRadius = Math.max(3, 30 - intensity * 27); // From 30% to 3% of screen
    
    // Create irregular, asymmetrical tunnel shape (more oval, not perfect circle)
    // Use radial gradient with elliptical shape for more realistic effect
    createOverlay(
      'visual-field-overlay-retinitisPigmentosa',
      `radial-gradient(ellipse 100% 130% at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 2}%,
        rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.7 * intensity}) ${tunnelRadius + 3}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 8}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'retinitisPigmentosa'
    );
  }

  // John Milton-specific overlays for bilateral retinal detachment and secondary glaucoma
  
  if (miltonProgressiveVignetting?.enabled) {
    const intensity = miltonProgressiveVignetting.intensity;
    const tunnelRadius = Math.max(5, 40 - intensity * 35); // From 40% to 5% of screen
    
    createOverlay(
      'visual-field-overlay-miltonProgressiveVignetting',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 5}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'miltonProgressiveVignetting'
    );
  }

  if (miltonTemporalFieldLoss?.enabled) {
    const intensity = miltonTemporalFieldLoss.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonTemporalFieldLoss',
      `linear-gradient(90deg, 
        rgba(0,0,0,${0.95 * intensity}) 0%,
        rgba(0,0,0,${0.95 * intensity}) 20%,
        rgba(0,0,0,0) 30%,
        rgba(0,0,0,0) 70%,
        rgba(0,0,0,${0.95 * intensity}) 80%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'miltonTemporalFieldLoss'
    );
  }

  if (miltonRetinalDetachment?.enabled) {
    const intensity = miltonRetinalDetachment.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonRetinalDetachment',
      `linear-gradient(180deg, 
        rgba(0,0,0,${0.8 * intensity}) 0%,
        rgba(0,0,0,${0.8 * intensity}) 30%,
        rgba(0,0,0,0) 40%,
        rgba(0,0,0,0) 60%,
        rgba(0,0,0,${0.6 * intensity}) 70%,
        rgba(0,0,0,${0.6 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.8, intensity).toString(),
      undefined,
      undefined,
      'miltonRetinalDetachment'
    );
  }

  if (miltonPhotophobia?.enabled) {
    const intensity = miltonPhotophobia.intensity;
    
    createOverlay(
      'visual-field-overlay-miltonPhotophobia',
      `rgba(255,255,255,${0.6 * intensity})`,
      'screen',
      Math.min(0.6, intensity).toString(),
      `brightness(${1 + intensity * 2}) contrast(${1 - intensity * 0.7})`,
      undefined,
      'miltonPhotophobia'
    );
  }

  // Note: miltonGlaucomaHalos, miltonScotomas, and miltonProgressiveBlindness are handled by shader effects

  // Complete Blindness - total darkness overlay
  if (completeBlindness?.enabled) {
    const intensity = completeBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-completeBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'completeBlindness'
    );
  }

  // Ved Mehta - Complete Blindness with Spatial Awareness Systems
  if (vedCompleteBlindness?.enabled) {
    const intensity = vedCompleteBlindness.intensity;
    
    createOverlay(
      'visual-field-overlay-vedCompleteBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'vedCompleteBlindness'
    );
  }

  // Ved Mehta - Spatial Awareness System (abstract spatial representation)
  if (vedSpatialAwareness?.enabled) {
    const intensity = vedSpatialAwareness.intensity;
    
    // Create a complex overlay with abstract spatial indicators - muted colors
    createOverlay(
      'visual-field-overlay-vedSpatialAwareness',
      `radial-gradient(circle at 50% 50%, transparent 0%, rgba(80,80,80,${intensity * 0.2}) 20%, rgba(60,60,60,${intensity * 0.3}) 40%, rgba(40,40,40,${intensity * 0.4}) 60%, rgba(20,20,20,${intensity * 0.5}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedSpatialAwareness'
    );
  }

  // Ved Mehta - Echo Location Patterns
  if (vedEchoLocation?.enabled) {
    const intensity = vedEchoLocation.intensity;
    
    // Create concentric circles representing echo patterns - muted green
    createOverlay(
      'visual-field-overlay-vedEchoLocation',
      `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(100,120,100,${intensity * 0.15}) 45deg, transparent 90deg, rgba(100,120,100,${intensity * 0.15}) 135deg, transparent 180deg, rgba(100,120,100,${intensity * 0.15}) 225deg, transparent 270deg, rgba(100,120,100,${intensity * 0.15}) 315deg, transparent 360deg)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedEchoLocation'
    );
  }

  // Ved Mehta - Air Flow Sensors
  if (vedAirFlowSensors?.enabled) {
    const intensity = vedAirFlowSensors.intensity;
    
    // Create flowing patterns representing air currents - muted blue
    createOverlay(
      'visual-field-overlay-vedAirFlowSensors',
      `linear-gradient(45deg, transparent 0%, rgba(120,130,140,${intensity * 0.2}) 25%, transparent 50%, rgba(120,130,140,${intensity * 0.2}) 75%, transparent 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedAirFlowSensors'
    );
  }

  // Ved Mehta - Proximity Radar
  if (vedProximityRadar?.enabled) {
    const intensity = vedProximityRadar.intensity;
    
    // Create radar-like proximity indicators - muted orange
    createOverlay(
      'visual-field-overlay-vedProximityRadar',
      `radial-gradient(circle at 20% 20%, rgba(140,120,100,${intensity * 0.25}) 0%, transparent 10%), radial-gradient(circle at 80% 30%, rgba(140,120,100,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 80%, rgba(140,120,100,${intensity * 0.3}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedProximityRadar'
    );
  }

  // Ved Mehta - Temperature Mapping
  if (vedTemperatureMapping?.enabled) {
    const intensity = vedTemperatureMapping.intensity;
    
    // Create temperature gradient visualization - muted colors
    createOverlay(
      'visual-field-overlay-vedTemperatureMapping',
      `linear-gradient(135deg, rgba(120,100,100,${intensity * 0.15}) 0%, rgba(130,120,100,${intensity * 0.2}) 25%, rgba(140,140,120,${intensity * 0.15}) 50%, rgba(100,130,130,${intensity * 0.2}) 75%, rgba(100,100,120,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedTemperatureMapping'
    );
  }

  // Christine Ha - NMO Effects
  // Steamy Mirror Effect
  if (christineSteamyMirror?.enabled) {
    const intensity = christineSteamyMirror.intensity;
    
    // Create steamy mirror overlay - white/gray fog
    createOverlay(
      'visual-field-overlay-christineSteamyMirror',
      `rgba(255,255,255,${intensity * 0.7})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineSteamyMirror'
    );
  }

  // Light Scatter & Halos
  if (christineLightScatter?.enabled) {
    const intensity = christineLightScatter.intensity;
    
    // Create light scatter effect with halos
    createOverlay(
      'visual-field-overlay-christineLightScatter',
      `radial-gradient(circle at 30% 20%, rgba(255,255,255,${intensity * 0.4}) 0%, transparent 15%), radial-gradient(circle at 70% 80%, rgba(255,255,255,${intensity * 0.3}) 0%, transparent 12%), radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.2}) 0%, transparent 20%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineLightScatter'
    );
  }

  // Animated Fog Overlay
  if (christineFogOverlay?.enabled) {
    const intensity = christineFogOverlay.intensity;
    
    // Create animated fog overlay with varying density
    createOverlay(
      'visual-field-overlay-christineFogOverlay',
      `linear-gradient(45deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(240,240,240,${intensity * 0.5}) 25%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(240,240,240,${intensity * 0.4}) 75%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFogOverlay'
    );
  }

  // Fluctuating Vision
  if (christineFluctuatingVision?.enabled) {
    const intensity = christineFluctuatingVision.intensity;
    
    // Create fluctuating vision effect with subtle variations
    createOverlay(
      'visual-field-overlay-christineFluctuatingVision',
      `rgba(255,255,255,${intensity * 0.1})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineFluctuatingVision'
    );
  }

  // Complete NMO Experience
  if (christineNMOComplete?.enabled) {
    const intensity = christineNMOComplete.intensity;
    
    // Create complete NMO experience combining all effects
    createOverlay(
      'visual-field-overlay-christineNMOComplete',
      `rgba(255,255,255,${intensity * 0.6})`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'christineNMOComplete'
    );
  }

  // Lucy Edwards - Incontinentia Pigmenti Effects
  // Frosted Glass Effect
  if (lucyFrostedGlass?.enabled) {
    const intensity = lucyFrostedGlass.intensity;
    
    // Create dark blurred overlay - not bright frosted glass
    createOverlay(
      'visual-field-overlay-lucyFrostedGlass',
      `rgba(80,60,40,${intensity * 0.6})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyFrostedGlass'
    );
  }

  // Heavy Blur
  if (lucyHeavyBlur?.enabled) {
    const intensity = lucyHeavyBlur.intensity;
    
    // Create dark heavy blur overlay
    createOverlay(
      'visual-field-overlay-lucyHeavyBlur',
      `rgba(60,40,30,${intensity * 0.7})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyHeavyBlur'
    );
  }

  // Desaturation
  if (lucyDesaturation?.enabled) {
    const intensity = lucyDesaturation.intensity;
    
    // Create warm, muted colors overlay - reddish-browns and earth tones
    createOverlay(
      'visual-field-overlay-lucyDesaturation',
      `linear-gradient(45deg, rgba(120,80,60,${intensity * 0.5}) 0%, rgba(100,70,50,${intensity * 0.4}) 50%, rgba(140,90,70,${intensity * 0.5}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyDesaturation'
    );
  }

  // Light Diffusion
  if (lucyLightDiffusion?.enabled) {
    const intensity = lucyLightDiffusion.intensity;
    
    // Create dark atmospheric light diffusion with warm tones
    createOverlay(
      'visual-field-overlay-lucyLightDiffusion',
      `radial-gradient(circle at 25% 25%, rgba(160,100,80,${intensity * 0.4}) 0%, transparent 20%), radial-gradient(circle at 75% 75%, rgba(140,90,70,${intensity * 0.3}) 0%, transparent 15%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyLightDiffusion'
    );
  }

  // Texture Overlay
  if (lucyTextureOverlay?.enabled) {
    const intensity = lucyTextureOverlay.intensity;
    
    // Create dark amorphous texture overlay with warm tones
    createOverlay(
      'visual-field-overlay-lucyTextureOverlay',
      `radial-gradient(ellipse at 30% 20%, rgba(100,70,50,${intensity * 0.6}) 0%, transparent 25%), radial-gradient(ellipse at 70% 80%, rgba(80,60,40,${intensity * 0.5}) 0%, transparent 20%), radial-gradient(ellipse at 50% 50%, rgba(120,80,60,${intensity * 0.4}) 0%, transparent 30%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyTextureOverlay'
    );
  }

  // Complete Vision
  if (lucyCompleteVision?.enabled) {
    const intensity = lucyCompleteVision.intensity;
    
    // Create complete vision overlay - dark, warm, atmospheric
    createOverlay(
      'visual-field-overlay-lucyCompleteVision',
      `rgba(90,60,40,${intensity * 0.8})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyCompleteVision'
    );
  }

  // David Paterson - Hemispheric Vision Loss Effects
  // Left Eye Blindness - Complete blackness in left hemisphere
  if (davidLeftEyeBlindness?.enabled) {
    const intensity = davidLeftEyeBlindness.intensity;
    
    // Create left hemisphere black overlay using clip-path
    createOverlay(
      'visual-field-overlay-davidLeftEyeBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)', // Left half of screen
      undefined,
      'davidLeftEyeBlindness'
    );
  }

  // Right Eye Glaucoma - Blurry/opaque effect in right hemisphere
  if (davidRightEyeGlaucoma?.enabled) {
    const intensity = davidRightEyeGlaucoma.intensity;
    
    // Create right hemisphere glaucoma blur/opacity overlay with yellow tint and more transparency
    createOverlay(
      'visual-field-overlay-davidRightEyeGlaucoma',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.1}) 0%, rgba(255,255,200,${intensity * 0.18}) 50%, rgba(255,255,180,${intensity * 0.1}) 100%)`,
      'screen',
      intensity.toString(),
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', // Right half of screen
      undefined,
      'davidRightEyeGlaucoma'
    );
  }

  // Hemispheric Vision - Combined left blindness and right glaucoma
  if (davidHemisphericVision?.enabled) {
    const intensity = davidHemisphericVision.intensity;
    
    // Left hemisphere - complete blackness
    createOverlay(
      'visual-field-overlay-davidHemisphericVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)', // Left half
      undefined,
      'davidHemisphericVision-left'
    );
    
    // Right hemisphere - glaucoma blur/opacity effect with yellow tint and more transparency
    createOverlay(
      'visual-field-overlay-davidHemisphericVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', // Right half
      undefined,
      'davidHemisphericVision-right'
    );
  }

  // Complete Vision - Full hemispheric vision loss
  if (davidCompleteVision?.enabled) {
    const intensity = davidCompleteVision.intensity;
    
    // Left hemisphere - complete blackness from optic nerve damage
    createOverlay(
      'visual-field-overlay-davidCompleteVision-left',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)', // Left half
      undefined,
      'davidCompleteVision-left'
    );
    
    // Right hemisphere - glaucoma effect with yellow tint and more transparency
    createOverlay(
      'visual-field-overlay-davidCompleteVision-right',
      `linear-gradient(to right, rgba(0,0,0,${intensity * 0.15}) 0%, rgba(255,255,200,${intensity * 0.2}) 50%, rgba(255,255,180,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', // Right half
      undefined,
      'davidCompleteVision-right'
    );
  }

  // Erik Weihenmayer - Retinoschisis Island Vision Loss Effects
  // Retinoschisis Islands - Random, irregular islands of vision
  if (erikRetinoschisisIslands?.enabled) {
    const intensity = erikRetinoschisisIslands.intensity;
    
    // Create multiple irregular island overlays with sharp boundaries
    // Island 1 - Upper left
    createOverlay(
      'visual-field-overlay-erikIsland1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(15% 10%, 35% 8%, 40% 25%, 25% 30%, 10% 20%)', // Irregular island shape
      undefined,
      'erikIsland1'
    );
    
    // Island 2 - Center right
    createOverlay(
      'visual-field-overlay-erikIsland2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(65% 40%, 85% 35%, 90% 55%, 75% 65%, 60% 50%)', // Irregular island shape
      undefined,
      'erikIsland2'
    );
    
    // Island 3 - Lower left
    createOverlay(
      'visual-field-overlay-erikIsland3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(20% 70%, 45% 65%, 50% 85%, 30% 90%, 15% 80%)', // Irregular island shape
      undefined,
      'erikIsland3'
    );
  }

  // Island Fragmentation - Islands become smaller and more scattered
  if (erikIslandFragmentation?.enabled) {
    const intensity = erikIslandFragmentation.intensity;
    
    // Create smaller, more fragmented islands
    // Fragment 1 - Tiny upper right
    createOverlay(
      'visual-field-overlay-erikFragment1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(70% 15%, 80% 12%, 85% 25%, 75% 28%, 65% 20%)', // Small fragment
      undefined,
      'erikFragment1'
    );
    
    // Fragment 2 - Center fragment
    createOverlay(
      'visual-field-overlay-erikFragment2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(45% 45%, 55% 42%, 60% 55%, 50% 58%, 40% 50%)', // Small fragment
      undefined,
      'erikFragment2'
    );
    
    // Fragment 3 - Lower right fragment
    createOverlay(
      'visual-field-overlay-erikFragment3',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(75% 75%, 90% 70%, 95% 85%, 80% 88%, 70% 80%)', // Small fragment
      undefined,
      'erikFragment3'
    );
  }

  // Progressive Loss - Fewer islands, showing progression to blindness
  if (erikProgressiveLoss?.enabled) {
    const intensity = erikProgressiveLoss.intensity;
    
    // Create fewer, smaller islands showing progression
    // Last island 1 - Upper center
    createOverlay(
      'visual-field-overlay-erikProgressive1',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(40% 20%, 60% 18%, 65% 35%, 45% 38%, 35% 25%)', // Medium island
      undefined,
      'erikProgressive1'
    );
    
    // Last island 2 - Lower center
    createOverlay(
      'visual-field-overlay-erikProgressive2',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      'polygon(35% 60%, 55% 58%, 60% 75%, 40% 78%, 30% 65%)', // Medium island
      undefined,
      'erikProgressive2'
    );
  }

  // Complete Blindness - Total darkness
  if (erikCompleteBlindness?.enabled) {
    const intensity = erikCompleteBlindness.intensity;
    
    // Complete black overlay - all islands have disappeared
    createOverlay(
      'visual-field-overlay-erikCompleteBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCompleteBlindness'
    );
  }

  // Scanning Behavior - Simulates the need to actively search for islands
  if (erikScanningBehavior?.enabled) {
    const intensity = erikScanningBehavior.intensity;
    
    // Create a subtle overlay that suggests the need for scanning
    createOverlay(
      'visual-field-overlay-erikScanningBehavior',
      `rgba(0,0,0,${intensity * 0.1})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikScanningBehavior'
    );
  }

  // Cognitive Load - Represents mental effort to piece together information
  if (erikCognitiveLoad?.enabled) {
    const intensity = erikCognitiveLoad.intensity;
    
    // Create subtle overlay representing cognitive burden
    createOverlay(
      'visual-field-overlay-erikCognitiveLoad',
      `rgba(0,0,0,${intensity * 0.05})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikCognitiveLoad'
    );
  }

  // Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Effects
  // (Effects are now properly looked up in the main lookup array above)

  // Joshua Miele - Chemical Burn Complete Blindness Effects
  // (Effects are now properly looked up in the main lookup array above)

  // Marla Runyan - Stargardt Disease Central Scotoma Effects
  // Central Scotoma - Large central blind spot (20-30 degrees)
  if (marlaCentralScotoma?.enabled) {
    const intensity = marlaCentralScotoma.intensity;
    
    // Calculate scotoma size based on intensity - larger at 100%
    const scotomaSize = Math.max(20, 15 + intensity * 25); // 20% at 0%, 40% at 100%
    const blackIntensity = intensity; // Full black at 100%
    
    // Create central scotoma using radial gradient - centered and larger at 100%
    createOverlay(
      'visual-field-overlay-marlaCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.6}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCentralScotoma'
    );
  }

  // Preserved Peripheral Vision - Clear vision outside central scotoma
  if (marlaPeripheralVision?.enabled) {
    const intensity = marlaPeripheralVision.intensity;
    
    // Create subtle enhancement for peripheral vision (motion detection, clarity)
    createOverlay(
      'visual-field-overlay-marlaPeripheralVision',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,${intensity * -0.1}) 60%, rgba(0,0,0,${intensity * -0.05}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaPeripheralVision'
    );
  }

  // Eccentric Viewing - Shows need to look away from center
  if (marlaEccentricViewing?.enabled) {
    const intensity = marlaEccentricViewing.intensity;
    
    // Create subtle indicators showing optimal viewing angles (PRL zones) - simplified
    createOverlay(
      'visual-field-overlay-marlaEccentricViewing',
      `radial-gradient(circle at 30% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(255,255,0,${intensity * 0.2}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaEccentricViewing'
    );
  }

  // Filling-In Phenomenon - Brain fills blind spot with surrounding patterns
  if (marlaFillingIn?.enabled) {
    const intensity = marlaFillingIn.intensity;
    
    // Create subtle pattern overlay in central area showing brain's filling-in attempt (simplified)
    createOverlay(
      'visual-field-overlay-marlaFillingIn',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.3}) 0%, rgba(200,200,200,${intensity * 0.15}) 30%, transparent 40%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaFillingIn'
    );
  }

  // Crowding Effect - Text/objects in near-periphery appear jumbled
  if (marlaCrowdingEffect?.enabled) {
    const intensity = marlaCrowdingEffect.intensity;
    
    // Create subtle distortion in near-peripheral areas where crowding occurs
    createOverlay(
      'visual-field-overlay-marlaCrowdingEffect',
      `radial-gradient(circle at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,${intensity * 0.1}) 45%, rgba(0,0,0,${intensity * 0.05}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaCrowdingEffect'
    );
  }

  // Complete Stargardt Experience - TRUE END-STAGE severity (default visualization)
  if (marlaStargardtComplete?.enabled) {
    const intensity = marlaStargardtComplete.intensity;
    
    // Central scotoma - MASSIVE VERY DARK gray void (40-50 degrees) - END-STAGE severity
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma',
      `radial-gradient(circle at 50% 50%, rgba(30,30,30,${intensity}) 0%, rgba(30,30,30,${intensity * 0.95}) 15%, rgba(30,30,30,${intensity * 0.8}) 25%, rgba(30,30,30,${intensity * 0.6}) 35%, rgba(30,30,30,${intensity * 0.4}) 45%, rgba(30,30,30,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma'
    );
    
    // Secondary scotoma layer - EXTREMELY DARK, WIDER void in center
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-scotoma-deep',
      `radial-gradient(circle at 50% 50%, rgba(20,20,20,${intensity}) 0%, rgba(20,20,20,${intensity * 0.95}) 15%, rgba(20,20,20,${intensity * 0.8}) 25%, rgba(20,20,20,${intensity * 0.6}) 35%, rgba(20,20,20,${intensity * 0.4}) 45%, rgba(20,20,20,${intensity * 0.2}) 55%, transparent 65%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-scotoma-deep'
    );
    
    // Filling-in phenomenon - minimal brain filling (end-stage) - wider coverage
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-filling',
      `radial-gradient(circle at 50% 50%, rgba(200,200,200,${intensity * 0.2}) 0%, rgba(200,200,200,${intensity * 0.1}) 25%, rgba(200,200,200,${intensity * 0.05}) 35%, rgba(200,200,200,${intensity * 0.02}) 45%, transparent 55%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-filling'
    );
    
    // Eccentric viewing indicators - more prominent for end-stage
    createOverlay(
      'visual-field-overlay-marlaStargardtComplete-eccentric',
      `radial-gradient(circle at 20% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 20%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 20% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 80%, rgba(255,255,0,${intensity * 0.4}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'marlaStargardtComplete-eccentric'
    );
  }

  // Dr. Mona Minkara - End-Stage Combined Vision Loss
  if (minkaraEndStageComplete?.enabled) {
    const intensity = minkaraEndStageComplete.intensity;
    
    // Massive central scotoma (35+ degrees) - complete blindness
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-central',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.95}) 15%, rgba(0,0,0,${intensity * 0.9}) 25%, rgba(0,0,0,${intensity * 0.8}) 35%, transparent 40%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-central'
    );
    
    // Ring scotoma around central scotoma (15-25 degrees)
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-ring',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-ring'
    );
    
    // Minimal peripheral crescents - only tiny functional areas
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-peripheral',
      `radial-gradient(circle at 10% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 10%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 10% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 90%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 5%, transparent 8%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-peripheral'
    );
    
    // Extreme photophobia - bright areas create massive bloom
    createOverlay(
      'visual-field-overlay-minkaraEndStageComplete-photophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraEndStageComplete-photophobia'
    );
  }

  // Individual Dr. Mona Minkara Effects
  if (minkaraCentralScotoma?.enabled) {
    const intensity = minkaraCentralScotoma.intensity;
    
    // Calculate massive scotoma size based on intensity - even larger at 100%
    const scotomaSize = Math.max(35, 30 + intensity * 20); // 35% at 0%, 50% at 100%
    const blackIntensity = intensity; // Full black at 100%
    
    // Massive central scotoma (35+ degrees) - centered and larger at 100%
    createOverlay(
      'visual-field-overlay-minkaraCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${blackIntensity}) 0%, rgba(0,0,0,${blackIntensity * 0.95}) ${scotomaSize - 10}%, rgba(0,0,0,${blackIntensity * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${blackIntensity * 0.8}) ${scotomaSize}%, rgba(0,0,0,${blackIntensity * 0.5}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraCentralScotoma'
    );
  }

  if (minkaraRingScotoma?.enabled) {
    const intensity = minkaraRingScotoma.intensity;
    
    // Ring scotoma around central area
    createOverlay(
      'visual-field-overlay-minkaraRingScotoma',
      `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity * 0.7}) 40%, rgba(0,0,0,${intensity * 0.5}) 45%, rgba(0,0,0,${intensity * 0.3}) 50%, transparent 55%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraRingScotoma'
    );
  }

  if (minkaraPeripheralIslands?.enabled) {
    const intensity = minkaraPeripheralIslands.intensity;
    
    // Small peripheral islands of limited vision
    createOverlay(
      'visual-field-overlay-minkaraPeripheralIslands',
      `radial-gradient(circle at 15% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 15%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 15% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 85%, rgba(0,0,0,${intensity * 0.8}) 0%, rgba(0,0,0,${intensity * 0.6}) 3%, transparent 6%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPeripheralIslands'
    );
  }

  if (minkaraPhotophobia?.enabled) {
    const intensity = minkaraPhotophobia.intensity;
    
    // Extreme photophobia with massive bloom effects
    createOverlay(
      'visual-field-overlay-minkaraPhotophobia',
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity * 0.9}) 0%, rgba(255,255,255,${intensity * 0.7}) 20%, rgba(255,255,255,${intensity * 0.4}) 40%, transparent 60%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraPhotophobia'
    );
  }

  if (minkaraAchromatopsia?.enabled) {
    const intensity = minkaraAchromatopsia.intensity;
    
    // Complete achromatopsia - grayscale overlay
    createOverlay(
      'visual-field-overlay-minkaraAchromatopsia',
      `linear-gradient(45deg, rgba(128,128,128,${intensity * 0.3}) 0%, rgba(128,128,128,${intensity * 0.2}) 50%, rgba(128,128,128,${intensity * 0.3}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraAchromatopsia'
    );
  }

  if (minkaraNightBlindness?.enabled) {
    const intensity = minkaraNightBlindness.intensity;
    
    // Severe night blindness - dark overlay
    createOverlay(
      'visual-field-overlay-minkaraNightBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity * 0.6}) 0%, rgba(0,0,0,${intensity * 0.4}) 50%, rgba(0,0,0,${intensity * 0.6}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraNightBlindness'
    );
  }

  if (minkaraChemistryMode?.enabled) {
    const intensity = minkaraChemistryMode.intensity;
    
    // Chemistry lab mode - sonification and tactile indicators
    createOverlay(
      'visual-field-overlay-minkaraChemistryMode',
      `radial-gradient(circle at 20% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 20%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 20% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 80%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'minkaraChemistryMode'
    );
  }

  // Joshua Miele - Complete Blindness from Chemical Burns
  if (joshuaCompleteBlindness?.enabled) {
    const intensity = joshuaCompleteBlindness.intensity;
    
    // Complete blindness - pure black screen with no light perception
    createOverlay(
      'visual-field-overlay-joshuaCompleteBlindness',
      `linear-gradient(45deg, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaCompleteBlindness'
    );
  }

  // Joshua Miele - Echolocation Navigation
  if (joshuaEcholocation?.enabled) {
    const intensity = joshuaEcholocation.intensity;
    
    // Radar-like echolocation visualization
    createOverlay(
      'visual-field-overlay-joshuaEcholocation',
      `radial-gradient(circle at 50% 50%, rgba(0,255,0,${intensity * 0.3}) 0%, rgba(0,255,0,${intensity * 0.2}) 20%, rgba(0,255,0,${intensity * 0.1}) 40%, transparent 60%), radial-gradient(circle at 30% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(0,255,0,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaEcholocation'
    );
  }

  // Joshua Miele - Tactile Map System
  if (joshuaTactileMaps?.enabled) {
    const intensity = joshuaTactileMaps.intensity;
    
    // Tactile map visualization with raised lines and braille
    createOverlay(
      'visual-field-overlay-joshuaTactileMaps',
      `linear-gradient(0deg, rgba(255,255,255,${intensity * 0.4}) 0%, rgba(255,255,255,${intensity * 0.2}) 50%, rgba(255,255,255,${intensity * 0.4}) 100%), linear-gradient(90deg, rgba(255,255,255,${intensity * 0.3}) 0%, rgba(255,255,255,${intensity * 0.1}) 50%, rgba(255,255,255,${intensity * 0.3}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaTactileMaps'
    );
  }

  // Joshua Miele - Audio Landscape
  if (joshuaAudioLandscape?.enabled) {
    const intensity = joshuaAudioLandscape.intensity;
    
    // 3D audio environment visualization
    createOverlay(
      'visual-field-overlay-joshuaAudioLandscape',
      `radial-gradient(circle at 20% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 20%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 20% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 80%, rgba(0,0,255,${intensity * 0.3}) 0%, transparent 6%), radial-gradient(circle at 50% 50%, rgba(0,0,255,${intensity * 0.2}) 0%, transparent 4%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAudioLandscape'
    );
  }

  // Joshua Miele - Accessibility Mode
  if (joshuaAccessibilityMode?.enabled) {
    const intensity = joshuaAccessibilityMode.intensity;
    
    // Screen reader and braille display visualization
    createOverlay(
      'visual-field-overlay-joshuaAccessibilityMode',
      `linear-gradient(0deg, rgba(255,255,0,${intensity * 0.3}) 0%, rgba(255,255,0,${intensity * 0.1}) 50%, rgba(255,255,0,${intensity * 0.3}) 100%), linear-gradient(90deg, rgba(255,255,0,${intensity * 0.2}) 0%, rgba(255,255,0,${intensity * 0.05}) 50%, rgba(255,255,0,${intensity * 0.2}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaAccessibilityMode'
    );
  }

  // Joshua Miele - Data Sonification
  if (joshuaSonification?.enabled) {
    const intensity = joshuaSonification.intensity;
    
    // Sonification visualization showing pitch and volume mapping
    createOverlay(
      'visual-field-overlay-joshuaSonification',
      `radial-gradient(circle at 25% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 25%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 25% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 75%, rgba(255,0,255,${intensity * 0.4}) 0%, transparent 8%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaSonification'
    );
  }

  // Galileo Galilei - Acute Angle-Closure Glaucoma Overlays
  // Sectoral Defects - wedge-shaped blind spots
  if (galileoSectoralDefects?.enabled) {
    const intensity = galileoSectoralDefects.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoSectoralDefects',
      `conic-gradient(from 45deg at 30% 20%, 
        rgba(0,0,0,${0.9 * intensity}) 0deg, 
        rgba(0,0,0,${0.9 * intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSectoralDefects'
    );
  }

  // ===== CUSTOM FAMOUS PEOPLE VISUALIZATIONS =====
  
  // Helen Keller - Complete Blindness (Total darkness from age 19 months)
  const helenKellerBlindness = getEffect('helenKellerBlindness');
  if (helenKellerBlindness?.enabled) {
    const intensity = helenKellerBlindness.intensity;
    
    createOverlayWithContainer(
      'visual-field-overlay-helenKellerBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'helenKellerBlindness',
      container
    );
  }

  // John Milton - Progressive Blindness (Gradual deterioration to complete blindness)
  const johnMiltonBlindness = getEffect('johnMiltonBlindness');
  if (johnMiltonBlindness?.enabled) {
    const intensity = johnMiltonBlindness.intensity;
    
    // Progressive darkening with slight gray tint to represent gradual deterioration
    createOverlayWithContainer(
      'visual-field-overlay-johnMiltonBlindness',
      `rgba(10,10,10,${intensity})`, // Very dark gray overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'johnMiltonBlindness',
      container
    );
  }

  // John Milton - Rainbow Halos (Glaucoma with corneal edema)
  if (miltonGlaucomaHalos?.enabled) {
    const intensity = miltonGlaucomaHalos.intensity;

    // Create rainbow halos around light sources - multiple concentric rings
    createOverlayWithContainer(
      'visual-field-overlay-miltonGlaucomaHalos',
      `conic-gradient(from 0deg at 50% 50%,
        rgba(255,255,255,${intensity * 0.3}) 0deg,
        rgba(255,0,0,${intensity * 0.2}) 60deg,
        rgba(255,255,0,${intensity * 0.2}) 120deg,
        rgba(0,255,0,${intensity * 0.2}) 180deg,
        rgba(0,255,255,${intensity * 0.2}) 240deg,
        rgba(0,0,255,${intensity * 0.2}) 300deg,
        rgba(255,255,255,${intensity * 0.3}) 360deg
      )`,
      'screen', // Use screen blend mode for bright halos
      Math.min(0.6, intensity).toString(),
      `blur(${intensity * 3}px)`, // Blur for soft halo effect
      undefined,
      'miltonGlaucomaHalos',
      container
    );
  }

  // Louis Braille - Sympathetic Ophthalmia (Complete darkness from age 5)
  const louisBrailleBlindness = getEffect('louisBrailleBlindness');

  if (louisBrailleBlindness?.enabled) {
    const intensity = Math.max(0.95, louisBrailleBlindness.intensity); // Ensure near-complete blackness

    createOverlayWithContainer(
      'visual-field-overlay-louisBrailleBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'normal', // Use normal blend mode for complete coverage
      intensity.toString(),
      undefined,
      undefined,
      'louisBrailleBlindness',
      container
    );
  } else {

  }

  // Erik Weihenmayer - Retinoschisis (Progressive tunnel vision to complete blindness)
  const erikWeihenmayerRetinoschisis = getEffect('erikWeihenmayerRetinoschisis');
  if (erikWeihenmayerRetinoschisis?.enabled) {
    const intensity = erikWeihenmayerRetinoschisis.intensity;
    
    // Progressive tunnel vision effect
    const tunnelRadius = Math.max(5, 30 - intensity * 25); // From 30% to 5% of screen
    
    createOverlayWithContainer(
      'visual-field-overlay-erikWeihenmayerRetinoschisis',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 5}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'erikWeihenmayerRetinoschisis',
      container
    );
  }

  // Marla Runyan - Stargardt Disease (matches standard Stargardt Disease visualization)
  const marlaRunyanStargardt = getEffect('marlaRunyanStargardt');
  if (marlaRunyanStargardt?.enabled) {
    const intensity = marlaRunyanStargardt.intensity;
    const scotomaRadius = 17 + intensity * 53; // 17% to 70% of screen (same as standard Stargardt)

    createOverlayWithContainer(
      'visual-field-overlay-marlaRunyanStargardt',
      `radial-gradient(circle at 50% 50%, 
        rgba(10,10,10,${0.99 * intensity}) 0%, 
        rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
        rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
        rgba(0,0,0,0) ${scotomaRadius + 5}%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      `saturate(${1 - intensity * 0.4})`, // Color desaturation (same as standard Stargardt)
      undefined,
      'marlaRunyanStargardt',
      container
    );

  } else {

  }

  // Joshua Miele - Chemical Burn Blindness (Complete darkness from acid attack)
  const joshuaMieleBlindness = getEffect('joshuaMieleBlindness');
  if (joshuaMieleBlindness?.enabled) {
    const intensity = joshuaMieleBlindness.intensity;
    
    createOverlayWithContainer(
      'visual-field-overlay-joshuaMieleBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'joshuaMieleBlindness',
      container
    );
  }

  // David Paterson - Optic Atrophy (Severely reduced vision, legal blindness)
  const davidPatersonBlindness = getEffect('davidPatersonBlindness');
  if (davidPatersonBlindness?.enabled) {
    const intensity = davidPatersonBlindness.intensity;
    
    // Heavy blur and reduced contrast effect for legal blindness
    createOverlayWithContainer(
      'visual-field-overlay-davidPatersonBlindness',
      `rgba(50,50,50,${intensity * 0.8})`, // Dark gray overlay
      'multiply',
      intensity.toString(),
      `blur(${intensity * 8}px) contrast(${100 - intensity * 70}%)`,
      undefined,
      'davidPatersonBlindness',
      container
    );
  }

  // Ray Charles - Glaucoma Blindness (Complete darkness by age 7)
  const rayCharlesBlindness = getEffect('rayCharlesBlindness');
  if (rayCharlesBlindness?.enabled) {
    const intensity = rayCharlesBlindness.intensity;
    
    createOverlayWithContainer(
      'visual-field-overlay-rayCharlesBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'rayCharlesBlindness',
      container
    );
  }

  // Stevie Wonder - Retinopathy of Prematurity (Total or near-total blindness)
  const stevieWonderROP = getEffect('stevieWonderROP');
  if (stevieWonderROP?.enabled) {
    const intensity = stevieWonderROP.intensity;
    
    // Near-total blindness with minimal light perception
    createOverlayWithContainer(
      'visual-field-overlay-stevieWonderROP',
      `rgba(5,5,5,${intensity})`, // Very dark overlay with slight gray tint
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'stevieWonderROP',
      container
    );
  }

  // Andrea Bocelli - Congenital Glaucoma (Complete blindness after soccer accident)
  const andreaBocelliBlindness = getEffect('andreaBocelliBlindness');
  if (andreaBocelliBlindness?.enabled) {
    const intensity = andreaBocelliBlindness.intensity;
    
    createOverlayWithContainer(
      'visual-field-overlay-andreaBocelliBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'andreaBocelliBlindness',
      container
    );
  }

  // Ved Mehta - Meningitis Blindness (Complete darkness from age 3)
  const vedMehtaBlindness = getEffect('vedMehtaBlindness');
  if (vedMehtaBlindness?.enabled) {
    const intensity = vedMehtaBlindness.intensity;
    
    createOverlayWithContainer(
      'visual-field-overlay-vedMehtaBlindness',
      `rgba(0,0,0,${intensity})`, // Complete black overlay
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'vedMehtaBlindness',
      container
    );
  }

  // Arcuate Scotomas - curved blind areas
  if (galileoArcuateScotomas?.enabled) {
    const intensity = galileoArcuateScotomas.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoArcuateScotomas',
      `radial-gradient(ellipse 200px 50px at 50% 50%, 
        rgba(0,0,0,0) 0%, 
        rgba(0,0,0,0) 40%, 
        rgba(0,0,0,${0.8 * intensity}) 45%, 
        rgba(0,0,0,${0.8 * intensity}) 55%, 
        rgba(0,0,0,0) 60%, 
        rgba(0,0,0,0) 100%
      )`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoArcuateScotomas'
    );
  }

  // Swiss Cheese Vision - multiple irregular blind spots
  if (galileoSwissCheeseVision?.enabled) {
    const intensity = galileoSwissCheeseVision.intensity;
    
    createOverlay(
      'visual-field-overlay-galileoSwissCheeseVision',
      `radial-gradient(circle at 20% 30%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 60% 20%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 4%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 80% 60%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 30% 70%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 2%, rgba(0,0,0,0) 2%, rgba(0,0,0,0) 100%),
       radial-gradient(circle at 70% 80%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.9 * intensity}) 3%, rgba(0,0,0,0) 3%, rgba(0,0,0,0) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'galileoSwissCheeseVision'
    );
  }

  // Chronic Progression - combines multiple effects
  if (galileoChronicProgression?.enabled) {
    const intensity = galileoChronicProgression.intensity;
    
    // Progressive tunnel vision
    const tunnelRadius = Math.max(10, 50 - intensity * 40); // From 50% to 10% of screen
    
    createOverlay(
      'visual-field-overlay-galileoChronicProgression',
      `radial-gradient(circle at 50% 50%,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${tunnelRadius - 5}%,
        rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
        rgba(0,0,0,${0.95 * intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, intensity).toString(),
      undefined,
      undefined,
      'galileoChronicProgression'
    );
  }

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
