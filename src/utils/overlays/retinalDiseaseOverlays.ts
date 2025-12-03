import { VisualEffect } from '../../types/visualEffects';
import { createOverlay, createOverlayWithContainer } from './overlayHelpers';

/**
 * Creates overlays for retinal disease conditions
 * Includes: glaucoma, AMD, diabetic retinopathy, stargardt, retinitis pigmentosa, retinal detachment
 */
export const createRetinalDiseaseOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  const glaucoma = getEffect('glaucoma');
  const amd = getEffect('amd');
  const diabeticRetinopathy = getEffect('diabeticRetinopathy');
  const stargardt = getEffect('stargardt');
  const retinitisPigmentosa = getEffect('retinitisPigmentosa');
  const retinalDetachment = getEffect('retinalDetachment');

  // Glaucoma - Based on NIH research: fading periphery (not black), contrast loss, blur
  if (glaucoma?.enabled) {
    const intensity = glaucoma.intensity;
    
    // Calculate field radius (shrinks with severity)
    // Early: 90-95%, Moderate: 75-85%, Advanced: 50-70%, Severe: 30-50%, End-stage: 15-30%
    const fieldRadius = Math.max(15, 90 - intensity * 75); // 90% to 15%
    const fadeWidth = fieldRadius * 0.2; // 20% fade zone
    const fadeStart = fieldRadius - fadeWidth;
    
    // Use darker gray values that get progressively darker towards edges
    // This represents "fading to nothingness" but with more opacity at edges
    const grayValueCenter = 80; // Lighter gray in fade zone
    const grayValueEdge = 40; // Darker gray at edges
    const grayAlphaStart = intensity * 0.5; // Starting opacity in fade zone
    const grayAlphaEdge = intensity * 0.9; // Higher opacity at edges
    
    // Create smooth peripheral fade - darker and more opaque at edges
    const glaucomaBackground = `radial-gradient(circle at 50% 50%, 
      rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},0) 0%,
      rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},0) ${fadeStart}%,
      rgba(${grayValueCenter},${grayValueCenter},${grayValueCenter},${grayAlphaStart * 0.4}) ${fadeStart + fadeWidth * 0.3}%,
      rgba(${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${(grayValueCenter + grayValueEdge) / 2},${grayAlphaStart * 0.7}) ${fadeStart + fadeWidth * 0.6}%,
      rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${grayAlphaEdge}) ${fieldRadius}%,
      rgba(${grayValueEdge},${grayValueEdge},${grayValueEdge},${grayAlphaEdge}) 100%
    )`;
    
    // Use 'normal' blend mode for gray overlay instead of 'multiply' for black
    // This creates a more realistic "fading" effect
    const blendMode = intensity > 0.5 ? 'normal' : 'normal';
    const opacity = Math.min(0.85, intensity * 0.95); // Higher opacity overall
    
    // Add CSS filters for blur and contrast reduction to complement shader
    const filters = `blur(${intensity * 2}px) contrast(${100 - intensity * 50}%) brightness(${100 - intensity * 10}%)`;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-glaucoma',
        glaucomaBackground,
        blendMode,
        opacity.toString(),
        filters,
        undefined,
        'glaucoma',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-glaucoma',
        glaucomaBackground,
        blendMode,
        opacity.toString(),
        filters,
        undefined,
        'glaucoma'
      );
    }
  }

  // Stargardt Disease
  if (stargardt?.enabled) {
    const intensity = stargardt.intensity;
    const scotomaRadius = 17 + intensity * 53;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-stargardt',
        `radial-gradient(circle at 50% 50%, 
          rgba(10,10,10,${0.99 * intensity}) 0%, 
          rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
          rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
          rgba(0,0,0,0) ${scotomaRadius + 5}%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        `saturate(${1 - intensity * 0.4})`,
        undefined,
        'stargardt',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-stargardt',
        `radial-gradient(circle at 50% 50%, 
          rgba(10,10,10,${0.99 * intensity}) 0%, 
          rgba(15,15,15,${0.98 * intensity}) ${scotomaRadius - 5}%,
          rgba(20,20,20,${0.95 * intensity}) ${scotomaRadius}%,
          rgba(0,0,0,0) ${scotomaRadius + 5}%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        `saturate(${1 - intensity * 0.4})`,
        undefined,
        'stargardt'
      );
    }
  }

  // Age-Related Macular Degeneration (AMD)
  if (amd?.enabled) {
    const intensity = amd.intensity;
    const amdRadius = Math.max(15, 52 - intensity * 37);
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-amd',
        `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
          rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
          rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
          rgba(0,0,0,0) ${amdRadius + 10}%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        undefined,
        undefined,
        'amd',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-amd',
        `radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
          rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
          rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
          rgba(0,0,0,0) ${amdRadius + 10}%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        undefined,
        undefined,
        'amd'
      );
    }
  }

  // Diabetic Retinopathy
  if (diabeticRetinopathy?.enabled) {
    const intensity = diabeticRetinopathy.intensity;
    
    const microaneurysms = `
      radial-gradient(circle 3px at 25% 35%, 
        rgba(0,0,0,${0.9 * intensity}) 0%, 
        rgba(0,0,0,${0.6 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 65% 55%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 4px at 45% 75%, 
        rgba(0,0,0,${0.7 * intensity}) 0%, 
        rgba(0,0,0,${0.4 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2.5px at 80% 25%, 
        rgba(0,0,0,${0.85 * intensity}) 0%, 
        rgba(0,0,0,${0.55 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 3px at 30% 60%, 
        rgba(0,0,0,${0.75 * intensity}) 0%, 
        rgba(0,0,0,${0.45 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      ),
      radial-gradient(circle 2px at 70% 40%, 
        rgba(0,0,0,${0.8 * intensity}) 0%, 
        rgba(0,0,0,${0.5 * intensity}) 50%,
        rgba(0,0,0,0) 100%
      )
    `;
    
    const cottonWoolSpots = `
      radial-gradient(ellipse 15px 10px at 60% 40%, 
        rgba(255,255,255,${0.6 * intensity}) 0%, 
        rgba(255,255,255,${0.3 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 12px 8px at 30% 70%, 
        rgba(255,255,255,${0.5 * intensity}) 0%, 
        rgba(255,255,255,${0.25 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      ),
      radial-gradient(ellipse 10px 7px at 55% 20%, 
        rgba(255,255,255,${0.4 * intensity}) 0%, 
        rgba(255,255,255,${0.2 * intensity}) 50%,
        rgba(255,255,255,0) 100%
      )
    `;
    
    const vitreousHemorrhage = `
      radial-gradient(circle at 50% 50%, 
        rgba(139,0,0,${0.3 * intensity}) 0%, 
        rgba(139,0,0,${0.2 * intensity}) 30%,
        rgba(139,0,0,${0.1 * intensity}) 60%,
        rgba(139,0,0,0) 100%
      )
    `;
    
    const diabeticRetinopathyBackground = `${microaneurysms}, ${cottonWoolSpots}, ${vitreousHemorrhage}`;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-diabeticRetinopathy',
        diabeticRetinopathyBackground,
        'normal',
        Math.min(0.9, intensity).toString(),
        `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`,
        undefined,
        'diabeticRetinopathy',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-diabeticRetinopathy',
        diabeticRetinopathyBackground,
        'normal',
        Math.min(0.9, intensity).toString(),
        `blur(${intensity * 1.5}px) brightness(${100 - intensity * 8}%) contrast(${100 + intensity * 12}%) saturate(${100 - intensity * 15}%) sepia(${intensity * 20}%)`,
        undefined,
        'diabeticRetinopathy'
      );
    }
  }

  // Retinal Detachment
  if (retinalDetachment?.enabled) {
    const intensity = retinalDetachment.intensity;
    
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-retinalDetachment',
        `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`,
        'multiply',
        Math.min(0.8, intensity).toString(),
        `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`,
        undefined,
        'retinalDetachment',
        container
      );
    } else {
      createOverlay(
        'visual-field-overlay-retinalDetachment',
        `linear-gradient(to bottom, 
          rgba(0,0,0,${0.9 * intensity}) 0%,
          rgba(0,0,0,${0.8 * intensity}) 15%,
          rgba(0,0,0,${0.6 * intensity}) 30%,
          rgba(0,0,0,${0.4 * intensity}) 45%,
          rgba(0,0,0,${0.2 * intensity}) 60%,
          rgba(0,0,0,0) 75%
        )`,
        'multiply',
        Math.min(0.8, intensity).toString(),
        `blur(${intensity * 3}px) hue-rotate(${intensity * 2}deg)`,
        undefined,
        'retinalDetachment'
      );
    }
  }

  // Retinitis Pigmentosa
  if (retinitisPigmentosa?.enabled) {
    const intensity = retinitisPigmentosa.intensity;
    const tunnelRadius = Math.max(3, 30 - intensity * 27);
    
    // Always use createOverlayWithContainer when container is provided (for comparison mode)
    // This ensures the overlay is placed in the correct container
    if (container) {
      createOverlayWithContainer(
        'visual-field-overlay-retinitisPigmentosa',
        `radial-gradient(ellipse 100% 130% at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${tunnelRadius - 2}%,
          rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius}%,
          rgba(0,0,0,${0.7 * intensity}) ${tunnelRadius + 3}%,
          rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 8}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        undefined,
        undefined,
        'retinitisPigmentosa',
        container
      );
    } else {
      // Fallback to createOverlay if no container provided (shouldn't happen in comparison mode)
      createOverlay(
        'visual-field-overlay-retinitisPigmentosa',
        `radial-gradient(ellipse 100% 130% at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${tunnelRadius - 2}%,
          rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius}%,
          rgba(0,0,0,${0.7 * intensity}) ${tunnelRadius + 3}%,
          rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 8}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        )`,
        'multiply',
        Math.min(0.95, intensity).toString(),
        undefined,
        undefined,
        'retinitisPigmentosa'
      );
    }
  }
};
