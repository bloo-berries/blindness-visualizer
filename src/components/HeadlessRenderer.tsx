import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { VisualEffect, ConditionType } from '../types/visualEffects';
import { VISUAL_EFFECTS } from '../data/visualEffects';
import { generateCSSFilters } from '../utils/cssFilters';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from './Visualizer/hooks';
import { useAnimationTicker } from '../hooks';
import ColorVisionFilterSVG from './Visualizer/ColorVisionFilterSVG';

/**
 * HeadlessRenderer — a minimal page for automated screenshot capture.
 *
 * URL params:
 *   conditions  comma-separated ConditionType IDs (e.g. "protanopia,glaucoma")
 *   intensity   0–100, default 100
 *
 * A hidden file input allows Playwright to inject an image via setInputFiles().
 * Falls back to /images/garden.png when no file is provided.
 *
 * Sets data-visionsim-ready="true" on the container once effects are painted.
 */
const HeadlessRenderer: React.FC = () => {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const conditionIds = useMemo<ConditionType[]>(() => {
    const raw = params.get('conditions') || '';
    if (!raw) return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean) as ConditionType[];
  }, [params]);

  const intensity = useMemo(() => {
    const raw = params.get('intensity');
    if (raw == null) return 1.0;
    const n = Number(raw);
    if (Number.isNaN(n)) return 1.0;
    // Accept 0–100 (percentage) or 0–1 (fraction)
    return n > 1 ? Math.min(n, 100) / 100 : Math.max(0, Math.min(1, n));
  }, [params]);

  // Image source — starts with fallback
  const [imageSrc, setImageSrc] = useState<string>(`${process.env.PUBLIC_URL || ''}/images/garden.png`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  }, []);

  // Build effects array
  const effects: VisualEffect[] = useMemo(() => {
    const idSet = new Set(conditionIds);
    return VISUAL_EFFECTS.map(effect => ({
      ...effect,
      enabled: idSet.has(effect.id),
      intensity: idSet.has(effect.id) ? intensity : 0.0,
    }));
  }, [conditionIds, intensity]);

  // Animation — freeze at a single frame for deterministic screenshots
  const needsAnimation = useMemo(
    () => effects.some(e => ANIMATED_EFFECTS.has(e.id) && e.enabled),
    [effects],
  );
  // Provide a single frozen timestamp so animated overlays render one frame
  const now = useAnimationTicker(needsAnimation);

  // Overlay hooks
  const visualFieldOverlayStyles = useVisualFieldOverlay(effects);
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  // CSS filter string
  const cssFilters = useMemo(() => generateCSSFilters(effects), [effects]);

  // Complete blindness checks
  const isCompleteBlindness = effects.some(e => e.id === 'completeBlindness' && e.enabled);
  const isNearTotalBlindness = effects.some(
    e => (e.id === 'tofiriComplete' || e.id === 'nemethComplete') && e.enabled,
  );

  // Readiness signal — set after first paint with effects
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Give CSS filters & SVG filters a frame to paint
    const id = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.setAttribute('data-visionsim-ready', 'true');
      }
    });
    return () => cancelAnimationFrame(id);
  }, [effects, imageSrc]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '1200px',
        height: '675px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Hidden file input for Playwright setInputFiles() */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        data-testid="headless-file-input"
      />

      {/* Effects container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: cssFilters || 'none',
        }}
      >
        {/* Inline SVG filter for color vision */}
        <ColorVisionFilterSVG effects={effects} />

        {/* Source image */}
        <img
          src={imageSrc}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Complete/near-total blindness overlay */}
        {(isCompleteBlindness || isNearTotalBlindness) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              zIndex: 9999,
            }}
            aria-hidden="true"
          />
        )}

        {/* Visual field overlays */}
        {visualFieldOverlayStyles.map((style, i) => (
          <div key={i} style={style} aria-hidden="true" />
        ))}

        {/* Animated overlay */}
        {animatedOverlayStyle && (
          <div style={animatedOverlayStyle} aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default HeadlessRenderer;
