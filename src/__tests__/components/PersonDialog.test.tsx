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

// Mock EmbeddedVisualization to isolate dialog behavior
jest.mock('../../components/FamousBlindPeople/EmbeddedVisualization', () => ({
  EmbeddedVisualization: ({ personName }: any) => (
    <div data-testid="embedded-visualization">{personName}</div>
  ),
}));

// Mock imagePaths utilities
jest.mock('../../utils/imagePaths', () => ({
  getPersonImagePath: (personId: string) => `/images/people/${personId}.webp`,
  getPersonSecondaryImages: () => [],
  getPeopleImagePath: (filename: string) => `/images/people/${filename}`,
  PLACEHOLDER_IMAGE: 'data:image/svg+xml,placeholder',
}));

// Mock famousPeopleUtils
jest.mock('../../utils/famousPeopleUtils', () => ({
  parseDescriptionWithLinks: (text: string) => text,
  getWebsiteUrl: () => null,
}));

import { PersonDialog } from '../../components/FamousBlindPeople/PersonDialog';
import { PersonData } from '../../data/famousPeople';

const mockPerson: PersonData = {
  name: 'Claude Monet',
  condition: 'Cataracts',
  years: '1840-1926',
  onset: 'Age 72',
  simulation: 'cataracts',
  description: 'French Impressionist painter who developed cataracts in later life.',
  nationality: { country: 'France', flag: '🇫🇷' },
  achievement: 'Pioneer of Impressionism',
  wikiUrl: 'https://en.wikipedia.org/wiki/Claude_Monet',
};

const mockPersonWithBullets: PersonData = {
  name: 'Test Person',
  condition: 'Test Condition',
  years: '1900-2000',
  onset: 'Age 30',
  simulation: 'complete-blindness',
  description: 'Main description text. • Bullet point one • Bullet point two',
  nationality: { country: 'United States', flag: '🇺🇸' },
};

const filteredPeople = ['monet', 'georgia', 'testPerson'];

describe('PersonDialog', () => {
  const defaultProps = {
    open: true,
    personId: 'monet',
    person: mockPerson,
    filteredPeople,
    onClose: jest.fn(),
    onNavigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when open is true', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    render(<PersonDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('does not render when person is null', () => {
    render(<PersonDialog {...defaultProps} person={null} personId={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('displays person name in dialog title', () => {
    render(<PersonDialog {...defaultProps} />);
    // Name appears in title (h5) and embedded visualization mock — use getAllByText
    const nameElements = screen.getAllByText('Claude Monet');
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
    // The first one should be in the dialog title
    expect(nameElements[0].tagName).toBe('H5');
  });

  test('displays person condition', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByText('Cataracts')).toBeInTheDocument();
  });

  test('displays person achievement when present', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByText('Pioneer of Impressionism')).toBeInTheDocument();
  });

  test('displays onset information', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByText('Age 72')).toBeInTheDocument();
  });

  test('displays person description', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByText(/French Impressionist painter/)).toBeInTheDocument();
  });

  test('has close button that calls onClose', () => {
    render(<PersonDialog {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('has share button', () => {
    render(<PersonDialog {...defaultProps} />);
    const shareButton = screen.getByLabelText('Share profile');
    expect(shareButton).toBeInTheDocument();
  });

  test('renders person image with correct alt text', () => {
    render(<PersonDialog {...defaultProps} />);
    const img = screen.getByAltText('Claude Monet');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/people/monet.webp');
  });

  test('renders Wikipedia link when wikiUrl is provided', () => {
    render(<PersonDialog {...defaultProps} />);
    const wikiLink = screen.getByText('Wikipedia');
    expect(wikiLink).toBeInTheDocument();
    expect(wikiLink.closest('a')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Claude_Monet');
  });

  test('renders embedded visualization component', () => {
    render(<PersonDialog {...defaultProps} />);
    expect(screen.getByTestId('embedded-visualization')).toBeInTheDocument();
    expect(screen.getByTestId('embedded-visualization')).toHaveTextContent('Claude Monet');
  });

  test('renders next navigation button when there is a next person', () => {
    // monet is at index 0, so hasNext = true
    render(<PersonDialog {...defaultProps} />);
    const nextButton = screen.getByLabelText('Next person');
    expect(nextButton).toBeInTheDocument();
  });

  test('does not render previous button when at first person', () => {
    // monet is at index 0, so hasPrevious = false
    render(<PersonDialog {...defaultProps} />);
    expect(screen.queryByLabelText('Previous person')).not.toBeInTheDocument();
  });

  test('renders previous button when not at first person', () => {
    render(<PersonDialog {...defaultProps} personId="georgia" />);
    const prevButton = screen.getByLabelText('Previous person');
    expect(prevButton).toBeInTheDocument();
  });

  test('calls onNavigate with next person when next button clicked', () => {
    render(<PersonDialog {...defaultProps} />);
    const nextButton = screen.getByLabelText('Next person');
    fireEvent.click(nextButton);
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('georgia');
  });

  test('calls onNavigate with previous person when previous button clicked', () => {
    render(<PersonDialog {...defaultProps} personId="georgia" />);
    const prevButton = screen.getByLabelText('Previous person');
    fireEvent.click(prevButton);
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('monet');
  });

  test('share button copies link to clipboard', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
      share: undefined,
    });

    render(<PersonDialog {...defaultProps} />);
    const shareButton = screen.getByLabelText('Share profile');
    fireEvent.click(shareButton);

    await screen.findByText('Link copied to clipboard!');
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('?person=monet'));
  });

  test('share falls back to execCommand when clipboard API fails', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error('fail')) },
      share: undefined,
    });
    document.execCommand = jest.fn();

    render(<PersonDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Share profile'));

    await screen.findByText('Link copied to clipboard!');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('ArrowRight key navigates to next person', () => {
    render(<PersonDialog {...defaultProps} />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('georgia');
  });

  test('ArrowLeft key navigates to previous person', () => {
    render(<PersonDialog {...defaultProps} personId="georgia" />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('monet');
  });

  test('ArrowLeft does nothing when at first person', () => {
    render(<PersonDialog {...defaultProps} />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(defaultProps.onNavigate).not.toHaveBeenCalled();
  });

  test('image shows skeleton before loading', () => {
    render(<PersonDialog {...defaultProps} />);
    // The image should be hidden before load and skeleton visible
    const img = screen.getByAltText('Claude Monet');
    expect(img.style.display).toBe('none');
  });

  test('image becomes visible after onLoad', () => {
    render(<PersonDialog {...defaultProps} />);
    const img = screen.getByAltText('Claude Monet');
    fireEvent.load(img);
    expect(img.style.display).toBe('block');
  });

  test('image error sets placeholder src', () => {
    render(<PersonDialog {...defaultProps} />);
    const img = screen.getByAltText('Claude Monet');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', 'data:image/svg+xml,placeholder');
  });

  test('description with bullet points renders list items', () => {
    render(<PersonDialog {...defaultProps} person={mockPersonWithBullets} personId="testPerson" />);
    expect(screen.getByText('Bullet point one')).toBeInTheDocument();
    expect(screen.getByText('Bullet point two')).toBeInTheDocument();
  });
});
