import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Home, Visibility, People } from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <PageMeta
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        path="/404"
      />
      <NavigationBar showHomeButton onHomeClick={() => navigate('/')} />

      <Container maxWidth="sm" sx={{ pt: 16, pb: 8, textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 800,
            color: 'text.primary',
            filter: 'blur(1.5px)',
            mb: 2,
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          {t('notFound.title', 'Page Not Found')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 400, mx: 'auto' }}>
          {t('notFound.description', "The page you're looking for doesn't exist or has been moved.")}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/')}>
            {t('notFound.home', 'Home')}
          </Button>
          <Button variant="outlined" startIcon={<Visibility />} onClick={() => navigate('/simulator')}>
            {t('notFound.simulator', 'Simulator')}
          </Button>
          <Button variant="outlined" startIcon={<People />} onClick={() => navigate('/famous-people')}>
            {t('notFound.famousPeople', 'Famous People')}
          </Button>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
};

export default NotFoundPage;
