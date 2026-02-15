import React, { useCallback } from 'react';
import { InputSource } from '../../types/visualEffects';
import { YOUTUBE_IFRAME_PROPS } from '../../utils/appConstants';
import { EffectProcessor } from '../../utils/performance';

interface DiplopiaOverlayProps {
  inputSource: InputSource;
  diplopiaSeparation: number;
  diplopiaDirection: number;
  effectProcessor: React.RefObject<EffectProcessor>;
  getVideoUrl: () => string;
}

/**
 * Component to render diplopia (double vision) overlay effect
 */
const DiplopiaOverlay: React.FC<DiplopiaOverlayProps> = ({
  inputSource,
  diplopiaSeparation,
  diplopiaDirection,
  effectProcessor,
  getVideoUrl
}) => {
  const getDiplopiaOverlay = useCallback(() => {
    if (inputSource.type !== 'youtube') return null;

    // Use optimized effect processor for faster lookups
    const diplopiaMonocular = effectProcessor.current.getEffect('diplopiaMonocular');
    const diplopiaBinocular = effectProcessor.current.getEffect('diplopiaBinocular');

    // Only create diplopia overlay if one of the diplopia conditions is actually enabled
    const diplopia = diplopiaMonocular?.enabled ? diplopiaMonocular :
      diplopiaBinocular?.enabled ? diplopiaBinocular : null;

    if (!diplopia) return null;

    // Calculate offset based on direction
    const baseOffset = diplopia.intensity * (diplopiaMonocular?.enabled ? 15 : 20);
    const totalOffset = baseOffset * diplopiaSeparation;
    const [offsetX, offsetY] = diplopiaDirection < 0.33
      ? [totalOffset, 0]
      : diplopiaDirection < 0.66
        ? [0, totalOffset * 0.5]
        : [totalOffset * 0.7, totalOffset * 0.35];

    const iframeProps: React.IframeHTMLAttributes<HTMLIFrameElement> = {
      ...YOUTUBE_IFRAME_PROPS,
      src: getVideoUrl(),
      title: `YouTube video player (${diplopiaMonocular?.enabled ? 'ghost' : 'second image'}) - ${Math.random().toString(36).substr(2, 9)}`,
      style: { ...YOUTUBE_IFRAME_PROPS.style, pointerEvents: "none" }
    };

    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
        width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1001,
        opacity: diplopiaMonocular?.enabled ? 0.3 + diplopia.intensity * 0.2 : 0.5,
        filter: diplopiaMonocular?.enabled ? 'blur(2px)' : undefined,
        mixBlendMode: diplopiaMonocular?.enabled ? 'multiply' : undefined
      }}>
        <iframe {...iframeProps} title="Vision Simulator" />
      </div>
    );
  }, [inputSource.type, diplopiaSeparation, diplopiaDirection, getVideoUrl, effectProcessor]);

  return <>{getDiplopiaOverlay()}</>;
};

export default DiplopiaOverlay;

// Also export the hook for direct use
export const useDiplopiaOverlay = (
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  effectProcessor: React.RefObject<EffectProcessor>,
  getVideoUrl: () => string
): (() => React.ReactNode) => {
  return useCallback(() => {
    if (inputSource.type !== 'youtube') return null;

    const diplopiaMonocular = effectProcessor.current.getEffect('diplopiaMonocular');
    const diplopiaBinocular = effectProcessor.current.getEffect('diplopiaBinocular');

    const diplopia = diplopiaMonocular?.enabled ? diplopiaMonocular :
      diplopiaBinocular?.enabled ? diplopiaBinocular : null;

    if (!diplopia) return null;

    const baseOffset = diplopia.intensity * (diplopiaMonocular?.enabled ? 15 : 20);
    const totalOffset = baseOffset * diplopiaSeparation;
    const [offsetX, offsetY] = diplopiaDirection < 0.33
      ? [totalOffset, 0]
      : diplopiaDirection < 0.66
        ? [0, totalOffset * 0.5]
        : [totalOffset * 0.7, totalOffset * 0.35];

    const iframeProps: React.IframeHTMLAttributes<HTMLIFrameElement> = {
      ...YOUTUBE_IFRAME_PROPS,
      src: getVideoUrl(),
      title: `YouTube video player (${diplopiaMonocular?.enabled ? 'ghost' : 'second image'}) - ${Math.random().toString(36).substr(2, 9)}`,
      style: { ...YOUTUBE_IFRAME_PROPS.style, pointerEvents: "none" }
    };

    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
        width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1001,
        opacity: diplopiaMonocular?.enabled ? 0.3 + diplopia.intensity * 0.2 : 0.5,
        filter: diplopiaMonocular?.enabled ? 'blur(2px)' : undefined,
        mixBlendMode: diplopiaMonocular?.enabled ? 'multiply' : undefined
      }}>
        <iframe {...iframeProps} title="Vision Simulator" />
      </div>
    );
  }, [inputSource.type, diplopiaSeparation, diplopiaDirection, getVideoUrl, effectProcessor]);
};
