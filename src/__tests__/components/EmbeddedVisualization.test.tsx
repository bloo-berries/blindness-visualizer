/**
 * Tests for EmbeddedVisualization component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock hooks
const mockAnimatedOverlayStyle = null;
const mockVisualFieldOverlayStyles: React.CSSProperties[] = [];

jest.mock('../../components/Visualizer/hooks', () => ({
  useAnimatedOverlay: () => mockAnimatedOverlayStyle,
  useVisualFieldOverlay: () => mockVisualFieldOverlayStyles,
  ANIMATED_EFFECTS: new Set(['visualAura', 'neoMatrixCodeVisionComplete']),
}));

jest.mock('../../hooks', () => ({
  useAnimationTicker: () => 0,
}));

// Mock getSimulationConditions
jest.mock('../../utils/famousPeopleUtils', () => ({
  getSimulationConditions: jest.fn().mockReturnValue(['protanopia']),
}));

// Mock CSS filters
jest.mock('../../utils/cssFilters', () => ({
  generateCSSFilters: jest.fn().mockReturnValue('blur(2px)'),
}));

// Mock YouTubeEmbed
jest.mock('../../components/YouTubeEmbed', () => {
  return function MockYouTubeEmbed(props: any) {
    return <iframe data-testid="youtube-embed" title={props.title} />;
  };
});

// Mock NeoMatrixCodeVision
jest.mock('../../components/Visualizer/hooks/animatedOverlays/neoMatrixCodeVision', () => {
  return function MockNeoMatrixCodeVision(props: { intensity: number }) {
    return <div data-testid="neo-matrix" data-intensity={props.intensity} />;
  };
});

// Mock ColorVisionFilterSVG
jest.mock('../../components/Visualizer/ColorVisionFilterSVG', () => {
  return function MockColorVisionFilterSVG() {
    return <svg data-testid="cvd-filter" />;
  };
});

// Mock appConstants
jest.mock('../../utils/appConstants', () => ({
  YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/test',
}));

import { EmbeddedVisualization } from '../../components/FamousBlindPeople/EmbeddedVisualization';
import { getSimulationConditions } from '../../utils/famousPeopleUtils';

describe('EmbeddedVisualization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSimulationConditions as jest.Mock).mockReturnValue(['protanopia']);
  });

  test('renders visualization container', () => {
    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="protanopia"
        personName="Test Person"
      />
    );

    expect(screen.getByText('Vision Simulation Preview')).toBeInTheDocument();
  });

  test('renders YouTube embed', () => {
    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="protanopia"
        personName="Test Person"
      />
    );

    expect(screen.getByTestId('youtube-embed')).toBeInTheDocument();
  });

  test('renders simulation label', () => {
    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="protanopia"
        personName="Test Person"
      />
    );

    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  test('completeBlindness renders darkness notification', () => {
    (getSimulationConditions as jest.Mock).mockReturnValue(['completeBlindness']);

    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="completeBlindness"
        personName="Test Person"
      />
    );

    expect(screen.getByText('Complete blindness - Total darkness')).toBeInTheDocument();
  });

  test('nearTotalBlindness renders darkness notification', () => {
    (getSimulationConditions as jest.Mock).mockReturnValue(['tofiriComplete']);

    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="tofiriComplete"
        personName="Test Person"
      />
    );

    expect(screen.getByText('Complete blindness - Total darkness')).toBeInTheDocument();
  });

  test('neoMatrixCodeVisionComplete renders NeoMatrixCodeVision component', () => {
    (getSimulationConditions as jest.Mock).mockReturnValue(['neoMatrixCodeVisionComplete']);

    render(
      <EmbeddedVisualization
        personId="neo"
        simulation="neoMatrixCodeVision"
        personName="Neo"
      />
    );

    expect(screen.getByTestId('neo-matrix')).toBeInTheDocument();
  });

  test('calls getSimulationConditions with the simulation prop', () => {
    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="mySimulation"
        personName="Test Person"
      />
    );

    expect(getSimulationConditions).toHaveBeenCalledWith('mySimulation');
  });

  test('renders ColorVisionFilterSVG', () => {
    render(
      <EmbeddedVisualization
        personId="test-person"
        simulation="protanopia"
        personName="Test Person"
      />
    );

    expect(screen.getByTestId('cvd-filter')).toBeInTheDocument();
  });
});
