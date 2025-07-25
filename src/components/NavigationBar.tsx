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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <VisibilityIcon 
                sx={{ 
                  color: 'primary.main', 
                  fontSize: 28, 
                  mr: 1 
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '1.25rem'
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
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    }
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
                color: 'text.secondary',
                width: '40px',
                height: '40px',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(30, 58, 138, 0.04)',
                },
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