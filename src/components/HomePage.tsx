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
              color="text.secondary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
                mb: 2
              }}
            >
              Experience visual impairments firsthand to build empathy and create more accessible digital experiences
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Choose your path to explore vision conditions and their impact on daily life
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
                      color="text.secondary" 
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      Experience and understand different vision conditions in real-time using your webcam, uploaded images, or YouTube videos with adjustable intensity levels.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Features:
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: '400px', mx: 'auto' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Real-time simulation with webcam, images, or videos
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Multiple vision conditions with adjustable intensity
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Educational tool for healthcare professionals and designers
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      Explore the lives and visual experiences of famous blind and visually impaired individuals throughout history, from historical figures to contemporary icons.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Features:
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: '400px', mx: 'auto' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Learn about famous blind and visually impaired people
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Understand their specific vision conditions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        • Explore historical and contemporary figures
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Gain insights into their achievements and experiences
                      </Typography>
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