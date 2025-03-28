import React, { useState } from 'react';
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
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import InputSelector from './components/InputSelector';
import Footer from './components/Footer';
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
      default: '#f5f5f5',
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
  id: string;
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
  const [effects, setEffects] = useState<VisualEffect[]>([
    { 
      id: 'colorBlindness',
      name: 'Color Blindness',
      enabled: false,
      intensity: 1.0,
      description: 'Simulates how colors appear different or indistinguishable for people with color vision deficiency'
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
      id: 'visualAura',
      name: 'Visual Aura',
      enabled: false,
      intensity: 1.0,
      description: 'Temporary visual disturbances, often preceding migraines, appearing as shimmering lights or blind spots'
    },
    { 
      id: 'visualSnow',
      name: 'Visual Snow',
      enabled: false,
      intensity: 1.0,
      description: 'Constant visual disturbance resembling television static overlaying vision'
    },
    { 
      id: 'hemianopia',
      name: 'Hemianopia',
      enabled: false,
      intensity: 1.0,
      description: 'Loss of vision in either the left or right half of the visual field'
    },
    { 
      id: 'floaters',
      name: 'Visual Floaters',
      enabled: false,
      intensity: 1.0,
      description: 'Small dark shapes that drift through vision, appearing as dots, cobwebs, or squiggly lines'
    },
    { 
      id: 'hallucinations',
      name: 'Visual Hallucinations',
      enabled: false,
      intensity: 1.0,
      description: 'Seeing patterns, lights, or shapes that aren\'t physically present'
    },
  ]);

  const [inputSource, setInputSource] = useState<InputSource>({
    type: 'webcam'
  });

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
              onToggle={(id) => {
                setEffects(effects.map(effect =>
                  effect.id === id ? { ...effect, enabled: !effect.enabled } : effect
                ));
              }}
              onIntensityChange={(id, intensity) => {
                setEffects(effects.map(effect =>
                  effect.id === id ? { ...effect, intensity } : effect
                ));
              }}
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

  if (!started) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        </Paper>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default App; 