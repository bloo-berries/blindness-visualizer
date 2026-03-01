import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Slider,
  Chip,
  Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { VisualEffect, InputSource } from '../../types/visualEffects';
import { ControlPanelStyles } from './ControlPanelStyles';
import { EffectList } from './EffectList';
import { orientationGroups } from './ControlPanelConstants';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDeselectAll: () => void;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  onDiplopiaSeparationChange?: (separation: number) => void;
  onDiplopiaDirectionChange?: (direction: number) => void;
  visualizerSlot?: React.ReactNode;
  inputSource?: InputSource;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  effects,
  onToggle,
  onIntensityChange,
  onDeselectAll,
  diplopiaSeparation = 1.0,
  diplopiaDirection = 0.0,
  onDiplopiaSeparationChange,
  onDiplopiaDirectionChange,
  visualizerSlot,
  inputSource
}) => {
  // State for highlighted effect in the list (for UI indication)
  const [highlightedEffect, setHighlightedEffect] = useState<VisualEffect | null>(
    effects.find(effect => effect.enabled) || null
  );

  // Track if selected conditions summary is expanded
  const [showSelectedConditions, setShowSelectedConditions] = useState(false);

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

  // Handler for orientation changes in grouped conditions
  const handleOrientationChange = useCallback((groupKey: string, orientation: 'left' | 'right') => {
    const group = orientationGroups[groupKey];
    if (!group) return;

    const leftEffect = effects.find(e => e.id === group.leftCondition);
    const rightEffect = effects.find(e => e.id === group.rightCondition);

    if (orientation === 'left') {
      // Enable left, disable right
      if (rightEffect?.enabled) {
        onToggle(rightEffect.id);
      }
      if (leftEffect && !leftEffect.enabled) {
        onToggle(leftEffect.id);
      }
      // Update highlighted effect to show correct preview
      if (leftEffect) {
        setHighlightedEffect(leftEffect);
      }
    } else {
      // Enable right, disable left
      if (leftEffect?.enabled) {
        onToggle(leftEffect.id);
      }
      if (rightEffect && !rightEffect.enabled) {
        onToggle(rightEffect.id);
      }
      // Update highlighted effect to show correct preview
      if (rightEffect) {
        setHighlightedEffect(rightEffect);
      }
    }
  }, [effects, onToggle]);

  // Get enabled effects count for display
  const enabledEffectsCount = enabledEffects.length;

  // Get the current version of the highlighted effect from the effects array
  const currentHighlightedEffect = highlightedEffect
    ? effects.find(e => e.id === highlightedEffect.id)
    : null;

  return (
    <>
      <ControlPanelStyles />
      <Box
        role="region"
        aria-label="Vision condition controls"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'flex-start', flex: 1 }}>
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
            onOrientationChange={handleOrientationChange}
          />

          {/* Right side: Live visualizer + controls */}
          <Box sx={{
            flex: '1.5',
            position: 'sticky',
            top: 16,
            alignSelf: 'flex-start',
            minWidth: { md: '500px' },
          }}>
            {visualizerSlot}

            {/* Severity slider - shown when there's a highlighted effect that's enabled */}
            {currentHighlightedEffect?.enabled && (
              <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                  {currentHighlightedEffect.name} Severity: {Math.round(currentHighlightedEffect.intensity * 100)}%
                </Typography>
                <Slider
                  size="small"
                  value={currentHighlightedEffect.intensity * 100}
                  onChange={(_, value) => onIntensityChange(currentHighlightedEffect.id, (value as number) / 100)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value}%`}
                  aria-label={`Adjust ${currentHighlightedEffect.name} severity`}
                  sx={{ width: '100%' }}
                />
              </Box>
            )}

            {/* Conditions count + Deselect All */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {enabledEffectsCount > 0 ? (
                  <Chip
                    label={`${enabledEffectsCount} condition${enabledEffectsCount > 1 ? 's' : ''} selected`}
                    color="primary"
                    onClick={() => setShowSelectedConditions(!showSelectedConditions)}
                    onDelete={() => setShowSelectedConditions(!showSelectedConditions)}
                    deleteIcon={showSelectedConditions ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    sx={{ cursor: 'pointer' }}
                  />
                ) : (
                  <Box />
                )}
                <Button
                  variant="outlined"
                  onClick={onDeselectAll}
                  disabled={enabledEffectsCount === 0}
                  aria-label="Deselect all vision conditions"
                  size="small"
                >
                  Deselect All
                </Button>
              </Box>
              <Collapse in={showSelectedConditions}>
                <Box sx={{
                  mt: 1,
                  p: 1.5,
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                  borderRadius: 1,
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {enabledEffects.map((effect, index) => (
                    <Typography
                      key={effect.id}
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.25,
                        borderBottom: index < enabledEffects.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none'
                      }}
                    >
                      <span>{effect.name}</span>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(effect.intensity * 100)}%
                      </Typography>
                    </Typography>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ControlPanel;

