import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { Download, CompareArrows, Fullscreen } from '@mui/icons-material';
import { generateEffectsDescription } from '../../utils/effectsDescription';
import { YOUTUBE_EMBED_URL, getFamousPersonVideoUrl } from '../../utils/appConstants';
import { cleanupAllDOMFilters } from '../../utils/colorVisionFilters';
import YouTubeEmbed from '../YouTubeEmbed';
import { useScreenshot, useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS, useCSSFilters, useSceneSetup } from './hooks';
import { useAnimationTicker } from '../../hooks';
import ComparisonView from './ComparisonView';
import ColorVisionFilterSVG from './ColorVisionFilterSVG';
import { useDiplopiaOverlay } from './DiplopiaOverlay';
import NeoMatrixCodeVision from './hooks/animatedOverlays/neoMatrixCodeVision';

interface VisualizerProps {
  effects: VisualEffect[];
  inputSource: InputSource;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  personName?: string;
  personCondition?: string;
  showComparison?: boolean;
  onToggleComparison?: () => void;
  isFamousPeopleMode?: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({
  effects,
  inputSource,
  diplopiaSeparation = 1.0,
  diplopiaDirection = 0.0,
  personName,
  personCondition,
  showComparison: propShowComparison,
  onToggleComparison,
  isFamousPeopleMode = false
}) => {
  const { t } = useTranslation();
  const visualizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const simulationContainerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showComparison, setShowComparison] = useState(propShowComparison || false);

  // Update local showComparison state when prop changes
  useEffect(() => {
    if (propShowComparison !== undefined) {
      setShowComparison(propShowComparison);
    } else if (isFamousPeopleMode && personName && personCondition) {
      setShowComparison(true);
    }
  }, [personName, personCondition, propShowComparison, isFamousPeopleMode]);

  // Cleanup DOM-injected SVG filters on unmount
  useEffect(() => {
    return () => { cleanupAllDOMFilters(); };
  }, []);

  // Scene setup: WebGL lifecycle, media loading, animation loop
  const { isLoading, error, handleRetryCamera, effectProcessor, overlayManager } = useSceneSetup(
    containerRef,
    mediaRef,
    streamRef,
    effects,
    inputSource,
    diplopiaSeparation,
    diplopiaDirection,
    showComparison,
  );

  // Use screenshot hook - use visualizerRef (always visible) instead of containerRef (hidden for images)
  const { isSaving, saveMessage, handleSaveScreenshot, clearSaveMessage } = useScreenshot(
    visualizerRef,
    effects,
    inputSource,
    diplopiaSeparation,
    diplopiaDirection,
    isLoading
  );

  // Fullscreen handler for image preview
  const handleFullscreen = useCallback(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(() => {
        // Fullscreen not supported or denied — ignore silently
      });
    }
  }, []);

  // Check if any enabled effect needs animation
  const needsAnimatedOverlay = useMemo(() =>
    effects.some(e => ANIMATED_EFFECTS.has(e.id) && e.enabled),
    [effects]
  );

  // Animation ticker for animated effects (used in full simulation view)
  const now = useAnimationTicker(needsAnimatedOverlay && !showComparison);

  // Get visual field overlay styles for React-based rendering (full simulation view)
  const visualFieldOverlayStyles = useVisualFieldOverlay(effects);

  // Get animated overlay styles (for visual aura, PPVP, etc.) (full simulation view)
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  // Check for Neo Matrix Code Vision (requires canvas-based rendering)
  const neoEffect = effects.find(e => e.id === 'neoMatrixCodeVisionComplete' && e.enabled);

  // Get appropriate video URL based on context
  const getVideoUrl = useCallback(() => {
    if (isFamousPeopleMode && personName && personCondition) {
      return getFamousPersonVideoUrl();
    }
    return YOUTUBE_EMBED_URL;
  }, [personName, personCondition, isFamousPeopleMode]);

  // Use diplopia overlay hook
  const getDiplopiaOverlay = useDiplopiaOverlay(
    inputSource,
    diplopiaSeparation,
    diplopiaDirection,
    effectProcessor,
    getVideoUrl
  );

  // CSS filter computation and effect styles
  const { computeFilterString, getEffectStyles } = useCSSFilters(
    effects,
    inputSource,
    diplopiaSeparation,
    diplopiaDirection,
    effectProcessor,
  );

  // Optimized effect state changes handling
  useEffect(() => {
    const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);
    const hasEnabledEffects = enabledEffects.length > 0;
    const shouldUpdateOverlays = changed || (hasEnabledEffects && showComparison);

    if (!shouldUpdateOverlays) return;

    if (inputSource.type === 'youtube' || inputSource.type === 'image') {
      const nonDiplopiaEffects = enabledEffects.filter(e =>
        e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
      );

      if (nonDiplopiaEffects.length > 0) {
        const targetContainer = showComparison && simulationContainerRef.current
          ? simulationContainerRef.current
          : containerRef.current;

        if (targetContainer) {
          overlayManager.current.clearOverlays();
          overlayManager.current.updateOverlays(nonDiplopiaEffects, targetContainer, showComparison);
        } else if (containerRef.current) {
          overlayManager.current.clearOverlays();
          overlayManager.current.updateOverlays(nonDiplopiaEffects, containerRef.current, showComparison);
        }
      } else {
        overlayManager.current.clearOverlays();
      }
    } else {
      overlayManager.current.clearOverlays();
    }
  }, [effects, inputSource.type, showComparison, isFamousPeopleMode, effectProcessor, overlayManager]);

  // Ensure overlays are created when container becomes available
  useEffect(() => {
    if (!showComparison) return;

    const { enabledEffects } = effectProcessor.current.updateEffects(effects);
    const nonDiplopiaEffects = enabledEffects.filter(e =>
      e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
    );

    if (nonDiplopiaEffects.length > 0 && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      const checkAndCreateOverlays = () => {
        const targetContainer = simulationContainerRef.current || containerRef.current;
        if (targetContainer) {
          overlayManager.current.clearOverlays();
          overlayManager.current.updateOverlays(nonDiplopiaEffects, targetContainer, showComparison);
          return true;
        }
        return false;
      };

      if (!checkAndCreateOverlays()) {
        const timeoutId = setTimeout(() => {
          checkAndCreateOverlays();
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [showComparison, effects, inputSource.type, effectProcessor, overlayManager]);

  const visualizerDescription = useMemo(() => generateEffectsDescription(effects, inputSource), [effects, inputSource]);

  const handleToggleComparison = onToggleComparison || (() => setShowComparison(prev => !prev));

  // Render comparison view
  if (showComparison) {
    return (
      <ComparisonView
        effects={effects}
        inputSource={inputSource}
        getVideoUrl={getVideoUrl}
        getEffectStyles={getEffectStyles}
        getDiplopiaOverlay={getDiplopiaOverlay}
        onToggleComparison={handleToggleComparison}
        simulationContainerRef={simulationContainerRef}
      />
    );
  }

  return (
    <Box ref={visualizerRef} className="visualizer-container" sx={{
      position: 'relative',
      width: '100%',
      height: { xs: 'auto', md: '600px' },
      '@keyframes visualSnowAnimation': {
        '0%': { backgroundPosition: '0% 0%', opacity: 1 },
        '25%': { backgroundPosition: '100% 0%', opacity: 1.05 },
        '50%': { backgroundPosition: '100% 100%', opacity: 1 },
        '75%': { backgroundPosition: '0% 100%', opacity: 0.95 },
        '100%': { backgroundPosition: '0% 0%', opacity: 1 }
      }
    }}>
      {isLoading && (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          role="status"
          aria-label="Loading visualization"
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>{t('visualizer.loading', 'Loading visualization...')}</Typography>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          aria-live="assertive"
          action={
            inputSource.type === 'webcam' && (
              <Button color="inherit" size="small" onClick={handleRetryCamera} disabled={isLoading}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}

      <div
        ref={containerRef}
        role="img"
        aria-label={visualizerDescription}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: inputSource.type === 'webcam' ? 'block' : 'none'
        }}
      >
        {inputSource.type === 'webcam' && (
          <video ref={mediaRef as React.RefObject<HTMLVideoElement>} style={{ display: 'none' }} />
        )}
      </div>

      {inputSource.type === 'image' && inputSource.url && (
        <Box ref={imageContainerRef} sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
          {!showComparison && (
            <Box sx={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10000, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleToggleComparison}
                disabled={isLoading}
                startIcon={<CompareArrows />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1e3a8a',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(30,58,138,0.4)',
                  }
                }}
              >
                Compare
              </Button>
            </Box>
          )}

          {/* Floating action buttons - top right */}
          <Box sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10000, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="medium"
              onClick={handleSaveScreenshot}
              disabled={isSaving || isLoading}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Download />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#1e3a8a',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2,
                py: 0.75,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 12px rgba(30,58,138,0.4)',
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handleFullscreen}
              startIcon={<Fullscreen />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#1e3a8a',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2,
                py: 0.75,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 12px rgba(30,58,138,0.4)',
                }
              }}
            >
              Fullscreen
            </Button>
          </Box>

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              filter: computeFilterString() || 'none'
            }}>
              <ColorVisionFilterSVG effects={effects} />
              <img
                src={inputSource.url}
                alt="Uploaded content for visualization"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              {visualFieldOverlayStyles.map((style, i) => (
                <div key={i} style={style} aria-hidden="true" />
              ))}
              {animatedOverlayStyle && (
                <div style={{ ...animatedOverlayStyle, zIndex: 10000 }} aria-hidden="true" />
              )}
              {neoEffect && (
                <NeoMatrixCodeVision intensity={neoEffect.intensity} />
              )}
            </div>
          </div>
          {getDiplopiaOverlay()}
        </Box>
      )}

      {inputSource.type === 'youtube' && (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {effects.some(e => e.id === 'completeBlindness' && e.enabled) && (
            <Box sx={{
              position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '8px 16px',
              borderRadius: '4px', fontSize: '14px', textAlign: 'center', maxWidth: '90%'
            }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                Audio is playing - The complete blackness you see is the correct visualization of complete blindness
              </Typography>
            </Box>
          )}

          {!showComparison && (
            <Box sx={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10000 }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleToggleComparison}
                disabled={isLoading}
                startIcon={<CompareArrows />}
                data-tour-step="compare"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1e3a8a',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  animation: 'pulse-compare 2s ease-in-out 3',
                  '@keyframes pulse-compare': {
                    '0%, 100%': { boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
                    '50%': { boxShadow: '0 2px 16px rgba(30,58,138,0.5)' },
                  },
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(30,58,138,0.4)',
                  }
                }}
              >
                Compare
              </Button>
            </Box>
          )}

          {/* Outer container for centering */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Aspect ratio wrapper - constrains content to 16:9 video area */}
            <div className="aspect-ratio-16-9" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              filter: computeFilterString() || 'none'
            }}>
              {/* Inline SVG filter for mobile WebKit compatibility */}
              <ColorVisionFilterSVG effects={effects} />
              <YouTubeEmbed
                src={YOUTUBE_EMBED_URL}
                title="YouTube video player"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
              {/* React-based visual field overlays for reliable rendering */}
              {visualFieldOverlayStyles.map((style, i) => (
                <div key={i} style={style} aria-hidden="true" />
              ))}
              {/* Animated overlay for visual aura, PPVP, and other animated effects */}
              {/* Visual disturbances render above visual field loss overlays */}
              {animatedOverlayStyle && (
                <div style={{ ...animatedOverlayStyle, zIndex: 10000 }} aria-hidden="true" />
              )}
              {/* Neo Matrix Code Vision canvas overlay */}
              {neoEffect && (
                <NeoMatrixCodeVision intensity={neoEffect.intensity} />
              )}
            </div>
          </div>
          {getDiplopiaOverlay()}
        </Box>
      )}

      {/* Save button and description */}
      <Box
        className="visualizer-description"
        sx={{
          mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#f9f9f9'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Visualization Description</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showComparison && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleToggleComparison}
                disabled={isLoading}
              >
                Show Comparison
              </Button>
            )}
            {showComparison && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleToggleComparison}
                disabled={isLoading}
              >
                Back to Full Simulation
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Download />}
              onClick={handleSaveScreenshot}
              disabled={isSaving || isLoading}
              className="save-button"
              data-tour-step="save"
              sx={{ minWidth: 140 }}
              title="Save your vision simulation result (Ctrl+S or Cmd+S)"
            >
              {isSaving ? 'Saving...' : 'Save Result'}
            </Button>
          </Box>
        </Box>
        <Typography>{visualizerDescription}</Typography>
      </Box>

      <Snackbar
        open={!!saveMessage}
        autoHideDuration={4000}
        onClose={clearSaveMessage}
        message={saveMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Visualizer;
