import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { VisualEffect } from '../../types/visualEffects';
import { ConditionType } from '../../types/visualEffects';
import { isColorVisionCondition, getColorVisionFilter } from '../../utils/colorVisionFilters';
import { generatePreviewOverlayStyle } from './previewOverlays/generatePreviewOverlayStyle';

interface EffectPreviewProps {
  effects: VisualEffect[];
  enabledEffects: VisualEffect[];
  enabledEffectsCount: number;
  highlightedEffect: VisualEffect | null;
}

export const EffectPreview: React.FC<EffectPreviewProps> = ({
  enabledEffects,
  enabledEffectsCount,
  highlightedEffect
}) => {
  return (
    <>
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
              p: 1.5, 
              width: '100%', 
              height: '100%', 
              minHeight: '350px',
              maxHeight: '500px',
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
                return enabledEffectsCount > 0;
              })() ? (
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden', // Clip overlays to container boundaries
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Image wrapper to contain overlays */}
                  <Box sx={{
                    position: 'relative',
                    display: 'inline-block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    // Ensure overlays are clipped to image boundaries
                    overflow: 'hidden'
                  }}>
                    {/* Base image with color vision filters applied directly */}
                    <Box 
                      component="img" 
                      src={`${process.env.PUBLIC_URL || ''}/images/garden.png`} 
                      alt="Base reference image"
                      sx={{ 
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
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
                          
                          // Color vision conditions use CSS filters with intensity scaling
                          if (isColorVisionCondition(id)) {
                            return getColorVisionFilter(id, intensity);
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
                            case 'keratoconus':
                            case 'dryEye':
                            case 'vitreousHemorrhage':
                            case 'retinalDetachment':
                            case 'posteriorSubcapsularCataract':
                            case 'presbyopia':
                            case 'blueFieldPhenomena':
                            case 'glare':
                            case 'blurryVision':
                            case 'nightBlindness':
                            case 'halos':
                            case 'persistentPositiveVisualPhenomenon':
                            case 'palinopsia':
                            case 'trails':
                            case 'lossOfContrast':
                            case 'starbursting':
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
                    // Generate overlay styles using the centralized generator
                    const overlayStyle = generatePreviewOverlayStyle(effect, enabledEffects);
                    
                    if (!overlayStyle) {
                      return null;
                    }
                    
                    return (
                      <Box 
                        key={effect.id}
                        sx={overlayStyle}
                      />
                    );
                  })}
                  </Box>
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
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300/cccccc/666666?text=Garden+Image`;
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
    </>
  );
};
