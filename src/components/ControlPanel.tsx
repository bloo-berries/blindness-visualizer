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
          @keyframes hallucinationPulse {
            0% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
            100% { opacity: 0.2; transform: scale(1); }
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
              {enabledEffectsCount > 0 ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Base image with color vision filters applied directly */}
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
                      const diplopiaTypes = [
                        'diplopiaMonocular', 'diplopiaBinocular'
                      ];
                      
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
                        // Visual Snow Syndrome: Ultra-dense TV static-like persistent visual noise
                        const snowPhase = now * 0.4; // GIF-like fast animation
                        const snowIntensity = Math.min(intensity * 2.5, 1.0); // Maximum intensity scaling
                        
                        // Primary Visual Snow: Ultra-dense static dots across entire field
                        const snowDots = [];
                        const baseDensity = 600; // Base number of dots
                        const maxDensity = 900; // Maximum at 100% intensity
                        const dotCount = Math.floor(baseDensity + (maxDensity - baseDensity) * intensity);
                        
                        for (let i = 0; i < dotCount; i++) {
                          // Animated movement for each dot
                          const movePhase = (snowPhase + i * 0.02) % (2 * Math.PI);
                          const baseX = (i * 2.3) % 100;
                          const baseY = (i * 3.7) % 100;
                          const x = (baseX + Math.sin(movePhase * 0.8) * 2 + Math.cos(movePhase * 1.3) * 1.5) % 100;
                          const y = (baseY + Math.cos(movePhase * 0.6) * 2.5 + Math.sin(movePhase * 1.1) * 1.8) % 100;
                          const flickerPhase = (snowPhase + i * 0.015) % (2 * Math.PI);
                          const randomNoise = Math.sin(flickerPhase * 1.7) * Math.cos(flickerPhase * 2.1);
                          
                          // Intensity-based opacity scaling
                          const baseOpacity = 0.5 + Math.abs(randomNoise) * 0.3;
                          const intensityMultiplier = 0.8 + intensity * 0.4; // 0.8 to 1.2 at 100%
                          const opacity = baseOpacity * intensityMultiplier;
                          
                          // Intensity-based size scaling
                          const baseSize = 0.4 + Math.abs(randomNoise) * 0.4;
                          const sizeMultiplier = 0.8 + intensity * 0.6; // 0.8 to 1.4 at 100%
                          const size = baseSize * sizeMultiplier;
                          
                          // Random brightness for TV static effect
                          const brightness = 0.1 + Math.abs(randomNoise) * 0.9; // 0.1 to 1.0
                          const colorValue = Math.floor(brightness * 255);
                          
                          snowDots.push(`
                            radial-gradient(circle ${size}px at ${x}% ${y}%, 
                              rgba(${colorValue},${colorValue},${colorValue},${opacity * snowIntensity}) 0%, 
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        // Blue Field Entoptic Phenomenon: Moving white dots
                        const blueFieldDots = [];
                        const baseBlueDots = 40;
                        const maxBlueDots = 80;
                        const blueDotCount = Math.floor(baseBlueDots + (maxBlueDots - baseBlueDots) * intensity);
                        
                        for (let i = 0; i < blueDotCount; i++) {
                          // Enhanced animated movement for blue field dots
                          const movePhase = (snowPhase + i * 0.1) % (2 * Math.PI);
                          const baseX = (i * 7.3) % 100;
                          const baseY = (i * 9.7) % 100;
                          const x = (baseX + Math.sin(movePhase * 0.7) * 4 + Math.cos(movePhase * 1.2) * 3 + snowPhase * 0.5) % 100;
                          const y = (baseY + Math.cos(movePhase * 0.5) * 5 + Math.sin(movePhase * 1.0) * 4 + Math.sin(snowPhase * 0.25 + i) * 6) % 100;
                          const flickerPhase = (snowPhase + i * 0.08) % (2 * Math.PI);
                          
                          // Intensity-based scaling
                          const baseOpacity = 0.6 + Math.sin(flickerPhase) * 0.2;
                          const intensityMultiplier = 0.9 + intensity * 0.3; // 0.9 to 1.2 at 100%
                          const opacity = baseOpacity * intensityMultiplier;
                          
                          const baseSize = 1.2 + Math.sin(flickerPhase * 0.3) * 0.3;
                          const sizeMultiplier = 1.0 + intensity * 0.5; // 1.0 to 1.5 at 100%
                          const size = baseSize * sizeMultiplier;
                          
                          blueFieldDots.push(`
                            radial-gradient(circle ${size}px at ${x}% ${y}%, 
                              rgba(255,255,255,${opacity * snowIntensity}) 0%, 
                            rgba(255,255,255,0) 100%
                          )
                          `);
                        }
                        
                        // Colored static pixels for TV color static effect
                        const coloredStatic = [];
                        const baseColoredDots = 80;
                        const maxColoredDots = 150;
                        const coloredDotCount = Math.floor(baseColoredDots + (maxColoredDots - baseColoredDots) * intensity);
                        
                        for (let i = 0; i < coloredDotCount; i++) {
                          // Animated movement for colored static pixels
                          const movePhase = (snowPhase + i * 0.06) % (2 * Math.PI);
                          const baseX = (i * 3.7) % 100;
                          const baseY = (i * 6.1) % 100;
                          const x = (baseX + Math.sin(movePhase * 0.9) * 3 + Math.cos(movePhase * 1.4) * 2.2) % 100;
                          const y = (baseY + Math.cos(movePhase * 0.7) * 3.5 + Math.sin(movePhase * 1.2) * 2.8) % 100;
                          const flickerPhase = (snowPhase + i * 0.04) % (2 * Math.PI);
                          const randomNoise = Math.sin(flickerPhase * 1.9) * Math.cos(flickerPhase * 2.1);
                          
                          // Intensity-based scaling
                          const baseOpacity = 0.4 + Math.abs(randomNoise) * 0.4;
                          const intensityMultiplier = 0.8 + intensity * 0.4; // 0.8 to 1.2 at 100%
                          const opacity = baseOpacity * intensityMultiplier;
                          
                          const baseSize = 0.5 + Math.abs(randomNoise) * 0.5;
                          const sizeMultiplier = 0.9 + intensity * 0.5; // 0.9 to 1.4 at 100%
                          const size = baseSize * sizeMultiplier;
                          
                          // Random colored pixels (red, green, blue, yellow, cyan, magenta)
                          const colorIndex = Math.floor(Math.abs(randomNoise) * 6);
                          const colors = [
                            `rgba(255,80,80,${opacity * snowIntensity})`, // Red
                            `rgba(80,255,80,${opacity * snowIntensity})`, // Green
                            `rgba(80,80,255,${opacity * snowIntensity})`, // Blue
                            `rgba(255,255,80,${opacity * snowIntensity})`, // Yellow
                            `rgba(80,255,255,${opacity * snowIntensity})`, // Cyan
                            `rgba(255,80,255,${opacity * snowIntensity})`  // Magenta
                          ];
                          const color = colors[colorIndex];
                          
                          coloredStatic.push(`
                            radial-gradient(circle ${size}px at ${x}% ${y}%, 
                              ${color} 0%, 
                              rgba(0,0,0,0) 100%
                            )
                          `);
                        }
                        
                        overlayStyle.background = [...snowDots, ...blueFieldDots, ...coloredStatic].join(', ');
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = snowIntensity;
                        overlayStyle.animation = 'visualSnowFlicker 0.01s linear infinite';
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
                        overlayStyle.backgroundImage = 'url(/assets/images/garden.png)';
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
                        overlayStyle.backgroundImage = 'url(/assets/images/garden.png)';
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
                        // Visual Floaters: Dark shapes that float in the visual field
                        const floaterTime = Date.now();
                        const floaterPhase = floaterTime * 0.0005;
                        const floaterPattern = `
                          radial-gradient(ellipse 15px 8px at ${30 + Math.sin(floaterPhase * 0.1) * 5}% ${40 + Math.cos(floaterPhase * 0.1) * 5}%, 
                            rgba(0,0,0,${0.8 * intensity}) 0%, 
                            rgba(0,0,0,${0.6 * intensity}) 40%,
                            rgba(0,0,0,${0.3 * intensity}) 70%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(circle 8px at ${65 + Math.sin(floaterPhase * 0.15) * 3}% ${50 + Math.cos(floaterPhase * 0.15) * 3}%, 
                            rgba(0,0,0,${0.7 * intensity}) 0%, 
                            rgba(0,0,0,${0.5 * intensity}) 50%,
                            rgba(0,0,0,${0.2 * intensity}) 80%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(ellipse 20px 4px at ${50 + Math.sin(floaterPhase * 0.2) * 4}% ${25 + Math.cos(floaterPhase * 0.2) * 4}%, 
                            rgba(0,0,0,${0.6 * intensity}) 0%, 
                            rgba(0,0,0,${0.4 * intensity}) 50%,
                            rgba(0,0,0,${0.1 * intensity}) 80%,
                            rgba(0,0,0,0) 100%
                          ),
                          radial-gradient(circle 5px at ${80 + Math.sin(floaterPhase * 0.25) * 2}% ${70 + Math.cos(floaterPhase * 0.25) * 2}%, 
                            rgba(0,0,0,${0.9 * intensity}) 0%, 
                            rgba(0,0,0,${0.6 * intensity}) 60%,
                            rgba(0,0,0,0) 100%
                          )
                        `;
                        overlayStyle.background = floaterPattern;
                        overlayStyle.mixBlendMode = 'multiply';
                        overlayStyle.opacity = Math.min(0.8, intensity);
                        break;
                        
                      case 'hallucinations':
                        // Visual Hallucinations: Random shapes and patterns
                        const hallucinationTime = Date.now();
                        const hallucinationPhase = hallucinationTime * 0.001;
                        const hallucinationPattern = `
                          radial-gradient(circle 20px at ${20 + Math.sin(hallucinationPhase * 0.1) * 10}% ${30 + Math.cos(hallucinationPhase * 0.1) * 10}%, 
                            rgba(255,0,0,${0.6 * intensity}) 0%, 
                            rgba(255,0,0,${0.3 * intensity}) 50%,
                            rgba(255,0,0,0) 100%
                          ),
                          radial-gradient(circle 15px at ${70 + Math.sin(hallucinationPhase * 0.15) * 8}% ${60 + Math.cos(hallucinationPhase * 0.15) * 8}%, 
                            rgba(0,255,0,${0.5 * intensity}) 0%, 
                            rgba(0,255,0,${0.25 * intensity}) 50%,
                            rgba(0,255,0,0) 100%
                          ),
                          radial-gradient(circle 25px at ${50 + Math.sin(hallucinationPhase * 0.2) * 12}% ${20 + Math.cos(hallucinationPhase * 0.2) * 12}%, 
                            rgba(0,0,255,${0.4 * intensity}) 0%, 
                            rgba(0,0,255,${0.2 * intensity}) 50%,
                            rgba(0,0,255,0) 100%
                          )
                        `;
                        overlayStyle.background = hallucinationPattern;
                        overlayStyle.mixBlendMode = 'screen';
                        overlayStyle.opacity = Math.min(0.6, intensity);
                        overlayStyle.animation = 'hallucinationPulse 2s ease-in-out infinite';
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
    </>
  );
};

export default ControlPanel; 