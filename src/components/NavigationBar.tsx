import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccessibilityMenu from './AccessibilityMenu';
import LanguageSelector from './LanguageSelector';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface NavigationBarProps {
  showHomeButton?: boolean;
  onHomeClick?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  showHomeButton = true,
  onHomeClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { preferences, cycleThemeMode } = useAccessibility();
  const { t } = useTranslation();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate('/');
    }
  };

  const handleStartSimulator = () => {
    navigate('/simulator');
  };

  const navItems = [
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.simulator'), path: '/simulator' },
    { label: t('nav.famousPeople'), path: '/famous-people' },
    { label: t('nav.glossary'), path: '/conditions' }
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip Navigation Links - Only show on non-home pages */}
      {location.pathname !== '/' && (
        <Box
          component="a"
          href="#main-content"
          sx={{
            position: 'absolute',
            left: -9999,
            top: -9999,
            background: 'white',
            color: 'black',
            padding: '8px 16px',
            textDecoration: 'none',
            borderRadius: '4px',
            zIndex: 9999,
            opacity: 0,
            visibility: 'hidden',
            '&:focus': {
              left: 6,
              top: 6,
              opacity: 1,
              visibility: 'visible',
            }
          }}
        >
          {t('accessibility.skipToContent')}
        </Box>
      )}
      <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-navbar-bg)',
        backdropFilter: 'blur(10px)',
        borderTop: 'none !important',
        borderBottom: '1px solid var(--color-navbar-border)',
        boxShadow: 'none',
        margin: 0,
        padding: 0,
        zIndex: 1200,
        '&::before': {
          content: '""',
          display: 'none',
        },
        '&::after': {
          content: '""',
          display: 'none',
        },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Toolbar sx={{ 
          px: { xs: 0 },
          minHeight: '56px',
          py: 0.75
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2,
                cursor: 'pointer',
                borderRadius: '8px',
                padding: '4px 8px',
                margin: '-4px -8px',
                '&:hover': {
                  opacity: 0.8,
                },
                '&:focus-visible': {
                  outline: '3px solid #60a5fa',
                  outlineOffset: '2px'
                },
                transition: 'opacity 0.2s ease-in-out'
              }}
              onClick={handleHomeClick}
              role="button"
              tabIndex={0}
              aria-label={t('nav.home')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleHomeClick();
                }
              }}
            >
              <VisibilityIcon 
                sx={{ 
                  color: preferences.highContrast ? '#000000' : 'white',
                  fontSize: 32,
                  mr: 1.25,
                  filter: preferences.highContrast ? 'none' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <Typography 
                variant="h5"
                component="div" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                }}
              >
                VisionSim
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              component="nav"
              aria-label={t('nav.mainNavigation')}
              sx={{
                display: 'flex',
                gap: 1,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      color: '#60a5fa',
                      backgroundColor: 'rgba(96, 165, 250, 0.15)',
                      transform: 'translateY(-1px)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #60a5fa',
                      outlineOffset: '2px'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Hamburger Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label={t('nav.openMenu')}
              onClick={handleMobileMenuToggle}
              sx={{
                ml: 1,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Start Simulator Button - hidden on mobile to save space */}
          {showHomeButton && !isMobile && (
            <Tooltip title={t('nav.startSimulator')}>
              <IconButton
                onClick={handleStartSimulator}
                aria-label={t('nav.startSimulator')}
                size="large"
                sx={{
                  ml: 2,
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  width: '40px',
                  height: '40px',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <VisibilityIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          )}

          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <Tooltip title={t(`theme.${preferences.themeMode}`)}>
            <IconButton
              onClick={cycleThemeMode}
              aria-label={t('theme.toggle')}
              size="large"
              sx={{
                color: 'white',
                width: '40px',
                height: '40px',
                '&:hover': {
                  color: '#60a5fa',
                  backgroundColor: 'rgba(96, 165, 250, 0.15)',
                },
                '&.Mui-focusVisible': {
                  outline: '3px solid #60a5fa',
                  outlineOffset: '2px'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {preferences.themeMode === 'light' && <LightModeIcon fontSize="medium" />}
              {preferences.themeMode === 'dim' && <Brightness4Icon fontSize="medium" />}
              {preferences.themeMode === 'dark' && <DarkModeIcon fontSize="medium" />}
            </IconButton>
          </Tooltip>

          {/* Accessibility Menu */}
          <AccessibilityMenu />
        </Toolbar>
      </Container>
    </AppBar>

    {/* Mobile Navigation Drawer */}
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      aria-label={t('nav.mobileNavigation')}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          backgroundColor: 'var(--color-drawer-bg)',
          color: 'white',
        },
      }}
    >
      <Box
        sx={{
          width: 280,
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        role="presentation"
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: '1.25rem',
              }}
            >
              {t('nav.navigation')}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavClick(item.path)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      backgroundColor: isActive ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#60a5fa' : 'white',
                        fontSize: '1rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        
        {/* GitHub Link at Bottom */}
        <Box sx={{ mt: 'auto', pb: { xs: 10, sm: 2 } }}>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://github.com/bloo-berries/blindness-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('nav.viewOnGithub')}
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
    </>
  );
};

export default NavigationBar; 