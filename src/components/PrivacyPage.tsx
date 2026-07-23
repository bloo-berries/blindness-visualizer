import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <PageMeta
        title="Privacy Policy"
        description="Privacy policy for The Blind Spot vision condition simulator."
        path="/privacy"
      />
      <NavigationBar showHomeButton onHomeClick={() => navigate('/')} />

      <Container maxWidth={false} sx={{ maxWidth: '800px', pt: '100px', pb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: July 23, 2026
        </Typography>

        <Section title="Summary">
          We collect minimal data. Images you upload stay in your browser. We use basic
          analytics and store your preferences locally on your device.
        </Section>

        <Section title="Data We Don't Collect">
          We do not require accounts, passwords, or personal information. Images and videos
          you use with the simulator are processed entirely in your browser and are never
          uploaded to any server.
        </Section>

        <Section title="Local Storage">
          We store your preferences (theme, language, accessibility settings, guided tour
          status) in your browser's localStorage. This data never leaves your device and can
          be cleared through your browser settings at any time.
        </Section>

        <Section title="Analytics">
          We use Cloudflare Web Analytics, which is a privacy-first analytics service that
          does not use cookies or track individual users. It collects aggregate data such as
          page views, referrers, and browser/device types.
        </Section>

        <Section title="Feedback Form">
          If you submit the feedback form, your message is sent via{' '}
          <MuiLink href="https://formspree.io" target="_blank" rel="noopener noreferrer">
            Formspree
          </MuiLink>
          . Only the information you voluntarily include is transmitted. See Formspree's
          privacy policy for how they handle submissions.
        </Section>

        <Section title="Third-Party Services">
          YouTube videos are embedded via YouTube's player, which may set its own cookies
          when you interact with videos. Wistia is used for our about page video. These
          services have their own privacy policies.
        </Section>

        <Section title="Service Worker">
          A service worker caches site assets for offline use and faster loading. It does
          not collect or transmit any personal data.
        </Section>

        <Section title="Children's Privacy">
          This site is designed for general audiences and does not knowingly collect
          information from children under 13.
        </Section>

        <Section title="Changes">
          We may update this policy at any time. Changes will be reflected in the "Last
          updated" date above.
        </Section>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          See also our{' '}
          <MuiLink component={Link} to="/terms">
            Terms of Use
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

export default PrivacyPage;
