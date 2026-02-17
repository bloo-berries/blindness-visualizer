import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Christine Ha-specific conditions (Neuromyelitis Optica)
 *
 * Christine Ha describes her vision as "looking at a very foggy mirror after a hot shower"
 * with vision classified as "counting fingers" at 10-12 inches.
 *
 * Key characteristics:
 * - Heavy, uniform fog/steam overlay (not patchy)
 * - Extreme blur but shapes still vaguely visible
 * - Muted, washed-out colors
 * - Light sensitivity with glare/bloom
 * - Near-distance exception (10-12 inches slightly clearer)
 * - Never total blackness (screen blend for luminosity)
 */
export const createChristineHaOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const christineSteamyMirror = getEffect('christineSteamyMirror');
  const christineLightScatter = getEffect('christineLightScatter');
  const christineFogOverlay = getEffect('christineFogOverlay');
  const christineFluctuatingVision = getEffect('christineFluctuatingVision');
  const christineNMOComplete = getEffect('christineNMOComplete');

  // Christine Ha - Steamy Mirror (main "foggy mirror after hot shower" effect)
  if (christineSteamyMirror?.enabled) {
    const i = christineSteamyMirror.intensity;

    // Multi-layer uniform milky fog
    const steamyMirrorBackground = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(248,248,252,${i * 0.70}) 0%,
        rgba(246,246,250,${i * 0.68}) 20%,
        rgba(244,244,248,${i * 0.65}) 40%,
        rgba(242,242,246,${i * 0.62}) 60%,
        rgba(240,240,244,${i * 0.58}) 80%,
        rgba(238,238,242,${i * 0.55}) 100%
      ),
      radial-gradient(ellipse 150% 150% at 45% 55%,
        rgba(250,250,254,${i * 0.50}) 0%,
        rgba(248,248,252,${i * 0.45}) 40%,
        rgba(245,245,250,${i * 0.40}) 70%,
        transparent 100%
      ),
      radial-gradient(ellipse 180% 160% at 55% 45%,
        rgba(252,252,255,${i * 0.45}) 0%,
        rgba(250,250,254,${i * 0.40}) 35%,
        rgba(248,248,252,${i * 0.35}) 65%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineSteamyMirror',
      steamyMirrorBackground,
      'screen',
      Math.min(0.92, 0.65 + i * 0.27).toString(),
      undefined,
      undefined,
      'christineSteamyMirror'
    );

    // Near-distance exception zone (center is slightly clearer - multiply blend darkens fog)
    const exceptionZoneBackground = `
      radial-gradient(ellipse 18% 18% at 50% 50%,
        rgba(0,0,0,${i * 0.15}) 0%,
        rgba(0,0,0,${i * 0.10}) 40%,
        rgba(0,0,0,${i * 0.05}) 70%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineSteamyMirrorException',
      exceptionZoneBackground,
      'multiply',
      '1',
      undefined,
      undefined,
      'christineSteamyMirror'
    );
  }

  // Christine Ha - Light Scatter (light sensitivity with bloom)
  if (christineLightScatter?.enabled) {
    const i = christineLightScatter.intensity;

    // Multiple bloom points simulating light scatter from various sources
    const lightScatterBackground = `
      radial-gradient(circle at 25% 18%,
        rgba(255,255,252,${i * 0.55}) 0%,
        rgba(255,255,250,${i * 0.40}) 15%,
        rgba(255,255,248,${i * 0.25}) 30%,
        transparent 50%
      ),
      radial-gradient(circle at 75% 22%,
        rgba(255,255,250,${i * 0.50}) 0%,
        rgba(255,255,248,${i * 0.35}) 18%,
        rgba(255,255,245,${i * 0.20}) 35%,
        transparent 55%
      ),
      radial-gradient(circle at 50% 35%,
        rgba(255,255,252,${i * 0.45}) 0%,
        rgba(255,255,248,${i * 0.30}) 20%,
        transparent 45%
      ),
      radial-gradient(circle at 35% 55%,
        rgba(255,255,250,${i * 0.35}) 0%,
        rgba(255,255,245,${i * 0.22}) 20%,
        transparent 40%
      ),
      radial-gradient(circle at 68% 48%,
        rgba(255,255,248,${i * 0.40}) 0%,
        rgba(255,255,245,${i * 0.25}) 18%,
        transparent 42%
      ),
      radial-gradient(ellipse 100% 100% at 50% 50%,
        rgba(255,255,252,${i * 0.20}) 0%,
        rgba(255,255,250,${i * 0.15}) 40%,
        transparent 80%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineLightScatter',
      lightScatterBackground,
      'screen',
      Math.min(0.90, 0.60 + i * 0.30).toString(),
      `blur(${2 + i * 4}px)`,
      undefined,
      'christineLightScatter'
    );
  }

  // Christine Ha - Fog Overlay (additional uniform haze layer)
  if (christineFogOverlay?.enabled) {
    const i = christineFogOverlay.intensity;

    // Dense, uniform fog coverage
    const fogOverlayBackground = `
      radial-gradient(ellipse 220% 200% at 50% 50%,
        rgba(248,248,252,${i * 0.60}) 0%,
        rgba(246,246,250,${i * 0.55}) 25%,
        rgba(244,244,248,${i * 0.50}) 50%,
        rgba(242,242,246,${i * 0.45}) 75%,
        rgba(240,240,244,${i * 0.40}) 100%
      ),
      linear-gradient(180deg,
        rgba(252,252,255,${i * 0.35}) 0%,
        rgba(248,248,252,${i * 0.30}) 30%,
        rgba(246,246,250,${i * 0.28}) 60%,
        rgba(244,244,248,${i * 0.25}) 100%
      ),
      radial-gradient(ellipse 160% 140% at 30% 60%,
        rgba(250,250,254,${i * 0.30}) 0%,
        rgba(248,248,252,${i * 0.22}) 50%,
        transparent 100%
      ),
      radial-gradient(ellipse 140% 160% at 70% 40%,
        rgba(252,252,255,${i * 0.28}) 0%,
        rgba(250,250,254,${i * 0.20}) 50%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineFogOverlay',
      fogOverlayBackground,
      'screen',
      Math.min(0.88, 0.55 + i * 0.33).toString(),
      undefined,
      undefined,
      'christineFogOverlay'
    );
  }

  // Christine Ha - Fluctuating Vision (static fallback - animated version in useAnimatedOverlay)
  // This creates a base layer; the animated hook adds the fluctuation effect
  if (christineFluctuatingVision?.enabled) {
    const i = christineFluctuatingVision.intensity;

    // Base fluctuating layer (subtle fog that will be enhanced by animation)
    const fluctuatingBackground = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(248,248,252,${i * 0.45}) 0%,
        rgba(245,245,250,${i * 0.40}) 40%,
        rgba(242,242,248,${i * 0.35}) 70%,
        rgba(240,240,246,${i * 0.30}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineFluctuatingVision',
      fluctuatingBackground,
      'screen',
      Math.min(0.75, 0.45 + i * 0.30).toString(),
      undefined,
      undefined,
      'christineFluctuatingVision'
    );
  }

  // Christine Ha - Complete NMO (combines all effects for full simulation)
  if (christineNMOComplete?.enabled) {
    const i = christineNMOComplete.intensity;

    // Primary dense uniform fog layer
    const nmoCompleteFogPrimary = `
      radial-gradient(ellipse 200% 200% at 50% 50%,
        rgba(248,248,252,${i * 0.75}) 0%,
        rgba(246,246,250,${i * 0.72}) 15%,
        rgba(244,244,248,${i * 0.68}) 30%,
        rgba(242,242,246,${i * 0.64}) 45%,
        rgba(240,240,244,${i * 0.60}) 60%,
        rgba(238,238,242,${i * 0.56}) 75%,
        rgba(236,236,240,${i * 0.52}) 90%,
        rgba(234,234,238,${i * 0.48}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineNMOCompleteFog1',
      nmoCompleteFogPrimary,
      'screen',
      Math.min(0.95, 0.70 + i * 0.25).toString(),
      undefined,
      undefined,
      'christineNMOComplete'
    );

    // Secondary fog layer for additional density
    const nmoCompleteFogSecondary = `
      radial-gradient(ellipse 180% 180% at 45% 55%,
        rgba(250,250,254,${i * 0.55}) 0%,
        rgba(248,248,252,${i * 0.50}) 30%,
        rgba(246,246,250,${i * 0.45}) 60%,
        transparent 100%
      ),
      radial-gradient(ellipse 160% 170% at 55% 45%,
        rgba(252,252,255,${i * 0.50}) 0%,
        rgba(250,250,254,${i * 0.45}) 35%,
        rgba(248,248,252,${i * 0.40}) 65%,
        transparent 100%
      ),
      linear-gradient(135deg,
        rgba(250,250,254,${i * 0.35}) 0%,
        rgba(248,248,252,${i * 0.30}) 50%,
        rgba(246,246,250,${i * 0.28}) 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineNMOCompleteFog2',
      nmoCompleteFogSecondary,
      'screen',
      Math.min(0.90, 0.60 + i * 0.30).toString(),
      undefined,
      undefined,
      'christineNMOComplete'
    );

    // Light scatter bloom layer
    const nmoCompleteLightBloom = `
      radial-gradient(circle at 30% 20%,
        rgba(255,255,252,${i * 0.50}) 0%,
        rgba(255,255,248,${i * 0.35}) 15%,
        transparent 40%
      ),
      radial-gradient(circle at 70% 25%,
        rgba(255,255,250,${i * 0.45}) 0%,
        rgba(255,255,245,${i * 0.30}) 18%,
        transparent 45%
      ),
      radial-gradient(circle at 50% 40%,
        rgba(255,255,252,${i * 0.40}) 0%,
        rgba(255,255,248,${i * 0.28}) 20%,
        transparent 50%
      ),
      radial-gradient(circle at 25% 60%,
        rgba(255,255,248,${i * 0.35}) 0%,
        rgba(255,255,245,${i * 0.22}) 15%,
        transparent 38%
      ),
      radial-gradient(circle at 75% 55%,
        rgba(255,255,250,${i * 0.38}) 0%,
        rgba(255,255,245,${i * 0.25}) 18%,
        transparent 42%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineNMOCompleteLightBloom',
      nmoCompleteLightBloom,
      'screen',
      Math.min(0.85, 0.55 + i * 0.30).toString(),
      `blur(${3 + i * 5}px)`,
      undefined,
      'christineNMOComplete'
    );

    // Near-distance exception zone (center ~15% radius is slightly clearer)
    const nmoCompleteExceptionZone = `
      radial-gradient(ellipse 20% 20% at 50% 50%,
        rgba(0,0,0,${i * 0.18}) 0%,
        rgba(0,0,0,${i * 0.12}) 35%,
        rgba(0,0,0,${i * 0.06}) 65%,
        transparent 100%
      )
    `;

    createOverlay(
      'visual-field-overlay-christineNMOCompleteException',
      nmoCompleteExceptionZone,
      'multiply',
      '1',
      undefined,
      undefined,
      'christineNMOComplete'
    );
  }
};
