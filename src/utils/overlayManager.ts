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
          console.log('Found iframe parent container:', container);
          break;
        }
      } else if (selector === 'canvas') {
        // Special handling for canvas - get its parent
        const canvas = document.querySelector(selector);
        if (canvas) {
          container = canvas.parentElement;
          console.log('Found canvas parent container:', container);
          break;
        }
      } else {
        container = document.querySelector(selector);
        if (container) {
          console.log(`Found container with selector: ${selector}`, container);
          break;
        }
      }
    }
    
    if (container) {
      container.appendChild(overlayElement);
      console.log(`Successfully created overlay ${id} in container:`, container);
    } else {
      console.warn(`Could not find container for overlay ${id}`);
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
      console.log(`Fallback: Created overlay ${id} in body`);
    }
    
    // Force the container to have relative positioning if it doesn't
    if (container && container instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
        console.log('Set container position to relative');
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
 * Creates visual field overlays for all enabled effects
 */
export const createVisualFieldOverlays = (effects: VisualEffect[]): void => {
  // Remove existing overlays first
  document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());
  
  console.log('Creating visual field overlays for effects:', effects);
  console.log('Current input source type:', document.querySelector('iframe[src*="youtube"]') ? 'youtube' : 'image/webcam');

  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);
  const getEffect = (id: string) => getEffectById(effectMap, id);
  
  const [
    tunnelVision, quadrantanopiaLeft, quadrantanopiaRight, quadrantanopiaInferior, quadrantanopiaSuperior,
    hemianopiaLeft, hemianopiaRight, blindnessLeftEye, blindnessRightEye, bitemporalHemianopia, scotoma, 
    visualFloaters, aura, glaucoma, stargardt,
    miltonProgressiveVignetting, miltonRetinalDetachment, 
    miltonPhotophobia, miltonTemporalFieldLoss, completeBlindness,
    galileoSectoralDefects, galileoArcuateScotomas, galileoSwissCheeseVision, galileoChronicProgression,
    vedCompleteBlindness, vedSpatialAwareness, vedEchoLocation, vedAirFlowSensors, vedProximityRadar, vedTemperatureMapping,
    christineSteamyMirror, christineLightScatter, christineFogOverlay, christineFluctuatingVision, christineNMOComplete,
    lucyFrostedGlass, lucyHeavyBlur, lucyDesaturation, lucyLightDiffusion, lucyTextureOverlay, lucyCompleteVision,
    davidLeftEyeBlindness, davidRightEyeGlaucoma, davidHemisphericVision, davidCompleteVision,
    erikRetinoschisisIslands, erikIslandFragmentation, erikProgressiveLoss, erikCompleteBlindness, erikScanningBehavior, erikCognitiveLoad,
    marlaCentralScotoma, marlaPeripheralVision, marlaEccentricViewing, marlaFillingIn, marlaCrowdingEffect, marlaStargardtComplete
  ] = [
    'tunnelVision', 'quadrantanopiaLeft', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior',
    'hemianopiaLeft', 'hemianopiaRight', 'blindnessLeftEye', 'blindnessRightEye', 'bitemporalHemianopia', 'scotoma',
    'visualFloaters', 'aura', 'glaucoma', 'stargardt',
    'miltonProgressiveVignetting', 'miltonRetinalDetachment',
    'miltonPhotophobia', 'miltonTemporalFieldLoss', 'completeBlindness',
    'galileoSectoralDefects', 'galileoArcuateScotomas', 'galileoSwissCheeseVision', 'galileoChronicProgression',
    'vedCompleteBlindness', 'vedSpatialAwareness', 'vedEchoLocation', 'vedAirFlowSensors', 'vedProximityRadar', 'vedTemperatureMapping',
    'christineSteamyMirror', 'christineLightScatter', 'christineFogOverlay', 'christineFluctuatingVision', 'christineNMOComplete',
    'lucyFrostedGlass', 'lucyHeavyBlur', 'lucyDesaturation', 'lucyLightDiffusion', 'lucyTextureOverlay', 'lucyCompleteVision',
    'davidLeftEyeBlindness', 'davidRightEyeGlaucoma', 'davidHemisphericVision', 'davidCompleteVision',
    'erikRetinoschisisIslands', 'erikIslandFragmentation', 'erikProgressiveLoss', 'erikCompleteBlindness', 'erikScanningBehavior', 'erikCognitiveLoad',
    'marlaCentralScotoma', 'marlaPeripheralVision', 'marlaEccentricViewing', 'marlaFillingIn', 'marlaCrowdingEffect', 'marlaStargardtComplete'
  ].map(getEffect);
  // Note: diplopia and retinitisPigmentosa are handled by shader effects, not overlays

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
        rgba(0,0,0,${0.95 * quadrantanopiaRight.intensity}) ${Math.max(45, 60 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,${0.95 * quadrantanopiaRight.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaRight.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaRight'
    );
  }

  if (quadrantanopiaInferior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,${0.95 * quadrantanopiaInferior.intensity}) 0deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaInferior.intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaInferior.intensity).toString(),
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
        rgba(0,0,0,${0.95 * quadrantanopiaSuperior.intensity}) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaSuperior.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaSuperior.intensity).toString(),
      undefined,
      undefined,
      'quadrantanopiaSuperior'
    );
  }

  if (hemianopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaLeft',
      `linear-gradient(to right, 
        rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 0%, 
        rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, hemianopiaLeft.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaLeft'
    );
  }

  if (hemianopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaRight',
      `linear-gradient(to left, 
        rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 0%, 
        rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, hemianopiaRight.intensity).toString(),
      undefined,
      undefined,
      'hemianopiaRight'
    );
  }

  if (blindnessLeftEye?.enabled) {
    createOverlay(
      'visual-field-overlay-blindnessLeftEye',
      `linear-gradient(to right, 
        rgba(0,0,0,${0.95 * blindnessLeftEye.intensity}) 0%, 
        rgba(0,0,0,${0.95 * blindnessLeftEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, blindnessLeftEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessLeftEye'
    );
  }

  if (blindnessRightEye?.enabled) {
    createOverlay(
      'visual-field-overlay-blindnessRightEye',
      `linear-gradient(to left, 
        rgba(0,0,0,${0.95 * blindnessRightEye.intensity}) 0%, 
        rgba(0,0,0,${0.95 * blindnessRightEye.intensity}) 50%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, blindnessRightEye.intensity).toString(),
      undefined,
      undefined,
      'blindnessRightEye'
    );
  }

  if (bitemporalHemianopia?.enabled) {
    createOverlay(
      'visual-field-overlay-bitemporalHemianopia',
      `linear-gradient(to right, 
        rgba(0,0,0,${0.95 * bitemporalHemianopia.intensity}) 0%, 
        rgba(0,0,0,${0.95 * bitemporalHemianopia.intensity}) 25%, 
        rgba(0,0,0,0) 25%,
        rgba(0,0,0,0) 75%,
        rgba(0,0,0,${0.95 * bitemporalHemianopia.intensity}) 75%, 
        rgba(0,0,0,${0.95 * bitemporalHemianopia.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, bitemporalHemianopia.intensity).toString(),
      undefined,
      undefined,
      'bitemporalHemianopia'
    );
  }

  if (scotoma?.enabled) {
    const now = Date.now();
    createOverlay(
      'visual-field-overlay-scotoma',
      `radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
        rgba(0,0,0,${0.95 * scotoma.intensity}) 0%, 
        rgba(0,0,0,${0.85 * scotoma.intensity}) ${Math.max(5, 10 - scotoma.intensity * 5)}%,
        rgba(0,0,0,${0.5 * scotoma.intensity}) ${Math.max(10, 20 - scotoma.intensity * 10)}%,
        rgba(0,0,0,0) ${Math.max(20, 35 - scotoma.intensity * 15)}%
      )`,
      'multiply',
      Math.min(0.95, scotoma.intensity).toString(),
      undefined,
      undefined,
      'scotoma'
    );
  }

  if (visualFloaters?.enabled) {
    const now = Date.now();
    const time = now * 0.001; // Convert to seconds
    
    // Determine severity level based on intensity
    const severity = visualFloaters.intensity < 0.3 ? 'mild' : visualFloaters.intensity < 0.7 ? 'moderate' : 'severe';
    
    let floaterPattern: string;
    
    if (severity === 'mild') {
      // Mild: 1-2 small floaters, only noticed in specific conditions
      // Cobweb/string floater - most common type, often in superior field due to gravity
      const cobwebX = 35 + Math.sin(time * 0.1) * 15 + Math.sin(time * 0.05) * 8;
      const cobwebY = 35 + Math.cos(time * 0.08) * 12; // Slightly higher due to gravity settling
      
      floaterPattern = `
        radial-gradient(ellipse 20% 6% at ${cobwebX}% ${cobwebY}%, 
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.5 * visualFloaters.intensity}) 20%,
          rgba(0,0,0,${0.3 * visualFloaters.intensity}) 50%,
          rgba(0,0,0,0) 80%
        )
      `;
      
    } else if (severity === 'moderate') {
      // Moderate: Multiple floaters of various types
      // Cobweb/string floater with lag behind eye movement - often in superior field
      const cobwebX = 30 + Math.sin(time * 0.12) * 20 + Math.sin(time * 0.06) * 10;
      const cobwebY = 35 + Math.cos(time * 0.1) * 15; // Gravity bias toward superior field
      const dotX = 60 + Math.sin(time * 0.15 + 1.5) * 18;
      const dotY = 50 + Math.cos(time * 0.12 + 2) * 20; // More central distribution
      const ringX = 50 + Math.sin(time * 0.08 + 3) * 12;
      const ringY = 25 + Math.cos(time * 0.1 + 1) * 8; // Superior field bias
      
      floaterPattern = `
        /* Cobweb/string floater */
        radial-gradient(ellipse 25% 8% at ${cobwebX}% ${cobwebY}%, 
          rgba(0,0,0,${0.8 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.6 * visualFloaters.intensity}) 25%,
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 60%,
          rgba(0,0,0,0) 85%
        ),
        /* Dot/spot floater */
        radial-gradient(circle 6% at ${dotX}% ${dotY}%, 
          rgba(0,0,0,${0.9 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 50%,
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 80%,
          rgba(0,0,0,0) 100%
        ),
        /* Ring floater (Weiss Ring) */
        radial-gradient(ellipse 15% 12% at ${ringX}% ${ringY}%, 
          rgba(0,0,0,${0.6 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 30%,
          rgba(0,0,0,${0.2 * visualFloaters.intensity}) 60%,
          rgba(0,0,0,0) 90%
        )
      `;
      
    } else {
      // Severe: Numerous large floaters, constant visual obstruction
      // Multiple cobweb/string floaters - superior field bias due to gravity
      const cobweb1X = 25 + Math.sin(time * 0.1) * 22 + Math.sin(time * 0.05) * 12;
      const cobweb1Y = 30 + Math.cos(time * 0.08) * 18; // Superior field
      const cobweb2X = 70 + Math.sin(time * 0.12 + 2) * 20;
      const cobweb2Y = 35 + Math.cos(time * 0.1 + 1.5) * 15; // Superior field
      const dot1X = 45 + Math.sin(time * 0.15 + 1) * 25;
      const dot1Y = 50 + Math.cos(time * 0.12 + 2.5) * 20; // Central
      const dot2X = 80 + Math.sin(time * 0.18 + 3) * 15;
      const dot2Y = 70 + Math.cos(time * 0.14 + 1.8) * 12; // Peripheral
      const ringX = 50 + Math.sin(time * 0.08 + 4) * 15;
      const ringY = 25 + Math.cos(time * 0.1 + 2.2) * 10; // Superior field
      const cloudX = 40 + Math.sin(time * 0.06 + 1.2) * 18;
      const cloudY = 60 + Math.cos(time * 0.08 + 2.8) * 12; // More central
      
      floaterPattern = `
        /* Cobweb/string floater 1 */
        radial-gradient(ellipse 30% 10% at ${cobweb1X}% ${cobweb1Y}%, 
          rgba(0,0,0,${0.85 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 20%,
          rgba(0,0,0,${0.5 * visualFloaters.intensity}) 50%,
          rgba(0,0,0,0) 80%
        ),
        /* Cobweb/string floater 2 */
        radial-gradient(ellipse 25% 8% at ${cobweb2X}% ${cobweb2Y}%, 
          rgba(0,0,0,${0.8 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.6 * visualFloaters.intensity}) 25%,
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 60%,
          rgba(0,0,0,0) 85%
        ),
        /* Dot/spot floater 1 */
        radial-gradient(circle 8% at ${dot1X}% ${dot1Y}%, 
          rgba(0,0,0,${0.9 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 50%,
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 80%,
          rgba(0,0,0,0) 100%
        ),
        /* Dot/spot floater 2 */
        radial-gradient(circle 5% at ${dot2X}% ${dot2Y}%, 
          rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.8 * visualFloaters.intensity}) 60%,
          rgba(0,0,0,0) 100%
        ),
        /* Ring floater (Weiss Ring) */
        radial-gradient(ellipse 18% 15% at ${ringX}% ${ringY}%, 
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.5 * visualFloaters.intensity}) 30%,
          rgba(0,0,0,${0.3 * visualFloaters.intensity}) 60%,
          rgba(0,0,0,0) 90%
        ),
        /* Cloud/sheet floater */
        radial-gradient(ellipse 35% 20% at ${cloudX}% ${cloudY}%, 
          rgba(0,0,0,${0.4 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.3 * visualFloaters.intensity}) 40%,
          rgba(0,0,0,${0.2 * visualFloaters.intensity}) 70%,
          rgba(0,0,0,0) 100%
        )
      `;
    }

    createOverlay(
      'visual-field-overlay-visualFloaters',
      floaterPattern,
      'multiply',
      Math.min(0.98, visualFloaters.intensity).toString(),
      undefined,
      undefined,
      'visualFloaters'
    );
  }

  // Visual Snow is now handled by ControlPanel.tsx overlay generation

  if (aura?.enabled) {
    const now = Date.now();
    const auraPhase = (now / 3000) % (2 * Math.PI);
    const auraRadius = 30 + Math.sin(auraPhase) * 10;
    
    createOverlay(
      'visual-field-overlay-aura',
      `radial-gradient(circle at 50% 50%, 
        rgba(255,255,255,${0.3 * aura.intensity}) 0%, 
        rgba(255,255,255,${0.2 * aura.intensity}) ${auraRadius - 10}%, 
        rgba(255,255,255,${0.1 * aura.intensity}) ${auraRadius}%, 
        rgba(255,255,255,0) ${auraRadius + 20}%
      )`,
      'screen',
      Math.min(0.8, aura.intensity).toString(),
      undefined,
      undefined,
      'aura'
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
    
    // Remove trailing comma
    glaucomaBackground = glaucomaBackground.slice(0, -1);
    
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

  // Hyperopia is now handled by CSS filters (like Myopia), not DOM overlays

  // Diplopia effects are handled by WebGL shaders, not DOM overlays
  // This ensures consistent diplopia rendering across all content types

  // Retinitis Pigmentosa is handled by shader effects, not overlays

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
  const minkaraEndStageComplete = effects.find(e => e.id === 'minkaraEndStageComplete' && e.enabled);
  const minkaraCentralScotoma = effects.find(e => e.id === 'minkaraCentralScotoma' && e.enabled);
  const minkaraRingScotoma = effects.find(e => e.id === 'minkaraRingScotoma' && e.enabled);
  const minkaraPeripheralIslands = effects.find(e => e.id === 'minkaraPeripheralIslands' && e.enabled);
  const minkaraPhotophobia = effects.find(e => e.id === 'minkaraPhotophobia' && e.enabled);
  const minkaraAchromatopsia = effects.find(e => e.id === 'minkaraAchromatopsia' && e.enabled);
  const minkaraNightBlindness = effects.find(e => e.id === 'minkaraNightBlindness' && e.enabled);
  const minkaraChemistryMode = effects.find(e => e.id === 'minkaraChemistryMode' && e.enabled);

  // Joshua Miele - Chemical Burn Complete Blindness Effects
  const joshuaCompleteBlindness = effects.find(e => e.id === 'joshuaCompleteBlindness' && e.enabled);
  const joshuaEcholocation = effects.find(e => e.id === 'joshuaEcholocation' && e.enabled);
  const joshuaTactileMaps = effects.find(e => e.id === 'joshuaTactileMaps' && e.enabled);
  const joshuaAudioLandscape = effects.find(e => e.id === 'joshuaAudioLandscape' && e.enabled);
  const joshuaAccessibilityMode = effects.find(e => e.id === 'joshuaAccessibilityMode' && e.enabled);
  const joshuaSonification = effects.find(e => e.id === 'joshuaSonification' && e.enabled);

  // Marla Runyan - Stargardt Disease Central Scotoma Effects
  // Central Scotoma - Large central blind spot (20-30 degrees)
  if (marlaCentralScotoma?.enabled) {
    const intensity = marlaCentralScotoma.intensity;
    
    // Create central scotoma using radial gradient - gray void, not black (simplified)
    createOverlay(
      'visual-field-overlay-marlaCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(128,128,128,${intensity * 0.8}) 0%, rgba(128,128,128,${intensity * 0.6}) 30%, transparent 40%)`,
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
    
    // Massive central scotoma (35+ degrees)
    createOverlay(
      'visual-field-overlay-minkaraCentralScotoma',
      `radial-gradient(circle at 50% 50%, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.95}) 15%, rgba(0,0,0,${intensity * 0.9}) 25%, rgba(0,0,0,${intensity * 0.8}) 35%, transparent 40%)`,
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
};

/**
 * Removes all visual field overlays
 */
export const removeVisualFieldOverlays = (): void => {
  const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
  overlays.forEach(overlay => overlay.remove());
  
  // Diplopia effects are now handled by WebGL shaders, no DOM cleanup needed
};
