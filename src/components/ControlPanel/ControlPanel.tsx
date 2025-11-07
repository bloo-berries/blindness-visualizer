import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { VisualEffect } from '../../types/visualEffects';
import { ControlPanelStyles } from './ControlPanelStyles';
import { EffectList } from './EffectList';
import { EffectPreview } from './EffectPreview';

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
  // State for highlighted effect in the list (for UI indication)
  const [highlightedEffect, setHighlightedEffect] = useState<VisualEffect | null>(
    effects.find(effect => effect.enabled) || null
  );

  // Get all enabled effects for the combined preview (memoized)
  const enabledEffects = useMemo(() => 
    effects.filter(effect => effect.enabled), 
    [effects]
  );

  // Handler for when an effect is clicked in the list (memoized)
  const handleEffectClick = useCallback((effect: VisualEffect) => {
    setHighlightedEffect(effect);
  }, []);

  // Handler that combines toggling and highlighting an effect (memoized)
  const handleToggleAndSelect = useCallback((effect: VisualEffect, e: React.SyntheticEvent) => {
    // Stop propagation to prevent triggering the ListItem click
    e.stopPropagation();
    
    // Toggle the effect
    onToggle(effect.id);
    
    // If we're enabling an effect, highlight it
    const isCurrentlyEnabled = effect.enabled;
    if (!isCurrentlyEnabled) {
      setHighlightedEffect(effect);
    } 
  }, [onToggle]);

  // Get enabled effects count for display
  const enabledEffectsCount = enabledEffects.length;

  return (
    <>
      <ControlPanelStyles />
      <Box 
        role="region" 
        aria-label="Vision condition controls"
      >
        {/* Screen Reader Announcements for Condition Changes */}
        <Box
          component="div"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        >
          {effects.filter(e => e.enabled).length > 0 && 
            `Vision conditions enabled: ${effects.filter(e => e.enabled).map(e => e.name).join(', ')}`
          }
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            id="vision-controls-heading"
          >
            Select Vision Conditions
          </Typography>
          <Button 
            variant="outlined" 
            onClick={onDeselectAll}
            aria-label="Deselect all vision conditions"
          >
            Deselect All
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left side: List of vision conditions */}
          <EffectList
            effects={effects}
            highlightedEffect={highlightedEffect}
            enabledEffectsCount={enabledEffectsCount}
            diplopiaSeparation={diplopiaSeparation}
            diplopiaDirection={diplopiaDirection}
            onEffectClick={handleEffectClick}
            onToggleAndSelect={handleToggleAndSelect}
            onIntensityChange={onIntensityChange}
            onDiplopiaSeparationChange={onDiplopiaSeparationChange}
            onDiplopiaDirectionChange={onDiplopiaDirectionChange}
          />
          
          {/* Right side: Preview image */}
          <EffectPreview
            effects={effects}
            enabledEffects={enabledEffects}
            enabledEffectsCount={enabledEffectsCount}
            highlightedEffect={highlightedEffect}
          />
        </Box>
      </Box>
    </>
  );
};

export default ControlPanel;

