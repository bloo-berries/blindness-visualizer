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

// Mock image paths utility
jest.mock('../../utils/imagePaths', () => ({
  getPersonImagePath: (id: string) => `/images/people/${id}.webp`,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import HomePage from '../../components/HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<HomePage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the main heading with translated title keys', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText(/home\.titleHighlight/)).toBeInTheDocument();
  });

  test('has a main landmark element', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders the h1 heading', () => {
    renderWithProviders(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('renders h2 card headings', () => {
    renderWithProviders(<HomePage />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(2);
  });

  test('renders simulator card with button', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('home.card1Title')).toBeInTheDocument();
    expect(screen.getByText('home.card1Button')).toBeInTheDocument();
  });

  test('renders famous people card with button', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('home.card2Title')).toBeInTheDocument();
    expect(screen.getByText('home.card2Button')).toBeInTheDocument();
  });

  test('navigates to /simulator when simulator button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    const button = screen.getByText('home.card1Button');
    await user.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/simulator');
  });

  test('navigates to /famous-people when famous people button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    const button = screen.getByText('home.card2Button');
    await user.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/famous-people');
  });

  test('renders the Library of the Blind card with external link', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('home.libraryTitle')).toBeInTheDocument();
    expect(screen.getByText('home.libraryDescription')).toBeInTheDocument();
    const libraryLink = screen.getByText('home.libraryTitle').closest('a');
    expect(libraryLink).toHaveAttribute('href', 'https://bloo-berries.github.io/Library-of-the-Blind/');
    expect(libraryLink).toHaveAttribute('target', '_blank');
  });

  test('renders thumbnail images for famous people', () => {
    renderWithProviders(<HomePage />);
    const images = screen.getAllByRole('img');
    // Should include thumbnail people images and the comparison image
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  test('renders example comparison image', () => {
    renderWithProviders(<HomePage />);
    const comparisonImg = screen.getByAltText('Example vision condition comparison');
    expect(comparisonImg).toBeInTheDocument();
  });
});
