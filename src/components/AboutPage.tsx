import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { PERSON_COUNT } from '../data/famousPeople/constants';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { preferences } = useAccessibility();
  const navigate = useNavigate();

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
      <PageMeta
        title="About"
        description="Learn about The Blind Spot, an educational tool that simulates vision conditions to build empathy and understanding of visual impairments."
        path="/about"
      />
      <NavigationBar />
      <Box sx={{ pt: '80px', pb: 10 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1000px', py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem', md: undefined },
              ...(preferences.highContrast
                ? { color: 'text.primary' }
                : {
                    background: 'linear-gradient(45deg, var(--color-primary-gradient-start), var(--color-primary-gradient-end))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }),
              mb: 2
            }}>
              {t('about.title')}
            </Typography>
          </Box>

          {/* Personal Story Section */}
          <Box sx={{ p: 4, mb: 6 }}>
            <Typography variant="h4" component="h2" className="personal-journey-title" gutterBottom sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 3
            }}>
              {t('about.personalJourney')}
            </Typography>

            {/* Greeting */}
            <Typography variant="body1" className="personal-journey-text" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 2,
              color: 'text.primary'
            }}>
              {t('about.greeting')}
            </Typography>

            {/* Video Section (moved up) */}
            <Box sx={{
              my: 4,
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

            {/* Story */}
            <Typography variant="body1" className="personal-journey-text" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              color: 'text.primary'
            }}>
              {t('about.story')}
            </Typography>

            {/* Purpose */}
            <Typography variant="body1" className="personal-journey-text personal-journey-highlight" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              fontWeight: 600,
              color: 'primary.main',
              mb: 4
            }}>
              {t('about.purpose')}
            </Typography>

            {/* CTA Button */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/simulator')}
                sx={{ px: 3, py: 1, fontSize: '1rem', fontWeight: 600 }}
              >
                {t('home.card1Button')}
              </Button>
            </Box>
          </Box>

          {/* Stats Section */}
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {PERSON_COUNT}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Famous People
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  144
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vision Conditions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  26
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Languages
                </Typography>
              </Box>
            </Grid>
          </Grid>

        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutPage;
