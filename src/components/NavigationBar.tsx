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
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessibilityMenu from './AccessibilityMenu';

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

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate('/');
    }
  };

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Vision Simulator', path: '/simulator' },
    { label: 'Famous Blind People', path: '/famous-people' },
    { label: 'Glossary & FAQ', path: '/conditions' }
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
            top: -40,
            left: 6,
            background: 'white',
            color: 'black',
            padding: '8px 16px',
            textDecoration: 'none',
            borderRadius: '4px',
            zIndex: 9999,
            '&:focus': {
              top: 6,
            }
          }}
        >
          Skip to main content
        </Box>
      )}
      <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        backgroundColor: '#1e293b',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #334155',
        zIndex: 1200,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Toolbar sx={{ 
          px: { xs: 0 },
          minHeight: '64px',
          py: 1
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 2,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
                transition: 'opacity 0.2s ease-in-out'
              }}
              onClick={handleHomeClick}
              role="button"
              tabIndex={0}
              aria-label="Navigate to home page"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleHomeClick();
                }
              }}
            >
              <VisibilityIcon 
                sx={{ 
                  color: 'white',
                  fontSize: 36,
                  mr: 1.5,
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <Typography 
                variant="h5"
                component="div" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.75rem',
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
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
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
              aria-label="open navigation menu"
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

          {/* Home Button */}
          {showHomeButton && (
            <Tooltip title="Start Simulator">
              <IconButton
                onClick={handleHomeClick}
                aria-label="Start vision simulator"
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
                <HomeIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          )}

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
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          backgroundColor: '#1e293b',
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
              Navigation
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
                primary="View on GitHub"
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