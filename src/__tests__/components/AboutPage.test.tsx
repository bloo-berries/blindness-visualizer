import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock child components
jest.mock('../../components/NavigationBar', () => {
  return function MockNavigationBar() {
    return <div data-testid="navbar" />;
  };
});
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer" />;
  };
});
jest.mock('../../components/PageMeta', () => {
  return function MockPageMeta() {
    return null;
  };
});

import AboutPage from '../../components/AboutPage';

describe('AboutPage', () => {
  test('renders without crashing', () => {
    renderWithProviders(<AboutPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the page title heading', () => {
    renderWithProviders(<AboutPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('about.title');
  });

  test('renders the personal journey section heading', () => {
    renderWithProviders(<AboutPage />);
    const journeyHeading = screen.getByRole('heading', { level: 2 });
    expect(journeyHeading).toHaveTextContent('about.personalJourney');
  });

  test('renders greeting text', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('about.greeting')).toBeInTheDocument();
  });

  test('renders personal story text', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('about.story')).toBeInTheDocument();
  });

  test('renders purpose statement', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('about.purpose')).toBeInTheDocument();
  });

  test('renders a Wistia video iframe', () => {
    renderWithProviders(<AboutPage />);
    const iframe = screen.getByTitle('my-vision Video');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('wistia.com'));
  });

  test('renders the video preview text', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('about.previewVideo')).toBeInTheDocument();
  });

  test('has proper heading hierarchy (h1 then h2)', () => {
    renderWithProviders(<AboutPage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });

  test('iframe allows autoplay and fullscreen', () => {
    renderWithProviders(<AboutPage />);
    const iframe = screen.getByTitle('my-vision Video');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
    expect(iframe.getAttribute('allow')).toContain('fullscreen');
  });
});
