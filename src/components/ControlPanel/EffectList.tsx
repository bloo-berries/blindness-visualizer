import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Switch,
  Slider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControlLabel,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Info, ExpandMore, Search, Clear } from '@mui/icons-material';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { getColorVisionDescription, getColorVisionPrevalence, isColorVisionCondition } from '../../utils/colorVisionFilters';
import { conditionCategories, orientationGroups, OrientationGroup } from './ControlPanelConstants';
import { renderDescriptionWithLinks } from '../../utils/textRendering';

// Quick filter definitions
const QUICK_FILTERS = [
  { id: 'common', label: 'Most Common', conditions: ['deuteranomaly', 'deuteranopia', 'protanopia', 'cataracts', 'astigmatism', 'nearSighted'] },
  { id: 'red-green', label: 'Red-Green', conditions: ['protanopia', 'deuteranopia', 'protanomaly', 'deuteranomaly'] },
  { id: 'field-loss', label: 'Field Loss', conditions: ['hemianopiaLeft', 'hemianopiaRight', 'tunnelVision', 'scotoma', 'quadrantanopiaRight'] },
  { id: 'age-related', label: 'Age-Related', conditions: ['cataracts', 'amd', 'glaucoma', 'presbyopia'] },
];

// Memoized effect list item component to prevent unnecessary re-renders
interface EffectListItemProps {
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

const EffectListItem = memo<EffectListItemProps>(({
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

// Component for rendering orientation groups (conditions with left/right options)
interface OrientationGroupItemProps {
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

const OrientationGroupItem = memo<OrientationGroupItemProps>(({
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

interface EffectListProps {
  effects: VisualEffect[];
  highlightedEffect: VisualEffect | null;
  enabledEffectsCount: number;
  diplopiaSeparation?: number;
  diplopiaDirection?: number;
  onEffectClick: (effect: VisualEffect) => void;
  onToggleAndSelect: (effect: VisualEffect, e: React.SyntheticEvent) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDiplopiaSeparationChange?: (separation: number) => void;
  onDiplopiaDirectionChange?: (direction: number) => void;
  onOrientationChange?: (groupKey: string, orientation: 'left' | 'right') => void;
}

export const EffectList: React.FC<EffectListProps> = ({
  effects,
  highlightedEffect,
  enabledEffectsCount,
  diplopiaSeparation = 1.0,
  diplopiaDirection = 0.0,
  onEffectClick,
  onToggleAndSelect,
  onIntensityChange,
  onDiplopiaSeparationChange,
  onDiplopiaDirectionChange,
  onOrientationChange
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Track which accordion is expanded (null means none, or category name)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Active quick filter
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Handle accordion expand/collapse - only one open at a time
  const handleAccordionChange = (category: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : null);
  };

  // Filter effects based on search query and quick filter
  const filteredEffects = useMemo(() => {
    let result = effects;

    // Apply quick filter if active
    if (activeFilter) {
      const filter = QUICK_FILTERS.find(f => f.id === activeFilter);
      if (filter) {
        result = result.filter(effect => filter.conditions.includes(effect.id));
      }
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(effect =>
        effect.name.toLowerCase().includes(query) ||
        effect.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [effects, searchQuery, activeFilter]);

  // Handle quick filter click
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(prev => prev === filterId ? null : filterId);
    // Clear search when using filter
    if (activeFilter !== filterId) {
      setSearchQuery('');
    }
  };

  // Get effects map for orientation groups
  const effectsMap = useMemo(() => {
    const map = new Map<string, VisualEffect>();
    effects.forEach(effect => map.set(effect.id, effect));
    return map;
  }, [effects]);

  // Create a mapping from orientation group conditions to their group key
  const conditionToGroupKey = useMemo(() => {
    const map = new Map<ConditionType, string>();
    Object.entries(orientationGroups).forEach(([key, group]) => {
      map.set(group.leftCondition, key);
      map.set(group.rightCondition, key);
    });
    return map;
  }, []);

  // Group effects by category with proper ordering
  // Creates an ordered list of items (either effects or orientation groups) based on conditionCategories order
  const effectsByCategory = useMemo(() => {
    const isFiltering = searchQuery.trim() || activeFilter;
    const sourceEffects = isFiltering ? filteredEffects : effects;
    const sourceEffectsMap = new Map(sourceEffects.map(e => [e.id, e]));

    return Object.entries(conditionCategories).map(([category, conditionTypes]) => {
      // Track which orientation groups we've already added (to avoid duplicates)
      const addedGroups = new Set<string>();

      // Build ordered list of items
      type ListItem =
        | { type: 'effect'; effect: VisualEffect }
        | { type: 'orientationGroup'; key: string; group: OrientationGroup };

      const items: ListItem[] = [];

      conditionTypes.forEach(conditionId => {
        // Check if this condition is part of an orientation group
        const groupKey = conditionToGroupKey.get(conditionId);

        if (groupKey && !addedGroups.has(groupKey)) {
          // This is an orientation group condition - add the group (only once)
          const group = orientationGroups[groupKey];

          // Check if group matches search filter
          if (isFiltering) {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = group.displayName.toLowerCase().includes(query) ||
                                  group.description.toLowerCase().includes(query);
            if (!matchesSearch) return;
          }

          items.push({ type: 'orientationGroup', key: groupKey, group });
          addedGroups.add(groupKey);
        } else if (!groupKey) {
          // Regular effect - check if it exists in source effects
          const effect = sourceEffectsMap.get(conditionId);
          if (effect) {
            items.push({ type: 'effect', effect });
          }
        }
      });

      return { category, items };
    }).filter(({ items }) => items.length > 0);
  }, [effects, filteredEffects, searchQuery, activeFilter, conditionToGroupKey]);

  // Helper to highlight matching text - memoized for EffectListItem
  const highlightMatch = useCallback((text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ backgroundColor: '#fff3cd', fontWeight: 600 }}>{part}</span>
      ) : part
    );
  }, []);

  return (
    <Box sx={{ flex: '1', overflow: 'auto', maxHeight: { xs: '350px', md: '500px' } }}>
      {/* Search Input */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search conditions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        aria-label="Search vision conditions"
      />

      {/* Quick Filter Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {QUICK_FILTERS.map(filter => (
          <Chip
            key={filter.id}
            label={filter.label}
            size="small"
            variant={activeFilter === filter.id ? 'filled' : 'outlined'}
            color={activeFilter === filter.id ? 'primary' : 'default'}
            onClick={() => handleFilterClick(filter.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: activeFilter === filter.id ? undefined : 'rgba(33, 150, 243, 0.08)'
              }
            }}
          />
        ))}
      </Box>

      {/* Search Results Count */}
      {(searchQuery.trim() || activeFilter) && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {filteredEffects.length} result{filteredEffects.length !== 1 ? 's' : ''} found
          {activeFilter && (
            <IconButton
              size="small"
              onClick={() => setActiveFilter(null)}
              sx={{ ml: 1, p: 0.25 }}
              aria-label="Clear filter"
            >
              <Clear fontSize="small" />
            </IconButton>
          )}
        </Typography>
      )}

      
      {effectsByCategory.map(({ category, items }) => (
        <Accordion
          key={category}
          expanded={searchQuery.trim() ? true : expandedCategory === category}
          onChange={handleAccordionChange(category)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`${category}-content`}
            id={`${category}-header`}
          >
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ fontWeight: 'bold' }}
            >
              {category}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {/* Render items in order (effects and orientation groups interleaved) */}
              {items.map((item) => {
                if (item.type === 'effect') {
                  return (
                    <EffectListItem
                      key={item.effect.id}
                      effect={item.effect}
                      isHighlighted={highlightedEffect?.id === item.effect.id}
                      searchQuery={searchQuery}
                      diplopiaSeparation={diplopiaSeparation}
                      diplopiaDirection={diplopiaDirection}
                      onEffectClick={onEffectClick}
                      onToggleAndSelect={onToggleAndSelect}
                      onIntensityChange={onIntensityChange}
                      onDiplopiaSeparationChange={onDiplopiaSeparationChange}
                      onDiplopiaDirectionChange={onDiplopiaDirectionChange}
                      highlightMatch={highlightMatch}
                    />
                  );
                } else {
                  return (
                    <OrientationGroupItem
                      key={item.key}
                      groupKey={item.key}
                      group={item.group}
                      leftEffect={effectsMap.get(item.group.leftCondition)}
                      rightEffect={effectsMap.get(item.group.rightCondition)}
                      isHighlighted={
                        highlightedEffect?.id === item.group.leftCondition ||
                        highlightedEffect?.id === item.group.rightCondition
                      }
                      searchQuery={searchQuery}
                      onToggleAndSelect={onToggleAndSelect}
                      onIntensityChange={onIntensityChange}
                      onOrientationChange={onOrientationChange || (() => {})}
                      highlightMatch={highlightMatch}
                    />
                  );
                }
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

