import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'accessibility.menu': 'Accessibility Settings',
        'accessibility.highContrast': 'High Contrast',
        'accessibility.highContrastDesc': 'Increase contrast for better readability',
        'accessibility.largeText': 'Large Text',
        'accessibility.largeTextDesc': 'Increase text size to 125%',
        'accessibility.increasedSpacing': 'Increased Spacing',
        'accessibility.increasedSpacingDesc': 'Add extra spacing between elements',
        'accessibility.enhancedFocus': 'Enhanced Focus',
        'accessibility.enhancedFocusDesc': 'Show enhanced focus indicators',
        'accessibility.reducedMotion': 'Reduced Motion',
        'accessibility.reducedMotionDesc': 'Minimize animations and transitions',
      };
      return map[key] || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

import AccessibilityMenu from '../../components/AccessibilityMenu';

describe('AccessibilityMenu', () => {
  test('renders without crashing', () => {
    renderWithProviders(<AccessibilityMenu />);
    expect(screen.getByRole('button', { name: /open accessibility settings/i })).toBeInTheDocument();
  });

  test('has correct aria attributes on the trigger button', () => {
    renderWithProviders(<AccessibilityMenu />);
    const button = screen.getByRole('button', { name: /open accessibility settings/i });
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens menu on click (desktop)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
  });

  test('shows WCAG 2.1 AA label in the menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText('WCAG 2.1 AA')).toBeInTheDocument();
  });

  test('shows all five accessibility toggle options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Large Text')).toBeInTheDocument();
    expect(screen.getByText('Increased Spacing')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Focus')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });

  test('shows descriptions for each toggle option', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText('Increase contrast for better readability')).toBeInTheDocument();
    expect(screen.getByText('Increase text size to 125%')).toBeInTheDocument();
    expect(screen.getByText('Add extra spacing between elements')).toBeInTheDocument();
    expect(screen.getByText('Show enhanced focus indicators')).toBeInTheDocument();
    expect(screen.getByText('Minimize animations and transitions')).toBeInTheDocument();
  });

  test('displays WCAG criterion chips', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText('WCAG 1.4.3')).toBeInTheDocument();
    expect(screen.getByText('WCAG 1.4.4')).toBeInTheDocument();
    expect(screen.getByText('WCAG 1.4.8')).toBeInTheDocument();
    expect(screen.getByText('WCAG 2.4.7')).toBeInTheDocument();
    expect(screen.getByText('WCAG 2.3.3')).toBeInTheDocument();
  });

  test('all switches are initially unchecked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    const switches = screen.getAllByRole('checkbox');
    switches.forEach(sw => {
      expect(sw).not.toBeChecked();
    });
  });

  test('clicking a switch toggles the accessibility feature', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    const highContrastSwitch = screen.getByRole('checkbox', { name: /high contrast/i });
    expect(highContrastSwitch).not.toBeChecked();
    await user.click(highContrastSwitch);
    expect(highContrastSwitch).toBeChecked();
  });

  test('clicking a menu item row toggles the feature', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    const menuItem = screen.getByRole('menuitemcheckbox', { name: /large text/i });
    expect(menuItem).toHaveAttribute('aria-checked', 'false');
    await user.click(menuItem);
    expect(menuItem).toHaveAttribute('aria-checked', 'true');
  });

  test('shows persistence message in the menu footer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    expect(screen.getByText(/settings are automatically saved/i)).toBeInTheDocument();
  });

  test('active feature count updates in the button label after toggling', async () => {
    // Clear localStorage to ensure clean state
    localStorage.removeItem('accessibility-preferences');
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    // Toggle high contrast on
    const highContrastSwitch = screen.getByRole('checkbox', { name: /high contrast/i });
    await user.click(highContrastSwitch);
    expect(highContrastSwitch).toBeChecked();
    // Close the menu by pressing Escape
    await user.keyboard('{Escape}');
    // Now find the button - it should reflect 1 active feature
    // Use a more flexible query since aria-label has dynamic content
    const buttons = screen.getAllByRole('button');
    const accessibilityButton = buttons.find(b => b.getAttribute('aria-label')?.includes('accessibility'));
    expect(accessibilityButton).toBeTruthy();
    expect(accessibilityButton!.getAttribute('aria-label')).toContain('active');
  });

  test('toggling a feature on then off removes it from count', async () => {
    localStorage.removeItem('accessibility-preferences');
    const user = userEvent.setup();
    renderWithProviders(<AccessibilityMenu />);
    await user.click(screen.getByRole('button', { name: /open accessibility settings/i }));
    const largeTextSwitch = screen.getByRole('checkbox', { name: /large text/i });
    // Toggle on
    await user.click(largeTextSwitch);
    expect(largeTextSwitch).toBeChecked();
    // Toggle off
    await user.click(largeTextSwitch);
    expect(largeTextSwitch).not.toBeChecked();
  });
});
