/**
 * Unified animation manager to prevent multiple animation loops
 */

import { PerformanceOptimizer } from './PerformanceOptimizer';

export class AnimationManager {
  private static instance: AnimationManager;
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: Array<() => void> = [];
  private optimizer = PerformanceOptimizer.getInstance();
  private reducedMotionQuery: MediaQueryList | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);
    }
  }

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  /**
   * Checks whether reduced motion is active (OS setting or in-app toggle).
   */
  isReducedMotion(): boolean {
    return (
      (this.reducedMotionQuery?.matches ?? false) ||
      document.documentElement.classList.contains('reduced-motion-mode')
    );
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

    if (this.isReducedMotion()) {
      // Execute all callbacks once for a static frame, then stop
      this.executeCallbacks();
      this.isRunning = false;
      return;
    }

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
   * Execute all registered callbacks once
   */
  private executeCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        // Animation callback error - silently handle
      }
    });
  }

  /**
   * Handle OS reduced-motion preference change mid-session
   */
  private handleReducedMotionChange = (): void => {
    if (this.isReducedMotion()) {
      // Stop the loop; execute once for a final static frame
      this.stop();
      if (this.callbacks.length > 0) {
        this.executeCallbacks();
      }
    } else if (this.callbacks.length > 0 && !this.isRunning) {
      // Preference turned off — restart animation
      this.isRunning = true;
      this.animate();
    }
  };

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    // Monitor performance
    this.optimizer.monitorPerformance();

    // Execute all callbacks
    this.executeCallbacks();

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Gets current performance status
   */
  getPerformanceStatus(): { fps: number; isThrottling: boolean } {
    return {
      fps: this.optimizer.getFps(),
      isThrottling: this.optimizer.getIsThrottling()
    };
  }
}
