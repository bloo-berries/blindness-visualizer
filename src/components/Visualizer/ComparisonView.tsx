import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import YouTubeEmbed from '../YouTubeEmbed';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from './hooks';
import { useAnimationTicker } from '../../hooks';
import NeoMatrixCodeVision from './hooks/animatedOverlays/neoMatrixCodeVision';
import ColorVisionFilterSVG from './ColorVisionFilterSVG';

interface ComparisonViewProps {
  effects: VisualEffect[];
  inputSource: InputSource;
  getVideoUrl: () => string;
  getEffectStyles: () => React.CSSProperties;
  getDiplopiaOverlay: () => React.ReactNode;
  onToggleComparison: () => void;
  simulationContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Side-by-side comparison view showing simulation vs original
 */
const ComparisonView: React.FC<ComparisonViewProps> = ({
  effects,
  inputSource,
  getVideoUrl,
  getEffectStyles,
  getDiplopiaOverlay,
  onToggleComparison,
  simulationContainerRef
}) => {
  // Check if any enabled effect needs animation
  const needsAnimation = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);

  // Animation ticker for animated effects
  const now = useAnimationTicker(needsAnimation);

  // Get visual field overlay styles for React-based rendering
  const visualFieldOverlayStyles = useVisualFieldOverlay(effects);

  // Get animated overlay styles (for visual aura, etc.)
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  // Check for Neo Matrix Code Vision (requires canvas-based rendering)
  const neoEffect = effects.find(e => e.id === 'neoMatrixCodeVisionComplete' && e.enabled);

  const { t } = useTranslation();

  // Detect mobile screen for responsive layout
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className="comparison-container" sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '400px',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>

      {/* Screen Reader Announcements for Simulation Status */}
      <Box
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {effects.filter(e => e.enabled).length > 0 &&
          t('comparison.screenReaderActive', {
            count: effects.filter(e => e.enabled).length,
            defaultValue: `Simulation active with ${effects.filter(e => e.enabled).length} vision condition${effects.filter(e => e.enabled).length > 1 ? 's' : ''} applied`
          })
        }
      </Box>

      {/* Complete blindness notification */}
      {effects.some(e => e.id === 'completeBlindness' && e.enabled) && (
        <Box sx={{
          position: 'absolute',
          top: isMobile ? '25%' : '50px',
          left: isMobile ? '50%' : '25%',
          transform: 'translateX(-50%)',
          zIndex: 1002,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: isMobile ? '90%' : '45%'
        }}>
          {t('comparison.completeBlindness', 'Complete blindness - The blackness shown is the accurate visualization. Audio is still playing.')}
        </Box>
      )}

      {/* Top/Left side - Simulation video */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: isMobile ? '100%' : '50%',
        height: isMobile ? '50%' : '100%',
        borderRight: isMobile ? 'none' : '2px solid #fff',
        borderBottom: isMobile ? '2px solid #fff' : 'none'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {t('comparison.simulation', 'Simulation')}
        </Box>
        <div ref={simulationContainerRef} style={getEffectStyles()}>
          {/* Inline SVG filter for mobile WebKit compatibility */}
          <ColorVisionFilterSVG effects={effects} />
          {inputSource.type === 'youtube' ? (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Aspect ratio wrapper - constrains content to 16:9 video area */}
              <div className="aspect-ratio-16-9" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden'
              }}>
                <YouTubeEmbed
                  src={YOUTUBE_EMBED_URL}
                  title="Vision simulation video with applied visual effects"
                  aria-label="YouTube video with vision condition simulation applied"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
                {/* React-based visual field overlay for reliable rendering */}
                {visualFieldOverlayStyles.map((style, i) => (
                  <div key={i} style={style} aria-hidden="true" />
                ))}
                {/* Animated overlay for visual aura effects */}
                {animatedOverlayStyle && (
                  <div style={animatedOverlayStyle} aria-hidden="true" />
                )}
                {/* Neo Matrix Code Vision canvas overlay */}
                {neoEffect && (
                  <NeoMatrixCodeVision intensity={neoEffect.intensity} />
                )}
              </div>
            </div>
          ) : inputSource.type === 'image' && inputSource.url ? (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={inputSource.url}
                alt="Uploaded content with vision condition simulation applied"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              {/* React-based visual field overlays for reliable rendering */}
              {visualFieldOverlayStyles.map((style, i) => (
                <div key={i} style={style} aria-hidden="true" />
              ))}
              {/* Animated overlay for visual aura effects */}
              {animatedOverlayStyle && (
                <div style={animatedOverlayStyle} aria-hidden="true" />
              )}
              {/* Neo Matrix Code Vision canvas overlay */}
              {neoEffect && (
                <NeoMatrixCodeVision intensity={neoEffect.intensity} />
              )}
            </div>
          ) : (
            <Box sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Typography>{t('comparison.simulationPlaceholder', 'Simulation content would appear here')}</Typography>
            </Box>
          )}
        </div>
        {getDiplopiaOverlay()}
      </Box>

      {/* Bottom/Right side - Original video */}
      <Box sx={{
        position: 'absolute',
        right: 0,
        top: isMobile ? '50%' : 0,
        width: isMobile ? '100%' : '50%',
        height: isMobile ? '50%' : '100%'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {t('comparison.original', 'Original')}
        </Box>
        {inputSource.type === 'youtube' ? (
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Aspect ratio wrapper - matches simulation side */}
            <div className="aspect-ratio-16-9" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden'
            }}>
              <YouTubeEmbed
                src={YOUTUBE_EMBED_URL}
                title="Original YouTube video"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          </div>
        ) : inputSource.type === 'image' && inputSource.url ? (
          <img
            src={inputSource.url}
            alt="Original uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Typography>{t('comparison.originalPlaceholder', 'Original content would appear here')}</Typography>
          </Box>
        )}
      </Box>

      {/* Toggle button */}
      <Box sx={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          onClick={onToggleComparison}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            padding: isMobile ? '4px 10px' : '6px 16px',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }}
        >
          {t('comparison.viewFullSimulation', 'View Full Simulation')}
        </Button>
      </Box>
    </Box>
  );
};

export default ComparisonView;
