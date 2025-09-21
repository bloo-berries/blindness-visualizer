/**
 * Shared application constants
 * Centralized to avoid duplication across files
 */

/**
 * YouTube demo video ID used throughout the application
 */
export const DEMO_VIDEO_ID = 'KOc146R8sws';

/**
 * YouTube embed URL template
 */
export const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${DEMO_VIDEO_ID}?si=0pCMD96TZDgBDRCM&autoplay=1&controls=0&enablejsapi=1`;

/**
 * YouTube iframe properties
 */
export const YOUTUBE_IFRAME_PROPS = {
  width: "100%",
  height: "100%",
  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  frameBorder: "0",
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
