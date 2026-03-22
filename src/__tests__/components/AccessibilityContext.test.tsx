import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AccessibilityProvider,
  useAccessibility,
  ThemeMode,
} from '../../contexts/AccessibilityContext';

// Helper component to test the context
const TestConsumer: React.FC<{ onContext?: (ctx: ReturnType<typeof useAccessibility>) => void }> = ({
  onContext,
}) => {
  const ctx = useAccessibility();
  React.useEffect(() => {
    onContext?.(ctx);
  });
  return (
    <div>
      <span data-testid="theme">{ctx.preferences.themeMode}</span>
      <span data-testid="highContrast">{String(ctx.preferences.highContrast)}</span>
      <span data-testid="largeText">{String(ctx.preferences.largeText)}</span>
      <span data-testid="reducedMotion">{String(ctx.preferences.reducedMotion)}</span>
      <button data-testid="toggleHC" onClick={ctx.toggleHighContrast}>Toggle HC</button>
      <button data-testid="toggleLT" onClick={ctx.toggleLargeText}>Toggle LT</button>
      <button data-testid="toggleRM" onClick={ctx.toggleReducedMotion}>Toggle RM</button>
      <button data-testid="cycleTheme" onClick={ctx.cycleThemeMode}>Cycle Theme</button>
      <button data-testid="setDark" onClick={() => ctx.setThemeMode('dark')}>Set Dark</button>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
});

describe('AccessibilityContext', () => {
  test('throws error when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAccessibility must be used within an AccessibilityProvider');
    spy.mockRestore();
  });

  test('provides default preferences', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    expect(getByTestId('theme').textContent).toBe('dim');
    expect(getByTestId('highContrast').textContent).toBe('false');
    expect(getByTestId('largeText').textContent).toBe('false');
    expect(getByTestId('reducedMotion').textContent).toBe('false');
  });

  test('toggleHighContrast toggles the value', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    expect(getByTestId('highContrast').textContent).toBe('false');
    act(() => {
      getByTestId('toggleHC').click();
    });
    expect(getByTestId('highContrast').textContent).toBe('true');
  });

  test('toggleLargeText toggles the value', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    act(() => {
      getByTestId('toggleLT').click();
    });
    expect(getByTestId('largeText').textContent).toBe('true');
  });

  test('cycleThemeMode cycles light -> dim -> dark -> light', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    // Default is dim
    expect(getByTestId('theme').textContent).toBe('dim');
    act(() => {
      getByTestId('cycleTheme').click();
    });
    expect(getByTestId('theme').textContent).toBe('dark');
    act(() => {
      getByTestId('cycleTheme').click();
    });
    expect(getByTestId('theme').textContent).toBe('light');
    act(() => {
      getByTestId('cycleTheme').click();
    });
    expect(getByTestId('theme').textContent).toBe('dim');
  });

  test('setThemeMode sets the specified mode', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    act(() => {
      getByTestId('setDark').click();
    });
    expect(getByTestId('theme').textContent).toBe('dark');
  });

  test('applies CSS classes to document.documentElement', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    // Default dim mode
    expect(document.documentElement.classList.contains('dim-mode')).toBe(true);

    // Toggle high contrast
    act(() => {
      getByTestId('toggleHC').click();
    });
    expect(document.documentElement.classList.contains('high-contrast-mode')).toBe(true);

    // Set dark mode
    act(() => {
      getByTestId('setDark').click();
    });
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(document.documentElement.classList.contains('dim-mode')).toBe(false);
  });

  test('persists preferences to localStorage', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    act(() => {
      getByTestId('toggleHC').click();
    });
    const saved = JSON.parse(localStorage.getItem('accessibility-preferences') || '{}');
    expect(saved.highContrast).toBe(true);
  });

  test('loads preferences from localStorage', () => {
    localStorage.setItem(
      'accessibility-preferences',
      JSON.stringify({
        highContrast: true,
        largeText: true,
        increasedSpacing: false,
        enhancedFocus: false,
        reducedMotion: false,
        themeMode: 'dark',
      })
    );
    // Mark migration as done so it doesn't interfere
    localStorage.setItem('theme-migrated-v1', '1');

    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    expect(getByTestId('highContrast').textContent).toBe('true');
    expect(getByTestId('largeText').textContent).toBe('true');
    expect(getByTestId('theme').textContent).toBe('dark');
  });

  test('migrates light theme to dim on first load', () => {
    localStorage.setItem(
      'accessibility-preferences',
      JSON.stringify({ themeMode: 'light' })
    );
    // No migration flag set

    const { getByTestId } = render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );
    expect(getByTestId('theme').textContent).toBe('dim');
    expect(localStorage.getItem('theme-migrated-v1')).toBe('1');
  });
});
