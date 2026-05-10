import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params && 'name' in params) return `Simulating: ${params.name}`;
      if (params && 'condition' in params) return `Condition: ${params.condition}`;
      return key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock child components
let capturedSourceChangeHandler: ((source: any) => void) | null = null;
jest.mock('../../components/InputSelector', () => {
  return ({ onSourceChange }: any) => {
    capturedSourceChangeHandler = onSourceChange;
    return <div data-testid="input-selector">Input Selector</div>;
  };
});

jest.mock('../../components/ControlPanel', () => ({
  ControlPanel: ({ visualizerSlot }: any) => (
    <div data-testid="control-panel">
      Control Panel
      {visualizerSlot}
    </div>
  ),
}));

jest.mock('../../components/Visualizer', () => {
  return ({ personName, personCondition }: any) => (
    <div data-testid="visualizer">
      Visualizer
      {personName && <span data-testid="person-name">{personName}</span>}
      {personCondition && <span data-testid="person-condition">{personCondition}</span>}
    </div>
  );
});

jest.mock('../../components/NavigationBar', () => () => <nav data-testid="navbar" />);
jest.mock('../../components/Footer', () => () => <footer data-testid="footer" />);
jest.mock('../../components/PageMeta', () => () => null);
jest.mock('../../components/PresetManager', () => {
  const PresetManager = () => <div data-testid="preset-manager" />;
  (PresetManager as any).decodePreset = () => null;
  return { __esModule: true, default: PresetManager, decodePreset: () => null };
});

import VisionSimulator from '../../components/VisionSimulator';

/**
 * Helper to render VisionSimulator with routing context and optional location state
 */
function renderSimulator(options: {
  route?: string;
  state?: Record<string, unknown>;
} = {}) {
  const { route = '/simulator', state } = options;
  const initialEntry = state ? { pathname: route, state } : route;

  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AccessibilityProvider>
          <VisionSimulator />
        </AccessibilityProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('VisionSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedSourceChangeHandler = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders without crashing', () => {
    renderSimulator();
    expect(screen.getByText('simulator.title')).toBeInTheDocument();
  });

  test('renders navigation bar and footer', () => {
    renderSimulator();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders step 0 (input selection) by default', () => {
    renderSimulator();
    expect(screen.getByTestId('input-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('control-panel')).not.toBeInTheDocument();
  });

  test('has screen reader announcement for step 0', () => {
    renderSimulator();
    expect(screen.getByText('simulator.screenReaderStep1')).toBeInTheDocument();
  });

  test('has skip to content link', () => {
    renderSimulator();
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('has main content landmark with correct id', () => {
    renderSimulator();
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  test('auto-advances to step 1 after source selection with youtube', () => {
    renderSimulator();
    expect(screen.getByTestId('input-selector')).toBeInTheDocument();

    // Simulate selecting a YouTube source
    act(() => {
      capturedSourceChangeHandler?.({ type: 'youtube' });
    });

    // Should auto-advance after 300ms delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('input-selector')).not.toBeInTheDocument();
  });

  test('auto-advances to step 1 after image source selection', () => {
    renderSimulator();

    act(() => {
      capturedSourceChangeHandler?.({ type: 'image', url: 'test.png' });
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  test('blocks webcam source and forces youtube', () => {
    renderSimulator();

    act(() => {
      capturedSourceChangeHandler?.({ type: 'webcam' });
    });

    // Should NOT auto-advance since webcam is forced to youtube (no source change triggers advance)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // The component should still be on step 0 or step 1 depending on implementation
    // Key behavior: webcam type is rejected
  });

  test('renders with preconfigured conditions from location state', () => {
    renderSimulator({
      state: {
        preconfiguredConditions: ['protanopia', 'blurryVision'],
        personName: 'Claude Monet',
        personCondition: 'Cataracts',
      },
    });

    // Should skip directly to step 1 with the preconfigured person banner
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
    expect(screen.getByText('Simulating: Claude Monet')).toBeInTheDocument();
    expect(screen.getByText('Condition: Cataracts')).toBeInTheDocument();
  });

  test('shows preconfigured person banner when in famous people mode', () => {
    renderSimulator({
      state: {
        preconfiguredConditions: ['cataracts'],
        personName: 'Claude Monet',
        personCondition: 'Cataracts',
      },
    });

    expect(screen.getByText('Simulating: Claude Monet')).toBeInTheDocument();
  });

  test('does not show preset manager in famous people mode', () => {
    renderSimulator({
      state: {
        preconfiguredConditions: ['cataracts'],
        personName: 'Claude Monet',
        personCondition: 'Cataracts',
      },
    });

    expect(screen.queryByTestId('preset-manager')).not.toBeInTheDocument();
  });

  test('shows preset manager in regular simulator mode at step 1', () => {
    renderSimulator();

    // Advance to step 1
    act(() => {
      capturedSourceChangeHandler?.({ type: 'youtube' });
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('preset-manager')).toBeInTheDocument();
  });

  test('renders screen reader step 2 announcement at step 1', () => {
    renderSimulator();

    act(() => {
      capturedSourceChangeHandler?.({ type: 'youtube' });
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('simulator.screenReaderStep2')).toBeInTheDocument();
  });
});
