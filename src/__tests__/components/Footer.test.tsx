import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      const map: Record<string, string> = {
        'buttons.support': 'Support',
        'buttons.supportDonate': 'Support & Donate',
        'nav.resources': 'Resources',
        'footer.feedback': 'Feedback',
        'nav.viewOnGithub': 'View on GitHub',
        'footer.copyright': `\u00A9 ${new Date().getFullYear()} The Blind Spot`,
      };
      if (key === 'footer.copyright' && opts?.year) {
        return `\u00A9 ${opts.year} The Blind Spot`;
      }
      return map[key] || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import Footer from '../../components/Footer';

describe('Footer', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<Footer />);
  });

  test('renders as a footer element', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('renders the Support & Donate button (desktop)', () => {
    renderWithProviders(<Footer />);
    // Both mobile and desktop versions render Support buttons
    const supportButtons = screen.getAllByRole('link').filter(
      link => link.getAttribute('href') === 'https://linktr.ee/bloomedhealth'
    );
    expect(supportButtons.length).toBeGreaterThanOrEqual(1);
  });

  test('Support button opens in new tab', () => {
    renderWithProviders(<Footer />);
    const supportLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('href') === 'https://linktr.ee/bloomedhealth'
    );
    supportLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test('renders Resources links', () => {
    renderWithProviders(<Footer />);
    const resourcesLinks = screen.getAllByText('Resources');
    expect(resourcesLinks.length).toBeGreaterThanOrEqual(1);
  });

  test('renders Feedback links', () => {
    renderWithProviders(<Footer />);
    const feedbackLinks = screen.getAllByText('Feedback');
    expect(feedbackLinks.length).toBeGreaterThanOrEqual(1);
  });

  test('renders GitHub icon link', () => {
    renderWithProviders(<Footer />);
    const githubLink = screen.getByRole('link', { name: 'View on GitHub' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bloo-berries/blindness-visualizer');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('has footer navigation landmark on desktop', () => {
    renderWithProviders(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    expect(nav).toBeInTheDocument();
  });

  test('clicking Resources link navigates to /resources', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Footer />);
    // Click the desktop Resources link (the one in the nav)
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    const resourcesLink = nav.querySelector('a[href="/resources"]');
    expect(resourcesLink).toBeTruthy();
    if (resourcesLink) {
      await user.click(resourcesLink);
      expect(mockNavigate).toHaveBeenCalledWith('/resources');
    }
  });

  test('clicking Feedback link navigates to /feedback', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    const feedbackLink = nav.querySelector('a[href="/feedback"]');
    expect(feedbackLink).toBeTruthy();
    if (feedbackLink) {
      await user.click(feedbackLink);
      expect(mockNavigate).toHaveBeenCalledWith('/feedback');
    }
  });

  test('renders copyright text with current year', () => {
    renderWithProviders(<Footer />);
    const year = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`${year}`));
    expect(copyrightText).toBeInTheDocument();
  });

  test('Resources and Feedback links have proper href attributes', () => {
    renderWithProviders(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    const resourcesLink = nav.querySelector('a[href="/resources"]');
    const feedbackLink = nav.querySelector('a[href="/feedback"]');
    expect(resourcesLink).toBeTruthy();
    expect(feedbackLink).toBeTruthy();
  });
});
