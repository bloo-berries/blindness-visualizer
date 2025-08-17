import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Slider,
  Paper,
  Tooltip,
  IconButton,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { Info, ExpandMore } from '@mui/icons-material';
import { VisualEffect } from '../types/visualEffects';
import { ConditionType } from '../types/visualEffects';
import { getColorVisionDescription, getColorVisionPrevalence, isColorVisionCondition } from '../utils/colorVisionFilters';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDeselectAll: () => void;
}

const conditionCategories: Record<string, ConditionType[]> = {
  "Visual Field Loss": ['blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight', 'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior', 'scotoma', 'tunnelVision'],
  "Color Vision": ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy', 'monochromatic'],
  "Eye Conditions": ['cataracts', 'glaucoma', 'astigmatism', 'nearSighted', 'farSighted'],
  "Retinal Disorders": ['amd', 'diabeticRetinopathy', 'retinitisPigmentosa', 'stargardt'],
  "Visual Disturbances": ['visualAuraLeft', 'visualAuraRight', 'visualSnow', 'visualFloaters', 'hallucinations'],
  "Double Vision": ['diplopiaMonocular', 'diplopiaBinocular']
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  effects,
  onToggle,
  onIntensityChange,
  onDeselectAll
}) => {
  // Group effects by category
  const effectsByCategory = Object.entries(conditionCategories).map(([category, conditionTypes]) => {
    const categoryEffects = effects.filter(effect => 
      conditionTypes.includes(effect.id as ConditionType)
    );
    return { category, effects: categoryEffects };
  }).filter(({ effects }) => effects.length > 0);

  // State for highlighted effect in the list (for UI indication)
  const [highlightedEffect, setHighlightedEffect] = useState<VisualEffect | null>(
    effects.find(effect => effect.enabled) || null
  );

  // Get all enabled effects for the combined preview
  const enabledEffects = effects.filter(effect => effect.enabled);

  // Handler for when an effect is clicked in the list
  const handleEffectClick = (effect: VisualEffect) => {
    setHighlightedEffect(effect);
  };

  // Handler that combines toggling and highlighting an effect
  const handleToggleAndSelect = (effect: VisualEffect, e: React.SyntheticEvent) => {
    // Stop propagation to prevent triggering the ListItem click
    e.stopPropagation();
    
    // Toggle the effect
    onToggle(effect.id);
    
    // If we're enabling an effect, highlight it
    const isCurrentlyEnabled = effect.enabled;
    if (!isCurrentlyEnabled) {
      setHighlightedEffect(effect);
    } 
  };

  // Get enabled effects count for display
  const enabledEffectsCount = enabledEffects.length;

  return (
    <Box 
      role="region" 
      aria-label="Vision condition controls"
    >
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
        <Box sx={{ flex: '1', overflow: 'auto', maxHeight: { xs: '400px', md: '600px' } }}>
          {enabledEffectsCount > 0 && (
            <Chip 
              label={`${enabledEffectsCount} condition${enabledEffectsCount > 1 ? 's' : ''} selected`}
              color="primary"
              sx={{ mb: 2 }}
            />
          )}
          
          {effectsByCategory.map(({ category, effects }) => (
            <Accordion key={category} defaultExpanded>
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
                        onClick={() => handleEffectClick(effect)}
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
                              onChange={(e) => handleToggleAndSelect(effect, e)}
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
        
        {/* Right side: Preview image */}
        <Box 
          sx={{ 
            flex: '1', 
            position: 'sticky', 
            top: 24,
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              width: '100%', 
              height: '100%', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              {enabledEffectsCount > 0 
                ? enabledEffectsCount > 1 
                  ? `Combined Vision Preview (${enabledEffectsCount} conditions)` 
                  : highlightedEffect?.name || enabledEffects[0].name
                : 'Vision Preview'
              }
            </Typography>
            
            {highlightedEffect && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {highlightedEffect.description}
              </Typography>
            )}
            
            <Box 
              sx={{ 
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 1,
                position: 'relative'
              }}
            >
              {enabledEffectsCount > 0 ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Base image */}
                  <Box 
                    component="img" 
                    src="/assets/images/garden.png" 
                    alt="Base reference image"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                  
                  {/* Stack all enabled conditions as overlays */}
                  {enabledEffects.map(effect => {
                    const effectType = effect.id as ConditionType;
                    const intensity = effect.intensity;
                    
                    // Generate overlay styles based on condition type
                    let overlayStyle: any = {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 10 + enabledEffects.indexOf(effect),
                      pointerEvents: 'none'
                    };
                    
                    // Get current time for animated effects
                    const now = Date.now();
                    
                    // Apply specific overlay styles based on condition type
                    switch (effectType) {
                      case 'blindnessLeftEye':
                        overlayStyle.background = `
                          linear-gradient(to right, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) 50%, 
                            rgba(0,0,0,0) 50%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                      case 'blindnessRightEye':
                        overlayStyle.background = `
                          linear-gradient(to left, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) 50%, 
                            rgba(0,0,0,0) 50%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                      case 'bitemporalHemianopia':
                        overlayStyle.background = `
                          linear-gradient(to right, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) 25%, 
                            rgba(0,0,0,0) 25%,
                            rgba(0,0,0,0) 75%,
                            rgba(0,0,0,${0.95 * intensity}) 75%, 
                            rgba(0,0,0,${0.95 * intensity}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                      case 'quadrantanopiaRight':
                        overlayStyle.background = `
                          radial-gradient(circle at 0% 100%, 
                            rgba(0,0,0,0) 0%,
                            rgba(0,0,0,0) ${Math.max(25, 40 - intensity * 20)}%,
                            rgba(0,0,0,${0.95 * intensity}) ${Math.max(45, 60 - intensity * 20)}%,
                            rgba(0,0,0,${0.95 * intensity}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                      case 'quadrantanopiaInferior':
                        overlayStyle.background = `
                          conic-gradient(from 0deg at 50% 50%, 
                            rgba(0,0,0,${0.95 * intensity}) 0deg, 
                            rgba(0,0,0,${0.95 * intensity}) 90deg, 
                            rgba(0,0,0,0) 90deg, 
                            rgba(0,0,0,0) 360deg
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                      case 'quadrantanopiaSuperior':
                        overlayStyle.background = `
                          conic-gradient(from 0deg at 50% 50%, 
                            rgba(0,0,0,0) 0deg, 
                            rgba(0,0,0,0) 90deg, 
                            rgba(0,0,0,${0.95 * intensity}) 90deg, 
                            rgba(0,0,0,${0.95 * intensity}) 180deg, 
                            rgba(0,0,0,0) 180deg, 
                            rgba(0,0,0,0) 360deg
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;

                        
                      case 'scotoma':
                        const offsetX = 50 + Math.sin(now/2000) * 10;
                        const offsetY = 50 + Math.cos(now/2000) * 10;
                        overlayStyle.background = `
                          radial-gradient(circle at ${offsetX}% ${offsetY}%, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.85 * intensity}) ${Math.max(5, 10 - intensity * 5)}%,
                            rgba(0,0,0,${0.5 * intensity}) ${Math.max(10, 20 - intensity * 10)}%,
                            rgba(0,0,0,0) ${Math.max(20, 35 - intensity * 15)}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      case 'tunnelVision':
                        const tunnelRadius = Math.max(10, 80 - intensity * 70);
                        overlayStyle.background = `
                          radial-gradient(circle at center, 
                            rgba(0,0,0,0) 0%,
                            rgba(0,0,0,0) ${tunnelRadius - 5}%,
                            rgba(0,0,0,${0.1 * intensity}) ${tunnelRadius}%,
                            rgba(0,0,0,${0.3 * intensity}) ${tunnelRadius + 5}%,
                            rgba(0,0,0,${0.6 * intensity}) ${tunnelRadius + 10}%,
                            rgba(0,0,0,${0.8 * intensity}) ${tunnelRadius + 15}%,
                            rgba(0,0,0,${0.95 * intensity}) ${tunnelRadius + 20}%,
                            rgba(0,0,0,${0.95 * intensity}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      case 'hemianopiaLeft':
                        overlayStyle.background = `
                          linear-gradient(to right, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) 45%, 
                            rgba(0,0,0,0) 50%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      case 'hemianopiaRight':
                        overlayStyle.background = `
                          linear-gradient(to left, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) 45%, 
                            rgba(0,0,0,0) 50%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      case 'visualSnow':
                        const snowPhase = now * 0.001;
                        const snowIntensity = Math.min(intensity * 0.8, 0.6);
                        const noiseLayer1 = `
                          radial-gradient(circle 0.5px at ${20 + Math.sin(snowPhase * 0.1) * 5}% ${30 + Math.cos(snowPhase * 0.1) * 5}%, 
                            rgba(255,255,255,${snowIntensity * 0.3}) 0%, 
                            rgba(255,255,255,0) 100%
                          ),
                          radial-gradient(circle 0.3px at ${80 + Math.sin(snowPhase * 0.15) * 3}% ${40 + Math.cos(snowPhase * 0.15) * 3}%, 
                            rgba(255,255,255,${snowIntensity * 0.4}) 0%, 
                            rgba(255,255,255,0) 100%
                          )
                        `;
                        overlayStyle.background = noiseLayer1;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = snowIntensity;
                        break;
                        
                      default:
                        // For other conditions, use a simple darkening overlay
                        overlayStyle.background = `rgba(0,0,0,${intensity * 0.3})`;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = intensity;
                    }
                    
                    return (
                      <Box 
                        key={effect.id}
                        sx={overlayStyle}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Box 
                  component="img" 
                  src="/assets/images/garden.png" 
                  alt="Normal vision reference image"
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ControlPanel; 