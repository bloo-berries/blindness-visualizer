import { VisualEffect } from '../types/visualEffects';
import { OVERLAY_BASE_STYLES, Z_INDEX } from './overlayConstants';
import { createEffectMap, getEffectById } from './effectLookup';
import { createVisualFieldLossOverlays } from './overlays/visualFieldLossOverlays';
import { createVisualDisturbanceOverlays } from './overlays/visualDisturbanceOverlays';
import { createRetinalDiseaseOverlays } from './overlays/retinalDiseaseOverlays';
import { createFamousPeopleOverlays } from './overlays/famousPeopleOverlays';
import { createOcularOverlays } from './overlays/ocularOverlays';
import { createOverlay } from './overlays/overlayHelpers';

/**
 * Creates visual field overlays for all enabled effects
 */
export const createVisualFieldOverlays = (effects: VisualEffect[], container?: HTMLElement): void => {
  
  // Log all effects for debugging
  
  // Remove existing overlays first
  document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(overlay => overlay.remove());

  // Create effect lookup map for O(1) access instead of O(n) finds
  const effectMap = createEffectMap(effects);
  const getEffect = (id: string) => getEffectById(effectMap, id);
  
  // Use category-based overlay generators for better organization
  // Visual Field Loss Overlays
  createVisualFieldLossOverlays(effectMap, container);

  // Visual Disturbance Overlays
  createVisualDisturbanceOverlays(effectMap, container);

  // Retinal Disease Overlays
  createRetinalDiseaseOverlays(effectMap, container);
  
  // Famous People Overlays
  createFamousPeopleOverlays(effectMap, container);

  // Ocular Condition Overlays (cataracts, etc.)
  createOcularOverlays(effectMap);

  // Get remaining effects for other categories (not handled by category modules)
  const [
    keratoconus, vitreousHemorrhage
  ] = [
    'keratoconus', 'vitreousHemorrhage'
  ].map(getEffect);
  // Note: diplopia is handled by shader effects, not overlays
  // Retinitis Pigmentosa is now handled by both shaders (for webcam) and overlays (for YouTube/images)
  // Visual disturbances (visualSnow, hallucinations, visualAura, etc.) are handled by createVisualDisturbanceOverlays above

  // Keratoconus - Progressive corneal thinning with irregular cone shape
  if (keratoconus?.enabled) {
    const intensity = keratoconus.intensity;
    
    // Create multiple ghost images (monocular diplopia/polyopia)
    // 2-8+ overlapping copies with slight offsets - ENHANCED CONTRAST
    const ghostCount = Math.max(2, Math.floor(2 + intensity * 6)); // 2-8 ghosts based on intensity
    const ghostOffsets = [];
    
    for (let i = 0; i < ghostCount; i++) {
      const angle = (i / ghostCount) * Math.PI * 2;
      const distance = 2 + intensity * 5; // 2-7px offset (increased for higher contrast)
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      ghostOffsets.push(`translate(${offsetX}px, ${offsetY}px)`);
    }
    
    // Create streaking and comet tails effect - ENHANCED CONTRAST
    const streakIntensity = intensity * 1.2; // Increased intensity
    const streakLength = 30 + intensity * 40; // 30-70px streaks (longer for more dramatic effect)
    
    // Create halos around lights - ENHANCED CONTRAST
    const haloIntensity = intensity * 1.0; // Increased intensity
    const haloSize = 15 + intensity * 25; // 15-40px halos (larger for more visibility)
    
    // Create wavy distortion for text - ENHANCED
    const waveIntensity = intensity * 0.8; // Increased distortion
    
    // High contrast loss - ENHANCED
    const contrastLoss = intensity * 1.0; // Increased contrast loss
    
    // Create comprehensive keratoconus overlay with ENHANCED CONTRAST
    createOverlay(
      'visual-field-overlay-keratoconus',
      `
        /* Multiple ghost images - ENHANCED CONTRAST */
        ${ghostOffsets.map((offset, i) => `
          linear-gradient(${45 + i * 15}deg, 
            rgba(255,255,255,${intensity * 0.3}) 0%, 
            rgba(255,255,255,${intensity * 0.2}) 50%, 
            rgba(255,255,255,${intensity * 0.1}) 80%,
            transparent 100%
          )
        `).join(', ')}
        /* Streaking and comet tails - ENHANCED CONTRAST */
        , linear-gradient(90deg, 
          rgba(255,255,255,${streakIntensity * 0.6}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.4}) ${streakLength * 0.3}%, 
          rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.6}%,
          rgba(255,255,255,${streakIntensity * 0.1}) ${streakLength}%, 
          transparent 100%
        )
        , linear-gradient(45deg, 
          rgba(255,255,255,${streakIntensity * 0.5}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.3}) ${streakLength * 0.4}%, 
          rgba(255,255,255,${streakIntensity * 0.15}) ${streakLength * 0.8}%, 
          transparent 100%
        )
        , linear-gradient(135deg, 
          rgba(255,255,255,${streakIntensity * 0.4}) 0%, 
          rgba(255,255,255,${streakIntensity * 0.2}) ${streakLength * 0.5}%, 
          transparent 100%
        )
        /* Halos around lights - ENHANCED CONTRAST */
        , radial-gradient(circle at 20% 20%, 
          rgba(255,255,255,${haloIntensity * 0.8}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.6}) ${haloSize * 0.3}%, 
          rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.6}%,
          rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
          transparent ${haloSize * 2}%
        )
        , radial-gradient(circle at 80% 30%, 
          rgba(255,255,255,${haloIntensity * 0.7}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.5}) ${haloSize * 0.4}%, 
          rgba(255,255,255,${haloIntensity * 0.3}) ${haloSize * 0.8}%,
          rgba(255,255,255,${haloIntensity * 0.15}) ${haloSize * 1.2}%, 
          transparent ${haloSize * 2}%
        )
        , radial-gradient(circle at 50% 80%, 
          rgba(255,255,255,${haloIntensity * 0.6}) 0%, 
          rgba(255,255,255,${haloIntensity * 0.4}) ${haloSize * 0.5}%, 
          rgba(255,255,255,${haloIntensity * 0.2}) ${haloSize}%, 
          transparent ${haloSize * 1.5}%
        )
        /* High contrast loss - ENHANCED */
        , rgba(0,0,0,${contrastLoss * 0.5})
        , rgba(128,128,128,${contrastLoss * 0.3})
      `,
      'multiply',
      intensity.toString(),
      `
        /* Enhanced wavy distortion filter */
        blur(${waveIntensity * 3}px) 
        contrast(${100 - contrastLoss * 60}%) 
        brightness(${100 + intensity * 30}%)
        saturate(${100 - intensity * 40}%)
      `,
      undefined,
      'keratoconus'
    );
  }

  // Vitreous Hemorrhage - Blood in the vitreous humor causing red-tinted vision
  // Implementation with animated floaters, gravitational settling, haze, and red tint
  if (vitreousHemorrhage?.enabled) {
    const intensity = vitreousHemorrhage.intensity;
    
    // Generate floater positions (pre-computed for performance)
    // Different types: small dots, cobweb strands, dark streaks, large blobs
    const floaterCount = Math.max(8, Math.floor(8 + intensity * 20)); // 8-28 floaters based on intensity
    const floaters: Array<{type: 'dot' | 'cobweb' | 'streak' | 'blob', x: number, y: number, size: number, opacity: number, angle?: number}> = [];
    
    for (let i = 0; i < floaterCount; i++) {
      const rand = Math.random();
      let type: 'dot' | 'cobweb' | 'streak' | 'blob';
      let size: number;
      let opacity: number;
      let angle: number | undefined;
      
      if (rand < 0.3) {
        // Small dots (30% of floaters) - increased size for visibility
        type = 'dot';
        size = 1.5 + Math.random() * 2.5; // 1.5-4% of screen (increased from 0.5-2%)
        opacity = 0.5 + Math.random() * 0.4; // 0.5-0.9 (increased from 0.4-0.8)
      } else if (rand < 0.6) {
        // Cobweb/spider-web strands (30% of floaters)
        type = 'cobweb';
        size = 2 + Math.random() * 3; // 2-5% of screen
        opacity = 0.3 + Math.random() * 0.3; // 0.3-0.6
        angle = Math.random() * 360;
      } else if (rand < 0.85) {
        // Dark streaks/lines (25% of floaters)
        type = 'streak';
        size = 1.5 + Math.random() * 2.5; // 1.5-4% of screen
        opacity = 0.5 + Math.random() * 0.3; // 0.5-0.8
        angle = Math.random() * 360;
      } else {
        // Large amorphous blobs (15% of floaters)
        type = 'blob';
        size = 3 + Math.random() * 4; // 3-7% of screen
        opacity = 0.6 + Math.random() * 0.3; // 0.6-0.9
      }
      
      floaters.push({
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: opacity * intensity,
        angle
      });
    }
    
    // Generate background gradients for floaters - increased reddish hue
    const floaterGradients = floaters.map(floater => {
      const baseColor = `rgba(180,0,0,${floater.opacity})`; // More saturated red
      const darkRed = `rgba(120,0,0,${floater.opacity * 0.8})`; // More saturated dark red
      
      switch (floater.type) {
        case 'dot':
          // Make dots more visible with a solid center and gradual fade
          return `radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, ${baseColor} ${floater.size * 0.3}%, transparent ${floater.size}%)`;
        case 'cobweb':
          // Create spider-web like pattern
          const webAngle = floater.angle || 0;
          return `
            linear-gradient(${webAngle}deg, ${baseColor} 0%, transparent ${floater.size * 0.3}%),
            linear-gradient(${webAngle + 60}deg, ${baseColor} 0%, transparent ${floater.size * 0.3}%),
            linear-gradient(${webAngle + 120}deg, ${baseColor} 0%, transparent ${floater.size * 0.3}%),
            radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, transparent ${floater.size * 0.5}%)
          `;
        case 'streak':
          // Create dark streak along vitreous fibers
          const streakAngle = floater.angle || 0;
          return `linear-gradient(${streakAngle}deg, ${darkRed} 0%, ${baseColor} ${floater.size * 0.2}%, transparent ${floater.size}%)`;
        case 'blob':
          // Large amorphous blob
          return `radial-gradient(ellipse ${floater.size * 1.2}% ${floater.size}% at ${floater.x}% ${floater.y}%, ${baseColor} 0%, ${darkRed} ${floater.size * 0.3}%, transparent ${floater.size}%)`;
        default:
          return '';
      }
    }).filter(g => g).join(', ');
    
    // Overall red/pink tint overlay (light filtering from blood) - increased reddish hue
    const redTint = `rgba(220,20,20,${0.25 * intensity})`;
    
    // Haze/fog effect (diffuse blood scattering light) - increased reddish hue
    const hazeGradient = `
      radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180,0,0,${0.12 * intensity}) 0%, transparent 70%),
      radial-gradient(ellipse 80% 80% at 30% 40%, rgba(180,0,0,${0.1 * intensity}) 0%, transparent 60%),
      radial-gradient(ellipse 80% 80% at 70% 60%, rgba(180,0,0,${0.1 * intensity}) 0%, transparent 60%)
    `;
    
    // Combine all layers: floaters + haze + red tint
    // Note: Gravitational settling will be handled by animation updates
    let vitreousBackground = `
      ${floaterGradients},
      ${hazeGradient},
      ${redTint}
    `;
    
    // Remove trailing comma and clean up whitespace
    vitreousBackground = vitreousBackground.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');
    
    // Store floater data for animation updates (gravitational settling)
    const overlayId = 'visual-field-overlay-vitreousHemorrhage';
    let overlayElement = document.getElementById(overlayId);
    
    if (!overlayElement) {
      // Create overlay element directly to ensure we have a reference
      overlayElement = document.createElement('div');
      overlayElement.id = overlayId;
      overlayElement.className = 'vitreous-hemorrhage-overlay';
      overlayElement.setAttribute('data-floaters', JSON.stringify(floaters));
      overlayElement.setAttribute('data-intensity', intensity.toString());
      
      // Apply base overlay styles - use higher z-index to ensure it appears above YouTube iframe
      Object.assign(overlayElement.style, {
        ...OVERLAY_BASE_STYLES,
        zIndex: (Z_INDEX.BASE + 50).toString(), // Higher z-index to appear above YouTube iframe
        background: vitreousBackground,
        mixBlendMode: 'multiply',
        opacity: Math.min(0.81, intensity).toString(),
      });
      
      // Add CSS animation class for floater movement
      overlayElement.classList.add('vitreous-hemorrhage-animated');
      
      // Find container and append
      let targetContainer: Element | null = container || null;
      
      if (!targetContainer) {
        // Try to find container using CONTAINER_SELECTORS
        const selectors = [
          '.visualizer-container',
          '[class*="visualizer"]',
          'iframe[src*="youtube"]',
          'canvas'
        ];
        
        for (const selector of selectors) {
          if (selector === 'iframe[src*="youtube"]') {
            const iframe = document.querySelector(selector);
            if (iframe) {
              targetContainer = iframe.parentElement;
              break;
            }
          } else if (selector === 'canvas') {
            const canvas = document.querySelector(selector);
            if (canvas) {
              targetContainer = canvas.parentElement;
              break;
            }
          } else {
            targetContainer = document.querySelector(selector);
            if (targetContainer) {
              break;
            }
          }
        }
      }
      
      if (targetContainer) {
        targetContainer.appendChild(overlayElement);
        
        // Force container to have relative positioning
        if (targetContainer instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(targetContainer);
          if (computedStyle.position === 'static') {
            targetContainer.style.position = 'relative';
          }
        }
      } else {
        // Fallback to body
        document.body.appendChild(overlayElement);
      }
    } else {
      // Update existing overlay - ensure it's still in the right container and visible
      overlayElement.setAttribute('data-floaters', JSON.stringify(floaters));
      overlayElement.setAttribute('data-intensity', intensity.toString());
      overlayElement.style.background = vitreousBackground;
      overlayElement.style.opacity = Math.min(0.81, intensity).toString();
      overlayElement.style.zIndex = (Z_INDEX.BASE + 50).toString(); // Ensure z-index is correct
      
      // Ensure animation class is present
      if (!overlayElement.classList.contains('vitreous-hemorrhage-animated')) {
        overlayElement.classList.add('vitreous-hemorrhage-animated');
      }
      
      // Verify overlay is still in a container (might have been removed by video iframe changes)
      if (!overlayElement.parentElement) {
        // Re-append to container if it was removed
        let targetContainer: Element | null = container || null;
        
        if (!targetContainer) {
          const selectors = [
            '.visualizer-container',
            '[class*="visualizer"]',
            'iframe[src*="youtube"]',
            'canvas'
          ];
          
          for (const selector of selectors) {
            if (selector === 'iframe[src*="youtube"]') {
              const iframe = document.querySelector(selector);
              if (iframe) {
                targetContainer = iframe.parentElement;
                break;
              }
            } else if (selector === 'canvas') {
              const canvas = document.querySelector(selector);
              if (canvas) {
                targetContainer = canvas.parentElement;
                break;
              }
            } else {
              targetContainer = document.querySelector(selector);
              if (targetContainer) {
                break;
              }
            }
          }
        }
        
        if (targetContainer) {
          targetContainer.appendChild(overlayElement);
        } else {
          document.body.appendChild(overlayElement);
        }
      }
    }
  }
};
