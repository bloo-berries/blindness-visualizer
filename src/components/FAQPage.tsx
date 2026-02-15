import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Smartphone as SmartphoneIcon,
  Home as HomeIcon,
  Directions as DirectionsIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ColorLens as ColorLensIcon,
  MedicalServices as MedicalServicesIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import '../styles/FAQ.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon: React.ReactNode;
  category: string;
}

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);

  const faqItems: FAQItem[] = [
    {
      id: 'darkness',
      question: 'Do blind people see complete darkness/blackness?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Not necessarily. About 85% of legally blind people have some remaining vision. Only 10-15% experience total darkness. Many see light/shadow, colors, or blurry shapes. Some who've never had sight don't experience "blackness" as a concept - similar to how you don't "see" blackness behind your head.
          </Typography>
        </Box>
      ),
      icon: <VisibilityIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'technology',
      question: 'How do blind people use smartphones and computers?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Screen readers (JAWS, NVDA, VoiceOver) convert text to speech or braille. Gestures and keyboard shortcuts replace mouse use. Many use normal smartphones with built-in accessibility features. Voice assistants like Siri are heavily utilized.
          </Typography>
        </Box>
      ),
      icon: <SmartphoneIcon />,
      category: 'Technology & Accessibility'
    },
    {
      id: 'independence',
      question: 'Can blind people live independently?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Yes. With proper training and adaptive techniques, blind people cook, clean, work, raise families, and live fully independent lives. They use systematic organization, tactile markers, assistive technology, and mobility tools.
          </Typography>
        </Box>
      ),
      icon: <HomeIcon />,
      category: 'Daily Life'
    },
    {
      id: 'navigation',
      question: 'How do blind people navigate and get around?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Blind people use various methods for navigation and mobility:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="White canes detect obstacles and elevation changes" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Guide dogs provide intelligent disobedience and navigation" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="GPS apps with audio directions (Soundscape, BlindSquare)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Memorized routes and mental mapping" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Public transportation and rideshare apps" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <DirectionsIcon />,
      category: 'Navigation & Mobility'
    },
    {
      id: 'senses',
      question: 'Do blind people have heightened other senses?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            No, their other senses aren't biologically superior. They develop better attention to and processing of audio/tactile information through practice and necessity. It's enhanced perception, not enhanced sensation.
          </Typography>
        </Box>
      ),
      icon: <PsychologyIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'interaction',
      question: 'How should I interact with a blind person?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Here are some important guidelines for respectful interaction:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Speak normally and directly to them, not through companions" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Identify yourself when approaching" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Ask before helping - don't grab or push" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Give verbal descriptions when relevant" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Use normal language ('see you later' is fine)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Never pet or distract guide dogs" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <PersonIcon />,
      category: 'Social Interaction'
    },
    {
      id: 'legal-vs-total',
      question: 'What\'s the difference between legally blind and totally blind?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Legally blind:</strong> Vision 20/200 or worse with correction, OR visual field less than 20 degrees
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Totally blind:</strong> No light perception (NLP)
          </Typography>
          <Typography variant="body1" paragraph>
            Most "blind" people fall somewhere between these extremes.
          </Typography>
        </Box>
      ),
      icon: <VisibilityIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'employment',
      question: 'Can blind people work regular jobs?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Yes. Blind people work as lawyers, teachers, programmers, musicians, psychologists, business owners, and countless other professions. Workplace accommodations (screen readers, braille displays) enable most jobs.
          </Typography>
        </Box>
      ),
      icon: <WorkIcon />,
      category: 'Employment & Career'
    },
    {
      id: 'identification',
      question: 'How do blind people identify money, colors, or objects?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Blind people use various adaptive techniques for identification:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Money: Apps like Seeing AI, different folding methods, electronic identifiers, and different sizes for different denominations in various countries" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Colors: Color identifier apps, asking others, buying pre-matched clothing" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Objects: Systematic organization, braille/tactile labels, voice recording labels, memory" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <ColorLensIcon />,
      category: 'Daily Life'
    },
    {
      id: 'causes-treatment',
      question: 'What causes blindness and can it be cured?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Leading causes globally:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Cataracts (reversible)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Glaucoma" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Macular degeneration" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Diabetic retinopathy" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Genetic conditions" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Treatment depends on cause. Some conditions are preventable/treatable, others currently aren't. Research continues on treatments like gene therapy, stem cells, and bionic eyes.
          </Typography>
          <Typography variant="body1" paragraph>
            People can also lose their vision from neurological conditions like trauma or stroke.
          </Typography>
        </Box>
      ),
      icon: <MedicalServicesIcon />,
      category: 'Medical & Treatment'
    }
  ];

  const handleFAQChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const getCategoryColor = (category: string) => {
    // Use the same blue color for all categories
    return '#1e3a8a';
  };

  return (
    <Box className="faq-page" sx={{ pb: 10 }}>
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 6, 
            color: 'text.primary',
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          Common questions and answers about blindness, visual impairment, and accessibility. 
          Learn about the experiences, challenges, and capabilities of blind and visually impaired individuals.
        </Typography>

        {/* FAQ Items */}
        <Box sx={{ mb: 4 }}>
          {faqItems.map((faq, index) => (
            <Accordion 
              key={faq.id}
              expanded={expandedFAQ === faq.id}
              onChange={handleFAQChange(faq.id)}
              className="faq-accordion"
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="faq-summary"
                sx={{
                  backgroundColor: getCategoryColor(faq.category),
                  color: 'white',
                  '&:hover': {
                    backgroundColor: getCategoryColor(faq.category),
                    opacity: 0.9,
                  },
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                  <Box className="faq-icon">
                    {faq.icon}
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0 }}>
                    <Typography variant="h6" component="h3" className="faq-question">
                      {index + 1}. {faq.question}
                    </Typography>
                    <Chip 
                      label={faq.category}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: '18px'
                      }}
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails className="faq-details">
                {faq.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Additional Information */}
        <Paper className="faq-info-box" elevation={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HelpIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" className="faq-info-title">
              About These FAQs
            </Typography>
          </Box>
          <Typography variant="body1" paragraph className="faq-info-text">
            These frequently asked questions are based on common misconceptions and genuine curiosity about blindness and visual impairment. 
            The answers reflect the diverse experiences of blind and visually impaired individuals.
          </Typography>
          <Typography variant="body1" paragraph className="faq-info-text">
            Remember that every person's experience with vision loss is unique. What works for one person may not work for another, 
            and it's always best to ask individuals about their specific needs and preferences.
          </Typography>
          <Typography variant="body1" className="faq-info-text">
            For more detailed information about specific vision conditions, visit our <strong>Conditions Glossary</strong> page.
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default FAQPage;
