import React from 'react';
import { screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallbackOrParams?: string | Record<string, unknown>) => {
      if (typeof fallbackOrParams === 'string') return fallbackOrParams;
      return key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock sub-components to isolate unit behavior
jest.mock('../../components/FamousBlindPeople/PersonCard', () => ({
  PersonCard: ({ personId, person, onClick }: any) => (
    <div data-testid={`person-card-${personId}`} onClick={onClick}>
      <span data-testid="card-name">{person.name}</span>
      <span data-testid="card-condition">{person.condition}</span>
    </div>
  ),
}));

jest.mock('../../components/FamousBlindPeople/PersonDialog', () => ({
  PersonDialog: ({ open, person, onClose }: any) =>
    open ? (
      <div data-testid="person-dialog">
        <span>{person?.name}</span>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock('../../components/NavigationBar', () => () => <nav data-testid="navbar" />);
jest.mock('../../components/Footer', () => () => <footer data-testid="footer" />);
jest.mock('../../components/PageMeta', () => {
  const PageMeta = () => null;
  (PageMeta as any).BASE_URL = 'https://theblind.spot';
  return { __esModule: true, default: PageMeta, BASE_URL: 'https://theblind.spot' };
});

// Mock the hooks module
jest.mock('../../hooks', () => ({
  useDebounce: (value: string) => value,
  useAnimationTicker: () => 0,
}));

import FamousBlindPeople from '../../components/FamousBlindPeople';
import { personData, categories } from '../../data/famousPeople';
import { PERSON_IDS } from '../../data/famousPeople/constants';

describe('FamousBlindPeople', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByText('famousPeople.title')).toBeInTheDocument();
  });

  test('renders the page subtitle', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByText('famousPeople.subtitle')).toBeInTheDocument();
  });

  test('renders navigation bar and footer', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders search input field', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const searchInput = screen.getByLabelText('famousPeople.searchPlaceholder');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders category filter dropdown', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    // MUI Select renders the label text in multiple DOM elements (label + legend)
    const labels = screen.getAllByText('famousPeople.categoryLabel');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  test('renders condition filter dropdown', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const labels = screen.getAllByText('famousPeople.conditionLabel');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  test('renders country filter dropdown', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    // The t function with fallback returns the fallback string 'Country'
    const labels = screen.getAllByText('Country');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  test('displays person cards for all people', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    // Check that at least some person cards are rendered
    const firstPersonId = PERSON_IDS[0];
    expect(screen.getByTestId(`person-card-${firstPersonId}`)).toBeInTheDocument();
  });

  test('displays category section headers', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    // The t function with fallback returns the category.name (second arg)
    // t(`famousPeople.categories.${category.id}`, category.name) returns category.name
    categories.forEach(category => {
      // getAllByText because the category name may appear both in the header and filter dropdown
      const elements = screen.getAllByText(category.name);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('renders showing results count text', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByText('famousPeople.showingResults')).toBeInTheDocument();
  });

  test('renders clear filters button', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByText('buttons.clearFilters')).toBeInTheDocument();
  });

  test('renders random person button', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    // t('famousPeople.randomPerson', 'Random Person') returns fallback 'Random Person'
    expect(screen.getByText('Random Person')).toBeInTheDocument();
  });

  test('renders hide total darkness toggle', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    expect(screen.getByText('famousPeople.hideTotalDarkness')).toBeInTheDocument();
  });

  test('opens person dialog when a card is clicked', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const firstPersonId = PERSON_IDS[0];
    const card = screen.getByTestId(`person-card-${firstPersonId}`);
    fireEvent.click(card);
    expect(screen.getByTestId('person-dialog')).toBeInTheDocument();
  });

  test('closes person dialog when close is clicked', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const firstPersonId = PERSON_IDS[0];
    const card = screen.getByTestId(`person-card-${firstPersonId}`);
    fireEvent.click(card);
    expect(screen.getByTestId('person-dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('person-dialog')).not.toBeInTheDocument();
  });

  test('filters people by search term', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const searchInput = screen.getByLabelText('famousPeople.searchPlaceholder');

    // Search for a person by name — the debounce is mocked to return immediately
    const firstPerson = personData[PERSON_IDS[0]];
    fireEvent.change(searchInput, { target: { value: firstPerson.name } });

    // The first person's card should still be visible
    expect(screen.getByTestId(`person-card-${PERSON_IDS[0]}`)).toBeInTheDocument();
  });

  test('shows no results message when search yields nothing', () => {
    renderWithProviders(<FamousBlindPeople />, { route: '/famous-people' });
    const searchInput = screen.getByLabelText('famousPeople.searchPlaceholder');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistentpersonxyz' } });

    expect(screen.getByText('famousPeople.noResults')).toBeInTheDocument();
  });
});
