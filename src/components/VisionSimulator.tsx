import React, { useState, useEffect } from 'react';
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
import { ConditionType } from './ConditionPreview';

const steps = ['Choose Input Source', 'Select Vision Conditions', 'View Simulation'];

export interface VisualEffect {
  id: ConditionType;
  name: string;
  enabled: boolean;
  intensity: number;
  description: string;
}

export type InputSource = {
  type: 'webcam' | 'image' | 'youtube';
  url?: string;
};

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
  const [effects, setEffects] = useState<VisualEffect[]>([
    { 
      id: 'hemianopiaLeft',
      name: 'Homonymous Hemianopia (Left-field)',
      enabled: false,
      intensity: 1.0,
      description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.'
    },
    { 
      id: 'hemianopiaRight',
      name: 'Homonymous Hemianopia (Right-field)',
      enabled: false,
      intensity: 1.0,
      description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.'
    },
    { 
      id: 'quadrantanopia',
      name: 'Quadrantanopia',
      enabled: false,
      intensity: 1.0,
      description: 'Loss of vision in one quarter (quadrant) of the visual field. Often caused by damage to specific parts of the brain that process vision. Affects spatial awareness and navigation.'
    },
    { 
      id: 'scotoma',
      name: 'Scotoma',
      enabled: false,
      intensity: 1.0,
      description: 'Blind spot or partial vision loss in an otherwise normal visual field. Appears as a dark or blurry spot in vision. May be caused by various eye conditions, migraines, or neurological disorders.'
    },
    { 
      id: 'visualAuraLeft',
      name: 'Visual Aura (Left Field)',
      enabled: false,
      intensity: 1.0,
      description: 'Temporary visual disturbances with zigzag patterns in the left visual field, often preceding migraines. Appears as shimmering lights that may expand from the center toward the left periphery.'
    },
    { 
      id: 'visualAuraRight',
      name: 'Visual Aura (Right Field)',
      enabled: false,
      intensity: 1.0,
      description: 'Temporary visual disturbances with zigzag patterns in the right visual field, often preceding migraines. Appears as shimmering lights that may expand from the center toward the right periphery.'
    },
    { 
      id: 'visualFloaters',
      name: 'Visual Floaters',
      enabled: false,
      intensity: 1.0,
      description: 'Small dark shapes that drift through vision, appearing as dots, cobwebs, or squiggly lines'
    },
    { 
      id: 'protanomaly',
      name: 'Protanomaly (Red-Weak)',
      enabled: false,
      intensity: 1.0,
      description: 'Reduced sensitivity to red light. Red appears darker, and colors containing red look less bright.'
    },
    { 
      id: 'protanopia',
      name: 'Protanopia (Red-Blind)',
      enabled: false,
      intensity: 1.0,
      description: 'Complete inability to see red light. Colors appear as shades of blue and gold, and red may appear as black.'
    },
    { 
      id: 'deuteranomaly',
      name: 'Deuteranomaly (Green-Weak)',
      enabled: false,
      intensity: 1.0,
      description: 'Reduced sensitivity to green light. Most common type, making it hard to tell the difference between reds and greens.'
    },
    { 
      id: 'deuteranopia',
      name: 'Deuteranopia (Green-Blind)',
      enabled: false,
      intensity: 1.0,
      description: 'Complete inability to see green light. Colors appear mostly as blues and golds, with difficulty distinguishing reds and greens.'
    },
    { 
      id: 'tritanomaly',
      name: 'Tritanomaly (Blue-Weak)',
      enabled: false,
      intensity: 1.0,
      description: 'Reduced sensitivity to blue light, making it difficult to distinguish between blue and green, and yellow and red.'
    },
    { 
      id: 'tritanopia',
      name: 'Tritanopia (Blue-Blind)',
      enabled: false,
      intensity: 1.0,
      description: 'Unable to tell the difference between blue and green, purple and red, and yellow and pink. Colors appear less bright.'
    },
    { 
      id: 'monochromacy',
      name: 'Complete Color Blindness',
      enabled: false,
      intensity: 1.0,
      description: 'Total inability to see any colors. The world appears in shades of gray.'
    },
    { 
      id: 'monochromatic',
      name: 'Vision Loss (Darkness)',
      enabled: false,
      intensity: 1.0,
      description: 'Progressive darkening of vision, simulating various levels of vision loss from partial to complete darkness.'
    },
    {
      id: 'cataracts',
      name: 'Cataracts',
      enabled: false,
      intensity: 1.0,
      description: 'Clouding of the eye\'s natural lens, causing blurred vision, reduced contrast sensitivity, and increased glare sensitivity. Colors may appear yellowed or faded.'
    },
    {
      id: 'glaucoma',
      name: 'Glaucoma',
      enabled: false,
      intensity: 1.0,
      description: 'Progressive loss of peripheral vision, creating tunnel vision effect. May also cause blurred vision and difficulty adapting to darkness.'
    },
    {
      id: 'amd',
      name: 'Age-Related Macular Degeneration',
      enabled: false,
      intensity: 1.0,
      description: 'Loss of central vision while peripheral vision remains intact. May cause distorted vision where straight lines appear wavy.'
    },
    {
      id: 'diabeticRetinopathy',
      name: 'Diabetic Retinopathy',
      enabled: false,
      intensity: 1.0,
      description: 'Causes floating spots, blurred vision, and dark or empty areas in vision. Can lead to sudden vision changes or loss.'
    },
    {
      id: 'astigmatism',
      name: 'Astigmatism',
      enabled: false,
      intensity: 1.0,
      description: 'Causes blurred or distorted vision at all distances due to irregular cornea shape. May result in eye strain and difficulty seeing fine details.'
    },
    {
      id: 'retinitisPigmentosa',
      name: 'Retinitis Pigmentosa',
      enabled: false,
      intensity: 1.0,
      description: 'Progressive loss of peripheral vision and difficulty seeing in low light. Eventually may lead to tunnel vision and night blindness.'
    },
    {
      id: 'stargardt',
      name: 'Stargardt Disease',
      enabled: false,
      intensity: 1.0,
      description: 'Progressive loss of central vision, causing difficulty with detailed tasks. May also cause color vision problems and sensitivity to light.'
    },
    { 
      id: 'nearSighted',
      name: 'Nearsightedness',
      enabled: false,
      intensity: 1.0,
      description: 'Distant objects appear blurry while close objects remain clear'
    },
    { 
      id: 'farSighted',
      name: 'Farsightedness',
      enabled: false,
      intensity: 1.0,
      description: 'Close objects appear blurry while distant objects remain clear'
    },
    { 
      id: 'visualSnow',
      name: 'Visual Snow',
      enabled: false,
      intensity: 1.0,
      description: 'Static-like visual disturbance across the entire visual field'
    },
    {
      id: 'diplopiaMonocular',
      name: 'Monocular Diplopia',
      enabled: false,
      intensity: 1.0,
      description: 'Double vision in one eye, often caused by eye conditions like astigmatism, cataracts, or corneal irregularities.'
    },
    {
      id: 'diplopiaBinocular',
      name: 'Binocular Diplopia',
      enabled: false,
      intensity: 1.0,
      description: 'Double vision when both eyes are open, often caused by misalignment of the eyes or neurological conditions.'
    },
    { 
      id: 'hallucinations',
      name: 'Visual Hallucinations',
      enabled: false,
      intensity: 1.0,
      description: 'Seeing patterns, lights, or shapes that aren\'t physically present'
    }
  ]);

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

  const handleToggle = (id: string) => {
    setEffects(effects.map(effect => 
      effect.id === id ? { ...effect, enabled: !effect.enabled } : effect
    ));
  };

  const handleDeselectAll = () => {
    setEffects(effects.map(effect => ({ ...effect, enabled: false })));
  };

  const handleIntensityChange = (id: string, intensity: number) => {
    setEffects(effects.map(effect =>
      effect.id === id ? { ...effect, intensity } : effect
    ));
  };

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
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Visualizer 
              effects={effects} 
              inputSource={inputSource}
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
        sx={{ py: 3 }}
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

          <Box 
            sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
            role="navigation"
            aria-label="Wizard navigation"
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              aria-label="Go back to previous step"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              aria-label={`Go to ${activeStep < steps.length - 1 ? 'next step' : 'finish'}`}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>

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