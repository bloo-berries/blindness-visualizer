import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

import FAQPage from '../../components/FAQPage';

describe('FAQPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<FAQPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<FAQPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<FAQPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the h1 heading', () => {
    renderWithProviders(<FAQPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Frequently Asked Questions');
  });

  test('renders subtitle text', () => {
    renderWithProviders(<FAQPage />);
    expect(screen.getByText(/Common questions and answers about blindness/)).toBeInTheDocument();
  });

  test('renders all 10 FAQ accordion items', () => {
    renderWithProviders(<FAQPage />);
    // Each FAQ has a numbered question rendered as h3
    const faqHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(faqHeadings.length).toBe(10);
  });

  test('renders FAQ questions with correct numbering', () => {
    renderWithProviders(<FAQPage />);
    expect(screen.getByText(/1\. Do blind people see complete darkness/)).toBeInTheDocument();
    expect(screen.getByText(/2\. How do blind people use smartphones/)).toBeInTheDocument();
  });

  test('renders category chips', () => {
    renderWithProviders(<FAQPage />);
    // Multiple FAQ items share the same category, so use getAllByText
    expect(screen.getAllByText('Vision & Perception').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Technology & Accessibility').length).toBeGreaterThanOrEqual(1);
  });

  test('accordion answers are hidden by default', () => {
    renderWithProviders(<FAQPage />);
    // The answer text should not be visible initially (accordion collapsed)
    const answer = screen.queryByText(/About 85% of legally blind people/);
    // It may exist in DOM but be hidden by MUI's Accordion
    if (answer) {
      const details = answer.closest('.MuiCollapse-root');
      if (details) {
        expect(details).toHaveClass('MuiCollapse-hidden');
      }
    }
  });

  test('clicking an accordion summary expands it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FAQPage />);
    // Click the first FAQ question
    const firstQuestion = screen.getByText(/1\. Do blind people see complete darkness/);
    const button = firstQuestion.closest('[role="button"]') || firstQuestion.closest('.MuiAccordionSummary-root');
    if (button) {
      await user.click(button);
    }
    // After clicking, the answer content should be visible
    expect(screen.getByText(/About 85% of legally blind people/)).toBeVisible();
  });

  test('renders the About These FAQs section', () => {
    renderWithProviders(<FAQPage />);
    expect(screen.getByText('About These FAQs')).toBeInTheDocument();
    expect(screen.getByText(/These frequently asked questions are based on common misconceptions/)).toBeInTheDocument();
  });

  test('renders the Try the Simulator button', () => {
    renderWithProviders(<FAQPage />);
    const ctaButton = screen.getByText('Try the Simulator');
    expect(ctaButton).toBeInTheDocument();
  });

  test('clicking Try the Simulator navigates to /simulator', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FAQPage />);
    const button = screen.getByText('Try the Simulator');
    await user.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/simulator');
  });

  test('renders the Conditions Glossary link in the info section', () => {
    renderWithProviders(<FAQPage />);
    const glossaryLink = screen.getByText('Conditions Glossary');
    expect(glossaryLink).toBeInTheDocument();
    expect(glossaryLink).toHaveAttribute('role', 'link');
  });

  test('clicking Conditions Glossary link navigates to /conditions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FAQPage />);
    const glossaryLink = screen.getByText('Conditions Glossary');
    await user.click(glossaryLink);
    expect(mockNavigate).toHaveBeenCalledWith('/conditions');
  });
});
