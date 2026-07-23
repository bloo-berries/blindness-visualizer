import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <PageMeta
        title="Terms of Use"
        description="Terms of use for The Blind Spot vision condition simulator."
        path="/terms"
      />
      <NavigationBar showHomeButton onHomeClick={() => navigate('/')} />

      <Container maxWidth={false} sx={{ maxWidth: '800px', pt: '100px', pb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
          Terms of Use
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: July 23, 2026
        </Typography>

        <Section title="Overview">
          The Blind Spot is a free, open-source educational tool that simulates vision conditions
          to build awareness and empathy. By using this site, you agree to these terms.
        </Section>

        <Section title="Permitted Use">
          You may use this site for personal, educational, and non-commercial purposes. The
          simulations are approximations and do not constitute medical advice or diagnosis.
        </Section>

        <Section title="No Medical Advice">
          This site is for educational purposes only. The vision simulations are artistic
          approximations and vary from person to person. If you have concerns about your
          vision, consult a qualified eye care professional.
        </Section>

        <Section title="User-Provided Content">
          You may upload images or provide YouTube URLs for use with the simulator. Uploaded images
          are processed entirely in your browser and are never sent to our servers. You are
          responsible for ensuring you have the right to use any content you provide.
        </Section>

        <Section title="Intellectual Property">
          The source code is available on{' '}
          <MuiLink
            href="https://github.com/bloo-berries/blindness-visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </MuiLink>
          . Photos of public figures are used under fair use for educational purposes.
        </Section>

        <Section title="Disclaimer">
          This site is provided "as is" without warranties of any kind. We are not liable for
          any damages arising from use of the site or reliance on its content.
        </Section>

        <Section title="Changes">
          We may update these terms at any time. Continued use of the site constitutes
          acceptance of any changes.
        </Section>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          See also our{' '}
          <MuiLink component={Link} to="/privacy">
            Privacy Policy
          </MuiLink>
          .
        </Typography>
      </Container>

      <Footer />
    </Box>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

export default TermsPage;
