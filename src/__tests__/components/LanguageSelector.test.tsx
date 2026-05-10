import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n module
jest.mock('../../i18n', () => ({
  supportedLanguages: {
    en: { name: 'English', nativeName: 'English', dir: 'ltr' },
    es: { name: 'Spanish', nativeName: 'Espanol', dir: 'ltr' },
    fr: { name: 'French', nativeName: 'Francais', dir: 'ltr' },
    ar: { name: 'Arabic', nativeName: 'Arabic-native', dir: 'rtl' },
  },
}));

const mockChangeLanguage = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: mockChangeLanguage },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

import LanguageSelector from '../../components/LanguageSelector';

describe('LanguageSelector', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<LanguageSelector />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders language icon button with correct aria-label', () => {
    renderWithProviders(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'language.select' });
    expect(button).toBeInTheDocument();
  });

  test('has aria-haspopup attribute', () => {
    renderWithProviders(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'language.select' });
    expect(button).toHaveAttribute('aria-haspopup', 'true');
  });

  test('menu is initially closed', () => {
    renderWithProviders(<LanguageSelector />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('opens language menu on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('shows all supported languages in the menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Espanol')).toBeInTheDocument();
    expect(screen.getByText('Francais')).toBeInTheDocument();
    expect(screen.getByText('Arabic-native')).toBeInTheDocument();
  });

  test('marks the current language as selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    const options = screen.getAllByRole('option');
    const englishOption = options.find(opt => within(opt).queryByText('English'));
    expect(englishOption).toHaveAttribute('aria-selected', 'true');
  });

  test('non-current languages are not marked as selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    const options = screen.getAllByRole('option');
    const spanishOption = options.find(opt => within(opt).queryByText('Espanol'));
    expect(spanishOption).toHaveAttribute('aria-selected', 'false');
  });

  test('calls changeLanguage when a different language is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    await user.click(screen.getByText('Espanol'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  test('closes menu after selecting a language', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByText('Francais'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('sets aria-expanded to true when menu is open', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'language.select' });
    expect(button).not.toHaveAttribute('aria-expanded', 'true');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('renders the correct number of language options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  test('calls changeLanguage with the correct language code for each option', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'language.select' }));
    await user.click(screen.getByText('Arabic-native'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });
});
