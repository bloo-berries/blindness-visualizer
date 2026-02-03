import React, { useState, useMemo } from 'react';
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
  InputAdornment
} from '@mui/material';
import { Info, ExpandMore, Search, Clear } from '@mui/icons-material';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { getColorVisionDescription, getColorVisionPrevalence, isColorVisionCondition } from '../../utils/colorVisionFilters';
import { conditionCategories } from './ControlPanelConstants';

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
  onDiplopiaDirectionChange
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Track which accordion is expanded (null means none, or category name)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Handle accordion expand/collapse - only one open at a time
  const handleAccordionChange = (category: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : null);
  };

  // Filter effects based on search query
  const filteredEffects = useMemo(() => {
    if (!searchQuery.trim()) return effects;
    const query = searchQuery.toLowerCase().trim();
    return effects.filter(effect =>
      effect.name.toLowerCase().includes(query) ||
      effect.description.toLowerCase().includes(query)
    );
  }, [effects, searchQuery]);

  // Group effects by category (using filtered effects when searching)
  const effectsByCategory = useMemo(() => {
    const sourceEffects = searchQuery.trim() ? filteredEffects : effects;
    return Object.entries(conditionCategories).map(([category, conditionTypes]) => {
      const categoryEffects = sourceEffects.filter(effect =>
        conditionTypes.includes(effect.id as ConditionType)
      );
      return { category, effects: categoryEffects };
    }).filter(({ effects }) => effects.length > 0);
  }, [effects, filteredEffects, searchQuery]);

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ backgroundColor: '#fff3cd', fontWeight: 600 }}>{part}</span>
      ) : part
    );
  };

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

      {/* Search Results Count */}
      {searchQuery.trim() && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {filteredEffects.length} result{filteredEffects.length !== 1 ? 's' : ''} found
        </Typography>
      )}

      {enabledEffectsCount > 0 && (
        <Chip
          label={`${enabledEffectsCount} condition${enabledEffectsCount > 1 ? 's' : ''} selected`}
          color="primary"
          sx={{ mb: 2 }}
        />
      )}
      
      {effectsByCategory.map(({ category, effects }) => (
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
              {effects.map(effect => (
                <React.Fragment key={effect.id}>
                  <ListItem
                    button
                    onClick={(e) => {
                      // Toggle the effect when clicking anywhere on the row
                      onToggleAndSelect(effect, e);
                    }}
                    selected={highlightedEffect?.id === effect.id}
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
                          onChange={(e) => onToggleAndSelect(effect, e)}
                          onClick={(e) => e.stopPropagation()}
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
                          {effect.enabled && (
                            <Slider
                              size="small"
                              value={effect.intensity * 100}
                              onChange={(_, value) => 
                                onIntensityChange(effect.id, (value as number) / 100)
                              }
                              valueLabelDisplay="auto"
                              valueLabelFormat={value => `${value}%`}
                              aria-label={`Adjust ${effect.name} intensity`}
                              aria-valuetext={`${effect.intensity * 100}%`}
                              sx={{ mt: 1, width: '90%' }}
                            />
                          )}
                          {/* Diplopia-specific controls */}
                          {(effect.id === 'diplopiaMonocular' || effect.id === 'diplopiaBinocular') && effect.enabled && (
                            <Box sx={{ mt: 2, pl: 1 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                                Separation Distance
                              </Typography>
                              <Slider
                                size="small"
                                value={diplopiaSeparation * 100}
                                onChange={(_, value) => 
                                  onDiplopiaSeparationChange?.((value as number) / 100)
                                }
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
                                onChange={(_, value) => 
                                  onDiplopiaDirectionChange?.((value as number) / 100)
                                }
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
                    <Tooltip title={
                      isColorVisionCondition(effect.id as ConditionType) 
                        ? getColorVisionDescription(effect.id as ConditionType)
                        : effect.description
                    }>
                      <IconButton 
                        size="small"
                        aria-label={`Learn more about ${effect.name}`}
                      >
                        <Info />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

