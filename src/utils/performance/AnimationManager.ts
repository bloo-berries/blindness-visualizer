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
      fps: this.optimizer.getFps(),
      isThrottling: this.optimizer.getIsThrottling()
    };
  }
}
