import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper
} from '@mui/material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const AboutPage: React.FC = () => {

  return (
    <>
      <NavigationBar />
      <Box sx={{ pt: '80px', pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
              About VisionSim
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Empowering understanding through accurate visual simulations of blindness and vision conditions
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
              A Personal Journey
            </Typography>
            
            <Typography variant="body1" className="personal-journey-text" sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3
            }}>
              Hello to the Blind and Visually Impaired community — and to everyone curious to learn more!
            </Typography>

            <Typography variant="body1" className="personal-journey-text" sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3
            }}>
              In 2020 I lost my vision in an instant due to a stroke, and I struggled alone during the COVID shutdown, 
              unable to find in-person rehabilitation, therapy, orientation classes, or anything. Looking online, I found next 
              to nothing regarding stroke-related vision loss at the scale I experienced it. Accurately describing how I "see" 
              the world was painfully difficult, and only added to the isolation.
            </Typography>

            <Typography variant="body1" className="personal-journey-text personal-journey-highlight" sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              fontWeight: 600,
              color: '#1976d2'
            }}>
              I created this site so that people would be better equipped with tools to more accurately 
              articulate and represent their blindness and/or vision conditions.
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
                  dangerouslySetInnerHTML={{
                    __html: '<wistia-player media-id="qjdv24o4kb" aspect="2.6373626373626373"></wistia-player>'
                  }}
                  sx={{ 
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#000',
                    minHeight: '300px'
                  }}
                />
                
                <Typography variant="body2" sx={{ 
                  textAlign: 'center', 
                  mt: 2, 
                  fontStyle: 'italic',
                  color: 'text.secondary'
                }}>
                  Preview How I See
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
