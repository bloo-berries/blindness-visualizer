import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../testUtils';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string | Record<string, unknown>) => {
      const map: Record<string, string> = {
        'inputSelector.demoVideo': 'Demo Video',
        'inputSelector.demoVideoDesc': 'Watch a pre-recorded video with effects',
        'inputSelector.uploadImage': 'Upload Image',
        'inputSelector.uploadImageDesc': 'Upload your own image for simulation',
        'inputSelector.webcam': 'Webcam',
        'inputSelector.webcamDesc': 'Use your webcam for live simulation',
        'inputSelector.comingSoon': 'Coming Soon: Premium Feature',
        'inputSelector.dataPolicy': 'Data Policy',
        'inputSelector.dataPolicyPrivacy': 'Your privacy is protected.',
        'inputSelector.dataPolicyBody1': 'Images stay on your device.',
        'inputSelector.dataPolicyBody2': 'Deleted when you leave.',
        'inputSelector.dataPolicyBody3': 'No backend server.',
        'inputSelector.gotIt': 'Got it',
        'inputSelector.invalidFileType': 'Please select a valid image file.',
        'inputSelector.fileTooLarge': 'File is too large. Maximum size is 20MB.',
      };
      if (typeof fallback === 'string') return map[key] || fallback;
      return map[key] || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

import InputSelector from '../../components/InputSelector';
import { InputSource } from '../../types/visualEffects';

describe('InputSelector', () => {
  const defaultSource: InputSource = { type: 'youtube' };
  const mockOnSourceChange = jest.fn();

  beforeEach(() => {
    mockOnSourceChange.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByText('Demo Video')).toBeInTheDocument();
  });

  test('shows the demo video option', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByText('Demo Video')).toBeInTheDocument();
    expect(screen.getByText('Watch a pre-recorded video with effects')).toBeInTheDocument();
  });

  test('shows the upload image option', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Upload your own image for simulation')).toBeInTheDocument();
  });

  test('shows premium options as disabled', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByText('Webcam')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    // Premium options should show coming soon chips
    const comingSoonChips = screen.getAllByText('Coming Soon: Premium Feature');
    expect(comingSoonChips).toHaveLength(2);
  });

  test('premium options have tabIndex -1 (not focusable)', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    const webcamCard = screen.getByLabelText(/Webcam.*Coming Soon/i);
    expect(webcamCard).toHaveAttribute('tabindex', '-1');
  });

  test('demo video card is marked as pressed when youtube is selected', () => {
    renderWithProviders(
      <InputSelector currentSource={{ type: 'youtube' }} onSourceChange={mockOnSourceChange} />
    );
    const youtubeButton = screen.getByRole('button', { name: 'Demo Video' });
    expect(youtubeButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('calls onSourceChange with youtube type when demo video is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InputSelector
        currentSource={{ type: 'image', url: 'blob:test' }}
        onSourceChange={mockOnSourceChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Demo Video' }));
    expect(mockOnSourceChange).toHaveBeenCalledWith({ type: 'youtube' });
  });

  test('demo video card responds to keyboard Enter', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InputSelector
        currentSource={{ type: 'image', url: 'blob:test' }}
        onSourceChange={mockOnSourceChange}
      />
    );
    const youtubeButton = screen.getByRole('button', { name: 'Demo Video' });
    youtubeButton.focus();
    await user.keyboard('{Enter}');
    expect(mockOnSourceChange).toHaveBeenCalledWith({ type: 'youtube' });
  });

  test('shows data policy link', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByText('Data Policy')).toBeInTheDocument();
  });

  test('opens data policy dialog on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    await user.click(screen.getByText('Data Policy'));
    expect(screen.getByText('Your privacy is protected.')).toBeInTheDocument();
    expect(screen.getByText('Images stay on your device.')).toBeInTheDocument();
  });

  test('closes data policy dialog with Got it button', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    await user.click(screen.getByText('Data Policy'));
    expect(screen.getByText('Your privacy is protected.')).toBeInTheDocument();
    await user.click(screen.getByText('Got it'));
    // Wait for the dialog to animate closed
    await waitFor(() => {
      expect(screen.queryByText('Your privacy is protected.')).not.toBeInTheDocument();
    });
  });

  test('has a hidden file input for image uploads', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    const fileInput = screen.getByLabelText('Upload an image');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  test('image card aria-pressed reflects image source selection', () => {
    renderWithProviders(
      <InputSelector
        currentSource={{ type: 'image', url: 'blob:test' }}
        onSourceChange={mockOnSourceChange}
      />
    );
    const imageButton = screen.getByRole('button', { name: 'Upload Image' });
    expect(imageButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('region role is set on the container', () => {
    renderWithProviders(
      <InputSelector currentSource={defaultSource} onSourceChange={mockOnSourceChange} />
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});
