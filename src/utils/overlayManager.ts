import { VisualEffect } from '../types/visualEffects';
import { isVisualFieldLossCondition, getOverlayZIndex, OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';
import { CONTAINER_SELECTORS } from './appConstants';

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
  const effectMap = new Map(effects.map(e => [e.id, e]));
  const getEffect = (id: string) => effectMap.get(id as any);
  
  const [
    tunnelVision, quadrantanopiaLeft, quadrantanopiaRight, quadrantanopiaInferior, quadrantanopiaSuperior,
    hemianopiaLeft, hemianopiaRight, blindnessLeftEye, blindnessRightEye, bitemporalHemianopia, scotoma, 
    visualFloaters, visualSnow, aura, glaucoma, stargardt,
    miltonGlaucomaHalos, miltonProgressiveVignetting, miltonScotomas, miltonRetinalDetachment, 
    miltonPhotophobia, miltonTemporalFieldLoss, miltonProgressiveBlindness, completeBlindness,
    galileoSectoralDefects, galileoArcuateScotomas, galileoSwissCheeseVision, galileoChronicProgression
  ] = [
    'tunnelVision', 'quadrantanopiaLeft', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior',
    'hemianopiaLeft', 'hemianopiaRight', 'blindnessLeftEye', 'blindnessRightEye', 'bitemporalHemianopia', 'scotoma',
    'visualFloaters', 'visualSnow', 'aura', 'glaucoma', 'stargardt',
    'miltonGlaucomaHalos', 'miltonProgressiveVignetting', 'miltonScotomas', 'miltonRetinalDetachment',
    'miltonPhotophobia', 'miltonTemporalFieldLoss', 'miltonProgressiveBlindness', 'completeBlindness',
    'galileoSectoralDefects', 'galileoArcuateScotomas', 'galileoSwissCheeseVision', 'galileoChronicProgression'
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
