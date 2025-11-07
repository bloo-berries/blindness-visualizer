import React from 'react';
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
  IconButton
} from '@mui/material';
import { Info, ExpandMore } from '@mui/icons-material';
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
  // Group effects by category
  const effectsByCategory = Object.entries(conditionCategories).map(([category, conditionTypes]) => {
    const categoryEffects = effects.filter(effect => 
      conditionTypes.includes(effect.id as ConditionType)
    );
    return { category, effects: categoryEffects };
  }).filter(({ effects }) => effects.length > 0);

  return (
    <Box sx={{ flex: '1', overflow: 'auto', maxHeight: { xs: '400px', md: '600px' } }}>
      {enabledEffectsCount > 0 && (
        <Chip 
          label={`${enabledEffectsCount} condition${enabledEffectsCount > 1 ? 's' : ''} selected`}
          color="primary"
          sx={{ mb: 2 }}
        />
      )}
      
      {effectsByCategory.map(({ category, effects }) => (
        <Accordion key={category}>
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
                    onClick={() => onEffectClick(effect)}
                    selected={highlightedEffect?.id === effect.id}
                    sx={{ 
                      borderRadius: 1,
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
                      primary={effect.name}
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

