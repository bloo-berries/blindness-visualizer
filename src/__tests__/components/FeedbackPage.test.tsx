import React from 'react';
import { screen } from '@testing-library/react';
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

// Mock the email service
const mockSendFeedback = jest.fn();
jest.mock('../../utils/emailService', () => ({
  sendFeedbackEmailServerless: (...args: any[]) => mockSendFeedback(...args),
}));

import FeedbackPage from '../../components/FeedbackPage';

describe('FeedbackPage', () => {
  beforeEach(() => {
    mockSendFeedback.mockClear();
    mockSendFeedback.mockResolvedValue(undefined);
  });

  test('renders without crashing', () => {
    renderWithProviders(<FeedbackPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<FeedbackPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<FeedbackPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the page title heading', () => {
    renderWithProviders(<FeedbackPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('feedbackPage.title');
  });

  test('renders the subtitle', () => {
    renderWithProviders(<FeedbackPage />);
    expect(screen.getByText('feedbackPage.subtitle')).toBeInTheDocument();
  });

  test('renders the feedback form', () => {
    renderWithProviders(<FeedbackPage />);
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  test('renders feedback type selector chips', () => {
    renderWithProviders(<FeedbackPage />);
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    // 5 feedback type chips
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(5);
  });

  test('renders required form fields (name, email, subject, message)', () => {
    renderWithProviders(<FeedbackPage />);
    // 4 required text fields: name, email, subject, message
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes.length).toBeGreaterThanOrEqual(4);
  });

  test('renders the submit button', () => {
    renderWithProviders(<FeedbackPage />);
    const submitButton = screen.getByRole('button', { name: /feedbackPage\.submit\.button/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    renderWithProviders(<FeedbackPage />);
    const submitButton = screen.getByRole('button', { name: /feedbackPage\.submit\.button/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button becomes enabled when required fields are filled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeedbackPage />);

    const textboxes = screen.getAllByRole('textbox');
    // Fill all textboxes (name, email, subject, message)
    for (const textbox of textboxes) {
      await user.type(textbox, 'test value');
    }

    const submitButton = screen.getByRole('button', { name: /feedbackPage\.submit\.button/i });
    expect(submitButton).toBeEnabled();
  });

  test('renders rating buttons for general feedback type', () => {
    renderWithProviders(<FeedbackPage />);
    // Default type is "general", so rating section should appear
    const ratingGroup = screen.getByRole('group');
    expect(ratingGroup).toBeInTheDocument();
    // 5 rating buttons (1-5)
    const ratingButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.includes('out of 5')
    );
    expect(ratingButtons.length).toBe(5);
  });

  test('submitting form calls the email service', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeedbackPage />);

    // Fill required fields
    const textboxes = screen.getAllByRole('textbox');
    for (const textbox of textboxes) {
      await user.type(textbox, 'test');
    }

    const submitButton = screen.getByRole('button', { name: /feedbackPage\.submit\.button/i });
    await user.click(submitButton);

    expect(mockSendFeedback).toHaveBeenCalledTimes(1);
  });

  test('shows error snackbar when submission fails', async () => {
    mockSendFeedback.mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    renderWithProviders(<FeedbackPage />);

    const textboxes = screen.getAllByRole('textbox');
    for (const textbox of textboxes) {
      await user.type(textbox, 'test');
    }

    const submitButton = screen.getByRole('button', { name: /feedbackPage\.submit\.button/i });
    await user.click(submitButton);

    // Error alert should appear
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('has a main content landmark', () => {
    renderWithProviders(<FeedbackPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
