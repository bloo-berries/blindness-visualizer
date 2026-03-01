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
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Contrast as ContrastIcon,
  TextFields as TextFieldsIcon,
  FormatLineSpacing as SpacingIcon,
  Visibility as FocusIcon,
  Speed as MotionIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityMenu: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { preferences, toggleHighContrast, toggleLargeText, toggleIncreasedSpacing, toggleEnhancedFocus, toggleReducedMotion } = useAccessibility();
  const { t } = useTranslation();

  // Count active accessibility features (exclude themeMode which is not a boolean toggle)
  const activeFeaturesCount = Object.entries(preferences)
    .filter(([key]) => key !== 'themeMode')
    .filter(([, value]) => value === true).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  // Focus management for keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  const open = Boolean(anchorEl) || drawerOpen;

  // Handle keyboard shortcut Alt + A (Windows/Linux) or Option + A (Mac)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt key works on both Windows/Linux and Mac (Option key on Mac)
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        if (isMobile) {
          setDrawerOpen(!drawerOpen);
        } else {
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [anchorEl, drawerOpen, isMobile]);

  const menuItems = [
    {
      id: 'high-contrast',
      label: t('accessibility.highContrast'),
      description: t('accessibility.highContrastDesc'),
      icon: <ContrastIcon />,
      checked: preferences.highContrast,
      toggle: toggleHighContrast,
      wcag: 'WCAG 1.4.3'
    },
    {
      id: 'large-text',
      label: t('accessibility.largeText'),
      description: t('accessibility.largeTextDesc'),
      icon: <TextFieldsIcon />,
      checked: preferences.largeText,
      toggle: toggleLargeText,
      wcag: 'WCAG 1.4.4'
    },
    {
      id: 'increased-spacing',
      label: t('accessibility.increasedSpacing'),
      description: t('accessibility.increasedSpacingDesc'),
      icon: <SpacingIcon />,
      checked: preferences.increasedSpacing,
      toggle: toggleIncreasedSpacing,
      wcag: 'WCAG 1.4.8'
    },
    {
      id: 'enhanced-focus',
      label: t('accessibility.enhancedFocus'),
      description: t('accessibility.enhancedFocusDesc'),
      icon: <FocusIcon />,
      checked: preferences.enhancedFocus,
      toggle: toggleEnhancedFocus,
      wcag: 'WCAG 2.4.7'
    },
    {
      id: 'reduced-motion',
      label: t('accessibility.reducedMotion'),
      description: t('accessibility.reducedMotionDesc'),
      icon: <MotionIcon />,
      checked: preferences.reducedMotion,
      toggle: toggleReducedMotion,
      wcag: 'WCAG 2.3.3'
    }
  ];

  return (
    <>
      <Tooltip title={t('accessibility.menu')}>
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
      
      {/* Desktop Menu */}
      {!isMobile && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
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
              maxHeight: 'calc(100vh - 100px)',
              overflow: 'auto',
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
              {t('accessibility.menu')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              WCAG 2.1 AA
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleClose}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '90vh',
              overflow: 'auto',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              pt: 2,
              pb: 3,
            }}
            role="presentation"
          >
            {/* Drawer Handle */}
            <Box
              sx={{
                width: 40,
                height: 4,
                backgroundColor: 'grey.300',
                borderRadius: 2,
                mx: 'auto',
                mb: 2,
              }}
            />

            {/* Header with Close Button */}
            <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('accessibility.menu')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  WCAG 2.1 AA
                </Typography>
              </Box>
              <IconButton
                onClick={handleClose}
                aria-label="Close accessibility menu"
                size="small"
                sx={{
                  mt: -0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider />
            
            {/* Menu Items */}
            <List sx={{ pt: 0 }}>
              {menuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={(e) => {
                        // Only toggle if the click wasn't on the switch
                        if (!(e.target as HTMLElement).closest('.MuiSwitch-root')) {
                          item.toggle();
                        }
                      }}
                      sx={{
                        py: 2.5,
                        px: 3,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        '&:hover': {
                          backgroundColor: 'rgba(30, 58, 138, 0.04)',
                        }
                      }}
                      role="checkbox"
                      aria-checked={item.checked}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 44, color: 'primary.main' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                {item.label}
                              </Typography>
                              <Chip
                                label={item.wcag}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 22, 
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
                          size="medium"
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            
            {/* Footer */}
            <Box sx={{ px: 3, pt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Settings are automatically saved and will persist across sessions.
              </Typography>
            </Box>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default AccessibilityMenu; 