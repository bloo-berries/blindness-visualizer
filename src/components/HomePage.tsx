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

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
          pt: { xs: 10, md: 14 },
          pb: { xs: 4, md: 6 },
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              id="main-heading"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 2
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>
                Understanding
              </Box>
              {' '}Vision Conditions
            </Typography>
            <Typography 
              variant="h5" 
              color="text.primary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontWeight: 600,
                lineHeight: 1.6,
                mb: 2
              }}
            >
              Experience visual impairments firsthand to build empathy and create more accessible digital experiences
            </Typography>

          </Box>

          {/* Main Options */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 4,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  <Box sx={{ mb: 3 }}>
                    <VisibilityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      Recreate Different Vision Conditions in Real-time
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.primary" 
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      Upload images or sample a YouTube video with adjustable visuals. Camera feature coming soon!
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Features:
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: '400px', mx: 'auto' }}>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        • Real-time simulation with images and videos (camera coming soon)
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        • Multiple vision conditions with adjustable intensity
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        • Educational tool for healthcare professionals and designers
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        • Build empathy for accessibility awareness
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleStartSimulator}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
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
                  p: 4,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  <Box sx={{ mb: 3 }}>
                    <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      Experience Sight of Famous Blind and Visually Impaired People
                    </Typography>
                  </Box>
                  
                  {/* Image Preview Grid */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Featured People:
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: 2,
                      maxWidth: '500px', 
                      mx: 'auto' 
                    }}>
                      <Box sx={{ 
                        width: '100%', 
                        height: '80px', 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src="/images/people/john-milton.jpg" 
                          alt="John Milton"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 30%'
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '80px', 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src="/images/people/stevie-wonder.jpg" 
                          alt="Stevie Wonder"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '80px', 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src="/images/people/hellen-keller.jpg" 
                          alt="Helen Keller"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 35%'
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: '80px', 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src="/images/people/ray-charles.jpg" 
                          alt="Ray Charles"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 0 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleStartFamousPeople}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    Explore Famous People
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              Why Understanding Vision Conditions Matters
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              By experiencing visual impairments firsthand, we can better understand the challenges faced by people with vision conditions. 
              This knowledge helps create more inclusive digital experiences, improve accessibility, and build empathy for the diverse ways people interact with the world.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default HomePage; 