import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { ConditionType } from '../types/visualEffects';
import { 
  getColorVisionMatrix, 
  isColorVisionCondition
} from '../utils/colorVisionFilters';

interface ColorVisionPreviewProps {
  type: ConditionType;
  intensity: number;
}

// Reference image for color vision simulation
const REFERENCE_IMAGE = '/assets/images/garden-fallback.jpg';

const ColorVisionPreview: React.FC<ColorVisionPreviewProps> = ({ type, intensity }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Smooth intensity transitions
  useEffect(() => {
    const transitionDuration = 300; // ms
    const startTime = Date.now();
    const startIntensity = currentIntensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      // Easing function for smooth transition
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCurrentIntensity(startIntensity + (intensity - startIntensity) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [intensity, currentIntensity]);

  // Load the reference image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = REFERENCE_IMAGE;
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    
    img.onerror = (e) => {
      console.error(`Failed to load reference image for ${type}:`, e);
      // Try fallback image
      img.src = '/assets/images/garden-fallback.jpg';
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [type]);

  // Get CSS filter for color vision simulation
  const getFilter = (): string => {
    if (!isColorVisionCondition(type)) {
      return '';
    }

    // For monochromacy, use CSS filters
    if (type === 'monochromatic' || type === 'monochromacy') {
      return `saturate(0) contrast(${100 + currentIntensity * 20}%)`;
    }

    // Get the matrix for this condition
    const matrix = getColorVisionMatrix(type, currentIntensity);
    
    // Convert to CSS matrix format (4x5 matrix for CSS filter)
    const cssMatrix = [
      matrix[0], matrix[1], matrix[2], 0, 0,
      matrix[3], matrix[4], matrix[5], 0, 0,
      matrix[6], matrix[7], matrix[8], 0, 0,
      0, 0, 0, 1, 0
    ];
    
    return `matrix(${cssMatrix.join(', ')})`;
  };

  // Add custom class for condition type
  const conditionClass = `color-vision-${type}`;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0,
        bgcolor: 'transparent',
        border: 'none',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'none'
      }}
    >
      <Box 
        className={conditionClass}
        sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',  
          overflow: 'hidden',
          borderRadius: 1,
          backgroundColor: 'transparent',
        }}
      >
        {/* Base Image with Color Vision Filter */}
        {imageLoaded && (
          <Box
            component="img"
            src={REFERENCE_IMAGE}
            alt={`${type} color vision simulation`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              filter: getFilter(),
              transition: 'filter 0.3s ease'
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default ColorVisionPreview;
