/**
 * Tests for useScreenshot hook.
 *
 * The hook provides screenshot capture, saving state, messages,
 * and a Ctrl/Cmd+S keyboard shortcut.
 */

import { renderHook, act } from '@testing-library/react';
import { useScreenshot } from '../../components/Visualizer/hooks/useScreenshot';
import { VisualEffect, InputSource } from '../../types/visualEffects';

// Mock screenshotCapture utility
const mockSaveVisionSimulation = jest.fn();

jest.mock('../../utils/screenshotCapture', () => ({
  saveVisionSimulation: (...args: unknown[]) => mockSaveVisionSimulation(...args),
}));

function makeEffect(
  id: string,
  enabled: boolean,
  intensity: number
): VisualEffect {
  return {
    id: id as VisualEffect['id'],
    name: id,
    enabled,
    intensity,
    description: `Test ${id}`,
  };
}

function createContainerRef(element: HTMLDivElement | null = null): React.RefObject<HTMLDivElement> {
  return { current: element } as React.RefObject<HTMLDivElement>;
}

describe('useScreenshot', () => {
  const defaultEffects: VisualEffect[] = [makeEffect('cataracts', true, 0.5)];
  const defaultSource: InputSource = { type: 'youtube' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveVisionSimulation.mockReset();
  });

  describe('initial state', () => {
    test('isSaving is false initially', () => {
      const container = document.createElement('div');
      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );
      expect(result.current.isSaving).toBe(false);
    });

    test('saveMessage is null initially', () => {
      const container = document.createElement('div');
      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );
      expect(result.current.saveMessage).toBeNull();
    });

    test('handleSaveScreenshot is a function', () => {
      const container = document.createElement('div');
      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );
      expect(typeof result.current.handleSaveScreenshot).toBe('function');
    });

    test('clearSaveMessage is a function', () => {
      const container = document.createElement('div');
      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );
      expect(typeof result.current.clearSaveMessage).toBe('function');
    });
  });

  describe('handleSaveScreenshot', () => {
    test('sets error message when container ref is null', async () => {
      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(null), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        await result.current.handleSaveScreenshot();
      });

      expect(result.current.saveMessage).toBe('Error: Could not find visualizer container');
      expect(result.current.isSaving).toBe(false);
    });

    test('calls saveVisionSimulation with correct params on success', async () => {
      mockSaveVisionSimulation.mockResolvedValueOnce(undefined);
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 5, 45, false)
      );

      await act(async () => {
        await result.current.handleSaveScreenshot();
      });

      expect(mockSaveVisionSimulation).toHaveBeenCalledWith(
        container,
        defaultEffects,
        'youtube',
        5,
        45
      );
      expect(result.current.saveMessage).toBe('Screenshot saved successfully!');
      expect(result.current.isSaving).toBe(false);
    });

    test('sets error message on save failure', async () => {
      mockSaveVisionSimulation.mockRejectedValueOnce(new Error('Canvas tainted'));
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        await result.current.handleSaveScreenshot();
      });

      expect(result.current.saveMessage).toBe('Canvas tainted');
      expect(result.current.isSaving).toBe(false);
    });

    test('sets generic error message for non-Error thrown values', async () => {
      mockSaveVisionSimulation.mockRejectedValueOnce('some string error');
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        await result.current.handleSaveScreenshot();
      });

      expect(result.current.saveMessage).toBe('Failed to save screenshot');
    });
  });

  describe('clearSaveMessage', () => {
    test('clears the save message', async () => {
      mockSaveVisionSimulation.mockResolvedValueOnce(undefined);
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        await result.current.handleSaveScreenshot();
      });

      expect(result.current.saveMessage).not.toBeNull();

      act(() => {
        result.current.clearSaveMessage();
      });

      expect(result.current.saveMessage).toBeNull();
    });
  });

  describe('keyboard shortcut', () => {
    test('registers keydown listener on mount', () => {
      const addEventSpy = jest.spyOn(document, 'addEventListener');
      const container = document.createElement('div');

      renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      expect(addEventSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      addEventSpy.mockRestore();
    });

    test('removes keydown listener on unmount', () => {
      const removeEventSpy = jest.spyOn(document, 'removeEventListener');
      const container = document.createElement('div');

      const { unmount } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      unmount();

      expect(removeEventSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeEventSpy.mockRestore();
    });

    test('Ctrl+S triggers screenshot save', async () => {
      mockSaveVisionSimulation.mockResolvedValueOnce(undefined);
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        const event = new KeyboardEvent('keydown', {
          key: 's',
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
        // Wait for the async handleSaveScreenshot to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockSaveVisionSimulation).toHaveBeenCalled();
    });

    test('Cmd+S triggers screenshot save on macOS', async () => {
      mockSaveVisionSimulation.mockResolvedValueOnce(undefined);
      const container = document.createElement('div');

      const { result } = renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        const event = new KeyboardEvent('keydown', {
          key: 's',
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockSaveVisionSimulation).toHaveBeenCalled();
    });

    test('does not trigger save when isLoading is true', async () => {
      const container = document.createElement('div');

      renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, true)
      );

      await act(async () => {
        const event = new KeyboardEvent('keydown', {
          key: 's',
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockSaveVisionSimulation).not.toHaveBeenCalled();
    });

    test('plain S key without modifier does not trigger save', async () => {
      const container = document.createElement('div');

      renderHook(() =>
        useScreenshot(createContainerRef(container), defaultEffects, defaultSource, 0, 0, false)
      );

      await act(async () => {
        const event = new KeyboardEvent('keydown', {
          key: 's',
          bubbles: true,
        });
        document.dispatchEvent(event);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockSaveVisionSimulation).not.toHaveBeenCalled();
    });
  });
});
