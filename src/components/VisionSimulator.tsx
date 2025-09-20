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
  Button
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
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <InputSelector 
              currentSource={inputSource}
              onSourceChange={setInputSource}
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

  // Add scroll event listener to hide fixed nav when at bottom
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is at bottom of page (with small buffer)
      const bottomThreshold = 50;
      const isAtBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - bottomThreshold;
      
      setShowFixedNav(!isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        sx={{ py: 3, pt: 8 }}
        component="main"
        role="main"
        aria-labelledby="simulator-heading"
        id="main-content"
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: 'background.paper'
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            id="simulator-heading"
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 1
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
                mb: 4, 
                p: 3, 
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
              <Typography variant="body2" sx={{ color: 'white' }}>
                Active simulations: {preconfiguredPerson.conditions.join(', ')}
              </Typography>
            </Box>
          )}

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              my: 4,
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
              boxShadow: '0px -2px 4px rgba(0,0,0,0.1)',
              zIndex: 1000,
              opacity: showFixedNav ? 1 : 0,
              visibility: showFixedNav ? 'visible' : 'hidden',
              transition: 'opacity 0.3s, visibility 0.3s'
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
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  aria-label={`Go to ${activeStep < steps.length - 1 ? 'next step' : 'finish'}`}
                  size="large"
                >
                  {activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}
                </Button>
              </Box>
            </Container>
          </Box>
          
          {/* Spacer to prevent content from being hidden behind fixed navigation */}
          <Box sx={{ height: showFixedNav ? '72px' : '0px', mt: showFixedNav ? 3 : 0 }} />
        </Paper>
        <Footer />
      </Container>
    </Box>
  );
};

export default VisionSimulator; 