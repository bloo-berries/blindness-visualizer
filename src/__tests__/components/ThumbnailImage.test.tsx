import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

import ThumbnailImage from '../../components/ThumbnailImage';

describe('ThumbnailImage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, PUBLIC_URL: '' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('renders without crashing', () => {
    const { container } = render(<ThumbnailImage conditionName="glaucoma" />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  test('renders with correct alt text', () => {
    render(<ThumbnailImage conditionName="cataracts" />);
    expect(screen.getByAltText('cataracts preview')).toBeInTheDocument();
  });

  test('uses .webp extension by default when no imagePath is provided', () => {
    render(<ThumbnailImage conditionName="glaucoma" />);
    const img = screen.getByAltText('glaucoma preview');
    expect(img).toHaveAttribute('src', '/images/glossary/glaucoma.webp');
  });

  test('uses provided imagePath when given', () => {
    render(<ThumbnailImage conditionName="test" imagePath="/custom/path.jpg" />);
    const img = screen.getByAltText('test preview');
    expect(img).toHaveAttribute('src', '/custom/path.jpg');
  });

  test('falls back to .png when .webp fails to load', () => {
    render(<ThumbnailImage conditionName="amd" />);
    const img = screen.getByAltText('amd preview');
    expect(img).toHaveAttribute('src', '/images/glossary/amd.webp');

    // Simulate .webp load error
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', '/images/glossary/amd.png');
  });

  test('renders null when both .webp and .png fail', () => {
    const { container } = render(<ThumbnailImage conditionName="unknown" />);
    const img = container.querySelector('img')!;

    // First error: .webp fails, falls back to .png
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/images/glossary/unknown.png');

    // Second error: .png also fails
    fireEvent.error(img);

    // Component should render nothing
    expect(container.querySelector('img')).toBeNull();
  });

  test('applies correct inline styles', () => {
    render(<ThumbnailImage conditionName="test" />);
    const img = screen.getByAltText('test preview');
    expect(img).toHaveStyle({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    });
  });

  test('uses PUBLIC_URL in image path', () => {
    process.env.PUBLIC_URL = '/blindness-visualizer';
    render(<ThumbnailImage conditionName="scotoma" />);
    const img = screen.getByAltText('scotoma preview');
    expect(img).toHaveAttribute('src', '/blindness-visualizer/images/glossary/scotoma.webp');
  });

  test('resets error state when conditionName changes', () => {
    const { rerender, container } = render(<ThumbnailImage conditionName="first" />);
    const img = container.querySelector('img')!;

    // Trigger errors to set hasError
    fireEvent.error(img);
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();

    // Change conditionName - should reset and try again
    rerender(<ThumbnailImage conditionName="second" />);
    const newImg = container.querySelector('img');
    expect(newImg).toBeInTheDocument();
    expect(newImg).toHaveAttribute('src', '/images/glossary/second.webp');
  });

  test('resets error state when imagePath changes', () => {
    const { rerender, container } = render(<ThumbnailImage conditionName="test" imagePath="/a.jpg" />);
    const img = container.querySelector('img')!;

    // Trigger error (imagePath doesn't end in .webp, so goes straight to hasError)
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();

    // Change imagePath - should reset
    rerender(<ThumbnailImage conditionName="test" imagePath="/b.jpg" />);
    const newImg = container.querySelector('img');
    expect(newImg).toBeInTheDocument();
    expect(newImg).toHaveAttribute('src', '/b.jpg');
  });

  test('does not fall back to .png when custom imagePath fails', () => {
    const { container } = render(<ThumbnailImage conditionName="test" imagePath="/custom.jpg" />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('src', '/custom.jpg');

    // Error on custom path (not .webp) should set hasError directly
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
  });

  test('alt text includes condition name', () => {
    render(<ThumbnailImage conditionName="diabeticRetinopathy" />);
    expect(screen.getByAltText('diabeticRetinopathy preview')).toBeInTheDocument();
  });
});
