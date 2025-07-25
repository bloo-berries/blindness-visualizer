import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Link,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Contrast as ContrastIcon,
  TextFields as TextFieldsIcon,
  FormatLineSpacing as SpacingIcon,
  Visibility as FocusIcon,
  Speed as MotionIcon
} from '@mui/icons-material';

const AccessibilityStatement: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const accessibilityFeatures = [
    {
      icon: <ContrastIcon />,
      title: 'High Contrast Mode',
      description: 'White text on black background for better visibility',
      wcag: 'WCAG 1.4.3',
      level: 'AA'
    },
    {
      icon: <TextFieldsIcon />,
      title: 'Large Text Mode',
      description: 'Increases all font sizes by 25% for better readability',
      wcag: 'WCAG 1.4.4',
      level: 'AA'
    },
    {
      icon: <SpacingIcon />,
      title: 'Increased Spacing',
      description: 'Enhanced line height and letter spacing for improved readability',
      wcag: 'WCAG 1.4.8',
      level: 'AAA'
    },
    {
      icon: <FocusIcon />,
      title: 'Enhanced Focus Indicators',
      description: 'Clear blue outlines for keyboard navigation',
      wcag: 'WCAG 2.4.7',
      level: 'AA'
    },
    {
      icon: <MotionIcon />,
      title: 'Reduced Motion',
      description: 'Option to reduce animations and transitions',
      wcag: 'WCAG 2.3.3',
      level: 'AA'
    }
  ];

  const keyboardShortcuts = [
    { key: 'Tab', description: 'Navigate between interactive elements' },
    { key: 'Enter/Space', description: 'Activate buttons and links' },
    { key: 'Arrow Keys', description: 'Navigate through stepper and sliders' },
    { key: 'Escape', description: 'Close menus and dialogs' },
    { key: 'Alt + A (Windows/Linux)', description: 'Open accessibility menu' },
    { key: 'Option + A (Mac)', description: 'Open accessibility menu' }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Accessibility Statement
      </Typography>
      
      <Typography variant="body1" paragraph>
        This website is committed to ensuring digital accessibility for people with disabilities. 
        We are continually improving the user experience for everyone and applying the relevant 
        accessibility standards.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
        Conformance Status
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Chip 
          label="WCAG 2.1 AA" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Typography variant="body2" color="text.secondary">
          This website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level.
        </Typography>
      </Box>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Accessibility Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {accessibilityFeatures.map((feature, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  {feature.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {feature.title}
                      </Typography>
                      <Chip 
                        label={feature.wcag} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={feature.level} 
                        size="small" 
                        color="primary"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={feature.description}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Keyboard Navigation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            This website can be navigated entirely using a keyboard. All interactive elements 
            are accessible via keyboard navigation.
          </Typography>
          <List dense>
            {keyboardShortcuts.map((shortcut, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="kbd" sx={{ 
                        backgroundColor: 'grey.100', 
                        padding: '2px 6px', 
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}>
                        {shortcut.key}
                      </Typography>
                      <Typography variant="body2">
                        {shortcut.description}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Screen Reader Support
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            This website includes proper ARIA attributes and semantic HTML markup to ensure 
            compatibility with screen readers and other assistive technologies.
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Proper heading structure (h1-h6)" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="ARIA labels and descriptions for interactive elements" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Skip to content links" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Alternative text for images" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Form labels and error messages" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Known Issues & Limitations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            We are committed to continuous improvement of accessibility. If you encounter 
            any accessibility issues, please contact us.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currently, there are no known accessibility issues with this website.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Paper sx={{ p: 3, mt: 4, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Feedback & Support
        </Typography>
        <Typography variant="body2" paragraph>
          We welcome your feedback on the accessibility of this website. If you experience 
          accessibility barriers or have suggestions for improvement, please contact us:
        </Typography>
        <Typography variant="body2">
          • Email: <Link href="mailto:accessibility@visionsim.com">accessibility@visionsim.com</Link>
        </Typography>
        <Typography variant="body2">
          • GitHub Issues: <Link href="https://github.com/bloo-berries/blindness-visualizer/issues" target="_blank">Report an issue</Link>
        </Typography>
      </Paper>

      <Box sx={{ mt: 4, p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default AccessibilityStatement; 