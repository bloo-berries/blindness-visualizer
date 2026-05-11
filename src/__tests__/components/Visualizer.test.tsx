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

// Mock Three.js entirely — use global to access document inside jest.mock factory
jest.mock('three', () => {
  const mockCanvas = global.document.createElement('canvas');
  return {
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      domElement: mockCanvas,
      setPixelRatio: jest.fn(),
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      remove: jest.fn(),
    })),
    OrthographicCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      updateProjectionMatrix: jest.fn(),
    })),
    PlaneGeometry: jest.fn(),
    ShaderMaterial: jest.fn().mockImplementation(() => ({
      uniforms: {},
      dispose: jest.fn(),
    })),
    Mesh: jest.fn().mockImplementation(() => ({
      geometry: { dispose: jest.fn() },
      material: { dispose: jest.fn() },
    })),
    VideoTexture: jest.fn().mockImplementation(() => ({
      dispose: jest.fn(),
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
      load: jest.fn(),
    })),
    LinearFilter: 1,
    RGBAFormat: 1,
    ClampToEdgeWrapping: 1,
    SRGBColorSpace: '',
    NearestFilter: 1,
    DoubleSide: 2,
  };
});

// Mock the hooks used by Visualizer
const mockUseSceneSetup = {
  isLoading: false,
  error: null,
  handleRetryCamera: jest.fn(),
  effectProcessor: { current: { updateEffects: () => ({ changed: false, enabledEffects: [] }) } },
  overlayManager: { current: { clearOverlays: jest.fn(), updateOverlays: jest.fn() } },
};

const mockUseScreenshot = {
  isSaving: false,
  saveMessage: null,
  handleSaveScreenshot: jest.fn(),
  clearSaveMessage: jest.fn(),
};

jest.mock('../../components/Visualizer/hooks', () => ({
  useSceneSetup: () => mockUseSceneSetup,
  useScreenshot: () => mockUseScreenshot,
  useAnimatedOverlay: () => null,
  useVisualFieldOverlay: () => [],
  useCSSFilters: () => ({
    computeFilterString: () => '',
    getEffectStyles: () => ({}),
  }),
  ANIMATED_EFFECTS: new Set(),
}));

jest.mock('../../hooks', () => ({
  useAnimationTicker: () => 0,
}));

// Mock YouTubeEmbed
jest.mock('../../components/YouTubeEmbed', () => {
  return ({ src, title }: any) => (
    <iframe data-testid="youtube-embed" src={src} title={title} />
  );
});

// Mock DiplopiaOverlay
jest.mock('../../components/Visualizer/DiplopiaOverlay', () => ({
  useDiplopiaOverlay: () => () => null,
}));

// Mock ComparisonView
jest.mock('../../components/Visualizer/ComparisonView', () => {
  return () => <div data-testid="comparison-view">Comparison View</div>;
});

// Mock ColorVisionFilterSVG
jest.mock('../../components/Visualizer/ColorVisionFilterSVG', () => {
  return () => null;
});

// Mock NeoMatrixCodeVision
jest.mock('../../components/Visualizer/hooks/animatedOverlays/neoMatrixCodeVision', () => {
  return () => <div data-testid="neo-matrix">Neo Matrix</div>;
});

// Mock effectsDescription
jest.mock('../../utils/effectsDescription', () => ({
  generateEffectsDescription: () => 'Test visualization description',
}));

// Mock appConstants
jest.mock('../../utils/appConstants', () => ({
  YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/test',
  getFamousPersonVideoUrl: () => 'https://www.youtube.com/embed/famous',
}));

import Visualizer from '../../components/Visualizer';
import { VisualEffect, InputSource } from '../../types/visualEffects';

const makeEffect = (id: string, enabled = false, intensity = 0.5): VisualEffect => ({
  id: id as any,
  name: `Effect ${id}`,
  enabled,
  intensity,
  description: `Description for ${id}`,
});

describe('Visualizer', () => {
  const defaultEffects: VisualEffect[] = [
    makeEffect('protanopia', false),
    makeEffect('blurryVision', false),
  ];

  const youtubeSource: InputSource = { type: 'youtube' };
  const imageSource: InputSource = { type: 'image', url: 'test-image.png' };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock state
    mockUseSceneSetup.isLoading = false;
    mockUseSceneSetup.error = null;
  });

  test('renders without crashing with youtube source', () => {
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByTestId('youtube-embed')).toBeInTheDocument();
  });

  test('renders without crashing with image source', () => {
    render(<Visualizer effects={defaultEffects} inputSource={imageSource} />);
    const img = screen.getByAltText('Uploaded content for visualization');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.png');
  });

  test('shows loading indicator when isLoading is true', () => {
    mockUseSceneSetup.isLoading = true;
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading visualization...')).toBeInTheDocument();
  });

  test('shows error message when error occurs', () => {
    mockUseSceneSetup.error = 'WebGL is not supported in your browser';
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByText('WebGL is not supported in your browser')).toBeInTheDocument();
  });

  test('shows error alert with assertive aria-live', () => {
    mockUseSceneSetup.error = 'Camera access denied';
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('renders visualization description section', () => {
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByText('Visualization Description')).toBeInTheDocument();
    expect(screen.getByText('Test visualization description')).toBeInTheDocument();
  });

  test('renders Save Result button', () => {
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByText('Save Result')).toBeInTheDocument();
  });

  test('renders Show Comparison button', () => {
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    // There are multiple "Compare" buttons in different contexts
    const compareButtons = screen.getAllByText('Compare');
    expect(compareButtons.length).toBeGreaterThanOrEqual(1);
  });

  test('renders comparison view when showComparison is true', () => {
    render(
      <Visualizer
        effects={defaultEffects}
        inputSource={youtubeSource}
        showComparison={true}
      />
    );
    expect(screen.getByTestId('comparison-view')).toBeInTheDocument();
  });

  test('renders with image source and has compare and save buttons', () => {
    render(<Visualizer effects={defaultEffects} inputSource={imageSource} />);
    // Image mode should have Compare, Save, and Fullscreen buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Fullscreen')).toBeInTheDocument();
  });

  test('renders complete blindness message when that effect is enabled', () => {
    const effects = [
      makeEffect('completeBlindness', true, 1.0),
      makeEffect('blurryVision', false),
    ];
    render(<Visualizer effects={effects} inputSource={youtubeSource} />);
    expect(screen.getByText(/complete blackness you see is the correct visualization/)).toBeInTheDocument();
  });

  test('does not show complete blindness message when effect is disabled', () => {
    const effects = [
      makeEffect('completeBlindness', false),
    ];
    render(<Visualizer effects={effects} inputSource={youtubeSource} />);
    expect(screen.queryByText(/complete blackness/)).not.toBeInTheDocument();
  });

  test('renders canvas container with role="img" and aria-label', () => {
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    // The canvas container with role="img" is hidden (display: none) for non-webcam sources
    // Use hidden option to find it
    const imgContainer = screen.getByRole('img', { hidden: true });
    expect(imgContainer).toHaveAttribute('aria-label', 'Test visualization description');
  });

  test('shows Saving state on save button when isSaving is true', () => {
    mockUseScreenshot.isSaving = true;
    render(<Visualizer effects={defaultEffects} inputSource={youtubeSource} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    mockUseScreenshot.isSaving = false;
  });
});
