import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { VisualEffect, ConditionType } from '../../types/visualEffects';
import { VISUAL_EFFECTS } from '../../data/visualEffects';
import { getSimulationConditions } from '../../utils/famousPeopleUtils';
import { generateCSSFilters } from '../../utils/cssFilters';
import { isColorVisionCondition, getColorVisionMatrix } from '../../utils/colorVisionFilters';
import { YOUTUBE_IFRAME_PROPS, YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from '../Visualizer/hooks';
import { useAnimationTicker } from '../../hooks';
import NeoMatrixCodeVision from '../Visualizer/hooks/animatedOverlays/neoMatrixCodeVision';

interface EmbeddedVisualizationProps {
  personId: string;
  simulation: string;
  personName: string;
}

/**
 * Embedded visualization component that shows a YouTube video
 * with the person's vision condition effects applied.
 * Used in PersonDialog to preview the simulation without navigation.
 */
export const EmbeddedVisualization: React.FC<EmbeddedVisualizationProps> = ({
  personId,
  simulation,
  personName
}) => {
  // Create effects array with the person's conditions enabled
  const effects: VisualEffect[] = useMemo(() => {
    const conditionIds = getSimulationConditions(simulation);

    return VISUAL_EFFECTS.map(effect => ({
      ...effect,
      enabled: conditionIds.includes(effect.id),
      intensity: conditionIds.includes(effect.id) ? 1.0 : 0.0
    }));
  }, [simulation]);

  // Check if any enabled effect needs animation
  const needsAnimation = useMemo(() =>
    effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled),
    [effects]
  );

  // Animation ticker for animated effects
  const now = useAnimationTicker(needsAnimation);

  // Get visual field overlay styles
  const visualFieldOverlayStyle = useVisualFieldOverlay(effects);

  // Get animated overlay styles
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  // Secondary overlay for monocular blindness when combined with another visual field effect
  // useVisualFieldOverlay returns only one overlay, so if glaucoma (or similar) is matched first,
  // blindnessLeftEye/blindnessRightEye never renders. Handle it separately here.
  const monocularOverlayStyle = useMemo((): React.CSSProperties | null => {
    const hasOtherFieldEffect = effects.some(e =>
      e.enabled && ['glaucoma', 'tunnelVision', 'retinitisPigmentosa', 'hemianopiaLeft', 'hemianopiaRight', 'scotoma'].includes(e.id)
    );
    if (!hasOtherFieldEffect) return null;

    const leftEye = effects.find(e => e.id === 'blindnessLeftEye' && e.enabled);
    const rightEye = effects.find(e => e.id === 'blindnessRightEye' && e.enabled);
    const eye = leftEye || rightEye;
    if (!eye) return null;

    const intensity = eye.intensity === 1 ? 1 : 0.95 * eye.intensity;
    const direction = leftEye ? 'to right' : 'to left';
    return {
      position: 'absolute' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none' as const,
      zIndex: 10000,
      background: `linear-gradient(${direction},
        rgba(0,0,0,${intensity}) 0%,
        rgba(0,0,0,${intensity}) 47.5%,
        rgba(0,0,0,${intensity * 0.7}) 48.75%,
        rgba(0,0,0,${intensity * 0.4}) 50%,
        rgba(0,0,0,${intensity * 0.1}) 51.25%,
        rgba(0,0,0,0) 52.5%
      )`,
      mixBlendMode: 'normal' as const,
      opacity: 1
    };
  }, [effects]);

  // Generate inline SVG feColorMatrix values for color vision effects
  // Used with backdrop-filter for mobile Safari compatibility (CSS filter on
  // a parent of a cross-origin iframe doesn't work on mobile Safari)
  const colorVisionMatrix = useMemo((): string | null => {
    const colorEffect = effects.find(e => isColorVisionCondition(e.id) && e.enabled);
    if (!colorEffect || colorEffect.intensity === 0) return null;

    // For monochromacy, use saturate/contrast CSS filter instead of SVG matrix
    if (colorEffect.id === 'monochromatic' || colorEffect.id === 'monochromacy') return null;

    const fullMatrix = getColorVisionMatrix(colorEffect.id as ConditionType, 1.0);
    const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const blended = fullMatrix.map((val, i) =>
      val * colorEffect.intensity + identity[i] * (1 - colorEffect.intensity)
    );

    return [
      blended[0], blended[1], blended[2], 0, 0,
      blended[3], blended[4], blended[5], 0, 0,
      blended[6], blended[7], blended[8], 0, 0,
      0, 0, 0, 1, 0
    ].join(' ');
  }, [effects]);

  // Generate CSS filters excluding color vision SVG references (those are
  // handled separately via backdrop-filter for mobile compatibility)
  const nonColorCSSFilters = useMemo(() => {
    if (colorVisionMatrix) {
      // Strip url(#...) SVG filter references, keep other CSS filters (blur, brightness, etc.)
      const fullFilters = generateCSSFilters(effects);
      return fullFilters.replace(/url\(#[^)]+\)/g, '').trim();
    }
    return generateCSSFilters(effects);
  }, [effects, colorVisionMatrix]);

  // Check for complete blindness conditions (total darkness only)
  // Note: Heather's LP vision is NOT total darkness - it's "washed-out white"
  const isCompleteBlindness = effects.some(e => e.id === 'completeBlindness' && e.enabled);
  const isNearTotalBlindness = effects.some(e =>
    (e.id === 'tofiriComplete' ||
     e.id === 'nemethComplete') && e.enabled
  );

  // Check for Neo Matrix Code Vision (requires canvas-based rendering)
  const neoEffect = effects.find(e => e.id === 'neoMatrixCodeVisionComplete' && e.enabled);

  const colorFilterId = 'embedded-cvd-filter';
  const backdropFilterValue = colorVisionMatrix ? `url(#${colorFilterId})` : undefined;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
        Vision Simulation Preview
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '16 / 9',
          backgroundColor: '#000',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        {/* Inline SVG filter for color vision - rendered locally for mobile Safari compatibility */}
        {colorVisionMatrix && (
          <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
            <defs>
              <filter id={colorFilterId} colorInterpolationFilters="linearRGB">
                <feColorMatrix type="matrix" values={colorVisionMatrix} />
              </filter>
            </defs>
          </svg>
        )}

        {/* Simulation label */}
        <Box
          sx={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            zIndex: 1001,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Simulation
        </Box>

        {/* Complete blindness / near-total blindness notification */}
        {(isCompleteBlindness || isNearTotalBlindness) && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1002,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '10px',
              textAlign: 'center',
              maxWidth: '85%'
            }}
          >
            Complete blindness - Total darkness
          </Box>
        )}

        {/* Video container with non-color CSS filters (blur, brightness, etc.) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: nonColorCSSFilters || 'none'
          }}
        >
          <iframe
            {...YOUTUBE_IFRAME_PROPS}
            src={YOUTUBE_EMBED_URL}
            title={`Vision simulation for ${personName}`}
            aria-label={`YouTube video with ${personName}'s vision condition simulation applied`}
            tabIndex={-1}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Visual field overlay */}
          {visualFieldOverlayStyle && (
            <div style={visualFieldOverlayStyle} aria-hidden="true" />
          )}

          {/* Monocular blindness overlay (when combined with another visual field effect) */}
          {monocularOverlayStyle && (
            <div style={monocularOverlayStyle} aria-hidden="true" />
          )}

          {/* Animated overlay */}
          {animatedOverlayStyle && (
            <div style={animatedOverlayStyle} aria-hidden="true" />
          )}

          {/* Neo Matrix Code Vision canvas overlay */}
          {neoEffect && (
            <NeoMatrixCodeVision intensity={neoEffect.intensity} />
          )}
        </Box>

        {/* Color vision filter overlay - uses backdrop-filter for mobile Safari
            compatibility with cross-origin iframes */}
        {backdropFilterValue && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: backdropFilterValue,
              WebkitBackdropFilter: backdropFilterValue,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}
      >
        Click "Experience Simulation" for full-screen view
      </Typography>
    </Box>
  );
};
