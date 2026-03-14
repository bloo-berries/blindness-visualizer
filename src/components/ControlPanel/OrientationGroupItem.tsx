import React, { memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Switch,
  ListItem,
  ListItemText,
  FormControlLabel,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { VisualEffect } from '../../types/visualEffects';
import { OrientationGroup } from './ControlPanelConstants';
import { renderDescriptionWithLinks } from '../../utils/textRendering';

export interface OrientationGroupItemProps {
  groupKey: string;
  group: OrientationGroup;
  leftEffect: VisualEffect | undefined;
  rightEffect: VisualEffect | undefined;
  isHighlighted: boolean;
  searchQuery: string;
  onToggleAndSelect: (effect: VisualEffect, e: React.SyntheticEvent) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onOrientationChange: (groupKey: string, orientation: 'left' | 'right') => void;
  highlightMatch: (text: string, query: string) => React.ReactNode;
}

export const OrientationGroupItem = memo<OrientationGroupItemProps>(({
  groupKey,
  group,
  leftEffect,
  rightEffect,
  isHighlighted,
  searchQuery,
  onToggleAndSelect,
  onIntensityChange,
  onOrientationChange,
  highlightMatch
}) => {
  // Determine current state
  const isEnabled = leftEffect?.enabled || rightEffect?.enabled;
  const currentOrientation: 'left' | 'right' = leftEffect?.enabled ? 'left' : 'right';

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const handleToggle = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    // When toggling on, enable the right variant by default
    // When toggling off, disable whichever is currently enabled
    if (isEnabled) {
      // Disable whichever is enabled
      if (leftEffect?.enabled) {
        onToggleAndSelect(leftEffect, e);
      } else if (rightEffect?.enabled) {
        onToggleAndSelect(rightEffect, e);
      }
    } else {
      // Enable right variant by default
      if (rightEffect) {
        onToggleAndSelect(rightEffect, e);
      }
    }
  }, [isEnabled, leftEffect, rightEffect, onToggleAndSelect]);

  const handleOrientationChange = useCallback((_: React.MouseEvent<HTMLElement>, newOrientation: 'left' | 'right' | null) => {
    if (newOrientation === null) return; // Don't allow deselection
    onOrientationChange(groupKey, newOrientation);
  }, [groupKey, onOrientationChange]);

  return (
    <ListItem
      sx={{
        borderRadius: 1,
        mb: 1,
        bgcolor: isEnabled ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
        flexDirection: 'column',
        alignItems: 'stretch',
        '&.Mui-selected': {
          bgcolor: 'rgba(33, 150, 243, 0.15)',
        }
      }}
      selected={isHighlighted}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={handleToggle}
              onClick={stopPropagation}
              inputProps={{
                'aria-label': `Toggle ${group.displayName}`,
              }}
            />
          }
          label=""
          sx={{ mr: 0 }}
        />
        <ListItemText
          primary={highlightMatch(group.displayName, searchQuery)}
          sx={{ flex: 1 }}
        />
        <Tooltip
          title={
            <Box sx={{ maxWidth: 280 }}>
              {renderDescriptionWithLinks(group.description, { linkSx: { color: 'primary.light' }, onClick: stopPropagation })}
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
            aria-label={`Learn more about ${group.displayName}`}
            onClick={stopPropagation}
          >
            <Info />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Orientation toggle and intensity slider - only shown when enabled */}
      {isEnabled && (
        <Box sx={{ pl: 6, pr: 2, pb: 1, width: '100%' }}>
          {/* Left/Right orientation toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, mt: 1 }}>
            <Typography variant="caption" sx={{ mr: 2, color: 'text.secondary' }}>
              Side:
            </Typography>
            <ToggleButtonGroup
              value={currentOrientation}
              exclusive
              onChange={handleOrientationChange}
              size="small"
              aria-label="Orientation selection"
            >
              <ToggleButton value="left" aria-label="Left side" sx={{ px: 2, py: 0.5 }}>
                Left
              </ToggleButton>
              <ToggleButton value="right" aria-label="Right side" sx={{ px: 2, py: 0.5 }}>
                Right
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

        </Box>
      )}
    </ListItem>
  );
});

OrientationGroupItem.displayName = 'OrientationGroupItem';
