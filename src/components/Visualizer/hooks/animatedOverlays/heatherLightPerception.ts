/**
 * Heather Hutchison's Light Perception (LP) Vision overlay generator
 * Simulates near-total blindness with only diffuse light perception
 * Features:
 * - Near-total opacity (0.92-0.98) - milky/washed-out glow, not pure black
 * - Diffuse light blobs - extreme Gaussian blur, soft amorphous patches
 * - Brightness variation only - very low-contrast luminance
 * - Nystagmus jitter - horizontal oscillation 2-5 Hz sinusoidal shake
 * - Variability - modulate opacity/blur over time
 * - No color - stripped to near-zero saturation
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

  // Fluctuating opacity (simulating varying light perception)
  const opacityWave = Math.sin(time * 0.4) * 0.02 + 0.95; // 0.93-0.97
  const opacityWave2 = Math.sin(time * 0.28 + 1.2) * 0.015 + 0.96;

  // Diffuse light blob positions that drift very slowly
  // These represent the only "light" that can be perceived - vague, formless bright patches
  const lightBlob1X = 35 + Math.sin(time * 0.08) * 15;
  const lightBlob1Y = 30 + Math.cos(time * 0.06) * 12;
  const lightBlob2X = 65 + Math.sin(time * 0.07 + 1.5) * 12;
  const lightBlob2Y = 40 + Math.cos(time * 0.09 + 0.8) * 10;
  const lightBlob3X = 50 + Math.sin(time * 0.05 + 2.5) * 10;
  const lightBlob3Y = 60 + Math.cos(time * 0.07 + 1.8) * 8;

  // Blob intensity pulsing (very subtle - mimics ambient light variation)
  const blobPulse1 = 0.12 + Math.sin(time * 0.25) * 0.04;
  const blobPulse2 = 0.10 + Math.sin(time * 0.3 + 0.7) * 0.035;
  const blobPulse3 = 0.08 + Math.sin(time * 0.22 + 1.4) * 0.03;

  // Base opacity: near-total (0.92-0.98) - milky/washed-out, not pure black
  const baseOpacity = 0.92 + intensity * 0.05; // 0.92-0.97

  // Diffuse light blob 1 - large, extremely soft (represents a window or strong light source)
  const lightBlob1 = `
    radial-gradient(ellipse 50% 45% at ${lightBlob1X}% ${lightBlob1Y}%,
      rgba(200,195,190,${blobPulse1 * intensity}) 0%,
      rgba(180,175,170,${blobPulse1 * 0.6 * intensity}) 30%,
      rgba(150,145,140,${blobPulse1 * 0.3 * intensity}) 60%,
      transparent 100%
    )
  `;

  // Diffuse light blob 2 - medium sized
  const lightBlob2 = `
    radial-gradient(ellipse 40% 35% at ${lightBlob2X}% ${lightBlob2Y}%,
      rgba(190,185,180,${blobPulse2 * intensity}) 0%,
      rgba(170,165,160,${blobPulse2 * 0.5 * intensity}) 35%,
      rgba(140,135,130,${blobPulse2 * 0.2 * intensity}) 65%,
      transparent 100%
    )
  `;

  // Diffuse light blob 3 - smaller ambient glow
  const lightBlob3 = `
    radial-gradient(ellipse 35% 30% at ${lightBlob3X}% ${lightBlob3Y}%,
      rgba(180,175,170,${blobPulse3 * intensity}) 0%,
      rgba(160,155,150,${blobPulse3 * 0.45 * intensity}) 40%,
      transparent 100%
    )
  `;

  // Overall milky/washed-out base layer (not pure black)
  // This creates the "dim, milky glow" rather than total darkness
  const milkyBase = `
    radial-gradient(ellipse 120% 120% at 50% 50%,
      rgba(45,42,40,${baseOpacity * opacityWave}) 0%,
      rgba(40,38,36,${baseOpacity * opacityWave}) 30%,
      rgba(35,33,32,${baseOpacity * opacityWave2}) 60%,
      rgba(30,28,27,${baseOpacity * opacityWave2}) 100%
    )
  `;

  // Secondary dim layer for depth
  const dimLayer = `
    radial-gradient(ellipse 150% 130% at 50% 45%,
      rgba(50,47,45,${baseOpacity * 0.85}) 0%,
      rgba(42,40,38,${baseOpacity * 0.9}) 50%,
      rgba(35,33,32,${baseOpacity * 0.95}) 100%
    )
  `;

  const background = `
    ${lightBlob1},
    ${lightBlob2},
    ${lightBlob3},
    ${milkyBase},
    ${dimLayer}
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
