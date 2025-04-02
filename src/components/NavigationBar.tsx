import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

interface NavigationBarProps {
  showHomeButton?: boolean;
  onHomeClick?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  showHomeButton = true,
  onHomeClick 
}) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 1000,
      }}
    >
      {showHomeButton && (
        <Tooltip title="Home">
          <IconButton
            onClick={handleHomeClick}
            aria-label="Go to home page"
            size="large"
            sx={{
              bgcolor: '#ffffff',
              color: '#000000',
              width: '48px',
              height: '48px',
              '&:hover': {
                bgcolor: '#f0f0f0',
                color: '#2196f3',
              },
              boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
              border: '2px solid #2196f3',
            }}
          >
            <HomeIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default NavigationBar; 