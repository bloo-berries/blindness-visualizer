import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';

interface ColorPreviewProps {
  type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 
        'monochromacy' | 'monochromatic' | 'cataracts' | 'glaucoma' | 'amd' | 'diabeticRetinopathy' | 
        'astigmatism' | 'retinitisPigmentosa' | 'stargardt';
  intensity: number;
}

// Color transformation matrices for different types of color blindness and vision conditions
const colorTransforms = {
  // Existing color blindness transformations
  protanopia: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#595959', '#A3A300', '#0000FF', '#A3A300', '#595959', '#A3A300']
  },
  deuteranopia: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF4242', '#676767', '#0000FF', '#EBEB00', '#FF4242', '#676767']
  },
  tritanopia: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF0000', '#00FF00', '#353535', '#FFEFEF', '#FF0000', '#FFEFEF']
  },
  protanomaly: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF7F7F', '#7FFF7F', '#0000FF', '#FFFF7F', '#FF7FFF', '#7FFFFF']
  },
  deuteranomaly: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF9999', '#99FF99', '#0000FF', '#FFFF99', '#FF99FF', '#99FFFF']
  },
  tritanomaly: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF0000', '#00FF00', '#7F7FFF', '#FFFFBF', '#FF7FFF', '#7FFFFF']
  },
  monochromacy: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#7F7F7F', '#7F7F7F', '#7F7F7F', '#E5E5E5', '#7F7F7F', '#E5E5E5']
  },
  monochromatic: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000']
  },
  // New vision conditions
  cataracts: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#D4A76A', '#A8B86A', '#6A8CD4', '#D4CD6A', '#D46AA8', '#6AD4CD'] // Yellowish tint and reduced contrast
  },
  glaucoma: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#330000', '#003300', '#000033', '#333300', '#330033', '#003333'] // Darkened peripheral vision
  },
  amd: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] // Central vision loss
  },
  diabeticRetinopathy: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#AA0000', '#00AA00', '#0000AA', '#AAAA00', '#AA00AA', '#00AAAA'] // Patchy vision loss and reduced clarity
  },
  astigmatism: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#FF8080', '#80FF80', '#8080FF', '#FFFF80', '#FF80FF', '#80FFFF'] // Blurred and distorted
  },
  retinitisPigmentosa: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#1A0000', '#001A00', '#00001A', '#1A1A00', '#1A001A', '#001A1A'] // Severe peripheral vision loss
  },
  stargardt: {
    normal: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    affected: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] // Central vision loss similar to AMD
  }
};

// Color names for labels
const colorNames = [
  'Red',
  'Green',
  'Blue',
  'Yellow',
  'Magenta',
  'Cyan'
];

const ColorPreview: React.FC<ColorPreviewProps> = ({ type, intensity }) => {
  const colors = colorTransforms[type];
  
  // Helper function to interpolate between two colors
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Special handling for conditions that affect vision differently
  const getAffectedColor = (normalColor: string, affectedColor: string, type: string, intensity: number) => {
    switch (type) {
      case 'monochromatic':
        return `rgba(0, 0, 0, ${intensity})`;
      case 'amd':
      case 'stargardt':
        // Central vision loss - creates a gradient from normal to black
        return `linear-gradient(rgba(0,0,0,${intensity}), ${normalColor})`;
      case 'glaucoma':
      case 'retinitisPigmentosa':
        // Peripheral vision loss - darker towards edges
        return `radial-gradient(circle at center, ${normalColor}, ${affectedColor})`;
      default:
        return interpolateColor(normalColor, affectedColor, intensity);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 1,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: 1
      }}>
        {colors.normal.map((normalColor, index) => {
          const affectedColor = colors.affected[index];
          const currentColor = getAffectedColor(normalColor, affectedColor, type, intensity);
          
          return (
            <Tooltip 
              key={index}
              title={
                <Box>
                  <Typography variant="caption">
                    {colorNames[index]}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 0.5,
                    alignItems: 'center' 
                  }}>
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      bgcolor: normalColor,
                      border: '1px solid white'
                    }}/>
                    <Typography variant="caption">→</Typography>
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      background: currentColor,
                      border: '1px solid white'
                    }}/>
                  </Box>
                </Box>
              }
              arrow
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: currentColor,
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'help'
                }}
                aria-label={`${colorNames[index]} color sample`}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ColorPreview; 