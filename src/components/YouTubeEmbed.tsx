import React, { useRef, useEffect, memo } from 'react';
import { YOUTUBE_IFRAME_PROPS } from '../utils/appConstants';

interface YouTubeEmbedProps {
  src: string;
  title: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  'aria-label'?: string;
}

/**
 * YouTube embed wrapper that requests HD quality via the IFrame API.
 * Uses postMessage to communicate with the YouTube player since
 * enablejsapi=1 is already set in our embed URLs.
 */
const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  src,
  title,
  style,
  tabIndex,
  'aria-label': ariaLabel,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const sendQualityCommand = () => {
      try {
        iframe.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: 'setPlaybackQuality',
          args: ['hd1080']
        }), '*');
      } catch {
        // Cross-origin errors are expected in some environments
      }
    };

    // Listen for YouTube player ready/state messages from our iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      // Only respond to messages from our specific iframe
      if (event.source !== iframe.contentWindow) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // Request HD quality when player signals readiness or state changes
        if (data.event === 'onReady' || data.event === 'initialDelivery' || data.info) {
          sendQualityCommand();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);

    // Also set quality after iframe loads and after delays for reliability
    const handleLoad = () => {
      sendQualityCommand();
      // YouTube's adaptive algorithm may need time to accept quality requests
      setTimeout(sendQualityCommand, 1000);
      setTimeout(sendQualityCommand, 3000);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.removeEventListener('load', handleLoad);
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      {...YOUTUBE_IFRAME_PROPS}
      src={src}
      title={title}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      style={style || {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
};

export default memo(YouTubeEmbed);
