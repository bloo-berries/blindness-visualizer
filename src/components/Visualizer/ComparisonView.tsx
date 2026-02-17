import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { YOUTUBE_IFRAME_PROPS, YOUTUBE_EMBED_URL } from '../../utils/appConstants';
import { useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from './hooks';

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
  // Animation state for animated effects
  const [now, setNow] = useState(Date.now());

  // Check if any enabled effect needs animation
  const needsAnimation = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);

  // Animation loop for animated effects
  useEffect(() => {
    if (!needsAnimation) return;

    // Update every 100ms for smooth animation (same as EffectPreview)
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [needsAnimation]);

  // Get visual field overlay styles for React-based rendering
  const visualFieldOverlayStyle = useVisualFieldOverlay(effects);

  // Get animated overlay styles (for visual aura, etc.)
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

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
          `Simulation active with ${effects.filter(e => e.enabled).length} vision condition${effects.filter(e => e.enabled).length > 1 ? 's' : ''} applied`
        }
      </Box>

      {/* Complete blindness notification */}
      {effects.some(e => e.id === 'completeBlindness' && e.enabled) && (
        <Box sx={{
          position: 'absolute',
          top: '50px',
          left: '25%',
          transform: 'translateX(-50%)',
          zIndex: 1002,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: '45%'
        }}>
          Complete blindness - The blackness shown is the accurate visualization. Audio is still playing.
        </Box>
      )}

      {/* Left side - Simulation video */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50%',
        height: '100%',
        borderRight: '2px solid #fff'
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
          Simulation
        </Box>
        <div ref={simulationContainerRef} style={getEffectStyles()}>
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
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '16 / 9',
                overflow: 'hidden'
              }}>
                <iframe
                  {...YOUTUBE_IFRAME_PROPS}
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
                {visualFieldOverlayStyle && (
                  <div style={visualFieldOverlayStyle} aria-hidden="true" />
                )}
                {/* Animated overlay for visual aura effects */}
                {animatedOverlayStyle && (
                  <div style={animatedOverlayStyle} aria-hidden="true" />
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
              {/* React-based visual field overlay for reliable rendering */}
              {visualFieldOverlayStyle && (
                <div style={visualFieldOverlayStyle} aria-hidden="true" />
              )}
              {/* Animated overlay for visual aura effects */}
              {animatedOverlayStyle && (
                <div style={animatedOverlayStyle} aria-hidden="true" />
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
              <Typography>Simulation content would appear here</Typography>
            </Box>
          )}
        </div>
        {getDiplopiaOverlay()}
      </Box>

      {/* Right side - Original video */}
      <Box sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%'
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
          Original
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
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: '16 / 9',
              overflow: 'hidden'
            }}>
              <iframe
                {...YOUTUBE_IFRAME_PROPS}
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
            <Typography>Original content would appear here</Typography>
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
          onClick={onToggleComparison}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }}
        >
          View Full Simulation
        </Button>
      </Box>
    </Box>
  );
};

export default ComparisonView;
