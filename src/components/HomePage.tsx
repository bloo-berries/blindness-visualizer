import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  People as PeopleIcon 
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useAccessibility } from '../contexts/AccessibilityContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useAccessibility();

  const handleStartSimulator = () => {
    navigate('/simulator');
  };

  const handleStartFamousPeople = () => {
    navigate('/famous-people');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <NavigationBar showHomeButton={false} onHomeClick={() => {}} />
      
      {/* Hero Section */}
      <Box 
        component="main"
        sx={{ 
          pt: { xs: 10, md: 12 },
          pb: { xs: 3, md: 4 },
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              id="main-heading"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 1.5
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>
                Understanding
              </Box>
              {' '}Vision Conditions
            </Typography>
            <Typography 
              variant="h6" 
              color="text.primary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontWeight: 600,
                lineHeight: 1.5,
                mb: 1.5
              }}
            >
              Experience visual impairments firsthand to build empathy and create more accessible digital experiences
            </Typography>

          </Box>

          {/* Main Options */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 3,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <VisibilityIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1.5 }} />
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        className="homepage-card-title"
                        sx={{ 
                          fontWeight: 600,
                          color: preferences.highContrast ? '#000000' : 'text.primary',
                          mb: 1.5,
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Recreate Vision Conditions in Real-time
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.primary" 
                        className="homepage-card-description"
                        sx={{ 
                          mb: 2, 
                          lineHeight: 1.5,
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Upload images or sample a YouTube video with adjustable visuals.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="subtitle1" 
                        className="homepage-features-title" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1.5, 
                          color: 'text.primary',
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Features:
                      </Typography>
                      <Box sx={{ textAlign: 'left', maxWidth: '400px', mx: 'auto' }}>
                        <Typography 
                          variant="body2" 
                          color="text.primary" 
                          className="homepage-feature-item" 
                          sx={{ 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            ...(preferences.highContrast && { color: '#000000 !important' })
                          }}
                        >
                          • Real-time simulation with images and videos
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.primary" 
                          className="homepage-feature-item" 
                          sx={{ 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            ...(preferences.highContrast && { color: '#000000 !important' })
                          }}
                        >
                          • Multiple vision conditions with adjustable intensity
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.primary" 
                          className="homepage-feature-item" 
                          sx={{ 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            ...(preferences.highContrast && { color: '#000000 !important' })
                          }}
                        >
                          • Educational tool for healthcare professionals and teachers
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.primary" 
                          className="homepage-feature-item"
                          sx={{
                            fontSize: '0.85rem',
                            ...(preferences.highContrast && { color: '#000000 !important' })
                          }}
                        >
                          • Build empathy for accessibility awareness
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0, mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleStartSimulator}
                    sx={{ 
                      px: 3, 
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    Start Vision Condition Simulator
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 3,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <PeopleIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1.5 }} />
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        className="homepage-card-title"
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1.5,
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Experience Sight of Famous Blind and Visually Impaired People
                      </Typography>
                    </Box>
                    
                    {/* Image Preview Grid */}
                    <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      className="homepage-featured-title" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1.5, 
                        color: 'text.primary',
                        ...(preferences.highContrast && { color: '#000000 !important' })
                      }}
                    >
                      Featured People:
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: 1.5,
                      maxWidth: '450px', 
                      mx: 'auto' 
                    }}>
                      <Box sx={{ 
                        width: '100%', 
                        height: '70px', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src={`${process.env.PUBLIC_URL || ''}/images/people/john-milton.jpg`} 
                          alt="John Milton"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 30%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=John Milton`;
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '70px', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src={`${process.env.PUBLIC_URL || ''}/images/people/stevie-wonder.jpg`} 
                          alt="Stevie Wonder"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Stevie Wonder`;
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '70px', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src={`${process.env.PUBLIC_URL || ''}/images/people/hellen-keller.jpg`} 
                          alt="Helen Keller"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 35%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Helen Keller`;
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '70px', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src={`${process.env.PUBLIC_URL || ''}/images/people/ray-charles.jpg`} 
                          alt="Ray Charles"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Ray Charles`;
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0, mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleStartFamousPeople}
                    sx={{ 
                      px: 3, 
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    Explore Famous People
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default HomePage; 