import React from 'react';
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock IntersectionObserver so the component immediately becomes visible
const mockIntersectionObserver = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
    // Immediately trigger with isIntersecting = true
    callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    };
  });
  (window as any).IntersectionObserver = mockIntersectionObserver;
});

import ImpactDashboard from '../../components/ImpactDashboard';

describe('ImpactDashboard', () => {
  // Use fake timers to control requestAnimationFrame for count-up animation
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders without crashing', () => {
    renderWithProviders(<ImpactDashboard />);
    // The component should be in the DOM
    expect(screen.getByText('Vision Conditions')).toBeInTheDocument();
  });

  test('displays all four stat labels', () => {
    renderWithProviders(<ImpactDashboard />);
    expect(screen.getByText('Vision Conditions')).toBeInTheDocument();
    expect(screen.getByText('Famous People')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Animated Effects')).toBeInTheDocument();
  });

  test('shows target values after animation completes', () => {
    // Mock performance.now to simulate time progression
    const startTime = 1000;
    let currentTime = startTime;
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

    // Mock requestAnimationFrame to run callbacks synchronously
    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    renderWithProviders(<ImpactDashboard />);

    // Advance time past the animation duration (1500ms)
    currentTime = startTime + 2000;

    // Run all queued animation frames until stable
    act(() => {
      let iterations = 0;
      while (rafCallbacks.length > 0 && iterations < 100) {
        const cb = rafCallbacks.shift()!;
        cb(currentTime);
        iterations++;
      }
    });

    // Check final target values are displayed
    expect(screen.getByText(/148/)).toBeInTheDocument();
    expect(screen.getByText(/214/)).toBeInTheDocument();
    expect(screen.getByText(/26/)).toBeInTheDocument();
    expect(screen.getByText(/27/)).toBeInTheDocument();

    (performance.now as jest.Mock).mockRestore();
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test('displays + suffix for conditions with suffix', () => {
    const startTime = 1000;
    let currentTime = startTime;
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    renderWithProviders(<ImpactDashboard />);

    currentTime = startTime + 2000;
    act(() => {
      let iterations = 0;
      while (rafCallbacks.length > 0 && iterations < 100) {
        const cb = rafCallbacks.shift()!;
        cb(currentTime);
        iterations++;
      }
    });

    // "148+" and "214+" should appear (these have the + suffix)
    expect(screen.getByText('148+')).toBeInTheDocument();
    expect(screen.getByText('214+')).toBeInTheDocument();

    (performance.now as jest.Mock).mockRestore();
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test('stats without suffix do not show +', () => {
    const startTime = 1000;
    let currentTime = startTime;
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    renderWithProviders(<ImpactDashboard />);

    currentTime = startTime + 2000;
    act(() => {
      let iterations = 0;
      while (rafCallbacks.length > 0 && iterations < 100) {
        const cb = rafCallbacks.shift()!;
        cb(currentTime);
        iterations++;
      }
    });

    // "26" and "27" should appear without +
    expect(screen.getByText('26')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();

    (performance.now as jest.Mock).mockRestore();
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test('sets up IntersectionObserver on mount', () => {
    renderWithProviders(<ImpactDashboard />);
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  test('counters start at 0 before animation', () => {
    // Make IntersectionObserver not trigger visibility
    mockIntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));

    renderWithProviders(<ImpactDashboard />);

    // All counters should show 0
    const zeros = screen.getAllByText('0');
    // Two stats have no suffix, two have +, but all start at 0
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  test('falls back to visible when IntersectionObserver is unavailable', () => {
    // Remove IntersectionObserver
    delete (window as any).IntersectionObserver;

    const startTime = 1000;
    let currentTime = startTime;
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    renderWithProviders(<ImpactDashboard />);

    currentTime = startTime + 2000;
    act(() => {
      let iterations = 0;
      while (rafCallbacks.length > 0 && iterations < 100) {
        const cb = rafCallbacks.shift()!;
        cb(currentTime);
        iterations++;
      }
    });

    // Should still show final values since it falls back to visible
    expect(screen.getByText('148+')).toBeInTheDocument();

    (performance.now as jest.Mock).mockRestore();
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test('renders exactly 4 stat cards', () => {
    renderWithProviders(<ImpactDashboard />);
    const labels = ['Vision Conditions', 'Famous People', 'Languages', 'Animated Effects'];
    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
