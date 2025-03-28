import React, { useState } from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import AccessibilityStatement from './AccessibilityStatement';

const Footer: React.FC = () => {
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false);
  
  return (
    <Box component="footer" sx={{ mt: 6, py: 3, bgcolor: '#f0f0f0' }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Vision Condition Visualizer
          </Typography>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setAccessibilityDialogOpen(true);
              }}
              sx={{ mr: 3 }}
              aria-label="View accessibility statement"
            >
              Accessibility
            </Link>
            <Link href="https://github.com/bloo-berries/blindness-visualizer" target="_blank" rel="noopener">
              GitHub
            </Link>
          </Box>
        </Box>
      </Container>
      
      <AccessibilityStatement 
        open={accessibilityDialogOpen} 
        onClose={() => setAccessibilityDialogOpen(false)} 
      />
    </Box>
  );
};

export default Footer; 