import React, { useState } from 'react';
import { Box, Container, Typography, Link, Dialog, DialogContent, Button, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Favorite, GitHub as GitHubIcon } from '@mui/icons-material';
import AccessibilityStatement from './AccessibilityStatement';

const Footer: React.FC = () => {
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 0.75, sm: 1 },
        bgcolor: 'grey.50',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        borderTop: '1px solid #e2e8f0'
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px', px: { xs: 1.5, sm: 2 } }}>
        {/* Mobile Layout */}
        <Box 
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0.5, sm: 1 },
            py: 0,
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Left side - Accessibility */}
          <Box sx={{ 
            position: 'absolute',
            left: 0,
            flexShrink: 0
          }}>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setAccessibilityDialogOpen(true);
              }}
              aria-label="View accessibility statement"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Accessibility
            </Link>
          </Box>
          
          {/* Center - Support Button */}
          <Button
            variant="contained"
            href="https://linktr.ee/bloomedhealth"
            target="_blank"
            rel="noopener"
            startIcon={<Favorite sx={{ fontSize: '14px' }} />}
            sx={{
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: { xs: '11px', sm: '14px' },
              padding: { xs: '4px 10px', sm: '6px 20px' },
              textTransform: 'none',
              minWidth: 'auto',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                backgroundColor: '#C62828'
              }
            }}
          >
            Support
          </Button>
          
          {/* Right side - Feedback */}
          <Box sx={{ 
            position: 'absolute',
            right: 0,
            flexShrink: 0
          }}>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/feedback');
              }}
              aria-label="Provide feedback"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Feedback
            </Link>
          </Box>
        </Box>

        {/* Desktop Layout */}
        <Box 
          sx={{ 
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            position: 'relative'
          }}
        >
          {/* Left section - Copyright */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              position: 'absolute',
              left: 0
            }}
          >
            © {new Date().getFullYear()} VisionSim
          </Typography>
          
          {/* Center section - Support & Donate */}
          <Button
            variant="contained"
            href="https://linktr.ee/bloomedhealth"
            target="_blank"
            rel="noopener"
            startIcon={<Favorite sx={{ fontSize: '18px' }} />}
            sx={{
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '6px 20px',
              textTransform: 'none',
              position: 'relative',
              zIndex: 10002,
              pointerEvents: 'auto',
              '&:hover': {
                backgroundColor: '#C62828'
              }
            }}
          >
            Support & Donate
          </Button>
          
          {/* Right section - Other links */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            position: 'absolute',
            right: 0
          }}>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setAccessibilityDialogOpen(true);
              }}
              aria-label="View accessibility statement"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Accessibility
            </Link>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/feedback');
              }}
              aria-label="Provide feedback"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Feedback
            </Link>
            <Tooltip title="View on GitHub">
              <IconButton
                component="a"
                href="https://github.com/bloo-berries/blindness-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View project on GitHub"
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
      
      <Dialog 
        open={accessibilityDialogOpen} 
        onClose={() => setAccessibilityDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="accessibility-statement-title"
      >
        <DialogContent sx={{ p: 0 }}>
          <AccessibilityStatement />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Footer; 