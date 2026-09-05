import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Fab,
  ButtonBase
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as LocalHospitalIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Visibility as VisibilityIcon,
  OpenInNew as OpenInNewIcon,
  MenuBook as MenuBookIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import ThumbnailImage from '../ThumbnailImage';
import { conditionCategories } from '../../data/conditionCategories';
import type { ConditionCategory } from '../../data/conditionCategories/types';
import SearchFilterBar from './SearchFilterBar';
import ComparisonDialog from './ComparisonDialog';

type Condition = ConditionCategory['conditions'][number];

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
  const [compareMode, setCompareMode] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  const handleCompareToggle = (condition: Condition) => {
    setSelectedConditions(prev => {
      const isSelected = prev.some(c => c.id === condition.id);
      if (isSelected) {
        return prev.filter(c => c.id !== condition.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, condition];
    });
  };

  const isConditionSelected = (conditionId: string) =>
    selectedConditions.some(c => c.id === conditionId);

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

  const handleCompareModeToggle = () => {
    setCompareMode(prev => !prev);
    if (compareMode) setSelectedConditions([]);
  };

  const handleNavigateToSimulator = (conditionId: string, conditionName: string) => {
    setCompareDialogOpen(false);
    navigate('/simulator', {
      state: {
        preconfiguredConditions: [conditionId],
        conditionName
      }
    });
  };

  const filteredCount = filteredCategories.reduce((total, category) => total + category.conditions.length, 0);

  return (
    <>
      <SearchFilterBar
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        compareMode={compareMode}
        filteredCount={filteredCount}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onCompareModeToggle={handleCompareModeToggle}
        onClearFilters={clearFilters}
      />

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
              <Box className="condition-category-icon" aria-hidden="true">
                {category.icon}
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" component="h2" className="condition-category-title">
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
                    {compareMode && (
                      <Checkbox
                        checked={isConditionSelected(condition.id)}
                        onChange={() => handleCompareToggle(condition)}
                        disabled={!isConditionSelected(condition.id) && selectedConditions.length >= 3}
                        sx={{ mr: 0.5 }}
                        size="small"
                        inputProps={{ 'aria-label': `Compare ${condition.name}` } as React.InputHTMLAttributes<HTMLInputElement>}
                      />
                    )}
                    <ListItemIcon>
                      <Tooltip title={t('glossaryPage.viewInSimulator')}>
                        <IconButton
                          size="small"
                          className="condition-simulator-button"
                          aria-label={`${t('glossaryPage.viewInSimulator')}: ${condition.name}`}
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
                            <Typography variant="h6" component="h3" className="condition-name">
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
                          <Box component="span">
                            <Typography variant="body2" className="condition-description" component="span" display="block">
                              {condition.description}
                            </Typography>
                            {condition.prevalence && (
                              <Typography variant="body2" component="span" display="block" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.secondary', fontSize: '0.8125rem' }}>
                                {t('glossaryPage.prevalence', { value: condition.prevalence })}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      {condition.treatments && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                          <ButtonBase
                            onClick={() => handleTreatmentToggle(condition.id)}
                            aria-expanded={expandedTreatments.has(condition.id)}
                            aria-label={`${t('glossaryPage.treatmentOptions')} — ${condition.name}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              width: '100%',
                              justifyContent: 'flex-start',
                              textAlign: 'left',
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
                          </ButtonBase>
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
                      {condition.resourceLinks && condition.resourceLinks.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                          <ButtonBase
                            onClick={() => handleTreatmentToggle(`resources-${condition.id}`)}
                            aria-expanded={expandedTreatments.has(`resources-${condition.id}`)}
                            aria-label={`${t('glossaryPage.learnMore')} — ${condition.name}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              width: '100%',
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              '&:hover': { opacity: 0.8 }
                            }}
                          >
                            <MenuBookIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', flexGrow: 1 }}>
                              {t('glossaryPage.learnMore')}
                            </Typography>
                            <ChevronRightIcon
                              sx={{
                                color: 'primary.main',
                                fontSize: 20,
                                transform: expandedTreatments.has(`resources-${condition.id}`) ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}
                            />
                          </ButtonBase>
                          <Collapse in={expandedTreatments.has(`resources-${condition.id}`)}>
                            <List dense sx={{ pl: 0, mt: 1 }}>
                              {condition.resourceLinks.map((link, idx) => (
                                <ListItem key={idx} sx={{ py: 0.25, pl: 2 }}>
                                  <ListItemIcon sx={{ minWidth: 24 }}>
                                    <OpenInNewIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="a"
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="body2"
                                        sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, fontSize: '0.875rem' }}
                                      >
                                        {link.label}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
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
        <Typography variant="h5" component="h2" gutterBottom className="conditions-info-title">
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

      {/* Floating Compare Button */}
      {compareMode && selectedConditions.length >= 2 && (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setCompareDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1100,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          <CompareArrowsIcon sx={{ mr: 1 }} />
          {t('glossaryPage.compareSelected', { count: selectedConditions.length })}
        </Fab>
      )}

      <ComparisonDialog
        open={compareDialogOpen}
        onClose={() => setCompareDialogOpen(false)}
        selectedConditions={selectedConditions}
        onNavigateToSimulator={handleNavigateToSimulator}
      />
    </>
  );
};

export default GlossaryTab;
