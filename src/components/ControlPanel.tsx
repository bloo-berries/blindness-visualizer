import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  Grid,
  Tooltip,
  IconButton,
  FormControlLabel
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { VisualEffect } from '../App';
import ConditionPreview from './ConditionPreview';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
}

// Helper function to check if an effect supports visual preview
const supportsVisualPreview = (id: string) => {
  return [
    'cataracts',
    'glaucoma',
    'amd',
    'diabeticRetinopathy',
    'astigmatism',
    'retinitisPigmentosa',
    'stargardt',
    'monochromatic'
  ].includes(id);
};

// Helper function to check if an effect is a color blindness type
const isColorBlindnessEffect = (id: string) => {
  return [
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'monochromacy'
  ].includes(id);
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  effects,
  onToggle,
  onIntensityChange
}) => {
  return (
    <Box 
      role="region" 
      aria-label="Vision condition controls"
    >
      <Typography 
        variant="h6" 
        gutterBottom
        id="vision-controls-heading"
      >
        Select Vision Conditions
      </Typography>
      
      <Grid container spacing={3}>
        {effects.map(effect => (
          <Grid item xs={12} sm={6} key={effect.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="div"
                    id={`${effect.id}-label`}
                  >
                    {effect.name}
                  </Typography>
                  <Tooltip title={effect.description}>
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1 }}
                      aria-label={`Learn more about ${effect.name}`}
                    >
                      <Info />
                    </IconButton>
                  </Tooltip>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={effect.enabled}
                        onChange={() => onToggle(effect.id)}
                        inputProps={{ 
                          'aria-label': `Toggle ${effect.name}`,
                          'aria-describedby': `${effect.id}-description`
                        }}
                      />
                    }
                    label={`Enable ${effect.name}`}
                    labelPlacement="end"
                    sx={{ 
                      ml: 'auto',
                      '.MuiFormControlLabel-label': { 
                        position: 'absolute', 
                        width: '1px', 
                        height: '1px',
                        padding: 0,
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        border: 0
                      }
                    }}
                  />
                </Box>
                
                <Box id={`${effect.id}-description`}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {effect.description}
                  </Typography>
                </Box>

                {(isColorBlindnessEffect(effect.id) || supportsVisualPreview(effect.id)) && (
                  <Box sx={{ mb: 2 }}>
                    <ConditionPreview 
                      type={effect.id}
                      intensity={effect.intensity}
                    />
                  </Box>
                )}
                
                <Slider
                  value={effect.intensity * 100}
                  onChange={(_, value) => 
                    onIntensityChange(effect.id, (value as number) / 100)
                  }
                  disabled={!effect.enabled}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value}%`}
                  aria-label={`Adjust ${effect.name} intensity`}
                  aria-valuetext={`${effect.intensity * 100}%`}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ControlPanel; 