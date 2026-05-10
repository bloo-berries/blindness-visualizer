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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import ResourcesPage from '../../components/ResourcesPage';

describe('ResourcesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<ResourcesPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<ResourcesPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<ResourcesPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the page title heading', () => {
    renderWithProviders(<ResourcesPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('resourcesPage.title');
  });

  test('renders the subtitle', () => {
    renderWithProviders(<ResourcesPage />);
    expect(screen.getByText('resourcesPage.subtitle')).toBeInTheDocument();
  });

  test('renders 5 resource category sections', () => {
    renderWithProviders(<ResourcesPage />);
    const categoryHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(categoryHeadings.length).toBe(5);
  });

  test('renders category heading translation keys', () => {
    renderWithProviders(<ResourcesPage />);
    expect(screen.getByText('resourcesPage.categories.organizations')).toBeInTheDocument();
    expect(screen.getByText('resourcesPage.categories.assistiveTech')).toBeInTheDocument();
    expect(screen.getByText('resourcesPage.categories.education')).toBeInTheDocument();
    expect(screen.getByText('resourcesPage.categories.dailyLiving')).toBeInTheDocument();
    expect(screen.getByText('resourcesPage.categories.support')).toBeInTheDocument();
  });

  test('renders resource links as external links with target=_blank', () => {
    renderWithProviders(<ResourcesPage />);
    const externalLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('target') === '_blank'
    );
    // Should have at least the resource links (20 resources total across categories)
    expect(externalLinks.length).toBeGreaterThanOrEqual(15);
  });

  test('all external links have noopener noreferrer', () => {
    renderWithProviders(<ResourcesPage />);
    const externalLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('target') === '_blank'
    );
    externalLinks.forEach(link => {
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });

  test('renders resource titles as h3 headings', () => {
    renderWithProviders(<ResourcesPage />);
    const h3Headings = screen.getAllByRole('heading', { level: 3 });
    // Each resource gets an h3
    expect(h3Headings.length).toBeGreaterThanOrEqual(15);
  });

  test('renders resource descriptions', () => {
    renderWithProviders(<ResourcesPage />);
    // Check for a known description translation key
    expect(screen.getByText('resourcesPage.resources.nfb.description')).toBeInTheDocument();
    expect(screen.getByText('resourcesPage.resources.jaws.description')).toBeInTheDocument();
  });

  test('renders known resource URLs', () => {
    renderWithProviders(<ResourcesPage />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('https://nfb.org');
    expect(hrefs).toContain('https://www.nvaccess.org');
    expect(hrefs).toContain('https://www.ada.gov');
  });

  test('has proper heading hierarchy', () => {
    renderWithProviders(<ResourcesPage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
    expect(h3s.length).toBeGreaterThan(0);
  });
});
