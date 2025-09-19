import { VisualEffect } from '../types/visualEffects';

/**
 * Updates animated overlays for visual effects like scotoma and floaters
 * 
 * @param effects - Array of visual effects to animate
 */
export const updateAnimatedOverlays = (effects: VisualEffect[]): void => {
  const scotoma = effects.find(e => e.id === 'scotoma');
  const visualFloaters = effects.find(e => e.id === 'visualFloaters');
  const visualSnow = effects.find(e => e.id === 'visualSnow');
  // Note: retinitisPigmentosa is handled by shader effects, not overlays
  
  if (scotoma?.enabled) {
    updateScotomaOverlay(scotoma.intensity);
  }
  
  if (visualFloaters?.enabled) {
    updateFloatersOverlay(visualFloaters.intensity);
  }
  
  if (visualSnow?.enabled) {
    updateVisualSnowOverlay(visualSnow.intensity);
  }
  
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
 * 
 * @param intensity - The intensity of the floaters effect
 */
const updateFloatersOverlay = (intensity: number): void => {
  const now = Date.now();
  const overlayElement = document.getElementById('visual-field-overlay-visualFloaters');
  
  if (overlayElement) {
    // Floater 1 - larger, stringy floater
    const floaterX1 = 30 + Math.sin(now/2000 * 0.3) * 25 + Math.sin(now/2000 * 0.2) * 10;
    const floaterY1 = 40 + Math.cos(now/2000 * 0.25) * 20;
    
    // Floater 2 - medium, circular floater
    const floaterX2 = 65 + Math.sin(now/2000 * 0.2 + 1) * 20;
    const floaterY2 = 50 + Math.cos(now/2000 * 0.3 + 2) * 25;
    
    // Floater 3 - small, quick-moving floater
    const floaterX3 = 50 + Math.sin(now/2000 * 0.4 + 3) * 30;
    const floaterY3 = 25 + Math.cos(now/2000 * 0.35 + 1) * 15;
    
    // Floater 4 - thin, string-like floater
    const floaterX4 = 45 + Math.sin(now/2000 * 0.15 + 2) * 15;
    const floaterY4 = 70 + Math.cos(now/2000 * 0.2 + 3) * 10;
    
    overlayElement.style.background = `
      /* String-like floater */
      radial-gradient(ellipse 25% 8% at ${floaterX1}% ${floaterY1}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.85 * intensity}) 15%,
        rgba(0,0,0,${0.7 * intensity}) 40%,
        rgba(0,0,0,0) 80%
      ),
      /* Round floater */
      radial-gradient(circle 8% at ${floaterX2}% ${floaterY2}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.85 * intensity}) 40%,
        rgba(0,0,0,${0.6 * intensity}) 70%,
        rgba(0,0,0,0) 100%
      ),
      /* Small dot floater */
      radial-gradient(circle 4% at ${floaterX3}% ${floaterY3}%, 
        rgba(0,0,0,${0.95 * intensity}) 0%, 
        rgba(0,0,0,${0.9 * intensity}) 40%,
        rgba(0,0,0,${0.7 * intensity}) 70%,
        rgba(0,0,0,0) 100%
      ),
      /* Thin stringy floater */
      radial-gradient(ellipse 20% 3% at ${floaterX4}% ${floaterY4}%, 
        rgba(0,0,0,${0.9 * intensity}) 0%, 
        rgba(0,0,0,${0.8 * intensity}) 40%,
        rgba(0,0,0,${0.6 * intensity}) 70%,
        rgba(0,0,0,0) 100%
      )
    `;
  }
};

/**
 * Updates the visual snow overlay with animated noise
 * 
 * @param intensity - The intensity of the visual snow effect
 */
const updateVisualSnowOverlay = (intensity: number): void => {
  const overlayElement = document.getElementById('visual-field-overlay-visualSnow');
  
  if (overlayElement) {
    overlayElement.style.background = `
      repeating-radial-gradient(
        circle at 25% 25%,
        transparent 0,
        rgba(255, 255, 255, ${0.1 * intensity}) 1px,
        transparent 2px
      ),
      repeating-radial-gradient(
        circle at 75% 75%,
        transparent 0,
        rgba(255, 255, 255, ${0.08 * intensity}) 1px,
        transparent 3px
      )
    `;
    overlayElement.style.animation = 'visualSnowAnimation 2s infinite';
  }
};

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
