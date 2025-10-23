/**
 * Performance optimization utilities for vision simulator
 * Addresses performance bottlenecks when multiple conditions are active
 */

import { VisualEffect } from '../types/visualEffects';
import { createVisualFieldOverlays } from './overlayManager';

/**
 * Performance monitoring and throttling utilities
 */
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private frameCount = 0;
  private lastFrameTime = 0;
  private fps = 60;
  private isThrottling = false;
  private throttleThreshold = 4; // Start throttling at 4+ conditions

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Monitors FPS and determines if throttling is needed
   */
  monitorPerformance(): void {
    const now = performance.now();
    this.frameCount++;
    
    if (now - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
      
      // Enable throttling if FPS drops below 30
      this.isThrottling = this.fps < 30;
    }
  }

  /**
   * Determines if animation should be throttled based on condition count
   */
  shouldThrottleAnimation(conditionCount: number): boolean {
    return conditionCount >= this.throttleThreshold || this.isThrottling;
  }

  /**
   * Gets optimal animation frame rate based on performance
   */
  getOptimalFrameRate(conditionCount: number): number {
    if (conditionCount >= 6) return 30; // 30 FPS for 6+ conditions
    if (conditionCount >= 4) return 45; // 45 FPS for 4-5 conditions
    return 60; // 60 FPS for 1-3 conditions
  }

  /**
   * Throttles function calls based on performance
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    conditionCount: number
  ): T {
    const frameRate = this.getOptimalFrameRate(conditionCount);
    const interval = 1000 / frameRate;
    let lastCall = 0;

    return ((...args: any[]) => {
      const now = performance.now();
      if (now - lastCall >= interval) {
        lastCall = now;
        return func(...args);
      }
    }) as T;
  }
}

/**
 * Optimized effect processing for multiple conditions
 */
export class EffectProcessor {
  private effectMap = new Map<string, VisualEffect>();
  private enabledEffects: VisualEffect[] = [];
  private lastUpdateHash = '';

  /**
   * Updates effect cache and returns only changed effects
   */
  updateEffects(effects: VisualEffect[]): {
    changed: boolean;
    enabledEffects: VisualEffect[];
    effectMap: Map<string, VisualEffect>;
  } {
    // Create hash of current effects state
    const currentHash = effects
      .map(e => `${e.id}:${e.enabled}:${e.intensity}`)
      .join('|');

    // Only update if effects have changed
    if (currentHash === this.lastUpdateHash) {

      return {
        changed: false,
        enabledEffects: this.enabledEffects,
        effectMap: this.effectMap
      };
    }

    // Update cache
    this.effectMap = new Map(effects.map(effect => [effect.id, effect]));
    this.enabledEffects = effects.filter(effect => effect.enabled);
    this.lastUpdateHash = currentHash;

    return {
      changed: true,
      enabledEffects: this.enabledEffects,
      effectMap: this.effectMap
    };
  }

  /**
   * Gets effect by ID with O(1) performance
   */
  getEffect(id: string): VisualEffect | undefined {
    return this.effectMap.get(id);
  }

  /**
   * Gets multiple effects by IDs
   */
  getEffects(ids: string[]): (VisualEffect | undefined)[] {
    return ids.map(id => this.effectMap.get(id));
  }

  /**
   * Gets all enabled effects
   */
  getEnabledEffects(): VisualEffect[] {
    return this.enabledEffects;
  }

  /**
   * Checks if any effects of a specific type are enabled
   */
  hasEnabledEffect(predicate: (effect: VisualEffect) => boolean): boolean {
    return this.enabledEffects.some(predicate);
  }
}

/**
 * Optimized overlay manager for reduced DOM manipulation
 */
export class OverlayManager {
  private overlayCache = new Map<string, HTMLElement>();
  private lastOverlayState = '';

  /**
   * Creates or updates overlays efficiently
   */
  updateOverlays(
    effects: VisualEffect[],
    container: HTMLElement
  ): void {
    
    // Create state hash for comparison
    const stateHash = effects
      .filter(e => e.enabled)
      .map(e => `${e.id}:${e.intensity}`)
      .sort()
      .join('|');

    // Skip update if state hasn't changed
    if (stateHash === this.lastOverlayState) {

      return;
    }

    // Clear existing overlays
    this.clearOverlays();

    // Use the comprehensive overlay creation function from overlayManager

    createVisualFieldOverlays(effects, container);

    this.lastOverlayState = stateHash;

  }

  /**
   * Creates a single overlay element
   */
  private createOverlay(effect: VisualEffect, container: HTMLElement): void {
    const overlay = document.createElement('div');
    overlay.id = `visual-field-overlay-${effect.id}`;
    
    // Apply base styles
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '10'
    });

    // Apply effect-specific styles
    this.applyEffectStyles(overlay, effect);
    
    container.appendChild(overlay);
    this.overlayCache.set(effect.id, overlay);
  }

  /**
   * Applies styles based on effect type
   */
  private applyEffectStyles(overlay: HTMLElement, effect: VisualEffect): void {
    const { id, intensity } = effect;

    switch (id) {
      case 'tunnelVision':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 20)}%,
          rgba(0,0,0,${0.95 * intensity}) ${Math.max(40, 55 - intensity * 20)}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'hemianopiaLeft':
        overlay.style.background = `linear-gradient(to right, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) 45%, 
          rgba(0,0,0,0) 50%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'hemianopiaRight':
        overlay.style.background = `linear-gradient(to left, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) 45%, 
          rgba(0,0,0,0) 50%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'scotoma':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
          rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'visualFloaters':
        // Simplified floater pattern for better performance
        overlay.style.background = `radial-gradient(ellipse 20% 6% at 35% 35%, 
          rgba(0,0,0,${0.7 * intensity}) 0%, 
          rgba(0,0,0,${0.5 * intensity}) 20%,
          rgba(0,0,0,${0.3 * intensity}) 50%,
          rgba(0,0,0,0) 80%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.98, intensity).toString();
        break;

      case 'visualSnow':
        // Simplified visual snow pattern
        overlay.style.background = `radial-gradient(circle at 20% 20%, 
          rgba(255,255,255,${0.1 * intensity}) 0%, 
          transparent 2%
        ), radial-gradient(circle at 80% 80%, 
          rgba(255,255,255,${0.1 * intensity}) 0%, 
          transparent 2%
        )`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = intensity.toString();
        break;

      // New ocular diseases from specialty.vision
      case 'keratoconus':
        // Irregular distortion pattern
        overlay.style.background = `
          radial-gradient(ellipse at 30% 40%, rgba(0,0,0,${0.1 * intensity}) 0%, transparent 15%),
          radial-gradient(ellipse at 70% 60%, rgba(0,0,0,${0.08 * intensity}) 0%, transparent 12%),
          radial-gradient(ellipse at 50% 20%, rgba(0,0,0,${0.06 * intensity}) 0%, transparent 10%)
        `;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.4, intensity).toString();
        break;

      case 'dryEye':
        // Intermittent blur overlay
        overlay.style.background = `rgba(255,255,255,${0.1 * intensity})`;
        overlay.style.mixBlendMode = 'normal';
        overlay.style.opacity = Math.min(0.3, intensity).toString();
        break;

      // New ocular diseases from Richmond Eye Associates
      case 'vitreousHemorrhage':
        // Highly intensified blood veil effect with extensive blood streaks and pools
        overlay.style.background = `
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
          radial-gradient(ellipse at 55% 90%, rgba(139,0,0,${0.14 * intensity}) 0%, transparent 5%)
        `;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.9, intensity).toString();
        break;

      case 'retinalDetachment':
        // Curtain-like shadow progressing from periphery (matching Richmond Eye Associates simulation)
        overlay.style.background = `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity).toString();
        break;

      case 'posteriorSubcapsularCataract':
        // Severe glare and halos effect
        overlay.style.background = `
          radial-gradient(circle at 25% 25%, rgba(255,255,255,${0.4 * intensity}) 0%, transparent 12%),
          radial-gradient(circle at 75% 25%, rgba(255,255,255,${0.35 * intensity}) 0%, transparent 10%),
          radial-gradient(circle at 25% 75%, rgba(255,255,255,${0.45 * intensity}) 0%, transparent 14%),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,${0.3 * intensity}) 0%, transparent 8%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,${0.2 * intensity}) 0%, transparent 20%)
        `;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.8, intensity).toString();
        break;

      // New symptoms from specialty.vision
      case 'blueFieldPhenomena':
        // Moving dots pattern
        overlay.style.background = `
          radial-gradient(circle at 15% 25%, rgba(255,255,255,${0.15 * intensity}) 0%, transparent 1%),
          radial-gradient(circle at 35% 45%, rgba(255,255,255,${0.12 * intensity}) 0%, transparent 0.8%),
          radial-gradient(circle at 55% 15%, rgba(255,255,255,${0.18 * intensity}) 0%, transparent 1.2%),
          radial-gradient(circle at 75% 35%, rgba(255,255,255,${0.14 * intensity}) 0%, transparent 0.9%),
          radial-gradient(circle at 85% 65%, rgba(255,255,255,${0.16 * intensity}) 0%, transparent 1.1%)
        `;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.5, intensity).toString();
        break;

      case 'glare':
        // Bright glare effect
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(255,255,255,${0.3 * intensity}) 0%,
          rgba(255,255,255,${0.2 * intensity}) 20%,
          rgba(255,255,255,${0.1 * intensity}) 40%,
          transparent 60%
        )`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.7, intensity).toString();
        break;

      case 'halos':
        // Circular halo pattern
        overlay.style.background = `
          radial-gradient(circle at 25% 25%, rgba(255,255,255,${0.2 * intensity}) 0%, transparent 8%),
          radial-gradient(circle at 75% 25%, rgba(255,255,255,${0.18 * intensity}) 0%, transparent 7%),
          radial-gradient(circle at 25% 75%, rgba(255,255,255,${0.22 * intensity}) 0%, transparent 9%),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,${0.16 * intensity}) 0%, transparent 6%)
        `;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.6, intensity).toString();
        break;

      case 'starbursting':
        // Intensified starburst pattern with more rays and higher opacity
        overlay.style.background = `
          conic-gradient(from 0deg at 25% 25%, transparent 0deg, rgba(255,255,255,${0.25 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 22.5deg at 25% 25%, transparent 0deg, rgba(255,255,255,${0.22 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 45deg at 75% 25%, transparent 0deg, rgba(255,255,255,${0.28 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 67.5deg at 75% 25%, transparent 0deg, rgba(255,255,255,${0.24 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 90deg at 25% 75%, transparent 0deg, rgba(255,255,255,${0.30 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 112.5deg at 25% 75%, transparent 0deg, rgba(255,255,255,${0.26 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 135deg at 75% 75%, transparent 0deg, rgba(255,255,255,${0.32 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 157.5deg at 75% 75%, transparent 0deg, rgba(255,255,255,${0.28 * intensity}) 3deg, transparent 8deg),
          conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.20 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 202.5deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.18 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 225deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.22 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 247.5deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.20 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.24 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 292.5deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.22 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 315deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.26 * intensity}) 2deg, transparent 6deg),
          conic-gradient(from 337.5deg at 50% 50%, transparent 0deg, rgba(255,255,255,${0.24 * intensity}) 2deg, transparent 6deg)
        `;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.8, intensity).toString();
        break;

      case 'nightBlindness':
        // Dark overlay for night blindness
        overlay.style.background = `rgba(0,0,0,${0.7 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity).toString();
        break;

      case 'lossOfContrast':
        // Low contrast overlay
        overlay.style.background = `rgba(128,128,128,${0.3 * intensity})`;
        overlay.style.mixBlendMode = 'overlay';
        overlay.style.opacity = Math.min(0.6, intensity).toString();
        break;

      // New refractive errors from specialty.vision
      case 'presbyopia':
        // Blur overlay for near vision difficulty
        overlay.style.background = `rgba(255,255,255,${0.1 * intensity})`;
        overlay.style.mixBlendMode = 'normal';
        overlay.style.opacity = Math.min(0.4, intensity).toString();
        break;

      default:
        // Generic overlay for other effects
        overlay.style.background = `rgba(0,0,0,${0.8 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = intensity.toString();
        break;
    }
  }

  /**
   * Clears all overlays
   */
  clearOverlays(): void {
    this.overlayCache.forEach(overlay => overlay.remove());
    this.overlayCache.clear();
  }

  /**
   * Updates animated overlays efficiently
   */
  updateAnimatedOverlays(effects: VisualEffect[]): void {
    const scotoma = effects.find(e => e.id === 'scotoma' && e.enabled);
    const visualFloaters = effects.find(e => e.id === 'visualFloaters' && e.enabled);

    if (scotoma) {
      this.updateScotomaAnimation(scotoma.intensity);
    }

    if (visualFloaters) {
      this.updateFloatersAnimation(visualFloaters.intensity);
    }
  }

  /**
   * Updates scotoma animation with optimized calculations
   */
  private updateScotomaAnimation(intensity: number): void {
    const overlay = this.overlayCache.get('scotoma');
    if (!overlay) return;

    const now = Date.now();
    const x = 50 + Math.sin(now / 2000) * 10;
    const y = 50 + Math.cos(now / 2000) * 10;

    overlay.style.background = `radial-gradient(circle at ${x}% ${y}%, 
      rgba(0,0,0,${0.95 * intensity}) 0%, 
      rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
      rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
      rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
    )`;
  }

  /**
   * Updates floaters animation with simplified patterns
   */
  private updateFloatersAnimation(intensity: number): void {
    const overlay = this.overlayCache.get('visualFloaters');
    if (!overlay) return;

    const now = Date.now();
    const time = now * 0.001;
    
    // Simplified floater pattern for better performance
    const x = 35 + Math.sin(time * 0.1) * 15;
    const y = 35 + Math.cos(time * 0.08) * 12;

    overlay.style.background = `radial-gradient(ellipse 20% 6% at ${x}% ${y}%, 
      rgba(0,0,0,${0.7 * intensity}) 0%, 
      rgba(0,0,0,${0.5 * intensity}) 20%,
      rgba(0,0,0,${0.3 * intensity}) 50%,
      rgba(0,0,0,0) 80%
    )`;
  }
}

/**
 * Unified animation manager to prevent multiple animation loops
 */
export class AnimationManager {
  private static instance: AnimationManager;
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: Array<() => void> = [];
  private optimizer = PerformanceOptimizer.getInstance();

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  /**
   * Adds a callback to the animation loop
   */
  addCallback(callback: () => void): void {
    if (!this.callbacks.includes(callback)) {
      this.callbacks.push(callback);
    }
    this.start();
  }

  /**
   * Removes a callback from the animation loop
   */
  removeCallback(callback: () => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
    if (this.callbacks.length === 0) {
      this.stop();
    }
  }

  /**
   * Starts the unified animation loop
   */
  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.animate();
  }

  /**
   * Stops the animation loop
   */
  private stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    // Monitor performance
    this.optimizer.monitorPerformance();

    // Execute all callbacks
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        // Animation callback error - silently handle
      }
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Gets current performance status
   */
  getPerformanceStatus(): { fps: number; isThrottling: boolean } {
    return {
      fps: this.optimizer['fps'],
      isThrottling: this.optimizer['isThrottling']
    };
  }
}
