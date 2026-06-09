import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string | Record<string, unknown>) => {
      if (typeof fallback === 'string') return fallback;
      return key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock hooks
jest.mock('../../components/Visualizer/hooks', () => ({
  useAnimatedOverlay: () => null,
  useVisualFieldOverlay: () => [],
  ANIMATED_EFFECTS: new Set(),
}));

jest.mock('../../hooks', () => ({
  useAnimationTicker: () => 0,
}));

// Mock YouTubeEmbed
jest.mock('../../components/YouTubeEmbed', () => {
  return ({ src, title }: { src: string; title: string }) => (
    <iframe data-testid="youtube-embed" src={src} title={title} />
  );
});

// Mock NeoMatrixCodeVision
jest.mock('../../components/Visualizer/hooks/animatedOverlays/neoMatrixCodeVision', () => {
  return () => <div data-testid="neo-matrix">Neo Matrix</div>;
});

// Mock ColorVisionFilterSVG
jest.mock('../../components/Visualizer/ColorVisionFilterSVG', () => {
  return () => null;
});

// Mock appConstants
jest.mock('../../utils/appConstants', () => ({
  YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/test',
}));

// Mock MUI useMediaQuery
const mockUseMediaQuery = jest.fn().mockReturnValue(false);
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: (...args: unknown[]) => mockUseMediaQuery(...args),
  };
});

import ComparisonView from '../../components/Visualizer/ComparisonView';
import { VisualEffect, InputSource } from '../../types/visualEffects';

function makeEffect(id: string, enabled = false, intensity = 0.5): VisualEffect {
  return { id: id as any, name: `Effect ${id}`, enabled, intensity, description: '' };
}

const defaultProps = () => ({
  effects: [makeEffect('cataracts', true, 0.5)],
  inputSource: { type: 'youtube' as const } as InputSource,
  getVideoUrl: () => 'https://www.youtube.com/embed/test',
  getEffectStyles: () => ({ position: 'relative' as const, width: '100%', height: '100%' }),
  getDiplopiaOverlay: () => null,
  onToggleComparison: jest.fn(),
  simulationContainerRef: React.createRef<HTMLDivElement>(),
});

describe('ComparisonView', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false); // desktop
  });

  it('renders simulation and original labels', () => {
    render(<ComparisonView {...defaultProps()} />);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('renders toggle button', () => {
    render(<ComparisonView {...defaultProps()} />);
    expect(screen.getByText('View Full Simulation')).toBeInTheDocument();
  });

  it('calls onToggleComparison when toggle button is clicked', () => {
    const props = defaultProps();
    render(<ComparisonView {...props} />);
    fireEvent.click(screen.getByText('View Full Simulation'));
    expect(props.onToggleComparison).toHaveBeenCalledTimes(1);
  });

  it('shows complete blindness notification when completeBlindness is enabled', () => {
    const props = defaultProps();
    props.effects = [makeEffect('completeBlindness', true, 1.0)];
    render(<ComparisonView {...props} />);
    expect(screen.getByText(/Complete blindness/)).toBeInTheDocument();
  });

  it('does not show complete blindness notification for other effects', () => {
    render(<ComparisonView {...defaultProps()} />);
    expect(screen.queryByText(/Complete blindness/)).not.toBeInTheDocument();
  });

  it('renders YouTube embeds for youtube input source', () => {
    render(<ComparisonView {...defaultProps()} />);
    const iframes = screen.getAllByTestId('youtube-embed');
    // Two iframes: simulation side and original side
    expect(iframes.length).toBe(2);
  });

  it('renders images for image input source', () => {
    const props = defaultProps();
    props.inputSource = { type: 'image', url: 'data:image/png;base64,test' } as InputSource;
    render(<ComparisonView {...props} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
  });

  it('renders placeholder when input source has no URL for image type', () => {
    const props = defaultProps();
    props.inputSource = { type: 'image' } as InputSource;
    render(<ComparisonView {...props} />);
    expect(screen.getByText('Simulation content would appear here')).toBeInTheDocument();
    expect(screen.getByText('Original content would appear here')).toBeInTheDocument();
  });

  it('includes screen reader announcement for active effects', () => {
    const props = defaultProps();
    props.effects = [makeEffect('cataracts', true, 0.5), makeEffect('glaucoma', true, 0.3)];
    render(<ComparisonView {...props} />);
    // aria-live region exists
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
  });

  it('uses mobile layout when isMobile is true', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const props = defaultProps();
    props.effects = [makeEffect('completeBlindness', true, 1.0)];
    render(<ComparisonView {...props} />);
    // Should still render
    expect(screen.getByText('Simulation')).toBeInTheDocument();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });
});
