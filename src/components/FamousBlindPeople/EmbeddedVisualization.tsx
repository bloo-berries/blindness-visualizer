import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { VisualEffect } from '../../types/visualEffects';
import { VISUAL_EFFECTS } from '../../data/visualEffects';
import { getSimulationConditions } from '../../utils/famousPeopleUtils';
import { generateCSSFilters } from '../../utils/cssFilters';
import { YOUTUBE_IFRAME_PROPS, YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from '../Visualizer/hooks';
import { useAnimationTicker } from '../../hooks';

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

  // Generate CSS filters for the enabled effects
  const cssFilters = useMemo(() => {
    return generateCSSFilters(effects);
  }, [effects]);

  // Check for complete blindness
  const isCompleteBlindness = effects.some(e => e.id === 'completeBlindness' && e.enabled);

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

        {/* Complete blindness notification */}
        {isCompleteBlindness && (
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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />

          {/* Visual field overlay */}
          {visualFieldOverlayStyle && (
            <div style={visualFieldOverlayStyle} aria-hidden="true" />
          )}

          {/* Animated overlay */}
          {animatedOverlayStyle && (
            <div style={animatedOverlayStyle} aria-hidden="true" />
          )}
        </Box>
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
