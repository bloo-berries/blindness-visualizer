import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock MUI useMediaQuery — default to desktop
const mockUseMediaQuery = jest.fn().mockReturnValue(false);
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: (...args: unknown[]) => mockUseMediaQuery(...args),
  };
});

import GuidedTour from '../../components/GuidedTour';

const TOUR_STORAGE_KEY = 'tour-completed-v1';

describe('GuidedTour', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    document.body.innerHTML = '';
    mockUseMediaQuery.mockReturnValue(false); // desktop
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true); // mobile
    const { container } = render(<GuidedTour />);
    // Should render nothing — the component returns null when isMobile
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when tour is already completed', () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    const { container } = render(<GuidedTour />);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(container.innerHTML).toBe('');
  });

  it('becomes visible after delay on desktop when not completed', () => {
    render(<GuidedTour />);
    // Before timer fires, not visible
    expect(screen.queryByText('tour.step1Title')).not.toBeInTheDocument();
    // After 1500ms delay
    act(() => { jest.advanceTimersByTime(1500); });
    expect(screen.getByText('tour.step1Title')).toBeInTheDocument();
  });

  it('shows immediately when forceShow is true', () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    render(<GuidedTour forceShow />);
    expect(screen.getByText('tour.step1Title')).toBeInTheDocument();
  });

  it('shows step counter starting at 1 / 4', () => {
    render(<GuidedTour forceShow />);
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('advances to next step on Next button click', () => {
    render(<GuidedTour forceShow />);
    expect(screen.getByText('tour.step1Title')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('tour.step2Title')).toBeInTheDocument();
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });

  it('goes back to previous step on Back button click', () => {
    render(<GuidedTour forceShow />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('tour.step2Title')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('tour.step1Title')).toBeInTheDocument();
  });

  it('does not show Back button on first step', () => {
    render(<GuidedTour forceShow />);
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('completes tour on last step Next click and sets localStorage', () => {
    const onComplete = jest.fn();
    render(<GuidedTour forceShow onComplete={onComplete} />);
    // Navigate to last step
    fireEvent.click(screen.getByText('Next')); // step 2
    fireEvent.click(screen.getByText('Next')); // step 3
    fireEvent.click(screen.getByText('Next')); // step 4
    // Last step shows "Got it!" instead of "Next"
    expect(screen.getByText('Got it!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Got it!'));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe('true');
  });

  it('completes tour when clicking the dark overlay backdrop', () => {
    const onComplete = jest.fn();
    render(<GuidedTour forceShow onComplete={onComplete} />);
    // The backdrop overlay is the first Box with onClick={completeTour}
    // Find the SVG element's parent box
    const svgEl = document.querySelector('svg');
    expect(svgEl).not.toBeNull();
    fireEvent.click(svgEl!.parentElement!);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('handles missing target elements gracefully (centers tooltip)', () => {
    // No data-tour-step elements in DOM
    render(<GuidedTour forceShow />);
    // Should still render the tooltip (centered as fallback)
    expect(screen.getByText('tour.step1Title')).toBeInTheDocument();
  });

  it('handles localStorage errors gracefully', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('QuotaExceededError');
    });

    const onComplete = jest.fn();
    render(<GuidedTour forceShow onComplete={onComplete} />);
    // Navigate through all steps
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    // Should not throw
    expect(() => fireEvent.click(screen.getByText('Got it!'))).not.toThrow();
    expect(onComplete).toHaveBeenCalledTimes(1);

    Storage.prototype.setItem = originalSetItem;
  });

  it('renders close button that completes the tour', () => {
    const onComplete = jest.fn();
    render(<GuidedTour forceShow onComplete={onComplete} />);
    // The close icon button uses the Close icon - find it by its role
    const closeButtons = screen.getAllByRole('button');
    // The close button is the IconButton (small size)
    const closeButton = closeButtons.find(btn => btn.querySelector('[data-testid="CloseIcon"]'));
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton!);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
