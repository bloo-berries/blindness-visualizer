/**
 * Visual Trails overlay generator
 * Creates a stroboscopic motion-trail effect where moving objects
 * appear to leave repeated, fading copies behind them.
 * Distinct from palinopsia: trails are more uniform, directional,
 * and resemble motion blur with discrete steps rather than lingering afterimages.
 */
import { createOverlayStyle } from './createOverlayStyle';

/**
 * Generate Visual Trails overlay styles
 */
export function generateVisualTrailsOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  const elements: string[] = [];
  const time = now / 1000;

  // Trail direction rotates slowly to simulate varying gaze direction
  const trailAngle = time * 0.3;
  const dirX = Math.cos(trailAngle);
  const dirY = Math.sin(trailAngle);

  // Number of discrete trail copies (4-10 based on intensity)
  const numCopies = Math.floor(4 + intensity * 6);

  // Spacing between copies increases with intensity
  const spacing = 2 + intensity * 4;

  // Create discrete trail copies — each is a semi-transparent duplicate
  // offset along the trail direction, fading with distance
  for (let i = 1; i <= numCopies; i++) {
    const offsetX = dirX * spacing * i;
    const offsetY = dirY * spacing * i;

    // Opacity fades exponentially with distance
    const fadeRatio = 1 - (i / (numCopies + 1));
    const trailOpacity = (0.18 * fadeRatio * fadeRatio) * intensity;

    // Each copy is a large translucent overlay shifted from center
    elements.push(`
      radial-gradient(
        ellipse 90% 90% at ${50 + offsetX}% ${50 + offsetY}%,
        rgba(180,180,180,${trailOpacity}) 0%,
        rgba(160,160,160,${trailOpacity * 0.7}) 40%,
        rgba(140,140,140,${trailOpacity * 0.3}) 70%,
        transparent 90%
      )
    `);
  }

  // Add a secondary set of trails at a slightly different angle
  // to create the "multiple exposure" feel
  const secondaryAngle = trailAngle + Math.PI * 0.3;
  const secDirX = Math.cos(secondaryAngle);
  const secDirY = Math.sin(secondaryAngle);
  const secCopies = Math.floor(2 + intensity * 3);

  for (let i = 1; i <= secCopies; i++) {
    const offsetX = secDirX * spacing * i * 0.7;
    const offsetY = secDirY * spacing * i * 0.7;
    const fadeRatio = 1 - (i / (secCopies + 1));
    const trailOpacity = (0.1 * fadeRatio * fadeRatio) * intensity;

    elements.push(`
      radial-gradient(
        ellipse 85% 85% at ${50 + offsetX}% ${50 + offsetY}%,
        rgba(200,200,210,${trailOpacity}) 0%,
        rgba(180,180,190,${trailOpacity * 0.5}) 50%,
        transparent 85%
      )
    `);
  }

  // Directional motion-blur streak along the current trail direction
  const streakAngle = (trailAngle * 180) / Math.PI;
  const streakOpacity = 0.12 * intensity;
  elements.push(`
    linear-gradient(
      ${streakAngle}deg,
      transparent 0%,
      rgba(220,220,230,${streakOpacity * 0.3}) 15%,
      rgba(200,200,210,${streakOpacity}) 35%,
      rgba(200,200,210,${streakOpacity}) 65%,
      rgba(220,220,230,${streakOpacity * 0.3}) 85%,
      transparent 100%
    )
  `);

  // Subtle pulsing stroboscopic shimmer at edges
  const shimmerPhase = (Math.sin(time * 3) * 0.5 + 0.5);
  const shimmerOpacity = 0.04 * intensity * shimmerPhase;
  elements.push(`
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      transparent 60%,
      rgba(255,255,255,${shimmerOpacity}) 80%,
      rgba(255,255,255,${shimmerOpacity * 1.5}) 90%,
      transparent 100%
    )
  `);

  return createOverlayStyle(elements.join(', '), {
    mixBlendMode: 'screen',
    opacity: Math.min(0.85, 0.4 + intensity * 0.45),
  });
}
