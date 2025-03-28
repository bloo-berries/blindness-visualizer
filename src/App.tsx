import React, { useState } from 'react';
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import InputSelector from './components/InputSelector';

export interface VisualEffect {
  id: string;
  name: string;
  enabled: boolean;
  intensity: number;
}

export type InputSource = {
  type: 'webcam' | 'image' | 'youtube';
  url?: string;
};

const App: React.FC = () => {
  const [effects, setEffects] = useState<VisualEffect[]>([
    { id: 'colorBlindness', name: 'Color Blindness', enabled: false, intensity: 1.0 },
    { id: 'nearSighted', name: 'Nearsightedness', enabled: false, intensity: 1.0 },
    { id: 'farSighted', name: 'Farsightedness', enabled: false, intensity: 1.0 },
    { id: 'visualAura', name: 'Visual Aura', enabled: false, intensity: 1.0 },
    { id: 'visualSnow', name: 'Visual Snow', enabled: false, intensity: 1.0 },
    { id: 'hemianopia', name: 'Hemianopia', enabled: false, intensity: 1.0 },
    { id: 'floaters', name: 'Visual Floaters', enabled: false, intensity: 1.0 },
    { id: 'hallucinations', name: 'Visual Hallucinations', enabled: false, intensity: 1.0 },
  ]);

  const [inputSource, setInputSource] = useState<InputSource>({
    type: 'webcam'
  });

  const toggleEffect = (id: string) => {
    setEffects(effects.map(effect => 
      effect.id === id ? { ...effect, enabled: !effect.enabled } : effect
    ));
  };

  const updateIntensity = (id: string, intensity: number) => {
    setEffects(effects.map(effect =>
      effect.id === id ? { ...effect, intensity } : effect
    ));
  };

  return (
    <div className="app">
      <h1>Vision Condition Visualizer</h1>
      <div className="container">
        <InputSelector 
          currentSource={inputSource}
          onSourceChange={setInputSource}
        />
        <Visualizer 
          effects={effects} 
          inputSource={inputSource}
        />
        <ControlPanel 
          effects={effects}
          onToggle={toggleEffect}
          onIntensityChange={updateIntensity}
        />
      </div>
    </div>
  );
};

export default App; 