import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  Visibility, 
  Accessibility, 
  Psychology, 
  School
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const AboutPage: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <Box sx={{ pt: '80px' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              Hey, fellow Blind/Visually Impaired Community, and those interested to learn more!
            </Typography>

            <Typography variant="body1" className="personal-journey-text" sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3
            }}>
              In 2020, I lost my vision in an instant due to a stroke, and I struggled alone during the global COVID shutdown, 
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
              Because of this, I created this site so that people would be better equipped with tools to more accurately 
              articulate and represent their blindness and/or vision conditions.
            </Typography>
          </Paper>

          {/* Mission Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ 
              fontWeight: 600,
              color: '#1976d2',
              textAlign: 'center',
              mb: 4
            }}>
              Our Mission
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', backgroundColor: '#e3f2fd' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Visibility sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        Accurate Representation
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      Provide scientifically accurate visual simulations of various blindness and vision conditions, 
                      helping people understand the real impact of visual impairments.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', backgroundColor: '#f3e5f5' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Accessibility sx={{ fontSize: 40, color: '#7b1fa2', mr: 2 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        Accessibility Education
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      Educate sighted individuals about the challenges faced by the blind and visually impaired community, 
                      fostering empathy and understanding.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', backgroundColor: '#e8f5e8' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Psychology sx={{ fontSize: 40, color: '#388e3c', mr: 2 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        Self-Advocacy Tools
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      Empower individuals with visual impairments to better communicate their experiences to family, 
                      friends, healthcare providers, and employers.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', backgroundColor: '#fff3e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <School sx={{ fontSize: 40, color: '#f57c00', mr: 2 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        Educational Resource
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      Serve as a comprehensive educational tool for students, healthcare professionals, 
                      and anyone interested in learning about visual impairments.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Call to Action */}
          <Paper elevation={2} sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: '#1976d2',
            color: 'white'
          }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Join Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Whether you're part of the blind and visually impaired community, a healthcare professional, 
              educator, or simply someone who wants to understand better - VisionSim is here for you.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Together, we can build a more understanding and inclusive world.
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutPage;
