import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
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
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  LocalHospital as LocalHospitalIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import ThumbnailImage from '../ThumbnailImage';
import { conditionCategories } from '../../data/conditionCategories';

const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  'visual-field': 'visualField',
  'color-vision': 'colorVision',
  'eye-conditions': 'eyeConditions',
  'retinal': 'retinal',
  'neurological': 'neurological',
  'trauma-infection': 'traumaInfection'
};

const getCategoryTranslationKey = (categoryId: string): string =>
  CATEGORY_TRANSLATION_KEYS[categoryId] || categoryId;

const getConditionImagePath = (conditionName: string): string =>
  `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}.webp`;

const GlossaryTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<string>>(new Set());
  const [filteredCategories, setFilteredCategories] = useState(conditionCategories);

  const filterCategories = useCallback(() => {
    let filtered = conditionCategories;

    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        conditions: category.conditions.filter(condition =>
          condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condition.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.conditions.length > 0);
    }

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

  return (
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
  );
};

export default GlossaryTab;
