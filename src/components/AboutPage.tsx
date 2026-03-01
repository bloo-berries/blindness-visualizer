import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { preferences } = useAccessibility();

  // Load Wistia player script if not already loaded
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="wistia.com/player.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://fast.wistia.com/player.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <NavigationBar />
      <Box sx={{ pt: '80px', pb: 10 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1000px', py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              {t('about.title')}
            </Typography>
          </Box>

          {/* Personal Story Section */}
          <Paper elevation={3} className="personal-journey-section" sx={{ 
            p: 4, 
            mb: 6, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" component="h2" className="personal-journey-title" gutterBottom sx={{
              fontWeight: 600,
              color: '#1976d2',
              mb: 3
            }}>
              {t('about.personalJourney')}
            </Typography>
            
            <Typography variant="body1" className="personal-journey-text" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              color: '#A0AEB8'
            }}>
              {t('about.greeting')}
            </Typography>

            <Typography variant="body1" className="personal-journey-text" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              color: '#A0AEB8'
            }}>
              {t('about.story')}
            </Typography>

            <Typography variant="body1" className="personal-journey-text personal-journey-highlight" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              fontWeight: 600,
              color: '#1976d2'
            }}>
              {t('about.purpose')}
            </Typography>

            {/* Video Section */}
            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              <Box sx={{
                width: { xs: '100%', sm: '80%', md: '70%', lg: '60%' },
                maxWidth: '800px',
                position: 'relative'
              }}>
                {/* Wistia Video Player */}
                <Box 
                  sx={{ 
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#000'
                  }}
                >
                  <Box
                    className="wistia_responsive_padding"
                    sx={{
                      padding: '37.92% 0 0 0',
                      position: 'relative'
                    }}
                  >
                    <Box
                      className="wistia_responsive_wrapper"
                      sx={{
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%'
                      }}
                    >
                      <iframe
                        src="https://fast.wistia.com/embed/iframe/qjdv24o4kb?autoPlay=true&silentAutoPlay=true&muted=true&seo=true"
                        title="my-vision Video"
                        allow="autoplay; fullscreen"
                        allowTransparency={true}
                        frameBorder="0"
                        scrolling="no"
                        className="wistia_embed"
                        name="wistia_embed"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Typography
                  variant="body2"
                  className="preview-how-i-see-text"
                  sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontStyle: 'italic',
                    color: preferences.highContrast ? '#000000' : 'text.secondary',
                    ...(preferences.highContrast && { color: '#000000 !important' })
                  }}
                >
                  {t('about.previewVideo')}
                </Typography>
              </Box>
            </Box>
          </Paper>


        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutPage;
