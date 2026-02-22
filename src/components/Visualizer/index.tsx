import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { Download } from '@mui/icons-material';
import { generateEffectsDescription } from '../../utils/effectsDescription';
import { createSceneManager } from '../../utils/threeSceneManager';
import { createVisualizationMesh, updateShaderUniforms } from '../../utils/shaders';
import { generateCSSFilters } from '../../utils/cssFilters';
import { updateSVGFilters } from '../../utils/svgFilterManager';
import { getColorVisionFilter } from '../../utils/colorVisionFilters';
import { YOUTUBE_EMBED_URL, YOUTUBE_IFRAME_PROPS, getFamousPersonVideoUrl } from '../../utils/appConstants';
import { PerformanceOptimizer, EffectProcessor, OverlayManager, AnimationManager } from '../../utils/performance';
import { useScreenshot, useAnimatedOverlay, useVisualFieldOverlay, ANIMATED_EFFECTS } from './hooks';
import { useAnimationTicker } from '../../hooks';
import ComparisonView from './ComparisonView';
import { useDiplopiaOverlay } from './DiplopiaOverlay';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationContainerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showComparison, setShowComparison] = useState(propShowComparison || false);

  // Update local showComparison state when prop changes
  useEffect(() => {
    if (propShowComparison !== undefined) {
      setShowComparison(propShowComparison);
    } else if (isFamousPeopleMode && personName && personCondition) {
      setShowComparison(true);
    }
  }, [personName, personCondition, propShowComparison, isFamousPeopleMode]);

  // Update SVG filters when effects change
  useEffect(() => {
    updateSVGFilters(effects);
  }, [effects]);

  // Performance optimization instances
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const effectProcessor = useRef(new EffectProcessor());
  const overlayManager = useRef(new OverlayManager());
  const animationManager = useRef(AnimationManager.getInstance());

  // Use screenshot hook
  const { isSaving, saveMessage, handleSaveScreenshot, clearSaveMessage } = useScreenshot(
    containerRef,
    effects,
    inputSource,
    diplopiaSeparation,
    diplopiaDirection,
    isLoading
  );

  // Check if any enabled effect needs animation
  const needsAnimatedOverlay = effects.some(e => ANIMATED_EFFECTS.includes(e.id) && e.enabled);

  // Animation ticker for animated effects (used in full simulation view)
  const now = useAnimationTicker(needsAnimatedOverlay && !showComparison);

  // Get visual field overlay styles for React-based rendering (full simulation view)
  const visualFieldOverlayStyle = useVisualFieldOverlay(effects);

  // Get animated overlay styles (for visual aura, PPVP, etc.) (full simulation view)
  const animatedOverlayStyle = useAnimatedOverlay(effects, now);

  // Retry camera access
  const handleRetryCamera = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  }, []);

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

  // Main scene setup effect
  useEffect(() => {
    if (!containerRef.current) return;

    if (showComparison) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const sceneManager = createSceneManager(containerRef.current);
    const { scene, camera, renderer, dispose } = sceneManager;

    const currentAnimationManager = animationManager.current;
    const currentOverlayManager = overlayManager.current;

    const enabledEffectsCount = effects.filter(e => e.enabled).length;
    const needsAnimation = effects.some(e =>
      (e.id === 'scotoma' || e.id === 'visualFloaters' || e.id === 'retinitisPigmentosa' || e.id === 'vitreousHemorrhage') && e.enabled
    );

    const updateOverlays = () => {
      const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);

      if (changed && containerRef.current) {
        overlayManager.current.updateOverlays(enabledEffects, containerRef.current);
      }

      overlayManager.current.updateAnimatedOverlays(enabledEffects);
    };

    if (needsAnimation && (inputSource.type === 'youtube' || inputSource.type === 'image')) {
      animationManager.current.addCallback(updateOverlays);
    }

    // Handle different input sources
    const setupMedia = async () => {
      try {
        if (inputSource.type === 'webcam') {
          setError('Camera feature is currently disabled. This is a premium feature coming soon.');
          setIsLoading(false);
          return;

        } else if (inputSource.type === 'image' && inputSource.url) {
          const textureLoader = new THREE.TextureLoader();
          const imageTexture = await textureLoader.loadAsync(inputSource.url);
          setTexture(imageTexture);
          setIsLoading(false);
        } else if (inputSource.type === 'youtube') {
          setTexture(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and refresh the page.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera and try again.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera is already in use by another application. Please close other camera applications and try again.');
          } else if (err.name === 'OverconstrainedError') {
            setError('Camera constraints cannot be satisfied. Trying with basic settings...');
            try {
              const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
              streamRef.current = basicStream;
              const video = mediaRef.current as HTMLVideoElement;
              video.srcObject = basicStream;
              await video.play();
              const videoTexture = new THREE.VideoTexture(video);
              setTexture(videoTexture);
              setIsLoading(false);
              return;
            } catch {
              setError('Failed to access camera with basic settings. Please check your camera permissions.');
            }
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('Failed to load media');
        }
        setIsLoading(false);
      }
    };

    setupMedia();

    const mesh = createVisualizationMesh();
    scene.add(mesh);

    const animate = () => {
      if (showComparison) return;

      optimizer.current.monitorPerformance();

      if (mesh && texture) {
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.tDiffuse.value = texture;

        const { changed } = effectProcessor.current.updateEffects(effects);
        if (changed) {
          updateShaderUniforms(material, effects, diplopiaSeparation, diplopiaDirection);
        }

        renderer.render(scene, camera);
      }

      const frameRate = optimizer.current.getOptimalFrameRate(enabledEffectsCount);
      if (frameRate < 60) {
        setTimeout(() => requestAnimationFrame(animate), 1000 / frameRate - 16.67);
      } else {
        requestAnimationFrame(animate);
      }
    };

    if (!showComparison) {
      animate();
    }

    return () => {
      if (inputSource.type === 'webcam') return;
      currentAnimationManager.removeCallback(updateOverlays);
      currentOverlayManager.clearOverlays();
      dispose();
    };
  }, [inputSource, retryCount, diplopiaDirection, diplopiaSeparation, effects, texture, showComparison]);

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
  }, [effects, inputSource.type, showComparison, isFamousPeopleMode]);

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
  }, [showComparison, effects, inputSource.type]);

  // Optimized CSS filter calculation
  const getEffectStyles = useCallback(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain'
    };

    if (inputSource.type === 'youtube' || inputSource.type === 'image') {
      const { enabledEffects } = effectProcessor.current.updateEffects(effects);
      const nonDiplopiaEffects = enabledEffects.filter(e =>
        e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
      );

      const colorVisionEffect = enabledEffects.find(e =>
        ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
      );

      const otherEffects = nonDiplopiaEffects.filter(e =>
        !['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
      );

      const filters: string[] = [];

      if (colorVisionEffect) {
        const cssFilter = getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
        if (cssFilter) filters.push(cssFilter);
      }

      if (otherEffects.length > 0) {
        const otherFilters = generateCSSFilters(otherEffects, diplopiaSeparation, diplopiaDirection);
        if (otherFilters) filters.push(otherFilters);
      }

      return filters.length > 0 ? { ...baseStyle, filter: filters.join(' ') } : baseStyle;
    }

    return baseStyle;
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection]);

  const getVisualizerDescription = () => generateEffectsDescription(effects, inputSource);

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
    <Box className="visualizer-container" sx={{
      position: 'relative',
      width: '100%',
      height: '600px',
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
          <Typography sx={{ ml: 2 }}>Loading visualization...</Typography>
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
        aria-label={getVisualizerDescription()}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: inputSource.type === 'youtube' ? 'none' : 'block'
        }}
      >
        {inputSource.type === 'webcam' ? (
          <video ref={mediaRef as React.RefObject<HTMLVideoElement>} style={{ display: 'none' }} />
        ) : inputSource.type === 'image' ? (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            style={{ display: 'none' }}
            src={inputSource.url}
            alt="Uploaded content for visualization"
          />
        ) : null}
      </div>

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
            <Box sx={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10000 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleToggleComparison}
                disabled={isLoading}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
                }}
              >
                Back to Comparison
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
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              filter: (() => {
                const { enabledEffects } = effectProcessor.current.updateEffects(effects);
                const colorVisionEffect = enabledEffects.find(e =>
                  ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                );

                const otherEffects = enabledEffects.filter(e =>
                  !['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy'].includes(e.id)
                );

                const filters: string[] = [];

                if (colorVisionEffect) {
                  const cssFilter = getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
                  if (cssFilter) filters.push(cssFilter);
                }

                if (otherEffects.length > 0) {
                  const { enabledEffects: nonColorEffects } = effectProcessor.current.updateEffects(otherEffects);
                  const nonDiplopiaEffects = nonColorEffects.filter(e =>
                    e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
                  );

                  if (nonDiplopiaEffects.length > 0) {
                    const otherFilters = generateCSSFilters(nonDiplopiaEffects, diplopiaSeparation, diplopiaDirection);
                    if (otherFilters) filters.push(otherFilters);
                  }
                }

                return filters.length > 0 ? filters.join(' ') : 'none';
              })()
            }}>
              <iframe
                {...YOUTUBE_IFRAME_PROPS}
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
              {/* React-based visual field overlay for reliable rendering */}
              {visualFieldOverlayStyle && (
                <div style={visualFieldOverlayStyle} aria-hidden="true" />
              )}
              {/* Animated overlay for visual aura, PPVP, and other animated effects */}
              {animatedOverlayStyle && (
                <div style={animatedOverlayStyle} aria-hidden="true" />
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
              sx={{ minWidth: 140 }}
              title="Save your vision simulation result (Ctrl+S or Cmd+S)"
            >
              {isSaving ? 'Saving...' : 'Save Result'}
            </Button>
          </Box>
        </Box>
        <Typography>{getVisualizerDescription()}</Typography>
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
