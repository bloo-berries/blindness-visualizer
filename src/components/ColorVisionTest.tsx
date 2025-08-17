import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { getColorVisionMatrix } from '../utils/colorVisionFilters';
import { ConditionType } from '../types/visualEffects';

const ColorVisionTest: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('deuteranomaly');
  const [intensity, setIntensity] = useState(1.0);

  const conditions: ConditionType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'deuteranomaly'];

  const getFilter = (condition: ConditionType, intensity: number): string => {
    const matrix = getColorVisionMatrix(condition, intensity);
    const cssMatrix = [
      matrix[0], matrix[1], matrix[2], 0, 0,
      matrix[3], matrix[4], matrix[5], 0, 0,
      matrix[6], matrix[7], matrix[8], 0, 0,
      0, 0, 0, 1, 0
    ];
    return `matrix(${cssMatrix.join(', ')})`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Color Vision Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Selected: {selectedCondition}</Typography>
        <Typography variant="body2">Intensity: {intensity}</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Matrix: {getColorVisionMatrix(selectedCondition, intensity).join(', ')}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Filter: {getFilter(selectedCondition, intensity)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {conditions.map((condition) => (
          <Button
            key={condition}
            variant={selectedCondition === condition ? 'contained' : 'outlined'}
            onClick={() => setSelectedCondition(condition)}
          >
            {condition}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button onClick={() => setIntensity(0)}>0%</Button>
        <Button onClick={() => setIntensity(0.25)}>25%</Button>
        <Button onClick={() => setIntensity(0.5)}>50%</Button>
        <Button onClick={() => setIntensity(0.75)}>75%</Button>
        <Button onClick={() => setIntensity(1)}>100%</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {conditions.map((condition) => (
          <Paper key={condition} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>{condition}</Typography>
            <Box
              component="img"
              src="/assets/images/garden.png"
              alt={`${condition} test`}
              sx={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                filter: getFilter(condition, intensity),
                border: '1px solid #ddd'
              }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontFamily: 'monospace' }}>
              {getFilter(condition, intensity)}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ColorVisionTest;
