import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Link
} from '@mui/material';
import { 
  OpenInNew as OpenInNewIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Article as ArticleIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      title: 'Two Blind Brothers - Braille Resources',
      url: 'https://twoblindbrothers.com/pages/braille',
      description: 'Learn about braille and find braille resources from Two Blind Brothers.',
      icon: <MenuBookIcon />
    },
    {
      title: 'Hadley - Learning Resources',
      url: 'https://hadleyhelps.org/learn?topic_id=15',
      description: 'Free educational workshops and resources for vision loss, including braille learning, daily living skills, and technology training.',
      icon: <SchoolIcon />
    },
    {
      title: 'Ask a Blind Person - Cane Tips',
      url: 'https://askablindperson.wordpress.com/2024/03/31/7-cane-tips-for-getting-jabbed-in-the-stomach-less-often/',
      description: 'Practical tips for white cane users to improve mobility and reduce common issues.',
      icon: <ArticleIcon />
    },
    {
      title: 'NFB Free White Cane Program',
      url: 'https://nfb.org/programs-services/free-white-cane-program',
      description: 'The National Federation of the Blind offers free white canes to those who need them.',
      icon: <SupportIcon />
    }
  ];

  return (
    <>
      <NavigationBar />
      <Box sx={{ pt: '80px', pb: 10 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1000px', py: 4 }}>
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
              Resources
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Helpful resources for vision loss, mobility, and accessibility
            </Typography>
          </Box>

          {/* Resources List */}
          <Box sx={{ mb: 4 }}>
            {resources.map((resource, index) => (
              <Paper 
                key={index}
                elevation={2}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    mr: 2, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: '48px'
                  }}>
                    {resource.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Link
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {resource.title}
                        <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                      </Typography>
                    </Link>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        mt: 1
                      }}
                    >
                      {resource.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ResourcesPage;

