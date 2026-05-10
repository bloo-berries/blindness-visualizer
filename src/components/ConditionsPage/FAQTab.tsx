import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Visibility as VisibilityIcon,
  Smartphone as SmartphoneIcon,
  Home as HomeIconFaq,
  Directions as DirectionsIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ColorLens as ColorLensIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';

const FAQ_ITEMS_CONFIG = [
  { id: 'darkness', icon: <VisibilityIcon />, categoryKey: 'visionPerception' },
  { id: 'technology', icon: <SmartphoneIcon />, categoryKey: 'technologyAccessibility' },
  { id: 'independence', icon: <HomeIconFaq />, categoryKey: 'dailyLife' },
  { id: 'navigation', icon: <DirectionsIcon />, categoryKey: 'navigationMobility', hasList: true },
  { id: 'senses', icon: <PsychologyIcon />, categoryKey: 'visionPerception' },
  { id: 'interaction', icon: <PersonIcon />, categoryKey: 'socialInteraction', hasList: true },
  { id: 'legalVsTotal', icon: <VisibilityIcon />, categoryKey: 'visionPerception', isSpecial: true },
  { id: 'employment', icon: <WorkIcon />, categoryKey: 'employmentCareer' },
  { id: 'identification', icon: <ColorLensIcon />, categoryKey: 'dailyLife', hasList: true },
  { id: 'causesTreatment', icon: <MedicalServicesIcon />, categoryKey: 'medicalTreatment', isSpecial: true }
] as const;

const FAQTab: React.FC = () => {
  const { t } = useTranslation();
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);

  const handleFAQChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const renderFaqAnswer = (faqId: string, hasList?: boolean, isSpecial?: boolean) => {
    if (hasList) {
      const items = t(`glossaryPage.faqItems.${faqId}.answerItems`, { returnObjects: true }) as string[];
      return (
        <Box>
          <Typography variant="body1" paragraph>
            {t(`glossaryPage.faqItems.${faqId}.answerIntro`)}
          </Typography>
          <List dense>
            {Array.isArray(items) && items.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      );
    }

    if (isSpecial && faqId === 'legalVsTotal') {
      return (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>{t('glossaryPage.faqItems.legalVsTotal.legallyBlind')}</strong> {t('glossaryPage.faqItems.legalVsTotal.legallyBlindDesc')}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>{t('glossaryPage.faqItems.legalVsTotal.totallyBlind')}</strong> {t('glossaryPage.faqItems.legalVsTotal.totallyBlindDesc')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('glossaryPage.faqItems.legalVsTotal.mostBlind')}
          </Typography>
        </Box>
      );
    }

    if (isSpecial && faqId === 'causesTreatment') {
      const causes = t(`glossaryPage.faqItems.causesTreatment.causeItems`, { returnObjects: true }) as string[];
      return (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>{t('glossaryPage.faqItems.causesTreatment.leadingCauses')}</strong>
          </Typography>
          <List dense>
            {Array.isArray(causes) && causes.map((cause, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <MedicalServicesIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={cause} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            {t('glossaryPage.faqItems.causesTreatment.treatmentInfo')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('glossaryPage.faqItems.causesTreatment.neurologicalNote')}
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="body1" paragraph>
          {t(`glossaryPage.faqItems.${faqId}.answer`)}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      {/* FAQ Items */}
      <Box sx={{ mb: 4 }}>
        {FAQ_ITEMS_CONFIG.map((faq, index) => (
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
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--color-primary)',
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
                    {index + 1}. {t(`glossaryPage.faqItems.${faq.id}.question`)}
                  </Typography>
                  <Chip
                    label={t(`glossaryPage.faqCategories.${faq.categoryKey}`)}
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
              {renderFaqAnswer(faq.id, faq.hasList, faq.isSpecial)}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Additional Information */}
      <Paper className="faq-info-box" elevation={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HelpIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" className="faq-info-title">
            {t('glossaryPage.aboutFaq.title')}
          </Typography>
        </Box>
        <Typography variant="body1" paragraph className="faq-info-text">
          {t('glossaryPage.aboutFaq.paragraph1')}
        </Typography>
        <Typography variant="body1" paragraph className="faq-info-text">
          {t('glossaryPage.aboutFaq.paragraph2')}
        </Typography>
        <Typography variant="body1" className="faq-info-text" dangerouslySetInnerHTML={{ __html: t('glossaryPage.aboutFaq.paragraph3') }} />
      </Paper>
    </>
  );
};

export default FAQTab;
