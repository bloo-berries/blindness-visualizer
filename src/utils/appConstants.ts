/**
 * Shared application constants
 * Centralized to avoid duplication across files
 */

/**
 * YouTube demo video IDs used throughout the application
 * Different videos for different contexts to provide more appropriate content
 */
export const DEMO_VIDEO_ID = '6BPuGeS6O4w'; // Default demo video
export const FAMOUS_PEOPLE_VIDEO_ID = '6BPuGeS6O4w'; // Same video for now, but can be customized per person

/**
 * YouTube embed URL template
 */
export const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${DEMO_VIDEO_ID}?si=0pCMD96TZDgBDRCM&autoplay=1&mute=1&controls=0&enablejsapi=1`;

/**
 * Get contextually appropriate video URL for famous people
 * @param personId - The ID of the famous person
 * @returns YouTube embed URL with appropriate video
 */
export const getFamousPersonVideoUrl = (personId?: string): string => {
  // For now, use the same demo video for all famous people
  // In the future, this could be customized per person with specific videos
  const videoId = FAMOUS_PEOPLE_VIDEO_ID;
  return `https://www.youtube.com/embed/${videoId}?si=0pCMD96TZDgBDRCM&autoplay=1&mute=1&controls=0&enablejsapi=1`;
};

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
