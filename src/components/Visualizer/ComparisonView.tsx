import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { YOUTUBE_IFRAME_PROPS, YOUTUBE_EMBED_URL } from '../../utils/appConstants';

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
              overflow: 'hidden'
            }}>
              <iframe
                {...YOUTUBE_IFRAME_PROPS}
                src={getVideoUrl()}
                title="Vision simulation video with applied visual effects"
                aria-label="YouTube video with vision condition simulation applied"
                style={{ width: '100%', height: '100%' }}
              />
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
          <iframe
            {...YOUTUBE_IFRAME_PROPS}
            src={YOUTUBE_EMBED_URL}
            title="Original YouTube video"
            style={{ width: '100%', height: '100%' }}
          />
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
