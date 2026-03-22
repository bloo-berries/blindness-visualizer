/**
 * Shared application constants
 * Centralized to avoid duplication across files
 */

/**
 * YouTube demo video IDs used throughout the application
 * Different videos for different contexts to provide more appropriate content
 */
export const DEMO_VIDEO_ID = '6BPuGeS6O4w'; // Default demo video
const FAMOUS_PEOPLE_VIDEO_ID = '6BPuGeS6O4w'; // Same video for now, but can be customized per person

/**
 * YouTube embed URL query parameters optimized for fast loading:
 * - autoplay=1&mute=1: auto-start muted (required for autoplay)
 * - controls=0: hide player controls (overlays cover them anyway)
 * - enablejsapi=1: allow JS control
 * - rel=0: don't load related videos (reduces network requests)
 * - modestbranding=1: minimal YouTube branding
 * - playsinline=1: inline playback on mobile (avoids fullscreen)
 * - disablekb=1: disable keyboard controls (not needed)
 * - iv_load_policy=3: disable annotations
 * - vq=hd1080: request 1080p quality to avoid blurry playback
 */
const YOUTUBE_PARAMS = 'autoplay=1&mute=1&controls=0&enablejsapi=1&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&vq=hd1080';

export const YOUTUBE_EMBED_URL = `https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?${YOUTUBE_PARAMS}`;

/**
 * Get contextually appropriate video URL for famous people
 * @param personId - The ID of the famous person
 * @returns YouTube embed URL with appropriate video
 */
export const getFamousPersonVideoUrl = (personId?: string): string => {
  const videoId = FAMOUS_PEOPLE_VIDEO_ID;
  return `https://www.youtube-nocookie.com/embed/${videoId}?${YOUTUBE_PARAMS}`;
};

/**
 * YouTube iframe properties
 * loading="eager" ensures iframes load immediately for better sync
 */
export const YOUTUBE_IFRAME_PROPS = {
  width: "100%",
  height: "100%",
  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  frameBorder: "0",
  loading: "eager" as const,
  allowFullScreen: true,
  style: { width: "100%", height: "100%", border: "none" }
} as const;

/**
 * Common container selectors for overlay placement
 */
export const CONTAINER_SELECTORS = [
  '.visualizer-container',
  '[class*="visualizer"]',
  'iframe[src*="youtube"]',
  'canvas',
  '[style*="position: relative"]'
] as const;
