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
  // const [showFixedNav, setShowFixedNav] = useState(true);
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

      // Enable comparison mode immediately for famous people
      setShowComparison(true);

      // Skip to the simulation step
      setActiveStep(2);
    }
  }, [location.state]);

  const handleToggle = useCallback((id: string) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => {
        if (effect.id === id) {
          // When enabling an effect, set intensity to 1.0 (100%) for maximum effect
          // When disabling, keep the current intensity for when it's re-enabled
          return { 
            ...effect, 
            enabled: !effect.enabled,
            intensity: !effect.enabled ? 1.0 : effect.intensity
          };
        }
        return effect;
      })
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
    
    // Auto-advance to next step when Demo Video or Image is selected
    if (source.type === 'youtube' || source.type === 'image') {

      setTimeout(() => {
        setActiveStep(1);
      }, 300); // Small delay for better UX
    }
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <InputSelector 
              currentSource={inputSource}
              onSourceChange={handleSourceChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 1.5 }}>
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
          <Box sx={{ p: 2 }}>
            <Visualizer 
              effects={effects} 
              inputSource={inputSource}
              diplopiaSeparation={diplopiaSeparation}
              diplopiaDirection={diplopiaDirection}
              personName={isFamousPeopleMode ? preconfiguredPerson?.name : undefined}
              personCondition={isFamousPeopleMode ? preconfiguredPerson?.condition : undefined}
              showComparison={showComparison}
              onToggleComparison={() => setShowComparison(!showComparison)}
              isFamousPeopleMode={isFamousPeopleMode}
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

  // Navigation is always visible, no need for scroll handler

  // Auto-enable comparison mode when reaching the final step
  useEffect(() => {
    if (activeStep === 2) {
      setShowComparison(true);
    }
  }, [activeStep]);

  // Determine if we're in "Famous People" mode or "Regular Simulator" mode
  const isFamousPeopleMode = preconfiguredPerson !== null;

  return (
    <Box className="app-container" sx={{ pb: 10 }}>
      <NavigationBar 
        showHomeButton={true}
        onHomeClick={handleHomeClick}
      />
      
      {/* Screen Reader Announcements */}
      <Box
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {activeStep === 0 && "Step 1: Choose your input source - webcam, image upload, or YouTube video"}
        {activeStep === 1 && "Step 2: Select vision conditions to simulate"}
        {activeStep === 2 && "Step 3: View your vision simulation"}
      </Box>
      <a 
        href="#main-content" 
        className="skip-to-content"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>
      <Container 
        maxWidth={false}
        sx={{ maxWidth: '1000px', py: 2, pt: 5 }}
        component="main"
        role="main"
        aria-labelledby="simulator-heading"
        id="main-content"
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2,
            pt: 3,
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
              mb: 2,
              mt: 3
            }}
          >
            Vision Condition Simulator
          </Typography>
          <Typography 
            variant="body2" 
            component="p"
            align="center"
            color="text.secondary"
            sx={{ mb: 1 }}
            id="simulator-description"
          >
            Use Tab to move, Arrows to adjust, and Enter/Space to activate. 
            Press Alt+A (Win/Linux) or Option+A (Mac) for accessibility settings.
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


          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              my: 1,
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

          {/* Navigation buttons positioned at the bottom of the content */}
          <Box 
            sx={{ 
              mt: 2,
              p: 1.5,
              backgroundColor: 'background.paper',
              borderTop: '1px solid #e2e8f0',
              borderRadius: '0 0 12px 12px'
            }}
          >
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
          </Box>
        </Paper>
        <Footer />
      </Container>
    </Box>
  );
};

export default VisionSimulator; 