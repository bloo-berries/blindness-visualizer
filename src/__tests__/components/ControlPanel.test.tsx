import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualEffect } from '../../types/visualEffects';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// Import after mocks
import ControlPanel from '../../components/ControlPanel/ControlPanel';

const makeEffect = (id: string, enabled = false, intensity = 0.5): VisualEffect => ({
  id: id as any,
  name: `Effect ${id}`,
  enabled,
  intensity,
  description: `Description for ${id}`,
});

describe('ControlPanel', () => {
  const defaultProps = {
    effects: [
      makeEffect('protanopia', true, 0.75),
      makeEffect('deuteranopia', false, 0.5),
      makeEffect('tritanopia', true, 1.0),
    ],
    onToggle: jest.fn(),
    onIntensityChange: jest.fn(),
    onDeselectAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<ControlPanel {...defaultProps} />);
  });

  test('renders effect names', () => {
    render(<ControlPanel {...defaultProps} />);
    // Effects may appear in multiple places (list + summary), so use getAllByText
    expect(screen.getAllByText('Effect protanopia').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Effect deuteranopia').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Effect tritanopia').length).toBeGreaterThanOrEqual(1);
  });

  test('renders deselect all button', () => {
    render(<ControlPanel {...defaultProps} />);
    const deselectBtn = screen.getByRole('button', { name: /controlPanel.deselectAll/i });
    expect(deselectBtn).toBeInTheDocument();
  });

  test('calls onDeselectAll when deselect all button is clicked', () => {
    render(<ControlPanel {...defaultProps} />);
    const deselectBtn = screen.getByRole('button', { name: /controlPanel.deselectAll/i });
    fireEvent.click(deselectBtn);
    expect(defaultProps.onDeselectAll).toHaveBeenCalledTimes(1);
  });

  test('renders undo button when canUndo is true', () => {
    const onUndo = jest.fn();
    render(<ControlPanel {...defaultProps} onUndo={onUndo} canUndo={true} />);
    const undoBtn = screen.getByRole('button', { name: /controlPanel.undo/i });
    expect(undoBtn).toBeInTheDocument();
  });

  test('calls onUndo when undo button is clicked', () => {
    const onUndo = jest.fn();
    render(<ControlPanel {...defaultProps} onUndo={onUndo} canUndo={true} />);
    const undoBtn = screen.getByRole('button', { name: /controlPanel.undo/i });
    fireEvent.click(undoBtn);
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  test('does not render undo button when canUndo is false', () => {
    render(<ControlPanel {...defaultProps} canUndo={false} />);
    expect(screen.queryByRole('button', { name: /controlPanel.undo/i })).not.toBeInTheDocument();
  });

  test('renders visualizerSlot when provided', () => {
    render(
      <ControlPanel
        {...defaultProps}
        visualizerSlot={<div data-testid="viz-slot">Visualizer</div>}
      />
    );
    expect(screen.getByTestId('viz-slot')).toBeInTheDocument();
  });
});
