import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Paper,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Help as HelpIcon,
  LocalHospital as LocalHospitalIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ThumbnailImage from './ThumbnailImage';
import { conditionCategories } from '../data/conditionCategories';
import {
  Visibility as VisibilityIconFaq,
  Smartphone as SmartphoneIcon,
  Home as HomeIconFaq,
  Directions as DirectionsIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ColorLens as ColorLensIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import '../styles/Conditions.css';
import '../styles/FAQ.css';

const ConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<string>>(new Set());

  const [filteredCategories, setFilteredCategories] = useState(conditionCategories);

  // Helper function to get category translation key
  const getCategoryTranslationKey = (categoryId: string): string => {
    const keyMap: Record<string, string> = {
      'visual-field': 'visualField',
      'color-vision': 'colorVision',
      'eye-conditions': 'eyeConditions',
      'retinal': 'retinal',
      'neurological': 'neurological',
      'trauma-infection': 'traumaInfection'
    };
    return keyMap[categoryId] || categoryId;
  };

  // FAQ items structure with icons
  const faqItemsConfig = [
    { id: 'darkness', icon: <VisibilityIconFaq />, categoryKey: 'visionPerception' },
    { id: 'technology', icon: <SmartphoneIcon />, categoryKey: 'technologyAccessibility' },
    { id: 'independence', icon: <HomeIconFaq />, categoryKey: 'dailyLife' },
    { id: 'navigation', icon: <DirectionsIcon />, categoryKey: 'navigationMobility', hasList: true },
    { id: 'senses', icon: <PsychologyIcon />, categoryKey: 'visionPerception' },
    { id: 'interaction', icon: <PersonIcon />, categoryKey: 'socialInteraction', hasList: true },
    { id: 'legalVsTotal', icon: <VisibilityIconFaq />, categoryKey: 'visionPerception', isSpecial: true },
    { id: 'employment', icon: <WorkIcon />, categoryKey: 'employmentCareer' },
    { id: 'identification', icon: <ColorLensIcon />, categoryKey: 'dailyLife', hasList: true },
    { id: 'causesTreatment', icon: <MedicalServicesIcon />, categoryKey: 'medicalTreatment', isSpecial: true }
  ];

  // Helper function to render FAQ answer content
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

  const filterCategories = useCallback(() => {
    let filtered = conditionCategories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        conditions: category.conditions.filter(condition =>
          condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condition.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.conditions.length > 0);
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(category => category.id === categoryFilter);
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    filterCategories();
  }, [filterCategories]);

  const handleCategoryChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFAQChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const handleTreatmentToggle = (conditionId: string) => {
    setExpandedTreatments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conditionId)) {
        newSet.delete(conditionId);
      } else {
        newSet.add(conditionId);
      }
      return newSet;
    });
  };

  // Helper function to get image path for a condition
  // Tries .webp first (most common format), then falls back to .png
  const getConditionImagePath = (conditionName: string): string | null => {
    const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
    // Try .webp first, then .png
    return `${basePath}.webp`;
  };

  const getCategoryColor = (_category: string) => {
    return '#1e3a8a';
  };

  return (
    <Box className="conditions-glossary" sx={{ pb: 10 }}>
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

        {/* Glossary Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Search and Filter Section */}
        <Box className="conditions-search-section">
          <Grid container spacing={1.5} sx={{ mb: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label={t('glossaryPage.searchConditions')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                className="conditions-search-input"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className="conditions-filter-select">
                <InputLabel>{t('glossaryPage.category')}</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label={t('glossaryPage.category')}
                >
                  <MenuItem value="">{t('glossaryPage.allCategories')}</MenuItem>
                  {conditionCategories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {category.icon}
                        <Typography sx={{ ml: 1 }}>{t(`glossaryPage.conditionCategories.${getCategoryTranslationKey(category.id)}.name`, category.name)}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" className="conditions-stats">
              {t('glossaryPage.conditionsFound', { count: filteredCategories.reduce((total, category) => total + category.conditions.length, 0) })}
            </Typography>
            <Button onClick={clearFilters} variant="outlined" size="small" startIcon={<FilterListIcon />} className="conditions-clear-button">
              {t('glossaryPage.clearFilters')}
            </Button>
          </Box>
        </Box>

        {/* Conditions by Category */}
        {filteredCategories.map((category) => (
          <Accordion 
            key={category.id}
            expanded={expandedCategory === category.id}
            onChange={handleCategoryChange(category.id)}
            className="condition-category-accordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="condition-category-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                <Box className="condition-category-icon">
                  {category.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" component="h3" className="condition-category-title">
                  {t(`glossaryPage.conditionCategories.${getCategoryTranslationKey(category.id)}.name`, category.name)}
                </Typography>
                <Typography variant="body2" className="condition-category-subtitle">
                  {t(`glossaryPage.conditionCategories.${getCategoryTranslationKey(category.id)}.description`, category.description)} • {category.conditions.length} {t('glossaryPage.conditions')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List className="condition-list">
                {category.conditions.map((condition, index) => (
                  <React.Fragment key={condition.id}>
                    <ListItem className="condition-item" sx={{ position: 'relative' }}>
                      <ListItemIcon>
                        <Tooltip title={t('glossaryPage.viewInSimulator')}>
                          <IconButton
                            size="small"
                            className="condition-simulator-button"
                            onClick={() => {
                              // Navigate to simulator with this condition
                              navigate('/simulator', { 
                                state: { 
                                  preconfiguredConditions: [condition.id],
                                  conditionName: condition.name
                                }
                              });
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemIcon>
                      <Box sx={{ width: '100%' }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" component="h4" className="condition-name">
                                {condition.name}
                              </Typography>
                              {condition.relatedPeople && condition.relatedPeople.length > 0 && (
                                <Chip
                                  label={t('glossaryPage.featuredIn', { names: condition.relatedPeople.join(', ') })}
                                  size="small"
                                  className="condition-related-chip"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" className="condition-description">
                              {condition.description}
                            </Typography>
                          }
                        />
                        {condition.treatments && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                            <Box
                              onClick={() => handleTreatmentToggle(condition.id)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                userSelect: 'none',
                                '&:hover': {
                                  opacity: 0.8
                                }
                              }}
                            >
                              <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', flexGrow: 1 }}>
                                {t('glossaryPage.treatmentOptions')}
                              </Typography>
                              <ChevronRightIcon 
                                sx={{ 
                                  color: 'primary.main', 
                                  fontSize: 20,
                                  transform: expandedTreatments.has(condition.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease'
                                }} 
                              />
                            </Box>
                            <Collapse in={expandedTreatments.has(condition.id)}>
                              <Box sx={{ mt: 1.5 }}>
                                <List dense className="condition-treatment-list" sx={{ pl: 0, mb: 1 }}>
                                  {condition.treatments.options.map((option, idx) => (
                                    <ListItem key={idx} className="condition-treatment-item" sx={{ py: 0.5, pl: 2 }}>
                                      <ListItemIcon sx={{ minWidth: 8 }}>
                                        <Box className="condition-treatment-bullet" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" className="condition-treatment-text" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                                            {option}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                {condition.treatments.notes && (
                                  <Box
                                    className="condition-treatment-notes"
                                    sx={{
                                      mt: 1.5,
                                      p: 1.5,
                                      bgcolor: '#f8fafc',
                                      borderRadius: 1,
                                      borderLeft: '3px solid',
                                      borderColor: 'primary.main'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <InfoIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.25 }} />
                                      <Typography variant="body2" className="condition-treatment-notes-text" sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                        {condition.treatments.notes}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </Box>
                        )}
                      </Box>
                      {/* Thumbnail image on the right */}
                      {(condition.imagePath || getConditionImagePath(condition.name)) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: { xs: 'none', md: 'block' },
                            width: 120,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <ThumbnailImage 
                            conditionName={condition.name}
                            imagePath={condition.imagePath}
                          />
                        </Box>
                      )}
                    </ListItem>
                    {index < category.conditions.length - 1 && <Divider className="condition-divider" />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

        {filteredCategories.length === 0 && (
          <Box className="conditions-empty-state">
            <Typography variant="h6" color="text.secondary">
              {t('glossaryPage.noConditionsFound')}
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              {t('glossaryPage.clearAllFilters')}
            </Button>
          </Box>
        )}

            {/* Additional Information */}
            <Box className="conditions-info-box">
              <Typography variant="h5" gutterBottom className="conditions-info-title">
                {t('glossaryPage.aboutGlossary.title')}
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                {t('glossaryPage.aboutGlossary.paragraph1')}
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                {t('glossaryPage.aboutGlossary.paragraph2')}
              </Typography>
              <Typography variant="body1" className="conditions-info-text">
                {t('glossaryPage.aboutGlossary.paragraph3')}
              </Typography>
            </Box>
          </>
        )}

        {/* FAQ Tab Content */}
        {activeTab === 1 && (
          <>
            {/* FAQ Items */}
            <Box sx={{ mb: 4 }}>
              {faqItemsConfig.map((faq, index) => (
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
                      backgroundColor: getCategoryColor(faq.categoryKey),
                      color: 'white',
                      '&:hover': {
                        backgroundColor: getCategoryColor(faq.categoryKey),
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
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ConditionsPage;
