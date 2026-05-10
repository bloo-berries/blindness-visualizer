import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { HelmetProvider } from 'react-helmet-async';
import { VisualEffect } from '../types/visualEffects';

/**
 * Wraps component in Router + AccessibilityProvider + HelmetProvider
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    ...renderOptions
  }: { route?: string } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Creates a mock VisualEffect for testing
 */
export const makeEffect = (
  id: string,
  enabled = false,
  intensity = 0.5
): VisualEffect => ({
  id: id as any,
  name: `Effect ${id}`,
  enabled,
  intensity,
  description: `Description for ${id}`,
});
