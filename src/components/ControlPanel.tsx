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
  FormControlLabel,
  Button
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { VisualEffect } from '../App';
import ConditionPreview, { ConditionType } from './ConditionPreview';

interface ControlPanelProps {
  effects: VisualEffect[];
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, intensity: number) => void;
  onDeselectAll: () => void;
}

// Helper function to check if an effect supports visual preview
const supportsVisualPreview = (id: string) => {
  // All conditions should show a preview
  return true;
  
  // Previously limited to:
  // return [
  //   'cataracts',
  //   'glaucoma',
  //   'amd',
  //   'diabeticRetinopathy',
  //   'astigmatism',
  //   'retinitisPigmentosa',
  //   'stargardt',
  //   'monochromatic'
  // ].includes(id);
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

const conditionDescriptions: Record<ConditionType, string> = {
  protanopia: "Red color blindness - inability to perceive red light",
  deuteranopia: "Green color blindness - inability to perceive green light",
  tritanopia: "Blue color blindness - inability to perceive blue light",
  protanomaly: "Red color weakness - reduced ability to perceive red light",
  deuteranomaly: "Green color weakness - reduced ability to perceive green light",
  tritanomaly: "Blue color weakness - reduced ability to perceive blue light",
  monochromacy: "Complete color blindness - seeing only in shades of gray",
  monochromatic: "Partial color blindness - seeing only in shades of one color",
  cataracts: "Clouding of the eye's lens, causing blurry vision and glare sensitivity",
  glaucoma: "Damage to the optic nerve, leading to peripheral vision loss",
  amd: "Age-related macular degeneration - central vision loss",
  diabeticRetinopathy: "Diabetes-related damage to the retina's blood vessels",
  astigmatism: "Irregular corneal shape causing blurred vision at all distances",
  retinitisPigmentosa: "Genetic disorder causing progressive vision loss",
  stargardt: "Genetic disorder causing central vision loss",
  hemianopiaLeft: "Loss of the left half of the visual field",
  hemianopiaRight: "Loss of the right half of the visual field",
  quadrantanopia: "Loss of a quarter of the visual field",
  scotoma: "Blind spot in the visual field",
  visualAura: "Legacy visual disturbances often associated with migraines",
  visualAuraLeft: "Visual disturbances with zigzag patterns in the left visual field, often preceding migraines. Appears as shimmering lights that may expand from the center toward the left periphery.",
  visualAuraRight: "Visual disturbances with zigzag patterns in the right visual field, often preceding migraines. Appears as shimmering lights that may expand from the center toward the right periphery.",
  visualSnow: "Static-like visual disturbance across the entire visual field",
  visualFloaters: "Small spots or strands floating in the visual field",
  hallucinations: "Seeing things that aren't there",
  nearSighted: "Difficulty seeing distant objects clearly",
  farSighted: "Difficulty seeing nearby objects clearly",
  diplopiaMonocular: "Monocular diplopia (double vision in one eye) - A condition where you see double images with one eye closed. This is often caused by eye conditions like astigmatism, cataracts, or corneal irregularities.",
  diplopiaBinocular: "Binocular diplopia (double vision in both eyes) - A condition where you see double images only when both eyes are open. This is often caused by misalignment of the eyes or neurological conditions."
};

const conditionCategories: Record<string, ConditionType[]> = {
  "Visual Field Loss": ['hemianopiaLeft', 'hemianopiaRight', 'quadrantanopia', 'scotoma'],
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
      
      {effectsByCategory.map(({ category, effects }) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}
            id={`${category.toLowerCase().replace(/\s+/g, '-')}-heading`}
          >
            {category}
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

                    <Box sx={{ mb: 2 }}>
                      <ConditionPreview 
                        type={effect.id as ConditionType}
                        intensity={effect.intensity}
                      />
                    </Box>
                    
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
      ))}
    </Box>
  );
};

export default ControlPanel; 