/**
 * Performance optimization utilities for vision simulator
 * Addresses performance bottlenecks when multiple conditions are active
 */

import { VisualEffect } from '../types/visualEffects';

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

    // Create new overlays only for enabled effects
    const enabledEffects = effects.filter(effect => effect.enabled);
    
    enabledEffects.forEach(effect => {
      this.createOverlay(effect, container);
    });

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

      // John Milton-specific effects
      case 'miltonGlaucomaHalos':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(255,0,0,${0.3 * intensity}) 0%, 
          rgba(255,165,0,${0.2 * intensity}) 20%,
          rgba(255,255,0,${0.15 * intensity}) 40%,
          rgba(0,255,0,${0.1 * intensity}) 60%,
          rgba(0,0,255,${0.05 * intensity}) 80%,
          transparent 100%
        )`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.7, intensity * 0.7).toString();
        break;

      case 'miltonProgressiveVignetting':
        const miltonTunnelRadius = Math.max(5, 40 - intensity * 35);
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${miltonTunnelRadius - 5}%,
          rgba(0,0,0,${0.95 * intensity}) ${miltonTunnelRadius}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'miltonTemporalFieldLoss':
        overlay.style.background = `linear-gradient(90deg, 
          rgba(0,0,0,${0.95 * intensity}) 0%,
          rgba(0,0,0,${0.95 * intensity}) 20%,
          rgba(0,0,0,0) 30%,
          rgba(0,0,0,0) 70%,
          rgba(0,0,0,${0.95 * intensity}) 80%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      case 'miltonRetinalDetachment':
        overlay.style.background = `linear-gradient(180deg, 
          rgba(0,0,0,${0.8 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 30%,
          rgba(0,0,0,0) 40%,
          rgba(0,0,0,0) 60%,
          rgba(0,0,0,${0.6 * intensity}) 70%,
          rgba(0,0,0,${0.6 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity).toString();
        break;

      case 'miltonPhotophobia':
        overlay.style.background = `rgba(255,255,255,${0.6 * intensity})`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.6, intensity).toString();
        break;

      // Erik Weihenmayer - Retinoschisis Island Effects
      case 'erikRetinoschisisIslands':
        // Create multiple irregular island overlays with sharp boundaries
        // This is a simplified version - the full implementation creates multiple overlays
        overlay.style.background = `rgba(0,0,0,${0.8 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity * 0.8).toString();
        overlay.style.clipPath = 'polygon(15% 10%, 35% 8%, 40% 25%, 25% 30%, 10% 20%, 65% 40%, 85% 35%, 90% 55%, 75% 65%, 60% 50%)';
        break;

      case 'erikIslandFragmentation':
        overlay.style.background = `rgba(0,0,0,${0.8 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity * 0.8).toString();
        overlay.style.clipPath = 'polygon(20% 15%, 30% 12%, 35% 30%, 20% 35%, 70% 45%, 80% 40%, 85% 60%, 70% 70%)';
        break;

      case 'erikProgressiveLoss':
        overlay.style.background = `rgba(0,0,0,${0.8 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.8, intensity * 0.8).toString();
        overlay.style.clipPath = 'polygon(25% 20%, 25% 20%, 30% 35%, 15% 40%, 75% 50%, 75% 50%, 80% 65%, 65% 75%)';
        break;

      // Complete blindness effects - Total darkness (100% black overlay)
      case 'completeBlindness':
      case 'vedCompleteBlindness':
      case 'erikCompleteBlindness':
      case 'joshuaCompleteBlindness':
        overlay.style.background = `rgba(0,0,0,${intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = intensity.toString();
        break;

      // Ved Mehta spatial awareness effects
      case 'vedSpatialAwareness':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          transparent 0%, 
          rgba(80,80,80,${intensity * 0.2}) 20%, 
          rgba(60,60,60,${intensity * 0.3}) 40%, 
          rgba(40,40,40,${intensity * 0.4}) 60%, 
          rgba(20,20,20,${intensity * 0.5}) 100%
        )`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.6, intensity * 0.6).toString();
        break;

      case 'vedEchoLocation':
        overlay.style.background = `conic-gradient(from 0deg at 50% 50%, 
          transparent 0deg, 
          rgba(100,120,100,${intensity * 0.15}) 45deg, 
          transparent 90deg, 
          rgba(100,120,100,${intensity * 0.15}) 135deg, 
          transparent 180deg, 
          rgba(100,120,100,${intensity * 0.15}) 225deg, 
          transparent 270deg, 
          rgba(100,120,100,${intensity * 0.15}) 315deg, 
          transparent 360deg
        )`;
        overlay.style.mixBlendMode = 'screen';
        overlay.style.opacity = Math.min(0.6, intensity * 0.6).toString();
        break;

      // Christine Ha NMO effects
      case 'christineNMOComplete':
      case 'christineSteamyMirror':
        overlay.style.background = `rgba(200,200,200,${0.8 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.7, intensity * 0.7).toString();
        overlay.style.filter = `blur(${intensity * 10}px)`;
        break;

      // Lucy Edwards effects
      case 'lucyCompleteVision':
      case 'lucyFrostedGlass':
        overlay.style.background = `rgba(150,150,150,${0.7 * intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.7, intensity * 0.7).toString();
        overlay.style.filter = `blur(${intensity * 15}px) saturate(${1 - intensity * 0.8})`;
        break;

      // David Paterson hemispheric vision
      case 'davidCompleteVision':
      case 'davidHemisphericVision':
        overlay.style.background = `linear-gradient(to right, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) 45%, 
          rgba(0,0,0,0) 50%,
          rgba(0,0,0,${0.7 * intensity}) 55%,
          rgba(0,0,0,${0.7 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      // Marla Runyan Stargardt effects - Large central scotoma with preserved peripheral vision
      case 'marlaStargardtComplete':
      case 'marlaCentralScotoma':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) 15%,
          rgba(0,0,0,${0.7 * intensity}) 20%,
          rgba(0,0,0,${0.3 * intensity}) 25%,
          rgba(0,0,0,0) 30%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;

      // Dr. Mona Minkara effects
      case 'minkaraEndStageComplete':
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
          rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
        break;


      // John Milton - Gradual blindness (complete darkness)
      case 'miltonProgressiveBlindness':
        overlay.style.background = `rgba(0,0,0,${intensity})`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = intensity.toString();
        break;

      // Erik Weihenmayer - Early stage retinoschisis (tunnel vision)
      case 'erikScanningBehavior':
      case 'erikCognitiveLoad':
        const erikTunnelRadius = Math.max(10, 30 - intensity * 20);
        overlay.style.background = `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${erikTunnelRadius - 5}%,
          rgba(0,0,0,${0.95 * intensity}) ${erikTunnelRadius}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, intensity).toString();
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
        console.error('Animation callback error:', error);
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
