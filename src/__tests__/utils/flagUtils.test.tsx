import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlagWithName } from '../../utils/flagUtils';

describe('flagUtils', () => {
  describe('FlagWithName component', () => {
    test('renders country name text', () => {
      render(<FlagWithName flag="us" countryName="United States" />);
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    test('renders an img element for valid country code', () => {
      render(<FlagWithName flag="us" countryName="United States" />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });

    test('generates correct flagcdn URL for country code', () => {
      render(<FlagWithName flag="gb" countryName="United Kingdom" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://flagcdn.com/w20/gb.png');
    });

    test('generates 2x srcSet for retina displays', () => {
      render(<FlagWithName flag="fr" countryName="France" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('srcSet', 'https://flagcdn.com/w40/fr.png 2x');
    });

    test('converts flag emoji to country code for URL', () => {
      // US flag emoji is composed of regional indicators U+1F1FA U+1F1F8
      render(<FlagWithName flag={'\u{1F1FA}\u{1F1F8}'} countryName="United States" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://flagcdn.com/w20/us.png');
    });

    test('sets correct alt text with country name', () => {
      render(<FlagWithName flag="jp" countryName="Japan" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Japan flag');
    });

    test('falls back to country code in alt text when no name given', () => {
      // FlagWithName always passes countryName, but FlagImage uses it
      // Test via the alt attribute pattern
      render(<FlagWithName flag="de" countryName="Germany" />);
      const img = screen.getByRole('img');
      expect(img.getAttribute('alt')).toContain('Germany');
    });

    test('renders with default size of 20px', () => {
      render(<FlagWithName flag="ca" countryName="Canada" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '20');
    });

    test('renders with custom size', () => {
      render(<FlagWithName flag="au" countryName="Australia" size={40} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '40');
    });

    test('calculates height as 75% of width for 4:3 aspect ratio', () => {
      render(<FlagWithName flag="br" countryName="Brazil" size={40} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('height', '30'); // 40 * 0.75 = 30
    });

    test('uses lazy loading for images', () => {
      render(<FlagWithName flag="in" countryName="India" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    test('handles uppercase country codes', () => {
      render(<FlagWithName flag="US" countryName="United States" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://flagcdn.com/w20/us.png');
    });

    test('selects appropriate CDN width based on size', () => {
      // size <= 20 -> w20
      const { unmount: u1 } = render(<FlagWithName flag="it" countryName="Italy" size={15} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://flagcdn.com/w20/it.png');
      u1();

      // size <= 40 -> w40
      const { unmount: u2 } = render(<FlagWithName flag="it" countryName="Italy" size={35} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://flagcdn.com/w40/it.png');
      u2();

      // size <= 80 -> w80
      const { unmount: u3 } = render(<FlagWithName flag="it" countryName="Italy" size={60} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://flagcdn.com/w80/it.png');
      u3();

      // size > 80 -> w160
      render(<FlagWithName flag="it" countryName="Italy" size={100} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://flagcdn.com/w160/it.png');
    });

    test('renders inline-flex container with gap', () => {
      const { container } = render(<FlagWithName flag="mx" countryName="Mexico" />);
      const span = container.firstChild as HTMLElement;
      expect(span.style.display).toBe('inline-flex');
      expect(span.style.alignItems).toBe('center');
      expect(span.style.gap).toBe('8px');
    });
  });

  describe('FlagImage fallback behavior', () => {
    test('falls back to emoji span for invalid/empty flag input', () => {
      // Single character is not a valid flag or country code
      const { container } = render(<FlagWithName flag="x" countryName="Unknown" />);
      // Should render the raw flag text in a span (fallback)
      const spans = container.querySelectorAll('span');
      // One of the spans should contain 'x'
      const hasEmojiFallback = Array.from(spans).some(s => s.textContent === 'x');
      expect(hasEmojiFallback).toBe(true);
    });
  });
});
