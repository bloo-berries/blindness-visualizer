import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
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

import NotFoundPage from '../../components/NotFoundPage';

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<NotFoundPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('displays 404 text', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('displays the 404 as an h1', () => {
    renderWithProviders(<NotFoundPage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('404');
  });

  test('displays Page Not Found title', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('displays description text', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
  });

  test('renders Home navigation button', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('renders Simulator navigation button', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Simulator')).toBeInTheDocument();
  });

  test('renders Famous People navigation button', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Famous People')).toBeInTheDocument();
  });

  test('clicking Home button navigates to /', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotFoundPage />);
    await user.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('clicking Simulator button navigates to /simulator', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotFoundPage />);
    await user.click(screen.getByText('Simulator'));
    expect(mockNavigate).toHaveBeenCalledWith('/simulator');
  });

  test('clicking Famous People button navigates to /famous-people', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotFoundPage />);
    await user.click(screen.getByText('Famous People'));
    expect(mockNavigate).toHaveBeenCalledWith('/famous-people');
  });

  test('has three navigation buttons total', () => {
    renderWithProviders(<NotFoundPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });
});
