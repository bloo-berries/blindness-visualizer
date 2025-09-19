import { VisualEffect } from '../types/visualEffects';

/**
 * Creates a visual field overlay element with specified styles
 */
const createOverlay = (
  id: string, 
  backgroundStyle: string, 
  blendMode: string, 
  opacity: string,
  filter?: string,
  clipPath?: string
): void => {
  let overlayElement = document.getElementById(id);
  
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = id;
    overlayElement.style.position = 'absolute';
    overlayElement.style.top = '0';
    overlayElement.style.left = '0';
    overlayElement.style.right = '0';
    overlayElement.style.bottom = '0';
            overlayElement.style.width = '100%';
            overlayElement.style.height = '100%';
            overlayElement.style.pointerEvents = 'none';
            overlayElement.style.zIndex = '1000';
    
    // Try multiple selectors to find the container
    let container: Element | null = document.querySelector('.visualizer-container');
    if (!container) {
      container = document.querySelector('[class*="visualizer"]');
    }
    if (!container) {
      // Look for the iframe's parent container
      const iframe = document.querySelector('iframe[src*="youtube"]');
      if (iframe) {
        container = iframe.parentElement;
        console.log('Found iframe parent container:', container);
      }
    }
    if (!container) {
      // Last resort: look for any container with relative positioning
      container = document.querySelector('[style*="position: relative"]');
    }
    
    if (container) {
      container.appendChild(overlayElement);
      console.log(`Successfully created overlay ${id} in container:`, container);
    } else {
      console.warn(`Could not find container for overlay ${id}`);
      // Try to append to body as fallback
      document.body.appendChild(overlayElement);
      console.log(`Fallback: Created overlay ${id} in body`);
    }
    
    // Force the container to have relative positioning if it doesn't
    if (container && container instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
        console.log('Set container position to relative');
      }
    }
  }
  
    overlayElement.style.background = backgroundStyle;
    overlayElement.style.mixBlendMode = blendMode;
    overlayElement.style.opacity = opacity;
    if (filter) {
      overlayElement.style.filter = filter;
    }
    if (clipPath) {
      overlayElement.style.clipPath = clipPath;
    }
};

/**
 * Creates visual field overlays for all enabled effects
 */
export const createVisualFieldOverlays = (effects: VisualEffect[]): void => {
  // Remove existing overlays first
  const existingOverlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
  existingOverlays.forEach(overlay => overlay.remove());
  
  console.log('Creating visual field overlays for effects:', effects);

  // Find all visual field effects
  const tunnelVision = effects.find(e => e.id === 'tunnelVision');
  const quadrantanopiaLeft = effects.find(e => e.id === 'quadrantanopiaLeft');
  const quadrantanopiaRight = effects.find(e => e.id === 'quadrantanopiaRight');
  const quadrantanopiaInferior = effects.find(e => e.id === 'quadrantanopiaInferior');
  const quadrantanopiaSuperior = effects.find(e => e.id === 'quadrantanopiaSuperior');
  const hemianopiaLeft = effects.find(e => e.id === 'hemianopiaLeft');
  const hemianopiaRight = effects.find(e => e.id === 'hemianopiaRight');
  const scotoma = effects.find(e => e.id === 'scotoma');
  const visualFloaters = effects.find(e => e.id === 'visualFloaters');
  const visualSnow = effects.find(e => e.id === 'visualSnow');
  const aura = effects.find(e => e.id === 'aura');
  const glaucoma = effects.find(e => e.id === 'glaucoma');
  const hyperopia = effects.find(e => e.id === 'farSighted');
  // Note: retinitisPigmentosa is handled by shader effects, not overlays

  // Create overlays for each enabled effect
  if (tunnelVision?.enabled) {
    createOverlay(
      'visual-field-overlay-tunnelVision',
      `radial-gradient(circle at 50% 50%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(20, 35 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) ${Math.max(40, 55 - tunnelVision.intensity * 20)}%,
        rgba(0,0,0,${0.95 * tunnelVision.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, tunnelVision.intensity).toString()
    );
  }

  if (quadrantanopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaLeft',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaLeft.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaLeft.intensity).toString()
    );
  }

  if (quadrantanopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaRight',
      `radial-gradient(circle at 0% 100%, 
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${Math.max(25, 40 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,${0.95 * quadrantanopiaRight.intensity}) ${Math.max(45, 60 - quadrantanopiaRight.intensity * 20)}%,
        rgba(0,0,0,${0.95 * quadrantanopiaRight.intensity}) 100%
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaRight.intensity).toString()
    );
  }

  if (quadrantanopiaInferior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaInferior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,${0.95 * quadrantanopiaInferior.intensity}) 0deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaInferior.intensity}) 90deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaInferior.intensity).toString()
    );
  }

  if (quadrantanopiaSuperior?.enabled) {
    createOverlay(
      'visual-field-overlay-quadrantanopiaSuperior',
      `conic-gradient(from 0deg at 50% 50%, 
        rgba(0,0,0,0) 0deg, 
        rgba(0,0,0,0) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaSuperior.intensity}) 90deg, 
        rgba(0,0,0,${0.95 * quadrantanopiaSuperior.intensity}) 180deg, 
        rgba(0,0,0,0) 180deg, 
        rgba(0,0,0,0) 360deg
      )`,
      'multiply',
      Math.min(0.95, quadrantanopiaSuperior.intensity).toString()
    );
  }

  if (hemianopiaLeft?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaLeft',
      `linear-gradient(to right, 
        rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 0%, 
        rgba(0,0,0,${0.95 * hemianopiaLeft.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, hemianopiaLeft.intensity).toString()
    );
  }

  if (hemianopiaRight?.enabled) {
    createOverlay(
      'visual-field-overlay-hemianopiaRight',
      `linear-gradient(to left, 
        rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 0%, 
        rgba(0,0,0,${0.95 * hemianopiaRight.intensity}) 45%, 
        rgba(0,0,0,0) 50%
      )`,
      'multiply',
      Math.min(0.95, hemianopiaRight.intensity).toString()
    );
  }

  if (scotoma?.enabled) {
    const now = Date.now();
    createOverlay(
      'visual-field-overlay-scotoma',
      `radial-gradient(circle at ${50 + Math.sin(now/2000) * 10}% ${50 + Math.cos(now/2000) * 10}%, 
        rgba(0,0,0,${0.95 * scotoma.intensity}) 0%, 
        rgba(0,0,0,${0.85 * scotoma.intensity}) ${Math.max(5, 10 - scotoma.intensity * 5)}%,
        rgba(0,0,0,${0.5 * scotoma.intensity}) ${Math.max(10, 20 - scotoma.intensity * 10)}%,
        rgba(0,0,0,0) ${Math.max(20, 35 - scotoma.intensity * 15)}%
      )`,
      'multiply',
      Math.min(0.95, scotoma.intensity).toString()
    );
  }

  if (visualFloaters?.enabled) {
    const now = Date.now();
    // Floater 1 - larger, stringy floater
    const floaterX1 = 30 + Math.sin(now/2000 * 0.3) * 25 + Math.sin(now/2000 * 0.2) * 10;
    const floaterY1 = 40 + Math.cos(now/2000 * 0.25) * 20;
    // Floater 2 - medium, circular floater
    const floaterX2 = 65 + Math.sin(now/2000 * 0.2 + 1) * 20;
    const floaterY2 = 50 + Math.cos(now/2000 * 0.3 + 2) * 25;
    // Floater 3 - small, quick-moving floater
    const floaterX3 = 50 + Math.sin(now/2000 * 0.4 + 3) * 30;
    const floaterY3 = 25 + Math.cos(now/2000 * 0.35 + 1) * 15;
    // Floater 4 - thin, string-like floater
    const floaterX4 = 45 + Math.sin(now/2000 * 0.15 + 2) * 15;
    const floaterY4 = 70 + Math.cos(now/2000 * 0.2 + 3) * 10;

    createOverlay(
      'visual-field-overlay-visualFloaters',
      `
        /* String-like floater */
        radial-gradient(ellipse 25% 8% at ${floaterX1}% ${floaterY1}%, 
          rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.85 * visualFloaters.intensity}) 15%,
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 40%,
          rgba(0,0,0,0) 80%
        ),
        /* Round floater */
        radial-gradient(circle 8% at ${floaterX2}% ${floaterY2}%, 
          rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.85 * visualFloaters.intensity}) 40%,
          rgba(0,0,0,${0.6 * visualFloaters.intensity}) 70%,
          rgba(0,0,0,0) 100%
        ),
        /* Small dot floater */
        radial-gradient(circle 4% at ${floaterX3}% ${floaterY3}%, 
          rgba(0,0,0,${0.95 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.9 * visualFloaters.intensity}) 40%,
          rgba(0,0,0,${0.7 * visualFloaters.intensity}) 70%,
          rgba(0,0,0,0) 100%
        ),
        /* Thin stringy floater */
        radial-gradient(ellipse 20% 3% at ${floaterX4}% ${floaterY4}%, 
          rgba(0,0,0,${0.9 * visualFloaters.intensity}) 0%, 
          rgba(0,0,0,${0.8 * visualFloaters.intensity}) 40%,
          rgba(0,0,0,${0.6 * visualFloaters.intensity}) 70%,
          rgba(0,0,0,0) 100%
        )
      `,
      'multiply',
      Math.min(0.98, visualFloaters.intensity).toString()
    );
  }

  if (visualSnow?.enabled) {
    const now = Date.now();
    const snowDensity = Math.floor(visualSnow.intensity * 200);
    let snowBackground = '';
    
    for (let i = 0; i < snowDensity; i++) {
      const x = (i * 137.5) % 100;
      const y = (i * 73.3 + now/50) % 100;
      const size = (i % 3 + 1) * 0.5;
      const opacity = (0.3 + (i % 4) * 0.2) * visualSnow.intensity;
      
      snowBackground += `
        radial-gradient(circle ${size}px at ${x}% ${y}%, 
          rgba(255,255,255,${opacity}) 0%, 
          rgba(255,255,255,0) 100%
        ),
      `;
    }
    
    // Remove trailing comma
    snowBackground = snowBackground.slice(0, -1);
    
    createOverlay(
      'visual-field-overlay-visualSnow',
      snowBackground,
      'screen',
      '1'
    );
  }

  if (aura?.enabled) {
    const now = Date.now();
    const auraPhase = (now / 3000) % (2 * Math.PI);
    const auraRadius = 30 + Math.sin(auraPhase) * 10;
    
    createOverlay(
      'visual-field-overlay-aura',
      `radial-gradient(circle at 50% 50%, 
        rgba(255,255,255,${0.3 * aura.intensity}) 0%, 
        rgba(255,255,255,${0.2 * aura.intensity}) ${auraRadius - 10}%, 
        rgba(255,255,255,${0.1 * aura.intensity}) ${auraRadius}%, 
        rgba(255,255,255,0) ${auraRadius + 20}%
      )`,
      'screen',
      Math.min(0.8, aura.intensity).toString()
    );
  }

  if (glaucoma?.enabled) {
    const intensity = glaucoma.intensity;
    
    // Create complex glaucoma overlay with multiple scotomas and peripheral loss
    let glaucomaBackground = '';
    
    // Early stage: Small paracentral scotomas (10-20 degrees from center)
    if (intensity > 0.1) {
      // Superior paracentral scotoma
      glaucomaBackground += `
        radial-gradient(circle at 65% 40%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(3, 8 - intensity * 5)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(8, 15 - intensity * 7)}%,
          rgba(0,0,0,0) ${Math.max(15, 25 - intensity * 10)}%
        ),
      `;
      
      // Inferior paracentral scotoma
      glaucomaBackground += `
        radial-gradient(circle at 35% 60%, 
          rgba(0,0,0,${0.95 * intensity}) 0%, 
          rgba(0,0,0,${0.85 * intensity}) ${Math.max(2, 6 - intensity * 4)}%,
          rgba(0,0,0,${0.5 * intensity}) ${Math.max(6, 12 - intensity * 6)}%,
          rgba(0,0,0,0) ${Math.max(12, 20 - intensity * 8)}%
        ),
      `;
    }
    
    // Moderate stage: Arc-shaped defects (arcuate scotomas)
    if (intensity > 0.3) {
      // Superior arcuate scotoma
      glaucomaBackground += `
        conic-gradient(from 0deg at 50% 50%, 
          rgba(0,0,0,0) 0deg, 
          rgba(0,0,0,0) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 60deg, 
          rgba(0,0,0,${0.9 * intensity}) 120deg, 
          rgba(0,0,0,0) 120deg, 
          rgba(0,0,0,0) 360deg
        ),
      `;
      
      // Inferior arcuate scotoma
      glaucomaBackground += `
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
    
    // Advanced stage: Peripheral constriction (tunnel vision)
    if (intensity > 0.5) {
      const tunnelRadius = Math.max(20, 60 - intensity * 50); // From 60% to 20% of screen
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
      const severeRadius = Math.max(5, 20 - (intensity - 0.8) * 15); // Down to 5% of screen
      glaucomaBackground += `
        radial-gradient(circle at 50% 50%, 
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${severeRadius - 3}%,
          rgba(0,0,0,${0.98 * intensity}) ${severeRadius}%,
          rgba(0,0,0,${0.98 * intensity}) 100%
        ),
      `;
    }
    
    // Remove trailing comma
    glaucomaBackground = glaucomaBackground.slice(0, -1);
    
    createOverlay(
      'visual-field-overlay-glaucoma',
      glaucomaBackground,
      'multiply',
      Math.min(0.95, intensity).toString()
    );
  }

  if (hyperopia?.enabled) {
    const intensity = hyperopia.intensity;
    
    // Hyperopia: transparent blur on edges, clear center
    const hyperopiaBlur = intensity * 6;
    const clearRadius = 40 - intensity * 10; // Clear area size decreases with intensity
    
    // Use transparent background with blur filter and clip-path to mask center
    createOverlay(
      'visual-field-overlay-hyperopia',
      'transparent',
      'normal',
      '1.0',
      `blur(${hyperopiaBlur}px)`,
      `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${clearRadius}% ${clearRadius}%, ${100-clearRadius}% ${clearRadius}%, ${100-clearRadius}% ${100-clearRadius}%, ${clearRadius}% ${100-clearRadius}%, ${clearRadius}% ${clearRadius}%)`
    );
  }

  // Retinitis Pigmentosa is handled by shader effects, not overlays
};

/**
 * Removes all visual field overlays
 */
export const removeVisualFieldOverlays = (): void => {
  const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
  overlays.forEach(overlay => overlay.remove());
};
