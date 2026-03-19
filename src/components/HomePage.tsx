import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { getPersonImagePath } from '../utils/imagePaths';

const THUMBNAIL_PEOPLE = [
  { id: 'galileo', alt: 'Galileo Galilei', pos: 'center 20%' },
  { id: 'stevie', alt: 'Stevie Wonder', pos: 'center 20%' },
  { id: 'helen', alt: 'Helen Keller', pos: 'center 35%' },
  { id: 'ray', alt: 'Ray Charles', pos: 'center 40%' },
  { id: 'sharon', alt: 'Sharon Stone', pos: 'center 40%' },
  { id: 'bono', alt: 'Bono', pos: 'center 40%' },
  { id: 'georgia', alt: "Georgia O'Keefe", pos: 'center 20%' },
  { id: 'harriet', alt: 'Harriet Tubman', pos: 'center 20%' },
];

const homeCardSx = {
  height: '100%',
  p: { xs: 2, md: 3 },
  background: 'var(--color-card-bg)',
  border: '1px solid var(--color-border)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
  }
} as const;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useAccessibility();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <PageMeta
        title="Vision Condition Simulator"
        description="Experience and understand blindness and visual impairments through real-time simulations. Explore color blindness, macular degeneration, glaucoma, cataracts, and 148+ vision conditions."
        path="/"
      />
      <NavigationBar showHomeButton={false} onHomeClick={() => {}} />
      
      {/* Hero Section */}
      <Box 
        component="main"
        sx={{ 
          pt: { xs: 13, md: 12 },
          pb: { xs: 3, md: 4 },
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              id="main-heading"
              sx={{
                fontSize: { xs: '1.6rem', md: '2.2rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 0
              }}
            >
              <Box component="span" sx={{ color: 'var(--color-primary-accent)' }}>
                {t('home.title')}
              </Box>
              {' '}{t('home.titleHighlight')}
            </Typography>
          </Box>

          {/* Main Options */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={homeCardSx}>
                <CardContent sx={{ textAlign: 'center', p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: { xs: 1, md: 2 } }}>
                      <VisibilityIcon sx={{
                        fontSize: isMobile ? 40 : 50,
                        color: 'var(--color-primary-accent)',
                        mb: 1
                      }} />
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        className="homepage-card-title homepage-card-title-left"
                        sx={{
                          fontWeight: 600,
                          color: preferences.highContrast ? '#ffffff' : 'text.primary',
                          mb: 1.5
                        }}
                      >
                        {t('home.card1Title')}
                      </Typography>
                      <Box sx={{ mb: { xs: 1, md: 2 }, mt: { xs: 2, md: 5.5 }, width: '100%' }}>
                        <img
                          src={`${process.env.PUBLIC_URL || ''}/images/home-page/example-comparison.webp`}
                          alt="Example vision condition comparison"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            display: 'block'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/simulator')}
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {t('home.card1Button')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={homeCardSx}>
                <CardContent sx={{ textAlign: 'center', p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: { xs: 1, md: 2 } }}>
                      <PeopleIcon sx={{
                        fontSize: isMobile ? 40 : 50,
                        color: 'var(--color-primary-accent)',
                        mb: 1
                      }} />
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        className="homepage-card-title homepage-card-title-right"
                        sx={{
                          fontWeight: 600,
                          color: preferences.highContrast ? '#ffffff' : 'text.primary',
                          mb: 1.5
                        }}
                      >
                        {t('home.card2Title')}
                      </Typography>
                    </Box>

                    {/* Image Preview Grid */}
                    <Box sx={{ mb: { xs: 1, md: 2 }, mt: { xs: 2, md: 5.5 } }}>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 1.5,
                        maxWidth: '450px',
                        mx: 'auto'
                      }}>
                        {THUMBNAIL_PEOPLE.map(({ id, alt, pos }) => (
                          <Box key={id} sx={{
                            width: '100%',
                            height: '70px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '2px solid var(--color-border)'
                          }}>
                            <img
                              src={getPersonImagePath(id)}
                              alt={alt}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: pos
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/famous-people')}
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {t('home.card2Button')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          {/* Library of the Blind Card */}
          <Card
            component="a"
            href="https://bloo-berries.github.io/Library-of-the-Blind/"
            target="_blank"
            rel="noopener noreferrer"
            className="library-of-blind-card"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              background: preferences.highContrast ? '#ffffff' : 'var(--color-card-bg)',
              border: preferences.highContrast ? '2px solid #000000' : '1px solid var(--color-border)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            <MenuBookIcon
              sx={{
                fontSize: 40,
                mr: 2,
                flexShrink: 0
              }}
              style={{ color: preferences.highContrast ? '#000000' : undefined }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                component="span"
                className="library-of-blind-title"
                sx={{
                  fontWeight: 600,
                  display: 'block'
                }}
                style={{ color: preferences.highContrast ? '#000000' : undefined }}
              >
                {t('home.libraryTitle')}
              </Typography>
              <Typography
                variant="body2"
                className="library-of-blind-description"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                style={{ color: preferences.highContrast ? '#000000' : undefined }}
              >
                {t('home.libraryDescription')}
              </Typography>
            </Box>
          </Card>

        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default HomePage; 