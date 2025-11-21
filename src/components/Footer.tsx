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
        py: 2, 
        bgcolor: 'grey.50',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        borderTop: '1px solid #e2e8f0'
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
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
            startIcon={<Favorite />}
            sx={{
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '8px 24px',
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