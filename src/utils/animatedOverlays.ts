import { VisualEffect } from '../types/visualEffects';

/**
 * Updates animated overlays for visual effects like scotoma and floaters
 * 
 * @param effects - Array of visual effects to animate
 */
export const updateAnimatedOverlays = (effects: VisualEffect[]): void => {
  const scotoma = effects.find(e => e.id === 'scotoma');
  const visualFloaters = effects.find(e => e.id === 'visualFloaters');
  // Note: visualSnow is now handled by ControlPanel.tsx overlay generation
  // Note: retinitisPigmentosa is handled by shader effects, not overlays
  
  console.log('updateAnimatedOverlays called with effects:', effects.map(e => ({ id: e.id, enabled: e.enabled, intensity: e.intensity })));
  
  if (scotoma?.enabled) {
    updateScotomaOverlay(scotoma.intensity);
  }
  
  if (visualFloaters?.enabled) {
    console.log('Visual floaters enabled, calling updateFloatersOverlay');
    updateFloatersOverlay(visualFloaters.intensity);
  } else {
    console.log('Visual floaters not enabled or not found');
  }
  
  // Visual Snow is now handled by ControlPanel.tsx overlay generation
  // Retinitis Pigmentosa is handled by shader effects, not overlays
};

/**
 * Updates the scotoma overlay with animated movement
 * 
 * @param intensity - The intensity of the scotoma effect
 */
const updateScotomaOverlay = (intensity: number): void => {
  const now = Date.now();
  const overlayElement = document.getElementById('visual-field-overlay-scotoma');
  
  if (overlayElement) {
    overlayElement.style.background = `
      radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
        rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
        rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
      )
    `;
  }
};

/**
 * Updates the visual floaters overlay with multiple animated floaters
 * Based on medical research: cobwebs/strings, dots/spots, rings, and clouds
 * 
 * @param intensity - The intensity of the floaters effect
 */
const updateFloatersOverlay = (intensity: number): void => {
  const now = Date.now();
  const overlayElement = document.getElementById('visual-field-overlay-visualFloaters');
  
  console.log('updateFloatersOverlay called with intensity:', intensity, 'overlay element found:', !!overlayElement);
  
  if (overlayElement) {
    // Time-based phases for different movement patterns
    const time = now * 0.001; // Convert to seconds
    
    // Determine severity level based on intensity
    const severity = intensity < 0.3 ? 'mild' : intensity < 0.7 ? 'moderate' : 'severe';
    
    let floaterPatterns: string[] = [];
    
    if (severity === 'mild') {
      // Mild: 1-2 small floaters, only noticed in specific conditions
      // Cobweb/string floater - most common type, often in superior field due to gravity
      const cobwebX = 35 + Math.sin(time * 0.1) * 15 + Math.sin(time * 0.05) * 8;
      const cobwebY = 35 + Math.cos(time * 0.08) * 12; // Slightly higher due to gravity settling
      
      floaterPatterns.push(`
        radial-gradient(ellipse 20% 6% at ${cobwebX}% ${cobwebY}%, 
          rgba(0,0,0,${0.7 * intensity}) 0%, 
          rgba(0,0,0,${0.5 * intensity}) 20%,
          rgba(0,0,0,${0.3 * intensity}) 50%,
          rgba(0,0,0,0) 80%
        )
      `);
      
    } else if (severity === 'moderate') {
      // Moderate: Multiple floaters of various types
      // Cobweb/string floater with lag behind eye movement - often in superior field
      const cobwebX = 30 + Math.sin(time * 0.12) * 20 + Math.sin(time * 0.06) * 10;
      const cobwebY = 35 + Math.cos(time * 0.1) * 15; // Gravity bias toward superior field
      
      // Dot/spot floater - small dark spots, can appear anywhere but often central
      const dotX = 60 + Math.sin(time * 0.15 + 1.5) * 18;
      const dotY = 50 + Math.cos(time * 0.12 + 2) * 20; // More central distribution
      
      // Ring floater (Weiss Ring) - large C-shaped, often in superior field
      const ringX = 50 + Math.sin(time * 0.08 + 3) * 12;
      const ringY = 25 + Math.cos(time * 0.1 + 1) * 8; // Superior field bias
      
      floaterPatterns.push(`
        /* Cobweb/string floater */
        radial-gradient(ellipse 25% 8% at ${cobwebX}% ${cobwebY}%, 
          rgba(0,0,0,${0.8 * intensity}) 0%, 
          rgba(0,0,0,${0.6 * intensity}) 25%,
          rgba(0,0,0,${0.4 * intensity}) 60%,
          rgba(0,0,0,0) 85%
        ),
        /* Dot/spot floater */
        radial-gradient(circle 6% at ${dotX}% ${dotY}%, 
          rgba(0,0,0,${0.9 * intensity}) 0%, 
          rgba(0,0,0,${0.7 * intensity}) 50%,
          rgba(0,0,0,${0.4 * intensity}) 80%,
          rgba(0,0,0,0) 100%
        ),
        /* Ring floater (Weiss Ring) */
        radial-gradient(ellipse 15% 12% at ${ringX}% ${ringY}%, 
          rgba(0,0,0,${0.6 * intensity}) 0%, 
          rgba(0,0,0,${0.4 * intensity}) 30%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 90%
        )
      `);
      
    } else {
      // Severe: Numerous large floaters, constant visual obstruction
      // Multiple cobweb/string floaters - superior field bias due to gravity
      const cobweb1X = 25 + Math.sin(time * 0.1) * 22 + Math.sin(time * 0.05) * 12;
      const cobweb1Y = 30 + Math.cos(time * 0.08) * 18; // Superior field
      const cobweb2X = 70 + Math.sin(time * 0.12 + 2) * 20;
      const cobweb2Y = 35 + Math.cos(time * 0.1 + 1.5) * 15; // Superior field
      
      // Multiple dot/spot floaters - mixed distribution (central and peripheral)
      const dot1X = 45 + Math.sin(time * 0.15 + 1) * 25;
      const dot1Y = 50 + Math.cos(time * 0.12 + 2.5) * 20; // Central
      const dot2X = 80 + Math.sin(time * 0.18 + 3) * 15;
      const dot2Y = 70 + Math.cos(time * 0.14 + 1.8) * 12; // Peripheral
      
      // Ring floater (Weiss Ring) - more prominent, superior field
      const ringX = 50 + Math.sin(time * 0.08 + 4) * 15;
      const ringY = 25 + Math.cos(time * 0.1 + 2.2) * 10; // Superior field
      
      // Cloud/sheet floater - hazy, smoke-like, can be anywhere
      const cloudX = 40 + Math.sin(time * 0.06 + 1.2) * 18;
      const cloudY = 60 + Math.cos(time * 0.08 + 2.8) * 12; // More central
      
      floaterPatterns.push(`
        /* Cobweb/string floater 1 */
        radial-gradient(ellipse 30% 10% at ${cobweb1X}% ${cobweb1Y}%, 
          rgba(0,0,0,${0.85 * intensity}) 0%, 
          rgba(0,0,0,${0.7 * intensity}) 20%,
          rgba(0,0,0,${0.5 * intensity}) 50%,
          rgba(0,0,0,0) 80%
        ),
        /* Cobweb/string floater 2 */
        radial-gradient(ellipse 25% 8% at ${cobweb2X}% ${cobweb2Y}%, 
          rgba(0,0,0,${0.8 * intensity}) 0%, 
          rgba(0,0,0,${0.6 * intensity}) 25%,
          rgba(0,0,0,${0.4 * intensity}) 60%,
          rgba(0,0,0,0) 85%
        ),
        /* Dot/spot floater 1 */
        radial-gradient(circle 8% at ${dot1X}% ${dot1Y}%, 
          rgba(0,0,0,${0.9 * intensity}) 0%, 
          rgba(0,0,0,${0.7 * intensity}) 50%,
          rgba(0,0,0,${0.4 * intensity}) 80%,
          rgba(0,0,0,0) 100%
        ),
        /* Dot/spot floater 2 */
        radial-gradient(circle 5% at ${dot2X}% ${dot2Y}%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.8 * intensity}) 60%,
          rgba(0,0,0,0) 100%
        ),
        /* Ring floater (Weiss Ring) */
        radial-gradient(ellipse 18% 15% at ${ringX}% ${ringY}%, 
          rgba(0,0,0,${0.7 * intensity}) 0%, 
          rgba(0,0,0,${0.5 * intensity}) 30%,
          rgba(0,0,0,${0.3 * intensity}) 60%,
          rgba(0,0,0,0) 90%
        ),
        /* Cloud/sheet floater */
        radial-gradient(ellipse 35% 20% at ${cloudX}% ${cloudY}%, 
          rgba(0,0,0,${0.4 * intensity}) 0%, 
          rgba(0,0,0,${0.3 * intensity}) 40%,
          rgba(0,0,0,${0.2 * intensity}) 70%,
          rgba(0,0,0,0) 100%
        )
      `);
    }
    
    overlayElement.style.background = floaterPatterns.join(',');
    
    // Apply gravity effects - floaters tend to sink when head is still
    // and become more noticeable when looking up
    const gravityOffset = Math.sin(time * 0.05) * 2; // Subtle gravity effect
    overlayElement.style.transform = `translateY(${gravityOffset}px)`;
    
    // Simulate lag behind eye movement with momentum
    // Floaters move with eye movement but lag behind and continue drifting
    const momentumX = Math.sin(time * 0.08) * 1.5; // Lag effect
    const momentumY = Math.cos(time * 0.06) * 1.2;
    overlayElement.style.transform += ` translate(${momentumX}px, ${momentumY}px)`;
    
    // Adjust opacity based on lighting conditions simulation
    // Floaters are more visible against bright backgrounds
    const lightingFactor = 0.8 + (intensity * 0.2); // Brighter = more visible
    overlayElement.style.opacity = Math.min(0.95, intensity * lightingFactor).toString();
    
    // Add subtle "swishing" motion like objects in water
    const swishEffect = Math.sin(time * 0.12) * 0.5;
    overlayElement.style.filter = `blur(${swishEffect}px)`;
    
    // Simulate neuroadaptation - floaters become less noticeable over time
    // This creates a subtle fade effect that simulates the brain learning to ignore them
    const adaptationFactor = Math.max(0.3, 1.0 - (time * 0.0001)); // Very slow adaptation
    overlayElement.style.opacity = (parseFloat(overlayElement.style.opacity) * adaptationFactor).toString();
    
    // Simulate head tilting behavior - slight rotation to move floaters aside
    const headTilt = Math.sin(time * 0.03) * 0.5; // Very subtle rotation
    overlayElement.style.transform += ` rotate(${headTilt}deg)`;
  }
};

// Visual Snow overlay function removed - now handled by ControlPanel.tsx

// Retinitis Pigmentosa is now handled by shader effects, not overlays

/**
 * Creates overlay elements for visual effects
 * 
 * @param effectId - The ID of the effect to create overlay for
 * @param container - The container element to append overlays to
 */
export const createOverlayElement = (
  effectId: string, 
  container: HTMLElement
): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = `visual-field-overlay-${effectId}`;
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  `;
  
  container.appendChild(overlay);
  return overlay;
};

/**
 * Removes overlay elements for visual effects
 * 
 * @param effectId - The ID of the effect to remove overlay for
 */
export const removeOverlayElement = (effectId: string): void => {
  const overlay = document.getElementById(`visual-field-overlay-${effectId}`);
  if (overlay) {
    overlay.remove();
  }
};
