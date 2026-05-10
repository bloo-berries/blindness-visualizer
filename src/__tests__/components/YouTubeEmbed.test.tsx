import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const map: Record<string, string> = {
        'inputSelector.videoUnavailable': 'Video unavailable',
        'inputSelector.videoUnavailableDesc': 'The video could not be loaded. Please try again.',
        'inputSelector.retry': 'Retry',
      };
      return map[key] || fallback || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('../../utils/appConstants', () => ({
  YOUTUBE_IFRAME_PROPS: {
    width: '100%',
    height: '100%',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    frameBorder: '0',
    loading: 'eager' as const,
    allowFullScreen: true,
    style: { width: '100%', height: '100%', border: 'none' },
  },
}));

import YouTubeEmbed from '../../components/YouTubeEmbed';

describe('YouTubeEmbed', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc123" title="Test Video" />
    );
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });

  test('renders an iframe element', () => {
    render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc123" title="Test Video" />
    );
    expect(screen.getByTitle('Test Video')).toBeInTheDocument();
  });

  test('passes correct src to iframe', () => {
    const testSrc = 'https://www.youtube.com/embed/xyz789?autoplay=1';
    render(<YouTubeEmbed src={testSrc} title="Test" />);
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveAttribute('src', testSrc);
  });

  test('passes title attribute to iframe', () => {
    render(<YouTubeEmbed src="https://www.youtube.com/embed/abc" title="My Video Title" />);
    expect(screen.getByTitle('My Video Title')).toBeInTheDocument();
  });

  test('renders with different video IDs', () => {
    const { rerender } = render(
      <YouTubeEmbed src="https://www.youtube.com/embed/video1" title="Video 1" />
    );
    expect(screen.getByTitle('Video 1')).toHaveAttribute('src', 'https://www.youtube.com/embed/video1');

    rerender(
      <YouTubeEmbed src="https://www.youtube.com/embed/video2" title="Video 2" />
    );
    expect(screen.getByTitle('Video 2')).toHaveAttribute('src', 'https://www.youtube.com/embed/video2');
  });

  test('passes allow attribute for autoplay and other features', () => {
    render(<YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />);
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
  });

  test('has allowFullScreen attribute', () => {
    const { container } = render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />
    );
    const iframe = container.querySelector('iframe')!;
    // allowFullScreen is a boolean attribute
    expect(iframe.allowFullscreen).toBe(true);
  });

  test('passes tabIndex prop to iframe', () => {
    render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" tabIndex={-1} />
    );
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveAttribute('tabindex', '-1');
  });

  test('passes aria-label prop to iframe', () => {
    render(
      <YouTubeEmbed
        src="https://www.youtube.com/embed/abc"
        title="Test"
        aria-label="YouTube video player"
      />
    );
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveAttribute('aria-label', 'YouTube video player');
  });

  test('applies custom style prop', () => {
    const customStyle = { width: '50%', height: '300px' };
    render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" style={customStyle} />
    );
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveStyle({ width: '50%', height: '300px' });
  });

  test('uses default absolute positioning style when no style prop provided', () => {
    render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />
    );
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    });
  });

  test('shows error fallback UI when error occurs', () => {
    // React 18 attaches event listeners at the root, but iframe error events do not bubble.
    // We use ReactDOM's internal __reactFiber to get access or simulate the handler directly.
    const { container } = render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />
    );
    const iframe = container.querySelector('iframe')!;
    // Find React's internal onError prop by accessing fiber internals
    const fiberKey = Object.keys(iframe).find(k => k.startsWith('__reactFiber'));
    if (fiberKey) {
      const fiber = (iframe as any)[fiberKey];
      // Traverse up to find the props with onError
      let current = fiber;
      while (current) {
        if (current.memoizedProps?.onError) {
          act(() => { current.memoizedProps.onError(); });
          break;
        }
        current = current.return;
      }
    }

    expect(screen.getByText('Video unavailable')).toBeInTheDocument();
    expect(screen.getByText('The video could not be loaded. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('retry button restores iframe after error', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />
    );
    const iframe = container.querySelector('iframe')!;
    // Trigger error via React fiber internals
    const fiberKey = Object.keys(iframe).find(k => k.startsWith('__reactFiber'));
    if (fiberKey) {
      const fiber = (iframe as any)[fiberKey];
      let current = fiber;
      while (current) {
        if (current.memoizedProps?.onError) {
          act(() => { current.memoizedProps.onError(); });
          break;
        }
        current = current.return;
      }
    }

    expect(screen.queryByTitle('Test')).not.toBeInTheDocument();
    await user.click(screen.getByText('Retry'));
    expect(screen.getByTitle('Test')).toBeInTheDocument();
  });

  test('has eager loading attribute', () => {
    render(
      <YouTubeEmbed src="https://www.youtube.com/embed/abc" title="Test" />
    );
    const iframe = screen.getByTitle('Test');
    expect(iframe).toHaveAttribute('loading', 'eager');
  });
});
