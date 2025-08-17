import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Slider, FormControlLabel, Switch } from '@mui/material';
import ColorVisionPreview from './ColorVisionPreview';
import { ConditionType } from '../types/visualEffects';
import { getColorVisionDescription, getColorVisionPrevalence } from '../utils/colorVisionFilters';

const ColorVisionDemo: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('protanopia');
  const [intensity, setIntensity] = useState(1.0);
  const [enabled, setEnabled] = useState(true);

  const colorVisionConditions: ConditionType[] = [
    'protanopia',
    'deuteranopia', 
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'monochromatic',
    'monochromacy'
  ];

  const conditionNames: Partial<Record<ConditionType, string>> = {
    protanopia: 'Protanopia (Red-Blind)',
    deuteranopia: 'Deuteranopia (Green-Blind)',
    tritanopia: 'Tritanopia (Blue-Blind)',
    protanomaly: 'Protanomaly (Red-Weak)',
    deuteranomaly: 'Deuteranomaly (Green-Weak)',
    tritanomaly: 'Tritanomaly (Blue-Weak)',
    monochromatic: 'Monochromacy (Complete Color Blindness)',
    monochromacy: 'Monochromatic Vision'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Color Vision Deficiency Simulation
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This demo showcases scientifically accurate color vision deficiency simulation using Machado 2009 transformation matrices.
      </Typography>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Controls
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
              }
              label="Enable Simulation"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Select Condition:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {colorVisionConditions.map((condition) => (
                <FormControlLabel
                  key={condition}
                  control={
                                         <Switch
                       checked={selectedCondition === condition}
                       onChange={() => setSelectedCondition(condition)}
                       disabled={!enabled}
                     />
                   }
                   label={conditionNames[condition] || condition}
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Intensity: {Math.round(intensity * 100)}%
            </Typography>
            <Slider
              value={intensity}
              onChange={(_, value) => setIntensity(value as number)}
              min={0}
              max={1}
              step={0.01}
              disabled={!enabled}
              sx={{ mb: 2 }}
            />

            {enabled && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {getColorVisionDescription(selectedCondition)}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Prevalence:
                </Typography>
                <Typography variant="body2">
                  {getColorVisionPrevalence(selectedCondition)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Box sx={{ 
              height: '400px', 
              border: '1px solid #ddd', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {enabled ? (
                <ColorVisionPreview 
                  type={selectedCondition} 
                  intensity={intensity} 
                />
              ) : (
                <Box
                  component="img"
                  src="/assets/images/garden.png"
                  alt="Normal vision reference"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ColorVisionDemo;
