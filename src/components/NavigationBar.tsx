import React from 'react';
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
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate('/');
    }
  };

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Conditions Glossary', path: '/conditions' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Feedback', path: '/feedback' }
  ];

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
      <Container maxWidth="lg">
        <Toolbar sx={{ 
          px: { xs: 0 },
          minHeight: '80px', // Increased from default
          py: 2 // Added vertical padding
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 3,
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
                  color: 'white', // Changed from primary.main to white for better visibility
                  fontSize: 48, // Increased from 36
                  mr: 2, // Increased from 1.5
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' // Added drop shadow for better visibility
                }} 
              />
              <Typography 
                variant="h4" // Changed from h5
                component="div" 
                sx={{ 
                  fontWeight: 900, // Increased from 800
                  color: 'white',
                  fontSize: '2.2rem', // Increased from 2rem
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', // Added text shadow for better visibility
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))' // Added drop shadow
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
              gap: 2,
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
                    fontSize: '1.1rem', // Increased from 0.95rem
                    textTransform: 'none',
                    padding: '12px 20px', // Increased from 8px 16px
                    borderRadius: '8px', // Increased from 6px
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
                  width: '50px', // Increased from 40px
                  height: '50px', // Increased from 40px
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <HomeIcon fontSize="large" /> {/* Changed from medium */}
              </IconButton>
            </Tooltip>
          )}

          {/* Accessibility Menu */}
          <AccessibilityMenu />

          {/* GitHub Link */}
          <Tooltip title="View on GitHub">
            <IconButton
              component="a"
              href="https://github.com/bloo-berries/blindness-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project on GitHub"
              size="large"
              sx={{
                ml: 2,
                color: 'white',
                width: '50px', // Increased from 40px
                height: '50px', // Increased from 40px
                '&:hover': {
                  color: '#60a5fa',
                  backgroundColor: 'rgba(96, 165, 250, 0.15)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <GitHubIcon fontSize="large" /> {/* Changed from medium */}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};

export default NavigationBar; 