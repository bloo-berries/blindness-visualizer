import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallbackOrOpts?: any) => {
      if (typeof fallbackOrOpts === 'string') return fallbackOrOpts;
      if (fallbackOrOpts && typeof fallbackOrOpts === 'object' && 'returnObjects' in fallbackOrOpts) {
        return [];
      }
      return key;
    },
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
jest.mock('../../components/ThumbnailImage', () => {
  return function MockThumbnailImage({ conditionName }: { conditionName: string }) {
    return <img data-testid={`thumb-${conditionName}`} alt={conditionName} />;
  };
});

// Mock condition categories with minimal data
jest.mock('../../data/conditionCategories', () => ({
  conditionCategories: [
    {
      id: 'color-vision',
      name: 'Color Vision Deficiency',
      icon: null,
      description: 'Color blindness conditions',
      conditions: [
        {
          id: 'protanopia',
          name: 'Protanopia',
          description: 'Red-green color blindness',
          relatedPeople: ['John Dalton'],
          treatments: {
            available: true,
            options: ['Color-correcting lenses'],
            notes: 'No cure, but aids available',
          },
        },
        {
          id: 'deuteranopia',
          name: 'Deuteranopia',
          description: 'Green color blindness',
        },
      ],
    },
    {
      id: 'retinal',
      name: 'Retinal Conditions',
      icon: null,
      description: 'Diseases of the retina',
      conditions: [
        {
          id: 'amd',
          name: 'Age-Related Macular Degeneration',
          description: 'Deterioration of the macula',
        },
      ],
    },
  ],
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import ConditionsPage from '../../components/ConditionsPage';

describe('ConditionsPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<ConditionsPage />);
  });

  test('renders NavigationBar', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Footer', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the page title heading', () => {
    renderWithProviders(<ConditionsPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('renders Glossary and FAQ tabs', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(2);
  });

  test('renders search input field', () => {
    renderWithProviders(<ConditionsPage />);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders category filter dropdown', () => {
    renderWithProviders(<ConditionsPage />);
    // MUI Select uses a combobox or button role
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  test('renders condition category accordions', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByText('Color Vision Deficiency')).toBeInTheDocument();
    expect(screen.getByText('Retinal Conditions')).toBeInTheDocument();
  });

  test('renders condition count in stats text', () => {
    renderWithProviders(<ConditionsPage />);
    // The stats line uses the translation key with count
    expect(screen.getByText(/glossaryPage\.conditionsFound/)).toBeInTheDocument();
  });

  test('renders clear filters button', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByText('glossaryPage.clearFilters')).toBeInTheDocument();
  });

  test('expanding a category shows conditions inside', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConditionsPage />);
    // Click on the Color Vision Deficiency accordion
    const categoryHeader = screen.getByText('Color Vision Deficiency');
    const accordionButton = categoryHeader.closest('[role="button"]') || categoryHeader.closest('.MuiAccordionSummary-root');
    if (accordionButton) {
      await user.click(accordionButton);
    }
    expect(screen.getByText('Protanopia')).toBeVisible();
    expect(screen.getByText('Deuteranopia')).toBeVisible();
  });

  test('search filters conditions by name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConditionsPage />);
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Protanopia');
    // After typing, only the matching category should remain
    expect(screen.getByText('Color Vision Deficiency')).toBeInTheDocument();
    expect(screen.queryByText('Retinal Conditions')).not.toBeInTheDocument();
  });

  test('switching to FAQ tab hides glossary content', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConditionsPage />);
    const tabs = screen.getAllByRole('tab');
    await user.click(tabs[1]); // Click FAQ tab
    // Glossary-specific elements should be gone
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('renders about glossary section', () => {
    renderWithProviders(<ConditionsPage />);
    expect(screen.getByText('glossaryPage.aboutGlossary.title')).toBeInTheDocument();
  });
});
