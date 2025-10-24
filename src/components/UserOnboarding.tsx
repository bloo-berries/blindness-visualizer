import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Accessibility as AccessibilityIcon,
  Keyboard as KeyboardIcon,
  TouchApp as TouchIcon
} from '@mui/icons-material';

interface UserOnboardingProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({
  open,
  onClose,
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    {
      label: 'Welcome to VisionSim',
      icon: <VisibilityIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            VisionSim helps you understand different vision conditions by simulating them in real-time. 
            You can upload your own images or use our demo content to experience how various visual 
            impairments affect perception.
          </Typography>
          <Card sx={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                🎯 What You'll Learn
              </Typography>
              <Typography variant="body2" component="div">
                • How different vision conditions affect daily life<br/>
                • The challenges faced by people with visual impairments<br/>
                • How to create more accessible digital experiences<br/>
                • The importance of inclusive design
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Getting Started',
      icon: <SettingsIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            The simulator has three simple steps:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: '#1e3a8a', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    1
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Choose Input Source
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload an image or use our demo video
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: '#1e3a8a', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    2
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Select Vision Conditions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from various visual impairments and adjust intensity
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: '#1e3a8a', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    3
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      View Simulation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See how your content appears with the selected conditions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )
    },
    {
      label: 'Accessibility Features',
      icon: <AccessibilityIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            VisionSim is designed to be accessible to everyone. Here are some key features:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <KeyboardIcon sx={{ color: '#1e3a8a' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Keyboard Navigation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use Tab, Arrow keys, and Enter to navigate. Press Alt+A for accessibility settings.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TouchIcon sx={{ color: '#1e3a8a' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Touch-Friendly Design
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All interactive elements are sized for easy touch interaction on mobile devices.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessibilityIcon sx={{ color: '#1e3a8a' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Customizable Experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Adjust text size, contrast, spacing, and motion to meet your needs.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 3,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Welcome to VisionSim
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {steps[activeStep].icon}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {steps[activeStep].label}
          </Typography>
        </Box>
        
        {steps[activeStep].content}
      </DialogContent>
      
      <DialogActions sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={handleSkip} color="inherit">
            Skip Tour
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              variant="contained"
              sx={{ minWidth: 100 }}
            >
              {activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UserOnboarding;
