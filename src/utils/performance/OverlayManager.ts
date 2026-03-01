/**
 * Optimized overlay manager for reduced DOM manipulation
 */

import { VisualEffect } from '../../types/visualEffects';
import { createVisualFieldOverlays } from '../overlayManager';

export class OverlayManager {
  private lastOverlayState = '';
  private lastComparisonMode: boolean | undefined = undefined;

  /**
   * Creates or updates overlays efficiently
   */
  updateOverlays(
    effects: VisualEffect[],
    container: HTMLElement,
    isComparisonMode?: boolean
  ): void {

    // Create state hash for comparison - include container to handle mode switches
    const stateHash = effects
      .filter(e => e.enabled)
      .map(e => `${e.id}:${e.intensity}`)
      .sort()
      .join('|') + `|container:${container.id || container.className || 'default'}`;

    // Check if comparison mode has changed
    const comparisonModeChanged = isComparisonMode !== undefined && isComparisonMode !== this.lastComparisonMode;
    if (comparisonModeChanged) {
      this.lastComparisonMode = isComparisonMode;
    }

    // Skip update if state hasn't changed and comparison mode hasn't changed
    if (stateHash === this.lastOverlayState && !comparisonModeChanged) {
      return;
    }

    // Clear existing overlays
    this.clearOverlays();

    // Delegate to the modular overlay creation system
    createVisualFieldOverlays(effects, container);

    this.lastOverlayState = stateHash;
  }

  /**
   * Clears all overlays
   */
  clearOverlays(): void {
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());
    this.lastOverlayState = '';
  }

  /**
   * Updates animated overlays (vitreous hemorrhage gravitational settling)
   */
  updateAnimatedOverlays(effects: VisualEffect[]): void {
    const vitreousHemorrhage = effects.find(e => e.id === 'vitreousHemorrhage' && e.enabled);

    if (vitreousHemorrhage) {
      this.updateVitreousHemorrhageAnimation(vitreousHemorrhage.intensity);
    }
  }

  /**
   * Updates vitreous hemorrhage animation with gravitational settling
   * Blood settles to the bottom of the visual field over time
   */
  private updateVitreousHemorrhageAnimation(_intensity: number): void {
    const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
    if (!overlay) return;

    // Get stored floater data
    const floatersData = overlay.getAttribute('data-floaters');
    if (!floatersData) return;

    try {
      const floaters: Array<{type: string, x: number, y: number, size: number, opacity: number, angle?: number}> = JSON.parse(floatersData);
      const storedIntensity = parseFloat(overlay.getAttribute('data-intensity') || '0');

      // Calculate time-based gravitational settling
      const now = Date.now();
      const timeElapsed = (now % 3600000) / 3600000; // Cycle every hour for demo
      const settleAmount = timeElapsed * 15; // Blood settles up to 15% downward

      // Generate updated floater positions with gravitational settling
      const floaterGradients = floaters.map(floater => {
        const settledY = Math.min(100, floater.y + settleAmount);
        const opacityMult = Math.min(1, floater.opacity * storedIntensity * 1.4);
        const baseColor = `rgba(200,15,15,${opacityMult})`;
        const darkRed = `rgba(160,10,10,${opacityMult * 0.9})`;

        const driftX = floater.x + Math.sin(now * 0.0001 + floater.x) * 0.5;
        const sizeMult = floater.size * 1.5;

        switch (floater.type) {
          case 'dot':
            return `radial-gradient(circle at ${driftX}% ${settledY}%, ${baseColor} 0%, transparent ${sizeMult}%)`;
          case 'cobweb':
            const webAngle = (floater.angle || 0) + Math.sin(now * 0.0002) * 2;
            return `
              radial-gradient(circle at ${driftX}% ${settledY}%, ${baseColor} 0%, transparent ${sizeMult * 0.6}%),
              linear-gradient(${webAngle}deg, ${baseColor} 0%, transparent ${sizeMult * 0.5}%)
            `;
          case 'streak':
            const streakAngle = (floater.angle || 0) + Math.sin(now * 0.00015) * 1;
            return `linear-gradient(${streakAngle}deg, ${darkRed} 0%, ${baseColor} ${sizeMult * 0.3}%, transparent ${sizeMult}%)`;
          case 'blob':
            return `radial-gradient(ellipse ${sizeMult * 1.3}% ${sizeMult}% at ${driftX}% ${settledY}%, ${baseColor} 0%, ${darkRed} ${sizeMult * 0.4}%, transparent ${sizeMult}%)`;
          default:
            return '';
        }
      }).filter(g => g).join(', ');

      const hazeGradient = `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,15,15,${0.35 * storedIntensity}) 0%, transparent 70%),
        radial-gradient(ellipse 80% 80% at 30% 40%, rgba(180,15,15,${0.3 * storedIntensity}) 0%, transparent 60%),
        radial-gradient(ellipse 80% 80% at 70% 60%, rgba(180,15,15,${0.3 * storedIntensity}) 0%, transparent 60%)
      `;

      const redTint = `rgba(200,20,20,${0.3 * storedIntensity})`;

      const bottomAccumulation = `
        linear-gradient(to bottom, transparent 60%, rgba(170,10,10,${0.45 * storedIntensity}) 80%, rgba(150,5,5,${0.6 * storedIntensity}) 100%)
      `;

      const background = `
        ${floaterGradients},
        ${hazeGradient},
        ${bottomAccumulation},
        ${redTint}
      `.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');

      overlay.style.background = background;
      overlay.style.opacity = Math.min(0.95, 0.7 + storedIntensity * 0.25).toString();
    } catch (e) {
      // If parsing fails, skip animation update
    }
  }
}
