import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { VisualEffect } from '../../types/visualEffects';
import { VISUAL_EFFECTS } from '../../data/visualEffects';
import { getSimulationConditions } from '../../utils/famousPeopleUtils';
import { generateCSSFilters } from '../../utils/cssFilters';
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

  // Generate CSS filters for the enabled effects
  const cssFilters = useMemo(() => {
    return generateCSSFilters(effects);
  }, [effects]);

  // Check for complete blindness conditions (total darkness only)
  // Note: Heather's LP vision is NOT total darkness - it's "washed-out white"
  const isCompleteBlindness = effects.some(e => e.id === 'completeBlindness' && e.enabled);
  const isNearTotalBlindness = effects.some(e =>
    (e.id === 'tofiriComplete' ||
     e.id === 'nemethComplete') && e.enabled
  );

  // Check for Neo Matrix Code Vision (requires canvas-based rendering)
  const neoEffect = effects.find(e => e.id === 'neoMatrixCodeVisionComplete' && e.enabled);

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

        {/* Video container with effects */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: cssFilters || 'none'
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
      </Box>
    </Box>
  );
};
