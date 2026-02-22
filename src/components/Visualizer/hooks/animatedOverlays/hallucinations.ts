/**
 * CBS Hallucinations overlay generator
 * Generates Charles Bonnet Syndrome visual hallucinations
 */
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  getHallucinationsStartTime
} from '../../../../utils/overlays/cbsHallucinations';

/**
 * Generate CBS Hallucinations overlay styles
 */
export function generateHallucinationsOverlay(
  intensity: number,
  now: number
): React.CSSProperties {
  // Episode system - patterns change every 8-15 seconds with smooth transitions
  const startTime = getHallucinationsStartTime();
  const { episodeSeed, episodeOpacity } = getEpisodeTiming(now, intensity, startTime);
  const episodeConfig = selectEpisodeConfig(episodeSeed, intensity);

  // Animation phases for subtle movement (slowed down)
  const animationPhase = Math.sin(now / 5000) * 0.5 + 0.5;
  const flashPhase = Math.sin(now / 2500) * 0.5 + 0.5;

  // Base opacity scales with intensity
  const baseOpacity = (0.25 + intensity * 0.35) * episodeOpacity;

  const elements: string[] = [];

  // Episode-based patterns (simple + complex hallucinations)
  const patternElements = generateEpisodePatterns(
    episodeConfig,
    intensity,
    baseOpacity,
    animationPhase,
    episodeSeed
  );
  elements.push(...patternElements);

  // Persistent photopsia flashes (always present)
  const numFlashes = Math.floor(2 + intensity * 3);
  const flashOpacityBase = (0.25 + intensity * 0.25) * flashPhase;

  for (let i = 0; i < numFlashes; i++) {
    const x = 20 + (i * 25 + now / 5000) % 60;
    const y = 20 + (i * 30) % 60;
    const size = 5 + (i % 3) * 4;
    const flashOpacity = flashOpacityBase * (0.5 + (i % 3) * 0.25);

    elements.push(`
      radial-gradient(circle ${size}px at ${x}% ${y}%,
        rgba(255,255,255,${flashOpacity}) 0%,
        rgba(255,255,220,${flashOpacity * 0.5}) 40%,
        transparent 100%
      )
    `);
  }

  // Vision loss area gradient
  elements.push(createVisionLossGradient(intensity));

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: elements.join(', '),
    mixBlendMode: 'normal' as const,
    opacity: Math.min(0.9, 0.6 + intensity * 0.3),
    pointerEvents: 'none' as const,
    zIndex: 9999
  };
}
