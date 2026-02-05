/**
 * Generates overlay styles for preview images in the ControlPanel
 * This is separate from overlayManager.ts which handles DOM overlays for the main visualizer
 */

import React from 'react';
import { VisualEffect } from '../../../types/visualEffects';
import { ConditionType } from '../../../types/visualEffects';
import { isVisualDisturbanceCondition, isVisualFieldLossCondition, Z_INDEX } from '../../../utils/overlayConstants';
import { generateVisualFieldLossPreviewStyle } from './visualFieldLossPreview';
import { generateVisualDisturbancePreviewStyle } from './visualDisturbancePreview';
import { generateRetinalDiseasePreviewStyle } from './retinalDiseasePreview';
import { generateFamousPeoplePreviewStyle } from './famousPeoplePreview';
import { generateSymptomPreviewStyle } from './symptomPreview';

/**
 * Generates overlay style for a single effect in the preview
 */
export const generatePreviewOverlayStyle = (
  effect: VisualEffect,
  enabledEffects: VisualEffect[]
): React.CSSProperties | null => {
  const effectType = effect.id as ConditionType;
  const intensity = effect.intensity;
  
  // Base overlay style
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    clipPath: 'inset(0)',
    transform: 'translateZ(0)'
  };

  // Set z-index based on condition type
  if (isVisualDisturbanceCondition(effectType)) {
    overlayStyle.zIndex = Z_INDEX.VISUAL_DISTURBANCE;
  } else if (isVisualFieldLossCondition(effectType)) {
    overlayStyle.zIndex = Z_INDEX.VISUAL_FIELD_LOSS;
  } else {
    overlayStyle.zIndex = Z_INDEX.BASE + enabledEffects.indexOf(effect);
  }
  
  // Get current time for animated effects (throttled for performance)
  const now = Math.floor(Date.now() / 100) * 100;

  // Direct handling for visualFloaters with slow drifting animation
  if (effectType === 'visualFloaters') {
    const opacity = 0.6 + intensity * 0.3;
    const time = now / 1000; // Convert to seconds for slower movement

    // Each floater drifts with different speeds and patterns
    // Using sine/cosine for smooth, organic movement
    const drift = (seed: number, speedX: number, speedY: number, rangeX: number, rangeY: number) => {
      const x = Math.sin(time * speedX + seed) * rangeX;
      const y = Math.cos(time * speedY + seed * 1.3) * rangeY;
      return { x, y };
    };

    // Base positions + animated drift for each floater
    const f1 = drift(0, 0.15, 0.12, 8, 6);
    const f2 = drift(1, 0.18, 0.14, 7, 5);
    const f3 = drift(2, 0.12, 0.16, 6, 8);
    const f4 = drift(3, 0.2, 0.1, 5, 4);
    const f5 = drift(4, 0.14, 0.18, 7, 6);
    const f6 = drift(5, 0.16, 0.13, 4, 5);
    const f7 = drift(6, 0.11, 0.15, 8, 7);
    const f8 = drift(7, 0.17, 0.11, 5, 4);

    overlayStyle.background = [
      `radial-gradient(ellipse 60px 25px at ${25 + f1.x}% ${30 + f1.y}%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(ellipse 50px 20px at ${70 + f2.x}% ${40 + f2.y}%, rgba(0,0,0,${opacity * 0.9}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(circle 30px at ${50 + f3.x}% ${65 + f3.y}%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(ellipse 45px 18px at ${60 + f4.x}% ${25 + f4.y}%, rgba(0,0,0,${opacity * 0.8}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(ellipse 35px 15px at ${35 + f5.x}% ${75 + f5.y}%, rgba(0,0,0,${opacity * 0.75}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(circle 20px at ${80 + f6.x}% ${55 + f6.y}%, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(ellipse 55px 22px at ${15 + f7.x}% ${50 + f7.y}%, rgba(0,0,0,${opacity * 0.85}) 0%, rgba(0,0,0,0) 70%)`,
      `radial-gradient(circle 25px at ${85 + f8.x}% ${30 + f8.y}%, rgba(0,0,0,${opacity * 0.65}) 0%, rgba(0,0,0,0) 70%)`
    ].join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Direct handling for visualSnow - TV static / snow globe effect
  // Based on medical descriptions: small, diffuse, mobile, asynchronous dots
  // Broadband type: black and white dots visible against any background
  if (effectType === 'visualSnow') {
    const time = now / 1000;
    const allDots: string[] = [];

    // Layer 1: Dense static dots (broadband type - black and white)
    for (let i = 0; i < 60; i++) {
      // Animated positions for asynchronous movement
      const baseX = (i * 13.7 + (i * i * 0.3)) % 100;
      const baseY = (i * 17.3 + (i * 0.7)) % 100;
      const drift1 = Math.sin(time * 0.8 + i * 0.5) * 2;
      const drift2 = Math.cos(time * 0.6 + i * 0.3) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 1 + (i % 3);
      const isBlack = i % 2 === 0;
      const baseOpacity = (0.4 + (i % 5) * 0.1) * intensity;

      if (isBlack) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    // Layer 2: Secondary dots with different movement phase
    for (let i = 0; i < 40; i++) {
      const baseX = (i * 23.1 + 7) % 100;
      const baseY = (i * 19.3 + 11) % 100;
      const drift1 = Math.sin(time * 0.5 + i * 0.7 + 2) * 2;
      const drift2 = Math.cos(time * 0.7 + i * 0.4 + 1) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 1 + (i % 2);
      const isBlack = (i + 1) % 2 === 0;
      const baseOpacity = (0.35 + (i % 4) * 0.08) * intensity;

      if (isBlack) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    // Layer 3: Blue field entoptic phenomenon - bright shooting dots
    for (let i = 0; i < 8; i++) {
      const baseX = (i * 29.3 + 5) % 100;
      const baseY = (i * 37.1 + 15) % 100;
      // Faster movement for "shooting" effect
      const shootX = Math.sin(time * 1.5 + i * 2) * 5;
      const shootY = Math.cos(time * 1.2 + i * 1.5) * 4;
      const x = (baseX + shootX + 100) % 100;
      const y = (baseY + shootY + 100) % 100;
      const size = 2 + (i % 2);
      const brightness = (0.5 + (i % 3) * 0.15) * intensity;

      allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${brightness}) 0%, rgba(200,230,255,${brightness * 0.5}) 50%, transparent 100%)`);
    }

    // Layer 4: Photopsia - occasional light flashes (pulsing)
    const flashPhase = Math.sin(time * 0.4) * 0.5 + 0.5;
    for (let i = 0; i < 3; i++) {
      const x = (i * 31.7 + 20) % 80 + 10;
      const y = (i * 41.3 + 15) % 70 + 15;
      const size = 8 + (i % 3) * 4;
      const flashOpacity = (0.1 + (i % 2) * 0.08) * intensity * flashPhase;

      allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,240,${flashOpacity}) 0%, rgba(255,255,200,${flashOpacity * 0.3}) 50%, transparent 100%)`);
    }

    overlayStyle.background = allDots.join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Visual Snow (Flashing Static) - Rapid flickering variant
  if (effectType === 'visualSnowFlashing') {
    const time = now / 1000;
    const allDots: string[] = [];
    // Flicker phase - alternates rapidly
    const flickerPhase = Math.floor(time * 10) % 2 === 0 ? 1 : 0.7;

    for (let i = 0; i < 80; i++) {
      const x = (i * 13.7 + (i * i * 0.3)) % 100;
      const y = (i * 17.3 + (i * 0.7)) % 100;
      const size = 1 + (i % 3);
      const isBlack = i % 2 === 0;
      const baseOpacity = (0.5 + (i % 4) * 0.1) * intensity * flickerPhase;

      if (isBlack) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    overlayStyle.background = allDots.join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Visual Snow (Colored Static) - Chromatic variant
  if (effectType === 'visualSnowColored') {
    const time = now / 1000;
    const allDots: string[] = [];
    const colors = [
      'rgba(255,100,100', // Red
      'rgba(100,255,100', // Green
      'rgba(100,100,255', // Blue
      'rgba(100,255,255', // Cyan
      'rgba(255,100,255', // Magenta
      'rgba(255,255,100', // Yellow
      'rgba(255,150,50',  // Orange
      'rgba(150,100,255'  // Purple
    ];

    for (let i = 0; i < 70; i++) {
      const baseX = (i * 13.7 + (i * i * 0.3)) % 100;
      const baseY = (i * 17.3 + (i * 0.7)) % 100;
      const drift1 = Math.sin(time * 0.6 + i * 0.5) * 2;
      const drift2 = Math.cos(time * 0.5 + i * 0.3) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 1 + (i % 3);
      const color = colors[i % colors.length];
      const baseOpacity = (0.4 + (i % 5) * 0.1) * intensity;

      allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, ${color},${baseOpacity}) 0%, transparent 100%)`);
    }

    overlayStyle.background = allDots.join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Visual Snow (Transparent Static) - Subtle, semi-transparent variant
  if (effectType === 'visualSnowTransparent') {
    const time = now / 1000;
    const allDots: string[] = [];

    for (let i = 0; i < 80; i++) {
      const baseX = (i * 13.7 + (i * i * 0.3)) % 100;
      const baseY = (i * 17.3 + (i * 0.7)) % 100;
      const drift1 = Math.sin(time * 0.4 + i * 0.4) * 2;
      const drift2 = Math.cos(time * 0.35 + i * 0.25) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 2 + (i % 4);
      // Very low opacity for transparent effect
      const baseOpacity = (0.15 + (i % 5) * 0.05) * intensity;

      if (i % 2 === 0) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    overlayStyle.background = allDots.join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Visual Snow (Dense Static) - Severe, high-density variant
  if (effectType === 'visualSnowDense') {
    const time = now / 1000;
    const allDots: string[] = [];

    // Many more dots for dense effect
    for (let i = 0; i < 120; i++) {
      const baseX = (i * 11.3 + (i * i * 0.2)) % 100;
      const baseY = (i * 13.7 + (i * 0.5)) % 100;
      const drift1 = Math.sin(time * 0.7 + i * 0.4) * 2;
      const drift2 = Math.cos(time * 0.55 + i * 0.3) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 2 + (i % 4);
      const isBlack = i % 2 === 0;
      const baseOpacity = (0.5 + (i % 4) * 0.12) * intensity;

      if (isBlack) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    // Second layer for even more density
    for (let i = 0; i < 80; i++) {
      const baseX = (i * 17.1 + 5) % 100;
      const baseY = (i * 21.3 + 9) % 100;
      const drift1 = Math.sin(time * 0.5 + i * 0.6 + 1) * 2;
      const drift2 = Math.cos(time * 0.6 + i * 0.4 + 2) * 2;
      const x = (baseX + drift1 + 100) % 100;
      const y = (baseY + drift2 + 100) % 100;
      const size = 2 + (i % 3);
      const isBlack = (i + 1) % 2 === 0;
      const baseOpacity = (0.45 + (i % 5) * 0.1) * intensity;

      if (isBlack) {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(0,0,0,${baseOpacity}) 0%, transparent 100%)`);
      } else {
        allDots.push(`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${baseOpacity}) 0%, transparent 100%)`);
      }
    }

    overlayStyle.background = allDots.join(', ');
    overlayStyle.opacity = 1;
    return overlayStyle;
  }

  // Delegate to category-specific generators
  const visualFieldLossStyle = generateVisualFieldLossPreviewStyle(effectType, intensity, now);
  if (visualFieldLossStyle) {
    Object.assign(overlayStyle, visualFieldLossStyle);
    return overlayStyle;
  }
  
  const visualDisturbanceStyle = generateVisualDisturbancePreviewStyle(effectType, intensity, now);
  if (visualDisturbanceStyle) {
    Object.assign(overlayStyle, visualDisturbanceStyle);
    return overlayStyle;
  }
  
  const retinalDiseaseStyle = generateRetinalDiseasePreviewStyle(effectType, intensity, now);
  if (retinalDiseaseStyle) {
    Object.assign(overlayStyle, retinalDiseaseStyle);
    return overlayStyle;
  }
  
  const famousPeopleStyle = generateFamousPeoplePreviewStyle(effectType, intensity, now);
  if (famousPeopleStyle) {
    Object.assign(overlayStyle, famousPeopleStyle);
    return overlayStyle;
  }
  
  const symptomStyle = generateSymptomPreviewStyle(effectType, intensity, now);
  if (symptomStyle) {
    Object.assign(overlayStyle, symptomStyle);
    return overlayStyle;
  }
  
  // Default fallback
  overlayStyle.background = `rgba(0,0,0,${intensity * 0.3})`;
  overlayStyle.mixBlendMode = 'multiply';
  overlayStyle.opacity = intensity;
  
  return overlayStyle;
};

