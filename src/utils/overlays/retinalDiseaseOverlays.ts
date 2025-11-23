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

  // Glaucoma
  if (glaucoma?.enabled) {
    const intensity = glaucoma.intensity;
    let glaucomaBackground = '';
    
    // Early stage: Small paracentral scotomas
    if (intensity > 0.1) {
      glaucomaBackground += `
        radial-gradient(circle at 65% 40%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(3, 8 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(8, 15 - intensity * 7)}%,
          rgba(0,0,0,0) ${Math.max(15, 25 - intensity * 10)}%
        ),
        radial-gradient(circle at 35% 60%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(2, 6 - intensity * 4)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(6, 12 - intensity * 6)}%,
          rgba(0,0,0,0) ${Math.max(12, 20 - intensity * 8)}%
        ),
      `;
    }
    
    // Moderate stage: Arc-shaped defects
    if (intensity > 0.3) {
      glaucomaBackground += `
        conic-gradient(from 0deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 120deg, 
          rgba(0,0,0,0) 120deg, 
          rgba(0,0,0,0) 360deg
        ),
        conic-gradient(from 180deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 60deg, 
          rgba(0,0,0,${0.85 * intensity}) 60deg, 
          rgba(0,0,0,${0.85 * intensity}) 120deg, 
          rgba(0,0,0,0) 120deg, 
          rgba(0,0,0,0) 360deg
        ),
      `;
    }
    
    // Advanced stage: Peripheral constriction
    if (intensity > 0.5) {
      const tunnelRadius = Math.max(20, 60 - intensity * 50);
      glaucomaBackground += `
        radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${tunnelRadius - 10}%,
          rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius}%,
          rgba(0,0,0,${0.95 * intensity}) 100%
        ),
      `;
    }
    
    // End stage: Severe constriction
    if (intensity > 0.8) {
      const severeRadius = Math.max(5, 20 - (intensity - 0.8) * 15);
      glaucomaBackground += `
        radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${severeRadius - 3}%,
          rgba(0,0,0,${0.98 * intensity}) ${severeRadius}%,
          rgba(0,0,0,${0.98 * intensity}) 100%
        ),
      `;
    }
    
    if (glaucomaBackground.trim().length > 0) {
      glaucomaBackground = glaucomaBackground.trim().replace(/,\s*$/, '');
      
      if (container) {
        createOverlayWithContainer(
          'visual-field-overlay-glaucoma',
          glaucomaBackground,
          'multiply',
          Math.min(0.95, intensity).toString(),
          undefined,
          undefined,
          'glaucoma',
          container
        );
      } else {
        createOverlay(
          'visual-field-overlay-glaucoma',
          glaucomaBackground,
          'multiply',
          Math.min(0.95, intensity).toString(),
          undefined,
          undefined,
          'glaucoma'
        );
      }
    } else {
      const subtleBackground = `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,${0.1 * intensity}) 80%,
        rgba(0,0,0,${0.2 * intensity}) 100%
      )`;
      
      if (container) {
        createOverlayWithContainer(
          'visual-field-overlay-glaucoma',
          subtleBackground,
          'multiply',
          Math.min(0.3, intensity).toString(),
          undefined,
          undefined,
          'glaucoma',
          container
        );
      } else {
        createOverlay(
          'visual-field-overlay-glaucoma',
          subtleBackground,
          'multiply',
          Math.min(0.3, intensity).toString(),
          undefined,
          undefined,
          'glaucoma'
        );
      }
    }
  }

  // Stargardt Disease
  if (stargardt?.enabled) {
    const intensity = stargardt.intensity;
    const scotomaRadius = 17 + intensity * 53;
    
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

  // Age-Related Macular Degeneration (AMD)
  if (amd?.enabled) {
    const intensity = amd.intensity;
    const amdRadius = Math.max(15, 52 - intensity * 37);
    
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

  // Retinal Detachment
  if (retinalDetachment?.enabled) {
    const intensity = retinalDetachment.intensity;
    
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

  // Retinitis Pigmentosa
  if (retinitisPigmentosa?.enabled) {
    const intensity = retinitisPigmentosa.intensity;
    const tunnelRadius = Math.max(3, 30 - intensity * 27);
    
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
};
