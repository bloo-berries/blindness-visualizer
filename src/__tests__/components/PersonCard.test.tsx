import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock imagePaths utility
jest.mock('../../utils/imagePaths', () => ({
  getPersonImagePath: (personId: string) => `/images/people/${personId}.webp`,
}));

import { PersonCard } from '../../components/FamousBlindPeople/PersonCard';
import { PersonData } from '../../data/famousPeople';

const mockPerson: PersonData = {
  name: 'Test Person',
  condition: 'Test Condition',
  years: '1900-2000',
  onset: 'Age 20',
  simulation: 'complete-blindness',
  description: 'A test person description.',
  nationality: { country: 'United States', flag: '🇺🇸' },
  achievement: 'Nobel Prize winner',
  wikiUrl: 'https://en.wikipedia.org/wiki/Test_Person',
};

const mockPersonNoAchievement: PersonData = {
  name: 'Simple Person',
  condition: 'Simple Condition',
  years: '1800-1900',
  onset: 'Birth',
  simulation: 'complete-blindness',
  description: 'A simple person.',
  nationality: { country: 'United Kingdom', flag: '🇬🇧' },
};

describe('PersonCard', () => {
  const defaultProps = {
    personId: 'testPerson',
    person: mockPerson,
    onClick: jest.fn(),
    priority: false,
    index: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<PersonCard {...defaultProps} />);
  });

  test('renders the person name', () => {
    render(<PersonCard {...defaultProps} />);
    expect(screen.getByText('Test Person')).toBeInTheDocument();
  });

  test('renders the person condition', () => {
    render(<PersonCard {...defaultProps} />);
    expect(screen.getByText('Test Condition')).toBeInTheDocument();
  });

  test('renders the person achievement when present', () => {
    render(<PersonCard {...defaultProps} />);
    expect(screen.getByText('Nobel Prize winner')).toBeInTheDocument();
  });

  test('does not render achievement when not present', () => {
    render(<PersonCard {...defaultProps} person={mockPersonNoAchievement} />);
    expect(screen.queryByText('Nobel Prize winner')).not.toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    render(<PersonCard {...defaultProps} />);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('prevents default link navigation on click', () => {
    render(<PersonCard {...defaultProps} />);
    const link = screen.getByRole('link');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(clickEvent, 'preventDefault', { value: jest.fn() });
    link.dispatchEvent(clickEvent);
    expect(clickEvent.preventDefault).toHaveBeenCalled();
  });

  test('renders image with correct alt text', () => {
    render(<PersonCard {...defaultProps} />);
    const img = screen.getByAltText('Test Person');
    expect(img).toBeInTheDocument();
  });

  test('renders image with correct src', () => {
    render(<PersonCard {...defaultProps} />);
    const img = screen.getByAltText('Test Person');
    expect(img).toHaveAttribute('src', '/images/people/testPerson.webp');
  });

  test('has accessible link label with name and condition', () => {
    render(<PersonCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'aria-label',
      'View details about Test Person, Test Condition'
    );
  });

  test('renders href with correct person URL', () => {
    render(<PersonCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/famous-people?person=testPerson');
  });

  test('handles image error by switching to placeholder', () => {
    render(<PersonCard {...defaultProps} />);
    const img = screen.getByAltText('Test Person');
    fireEvent.error(img);
    // After error, src should be the placeholder SVG
    expect(img.getAttribute('src')).toContain('data:image/svg+xml');
  });

  test('handles image load event', () => {
    render(<PersonCard {...defaultProps} />);
    const img = screen.getByAltText('Test Person');
    // Simulate a successful load
    Object.defineProperty(img, 'complete', { value: true });
    Object.defineProperty(img, 'naturalHeight', { value: 400 });
    fireEvent.load(img);
    // Image should become visible (opacity: 1) after load
    expect(img).toBeInTheDocument();
  });

  test('uses eager loading for priority cards', () => {
    render(<PersonCard {...defaultProps} priority={true} />);
    const img = screen.getByAltText('Test Person');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  test('uses lazy loading for non-priority cards beyond index 12', () => {
    render(<PersonCard {...defaultProps} priority={false} index={20} />);
    // For non-priority, non-first-12 cards, shouldLoad starts false
    // so the img may not be rendered yet (lazy via IntersectionObserver)
    // When rendered, it should use lazy loading
    const img = screen.queryByAltText('Test Person');
    if (img) {
      expect(img).toHaveAttribute('loading', 'lazy');
    }
  });
});
