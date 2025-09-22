import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../components/ControlPanel';

const mockEffects = [
  { 
    id: 'protanopia' as const,
    name: 'Color Blindness',
    enabled: false,
    intensity: 0.5,
    description: 'Simulates color blindness'
  }
];

test('toggles effect when switch is clicked', () => {
  const mockToggle = jest.fn();
  const mockIntensityChange = jest.fn();
  const mockDeselectAll = jest.fn();

  render(
    <ControlPanel 
      effects={mockEffects}
      onToggle={mockToggle}
      onIntensityChange={mockIntensityChange}
      onDeselectAll={mockDeselectAll}
    />
  );
  
  // Find the switch by its aria-label
  const toggleSwitch = screen.getByLabelText('Toggle Color Blindness');
  const deselectAllButton = screen.getByRole('button', { name: /deselect all/i });
  fireEvent.click(toggleSwitch);
  fireEvent.click(deselectAllButton);
  
  expect(mockToggle).toHaveBeenCalledWith('protanopia');
  expect(mockDeselectAll).toHaveBeenCalled();
}); 