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
  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    conditionCount: number
  ): T {
    const frameRate = this.getOptimalFrameRate(conditionCount);
    const interval = 1000 / frameRate;
    let lastCall = 0;

    return ((...args: Parameters<T>) => {
      const now = performance.now();
      if (now - lastCall >= interval) {
        lastCall = now;
        return func(...args);
      }
    }) as T;
  }

  /**
   * Gets current FPS
   */
  getFps(): number {
    return this.fps;
  }

  /**
   * Gets current throttling state
   */
  getIsThrottling(): boolean {
    return this.isThrottling;
  }
}
