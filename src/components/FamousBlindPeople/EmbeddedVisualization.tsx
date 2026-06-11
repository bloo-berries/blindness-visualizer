import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { VisualEffect } from '../../types/visualEffects';
import { VISUAL_EFFECTS } from '../../data/visualEffects';
import { getSimulationConditions } from '../../utils/famousPeopleUtils';
import { generateCSSFilters } from '../../utils/cssFilters';
import { YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import YouTubeEmbed from '../YouTubeEmbed';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from '../Visualizer/hooks';
import { useAnimationTicker } from '../../hooks';
import NeoMatrixCodeVision from '../Visualizer/hooks/animatedOverlays/neoMatrixCodeVision';
import ColorVisionFilterSVG from '../Visualizer/ColorVisionFilterSVG';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check reduced-motion preference
  const prefersReducedMotion = useMemo(() =>
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
    document.documentElement.classList.contains('reduced-motion-mode'),
    []
  );

  // On mobile, start with animation paused; on desktop, auto-animate
  const [isAnimating, setIsAnimating] = useState(!isMobile && !prefersReducedMotion);

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
    effects.some(e => ANIMATED_EFFECTS.has(e.id) && e.enabled),
    [effects]
  );

  // Animation ticker for animated effects — disabled when not animating
  const now = useAnimationTicker(needsAnimation && isAnimating);

  // Get visual field overlay styles
  const visualFieldOverlayStyles = useVisualFieldOverlay(effects);

  // Get animated overlay styles
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

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
        {t('famousPeople.dialog.visionSimulationPreview', 'Vision Simulation Preview')}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '16 / 9',
          '@supports not (aspect-ratio: 16 / 9)': {
            paddingBottom: '56.25%',
            height: 0,
          },
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
          {t('comparison.simulation', 'Simulation')}
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
            {t('comparison.completeBlindnessTotalDarkness', 'Complete blindness - Total darkness')}
          </Box>
        )}

        {/* "Tap to preview" overlay for mobile / reduced-motion */}
        {!isAnimating && needsAnimation && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1003,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              cursor: 'pointer'
            }}
            onClick={() => setIsAnimating(true)}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsAnimating(true);
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#000',
                fontWeight: 600,
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              {t('famousPeople.dialog.tapToPreview', 'Tap to preview')}
            </Button>
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
          {/* Inline SVG filter for mobile WebKit compatibility */}
          <ColorVisionFilterSVG effects={effects} />
          <YouTubeEmbed
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

          {/* Visual field overlays */}
          {visualFieldOverlayStyles.map((style, i) => (
            <div key={i} style={style} aria-hidden="true" />
          ))}


          {/* Animated overlay */}
          {animatedOverlayStyle && (
            <div style={animatedOverlayStyle} aria-hidden="true" />
          )}

          {/* Neo Matrix Code Vision canvas overlay */}
          {neoEffect && isAnimating && (
            <NeoMatrixCodeVision intensity={neoEffect.intensity} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
