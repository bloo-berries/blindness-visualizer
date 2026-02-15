import { VisualEffect } from '../../../types/visualEffects';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../../overlayConstants';
import { ensureRelativePositioning } from '../sharedOverlayUtils';
import {
  getEpisodeTiming,
  selectEpisodeConfig,
  generateEpisodePatterns,
  createVisionLossGradient,
  CBS_KEYFRAME_ANIMATIONS,
  getHallucinationsStartTime,
  resetHallucinationsStartTime
} from '../cbsHallucinations';
import { ContainerFinder } from './types';

/**
 * Creates the visual hallucinations overlay
 * Charles Bonnet Syndrome / Release Hallucinations
 * Episodic variation: different hallucinations appear/disappear every 8-15 seconds
 */
export function createHallucinationsOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) {
    // Reset start time when hallucinations are disabled
    resetHallucinationsStartTime();
    return;
  }

  const intensity = effect.intensity;
  const now = Date.now();
  const startTime = getHallucinationsStartTime();

  // Create or get the main container overlay
  let overlayElement = document.getElementById('visual-field-overlay-hallucinations');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-hallucinations';

    const targetContainer = findContainer();

    if (targetContainer) {
      targetContainer.appendChild(overlayElement);
    } else {
      document.body.appendChild(overlayElement);
    }

    ensureRelativePositioning(targetContainer);
  }

  Object.assign(overlayElement.style, {
    ...OVERLAY_BASE_STYLES,
    zIndex: getOverlayZIndex('hallucinations', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  // Episode System
  const { episodeSeed, episodeOpacity } = getEpisodeTiming(now, intensity, startTime);
  const episodeConfig = selectEpisodeConfig(episodeSeed, intensity);

  // Animation phases for subtle movement
  const animationPhase = Math.sin(now / 3000) * 0.5 + 0.5;
  const flashPhase = Math.sin(now / 1500) * 0.5 + 0.5;

  // Base opacity scales with intensity
  const baseOpacity = (0.25 + intensity * 0.35) * episodeOpacity;

  // Layer 1: Episode-based patterns
  let patternLayer = document.getElementById('hallucination-pattern-layer');
  if (!patternLayer) {
    patternLayer = document.createElement('div');
    patternLayer.id = 'hallucination-pattern-layer';
    overlayElement.appendChild(patternLayer);
  }

  const patternElements = generateEpisodePatterns(
    episodeConfig,
    intensity,
    baseOpacity,
    animationPhase,
    episodeSeed
  );

  Object.assign(patternLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: patternElements.join(', ') || 'transparent',
    opacity: Math.min(0.85, 0.5 + intensity * 0.35).toString(),
    pointerEvents: 'none',
    animation: 'cbsPatternDrift 8s ease-in-out infinite',
    transition: 'opacity 0.5s ease-in-out'
  });

  // Layer 2: Persistent photopsia flashes
  let flashLayer = document.getElementById('hallucination-flash-layer');
  if (!flashLayer) {
    flashLayer = document.createElement('div');
    flashLayer.id = 'hallucination-flash-layer';
    overlayElement.appendChild(flashLayer);
  }

  const flashElements: string[] = [];
  const numFlashes = Math.floor(3 + intensity * 6);
  const flashOpacityBase = (0.25 + intensity * 0.25) * flashPhase;

  for (let i = 0; i < numFlashes; i++) {
    const x = 15 + (i * 19.7 + now / 5000) % 70;
    const y = 15 + (i * 23.3) % 70;
    const size = 6 + (i % 4) * 5;
    const flashOpacity = flashOpacityBase * (0.5 + (i % 3) * 0.25);

    flashElements.push(`
      radial-gradient(circle ${size}px at ${x}% ${y}%,
        rgba(255,255,255,${flashOpacity}) 0%,
        rgba(255,255,220,${flashOpacity * 0.5}) 40%,
        rgba(255,245,200,${flashOpacity * 0.2}) 70%,
        transparent 100%
      )
    `);
  }

  Object.assign(flashLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: flashElements.join(', '),
    mixBlendMode: 'screen',
    opacity: '1',
    pointerEvents: 'none',
    animation: 'cbsFlashPulse 4s ease-in-out infinite'
  });

  // Layer 3: Vision loss area indicator
  let visionLossLayer = document.getElementById('hallucination-vision-loss');
  if (!visionLossLayer) {
    visionLossLayer = document.createElement('div');
    visionLossLayer.id = 'hallucination-vision-loss';
    overlayElement.appendChild(visionLossLayer);
  }

  Object.assign(visionLossLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: createVisionLossGradient(intensity),
    pointerEvents: 'none'
  });

  // Inject CBS-specific animations
  if (!document.getElementById('cbs-hallucination-animations')) {
    const style = document.createElement('style');
    style.id = 'cbs-hallucination-animations';
    style.textContent = CBS_KEYFRAME_ANIMATIONS;
    document.head.appendChild(style);
  }

  // Clean up old layers
  const oldLayers = ['hallucination-geometric-layer', 'hallucination-figure-layer', 'hallucination-object-layer'];
  oldLayers.forEach(id => {
    const oldLayer = document.getElementById(id);
    if (oldLayer) {
      oldLayer.remove();
    }
  });

  overlayElement.style.opacity = '1';
}
