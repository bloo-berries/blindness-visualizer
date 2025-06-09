import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../ControlPanel';

const mockEffects = [
  { 
    id: 'colorBlindness',
    name: 'Color Blindness',
    enabled: false,
    intensity: 0.5,
    description: 'Simulates color blindness'
  }
];

test('toggles effect when switch is clicked', () => {
  const mockToggle = jest.fn();
  const mockIntensityChange = jest.fn();
  
  render(
    <ControlPanel 
      effects={mockEffects}
      onToggle={mockToggle}
      onIntensityChange={mockIntensityChange}
    />
  );
  
  // Find the switch by its label
  const toggleSwitch = screen.getByRole('checkbox', { name: /toggle color blindness/i });
  fireEvent.click(toggleSwitch);
  
  expect(mockToggle).toHaveBeenCalledWith('colorBlindness');
}); 