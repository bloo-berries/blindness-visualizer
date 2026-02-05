import React, { useState, useEffect } from 'react';
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

// Effects that need animation
const ANIMATED_EFFECTS = [
  'visualAura', 'visualAuraLeft', 'visualAuraRight',
  'visualSnow', 'visualSnowFlashing', 'visualSnowColored', 'visualSnowTransparent', 'visualSnowDense',
  'hallucinations', 'visualFloaters'
];

export const EffectPreview: React.FC<EffectPreviewProps> = ({
  enabledEffects,
  enabledEffectsCount,
  highlightedEffect
}) => {
  // Animation ticker - forces re-render for animated effects
  const [, setTick] = useState(0);

  // Check if any enabled effect needs animation
  const needsAnimation = enabledEffects.some(e => ANIMATED_EFFECTS.includes(e.id));

  useEffect(() => {
    if (!needsAnimation) return;

    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [needsAnimation]);

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
                    {/* Diplopia ghost image - rendered first so it appears behind */}
                    {enabledEffects.some(e => e.id === 'diplopiaMonocular' || e.id === 'diplopiaBinocular') && (() => {
                      const diplopiaEffect = enabledEffects.find(e => e.id === 'diplopiaMonocular' || e.id === 'diplopiaBinocular');
                      if (!diplopiaEffect) return null;

                      const isMonocular = diplopiaEffect.id === 'diplopiaMonocular';
                      const intensity = diplopiaEffect.intensity;

                      // Calculate offset based on intensity (5-15px offset)
                      const offsetX = 5 + intensity * 10;
                      const offsetY = 3 + intensity * 6;

                      return (
                        <Box
                          component="img"
                          src={`${process.env.PUBLIC_URL || ''}/images/garden.png`}
                          alt="Diplopia ghost image"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: 1,
                            transform: `translate(${offsetX}px, ${offsetY}px)`,
                            // Monocular: ghost is blurry and faded; Binocular: both images are clear
                            filter: isMonocular
                              ? `blur(${1 + intensity * 2}px)`
                              : 'none',
                            opacity: isMonocular
                              ? 0.3 + intensity * 0.25 // 30-55% opacity for monocular ghost
                              : 0.75, // 75% opacity for binocular - more visible
                            pointerEvents: 'none',
                          }}
                        />
                      );
                    })()}
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
                            'cataracts', 'astigmatism', 'nearSighted', 'farSighted',
                            'dryEye', 'posteriorSubcapsularCataract', 'presbyopia',
                            'glare', 'blurryVision', 'nightBlindness', 'halos',
                            'lossOfContrast', 'starbursting', 'vitreousHemorrhage'
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
                            
                            // Eye Conditions - CSS filter-based
                            case 'dryEye':
                              return `blur(${intensity * 3}px) brightness(${100 - intensity * 15}%) contrast(${100 - intensity * 20}%) saturate(${100 - intensity * 25}%)`;
                            
                            case 'posteriorSubcapsularCataract':
                              return `brightness(${100 + intensity * 25}%) contrast(${100 - intensity * 30}%) blur(${intensity * 3}px) saturate(${100 - intensity * 20}%)`;
                            
                            case 'presbyopia':
                              return `blur(${intensity * 6}px) contrast(${100 - intensity * 20}%)`;
                            
                            // Symptom Conditions - CSS filter-based
                            case 'glare':
                              return `brightness(${100 + intensity * 30}%) contrast(${100 - intensity * 40}%) saturate(${100 - intensity * 20}%)`;
                            
                            case 'blurryVision':
                              return `blur(${intensity * 12}px) contrast(${100 - intensity * 25}%)`;
                            
                            case 'nightBlindness':
                              return `brightness(${100 - intensity * 60}%) contrast(${100 - intensity * 30}%)`;
                            
                            case 'halos':
                              return `brightness(${100 + intensity * 20}%) blur(${intensity * 1}px)`;
                            
                            case 'lossOfContrast':
                              return `contrast(${100 - intensity * 50}%) brightness(${100 - intensity * 20}%)`;
                            
                            case 'starbursting':
                              return `brightness(${100 + intensity * 40}%) blur(${intensity * 1.5}px) contrast(${100 + intensity * 20}%)`;
                            
                            case 'vitreousHemorrhage':
                              // Apply blur and dimming to base image - red tint comes from overlay
                              return `blur(${intensity * 8}px) brightness(${100 - intensity * 50}%) contrast(${100 - intensity * 45}%)`;
                            
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
                            case 'retinalDetachment':
                            case 'blueFieldPhenomena':
                            case 'persistentPositiveVisualPhenomenon':
                            case 'palinopsia':
                            case 'trails':
                              return 'none'; // Handled by overlays or shaders
                            
                            
                            default:
                              return 'none';
                          }
                        }).join(' ');
                      })(),
                      // Adjust base image opacity for binocular diplopia (both images need equal visibility)
                      opacity: (() => {
                        const binocularDiplopia = enabledEffects.find(e => e.id === 'diplopiaBinocular');
                        if (binocularDiplopia) {
                          return 0.75; // 75% opacity - more visible while still showing double
                        }
                        return 1;
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
                      // Note: vitreousHemorrhage uses both filters (for blur/dimming) AND overlay (for red tint)
                      const filterBasedTypes = [
                        'cataracts', 'astigmatism', 'nearSighted', 'farSighted',
                        'dryEye', 'posteriorSubcapsularCataract', 'presbyopia',
                        'glare', 'blurryVision', 'nightBlindness', 'halos',
                        'lossOfContrast', 'starbursting'
                      ];
                      
                      // Exclude diplopia conditions (handled by special duplicate image effect above)
                      const diplopiaTypes = [
                        'diplopiaMonocular', 'diplopiaBinocular'
                      ];
                      if (diplopiaTypes.includes(id)) return false;

                      // vitreousHemorrhage needs both CSS filters AND overlay, so don't exclude it
                      if (id === 'vitreousHemorrhage') return true;

                      // Visual disturbance overlays - explicitly include
                      if (id === 'visualFloaters' || id === 'hallucinations' ||
                          id === 'visualSnow' || id === 'visualSnowFlashing' || id === 'visualSnowColored' ||
                          id === 'visualSnowTransparent' || id === 'visualSnowDense' ||
                          id === 'visualAura' || id === 'visualAuraLeft' || id === 'visualAuraRight') {
                        return true;
                      }

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

                  {/* Additional scotoma blur layer for visual aura - with heat wave distortion */}
                  {enabledEffects.some(e => ['visualAura', 'visualAuraLeft', 'visualAuraRight'].includes(e.id)) && (() => {
                    const auraEffect = enabledEffects.find(e => ['visualAura', 'visualAuraLeft', 'visualAuraRight'].includes(e.id));
                    if (!auraEffect) return null;

                    const intensity = auraEffect.intensity;
                    // Position based on variant
                    const baseScotomaX = auraEffect.id === 'visualAuraLeft' ? 35 :
                                         auraEffect.id === 'visualAuraRight' ? 65 : 55;

                    // Heat wave distortion timing (half of original speed)
                    const now = Math.floor(Date.now() / 100);
                    const time = now / 60;
                    const heatWave1 = Math.sin(time * 0.6) * 3;
                    const heatWave2 = Math.sin(time * 0.45 + 1.5) * 2.5;
                    const heatWave3 = Math.cos(time * 0.55 + 2.2) * 2;

                    const wobbleX = Math.sin(time * 0.075) * 2 + heatWave1 * 0.3;
                    const wobbleY = Math.cos(time * 0.06) * 1.5 + heatWave2 * 0.25;
                    const pulse = Math.sin(time * 0.15) * 0.08 + 1;

                    // Heat wave distorted dimensions
                    const baseWidth = 50 + intensity * 30;
                    const baseHeight = 55 + intensity * 25;
                    const width = baseWidth + heatWave1 + heatWave3 * 0.5;
                    const height = baseHeight + heatWave2 + heatWave1 * 0.4;

                    return (
                      <Box
                        key="visual-aura-scotoma"
                        sx={{
                          position: 'absolute',
                          top: `calc(45% + ${wobbleY}%)`,
                          left: `calc(${baseScotomaX}% + ${wobbleX}%)`,
                          transform: 'translate(-50%, -50%)',
                          width: `${width}%`,
                          height: `${height}%`,
                          borderRadius: '50%',
                          background: `
                            radial-gradient(
                              ellipse 100% 100% at 50% 50%,
                              rgba(230,230,238,${0.5 * intensity * pulse}) 0%,
                              rgba(225,228,235,${0.4 * intensity}) 25%,
                              rgba(220,225,235,${0.3 * intensity}) 45%,
                              rgba(215,220,232,${0.2 * intensity}) 65%,
                              rgba(210,218,230,${0.1 * intensity}) 80%,
                              transparent 100%
                            )
                          `,
                          filter: `blur(${12 + intensity * 10}px)`,
                          opacity: 0.85,
                          pointerEvents: 'none',
                          zIndex: 4, // Below the main overlay
                        }}
                      />
                    );
                  })()}
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
