import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import Visualizer from './Visualizer';
import { ControlPanel } from './ControlPanel';
import InputSelector from './InputSelector';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

import { VisualEffect, InputSource } from '../types/visualEffects';
import { createDefaultEffects } from '../data/visualEffects';

const VisionSimulator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
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

      // Enable the pre-configured conditions with full intensity
      setEffects(prevEffects =>
        prevEffects.map(effect => {
          const isEnabled = preconfiguredConditions.includes(effect.id);
          return {
            ...effect,
            enabled: isEnabled,
            intensity: isEnabled ? 1.0 : effect.intensity
          };
        })
      );

      // Skip to the conditions step (now the final step)
      setActiveStep(1);
    }
  }, [location.state]);

  const handleToggle = useCallback((id: string) => {
    setEffects(prevEffects =>
      prevEffects.map(effect => {
        if (effect.id === id) {
          // When enabling an effect, set intensity to 0.75 (75%) as default
          // When disabling, keep the current intensity for when it's re-enabled
          return {
            ...effect,
            enabled: !effect.enabled,
            intensity: !effect.enabled ? 0.75 : effect.intensity
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
    if (preconfiguredPerson && activeStep === 1) {
      navigate('/famous-people');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
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
          <Box sx={{ p: 1, pb: 0 }}>
            <InputSelector
              currentSource={inputSource}
              onSourceChange={handleSourceChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ControlPanel
              effects={effects}
              onToggle={handleToggle}
              onIntensityChange={handleIntensityChange}
              onDeselectAll={handleDeselectAll}
              diplopiaSeparation={diplopiaSeparation}
              diplopiaDirection={diplopiaDirection}
              onDiplopiaSeparationChange={setDiplopiaSeparation}
              onDiplopiaDirectionChange={setDiplopiaDirection}
              inputSource={inputSource}
              visualizerSlot={
                <Box sx={{
                  '& .visualizer-container': { height: 'unset', aspectRatio: '16 / 9' },
                  '& .comparison-container': { minHeight: '300px' },
                  '& .visualizer-description': { display: 'none' }
                }}>
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
              }
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' && activeStep < 1) {
      handleNext();
    } else if (event.key === 'ArrowLeft' && activeStep > 0) {
      handleBack();
    } else if (event.key === 'Home') {
      setActiveStep(0);
    } else if (event.key === 'End') {
      setActiveStep(1);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Navigation is always visible, no need for scroll handler

  // Determine if we're in "Famous People" mode or "Regular Simulator" mode
  const isFamousPeopleMode = preconfiguredPerson !== null;

  return (
    <Box className="app-container" sx={{ pb: 0, minHeight: 'auto' }}>
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
        {activeStep === 0 && t('simulator.screenReaderStep1')}
        {activeStep === 1 && t('simulator.screenReaderStep2')}
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
        sx={{
          maxWidth: activeStep === 1 ? '1400px' : '1000px',
          pt: 10,
          pb: 2,
          transition: 'max-width 0.3s ease',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}
        component="main"
        role="main"
        aria-labelledby="simulator-heading"
        id="main-content"
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            pt: 1.5,
            pb: 1,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: 'background.paper',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            align="center"
            id="simulator-heading"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              mt: 0
            }}
          >
            {t('simulator.title')}
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
                {t('simulator.simulating', { name: preconfiguredPerson.name })}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                {t('simulator.condition', { condition: preconfiguredPerson.condition })}
              </Typography>
              {/* Hidden technical details for cleaner UI */}
              {/* <Typography variant="body2" sx={{ color: 'white' }}>
                Active simulations: {preconfiguredPerson.conditions.join(', ')}
              </Typography> */}
            </Box>
          )}


          {getStepContent(activeStep)}

        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default VisionSimulator; 