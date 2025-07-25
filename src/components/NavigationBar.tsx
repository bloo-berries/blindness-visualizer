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

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Conditions', href: '#conditions' },
    { label: 'Research', href: '#research' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
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
        <Toolbar sx={{ px: { xs: 0 } }}>
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
                  color: 'primary.main', 
                  fontSize: 36, 
                  mr: 1.5 
                }} 
              />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em'
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
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
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
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  '&:hover': {
                    bgcolor: 'primary.dark',
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
                width: '40px',
                height: '40px',
                '&:hover': {
                  color: '#60a5fa',
                  backgroundColor: 'rgba(96, 165, 250, 0.15)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <GitHubIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar; 