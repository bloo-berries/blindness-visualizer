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
            {/* Glaucoma-specific information */}
            {effect.id === 'glaucoma' && effect.enabled && (
              <Box sx={{ mt: 2, pl: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                  Glaucoma Stages:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  • 0-20%: Early - Small paracentral scotomas
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  • 20-50%: Moderate - Arc-shaped defects
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  • 50-80%: Advanced - Tunnel vision
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  • 80-100%: End stage - Severe constriction
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
