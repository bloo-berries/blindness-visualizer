import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders, makeEffect } from '../testUtils';
import { VisualEffect } from '../../types/visualEffects';

// Mock i18n module
jest.mock('../../i18n', () => ({}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const map: Record<string, string> = {
        'presets.save': 'Save',
        'presets.share': 'Share',
        'presets.myPresets': 'My Presets',
        'presets.namePlaceholder': 'Preset name...',
        'presets.saveTooltip': 'Save current conditions as a preset',
        'presets.shareTooltip': 'Generate a shareable link',
        'presets.saved': 'Preset saved!',
        'presets.loaded': 'Loaded preset',
        'presets.myPresetsTitle': 'My Saved Presets',
        'presets.noPresets': 'No saved presets yet.',
        'presets.shareTitle': 'Share Simulation',
        'presets.activeConditions': 'Active Conditions',
        'presets.shareableLink': 'Shareable Link',
        'presets.linkCopied': 'Link copied to clipboard!',
        'presets.copyFailed': 'Failed to copy link',
        'presets.donationText': 'Help us keep this free',
        'presets.supportUs': 'Support The Blind Spot',
        'presets.nativeShare': 'Share via...',
        'common.cancel': 'Close',
      };
      return map[key] || fallback || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// Mock QRCodeSVG
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value}>QR Code</div>
  ),
}));

import PresetManager from '../../components/PresetManager';

describe('PresetManager', () => {
  const mockOnLoadPreset = jest.fn();
  let localStorageMock: Record<string, string>;

  const noEffects: VisualEffect[] = [
    makeEffect('protanopia', false, 0.5),
    makeEffect('glaucoma', false, 0.7),
  ];

  const someEnabledEffects: VisualEffect[] = [
    makeEffect('protanopia', true, 0.8),
    makeEffect('glaucoma', true, 0.5),
    makeEffect('cataracts', false, 0.3),
  ];

  beforeEach(() => {
    mockOnLoadPreset.mockClear();
    localStorageMock = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => localStorageMock[key] || null
    );
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { localStorageMock[key] = value; }
    );
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete localStorageMock[key]; }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    renderWithProviders(
      <PresetManager effects={noEffects} onLoadPreset={mockOnLoadPreset} />
    );
    expect(screen.getByPlaceholderText('Preset name...')).toBeInTheDocument();
  });

  test('renders save button and share button', () => {
    renderWithProviders(
      <PresetManager effects={noEffects} onLoadPreset={mockOnLoadPreset} />
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  test('save button is disabled when no preset name is entered', () => {
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const saveButton = screen.getByText('Save').closest('button')!;
    expect(saveButton).toBeDisabled();
  });

  test('save button is disabled when no effects are enabled', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={noEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'My Preset');
    const saveButton = screen.getByText('Save').closest('button')!;
    expect(saveButton).toBeDisabled();
  });

  test('share button is disabled when no effects are enabled', () => {
    renderWithProviders(
      <PresetManager effects={noEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const shareButton = screen.getByText('Share').closest('button')!;
    expect(shareButton).toBeDisabled();
  });

  test('save button is enabled when name is entered and effects are enabled', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'Test Preset');
    const saveButton = screen.getByText('Save').closest('button')!;
    expect(saveButton).toBeEnabled();
  });

  test('saves preset to localStorage on save', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'My First Preset');
    await user.click(screen.getByText('Save'));

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'vision-presets',
      expect.any(String)
    );
    const saved = JSON.parse(localStorageMock['vision-presets']);
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('My First Preset');
    expect(saved[0].conditions).toHaveLength(2); // only enabled effects
  });

  test('clears preset name input after saving', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'Test Preset');
    await user.click(screen.getByText('Save'));
    expect(input).toHaveValue('');
  });

  test('shows My Presets button after saving a preset', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    expect(screen.queryByText(/My Presets/)).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'Saved Preset');
    await user.click(screen.getByText('Save'));
    expect(screen.getByText(/My Presets.*\(1\)/)).toBeInTheDocument();
  });

  test('opens share dialog when share button is clicked with enabled effects', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    await user.click(screen.getByText('Share'));
    expect(screen.getByText('Share Simulation')).toBeInTheDocument();
    expect(screen.getByText('Active Conditions')).toBeInTheDocument();
    expect(screen.getByText('Shareable Link')).toBeInTheDocument();
  });

  test('share dialog shows active conditions as chips', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    await user.click(screen.getByText('Share'));
    // Enabled effects are protanopia (80%) and glaucoma (50%)
    expect(screen.getByText('Effect protanopia (80%)')).toBeInTheDocument();
    expect(screen.getByText('Effect glaucoma (50%)')).toBeInTheDocument();
  });

  test('share dialog generates a shareable URL', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    await user.click(screen.getByText('Share'));
    // The URL field should contain a preset parameter
    const urlInput = screen.getAllByRole('textbox').find(
      input => (input as HTMLInputElement).value.includes('preset=')
    );
    expect(urlInput).toBeTruthy();
  });

  test('share dialog shows QR code', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    await user.click(screen.getByText('Share'));
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });

  test('shows donation CTA in share dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    await user.click(screen.getByText('Share'));
    expect(screen.getByText('Help us keep this free')).toBeInTheDocument();
    expect(screen.getByText('Support The Blind Spot')).toBeInTheDocument();
  });

  test('loads presets from localStorage on mount', () => {
    const existingPresets = [
      { name: 'Existing Preset', conditions: [{ id: 'protanopia', i: 0.5 }], createdAt: Date.now() },
    ];
    localStorageMock['vision-presets'] = JSON.stringify(existingPresets);

    renderWithProviders(
      <PresetManager effects={noEffects} onLoadPreset={mockOnLoadPreset} />
    );
    expect(screen.getByText(/My Presets/)).toBeInTheDocument();
  });

  test('save via Enter key in name input', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PresetManager effects={someEnabledEffects} onLoadPreset={mockOnLoadPreset} />
    );
    const input = screen.getByPlaceholderText('Preset name...');
    await user.type(input, 'Enter Preset{Enter}');
    expect(input).toHaveValue('');
    const saved = JSON.parse(localStorageMock['vision-presets']);
    expect(saved[0].name).toBe('Enter Preset');
  });
});
