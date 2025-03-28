import React from 'react';
import { VisualEffect } from '../App';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  effects, 
  onToggle, 
  onIntensityChange 
}) => {
  return (
    <div className="control-panel">
      <h2>Visual Effects</h2>
      {effects.map(effect => (
        <div key={effect.id} className="effect-control">
          <label>
            <input
              type="checkbox"
              checked={effect.enabled}
              onChange={() => onToggle(effect.id)}
            />
            {effect.name}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={effect.intensity * 100}
            onChange={(e) => onIntensityChange(effect.id, Number(e.target.value) / 100)}
            disabled={!effect.enabled}
          />
        </div>
      ))}
    </div>
  );
};

export default ControlPanel; 