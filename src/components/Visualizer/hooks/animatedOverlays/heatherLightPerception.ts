/**
 * Heather Hutchison's Light Perception (LP) Vision overlay generator
 *
 * Technical Parameters for LP Vision Simulation:
 * 1. Extreme Gaussian blur (80-120px) - handled by CSS filters
 * 2. Near-total desaturation (0-5%) - handled by CSS filters
 * 3. Severe contrast reduction (10-20%) - handled by CSS filters
 * 4. High brightness ("washed-out white") - handled by CSS filters
 * 5. White fog/opacity layer (rgba(255,255,255,0.70-0.85)) - this overlay
 * 6. Variability - slow oscillation of blur/brightness (3-5s period, ±10%)
 * 7. Nystagmus jitter - horizontal oscillation 2-5 Hz
 *
 * LP vision is often described as seeing "various shades of white"
 * The perception skews heavily toward white/light gray
 */

/**
 * Generate Heather Hutchison's Light Perception overlay
 */
export function generateHeatherLightPerceptionOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const time = now / 1000;

  // Nystagmus: horizontal oscillation at 2-5 Hz (using ~3 Hz as midpoint)
  // Small amplitude (2-5 pixels) sinusoidal shake
  const nystagmusFreq = 3; // Hz
  const nystagmusAmplitude = 3 + intensity * 2; // 3-5 pixels
  const nystagmusOffset = Math.sin(time * nystagmusFreq * 2 * Math.PI) * nystagmusAmplitude;

  // Fluctuating perception - slow oscillation (3-5 second period, ±10% variation)
  // This represents the instability Heather describes in her perception
  const fluctuationPeriod1 = 4; // ~4 second cycle
  const fluctuationPeriod2 = 3.3; // slightly different for organic feel
  const fluctuation1 = Math.sin(time * (2 * Math.PI / fluctuationPeriod1)) * 0.05; // ±5%
  const fluctuation2 = Math.sin(time * (2 * Math.PI / fluctuationPeriod2) + 1.2) * 0.05; // ±5%

  // Base fog opacity: 0.70-0.85 as specified
  // This creates the diffuse, fog-like quality that washes out detail
  const baseFogOpacity = 0.75 + intensity * 0.08; // 0.75-0.83
  const fogOpacity = baseFogOpacity + fluctuation1;

  // Secondary fog layer with slight variation
  const secondaryFogOpacity = 0.70 + intensity * 0.10 + fluctuation2; // 0.70-0.80

  // Vague light blob positions - these drift slowly
  // Represent the only distinguishable "light vs dark" areas
  const lightBlob1X = 40 + Math.sin(time * 0.06) * 12;
  const lightBlob1Y = 35 + Math.cos(time * 0.05) * 10;
  const lightBlob2X = 60 + Math.sin(time * 0.07 + 1.8) * 10;
  const lightBlob2Y = 55 + Math.cos(time * 0.08 + 0.9) * 8;

  // Blob brightness pulsing (subtle - mimics strongest light-vs-dark transitions)
  const blobPulse1 = 0.92 + Math.sin(time * 0.2) * 0.04 + fluctuation1;
  const blobPulse2 = 0.90 + Math.sin(time * 0.25 + 0.8) * 0.03 + fluctuation2;

  // Primary white fog layer - creates the "washed-out white" effect
  // This is the core of LP vision: everything skews toward white/light gray
  const whiteFogPrimary = `
    linear-gradient(
      rgba(255,255,255,${fogOpacity * intensity}) 0%,
      rgba(250,250,250,${fogOpacity * intensity}) 100%
    )
  `;

  // Secondary fog layer for depth/variation
  const whiteFogSecondary = `
    radial-gradient(ellipse 140% 120% at 50% 50%,
      rgba(255,255,255,${secondaryFogOpacity * intensity * 0.9}) 0%,
      rgba(248,248,248,${secondaryFogOpacity * intensity * 0.85}) 40%,
      rgba(245,245,245,${secondaryFogOpacity * intensity * 0.8}) 70%,
      rgba(240,240,240,${secondaryFogOpacity * intensity * 0.75}) 100%
    )
  `;

  // Vague brighter regions - these are the only "distinguishable" areas
  // Represent strongest light sources (window, bright lamp) as slightly brighter patches
  const lightPatch1 = `
    radial-gradient(ellipse 45% 40% at ${lightBlob1X}% ${lightBlob1Y}%,
      rgba(255,255,255,${blobPulse1 * intensity * 0.15}) 0%,
      rgba(255,255,255,${blobPulse1 * intensity * 0.08}) 50%,
      transparent 100%
    )
  `;

  const lightPatch2 = `
    radial-gradient(ellipse 35% 30% at ${lightBlob2X}% ${lightBlob2Y}%,
      rgba(255,255,255,${blobPulse2 * intensity * 0.12}) 0%,
      rgba(255,255,255,${blobPulse2 * intensity * 0.06}) 50%,
      transparent 100%
    )
  `;

  // Subtle darker region to represent shadows (barely perceptible)
  // Only the strongest light-vs-dark transitions register as vague gradients
  const shadowHint = `
    radial-gradient(ellipse 60% 50% at 20% 70%,
      rgba(220,220,220,${0.08 * intensity}) 0%,
      transparent 100%
    )
  `;

  const background = `
    ${lightPatch1},
    ${lightPatch2},
    ${shadowHint},
    ${whiteFogPrimary},
    ${whiteFogSecondary}
  `;

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background,
    mixBlendMode: 'normal' as const,
    opacity: 1,
    pointerEvents: 'none' as const,
    zIndex: 9999,
    // Apply nystagmus jitter via transform
    transform: `translateX(${nystagmusOffset}px)`,
    // Smooth out the jitter slightly for more natural movement
    transition: 'transform 0.016s linear'
  };
}
