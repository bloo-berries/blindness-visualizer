import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import NavigationBar from '../NavigationBar';
import Footer from '../Footer';
import PageMeta from '../PageMeta';
import GlossaryTab from './GlossaryTab';
import FAQTab from './FAQTab';
import { conditionCategories } from '../../data/conditionCategories';
import '../../styles/Conditions.css';
import '../../styles/FAQ.css';

const ConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const conditionsJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vision Conditions Glossary',
    description: 'Comprehensive glossary of 148+ vision conditions with descriptions and treatment information.',
    numberOfItems: conditionCategories.reduce((n, cat) => n + cat.conditions.length, 0),
    itemListElement: conditionCategories.flatMap((cat, catIdx) =>
      cat.conditions.map((condition, condIdx) => ({
        '@type': 'ListItem',
        position: catIdx * 100 + condIdx + 1,
        item: {
          '@type': 'MedicalCondition',
          name: condition.name,
          description: condition.description,
          ...(condition.treatments ? {
            possibleTreatment: condition.treatments.options.map(opt => ({
              '@type': 'MedicalTherapy',
              name: opt,
            })),
          } : {}),
        },
      }))
    ),
  }), []);

  return (
    <Box className="conditions-glossary" sx={{ pb: 10 }}>
      <PageMeta
        title="Vision Conditions Glossary"
        description="Browse a comprehensive glossary of 148+ vision conditions including color blindness, macular degeneration, glaucoma, cataracts, and retinitis pigmentosa."
        path="/conditions"
        jsonLd={conditionsJsonLd}
      />
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />

      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          {t('glossaryPage.title')}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 4,
            color: 'text.primary',
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          {t('glossaryPage.subtitle')}
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="glossary and faq tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 120,
              }
            }}
          >
            <Tab label={t('glossaryPage.tabGlossary')} />
            <Tab label={t('glossaryPage.tabFaq')} />
          </Tabs>
        </Box>

        {activeTab === 0 && <GlossaryTab />}
        {activeTab === 1 && <FAQTab />}
      </Container>

      <Footer />
    </Box>
  );
};

export default ConditionsPage;
