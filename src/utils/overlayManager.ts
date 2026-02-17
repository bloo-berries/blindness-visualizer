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
  // Creates multiple focal points causing ghost images, streaking, and halos
  if (keratoconus?.enabled) {
    const intensity = keratoconus.intensity;

    // Keratoconus visual symptoms:
    // 1. Multiple ghost images (polyopia) - cone shape creates multiple focal points
    // 2. Streaking/comet tails from light sources
    // 3. Halos around bright areas
    // 4. High-order aberrations causing irregular distortion

    const ghostCount = Math.max(3, Math.floor(3 + intensity * 5)); // 3-8 ghost images
    const streakOpacity = 0.15 + intensity * 0.25;
    const haloOpacity = 0.2 + intensity * 0.3;

    // Create ghost image effect using multiple offset radial gradients
    const ghostLayers: string[] = [];
    for (let i = 0; i < ghostCount; i++) {
      const angle = (i / ghostCount) * Math.PI * 2;
      const distance = 3 + intensity * 8; // 3-11% offset
      const offsetX = 50 + Math.cos(angle) * distance;
      const offsetY = 50 + Math.sin(angle) * distance;
      const ghostOpacity = (0.08 + intensity * 0.12) * (1 - i * 0.1);

      ghostLayers.push(
        `radial-gradient(ellipse 80% 80% at ${offsetX}% ${offsetY}%, rgba(255,255,255,${ghostOpacity}) 0%, rgba(255,255,255,${ghostOpacity * 0.5}) 30%, transparent 70%)`
      );
    }

    // Streaking effect - elongated gradients simulating comet tails
    const streaks = [
      `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${streakOpacity}) 20%, rgba(255,255,255,${streakOpacity * 0.6}) 50%, transparent 100%)`,
      `linear-gradient(160deg, transparent 0%, rgba(255,255,255,${streakOpacity * 0.7}) 30%, transparent 70%)`,
      `linear-gradient(200deg, transparent 0%, rgba(255,255,255,${streakOpacity * 0.7}) 30%, transparent 70%)`,
      `linear-gradient(135deg, transparent 20%, rgba(255,255,255,${streakOpacity * 0.5}) 40%, rgba(255,255,255,${streakOpacity * 0.3}) 60%, transparent 80%)`,
      `linear-gradient(225deg, transparent 20%, rgba(255,255,255,${streakOpacity * 0.4}) 40%, transparent 70%)`
    ];

    // Halos around simulated light sources
    const halos = [
      `radial-gradient(ellipse 60% 70% at 50% 45%, rgba(255,255,255,${haloOpacity}) 0%, rgba(255,255,255,${haloOpacity * 0.5}) 40%, transparent 70%)`,
      `radial-gradient(circle at 30% 25%, rgba(255,255,255,${haloOpacity * 0.6}) 0%, transparent 20%)`,
      `radial-gradient(circle at 70% 35%, rgba(255,255,255,${haloOpacity * 0.5}) 0%, transparent 18%)`,
      `radial-gradient(circle at 50% 75%, rgba(255,255,255,${haloOpacity * 0.4}) 0%, transparent 15%)`
    ];

    // Combine all effects
    const background = [...ghostLayers, ...streaks, ...halos].join(', ');

    createOverlay(
      'visual-field-overlay-keratoconus',
      background,
      'screen', // Use screen blend mode for additive light effect
      Math.min(1, 0.5 + intensity * 0.5).toString(),
      `blur(${intensity * 2}px)`, // Slight blur for the overlay itself
      undefined,
      'keratoconus'
    );
  }

  // Vitreous Hemorrhage - Blood in the vitreous humor causing red-tinted vision
  // Individual randomized blob/splatter shapes with enhanced red coloring
  if (vitreousHemorrhage?.enabled) {
    const intensity = vitreousHemorrhage.intensity;

    // Generate floater positions (pre-computed for performance)
    // Different types: small dots, cobweb strands, dark streaks, irregular blobs
    const floaterCount = Math.max(10, Math.floor(10 + intensity * 18)); // 10-28 floaters
    const floaters: Array<{type: 'dot' | 'cobweb' | 'streak' | 'blob', x: number, y: number, size: number, opacity: number, angle?: number}> = [];

    for (let i = 0; i < floaterCount; i++) {
      const rand = (i * 0.618) % 1; // Deterministic pseudo-random
      let type: 'dot' | 'cobweb' | 'streak' | 'blob';
      let size: number;
      let opacity: number;
      let angle: number | undefined;

      if (rand < 0.25) {
        // Small dots
        type = 'dot';
        size = 1.5 + (i % 4) * 0.8;
        opacity = 0.5 + (i % 5) * 0.1;
      } else if (rand < 0.5) {
        // Cobweb strands
        type = 'cobweb';
        size = 2 + (i % 4) * 1.2;
        opacity = 0.5 + (i % 5) * 0.1;
        angle = (i * 67) % 360;
      } else if (rand < 0.75) {
        // Dark streaks
        type = 'streak';
        size = 1.5 + (i % 3) * 1.5;
        opacity = 0.5 + (i % 5) * 0.1;
        angle = (i * 89) % 360;
      } else {
        // Irregular blobs/splatters
        type = 'blob';
        size = 2.5 + (i % 5) * 1.5;
        opacity = 0.5 + (i % 5) * 0.1;
      }

      floaters.push({
        type,
        x: ((i * 31) % 90) + 5,
        y: ((i * 47) % 85) + 7,
        size,
        opacity: opacity * intensity,
        angle
      });
    }

    // Generate background gradients for floaters
    const floaterGradients = floaters.map(floater => {
      const baseColor = `rgba(180,20,20,${floater.opacity})`;
      const darkRed = `rgba(140,10,10,${floater.opacity * 0.9})`;

      switch (floater.type) {
        case 'dot':
          return `radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, transparent ${floater.size}%)`;
        case 'cobweb':
          const webAngle = floater.angle || 0;
          return `
            radial-gradient(circle at ${floater.x}% ${floater.y}%, ${baseColor} 0%, transparent ${floater.size * 0.6}%),
            linear-gradient(${webAngle}deg, ${baseColor} 0%, transparent ${floater.size * 0.4}%)
          `;
        case 'streak':
          const streakAngle = floater.angle || 0;
          return `linear-gradient(${streakAngle}deg, ${darkRed} 0%, ${baseColor} ${floater.size * 0.3}%, transparent ${floater.size}%)`;
        case 'blob':
          return `radial-gradient(ellipse ${floater.size * 1.3}% ${floater.size}% at ${floater.x}% ${floater.y}%, ${baseColor} 0%, ${darkRed} ${floater.size * 0.4}%, transparent ${floater.size}%)`;
        default:
          return '';
      }
    }).filter(g => g).join(', ');

    // Red tint overlay
    const redTint = `rgba(180,25,25,${0.18 * intensity})`;

    // Enhanced red haze effect
    const hazeGradient = `
      radial-gradient(ellipse 100% 100% at 50% 50%, rgba(160,20,20,${0.2 * intensity}) 0%, transparent 70%),
      radial-gradient(ellipse 80% 80% at 30% 40%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%),
      radial-gradient(ellipse 80% 80% at 70% 60%, rgba(160,20,20,${0.15 * intensity}) 0%, transparent 60%)
    `;

    // Bottom accumulation (blood settles at bottom)
    const bottomAccumulation = `
      linear-gradient(to bottom, transparent 75%, rgba(150,15,15,${0.3 * intensity}) 90%, rgba(130,10,10,${0.4 * intensity}) 100%)
    `;

    let vitreousBackground = `
      ${floaterGradients},
      ${hazeGradient},
      ${bottomAccumulation},
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
        opacity: Math.min(0.85, 0.55 + intensity * 0.3).toString(),
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
      overlayElement.style.opacity = Math.min(0.9, 0.6 + intensity * 0.3).toString();
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
