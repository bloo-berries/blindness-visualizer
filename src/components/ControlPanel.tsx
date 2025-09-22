import React, { useState, useMemo, useCallback } from 'react';
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
import { isVisualDisturbanceCondition, isVisualFieldLossCondition, Z_INDEX } from '../utils/overlayConstants';

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

const conditionCategories: Record<string, ConditionType[]> = {
  "Visual Field Loss": ['blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight', 'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior', 'scotoma', 'tunnelVision'],
  "Color Vision": ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly', 'monochromacy', 'monochromatic'],
  "Eye Conditions": ['cataracts', 'glaucoma', 'astigmatism', 'nearSighted', 'farSighted'],
  "Retinal Disorders": ['amd', 'diabeticRetinopathy', 'retinitisPigmentosa', 'stargardt'],
  "Visual Disturbances": ['visualAura', 'visualAuraLeft', 'visualAuraRight', 'visualSnow', 'visualFloaters', 'hallucinations'],
  "Double Vision": ['diplopiaMonocular', 'diplopiaBinocular']
};

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
  // Create effect lookup map for O(1) access instead of O(n) finds
  // const effectMap = useMemo(() => new Map(effects.map(e => [e.id, e])), [effects]);
  // const getEffect = useCallback((id: string) => effectMap.get(id as ConditionType), [effectMap]);

  // Group effects by category (memoized to prevent unnecessary recalculations)
  const effectsByCategory = useMemo(() => 
    Object.entries(conditionCategories).map(([category, conditionTypes]) => {
      const categoryEffects = effects.filter(effect => 
        conditionTypes.includes(effect.id as ConditionType)
      );
      return { category, effects: categoryEffects };
    }).filter(({ effects }) => effects.length > 0),
    [effects]
  );

  // State for highlighted effect in the list (for UI indication)
  const [highlightedEffect, setHighlightedEffect] = useState<VisualEffect | null>(
    effects.find(effect => effect.enabled) || null
  );

  // Get all enabled effects for the combined preview (memoized)
  const enabledEffects = useMemo(() => 
    effects.filter(effect => effect.enabled), 
    [effects]
  );
  
  // Get visual floaters effect for animation (using optimized lookup)
  // const visualFloatersEffect = getEffect('visualFloaters');

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
      <style>
        {`
          @keyframes auraFlicker {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
          }
          @keyframes auraScintillation {
            0% { 
              opacity: 0.4; 
              filter: hue-rotate(0deg) brightness(1.2);
            }
            50% { 
              opacity: 0.8; 
              filter: hue-rotate(180deg) brightness(1.5);
            }
            100% { 
              opacity: 0.4; 
              filter: hue-rotate(360deg) brightness(1.2);
            }
          }
              @keyframes auraSlowScintillation {
                0% { 
                  opacity: 0.2; 
                  filter: brightness(1.05) contrast(1.05) hue-rotate(0deg);
                }
                25% { 
                  opacity: 0.35; 
                  filter: brightness(1.15) contrast(1.1) hue-rotate(45deg);
                }
                50% { 
                  opacity: 0.5; 
                  filter: brightness(1.2) contrast(1.15) hue-rotate(90deg);
                }
                75% { 
                  opacity: 0.35; 
                  filter: brightness(1.1) contrast(1.05) hue-rotate(135deg);
                }
                100% { 
                  opacity: 0.2; 
                  filter: brightness(1.05) contrast(1.05) hue-rotate(180deg);
                }
              }
          @keyframes hallucinationFade {
            0% { 
              opacity: 0.1; 
              filter: blur(0px) brightness(1.0);
            }
            25% { 
              opacity: 0.4; 
              filter: blur(0.5px) brightness(1.1);
            }
            50% { 
              opacity: 0.7; 
              filter: blur(0px) brightness(1.2);
            }
            75% { 
              opacity: 0.3; 
              filter: blur(0.3px) brightness(0.9);
            }
            100% { 
              opacity: 0.1; 
              filter: blur(0px) brightness(1.0);
            }
          }
          @keyframes visualSnowFlicker {
            0% { opacity: 0.2; }
            12.5% { opacity: 0.8; }
            25% { opacity: 0.3; }
            37.5% { opacity: 0.9; }
            50% { opacity: 0.1; }
            62.5% { opacity: 0.7; }
            75% { opacity: 0.4; }
            87.5% { opacity: 0.6; }
            100% { opacity: 0.2; }
          }
          @keyframes visualSnowPersistent {
            0% { opacity: 0.4; }
            20% { opacity: 0.6; }
            40% { opacity: 0.5; }
            60% { opacity: 0.7; }
            80% { opacity: 0.4; }
            100% { opacity: 0.5; }
          }
          @keyframes floaterDrift {
            0% { transform: translate(0px, 0px); }
            25% { transform: translate(2px, -1px); }
            50% { transform: translate(-1px, 2px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(0px, 0px); }
          }
        `}
      </style>
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
              {(() => {
                console.log('enabledEffectsCount:', enabledEffectsCount, 'enabledEffects:', enabledEffects);
                return enabledEffectsCount > 0;
              })() ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Base image with color vision filters applied directly */}
                  <Box 
                    component="img" 
                    src={`${process.env.PUBLIC_URL || ''}/images/garden.png`} 
                    alt="Base reference image"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 1,
                      // Apply filters directly to the image for filter-based conditions
                      filter: (() => {
                        const filterBasedConditions = enabledEffects.filter(effect => {
                          const id = effect.id as ConditionType;
                          
                          // Color vision conditions use SVG filters
                          if (isColorVisionCondition(id)) return true;
                          
                          // Only basic eye conditions use CSS filters - complex effects use shaders or overlays
                          const filterBasedTypes = [
                            'cataracts', 'astigmatism', 'nearSighted'
                          ];
                          
                          return filterBasedTypes.includes(id);
                        });
                        
                        if (filterBasedConditions.length === 0) return 'none';
                        
                        return filterBasedConditions.map(effect => {
                          const id = effect.id as ConditionType;
                          const intensity = effect.intensity;
                          
                          // Color vision conditions use SVG filters
                          if (isColorVisionCondition(id)) {
                            const filterMap: { [key: string]: string } = {
                              'protanopia': 'url(#protanopia)',
                              'deuteranopia': 'url(#deuteranopia)',
                              'tritanopia': 'url(#tritanopia)',
                              'protanomaly': 'url(#protanomaly)',
                              'deuteranomaly': 'url(#deuteranomaly)',
                              'tritanomaly': 'url(#tritanomaly)',
                              'monochromacy': 'url(#monochromacy)',
                              'monochromatic': 'url(#monochromacy)'
                            };
                            return filterMap[id] || 'none';
                          }
                          
                          // Other conditions use CSS filters
                          switch (id) {
                            // Eye Conditions
                            case 'cataracts':
                              return `brightness(${100 + intensity * 15}%) contrast(${100 - intensity * 30}%) sepia(${intensity * 80}%) blur(${intensity * 3}px) hue-rotate(${intensity * 20}deg) saturate(${100 + intensity * 20}%)`;
                            case 'glaucoma':
                              return 'none'; // Handled by shader effects
                            case 'astigmatism':
                              return `blur(${intensity * 2}px) brightness(${100 + intensity * 5}%)`;
                            case 'nearSighted':
                              return `blur(${intensity * 3}px) brightness(${100 + intensity * 3}%)`;
                            case 'farSighted':
                              return `blur(${intensity * 3}px) brightness(${100 + intensity * 3}%)`;
                            
                            // Retinal Disorders - handled by shaders or overlays
                            case 'amd':
                            case 'diabeticRetinopathy':
                            case 'retinitisPigmentosa':
                            case 'stargardt':
                              return 'none';
                            
                            // Visual Disturbances - handled by overlays
                            case 'visualFloaters':
                            case 'hallucinations':
                            case 'visualAura':
                            case 'visualAuraLeft':
                            case 'visualAuraRight':
                            case 'visualSnow':
                              return 'none';
                            
                            
                            default:
                              return 'none';
                          }
                        }).join(' ');
                      })()
                    }}
                  />
                  
                  {/* Stack all enabled conditions as overlays (excluding filter-based conditions) */}
                  {enabledEffects
                    .filter(effect => {
                      const id = effect.id as ConditionType;
                      
                      // Exclude color vision conditions (handled by SVG filters on base image)
                      if (isColorVisionCondition(id)) return false;
                      
                      // Exclude other filter-based conditions (handled by CSS filters on base image)
                      const filterBasedTypes = [
                        'cataracts', 'astigmatism', 'nearSighted', 'farSighted'
                      ];
                      
                      // Exclude diplopia conditions (handled by special overlay effects)
                      // const diplopiaTypes = [
                      //   'diplopiaMonocular', 'diplopiaBinocular'
                      // ];
                      
                      return !filterBasedTypes.includes(id);
                    })
                    .map(effect => {
                    const effectType = effect.id as ConditionType;
                    const intensity = effect.intensity;
                    
                    // Generate overlay styles based on condition type
                    let overlayStyle: any = {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    };

                    // Set z-index based on condition type
                    if (isVisualDisturbanceCondition(effectType)) {
                      overlayStyle.zIndex = Z_INDEX.VISUAL_DISTURBANCE; // Visual disturbances appear underneath
                    } else if (isVisualFieldLossCondition(effectType)) {
                      overlayStyle.zIndex = Z_INDEX.VISUAL_FIELD_LOSS; // Visual field loss appears on top
                    } else {
                      overlayStyle.zIndex = Z_INDEX.BASE + enabledEffects.indexOf(effect); // Default z-index with ordering
                    }
                    
                    // Get current time for animated effects (throttled for performance)
                    const now = Math.floor(Date.now() / 100) * 100; // Throttle to 10fps for better performance
                    
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
                        // Visual Snow (Static Particles): Optimized for performance
                        // Uses a repeating pattern instead of individual particles to prevent crashes
                        const snowIntensity = Math.min(intensity * 1.5, 1.0);
                        const snowDensity = Math.min(intensity * 0.8, 0.6); // Reduced density for performance
                        
                        // Create a repeating pattern using CSS background-image with data URI
                        // This is much more efficient than thousands of individual gradients
                        overlayStyle.background = `
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            transparent 2px,
                            rgba(255,255,255,${snowDensity * 0.3}) 2px,
                            rgba(255,255,255,${snowDensity * 0.3}) 3px
                          ),
                          repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            transparent 2px,
                            rgba(255,255,255,${snowDensity * 0.2}) 2px,
                            rgba(255,255,255,${snowDensity * 0.2}) 3px
                          ),
                          repeating-linear-gradient(
                            45deg,
                            transparent 0px,
                            transparent 3px,
                            rgba(255,255,255,${snowDensity * 0.1}) 3px,
                            rgba(255,255,255,${snowDensity * 0.1}) 4px
                          )
                        `;
                        overlayStyle.backgroundSize = '4px 4px, 4px 4px, 6px 6px';
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.8, snowIntensity);
                        overlayStyle.animation = 'visualSnowDrift 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualSnowFlashing':
                        // Visual Snow (Flashing Static): Optimized for performance
                        const flashingIntensity = Math.min(intensity * 2.0, 1.0);
                        const flashingDensity = Math.min(intensity * 0.9, 0.7);
                        
                        overlayStyle.background = `
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            transparent 1px,
                            rgba(255,255,255,${flashingDensity * 0.4}) 1px,
                            rgba(255,255,255,${flashingDensity * 0.4}) 2px
                          ),
                          repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            transparent 1px,
                            rgba(255,255,255,${flashingDensity * 0.3}) 1px,
                            rgba(255,255,255,${flashingDensity * 0.3}) 2px
                          )
                        `;
                        overlayStyle.backgroundSize = '2px 2px, 2px 2px';
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.9, flashingIntensity);
                        overlayStyle.animation = 'visualSnowFlicker 0.05s linear infinite, visualSnowDrift 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualSnowColored':
                        // Visual Snow (Colored Static): Optimized for performance
                        const coloredIntensity = Math.min(intensity * 1.8, 1.0);
                        const coloredDensity = Math.min(intensity * 0.7, 0.5);
                        
                        overlayStyle.background = `
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            transparent 3px,
                            rgba(255,100,100,${coloredDensity * 0.3}) 3px,
                            rgba(255,100,100,${coloredDensity * 0.3}) 4px
                          ),
                          repeating-linear-gradient(
                            60deg,
                            transparent 0px,
                            transparent 3px,
                            rgba(100,255,100,${coloredDensity * 0.2}) 3px,
                            rgba(100,255,100,${coloredDensity * 0.2}) 4px
                          ),
                          repeating-linear-gradient(
                            120deg,
                            transparent 0px,
                            transparent 3px,
                            rgba(100,100,255,${coloredDensity * 0.2}) 3px,
                            rgba(100,100,255,${coloredDensity * 0.2}) 4px
                          )
                        `;
                        overlayStyle.backgroundSize = '5px 5px, 5px 5px, 5px 5px';
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.8, coloredIntensity);
                        overlayStyle.animation = 'visualSnowDrift 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualSnowTransparent':
                        // Visual Snow (Transparent Static): Optimized for performance
                        const transparentIntensity = Math.min(intensity * 1.3, 1.0);
                        const transparentDensity = Math.min(intensity * 0.5, 0.3);
                        
                        overlayStyle.background = `
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            transparent 4px,
                            rgba(255,255,255,${transparentDensity * 0.2}) 4px,
                            rgba(255,255,255,${transparentDensity * 0.2}) 5px
                          ),
                          repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            transparent 4px,
                            rgba(255,255,255,${transparentDensity * 0.15}) 4px,
                            rgba(255,255,255,${transparentDensity * 0.15}) 5px
                          )
                        `;
                        overlayStyle.backgroundSize = '6px 6px, 6px 6px';
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.6, transparentIntensity);
                        overlayStyle.animation = 'visualSnowDrift 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualSnowDense':
                        // Visual Snow (Dense Static): Optimized for performance
                        const denseIntensity = Math.min(intensity * 2.5, 1.0);
                        const denseDensity = Math.min(intensity * 1.0, 0.8);
                        
                        overlayStyle.background = `
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            transparent 1px,
                            rgba(255,255,255,${denseDensity * 0.5}) 1px,
                            rgba(255,255,255,${denseDensity * 0.5}) 2px
                          ),
                          repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            transparent 1px,
                            rgba(255,255,255,${denseDensity * 0.4}) 1px,
                            rgba(255,255,255,${denseDensity * 0.4}) 2px
                          ),
                          repeating-linear-gradient(
                            45deg,
                            transparent 0px,
                            transparent 2px,
                            rgba(255,255,255,${denseDensity * 0.3}) 2px,
                            rgba(255,255,255,${denseDensity * 0.3}) 3px
                          )
                        `;
                        overlayStyle.backgroundSize = '2px 2px, 2px 2px, 3px 3px';
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.9, denseIntensity);
                        overlayStyle.animation = 'visualSnowDrift 2s ease-in-out infinite alternate';
                        break;
                        
                      // Filter-based conditions (Color Vision, Eye Conditions, Retinal Disorders, Visual Disturbances, Double Vision) 
                      // are now handled directly on the base image
                      
                      // Retinal Disorders - AMD (Age-Related Macular Degeneration)
                      case 'amd':
                        // AMD causes central vision loss (central scotoma) while preserving peripheral vision
                        // Based on NIH research: "Central vision loss makes things appear blurry or distorted, particularly when you look at them directly"
                        const amdRadius = Math.max(15, 52 - intensity * 37); // Central scotoma size based on intensity (30% larger at 100%)
                        overlayStyle.background = `
                          radial-gradient(circle at center, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) ${amdRadius - 5}%,
                            rgba(0,0,0,${0.7 * intensity}) ${amdRadius}%,
                            rgba(0,0,0,${0.3 * intensity}) ${amdRadius + 5}%,
                            rgba(0,0,0,0) ${amdRadius + 10}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      // Retinal Disorders - Diabetic Retinopathy
                      case 'diabeticRetinopathy':
                        // Based on detailed medical description: microaneurysms, cotton wool spots, macular edema, vitreous hemorrhages
                        const drTime = Date.now();
                        const drPhase = drTime * 0.0003;
                        
                        // Microaneurysms and small hemorrhages - larger, more visible dark spots
                        const microaneurysms = `
                          radial-gradient(circle 3px at ${25 + Math.sin(drPhase * 0.2) * 2}% ${35 + Math.cos(drPhase * 0.2) * 2}%, 
                            rgba(0,0,0,${0.9 * intensity}) 0%, 
                            rgba(0,0,0,${0.6 * intensity}) 50%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(circle 2px at ${65 + Math.sin(drPhase * 0.3) * 3}% ${55 + Math.cos(drPhase * 0.3) * 3}%, 
                            rgba(0,0,0,${0.8 * intensity}) 0%, 
                            rgba(0,0,0,${0.5 * intensity}) 50%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(circle 4px at ${45 + Math.sin(drPhase * 0.4) * 4}% ${75 + Math.cos(drPhase * 0.4) * 4}%, 
                            rgba(0,0,0,${0.7 * intensity}) 0%, 
                            rgba(0,0,0,${0.4 * intensity}) 50%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(circle 2.5px at ${80 + Math.sin(drPhase * 0.5) * 2}% ${25 + Math.cos(drPhase * 0.5) * 2}%, 
                            rgba(0,0,0,${0.85 * intensity}) 0%, 
                            rgba(0,0,0,${0.55 * intensity}) 50%,
                            rgba(0,0,0,0) 100%
                          )
                        `;
                        
                        // Cotton wool spots - larger, more prominent white areas
                        const cottonWoolSpots = `
                          radial-gradient(ellipse 15px 10px at ${60 + Math.sin(drPhase * 0.1) * 2}% ${40 + Math.cos(drPhase * 0.1) * 2}%, 
                            rgba(255,255,255,${0.6 * intensity}) 0%, 
                            rgba(255,255,255,${0.3 * intensity}) 50%,
                            rgba(255,255,255,0) 100%
                          ),
                          radial-gradient(ellipse 12px 8px at ${30 + Math.sin(drPhase * 0.2) * 3}% ${70 + Math.cos(drPhase * 0.2) * 3}%, 
                            rgba(255,255,255,${0.5 * intensity}) 0%, 
                            rgba(255,255,255,${0.25 * intensity}) 50%,
                            rgba(255,255,255,0) 100%
                          )
                        `;
                        
                        // Vitreous hemorrhage - reddish tint over central area
                        const vitreousHemorrhage = `
                          radial-gradient(circle at center, 
                            rgba(139,0,0,${0.3 * intensity}) 0%, 
                            rgba(139,0,0,${0.2 * intensity}) 30%,
                            rgba(139,0,0,${0.1 * intensity}) 60%,
                            rgba(139,0,0,0) 100%
                          )
                        `;
                        
                        // Combine all symptoms
                        overlayStyle.background = `${microaneurysms}, ${cottonWoolSpots}, ${vitreousHemorrhage}`;
                        overlayStyle.mixBlendMode = 'normal';
                        overlayStyle.opacity = Math.min(0.9, intensity);
                        
                        // Macular edema effects: blur, distortion, and color changes
                        overlayStyle.filter = `
                          blur(${intensity * 1.5}px) 
                          brightness(${100 - intensity * 8}%) 
                          contrast(${100 + intensity * 12}%) 
                          saturate(${100 - intensity * 15}%)
                          sepia(${intensity * 20}%)
                        `;
                        break;
                        
                      case 'retinitisPigmentosa':
                        // Retinitis Pigmentosa: severe tunnel vision with peripheral loss
                        // Based on reference images - irregular, asymmetrical tunnel
                        const rpTunnelRadius = Math.max(2, 8 - intensity * 6); // Extremely narrow tunnel
                        overlayStyle.background = `
                          /* Main elliptical tunnel */
                          radial-gradient(ellipse 100% 80% at 50% 50%, 
                            rgba(0,0,0,0) 0%,
                            rgba(0,0,0,0) ${rpTunnelRadius}%,
                            rgba(0,0,0,${0.3 * intensity}) ${rpTunnelRadius + 1}%,
                            rgba(0,0,0,${0.6 * intensity}) ${rpTunnelRadius + 2}%,
                            rgba(0,0,0,${0.8 * intensity}) ${rpTunnelRadius + 3}%,
                            rgba(0,0,0,${0.9 * intensity}) ${rpTunnelRadius + 4}%,
                            rgba(0,0,0,${0.95 * intensity}) ${rpTunnelRadius + 6}%,
                            rgba(0,0,0,${0.98 * intensity}) 100%
                          ),
                          /* Additional peripheral darkening */
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,0) 0%,
                            rgba(0,0,0,0) ${rpTunnelRadius + 8}%,
                            rgba(0,0,0,${0.5 * intensity}) ${rpTunnelRadius + 12}%,
                            rgba(0,0,0,${0.8 * intensity}) ${rpTunnelRadius + 16}%,
                            rgba(0,0,0,${0.95 * intensity}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
                        break;
                        
                      case 'glaucoma':
                        // Glaucoma: complex peripheral vision loss with scotomas
                        // Start with a base that ensures some effect is always visible
                        console.log('Creating glaucoma overlay with intensity:', intensity);
                        let glaucomaBackground = '';
                        
                        // Early stage: Small paracentral scotomas (10-20 degrees from center)
                        if (intensity > 0.1) {
                          // Superior paracentral scotoma - smoother, more organic edges
                          const scotoma1Size = Math.max(2, 6 - intensity * 4);
                          const scotoma1Fade1 = Math.max(6, 12 - intensity * 6);
                          const scotoma1Fade2 = Math.max(12, 20 - intensity * 8);
                          const scotoma1End = Math.max(20, 35 - intensity * 15);
                          
                          glaucomaBackground += `radial-gradient(ellipse 120% 80% at 65% 40%, rgba(0,0,0,${0.9 * intensity}) 0%, rgba(0,0,0,${0.7 * intensity}) ${scotoma1Size}%, rgba(0,0,0,${0.4 * intensity}) ${scotoma1Fade1}%, rgba(0,0,0,${0.2 * intensity}) ${scotoma1Fade2}%, rgba(0,0,0,0) ${scotoma1End}%),`;
                          
                          // Inferior paracentral scotoma - smoother, more organic edges
                          const scotoma2Size = Math.max(1, 4 - intensity * 3);
                          const scotoma2Fade1 = Math.max(4, 8 - intensity * 4);
                          const scotoma2Fade2 = Math.max(8, 15 - intensity * 7);
                          const scotoma2End = Math.max(15, 28 - intensity * 13);
                          
                          glaucomaBackground += `radial-gradient(ellipse 100% 90% at 35% 60%, rgba(0,0,0,${0.85 * intensity}) 0%, rgba(0,0,0,${0.6 * intensity}) ${scotoma2Size}%, rgba(0,0,0,${0.35 * intensity}) ${scotoma2Fade1}%, rgba(0,0,0,${0.15 * intensity}) ${scotoma2Fade2}%, rgba(0,0,0,0) ${scotoma2End}%),`;
                        }
                        
                        // Moderate stage: Arc-shaped defects (arcuate scotomas) - smoother transitions
                        if (intensity > 0.3) {
                          // Superior arcuate scotoma - smoother, more gradual transitions
                          glaucomaBackground += `conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 50deg, rgba(0,0,0,${0.3 * intensity}) 55deg, rgba(0,0,0,${0.7 * intensity}) 70deg, rgba(0,0,0,${0.9 * intensity}) 85deg, rgba(0,0,0,${0.7 * intensity}) 100deg, rgba(0,0,0,${0.3 * intensity}) 115deg, rgba(0,0,0,0) 130deg, rgba(0,0,0,0) 360deg),`;
                          
                          // Inferior arcuate scotoma - smoother, more gradual transitions
                          glaucomaBackground += `conic-gradient(from 180deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 50deg, rgba(0,0,0,${0.25 * intensity}) 55deg, rgba(0,0,0,${0.6 * intensity}) 70deg, rgba(0,0,0,${0.85 * intensity}) 85deg, rgba(0,0,0,${0.6 * intensity}) 100deg, rgba(0,0,0,${0.25 * intensity}) 115deg, rgba(0,0,0,0) 130deg, rgba(0,0,0,0) 360deg),`;
                        }
                        
                        // Advanced stage: Peripheral constriction (tunnel vision) - smoother transition
                        if (intensity > 0.5) {
                          const tunnelRadius = Math.max(20, 60 - intensity * 50);
                          const tunnelFadeStart = Math.max(10, tunnelRadius - 15);
                          const tunnelFadeEnd = Math.max(15, tunnelRadius - 5);
                          
                          glaucomaBackground += `radial-gradient(ellipse 110% 100% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${tunnelFadeStart}%, rgba(0,0,0,${0.2 * intensity}) ${tunnelFadeEnd}%, rgba(0,0,0,${0.6 * intensity}) ${tunnelRadius}%, rgba(0,0,0,${0.9 * intensity}) ${tunnelRadius + 5}%, rgba(0,0,0,${0.95 * intensity}) 100%),`;
                        }
                        
                        // End stage: Severe constriction - smoother transition
                        if (intensity > 0.8) {
                          const severeRadius = Math.max(5, 20 - (intensity - 0.8) * 15);
                          const severeFadeStart = Math.max(2, severeRadius - 5);
                          const severeFadeEnd = Math.max(3, severeRadius - 2);
                          
                          glaucomaBackground += `radial-gradient(ellipse 105% 95% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${severeFadeStart}%, rgba(0,0,0,${0.3 * intensity}) ${severeFadeEnd}%, rgba(0,0,0,${0.7 * intensity}) ${severeRadius}%, rgba(0,0,0,${0.95 * intensity}) ${severeRadius + 2}%, rgba(0,0,0,${0.98 * intensity}) 100%),`;
                        }
                        
                        // If no specific stage effects, create a basic peripheral darkening - smoother
                        if (glaucomaBackground === '') {
                          const fallbackStart = 80 - intensity * 30;
                          const fallbackMid = 90 - intensity * 20;
                          glaucomaBackground = `radial-gradient(ellipse 110% 100% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${fallbackStart}%, rgba(0,0,0,${0.1 * intensity}) ${fallbackMid - 5}%, rgba(0,0,0,${0.3 * intensity}) ${fallbackMid}%, rgba(0,0,0,${0.5 * intensity}) ${fallbackMid + 5}%, rgba(0,0,0,${0.6 * intensity}) 100%)`;
                        } else {
                          // Remove trailing comma
                          glaucomaBackground = glaucomaBackground.slice(0, -1);
                        }
                        
                        // Ensure we always have some effect visible
                        if (glaucomaBackground === '') {
                          glaucomaBackground = `rgba(0,0,0,${intensity * 0.2})`;
                        }
                        
                        console.log('Glaucoma background:', glaucomaBackground);
                        overlayStyle.background = glaucomaBackground;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        break;
                        
                      case 'farSighted':
                        // Hyperopia: handled by CSS filters like Myopia, no special overlay needed
                        return null;
                        
                      case 'diplopiaMonocular':
                        // Monocular Diplopia: Create a ghost image effect
                        const monocularOffset = intensity * 8; // Small offset for ghost image
                        overlayStyle.background = 'transparent';
                        overlayStyle.mixBlendMode = 'normal';
                        overlayStyle.opacity = 0.3 + intensity * 0.2; // Semi-transparent ghost
                        overlayStyle.filter = 'blur(2px)'; // Slight blur for ghost image
                        overlayStyle.transform = `translate(${monocularOffset}px, ${monocularOffset * 0.5}px)`;
                        overlayStyle.backgroundImage = `url(${process.env.PUBLIC_URL || ''}/images/garden.png)`;
                        overlayStyle.backgroundSize = 'cover';
                        overlayStyle.backgroundPosition = 'center';
                        overlayStyle.backgroundRepeat = 'no-repeat';
                        break;
                        
                      case 'diplopiaBinocular':
                        // Binocular Diplopia: Create a second clear image
                        const binocularOffset = intensity * 15; // Larger offset for separate image
                        overlayStyle.background = 'transparent';
                        overlayStyle.mixBlendMode = 'normal';
                        overlayStyle.opacity = 0.5; // More opaque than monocular
                        overlayStyle.filter = 'none'; // No blur for clear second image
                        overlayStyle.transform = `translate(${binocularOffset}px, 0px)`;
                        overlayStyle.backgroundImage = `url(${process.env.PUBLIC_URL || ''}/images/garden.png)`;
                        overlayStyle.backgroundSize = 'cover';
                        overlayStyle.backgroundPosition = 'center';
                        overlayStyle.backgroundRepeat = 'no-repeat';
                        break;
                        
                      case 'visualAura':
                        // Visual Aura: Scintillating Scotoma (Fortification Spectrum)
                        const auraTime = Date.now();
                        const migrationPhase = (auraTime / 8000) % 1; // 8-second migration cycle (faster)
                        const scintillationPhase = (auraTime / 1200) % (2 * Math.PI); // Faster scintillation
                        
                        // Create C-shaped scotoma that migrates from center to periphery
                        const scotomaSize = 20 + migrationPhase * 15; // Expands from 20% to 35%
                        const migrationOffset = migrationPhase * 30; // Moves 30% across field
                        const scotomaCenterX = 30 + migrationOffset; // Starts left, moves right
                        const scotomaCenterY = 50 + Math.sin(scintillationPhase * 0.05) * 2; // Subtle vertical drift
                        
                        // C-shaped scotoma (crescent pattern) - weighted to one side
                        const cShapeScotoma = `
                          radial-gradient(ellipse 80% 60% at ${scotomaCenterX}% ${scotomaCenterY}%, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) ${scotomaSize - 5}%,
                            rgba(0,0,0,${0.7 * intensity}) ${scotomaSize - 2}%,
                            rgba(0,0,0,${0.4 * intensity}) ${scotomaSize}%,
                            rgba(0,0,0,${0.1 * intensity}) ${scotomaSize + 3}%,
                            rgba(0,0,0,0) ${scotomaSize + 8}%
                          )
                        `;
                        
                        // Scintillating edges with prismatic colors and slower shimmer
                        const scintillatingEdges = `
                          conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
                            rgba(255,0,0,${0.6 * intensity}) 0deg,
                            rgba(255,165,0,${0.7 * intensity}) 30deg,
                            rgba(255,255,0,${0.5 * intensity}) 60deg,
                            rgba(0,255,0,${0.6 * intensity}) 90deg,
                            rgba(0,255,255,${0.4 * intensity}) 120deg,
                            rgba(0,0,255,${0.5 * intensity}) 150deg,
                            rgba(128,0,128,${0.6 * intensity}) 180deg,
                            rgba(255,0,255,${0.4 * intensity}) 210deg,
                            rgba(255,255,255,${0.7 * intensity}) 240deg,
                            rgba(255,192,203,${0.3 * intensity}) 270deg,
                            rgba(255,255,0,${0.5 * intensity}) 300deg,
                            rgba(255,165,0,${0.6 * intensity}) 330deg,
                            rgba(255,0,0,${0.6 * intensity}) 360deg
                          )
                        `;
                        
                        // Fortification pattern - zigzag rays with prismatic colors
                        const fortificationPattern = `
                          repeating-conic-gradient(from 45deg at ${scotomaCenterX}% ${scotomaCenterY}%, 
                            rgba(255,255,255,${0.7 * intensity}) 0deg,
                            rgba(255,255,255,${0.7 * intensity}) 2deg,
                            rgba(255,0,0,${0.5 * intensity}) 2deg,
                            rgba(255,0,0,${0.5 * intensity}) 4deg,
                            rgba(255,255,255,${0.4 * intensity}) 4deg,
                            rgba(255,255,255,${0.4 * intensity}) 6deg,
                            rgba(0,255,0,${0.4 * intensity}) 6deg,
                            rgba(0,255,0,${0.4 * intensity}) 8deg,
                            rgba(255,255,255,${0.3 * intensity}) 8deg,
                            rgba(255,255,255,${0.3 * intensity}) 10deg,
                            rgba(0,0,255,${0.3 * intensity}) 10deg,
                            rgba(0,0,255,${0.3 * intensity}) 12deg,
                            rgba(255,255,255,${0.2 * intensity}) 12deg,
                            rgba(255,255,255,${0.2 * intensity}) 14deg,
                            rgba(255,0,255,${0.2 * intensity}) 14deg,
                            rgba(255,0,255,${0.2 * intensity}) 16deg,
                            rgba(255,255,255,0) 16deg,
                            rgba(255,255,255,0) 18deg
                          )
                        `;
                        
                        // Add zigzag ray pattern using linear gradients
                        const zigzagRays = `
                          repeating-linear-gradient(
                            45deg,
                            transparent 0px,
                            transparent 6px,
                            rgba(255,255,255,${0.4 * intensity}) 6px,
                            rgba(255,255,255,${0.4 * intensity}) 10px,
                            transparent 10px,
                            transparent 16px
                          ),
                          repeating-linear-gradient(
                            -45deg,
                            transparent 0px,
                            transparent 6px,
                            rgba(255,0,0,${0.3 * intensity}) 6px,
                            rgba(255,0,0,${0.3 * intensity}) 10px,
                            transparent 10px,
                            transparent 16px
                          ),
                          repeating-linear-gradient(
                            30deg,
                            transparent 0px,
                            transparent 8px,
                            rgba(0,255,0,${0.2 * intensity}) 8px,
                            rgba(0,255,0,${0.2 * intensity}) 12px,
                            transparent 12px,
                            transparent 20px
                          )
                        `;
                        
                        overlayStyle.background = `${cShapeScotoma}, ${scintillatingEdges}, ${fortificationPattern}, ${zigzagRays}`;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, intensity * 0.7);
                        overlayStyle.animation = 'auraSlowScintillation 1.2s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualAuraLeft':
                        // Visual Aura (Left Side): Scintillating Scotoma on left hemifield
                        const leftAuraTime = Date.now();
                        const leftMigrationPhase = (leftAuraTime / 7000) % 1; // 7-second migration (faster)
                        const leftScintillationPhase = (leftAuraTime / 1100) % (2 * Math.PI); // Faster scintillation
                        
                        const leftScotomaSize = 18 + leftMigrationPhase * 12;
                        const leftMigrationOffset = leftMigrationPhase * 20; // Moves within left side
                        const leftScotomaCenterX = 15 + leftMigrationOffset; // Constrained to left side
                        const leftScotomaCenterY = 50 + Math.sin(leftScintillationPhase * 0.03) * 3;
                        
                        const leftCShapeScotoma = `
                          radial-gradient(ellipse 70% 50% at ${leftScotomaCenterX}% ${leftScotomaCenterY}%, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) ${leftScotomaSize - 4}%,
                            rgba(0,0,0,${0.7 * intensity}) ${leftScotomaSize - 1}%,
                            rgba(0,0,0,${0.4 * intensity}) ${leftScotomaSize}%,
                            rgba(0,0,0,${0.1 * intensity}) ${leftScotomaSize + 2}%,
                            rgba(0,0,0,0) ${leftScotomaSize + 6}%
                          )
                        `;
                        
                        const leftScintillatingEdges = `
                          conic-gradient(from 30deg at ${leftScotomaCenterX}% ${leftScotomaCenterY}%, 
                            rgba(255,0,0,${0.5 * intensity}) 0deg,
                            rgba(255,165,0,${0.6 * intensity}) 45deg,
                            rgba(255,255,0,${0.4 * intensity}) 90deg,
                            rgba(0,255,0,${0.5 * intensity}) 135deg,
                            rgba(0,255,255,${0.3 * intensity}) 180deg,
                            rgba(0,0,255,${0.4 * intensity}) 225deg,
                            rgba(128,0,128,${0.5 * intensity}) 270deg,
                            rgba(255,0,255,${0.3 * intensity}) 315deg,
                            rgba(255,0,0,${0.5 * intensity}) 360deg
                          )
                        `;
                        
                        overlayStyle.background = `${leftCShapeScotoma}, ${leftScintillatingEdges}`;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, intensity * 0.7);
                        overlayStyle.clipPath = 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)';
                        overlayStyle.animation = 'auraSlowScintillation 1.4s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualAuraRight':
                        // Visual Aura (Right Side): Scintillating Scotoma on right hemifield
                        const rightAuraTime = Date.now();
                        const rightMigrationPhase = (rightAuraTime / 7000) % 1; // 7-second migration (faster)
                        const rightScintillationPhase = (rightAuraTime / 1100) % (2 * Math.PI); // Faster scintillation
                        
                        const rightScotomaSize = 18 + rightMigrationPhase * 12;
                        const rightMigrationOffset = rightMigrationPhase * 20; // Moves within right side
                        const rightScotomaCenterX = 85 - rightMigrationOffset; // Constrained to right side
                        const rightScotomaCenterY = 50 + Math.sin(rightScintillationPhase * 0.03) * 3;
                        
                        const rightCShapeScotoma = `
                          radial-gradient(ellipse 70% 50% at ${rightScotomaCenterX}% ${rightScotomaCenterY}%, 
                            rgba(0,0,0,${0.95 * intensity}) 0%, 
                            rgba(0,0,0,${0.95 * intensity}) ${rightScotomaSize - 4}%,
                            rgba(0,0,0,${0.7 * intensity}) ${rightScotomaSize - 1}%,
                            rgba(0,0,0,${0.4 * intensity}) ${rightScotomaSize}%,
                            rgba(0,0,0,${0.1 * intensity}) ${rightScotomaSize + 2}%,
                            rgba(0,0,0,0) ${rightScotomaSize + 6}%
                          )
                        `;
                        
                        const rightScintillatingEdges = `
                          conic-gradient(from 30deg at ${rightScotomaCenterX}% ${rightScotomaCenterY}%, 
                            rgba(255,0,0,${0.5 * intensity}) 0deg,
                            rgba(255,165,0,${0.6 * intensity}) 45deg,
                            rgba(255,255,0,${0.4 * intensity}) 90deg,
                            rgba(0,255,0,${0.5 * intensity}) 135deg,
                            rgba(0,255,255,${0.3 * intensity}) 180deg,
                            rgba(0,0,255,${0.4 * intensity}) 225deg,
                            rgba(128,0,128,${0.5 * intensity}) 270deg,
                            rgba(255,0,255,${0.3 * intensity}) 315deg,
                            rgba(255,0,0,${0.5 * intensity}) 360deg
                          )
                        `;
                        
                        overlayStyle.background = `${rightCShapeScotoma}, ${rightScintillatingEdges}`;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, intensity * 0.7);
                        overlayStyle.clipPath = 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)';
                        overlayStyle.animation = 'auraSlowScintillation 1.4s ease-in-out infinite alternate';
                        break;
                        
                      case 'visualFloaters':
                        // Visual Floaters (Myodesopsia): Realistic implementation based on medical research
                        // Floaters are shadows of protein/cell debris in vitreous humour that drift with eye movement
                        const floaterIntensity = Math.min(intensity * 1.5, 1.0);
                        const floaterCount = Math.floor(3 + intensity * 8); // 3-11 floaters based on intensity
                        
                        // Generate dynamic floater patterns with varying shapes, sizes, and opacities
                        // Based on Wikipedia: floaters appear as spots, threads, or "cobwebs"
                        let floaterPatterns = '';
                        for (let i = 0; i < floaterCount; i++) {
                          const x = (i * 23.7 + Math.sin(i * 0.8) * 15) % 100;
                          const y = (i * 31.3 + Math.cos(i * 0.6) * 20) % 100;
                          const size = 8 + Math.sin(i * 0.4) * 12; // 8-20% size variation
                          const opacity = 0.3 + (Math.sin(i * 0.7) * 0.4) * floaterIntensity;
                          const shape = i % 3; // 0=circle, 1=ellipse, 2=thread-like
                          
                          if (shape === 0) {
                            // Circular floaters (most common)
                            floaterPatterns += `radial-gradient(circle ${size}% at ${x}% ${y}%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.6}) 30%, rgba(0,0,0,${opacity * 0.3}) 60%, rgba(0,0,0,0) 100%),`;
                          } else if (shape === 1) {
                            // Elliptical floaters (common in vitreous syneresis)
                            const width = size;
                            const height = size * 0.4;
                            floaterPatterns += `radial-gradient(ellipse ${width}% ${height}% at ${x}% ${y}%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.5}) 40%, rgba(0,0,0,${opacity * 0.2}) 70%, rgba(0,0,0,0) 100%),`;
                          } else {
                            // Thread-like floaters (cobweb appearance)
                            const threadWidth = size * 0.2;
                            const threadHeight = size * 1.5;
                            floaterPatterns += `radial-gradient(ellipse ${threadWidth}% ${threadHeight}% at ${x}% ${y}%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.7}) 20%, rgba(0,0,0,${opacity * 0.4}) 50%, rgba(0,0,0,${opacity * 0.1}) 80%, rgba(0,0,0,0) 100%),`;
                          }
                        }
                        
                        overlayStyle.background = floaterPatterns.slice(0, -1); // Remove trailing comma
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.85, floaterIntensity);
                        overlayStyle.animation = 'floaterDrift 6s ease-in-out infinite alternate, floaterSway 4s ease-in-out infinite alternate'; // Combined drift and sway
                        break;
                        
                      case 'hallucinations':
                        // Visual Hallucinations: Realistic-appearing objects and figures that aren't actually there
                        const hallucinationTime = now * 0.3; // Slower, more realistic movement
                        const hallucinationIntensity = Math.min(intensity * 1.8, 1.0);
                        
                        // Create multiple hallucination elements with realistic characteristics
                        const hallucinationElements = [];
                        
                        // Human-like figures (common hallucination)
                        for (let i = 0; i < 2 + Math.floor(intensity * 3); i++) {
                          const figurePhase = (hallucinationTime + i * 2.1) % (2 * Math.PI);
                          const baseX = 20 + (i * 25) % 60;
                          const baseY = 30 + (i * 35) % 40;
                          const x = baseX + Math.sin(figurePhase * 0.05) * 8; // Slow, subtle movement
                          const y = baseY + Math.cos(figurePhase * 0.03) * 6;
                          
                          // Human silhouette with varying opacity
                          const figureOpacity = 0.3 + Math.sin(figurePhase * 0.1) * 0.2;
                          hallucinationElements.push(`
                            radial-gradient(ellipse 15px 25px at ${x}% ${y}%, 
                              rgba(0,0,0,${figureOpacity * hallucinationIntensity}) 0%, 
                              rgba(0,0,0,${figureOpacity * 0.6 * hallucinationIntensity}) 40%,
                              rgba(0,0,0,${figureOpacity * 0.3 * hallucinationIntensity}) 70%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Objects and shapes (furniture, animals, etc.)
                        for (let i = 0; i < 3 + Math.floor(intensity * 4); i++) {
                          const objectPhase = (hallucinationTime + i * 1.7) % (2 * Math.PI);
                          const baseX = 10 + (i * 30) % 70;
                          const baseY = 20 + (i * 25) % 60;
                          const x = baseX + Math.sin(objectPhase * 0.08) * 5;
                          const y = baseY + Math.cos(objectPhase * 0.06) * 4;
                          
                          // Various object shapes
                          const objectTypes = ['circle', 'ellipse', 'polygon'];
                          const objectType = objectTypes[i % objectTypes.length];
                          const objectOpacity = 0.2 + Math.sin(objectPhase * 0.12) * 0.15;
                          const objectSize = 8 + Math.sin(objectPhase * 0.1) * 4;
                          
                          if (objectType === 'circle') {
                            hallucinationElements.push(`
                              radial-gradient(circle ${objectSize}px at ${x}% ${y}%, 
                                rgba(100,100,100,${objectOpacity * hallucinationIntensity}) 0%, 
                                rgba(100,100,100,${objectOpacity * 0.5 * hallucinationIntensity}) 60%,
                                rgba(100,100,100,0) 100%
                              )
                            `);
                          } else if (objectType === 'ellipse') {
                            hallucinationElements.push(`
                              radial-gradient(ellipse ${objectSize}px ${objectSize * 1.5}px at ${x}% ${y}%, 
                                rgba(80,80,80,${objectOpacity * hallucinationIntensity}) 0%, 
                                rgba(80,80,80,${objectOpacity * 0.4 * hallucinationIntensity}) 70%,
                                rgba(80,80,80,0) 100%
                              )
                            `);
                          }
                        }
                        
                        // Floating orbs and lights (common in visual hallucinations)
                        for (let i = 0; i < 2 + Math.floor(intensity * 2); i++) {
                          const orbPhase = (hallucinationTime + i * 3.2) % (2 * Math.PI);
                          const baseX = 15 + (i * 40) % 70;
                          const baseY = 15 + (i * 30) % 70;
                          const x = baseX + Math.sin(orbPhase * 0.1) * 12; // More movement
                          const y = baseY + Math.cos(orbPhase * 0.08) * 10;
                          
                          const orbOpacity = 0.4 + Math.sin(orbPhase * 0.15) * 0.3;
                          const orbSize = 6 + Math.sin(orbPhase * 0.2) * 3;
                          
                          // Glowing orb effect
                          hallucinationElements.push(`
                            radial-gradient(circle ${orbSize}px at ${x}% ${y}%, 
                              rgba(255,255,255,${orbOpacity * hallucinationIntensity}) 0%, 
                              rgba(255,255,200,${orbOpacity * 0.7 * hallucinationIntensity}) 30%,
                              rgba(255,200,100,${orbOpacity * 0.4 * hallucinationIntensity}) 60%,
                              rgba(255,255,255,0) 100%
                            )
                          `);
                        }
                        
                        // Shadowy figures in peripheral vision
                        for (let i = 0; i < 1 + Math.floor(intensity * 2); i++) {
                          const shadowPhase = (hallucinationTime + i * 1.5) % (2 * Math.PI);
                          const edgeX = i % 2 === 0 ? 5 + Math.sin(shadowPhase * 0.02) * 3 : 95 - Math.sin(shadowPhase * 0.02) * 3;
                          const edgeY = 20 + (i * 60) % 60;
                          
                          const shadowOpacity = 0.15 + Math.sin(shadowPhase * 0.08) * 0.1;
                          
                          hallucinationElements.push(`
                            radial-gradient(ellipse 20px 40px at ${edgeX}% ${edgeY}%, 
                              rgba(0,0,0,${shadowOpacity * hallucinationIntensity}) 0%, 
                              rgba(0,0,0,${shadowOpacity * 0.6 * hallucinationIntensity}) 50%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Scenic elements (water, landscapes, buildings)
                        for (let i = 0; i < 2 + Math.floor(intensity * 3); i++) {
                          const scenePhase = (hallucinationTime + i * 0.8) % (2 * Math.PI);
                          // const baseX = 10 + (i * 35) % 80;
                          // const baseY = 40 + (i * 20) % 40;
                          // const x = baseX + Math.sin(scenePhase * 0.03) * 6;
                          // const y = baseY + Math.cos(scenePhase * 0.02) * 4;
                          
                          const sceneOpacity = 0.1 + Math.sin(scenePhase * 0.06) * 0.08;
                          // const sceneSize = 25 + Math.sin(scenePhase * 0.05) * 10;
                          
                          // Water-like horizontal bands
                          hallucinationElements.push(`
                            linear-gradient(0deg, 
                              rgba(100,150,200,${sceneOpacity * hallucinationIntensity}) 0%, 
                              rgba(80,120,180,${sceneOpacity * 0.7 * hallucinationIntensity}) 30%,
                              rgba(60,100,160,${sceneOpacity * 0.5 * hallucinationIntensity}) 60%,
                              rgba(40,80,140,${sceneOpacity * 0.3 * hallucinationIntensity}) 80%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Architectural elements (buildings, structures)
                        for (let i = 0; i < 1 + Math.floor(intensity * 2); i++) {
                          const archPhase = (hallucinationTime + i * 0.6) % (2 * Math.PI);
                          // const baseX = 15 + (i * 50) % 70;
                          // const baseY = 30 + (i * 30) % 50;
                          // const x = baseX + Math.sin(archPhase * 0.02) * 4;
                          // const y = baseY + Math.cos(archPhase * 0.03) * 3;
                          
                          const archOpacity = 0.12 + Math.sin(archPhase * 0.04) * 0.06;
                          // const archWidth = 20 + Math.sin(archPhase * 0.03) * 8;
                          // const archHeight = 30 + Math.sin(archPhase * 0.02) * 12;
                          
                          // Rectangular building-like structures
                          hallucinationElements.push(`
                            linear-gradient(90deg, 
                              rgba(120,120,120,${archOpacity * hallucinationIntensity}) 0%, 
                              rgba(100,100,100,${archOpacity * 0.8 * hallucinationIntensity}) 20%,
                              rgba(80,80,80,${archOpacity * 0.6 * hallucinationIntensity}) 40%,
                              rgba(60,60,60,${archOpacity * 0.4 * hallucinationIntensity}) 60%,
                              rgba(40,40,40,${archOpacity * 0.2 * hallucinationIntensity}) 80%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Animal-like figures (birds, creatures)
                        for (let i = 0; i < 1 + Math.floor(intensity * 2); i++) {
                          const animalPhase = (hallucinationTime + i * 2.5) % (2 * Math.PI);
                          const baseX = 20 + (i * 40) % 60;
                          const baseY = 15 + (i * 25) % 70;
                          const x = baseX + Math.sin(animalPhase * 0.08) * 10; // More movement
                          const y = baseY + Math.cos(animalPhase * 0.06) * 8;
                          
                          const animalOpacity = 0.2 + Math.sin(animalPhase * 0.1) * 0.15;
                          const animalSize = 8 + Math.sin(animalPhase * 0.12) * 4;
                          
                          // Bird-like or creature shapes
                          hallucinationElements.push(`
                            radial-gradient(ellipse ${animalSize}px ${animalSize * 0.7}px at ${x}% ${y}%, 
                              rgba(60,60,60,${animalOpacity * hallucinationIntensity}) 0%, 
                              rgba(40,40,40,${animalOpacity * 0.7 * hallucinationIntensity}) 50%,
                              rgba(20,20,20,${animalOpacity * 0.4 * hallucinationIntensity}) 80%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Text-like elements (words, letters appearing)
                        for (let i = 0; i < Math.floor(intensity * 2); i++) {
                          const textPhase = (hallucinationTime + i * 1.8) % (2 * Math.PI);
                          // const baseX = 30 + (i * 25) % 50;
                          // const baseY = 20 + (i * 35) % 60;
                          // const x = baseX + Math.sin(textPhase * 0.04) * 5;
                          // const y = baseY + Math.cos(textPhase * 0.03) * 4;
                          
                          const textOpacity = 0.08 + Math.sin(textPhase * 0.05) * 0.05;
                          // const textWidth = 15 + Math.sin(textPhase * 0.06) * 5;
                          // const textHeight = 3 + Math.sin(textPhase * 0.04) * 2;
                          
                          // Horizontal text-like bars
                          hallucinationElements.push(`
                            linear-gradient(0deg, 
                              rgba(200,200,200,${textOpacity * hallucinationIntensity}) 0%, 
                              rgba(180,180,180,${textOpacity * 0.8 * hallucinationIntensity}) 30%,
                              rgba(160,160,160,${textOpacity * 0.6 * hallucinationIntensity}) 60%,
                              rgba(140,140,140,${textOpacity * 0.4 * hallucinationIntensity}) 80%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Distorted faces or partial figures
                        for (let i = 0; i < 1 + Math.floor(intensity * 1.5); i++) {
                          const facePhase = (hallucinationTime + i * 1.2) % (2 * Math.PI);
                          const baseX = 25 + (i * 30) % 50;
                          const baseY = 25 + (i * 40) % 50;
                          const x = baseX + Math.sin(facePhase * 0.05) * 6;
                          const y = baseY + Math.cos(facePhase * 0.04) * 5;
                          
                          const faceOpacity = 0.15 + Math.sin(facePhase * 0.08) * 0.1;
                          const faceSize = 12 + Math.sin(facePhase * 0.07) * 6;
                          
                          // Distorted circular face-like shapes
                          hallucinationElements.push(`
                            radial-gradient(circle ${faceSize}px at ${x}% ${y}%, 
                              rgba(150,150,150,${faceOpacity * hallucinationIntensity}) 0%, 
                              rgba(120,120,120,${faceOpacity * 0.8 * hallucinationIntensity}) 30%,
                              rgba(90,90,90,${faceOpacity * 0.6 * hallucinationIntensity}) 60%,
                              rgba(60,60,60,${faceOpacity * 0.4 * hallucinationIntensity}) 80%,
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        overlayStyle.background = hallucinationElements.join(', ');
                        overlayStyle.mixBlendMode = 'normal'; // More realistic blending
                        overlayStyle.opacity = hallucinationIntensity;
                        overlayStyle.animation = 'hallucinationFade 4s ease-in-out infinite';
                        break;
                        
                      case 'stargardt':
                        // Stargardt Disease: Central scotoma with color desaturation
                        // Progressive central vision loss while preserving peripheral vision
                        const stargardtScotomaRadius = 17 + intensity * 53; // 17% to 70% of screen
                        const stargardtCenterX = 50; // Center of screen
                        const stargardtCenterY = 50;
                        
                        // Create central scotoma (blind spot) with very dark color - similar to Retinitis Pigmentosa
                        const stargardtCentralScotoma = `
                          radial-gradient(circle at ${stargardtCenterX}% ${stargardtCenterY}%, 
                            rgba(10,10,10,${0.99 * intensity}) 0%, 
                            rgba(15,15,15,${0.98 * intensity}) ${stargardtScotomaRadius - 5}%,
                            rgba(20,20,20,${0.95 * intensity}) ${stargardtScotomaRadius}%,
                            rgba(0,0,0,0) ${stargardtScotomaRadius + 5}%
                          )
                        `;
                        
                        overlayStyle.background = stargardtCentralScotoma;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.95, intensity);
                        
                        // Add color desaturation filter to simulate reduced color perception
                        overlayStyle.filter = `saturate(${1 - intensity * 0.4})`;
                        break;
                        
                      // John Milton Effects
                      case 'miltonGlaucomaHalos':
                        // Milton's rainbow halos around lights
                        const miltonHaloIntensity = Math.min(intensity * 1.5, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,255,255,${miltonHaloIntensity * 0.3}) 0%, 
                            rgba(255,0,0,${miltonHaloIntensity * 0.2}) 20%,
                            rgba(255,255,0,${miltonHaloIntensity * 0.2}) 40%,
                            rgba(0,255,0,${miltonHaloIntensity * 0.2}) 60%,
                            rgba(0,255,255,${miltonHaloIntensity * 0.2}) 80%,
                            rgba(0,0,255,${miltonHaloIntensity * 0.2}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.6, miltonHaloIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'miltonProgressiveVignetting':
                        // Milton's progressive peripheral vision loss
                        const miltonVignetteIntensity = Math.min(intensity * 1.3, 1.0);
                        const miltonVignetteRadius = Math.max(30, 80 - intensity * 50);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,0) 0%, 
                            rgba(0,0,0,${miltonVignetteIntensity * 0.3}) ${miltonVignetteRadius}%,
                            rgba(0,0,0,${miltonVignetteIntensity * 0.8}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.9, miltonVignetteIntensity);
                        break;
                        
                      case 'miltonScotomas':
                        // Milton's scotomas (blind spots)
                        const miltonScotomaIntensity = Math.min(intensity * 1.4, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 30% 30%, rgba(0,0,0,${miltonScotomaIntensity * 0.9}) 0%, rgba(0,0,0,0) 15%),
                          radial-gradient(circle at 70% 40%, rgba(0,0,0,${miltonScotomaIntensity * 0.8}) 0%, rgba(0,0,0,0) 12%),
                          radial-gradient(circle at 60% 70%, rgba(0,0,0,${miltonScotomaIntensity * 0.7}) 0%, rgba(0,0,0,0) 10%)
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, miltonScotomaIntensity);
                        break;
                        
                      case 'miltonRetinalDetachment':
                        // Milton's retinal detachment effects
                        const miltonDetachmentIntensity = Math.min(intensity * 1.6, 1.0);
                        overlayStyle.background = `
                          linear-gradient(45deg, 
                            rgba(0,0,0,${miltonDetachmentIntensity * 0.6}) 0%, 
                            rgba(0,0,0,${miltonDetachmentIntensity * 0.3}) 25%,
                            rgba(0,0,0,${miltonDetachmentIntensity * 0.8}) 50%,
                            rgba(0,0,0,${miltonDetachmentIntensity * 0.4}) 75%,
                            rgba(0,0,0,${miltonDetachmentIntensity * 0.7}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, miltonDetachmentIntensity);
                        break;
                        
                      case 'miltonPhotophobia':
                        // Milton's light sensitivity
                        const miltonPhotoIntensity = Math.min(intensity * 1.8, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,255,255,${miltonPhotoIntensity * 0.4}) 0%, 
                            rgba(255,255,255,${miltonPhotoIntensity * 0.2}) 30%,
                            rgba(255,255,255,${miltonPhotoIntensity * 0.1}) 60%,
                            rgba(255,255,255,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, miltonPhotoIntensity);
                        break;
                        
                      case 'miltonTemporalFieldLoss':
                        // Milton's temporal field defects
                        const miltonTemporalIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(0,0,0,${miltonTemporalIntensity * 0.8}) 0%, 
                            rgba(0,0,0,${miltonTemporalIntensity * 0.4}) 20%,
                            rgba(0,0,0,0) 40%,
                            rgba(0,0,0,0) 60%,
                            rgba(0,0,0,${miltonTemporalIntensity * 0.4}) 80%,
                            rgba(0,0,0,${miltonTemporalIntensity * 0.8}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, miltonTemporalIntensity);
                        break;
                        
                      // Complete Blindness Effects
                      case 'completeBlindness':
                        // Complete absence of light perception - total darkness
                        overlayStyle.background = 'rgba(0,0,0,1)';
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
                        break;
                        
                      // Galileo Effects
                      case 'galileoAcuteAttackMode':
                        // Galileo's acute glaucoma attacks
                        const galileoAttackIntensity = Math.min(intensity * 2.0, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,0,0,${galileoAttackIntensity * 0.6}) 0%, 
                            rgba(255,255,0,${galileoAttackIntensity * 0.4}) 30%,
                            rgba(255,255,255,${galileoAttackIntensity * 0.3}) 60%,
                            rgba(255,255,255,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.8, galileoAttackIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 0.5s ease-in-out infinite alternate';
                        break;
                        
                      case 'galileoChronicProgression':
                        // Galileo's chronic progression
                        const galileoChronicIntensity = Math.min(intensity * 1.5, 1.0);
                        const galileoRadius = Math.max(20, 60 - intensity * 40);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${galileoChronicIntensity * 0.9}) 0%, 
                            rgba(0,0,0,${galileoChronicIntensity * 0.6}) ${galileoRadius}%,
                            rgba(0,0,0,${galileoChronicIntensity * 0.3}) ${galileoRadius + 10}%,
                            rgba(0,0,0,0) ${galileoRadius + 20}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.9, galileoChronicIntensity);
                        break;
                        
                      // Ved Mehta Effects
                      case 'vedCompleteBlindness':
                        // Ved's complete blindness from meningitis
                        overlayStyle.background = 'rgba(0,0,0,1)';
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
                        break;
                        
                      case 'vedSpatialAwareness':
                        // Ved's spatial awareness visualization
                        const vedSpatialIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${vedSpatialIntensity * 0.8}) 0%, 
                            rgba(0,0,0,${vedSpatialIntensity * 0.4}) 30%,
                            rgba(0,0,0,${vedSpatialIntensity * 0.2}) 60%,
                            rgba(0,0,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, vedSpatialIntensity);
                        break;
                        
                      case 'vedEchoLocation':
                        // Ved's echolocation visualization
                        const vedEchoIntensity = Math.min(intensity * 1.3, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,255,${vedEchoIntensity * 0.3}) 0%, 
                            rgba(0,0,255,${vedEchoIntensity * 0.1}) 50%,
                            rgba(0,0,255,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.4, vedEchoIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 1.5s ease-in-out infinite alternate';
                        break;
                        
                      case 'vedAirFlowSensors':
                        // Ved's air flow perception
                        const vedAirIntensity = Math.min(intensity * 1.1, 1.0);
                        overlayStyle.background = `
                          linear-gradient(45deg, 
                            rgba(0,255,0,${vedAirIntensity * 0.2}) 0%, 
                            rgba(0,255,0,${vedAirIntensity * 0.1}) 50%,
                            rgba(0,255,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.3, vedAirIntensity);
                        break;
                        
                      case 'vedProximityRadar':
                        // Ved's proximity detection
                        const vedProximityIntensity = Math.min(intensity * 1.4, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,255,0,${vedProximityIntensity * 0.4}) 0%, 
                            rgba(255,255,0,${vedProximityIntensity * 0.2}) 30%,
                            rgba(255,255,0,0) 60%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, vedProximityIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 2s ease-in-out infinite alternate';
                        break;
                        
                      case 'vedTemperatureMapping':
                        // Ved's temperature perception
                        const vedTempIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(255,0,0,${vedTempIntensity * 0.3}) 0%, 
                            rgba(255,255,0,${vedTempIntensity * 0.2}) 50%,
                            rgba(0,0,255,${vedTempIntensity * 0.3}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.4, vedTempIntensity);
                        break;
                        
                      // Erik Weihenmayer Effects
                      case 'erikRetinoschisisIslands':
                        // Erik's isolated islands of vision
                        const erikIslandIntensity = Math.min(intensity * 1.5, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 25% 25%, rgba(0,0,0,${erikIslandIntensity * 0.9}) 0%, rgba(0,0,0,0) 8%),
                          radial-gradient(circle at 75% 30%, rgba(0,0,0,${erikIslandIntensity * 0.8}) 0%, rgba(0,0,0,0) 6%),
                          radial-gradient(circle at 40% 70%, rgba(0,0,0,${erikIslandIntensity * 0.7}) 0%, rgba(0,0,0,0) 5%),
                          radial-gradient(circle at 80% 80%, rgba(0,0,0,${erikIslandIntensity * 0.6}) 0%, rgba(0,0,0,0) 4%)
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, erikIslandIntensity);
                        break;
                        
                      case 'erikIslandFragmentation':
                        // Erik's progressive island fragmentation
                        const erikFragIntensity = Math.min(intensity * 1.6, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 30% 40%, rgba(0,0,0,${erikFragIntensity * 0.8}) 0%, rgba(0,0,0,0) 10%),
                          radial-gradient(circle at 70% 60%, rgba(0,0,0,${erikFragIntensity * 0.7}) 0%, rgba(0,0,0,0) 8%),
                          radial-gradient(circle at 50% 80%, rgba(0,0,0,${erikFragIntensity * 0.6}) 0%, rgba(0,0,0,0) 6%)
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, erikFragIntensity);
                        break;
                        
                      case 'erikProgressiveLoss':
                        // Erik's progressive vision loss
                        const erikProgIntensity = Math.min(intensity * 1.4, 1.0);
                        const erikProgRadius = Math.max(20, 70 - intensity * 50);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${erikProgIntensity * 0.9}) 0%, 
                            rgba(0,0,0,${erikProgIntensity * 0.6}) ${erikProgRadius}%,
                            rgba(0,0,0,${erikProgIntensity * 0.3}) ${erikProgRadius + 10}%,
                            rgba(0,0,0,0) ${erikProgRadius + 20}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, erikProgIntensity);
                        break;
                        
                      case 'erikScanningBehavior':
                        // Erik's scanning behavior visualization
                        const erikScanIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          linear-gradient(0deg, 
                            rgba(0,0,0,${erikScanIntensity * 0.6}) 0%, 
                            rgba(0,0,0,${erikScanIntensity * 0.3}) 30%,
                            rgba(0,0,0,0) 50%,
                            rgba(0,0,0,${erikScanIntensity * 0.3}) 70%,
                            rgba(0,0,0,${erikScanIntensity * 0.6}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.5, erikScanIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 3s ease-in-out infinite alternate';
                        break;
                        
                      case 'erikCognitiveLoad':
                        // Erik's cognitive load visualization
                        const erikCogIntensity = Math.min(intensity * 1.3, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,0,0,${erikCogIntensity * 0.3}) 0%, 
                            rgba(255,0,0,${erikCogIntensity * 0.1}) 50%,
                            rgba(255,0,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.4, erikCogIntensity);
                        break;
                        
                      // Marla Runyan Effects
                      case 'marlaCentralScotoma':
                        // Marla's central scotoma
                        const marlaScotomaIntensity = Math.min(intensity * 1.3, 1.0);
                        const marlaScotomaRadius = Math.max(15, 25 - intensity * 10);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${marlaScotomaIntensity * 0.9}) 0%, 
                            rgba(0,0,0,${marlaScotomaIntensity * 0.7}) ${marlaScotomaRadius}%,
                            rgba(0,0,0,${marlaScotomaIntensity * 0.4}) ${marlaScotomaRadius + 5}%,
                            rgba(0,0,0,0) ${marlaScotomaRadius + 15}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, marlaScotomaIntensity);
                        break;
                        
                      case 'marlaPeripheralVision':
                        // Marla's preserved peripheral vision
                        const marlaPeriphIntensity = Math.min(intensity * 1.1, 1.0);
                        const marlaPeriphRadius = Math.max(30, 50 - intensity * 20);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${marlaPeriphIntensity * 0.8}) 0%, 
                            rgba(0,0,0,${marlaPeriphIntensity * 0.6}) ${marlaPeriphRadius}%,
                            rgba(0,0,0,${marlaPeriphIntensity * 0.3}) ${marlaPeriphRadius + 10}%,
                            rgba(0,0,0,0) ${marlaPeriphRadius + 20}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, marlaPeriphIntensity);
                        break;
                        
                      case 'marlaEccentricViewing':
                        // Marla's eccentric viewing
                        const marlaEccentricIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 60% 40%, 
                            rgba(0,0,0,${marlaEccentricIntensity * 0.9}) 0%, 
                            rgba(0,0,0,${marlaEccentricIntensity * 0.6}) 20%,
                            rgba(0,0,0,${marlaEccentricIntensity * 0.3}) 40%,
                            rgba(0,0,0,0) 60%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.6, marlaEccentricIntensity);
                        break;
                        
                      case 'marlaFillingIn':
                        // Marla's brain filling-in effect
                        const marlaFillIntensity = Math.min(intensity * 1.0, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(128,128,128,${marlaFillIntensity * 0.3}) 0%, 
                            rgba(128,128,128,${marlaFillIntensity * 0.1}) 30%,
                            rgba(128,128,128,0) 60%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.4, marlaFillIntensity);
                        break;
                        
                      case 'marlaCrowdingEffect':
                        // Marla's crowding effect
                        const marlaCrowdIntensity = Math.min(intensity * 1.4, 1.0);
                        overlayStyle.background = `
                          linear-gradient(45deg, 
                            rgba(0,0,0,${marlaCrowdIntensity * 0.6}) 0%, 
                            rgba(0,0,0,${marlaCrowdIntensity * 0.3}) 25%,
                            rgba(0,0,0,${marlaCrowdIntensity * 0.8}) 50%,
                            rgba(0,0,0,${marlaCrowdIntensity * 0.4}) 75%,
                            rgba(0,0,0,${marlaCrowdIntensity * 0.7}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.5, marlaCrowdIntensity);
                        break;
                        
                      case 'marlaStargardtComplete':
                        // Marla's complete Stargardt simulation
                        const marlaCompleteIntensity = Math.min(intensity * 1.5, 1.0);
                        const marlaCompleteRadius = Math.max(20, 40 - intensity * 20);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,0,${marlaCompleteIntensity * 0.95}) 0%, 
                            rgba(0,0,0,${marlaCompleteIntensity * 0.8}) ${marlaCompleteRadius}%,
                            rgba(0,0,0,${marlaCompleteIntensity * 0.5}) ${marlaCompleteRadius + 10}%,
                            rgba(0,0,0,0) ${marlaCompleteRadius + 20}%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.9, marlaCompleteIntensity);
                        break;
                        
                      // Joshua Miele Effects
                      case 'joshuaCompleteBlindness':
                        // Joshua's complete blindness
                        overlayStyle.background = 'rgba(0,0,0,1)';
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
                        break;
                        
                      case 'joshuaEcholocation':
                        // Joshua's echolocation visualization
                        const joshuaEchoIntensity = Math.min(intensity * 1.3, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,0,255,${joshuaEchoIntensity * 0.4}) 0%, 
                            rgba(0,0,255,${joshuaEchoIntensity * 0.2}) 40%,
                            rgba(0,0,255,0) 80%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, joshuaEchoIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 1.8s ease-in-out infinite alternate';
                        break;
                        
                      case 'joshuaTactileMaps':
                        // Joshua's tactile map visualization
                        const joshuaTactileIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          linear-gradient(45deg, 
                            rgba(255,255,0,${joshuaTactileIntensity * 0.3}) 0%, 
                            rgba(255,255,0,${joshuaTactileIntensity * 0.1}) 50%,
                            rgba(255,255,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.4, joshuaTactileIntensity);
                        break;
                        
                      case 'joshuaAudioLandscape':
                        // Joshua's audio landscape
                        const joshuaAudioIntensity = Math.min(intensity * 1.1, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(0,255,0,${joshuaAudioIntensity * 0.3}) 0%, 
                            rgba(0,255,0,${joshuaAudioIntensity * 0.1}) 50%,
                            rgba(0,255,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.3, joshuaAudioIntensity);
                        break;
                        
                      case 'joshuaAccessibilityMode':
                        // Joshua's accessibility mode
                        const joshuaAccessIntensity = Math.min(intensity * 1.4, 1.0);
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(255,0,255,${joshuaAccessIntensity * 0.3}) 0%, 
                            rgba(255,0,255,${joshuaAccessIntensity * 0.1}) 50%,
                            rgba(255,0,255,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.4, joshuaAccessIntensity);
                        break;
                        
                      case 'joshuaSonification':
                        // Joshua's sonification visualization
                        const joshuaSonifyIntensity = Math.min(intensity * 1.3, 1.0);
                        overlayStyle.background = `
                          radial-gradient(circle at 50% 50%, 
                            rgba(255,128,0,${joshuaSonifyIntensity * 0.4}) 0%, 
                            rgba(255,128,0,${joshuaSonifyIntensity * 0.2}) 50%,
                            rgba(255,128,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.5, joshuaSonifyIntensity);
                        overlayStyle.animation = 'auraSlowScintillation 2.2s ease-in-out infinite alternate';
                        break;
                        
                      // David Paterson Effects
                      case 'davidLeftEyeBlindness':
                        // David's left eye blindness
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,1) 50%,
                            rgba(0,0,0,0) 50%,
                            rgba(0,0,0,0) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
                        break;
                        
                      case 'davidRightEyeGlaucoma':
                        // David's right eye glaucoma
                        const davidGlaucomaIntensity = Math.min(intensity * 1.3, 1.0);
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(0,0,0,0) 0%, 
                            rgba(0,0,0,0) 50%,
                            rgba(0,0,0,${davidGlaucomaIntensity * 0.8}) 50%,
                            rgba(0,0,0,${davidGlaucomaIntensity * 0.6}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, davidGlaucomaIntensity);
                        break;
                        
                      case 'davidHemisphericVision':
                        // David's hemispheric vision
                        const davidHemiIntensity = Math.min(intensity * 1.2, 1.0);
                        overlayStyle.background = `
                          linear-gradient(90deg, 
                            rgba(0,0,0,${davidHemiIntensity * 0.9}) 0%, 
                            rgba(0,0,0,${davidHemiIntensity * 0.9}) 50%,
                            rgba(0,0,0,${davidHemiIntensity * 0.4}) 50%,
                            rgba(0,0,0,${davidHemiIntensity * 0.4}) 100%
                          )
                        `;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.7, davidHemiIntensity);
                        break;
                        
                      case 'davidCompleteVision':
                        // David's complete vision loss
                        overlayStyle.background = 'rgba(0,0,0,1)';
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = 1.0;
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
                  src={`${process.env.PUBLIC_URL || ''}/images/garden.png`} 
                  alt="Normal vision reference image"
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                  onLoad={() => {
                    console.log('Garden image loaded successfully in else clause');
                  }}
                  onError={(e) => {
                    console.error('Failed to load garden.png in else clause:', e);
                    e.currentTarget.src = `https://via.placeholder.com/400x300/cccccc/666666?text=Garden+Image`;
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default ControlPanel; 