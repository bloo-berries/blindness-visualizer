/**
 * Optimized overlay manager for reduced DOM manipulation
 */

import { VisualEffect } from '../../types/visualEffects';
import { createVisualFieldOverlays } from '../overlayManager';

export class OverlayManager {
  private overlayCache = new Map<string, HTMLElement>();
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
        // Blood splatter effect - enhanced red saturation for visibility
        overlay.style.background = `
          /* Small dots - more visible */
          radial-gradient(circle at 36% 12%, rgba(200,15,15,${0.7 * intensity}) 0%, transparent 3%),
          radial-gradient(circle at 67% 54%, rgba(200,15,15,${0.75 * intensity}) 0%, transparent 3.5%),
          radial-gradient(circle at 98% 38%, rgba(200,15,15,${0.8 * intensity}) 0%, transparent 4%),
          radial-gradient(circle at 15% 30%, rgba(200,15,15,${0.65 * intensity}) 0%, transparent 2.5%),
          radial-gradient(circle at 80% 70%, rgba(200,15,15,${0.7 * intensity}) 0%, transparent 3%),
          /* Cobweb strands */
          radial-gradient(circle at 29% 61%, rgba(200,15,15,${0.7 * intensity}) 0%, transparent 3%),
          linear-gradient(201deg, rgba(200,15,15,${0.6 * intensity}) 0%, transparent 2.5%),
          radial-gradient(circle at 60% 45%, rgba(200,15,15,${0.75 * intensity}) 0%, transparent 3.5%),
          linear-gradient(268deg, rgba(200,15,15,${0.65 * intensity}) 0%, transparent 3%),
          /* Dark streaks */
          linear-gradient(89deg, rgba(160,10,10,${0.7 * intensity}) 0%, rgba(200,15,15,${0.6 * intensity}) 1%, transparent 4%),
          linear-gradient(178deg, rgba(160,10,10,${0.75 * intensity}) 0%, rgba(200,15,15,${0.65 * intensity}) 1.5%, transparent 5%),
          linear-gradient(45deg, rgba(160,10,10,${0.6 * intensity}) 0%, rgba(200,15,15,${0.5 * intensity}) 1%, transparent 3%),
          /* Irregular blobs - larger and more visible */
          radial-gradient(ellipse 6% 4% at 22% 68%, rgba(200,15,15,${0.75 * intensity}) 0%, rgba(160,10,10,${0.7 * intensity}) 2%, transparent 6%),
          radial-gradient(ellipse 8% 6% at 53% 21%, rgba(200,15,15,${0.8 * intensity}) 0%, rgba(160,10,10,${0.75 * intensity}) 3%, transparent 8%),
          radial-gradient(ellipse 10% 8% at 84% 75%, rgba(200,15,15,${0.7 * intensity}) 0%, rgba(160,10,10,${0.65 * intensity}) 4%, transparent 10%),
          radial-gradient(ellipse 7% 5% at 45% 85%, rgba(200,15,15,${0.75 * intensity}) 0%, rgba(160,10,10,${0.7 * intensity}) 3%, transparent 7%),
          /* Strong red haze */
          radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,15,15,${0.35 * intensity}) 0%, transparent 70%),
          radial-gradient(ellipse 80% 80% at 30% 40%, rgba(180,15,15,${0.3 * intensity}) 0%, transparent 60%),
          radial-gradient(ellipse 80% 80% at 70% 60%, rgba(180,15,15,${0.3 * intensity}) 0%, transparent 60%),
          /* Bottom accumulation - blood pooling */
          linear-gradient(to bottom, transparent 60%, rgba(170,10,10,${0.45 * intensity}) 80%, rgba(150,5,5,${0.6 * intensity}) 100%),
          /* Strong red tint overlay */
          rgba(200,20,20,${0.3 * intensity})
        `;
        overlay.style.mixBlendMode = 'multiply';
        overlay.style.opacity = Math.min(0.95, 0.7 + intensity * 0.25).toString();
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
    // Also remove DOM overlays created by createVisualFieldOverlays
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());
    this.lastOverlayState = '';
  }

  /**
   * Updates animated overlays efficiently
   */
  updateAnimatedOverlays(effects: VisualEffect[]): void {
    const scotoma = effects.find(e => e.id === 'scotoma' && e.enabled);
    const visualFloaters = effects.find(e => e.id === 'visualFloaters' && e.enabled);
    const vitreousHemorrhage = effects.find(e => e.id === 'vitreousHemorrhage' && e.enabled);

    if (scotoma) {
      this.updateScotomaAnimation(scotoma.intensity);
    }

    if (visualFloaters) {
      this.updateFloatersAnimation(visualFloaters.intensity);
    }

    if (vitreousHemorrhage) {
      this.updateVitreousHemorrhageAnimation(vitreousHemorrhage.intensity);
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

  /**
   * Updates vitreous hemorrhage animation with gravitational settling
   * Blood settles to the bottom of the visual field over time
   */
  private updateVitreousHemorrhageAnimation(intensity: number): void {
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
      // Using enhanced saturated red colors for visibility
      const floaterGradients = floaters.map(floater => {
        const settledY = Math.min(100, floater.y + settleAmount);
        // Enhanced opacity multiplier for more visible blood
        const opacityMult = Math.min(1, floater.opacity * storedIntensity * 1.4);
        const baseColor = `rgba(200,15,15,${opacityMult})`;
        const darkRed = `rgba(160,10,10,${opacityMult * 0.9})`;

        // Add slight horizontal drift
        const driftX = floater.x + Math.sin(now * 0.0001 + floater.x) * 0.5;
        // Larger size multiplier for more visible splatters
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

      // Strong red haze effect
      const hazeGradient = `
        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,15,15,${0.35 * storedIntensity}) 0%, transparent 70%),
        radial-gradient(ellipse 80% 80% at 30% 40%, rgba(180,15,15,${0.3 * storedIntensity}) 0%, transparent 60%),
        radial-gradient(ellipse 80% 80% at 70% 60%, rgba(180,15,15,${0.3 * storedIntensity}) 0%, transparent 60%)
      `;

      // Strong red tint overlay
      const redTint = `rgba(200,20,20,${0.3 * storedIntensity})`;

      // Bottom accumulation (blood pools at bottom)
      const bottomAccumulation = `
        linear-gradient(to bottom, transparent 60%, rgba(170,10,10,${0.45 * storedIntensity}) 80%, rgba(150,5,5,${0.6 * storedIntensity}) 100%)
      `;

      // Combine all layers
      const background = `
        ${floaterGradients},
        ${hazeGradient},
        ${bottomAccumulation},
        ${redTint}
      `.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');

      overlay.style.background = background;
      // Ensure high opacity
      overlay.style.opacity = Math.min(0.95, 0.7 + storedIntensity * 0.25).toString();
    } catch (e) {
      // If parsing fails, skip animation update
    }
  }
}
