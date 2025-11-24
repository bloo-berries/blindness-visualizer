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
import { getPersonImagePath } from '../utils/imagePaths';

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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
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
        <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
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
              Experience visual impairments to build empathy and understanding
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
                      <VisibilityIcon sx={{ 
                        fontSize: 50, 
                        color: preferences.highContrast ? '#000000' : 'primary.main', 
                        mb: 1.5 
                      }} />
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        className="homepage-card-title homepage-card-title-left"
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
                        color={preferences.highContrast ? undefined : "text.primary"}
                        className="homepage-card-description homepage-card-description-left"
                        sx={{ 
                          mb: 2, 
                          lineHeight: 1.5,
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Upload images or sample a YouTube video with customizable and adjustable visuals.
                      </Typography>
                      <Box sx={{ mb: 2, width: '100%' }}>
                        <img 
                          src={`${process.env.PUBLIC_URL || ''}/images/home-page/example-comparison.png`}
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
                      <PeopleIcon sx={{ 
                        fontSize: 50, 
                        color: preferences.highContrast ? '#000000' : 'primary.main', 
                        mb: 1.5 
                      }} />
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        className="homepage-card-title homepage-card-title-right"
                        sx={{ 
                          fontWeight: 600,
                          color: preferences.highContrast ? '#000000' : 'text.primary',
                          mb: 1.5,
                          ...(preferences.highContrast && { color: '#000000 !important' })
                        }}
                      >
                        Experience Sight of Famous Blind and Visually Impaired People
                      </Typography>
                    </Box>
                    
                    {/* Image Preview Grid */}
                    <Box sx={{ mb: 2, mt: 5.5 }}>
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
                          src={getPersonImagePath('galileo')} 
                          alt="Galileo Galilei"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 20%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Galileo Galilei`;
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
                          src={getPersonImagePath('stevie')} 
                          alt="Stevie Wonder"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 20%'
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
                          src={getPersonImagePath('helen')} 
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
                          src={getPersonImagePath('ray')} 
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
                      <Box sx={{ 
                        width: '100%', 
                        height: '70px', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}>
                        <img 
                          src={getPersonImagePath('sharon')} 
                          alt="Sharon Stone"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Sharon Stone`;
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
                          src={getPersonImagePath('bono')} 
                          alt="Bono"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 40%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Bono`;
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
                          src={getPersonImagePath('georgia')} 
                          alt="Georgia O'Keefe"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 20%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Georgia O'Keefe`;
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
                          src={getPersonImagePath('harriet')} 
                          alt="Harriet Tubman"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center 20%'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=Harriet Tubman`;
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