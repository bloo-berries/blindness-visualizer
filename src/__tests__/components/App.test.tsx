import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock all lazy-loaded page components
jest.mock('../../components/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home</div>;
  };
});
jest.mock('../../components/VisionSimulator', () => {
  return function MockVisionSimulator() {
    return <div data-testid="vision-simulator">Simulator</div>;
  };
});
jest.mock('../../components/FamousBlindPeople', () => {
  return function MockFamousBlindPeople() {
    return <div data-testid="famous-people">Famous People</div>;
  };
});
jest.mock('../../components/ConditionsPage', () => {
  return function MockConditionsPage() {
    return <div data-testid="conditions-page">Conditions</div>;
  };
});
jest.mock('../../components/AboutPage', () => {
  return function MockAboutPage() {
    return <div data-testid="about-page">About</div>;
  };
});
jest.mock('../../components/FeedbackPage', () => {
  return function MockFeedbackPage() {
    return <div data-testid="feedback-page">Feedback</div>;
  };
});
jest.mock('../../components/ResourcesPage', () => {
  return function MockResourcesPage() {
    return <div data-testid="resources-page">Resources</div>;
  };
});
jest.mock('../../components/NotFoundPage', () => {
  return function MockNotFoundPage() {
    return <div data-testid="not-found-page">Not Found</div>;
  };
});

import App from '../../App';

describe('App', () => {
  it('renders without crashing and shows home page', async () => {
    await act(async () => {
      render(<App />);
    });
    const home = await screen.findByTestId('home-page', {}, { timeout: 5000 });
    expect(home).toBeInTheDocument();
  });

  it('renders the ErrorBoundary wrapper', async () => {
    await act(async () => {
      render(<App />);
    });
    // App renders — if ErrorBoundary had caught an error, we'd see fallback UI
    const home = await screen.findByTestId('home-page', {}, { timeout: 5000 });
    expect(home).toBeInTheDocument();
  });
});

describe('getBasename edge cases', () => {
  const originalPublicUrl = process.env.PUBLIC_URL;

  afterEach(() => {
    process.env.PUBLIC_URL = originalPublicUrl;
  });

  // getBasename is an internal function called during App render.
  // We test its behavior indirectly by verifying App renders with different PUBLIC_URL values.
  it('App renders correctly with empty PUBLIC_URL', async () => {
    process.env.PUBLIC_URL = '';
    await act(async () => {
      render(<App />);
    });
    const home = await screen.findByTestId('home-page', {}, { timeout: 5000 });
    expect(home).toBeInTheDocument();
  });
});
