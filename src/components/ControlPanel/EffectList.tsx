import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ExpandMore, Search, Clear } from '@mui/icons-material';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { conditionCategories, orientationGroups } from './ControlPanelConstants';
import { EffectListItem } from './EffectListItem';
import { OrientationGroupItem } from './OrientationGroupItem';

// Quick filter definitions
const QUICK_FILTERS = [
  { id: 'common', label: 'Most Common', conditions: ['deuteranomaly', 'deuteranopia', 'protanopia', 'cataracts', 'astigmatism', 'nearSighted'] },
  { id: 'red-green', label: 'Red-Green', conditions: ['protanopia', 'deuteranopia', 'protanomaly', 'deuteranomaly'] },
  { id: 'field-loss', label: 'Field Loss', conditions: ['hemianopiaLeft', 'hemianopiaRight', 'tunnelVision', 'scotoma', 'quadrantanopiaRight'] },
  { id: 'age-related', label: 'Age-Related', conditions: ['cataracts', 'amd', 'glaucoma', 'presbyopia'] },
];

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

