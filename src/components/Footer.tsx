import React, { useState } from 'react';
import { Box, Container, Typography, Link, Divider, Dialog, DialogContent } from '@mui/material';
import AccessibilityStatement from './AccessibilityStatement';

const Footer: React.FC = () => {
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false);
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 1, 
        py: 2, 
        bgcolor: 'grey.50'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            © {new Date().getFullYear()} VisionSim
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            mt: { xs: 2, sm: 0 } 
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
              href="https://github.com/bloo-berries/blindness-visualizer" 
              target="_blank" 
              rel="noopener"
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
              GitHub
            </Link>
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