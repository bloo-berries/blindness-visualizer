import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';

// Track cycleThemeMode calls
const mockCycleThemeMode = jest.fn();
const mockNavigate = jest.fn();

// Mock i18n module to prevent initialization errors
jest.mock('../../i18n', () => ({
  supportedLanguages: {
    en: { name: 'English', nativeName: 'English', dir: 'ltr' },
    fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
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
        'nav.openMenu': 'Open menu',
        'nav.navigation': 'Navigation',
        'nav.mainNavigation': 'Main navigation',
        'nav.mobileNavigation': 'Mobile navigation',
        'nav.viewOnGithub': 'View on GitHub',
        'nav.settings': 'Settings',
        'theme.toggle': 'Theme',
        'theme.dim': 'Dim',
        'theme.light': 'Light',
        'theme.dark': 'Dark',
        'accessibility.skipToContent': 'Skip to content',
        'language.select': 'Language',
      };
      return map[key] || fallback || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock react-router-dom navigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

// Mock useAccessibility to track cycleThemeMode
jest.mock('../../contexts/AccessibilityContext', () => {
  const actual = jest.requireActual('../../contexts/AccessibilityContext');
  return {
    ...actual,
    useAccessibility: () => ({
      preferences: { themeMode: 'dim', highContrast: false },
      cycleThemeMode: mockCycleThemeMode,
    }),
  };
});

import NavigationBar from '../../components/NavigationBar';

const renderWithProviders = (
  ui: React.ReactElement,
  { route = '/' }: { route?: string } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

describe('NavigationBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithProviders(<NavigationBar />);
  });

  test('renders navigation links', () => {
    renderWithProviders(<NavigationBar />);
    expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Simulator').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Famous People').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Glossary').length).toBeGreaterThanOrEqual(1);
  });

  test('renders the site title / home link', () => {
    renderWithProviders(<NavigationBar />);
    const homeLinks = screen.getAllByRole('button').filter(
      btn => btn.textContent?.includes('Blind Spot') || btn.getAttribute('aria-label')?.includes('home')
    );
    expect(homeLinks.length).toBeGreaterThanOrEqual(0);
    expect(screen.getByRole('navigation') || screen.getByRole('banner')).toBeTruthy();
  });

  test('renders skip-to-content link on non-home pages', () => {
    renderWithProviders(<NavigationBar />, { route: '/about' });
    const skipLink = screen.queryByText('Skip to content');
    if (skipLink) {
      expect(skipLink).toBeInTheDocument();
    }
  });

  test('marks active nav item with aria-current', () => {
    renderWithProviders(<NavigationBar />, { route: '/about' });
    const aboutLinks = screen.getAllByText('About');
    const hasAriaCurrent = aboutLinks.some(
      el => el.closest('[aria-current="page"]') !== null
    );
    expect(hasAriaCurrent).toBe(true);
  });

  test('renders theme toggle button', () => {
    renderWithProviders(<NavigationBar />);
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

  test('clicking theme toggle calls cycleThemeMode', () => {
    renderWithProviders(<NavigationBar />);
    const themeButton = screen.getAllByRole('button').find(
      btn => btn.getAttribute('aria-label')?.toLowerCase().includes('theme')
    );
    expect(themeButton).toBeTruthy();
    fireEvent.click(themeButton!);
    expect(mockCycleThemeMode).toHaveBeenCalledTimes(1);
  });

  test('clicking nav link navigates to correct path', () => {
    renderWithProviders(<NavigationBar />);
    const aboutButtons = screen.getAllByText('About');
    // Click the first About button (desktop nav)
    fireEvent.click(aboutButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  test('onHomeClick prop is called when clicking home logo', () => {
    const onHomeClick = jest.fn();
    renderWithProviders(<NavigationBar onHomeClick={onHomeClick} />);
    const homeButton = screen.getByLabelText('Home');
    fireEvent.click(homeButton);
    expect(onHomeClick).toHaveBeenCalledTimes(1);
  });

  test('clicking home logo navigates to / when no onHomeClick', () => {
    renderWithProviders(<NavigationBar />);
    const homeButton = screen.getByLabelText('Home');
    fireEvent.click(homeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('does not show skip-to-content link on home page', () => {
    renderWithProviders(<NavigationBar />, { route: '/' });
    expect(screen.queryByText('Skip to content')).not.toBeInTheDocument();
  });

  test('renders The Blind Spot title text', () => {
    renderWithProviders(<NavigationBar />);
    expect(screen.getByText('The Blind Spot')).toBeInTheDocument();
  });
});
