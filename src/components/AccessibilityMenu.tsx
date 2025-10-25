import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Switch,
  Divider,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Contrast as ContrastIcon,
  TextFields as TextFieldsIcon,
  FormatLineSpacing as SpacingIcon,
  Visibility as FocusIcon,
  Speed as MotionIcon
} from '@mui/icons-material';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { preferences, toggleHighContrast, toggleLargeText, toggleIncreasedSpacing, toggleEnhancedFocus, toggleReducedMotion } = useAccessibility();

  // Count active accessibility features
  const activeFeaturesCount = Object.values(preferences).filter(Boolean).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Focus management for keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  // Handle keyboard shortcut Alt + A (Windows/Linux) or Option + A (Mac)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt key works on both Windows/Linux and Mac (Option key on Mac)
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        if (anchorEl) {
          setAnchorEl(null);
        } else {
          // Find the accessibility button and click it
          const button = document.querySelector('[aria-label="Open accessibility settings"]') as HTMLElement;
          if (button) {
            button.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [anchorEl]);

  const menuItems = [
    {
      id: 'high-contrast',
      label: 'High Contrast Mode',
      description: 'White text on black background for better visibility',
      icon: <ContrastIcon />,
      checked: preferences.highContrast,
      toggle: toggleHighContrast,
      wcag: 'WCAG 1.4.3'
    },
    {
      id: 'large-text',
      label: 'Large Text Mode',
      description: 'Increases all font sizes by 25%',
      icon: <TextFieldsIcon />,
      checked: preferences.largeText,
      toggle: toggleLargeText,
      wcag: 'WCAG 1.4.4'
    },
    {
      id: 'increased-spacing',
      label: 'Increased Spacing',
      description: 'More line height and letter spacing for readability',
      icon: <SpacingIcon />,
      checked: preferences.increasedSpacing,
      toggle: toggleIncreasedSpacing,
      wcag: 'WCAG 1.4.8'
    },
    {
      id: 'enhanced-focus',
      label: 'Enhanced Focus Indicators',
      description: 'Clear blue outlines for keyboard navigation',
      icon: <FocusIcon />,
      checked: preferences.enhancedFocus,
      toggle: toggleEnhancedFocus,
      wcag: 'WCAG 2.4.7'
    },
    {
      id: 'reduced-motion',
      label: 'Reduced Motion',
      description: 'Reduces animations and transitions',
      icon: <MotionIcon />,
      checked: preferences.reducedMotion,
      toggle: toggleReducedMotion,
      wcag: 'WCAG 2.3.3'
    }
  ];

  return (
    <>
      <Tooltip title="Accessibility Settings">
        <IconButton
          onClick={handleClick}
          aria-label={`Open accessibility settings${activeFeaturesCount > 0 ? ` (${activeFeaturesCount} active)` : ''}`}
          aria-expanded={open}
          aria-haspopup="true"
          size="large"
          sx={{
            color: activeFeaturesCount > 0 ? '#60a5fa' : 'white',
            width: '40px',
            height: '40px',
            position: 'relative',
            '&:hover': {
              color: '#60a5fa',
              backgroundColor: 'rgba(96, 165, 250, 0.15)',
              transform: 'scale(1.05)',
            },
            '&.Mui-focusVisible': {
              outline: '3px solid #60a5fa',
              outlineOffset: '2px'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <AccessibilityIcon fontSize="medium" />
          {activeFeaturesCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                border: '2px solid white'
              }}
            />
          )}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 320,
            maxWidth: 400,
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1.5,
            }
          }
        }}
        role="menu"
        aria-label="Accessibility settings"
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Accessibility Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize your viewing experience to meet WCAG 2.1 AA standards
          </Typography>
        </Box>
        
        <Divider />
        
        {menuItems.map((item, index) => (
          <MenuItem
            key={item.id}
            onClick={(e) => {
              // Only toggle if the click wasn't on the switch
              if (!(e.target as HTMLElement).closest('.MuiSwitch-root')) {
                item.toggle();
              }
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.04)',
              }
            }}
            role="menuitemcheckbox"
            aria-checked={item.checked}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Chip
                      label={item.wcag}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.description}
                  </Typography>
                }
              />
              <Switch
                checked={item.checked}
                onChange={item.toggle}
                onClick={(e) => e.stopPropagation()}
                inputProps={{
                  'aria-label': `${item.label} ${item.checked ? 'enabled' : 'disabled'}`,
                }}
                size="small"
              />
            </Box>
          </MenuItem>
        ))}
        
        <Divider />
        
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Settings are automatically saved and will persist across sessions.
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default AccessibilityMenu; 