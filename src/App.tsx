import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  useMediaQuery,
  responsiveFontSizes
} from '@mui/material';
import Visualizer from 'components/Visualizer';
import ControlPanel from 'components/ControlPanel';
import InputSelector from 'components/InputSelector';
import Footer from 'components/Footer';
import NavigationBar from 'components/NavigationBar';
import { ConditionType } from 'components/ConditionPreview';
import './styles/App.css';

let theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#d0d0d0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '3px solid #2196f3',
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '3px solid #2196f3',
            outlineOffset: '2px'
          }
        }
      }
    }
  },
});

theme = responsiveFontSizes(theme);

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

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showFixedNav, setShowFixedNav] = useState(true);
  const [inputSource, setInputSource] = useState<InputSource>({
    type: 'youtube',
  });
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
    }
  };

  const handleHomeClick = () => {
    setStarted(false);
    setActiveStep(0);
    
    // Reset any other state as needed
    // For example, reset input source or selected effects
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

  if (!started) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="app-container">
          <NavigationBar 
            showHomeButton={started || activeStep > 0}
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
            sx={{ py: 8 }}
            component="main"
            role="main"
            aria-labelledby="main-heading"
          >
            <Box className="landing-page">
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                align="center"
                id="main-heading"
              >
                Vision Condition Simulator
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 6 }}
              >
                Experience and understand different vision conditions to build empathy and awareness
              </Typography>

              <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={2} 
                    sx={{ p: 3, height: '100%' }}
                    aria-labelledby="purpose-heading"
                  >
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      id="purpose-heading"
                    >
                      🎯 Purpose
                    </Typography>
                    <Typography>
                      This tool helps you understand how different vision conditions affect daily life by simulating their effects on images and videos.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      🔍 How It Works
                    </Typography>
                    <Typography>
                      Choose an input (webcam, image, or video), select conditions to simulate, and adjust their intensity in real-time.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      💡 Educational Use
                    </Typography>
                    <Typography>
                      Perfect for education, healthcare training, and raising awareness about vision accessibility.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setStarted(true)}
                  sx={{ px: 6, py: 2 }}
                  aria-label="Start exploring the vision simulator"
                >
                  Start Exploring
                </Button>
              </Box>
            </Box>
          </Container>
          <Footer />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <NavigationBar 
          showHomeButton={started || activeStep > 0}
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
          sx={{ py: 4 }}
          component="main"
          role="main"
          aria-labelledby="simulator-heading"
          id="main-content"
        >
          <Paper 
            elevation={3} 
            sx={{ p: 3, borderRadius: 2 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              id="simulator-heading"
            >
              Vision Condition Visualizer
            </Typography>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              align="center" 
              color="text.secondary"
            >
              Experience and understand different vision conditions
            </Typography>

            <Stepper 
              activeStep={activeStep} 
              sx={{ my: 4 }}
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
            <Box sx={{ height: '72px', mt: 3 }} />
          </Paper>
          <Footer />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 