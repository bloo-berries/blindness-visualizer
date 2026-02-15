import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';
import { OVERLAY_BASE_STYLES, getOverlayZIndex, Z_INDEX } from '../../overlayConstants';
import { ensureRelativePositioning } from '../sharedOverlayUtils';
import { ContainerFinder } from './types';

/**
 * Creates the main visual aura overlay (center)
 * Improved with zigzag fortification pattern and proper scintillation
 */
export function createVisualAuraOverlay(
  effect: VisualEffect | undefined,
  findContainer: ContainerFinder
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;

  // Create or get the main container overlay for aura
  let overlayElement = document.getElementById('visual-field-overlay-visualAura');

  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'visual-field-overlay-visualAura';

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
    zIndex: getOverlayZIndex('visualAura', Z_INDEX.BASE),
    overflow: 'hidden'
  });

  const scotomaCenterX = 50;
  const scotomaCenterY = 50;
  const scotomaSize = 18 + intensity * 8;
  const auraRingStart = scotomaSize + 3;
  const auraRingEnd = scotomaSize + 12 + intensity * 8;

  // Central scotoma (dark blind spot)
  let scotomaLayer = document.getElementById('aura-scotoma-layer');
  if (!scotomaLayer) {
    scotomaLayer = document.createElement('div');
    scotomaLayer.id = 'aura-scotoma-layer';
    overlayElement.appendChild(scotomaLayer);
  }

  const scotomaGradient = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
    rgba(40,35,45,${0.85 * intensity}) 0%,
    rgba(40,35,45,${0.8 * intensity}) ${scotomaSize - 5}%,
    rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
    rgba(60,55,65,${0.2 * intensity}) ${scotomaSize + 2}%,
    transparent ${scotomaSize + 5}%
  )`;

  Object.assign(scotomaLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: scotomaGradient,
    mixBlendMode: 'multiply',
    opacity: Math.min(0.9, intensity).toString(),
    pointerEvents: 'none'
  });

  // Zigzag fortification pattern layer
  let zigzagLayer = document.getElementById('aura-zigzag-layer');
  if (!zigzagLayer) {
    zigzagLayer = document.createElement('div');
    zigzagLayer.id = 'aura-zigzag-layer';
    overlayElement.appendChild(zigzagLayer);
  }

  const zigzagPatterns: string[] = [];
  const numSegments = 24;

  for (let i = 0; i < numSegments; i++) {
    const angle = (i / numSegments) * 360;
    const nextAngle = ((i + 1) / numSegments) * 360;

    const colorIndex = i % 4;
    let color: string;
    const baseOpacity = (0.4 + (i % 3) * 0.15) * intensity;

    if (colorIndex === 0) {
      color = `rgba(200,180,220,${baseOpacity})`;
    } else if (colorIndex === 1) {
      color = `rgba(180,200,220,${baseOpacity})`;
    } else if (colorIndex === 2) {
      color = `rgba(220,220,180,${baseOpacity})`;
    } else {
      color = `rgba(255,255,255,${baseOpacity * 1.2})`;
    }

    zigzagPatterns.push(`
      conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
        transparent 0deg,
        ${color} ${(nextAngle - angle) * 0.3}deg,
        transparent ${(nextAngle - angle) * 0.6}deg,
        ${color} ${nextAngle - angle}deg,
        transparent ${nextAngle - angle}deg
      )
    `);
  }

  const ringMask = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
    transparent 0%,
    transparent ${auraRingStart - 2}%,
    white ${auraRingStart}%,
    white ${auraRingEnd}%,
    transparent ${auraRingEnd + 2}%
  )`;

  Object.assign(zigzagLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: zigzagPatterns.slice(0, 8).join(', '),
    maskImage: ringMask,
    WebkitMaskImage: ringMask,
    mixBlendMode: 'screen',
    opacity: Math.min(0.8, intensity * 0.9).toString(),
    pointerEvents: 'none',
    animation: 'auraScintillate 0.4s steps(2) infinite'
  });

  // Bright edge layer
  let brightEdgeLayer = document.getElementById('aura-bright-edge-layer');
  if (!brightEdgeLayer) {
    brightEdgeLayer = document.createElement('div');
    brightEdgeLayer.id = 'aura-bright-edge-layer';
    overlayElement.appendChild(brightEdgeLayer);
  }

  const brightEdge = `radial-gradient(ellipse 85% 70% at ${scotomaCenterX}% ${scotomaCenterY}%,
    transparent 0%,
    transparent ${auraRingStart - 1}%,
    rgba(255,255,255,${0.6 * intensity}) ${auraRingStart}%,
    rgba(255,255,240,${0.4 * intensity}) ${auraRingStart + 2}%,
    rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
    rgba(255,255,255,${0.5 * intensity}) ${auraRingEnd - 2}%,
    rgba(255,255,255,${0.3 * intensity}) ${auraRingEnd}%,
    transparent ${auraRingEnd + 2}%
  )`;

  Object.assign(brightEdgeLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: brightEdge,
    mixBlendMode: 'screen',
    opacity: Math.min(0.85, intensity).toString(),
    pointerEvents: 'none',
    animation: 'auraFlicker 0.35s ease-in-out infinite alternate'
  });

  // Inject CSS animations
  if (!document.getElementById('aura-animations')) {
    const style = document.createElement('style');
    style.id = 'aura-animations';
    style.textContent = `
      @keyframes auraScintillate {
        0% { opacity: 0.7; transform: rotate(0deg); }
        50% { opacity: 0.9; transform: rotate(3deg); }
        100% { opacity: 0.7; transform: rotate(0deg); }
      }
      @keyframes auraFlicker {
        0% { opacity: 0.6; filter: brightness(1); }
        50% { opacity: 0.9; filter: brightness(1.3); }
        100% { opacity: 0.6; filter: brightness(1); }
      }
    `;
    document.head.appendChild(style);
  }

  overlayElement.style.opacity = Math.min(0.95, 0.7 + intensity * 0.25).toString();
}

/**
 * Creates the left visual aura overlay
 */
export function createVisualAuraLeftOverlay(
  effect: VisualEffect | undefined
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;
  const scotomaCenterX = 25;
  const scotomaCenterY = 50;
  const scotomaSize = 15 + intensity * 6;
  const auraRingStart = scotomaSize + 2;
  const auraRingEnd = scotomaSize + 10 + intensity * 6;

  const scotomaGradient = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
    rgba(40,35,45,${0.8 * intensity}) 0%,
    rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
    transparent ${scotomaSize + 4}%
  )`;

  const zigzagSegments: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * 360;
    const colorIndex = i % 4;
    const baseOpacity = (0.35 + (i % 3) * 0.12) * intensity;
    let color: string;

    if (colorIndex === 0) color = `rgba(200,180,220,${baseOpacity})`;
    else if (colorIndex === 1) color = `rgba(180,200,220,${baseOpacity})`;
    else if (colorIndex === 2) color = `rgba(220,220,180,${baseOpacity})`;
    else color = `rgba(255,255,255,${baseOpacity * 1.1})`;

    zigzagSegments.push(`
      conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
        transparent 0deg, ${color} 8deg, transparent 16deg, ${color} 22.5deg, transparent 22.5deg
      )
    `);
  }

  const brightEdge = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
    transparent ${auraRingStart - 1}%,
    rgba(255,255,255,${0.5 * intensity}) ${auraRingStart}%,
    rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
    rgba(255,255,255,${0.4 * intensity}) ${auraRingEnd}%,
    transparent ${auraRingEnd + 2}%
  )`;

  createOverlay(
    'visual-field-overlay-visualAuraLeft',
    `${scotomaGradient}, ${brightEdge}, ${zigzagSegments.slice(0, 6).join(', ')}`,
    'screen',
    Math.min(0.9, intensity).toString(),
    undefined,
    undefined,
    'visualAuraLeft'
  );
}

/**
 * Creates the right visual aura overlay
 */
export function createVisualAuraRightOverlay(
  effect: VisualEffect | undefined
): void {
  if (!effect?.enabled) return;

  const intensity = effect.intensity;
  const scotomaCenterX = 75;
  const scotomaCenterY = 50;
  const scotomaSize = 15 + intensity * 6;
  const auraRingStart = scotomaSize + 2;
  const auraRingEnd = scotomaSize + 10 + intensity * 6;

  const scotomaGradient = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
    rgba(40,35,45,${0.8 * intensity}) 0%,
    rgba(50,45,55,${0.5 * intensity}) ${scotomaSize}%,
    transparent ${scotomaSize + 4}%
  )`;

  const zigzagSegments: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * 360;
    const colorIndex = i % 4;
    const baseOpacity = (0.35 + (i % 3) * 0.12) * intensity;
    let color: string;

    if (colorIndex === 0) color = `rgba(200,180,220,${baseOpacity})`;
    else if (colorIndex === 1) color = `rgba(180,200,220,${baseOpacity})`;
    else if (colorIndex === 2) color = `rgba(220,220,180,${baseOpacity})`;
    else color = `rgba(255,255,255,${baseOpacity * 1.1})`;

    zigzagSegments.push(`
      conic-gradient(from ${angle}deg at ${scotomaCenterX}% ${scotomaCenterY}%,
        transparent 0deg, ${color} 8deg, transparent 16deg, ${color} 22.5deg, transparent 22.5deg
      )
    `);
  }

  const brightEdge = `radial-gradient(ellipse 70% 55% at ${scotomaCenterX}% ${scotomaCenterY}%,
    transparent ${auraRingStart - 1}%,
    rgba(255,255,255,${0.5 * intensity}) ${auraRingStart}%,
    rgba(240,240,255,${0.3 * intensity}) ${(auraRingStart + auraRingEnd) / 2}%,
    rgba(255,255,255,${0.4 * intensity}) ${auraRingEnd}%,
    transparent ${auraRingEnd + 2}%
  )`;

  createOverlay(
    'visual-field-overlay-visualAuraRight',
    `${scotomaGradient}, ${brightEdge}, ${zigzagSegments.slice(0, 6).join(', ')}`,
    'screen',
    Math.min(0.9, intensity).toString(),
    undefined,
    undefined,
    'visualAuraRight'
  );
}
