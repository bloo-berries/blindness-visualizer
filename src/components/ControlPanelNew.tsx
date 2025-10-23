import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { VisualEffect } from '../types/visualEffects';
import { updateSVGFilters } from '../utils/svgFilterManager';
import ConditionSelector from './ConditionSelector';
import PreviewPanel from './PreviewPanel';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDeselectAll: () => void;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  onDiplopiaSeparationChange?: (separation: number) => void;
  onDiplopiaDirectionChange?: (direction: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  effects,
  onToggle,
  onIntensityChange,
  onDeselectAll,
  diplopiaSeparation = 1.0,
  diplopiaDirection = 0.0,
  onDiplopiaSeparationChange,
  onDiplopiaDirectionChange
}) => {
  const [highlightedEffect, setHighlightedEffect] = useState<VisualEffect | null>(null);

  // Update SVG filters when effects change
  React.useEffect(() => {
    updateSVGFilters(effects);
  }, [effects]);

  const enabledEffects = effects.filter(e => e.enabled);
  const enabledEffectsCount = enabledEffects.length;

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
      {/* Left Panel - Condition Selector */}
      <Paper sx={{ flex: 1, p: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Vision Conditions ({enabledEffectsCount} enabled)
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={onDeselectAll}
            disabled={enabledEffectsCount === 0}
          >
            Clear All
          </Button>
        </Box>
        
        <ConditionSelector
          effects={effects}
          onToggle={onToggle}
          onIntensityChange={onIntensityChange}
          highlightedEffect={highlightedEffect}
          setHighlightedEffect={setHighlightedEffect}
        />
      </Paper>

      {/* Right Panel - Preview */}
      <Paper sx={{ flex: 1, p: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <PreviewPanel
          effects={effects}
          highlightedEffect={highlightedEffect}
        />
      </Paper>
    </Box>
  );
};

export default ControlPanel;
