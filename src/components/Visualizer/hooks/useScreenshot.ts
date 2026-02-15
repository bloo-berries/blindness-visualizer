import { useState, useCallback, useEffect } from 'react';
import { VisualEffect, InputSource } from '../../../types/visualEffects';
import { saveVisionSimulation } from '../../../utils/screenshotCapture';

interface ScreenshotResult {
  isSaving: boolean;
  saveMessage: string | null;
  handleSaveScreenshot: () => Promise<void>;
  clearSaveMessage: () => void;
}

/**
 * Hook to manage screenshot capture functionality
 */
export const useScreenshot = (
  containerRef: React.RefObject<HTMLDivElement>,
  effects: VisualEffect[],
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  isLoading: boolean
): ScreenshotResult => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveScreenshot = useCallback(async () => {
    if (!containerRef.current) {
      setSaveMessage('Error: Could not find visualizer container');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await saveVisionSimulation(
        containerRef.current,
        effects,
        inputSource.type,
        diplopiaSeparation,
        diplopiaDirection
      );
      setSaveMessage('Screenshot saved successfully!');
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save screenshot');
    } finally {
      setIsSaving(false);
    }
  }, [effects, inputSource.type, diplopiaSeparation, diplopiaDirection, containerRef]);

  const clearSaveMessage = useCallback(() => {
    setSaveMessage(null);
  }, []);

  // Keyboard shortcut for saving (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!isSaving && !isLoading) {
          handleSaveScreenshot();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveScreenshot, isSaving, isLoading]);

  return {
    isSaving,
    saveMessage,
    handleSaveScreenshot,
    clearSaveMessage
  };
};
