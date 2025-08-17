import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getColorVisionMatrix } from '../utils/colorVisionFilters';
import { ConditionType } from '../types/visualEffects';

const ColorVisionDebug: React.FC = () => {
  const conditions: ConditionType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'deuteranomaly'];
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Color Vision Filter Debug
      </Typography>
      
      {conditions.map((condition) => (
        <Paper key={condition} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{condition}</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
            Matrix: {getColorVisionMatrix(condition, 1.0).join(', ')}
          </Typography>
          
          <Box sx={{ mt: 2, height: '100px', border: '1px solid #ddd' }}>
            <Box
              component="img"
              src="/assets/images/garden.png"
              alt={`${condition} test`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ColorVisionDebug;
