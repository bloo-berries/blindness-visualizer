import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Tooltip
} from '@mui/material';
import Visualizer from './Visualizer';
import ControlPanel from './ControlPanel';
import InputSelector from './InputSelector';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

import { VisualEffect, InputSource } from '../types/visualEffects';
import { createDefaultEffects } from '../data/visualEffects';

const steps = ['Choose Input Source', 'Select Vision Conditions', 'View Simulation'];



const VisionSimulator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [showFixedNav, setShowFixedNav] = useState(true);
  const [inputSource, setInputSource] = useState<InputSource>({
    type: 'youtube',
  });
  const [preconfiguredPerson, setPreconfiguredPerson] = useState<{
    name: string;
    condition: string;
    conditions: string[];
  } | null>(null);
  const [effects, setEffects] = useState<VisualEffect[]>(createDefaultEffects());
  const [diplopiaSeparation, setDiplopiaSeparation] = useState(1.0);
  const [diplopiaDirection, setDiplopiaDirection] = useState(0.0);
  const [showComparison, setShowComparison] = useState(false);


  // Handle pre-configured conditions from famous people page
  useEffect(() => {
    if (location.state?.preconfiguredConditions) {
      const { preconfiguredConditions, personName, personCondition } = location.state;
      
      setPreconfiguredPerson({
        name: personName,
        condition: personCondition,
        conditions: preconfiguredConditions
      });

      // Enable the pre-configured conditions
      setEffects(prevEffects => 
        prevEffects.map(effect => ({
          ...effect,
          enabled: preconfiguredConditions.includes(effect.id)
        }))
      );

      // Skip to the simulation step
      setActiveStep(2);
    }
  }, [location.state]);

  const handleToggle = useCallback((id: string) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => 
        effect.id === id ? { ...effect, enabled: !effect.enabled } : effect
      )
    );
  }, []);

  const handleDeselectAll = useCallback(() => {
    setEffects(prevEffects => prevEffects.map(effect => ({ ...effect, enabled: false })));
  }, []);

  const handleIntensityChange = useCallback((id: string, intensity: number) => {
    setEffects(prevEffects => 
      prevEffects.map(effect =>
        effect.id === id ? { ...effect, intensity } : effect
      )
    );
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    // If user came from famous people page and is on step 2 (View Simulation), go back to famous people page
    // If user came from famous people page and is on step 1 (Select Vision Conditions), go back to famous people page
    // Otherwise, go to previous step in the simulation flow
    if (preconfiguredPerson && (activeStep === 2 || activeStep === 1)) {
      navigate('/famous-people');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleFinish = () => {
    // If user came from famous people page, redirect back there
    // Otherwise, redirect to homepage
    if (preconfiguredPerson) {
      navigate('/famous-people');
    } else {
      navigate('/');
    }
  };

  const handleSourceChange = useCallback((source: InputSource) => {
    // Prevent camera access - force to YouTube if someone tries to set webcam
    if (source.type === 'webcam') {
      setInputSource({ type: 'youtube' });
      return;
    }
    setInputSource(source);
    
    // Auto-advance to next step when Demo Video is selected
    if (source.type === 'youtube') {
      setTimeout(() => {
        setActiveStep(1);
      }, 300); // Small delay for better UX
    }
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <InputSelector 
              currentSource={inputSource}
              onSourceChange={handleSourceChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <ControlPanel 
              effects={effects}
              onToggle={handleToggle}
              onIntensityChange={handleIntensityChange}
              onDeselectAll={handleDeselectAll}
              diplopiaSeparation={diplopiaSeparation}
              diplopiaDirection={diplopiaDirection}
              onDiplopiaSeparationChange={setDiplopiaSeparation}
              onDiplopiaDirectionChange={setDiplopiaDirection}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Visualizer 
              effects={effects} 
              inputSource={inputSource}
              diplopiaSeparation={diplopiaSeparation}
              diplopiaDirection={diplopiaDirection}
              personName={preconfiguredPerson?.name || "Vision Condition Simulation"}
              personCondition={preconfiguredPerson?.condition || "Multiple Vision Conditions"}
              showComparison={showComparison}
              onToggleComparison={() => setShowComparison(!showComparison)}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' && activeStep < steps.length - 1) {
      handleNext();
    } else if (event.key === 'ArrowLeft' && activeStep > 0) {
      handleBack();
    } else if (event.key === 'Home') {
      setActiveStep(0);
    } else if (event.key === 'End') {
      setActiveStep(steps.length - 1);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Add scroll event listener to keep fixed nav visible
  useEffect(() => {
    const handleScroll = () => {
      // Always show the fixed navigation to ensure buttons are accessible
      setShowFixedNav(true);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check - always show navigation
    setShowFixedNav(true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-enable comparison mode when reaching the final step
  useEffect(() => {
    if (activeStep === 2) {
      setShowComparison(true);
    }
  }, [activeStep]);

  return (
    <Box className="app-container">
      <NavigationBar 
        showHomeButton={true}
        onHomeClick={handleHomeClick}
      />
      <a 
        href="#main-content" 
        className="skip-to-content"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>
      <Container 
        maxWidth="lg" 
        sx={{ py: 2, pt: 6 }}
        component="main"
        role="main"
        aria-labelledby="simulator-heading"
        id="main-content"
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            pt: 5,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: 'background.paper'
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            id="simulator-heading"
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 3
            }}
          >
            Vision Condition Simulator
          </Typography>
          <Typography 
            variant="body2" 
            component="p"
            align="center"
            color="text.secondary"
            sx={{ mb: 2 }}
            id="simulator-description"
          >
            Use the Tab key to navigate between controls, Arrow keys to adjust sliders, 
            and Enter/Space to activate buttons. Press Alt+A (Windows/Linux) or Option+A (Mac) to open accessibility settings.
          </Typography>
          <Typography 
            variant="h6" 
            gutterBottom 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 400 }}
          >
            Experience and understand different vision conditions in real-time
          </Typography>

          {preconfiguredPerson && (
            <Box 
              sx={{ 
                mb: 2, 
                p: 2, 
                backgroundColor: 'primary.light', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                Simulating: {preconfiguredPerson.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                Condition: {preconfiguredPerson.condition}
              </Typography>
              {/* Hidden technical details for cleaner UI */}
              {/* <Typography variant="body2" sx={{ color: 'white' }}>
                Active simulations: {preconfiguredPerson.conditions.join(', ')}
              </Typography> */}
            </Box>
          )}

          {/* Video playing message for all visualizations */}
          <Box sx={{ 
            mb: 2, 
            p: 1.5, 
            backgroundColor: '#e3f2fd', 
            borderRadius: 1, 
            border: '1px solid #2196f3',
            textAlign: 'center'
          }}>
            <Typography 
              variant="body2" 
              className="video-info-text"
              sx={{ color: '#1976d2', fontWeight: 500 }}
            >
              📹 Although you may not be able to see a video, a video is actively playing behind this blindness visualization.
            </Typography>
          </Box>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              my: 2,
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'primary.main',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'primary.main',
              },
              '& .MuiStepLabel-label': {
                fontWeight: 500,
                color: 'text.secondary',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'text.primary',
                fontWeight: 600,
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: 'text.primary',
                fontWeight: 600,
              }
            }}
            aria-label={`Step ${activeStep + 1} of ${steps.length}: ${steps[activeStep]}`}
          >
            {steps.map((label, index) => (
              <Step 
                key={label}
                aria-current={activeStep === index ? "step" : undefined}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          {/* Fixed navigation buttons that stay visible at the bottom of the viewport */}
          <Box 
            sx={{ 
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 0',
              backgroundColor: 'background.paper',
              borderTop: '1px solid #e2e8f0',
              boxShadow: '0px -4px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              opacity: 1,
              visibility: 'visible'
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  maxWidth: '100%'
                }}
                role="navigation"
                aria-label="Wizard navigation"
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  aria-label="Go back to previous step"
                  variant="outlined"
                  size="large"
                >
                  BACK
                </Button>
                <Tooltip 
                  title={inputSource.type === 'webcam' && activeStep === 0 ? "Camera feature is coming soon as a premium feature" : ""}
                  placement="top"
                >
                  <span>
                    <Button
                      variant="contained"
                      onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
                      aria-label={`Go to ${activeStep < steps.length - 1 ? 'next step' : 'finish'}`}
                      size="large"
                      disabled={inputSource.type === 'webcam' && activeStep === 0}
                    >
                      {activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Container>
          </Box>
          
          {/* Spacer to prevent content from being hidden behind fixed navigation */}
          <Box sx={{ height: '72px', mt: 3 }} />
        </Paper>
        <Footer />
      </Container>
    </Box>
  );
};

export default VisionSimulator; 