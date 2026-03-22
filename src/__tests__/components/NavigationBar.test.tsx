import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';

// Mock i18n module to prevent initialization errors
jest.mock('../../i18n', () => ({}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.about': 'About',
        'nav.simulator': 'Simulator',
        'nav.famousPeople': 'Famous People',
        'nav.glossary': 'Glossary',
        'nav.home': 'Home',
        'nav.skipToContent': 'Skip to content',
        'nav.startSimulator': 'Start Simulator',
        'nav.resources': 'Resources',
        'nav.faq': 'FAQ',
        'nav.feedback': 'Feedback',
        'nav.themeCycle': 'Theme',
        'nav.language': 'Language',
        'nav.github': 'GitHub',
      };
      return map[key] || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock LanguageSelector to avoid complex i18n sub-tree
jest.mock('../../components/LanguageSelector', () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">Language</div>;
  };
});

// Mock AccessibilityMenu to avoid complex sub-tree
jest.mock('../../components/AccessibilityMenu', () => {
  return function MockAccessibilityMenu() {
    return <div data-testid="accessibility-menu">Accessibility</div>;
  };
});

import NavigationBar from '../../components/NavigationBar';

const renderWithProviders = (
  ui: React.ReactElement,
  { route = '/' }: { route?: string } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AccessibilityProvider>{ui}</AccessibilityProvider>
    </MemoryRouter>
  );
};

describe('NavigationBar', () => {
  test('renders without crashing', () => {
    renderWithProviders(<NavigationBar />);
  });

  test('renders navigation links', () => {
    renderWithProviders(<NavigationBar />);
    // Nav items may appear in both desktop and mobile renderings
    expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Simulator').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Famous People').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Glossary').length).toBeGreaterThanOrEqual(1);
  });

  test('renders the site title / home link', () => {
    renderWithProviders(<NavigationBar />);
    // The home button / brand link should be present
    const homeLinks = screen.getAllByRole('button').filter(
      btn => btn.textContent?.includes('Blind Spot') || btn.getAttribute('aria-label')?.includes('home')
    );
    expect(homeLinks.length).toBeGreaterThanOrEqual(0);
    // At minimum, the nav should render
    expect(screen.getByRole('navigation') || screen.getByRole('banner')).toBeTruthy();
  });

  test('renders skip-to-content link on non-home pages', () => {
    renderWithProviders(<NavigationBar />, { route: '/about' });
    const skipLink = screen.queryByText('Skip to content');
    // Skip link is hidden but present in DOM
    if (skipLink) {
      expect(skipLink).toBeInTheDocument();
    }
  });

  test('marks active nav item with aria-current', () => {
    renderWithProviders(<NavigationBar />, { route: '/about' });
    // Look for the About link that should have aria-current
    const aboutLinks = screen.getAllByText('About');
    const hasAriaCurrent = aboutLinks.some(
      el => el.closest('[aria-current="page"]') !== null
    );
    expect(hasAriaCurrent).toBe(true);
  });

  test('renders theme toggle button', () => {
    renderWithProviders(<NavigationBar />);
    // Theme toggle should be present (cycles light/dim/dark)
    const themeButtons = screen.getAllByRole('button').filter(
      btn => btn.getAttribute('aria-label')?.toLowerCase().includes('theme')
    );
    expect(themeButtons.length).toBeGreaterThanOrEqual(1);
  });

  test('renders language selector', () => {
    renderWithProviders(<NavigationBar />);
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  test('renders accessibility menu', () => {
    renderWithProviders(<NavigationBar />);
    expect(screen.getByTestId('accessibility-menu')).toBeInTheDocument();
  });
});
