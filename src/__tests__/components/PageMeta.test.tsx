import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import PageMeta, { BASE_URL, SITE_NAME } from '../../components/PageMeta';

const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe('PageMeta', () => {
  test('renders without crashing', () => {
    renderWithHelmet(
      <PageMeta title="Test Page" description="A test" path="/test" />
    );
  });

  test('sets page title with site name suffix for non-home pages', async () => {
    renderWithHelmet(
      <PageMeta title="About" description="About page" path="/about" />
    );
    await waitFor(() => {
      expect(document.title).toBe(`About | ${SITE_NAME}`);
    });
  });

  test('sets just site name as title for home page', async () => {
    renderWithHelmet(
      <PageMeta title="Home" description="Home page" path="/" />
    );
    await waitFor(() => {
      expect(document.title).toBe(SITE_NAME);
    });
  });

  test('exports correct BASE_URL and SITE_NAME', () => {
    expect(BASE_URL).toBe('https://theblind.spot');
    expect(SITE_NAME).toBe('The Blind Spot');
  });
});
