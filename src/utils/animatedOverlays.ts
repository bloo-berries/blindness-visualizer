import { VisualEffect } from '../types/visualEffects';
import { getOverlayZIndex, OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';

// Animation helper interfaces and utilities
export interface AnimationParams {
  time: number;
  intensity: number;
  baseX?: number;
  baseY?: number;
  amplitude?: number;
  frequency?: number;
  phase?: number;
}

export interface PositionResult {
  x: number;
  y: number;
  opacity: number;
  rotation?: number;
  scale?: number;
}

/**
 * Generates animated position using sine/cosine waves
 */
export const generateAnimatedPosition = (params: AnimationParams): PositionResult => {
  const {
    time,
    intensity,
    baseX = 50,
    baseY = 50,
    amplitude = 10,
    frequency = 0.1,
    phase = 0
  } = params;

  const x = baseX + Math.sin(time * frequency + phase) * amplitude;
  const y = baseY + Math.cos(time * frequency * 0.8 + phase) * amplitude * 0.7;
  const opacity = Math.max(0.1, Math.min(1.0, intensity * (0.7 + Math.sin(time * 0.05) * 0.3)));
  const rotation = Math.sin(time * 0.03 + phase) * 5;
  const scale = 1.0 + Math.sin(time * 0.02 + phase) * 0.1;

  return { x, y, opacity, rotation, scale };
};

/**
 * Generates severity-based configuration for effects
 */
export const getSeverityConfig = (intensity: number) => {
  if (intensity < 0.3) {
    return {
      level: 'mild' as const,
      floaterCount: 1,
      maxOpacity: 0.7,
      maxSize: 20,
      animationSpeed: 0.1
    };
  } else if (intensity < 0.7) {
    return {
      level: 'moderate' as const,
      floaterCount: 3,
      maxOpacity: 0.8,
      maxSize: 25,
      animationSpeed: 0.12
    };
  } else {
    return {
      level: 'severe' as const,
      floaterCount: 6,
      maxOpacity: 0.9,
      maxSize: 30,
      animationSpeed: 0.15
    };
  }
};

/**
 * Updates animated overlays for visual effects like scotoma and floaters
 * Optimized version that works with the performance optimization system
 * 
 * @param effects - Array of visual effects to animate
 */
export const updateAnimatedOverlays = (effects: VisualEffect[]): void => {
  // Use optimized effect lookup instead of array.find()
  const effectMap = new Map(effects.map(e => [e.id, e]));
  const scotoma = effectMap.get('scotoma');
  const visualFloaters = effectMap.get('visualFloaters');
  // Note: visualSnow is now handled by ControlPanel.tsx overlay generation
  // Note: retinitisPigmentosa is handled by shader effects, not overlays
  
  if (scotoma?.enabled) {
    updateScotomaOverlay(scotoma.intensity);
  }
  
  if (visualFloaters?.enabled) {
    updateFloatersOverlay(visualFloaters.intensity);
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
 * Updates the visual floaters overlay with simplified animation
 * Optimized for better performance with multiple conditions
 * 
 * @param intensity - The intensity of the floaters effect
 */
const updateFloatersOverlay = (intensity: number): void => {
  const overlayElement = document.getElementById('visual-field-overlay-visualFloaters');
  
  if (overlayElement) {
    // Use CSS animation instead of JavaScript calculations for better performance
    overlayElement.style.animation = `floaterDrift ${2 + intensity * 3}s ease-in-out infinite alternate`;
    overlayElement.style.opacity = Math.min(0.8, intensity).toString();
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
  
  // Apply base styles and z-index
  Object.assign(overlay.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: getOverlayZIndex(effectId, Z_INDEX.ANIMATED)
  });
  
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
