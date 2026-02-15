import { useRef, useEffect, useCallback } from 'react';
import { VisualEffect, InputSource } from '../../../types/visualEffects';
import { generateCSSFilters } from '../../../utils/cssFilters';
import { getColorVisionFilter } from '../../../utils/colorVisionFilters';
import { PerformanceOptimizer, EffectProcessor, OverlayManager, AnimationManager } from '../../../utils/performance';

interface EffectProcessorResult {
  optimizer: React.RefObject<PerformanceOptimizer>;
  effectProcessor: React.RefObject<EffectProcessor>;
  overlayManager: React.RefObject<OverlayManager>;
  animationManager: React.RefObject<AnimationManager>;
  getEffectStyles: () => React.CSSProperties;
}

/**
 * Hook to manage effect processing, overlays, and animations
 */
export const useEffectProcessor = (
  effects: VisualEffect[],
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  showComparison: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
  simulationContainerRef: React.RefObject<HTMLDivElement>,
  isFamousPeopleMode: boolean
): EffectProcessorResult => {
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const effectProcessor = useRef(new EffectProcessor());
  const overlayManager = useRef(new OverlayManager());
  const animationManager = useRef(AnimationManager.getInstance());

  // Optimized effect state changes handling
  useEffect(() => {
    const { changed, enabledEffects } = effectProcessor.current.updateEffects(effects);

    // Force overlay update when transitioning to comparison view or when effects are enabled
    const hasEnabledEffects = enabledEffects.length > 0;
    const shouldUpdateOverlays = changed || (hasEnabledEffects && showComparison);

    if (!shouldUpdateOverlays) {
      return;
    }

    // Create visual field overlays for YouTube and image content
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
  }, [effects, inputSource.type, showComparison, isFamousPeopleMode, containerRef, simulationContainerRef]);

  // Additional effect to ensure overlays are created when container becomes available
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
  }, [showComparison, effects, inputSource.type, containerRef, simulationContainerRef]);

  // Optimized CSS filter calculation with caching
  const getEffectStyles = useCallback(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '100%',
      maxHeight: '100%',
      width: '100%',
      height: '100%',
      objectFit: 'contain'
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
        if (cssFilter) {
          filters.push(cssFilter);
        }
      }

      if (otherEffects.length > 0) {
        const otherFilters = generateCSSFilters(otherEffects, diplopiaSeparation, diplopiaDirection);
        if (otherFilters) {
          filters.push(otherFilters);
        }
      }

      return filters.length > 0 ? { ...baseStyle, filter: filters.join(' ') } : baseStyle;
    }

    return baseStyle;
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection]);

  return {
    optimizer,
    effectProcessor,
    overlayManager,
    animationManager,
    getEffectStyles
  };
};
