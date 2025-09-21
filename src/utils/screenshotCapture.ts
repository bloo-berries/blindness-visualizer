/**
 * Screenshot capture utility for saving vision simulation results
 * Handles different content types (YouTube, images, webcam) and includes metadata
 */

import { VisualEffect } from '../types/visualEffects';
import html2canvas from 'html2canvas';
import type { Options } from 'html2canvas';

export interface ScreenshotMetadata {
  timestamp: string;
  effects: VisualEffect[];
  inputSource: string;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  description: string;
}

/**
 * Captures a screenshot of the visualizer with all effects applied
 * @param container - The visualizer container element
 * @param metadata - Metadata about the simulation
 * @returns Promise that resolves to the screenshot data URL
 */
export const captureVisualizerScreenshot = async (
  container: HTMLElement,
  metadata: ScreenshotMetadata
): Promise<string> => {
  try {
    // Find the main visualizer content area
    const visualizerContent = container.querySelector('.visualizer-container') || 
                             container.querySelector('[class*="visualizer"]') ||
                             container;

    if (!visualizerContent) {
      throw new Error('Could not find visualizer content to capture');
    }

    // Use html2canvas for comprehensive screenshot capture
    const canvas = await html2canvas(visualizerContent as HTMLElement, {
      backgroundColor: null,
      scale: 2, // Higher resolution for better quality
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false,
      width: visualizerContent.clientWidth,
      height: visualizerContent.clientHeight,
      // Include all overlays and effects
      ignoreElements: (element: Element) => {
        // Don't capture UI elements that shouldn't be in the screenshot
        return element.classList.contains('control-panel') ||
               element.classList.contains('navigation-bar') ||
               element.classList.contains('footer') ||
               element.classList.contains('stepper') ||
               element.classList.contains('back-button') ||
               element.classList.contains('finish-button') ||
               element.classList.contains('save-button') ||
               element.classList.contains('visualizer-description');
      },
      // Ensure all visual effects are captured
      onclone: (clonedDoc: Document) => {
        // Make sure all overlays are visible in the cloned document
        const overlays = clonedDoc.querySelectorAll('[id^="visual-field-overlay-"]');
        overlays.forEach((overlay: Element) => {
          if (overlay instanceof HTMLElement) {
            overlay.style.display = 'block';
            overlay.style.visibility = 'visible';
          }
        });
      }
    } as Partial<Options>);

    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    throw new Error('Failed to capture screenshot. Please try again.');
  }
};

/**
 * Creates a downloadable file with the screenshot and metadata
 * @param screenshotDataUrl - The screenshot data URL
 * @param metadata - Metadata about the simulation
 * @returns Promise that resolves to the file blob ready for download
 */
export const createDownloadableFile = async (
  screenshotDataUrl: string,
  metadata: ScreenshotMetadata
): Promise<Blob> => {
  // Create a canvas to combine screenshot with metadata overlay
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Load the screenshot image
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match screenshot
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the screenshot
      ctx.drawImage(img, 0, 0);
      
      // Add metadata overlay at the bottom
      const overlayHeight = 120;
      const overlayY = canvas.height - overlayHeight;
      
      // Semi-transparent background for metadata
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, overlayY, canvas.width, overlayHeight);
      
      // White text for metadata
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'left';
      
      // Add metadata text
      const enabledEffects = metadata.effects.filter(e => e.enabled);
      const effectsText = enabledEffects.length > 0 
        ? enabledEffects.map(e => e.name).join(', ')
        : 'No effects applied';
      
      const lines = [
        `Vision Simulation - ${metadata.timestamp}`,
        `Effects: ${effectsText}`,
        `Input: ${metadata.inputSource}`,
        `Description: ${metadata.description}`
      ];
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 20, overlayY + 25 + (index * 20));
      });
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png', 1.0);
    };
    
    img.onerror = () => reject(new Error('Failed to load screenshot image'));
    img.src = screenshotDataUrl;
  });
};

/**
 * Downloads the screenshot file to the user's device
 * @param blob - The file blob to download
 * @param filename - The filename for the download
 */
export const downloadScreenshot = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates a filename for the screenshot based on metadata
 * @param metadata - Metadata about the simulation
 * @returns A sanitized filename
 */
export const generateFilename = (metadata: ScreenshotMetadata): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const enabledEffects = metadata.effects.filter(e => e.enabled);
  const effectsSuffix = enabledEffects.length > 0 
    ? `_${enabledEffects.map(e => e.id).join('-')}`
    : '_no-effects';
  
  return `vision-simulation_${timestamp}${effectsSuffix}.png`;
};

/**
 * Main function to capture and download the vision simulation
 * @param container - The visualizer container element
 * @param effects - Array of visual effects
 * @param inputSource - The input source type
 * @param diplopiaSeparation - Diplopia separation value
 * @param diplopiaDirection - Diplopia direction value
 */
export const saveVisionSimulation = async (
  container: HTMLElement,
  effects: VisualEffect[],
  inputSource: string,
  diplopiaSeparation: number = 1.0,
  diplopiaDirection: number = 0.0
): Promise<void> => {
  try {
    // Create metadata
    const metadata: ScreenshotMetadata = {
      timestamp: new Date().toLocaleString(),
      effects,
      inputSource,
      diplopiaSeparation,
      diplopiaDirection,
      description: generateEffectsDescription(effects)
    };

    // Capture screenshot
    const screenshotDataUrl = await captureVisualizerScreenshot(container, metadata);
    
    // Create downloadable file
    const blob = await createDownloadableFile(screenshotDataUrl, metadata);
    
    // Generate filename and download
    const filename = generateFilename(metadata);
    downloadScreenshot(blob, filename);
    
    console.log('Vision simulation saved successfully:', filename);
  } catch (error) {
    console.error('Failed to save vision simulation:', error);
    throw error;
  }
};

/**
 * Helper function to generate effects description
 * @param effects - Array of visual effects
 * @returns Description string
 */
const generateEffectsDescription = (effects: VisualEffect[]): string => {
  const enabledEffects = effects.filter(e => e.enabled);
  if (enabledEffects.length === 0) {
    return 'Normal vision (no effects applied)';
  }
  
  return enabledEffects.map(e => `${e.name} (${Math.round(e.intensity * 100)}%)`).join(', ');
};
