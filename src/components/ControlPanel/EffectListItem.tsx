import React, { memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Switch,
  Slider,
  ListItem,
  ListItemText,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { getColorVisionDescription, getColorVisionPrevalence, isColorVisionCondition } from '../../utils/colorVisionFilters';
import { renderDescriptionWithLinks } from '../../utils/textRendering';

const FIELD_LOSS_NOTE = 'This shows what visual information is lost. A real person typically doesn\'t perceive dark areas \u2014 the brain fills in missing regions, and many are unaware of their loss.';

const SIMULATION_NOTES: Partial<Record<ConditionType, string>> = {
  // Field loss conditions share the same note
  glaucoma: FIELD_LOSS_NOTE,
  retinitisPigmentosa: FIELD_LOSS_NOTE,
  tunnelVision: FIELD_LOSS_NOTE,
  hemianopiaLeft: FIELD_LOSS_NOTE,
  hemianopiaRight: FIELD_LOSS_NOTE,
  bitemporalHemianopia: FIELD_LOSS_NOTE,
  quadrantanopiaLeft: FIELD_LOSS_NOTE,
  quadrantanopiaRight: FIELD_LOSS_NOTE,
  quadrantanopiaInferiorLeft: FIELD_LOSS_NOTE,
  quadrantanopiaInferiorRight: FIELD_LOSS_NOTE,
  quadrantanopiaSuperiorLeft: FIELD_LOSS_NOTE,
  quadrantanopiaSuperiorRight: FIELD_LOSS_NOTE,
  scotoma: FIELD_LOSS_NOTE,
  blindnessLeftEye: FIELD_LOSS_NOTE,
  blindnessRightEye: FIELD_LOSS_NOTE,
  retinalDetachment: FIELD_LOSS_NOTE,
  // Condition-specific notes
  amd: 'Metamorphopsia (wavy distortion) is shown, but the brain\'s filling-in of the central scotoma cannot be simulated on screen.',
  monochromacy: 'Real achromatopsia includes severe photophobia and nystagmus that cannot be fully captured.',
  monochromatic: 'Real achromatopsia includes severe photophobia and nystagmus that cannot be fully captured.',
};

export interface EffectListItemProps {
  effect: VisualEffect;
  isHighlighted: boolean;
  searchQuery: string;
  diplopiaSeparation: number;
  diplopiaDirection: number;
  onEffectClick: (effect: VisualEffect) => void;
  onToggleAndSelect: (effect: VisualEffect, e: React.SyntheticEvent) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDiplopiaSeparationChange?: (separation: number) => void;
  onDiplopiaDirectionChange?: (direction: number) => void;
  highlightMatch: (text: string, query: string) => React.ReactNode;
}

export const EffectListItem = memo<EffectListItemProps>(({
  effect,
  isHighlighted,
  searchQuery,
  diplopiaSeparation,
  diplopiaDirection,
  onEffectClick,
  onToggleAndSelect,
  onIntensityChange,
  onDiplopiaSeparationChange,
  onDiplopiaDirectionChange,
  highlightMatch
}) => {
  const handleClick = useCallback(() => {
    onEffectClick(effect);
  }, [effect, onEffectClick]);

  const handleToggle = useCallback((e: React.SyntheticEvent) => {
    onToggleAndSelect(effect, e);
  }, [effect, onToggleAndSelect]);

  const handleSeparationChange = useCallback((_: Event, value: number | number[]) => {
    onDiplopiaSeparationChange?.((value as number) / 100);
  }, [onDiplopiaSeparationChange]);

  const handleDirectionChange = useCallback((_: Event, value: number | number[]) => {
    onDiplopiaDirectionChange?.((value as number) / 100);
  }, [onDiplopiaDirectionChange]);

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <ListItem
      button
      onClick={handleClick}
      selected={isHighlighted}
      sx={{
        borderRadius: 1,
        cursor: 'pointer',
        mb: 1,
        bgcolor: effect.enabled ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
        '&.Mui-selected': {
          bgcolor: 'rgba(33, 150, 243, 0.15)',
        }
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={effect.enabled}
            onChange={handleToggle}
            onClick={stopPropagation}
            inputProps={{
              'aria-label': `Toggle ${effect.name}`,
              'aria-describedby': `${effect.id}-description`
            }}
          />
        }
        label=""
        sx={{ mr: 0 }}
      />
      <Box
        id={`${effect.id}-description`}
        className="sr-only"
        aria-live="polite"
      >
        {effect.description}
      </Box>
      <ListItemText
        primary={highlightMatch(effect.name, searchQuery)}
        secondary={
          <>
            {/* Diplopia-specific controls */}
            {(effect.id === 'diplopiaMonocular' || effect.id === 'diplopiaBinocular') && effect.enabled && (
              <Box sx={{ mt: 2, pl: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  Separation Distance
                </Typography>
                <Slider
                  size="small"
                  value={diplopiaSeparation * 100}
                  onChange={handleSeparationChange}
                  onClick={stopPropagation}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  onTouchEnd={stopPropagation}
                  onPointerDown={stopPropagation}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value}%`}
                  aria-label="Adjust diplopia separation"
                  sx={{ width: '90%', mb: 2 }}
                />
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  Direction
                </Typography>
                <Slider
                  size="small"
                  value={diplopiaDirection * 100}
                  onChange={handleDirectionChange}
                  onClick={stopPropagation}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  onTouchEnd={stopPropagation}
                  onPointerDown={stopPropagation}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => {
                    const direction = (value as number) / 100;
                    if (direction < 0.33) return 'Horizontal';
                    if (direction < 0.66) return 'Vertical';
                    return 'Diagonal';
                  }}
                  aria-label="Adjust diplopia direction"
                  sx={{ width: '90%' }}
                />
              </Box>
            )}
            {/* Simulation disclaimer note */}
            {effect.enabled && SIMULATION_NOTES[effect.id as ConditionType] && (
              <Box sx={{
                mt: 1.5,
                pl: 1.5,
                borderLeft: '3px solid',
                borderColor: 'info.main',
                py: 0.5,
              }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {SIMULATION_NOTES[effect.id as ConditionType]}
                </Typography>
              </Box>
            )}
            {/* Show prevalence for color vision conditions */}
            {isColorVisionCondition(effect.id as ConditionType) && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                Prevalence: {getColorVisionPrevalence(effect.id as ConditionType)}
              </Typography>
            )}
          </>
        }
        secondaryTypographyProps={{
          component: 'div'
        }}
      />
      <Tooltip
        title={
          <Box sx={{ maxWidth: 280 }}>
            {renderDescriptionWithLinks(
              isColorVisionCondition(effect.id as ConditionType)
                ? getColorVisionDescription(effect.id as ConditionType)
                : effect.description,
              { linkSx: { color: 'primary.light' }, onClick: stopPropagation }
            )}
          </Box>
        }
        arrow
        enterTouchDelay={0}
        leaveTouchDelay={3000}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(50, 50, 50, 0.95)',
              '& .MuiTooltip-arrow': {
                color: 'rgba(50, 50, 50, 0.95)',
              },
              p: 1.5,
              fontSize: '0.875rem'
            }
          }
        }}
      >
        <IconButton
          size="small"
          aria-label={`Learn more about ${effect.name}`}
          onClick={stopPropagation}
        >
          <Info />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
});

EffectListItem.displayName = 'EffectListItem';
