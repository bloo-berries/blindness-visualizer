import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { faqItems } from '../data/faqItems';
import '../styles/Conditions.css';
import '../styles/FAQ.css';

const ConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<string>>(new Set());

  const [filteredCategories, setFilteredCategories] = useState(conditionCategories);

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
          Glossary & FAQ
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
          Comprehensive definitions of vision conditions, and FAQ about blindness and visual impairment.
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
            <Tab label="Glossary" />
            <Tab label="FAQ" />
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
                label="Search conditions"
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {conditionCategories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {category.icon}
                        <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" className="conditions-stats">
              {filteredCategories.reduce((total, category) => total + category.conditions.length, 0)} conditions found
            </Typography>
            <Button onClick={clearFilters} variant="outlined" size="small" startIcon={<FilterListIcon />} className="conditions-clear-button">
              Clear Filters
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
                  {category.name}
                </Typography>
                <Typography variant="body2" className="condition-category-subtitle">
                  {category.description} • {category.conditions.length} conditions
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List className="condition-list">
                {category.conditions.map((condition, index) => (
                  <React.Fragment key={condition.id}>
                    <ListItem className="condition-item" sx={{ position: 'relative' }}>
                      <ListItemIcon>
                        <Tooltip title="View in simulator">
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
                                  label={`Featured in: ${condition.relatedPeople.join(', ')}`}
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
                                Treatment Options
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
                                <List dense sx={{ pl: 0, mb: 1 }}>
                                  {condition.treatments.options.map((option, idx) => (
                                    <ListItem key={idx} sx={{ py: 0.5, pl: 2 }}>
                                      <ListItemIcon sx={{ minWidth: 8 }}>
                                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={
                                          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                                            {option}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                {condition.treatments.notes && (
                                  <Box sx={{ 
                                    mt: 1.5, 
                                    p: 1.5, 
                                    bgcolor: '#f8fafc', 
                                    borderRadius: 1, 
                                    borderLeft: '3px solid',
                                    borderColor: 'primary.main'
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <InfoIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.25 }} />
                                      <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic' }}>
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
              No conditions found matching your search criteria.
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Box>
        )}

            {/* Additional Information */}
            <Box className="conditions-info-box">
              <Typography variant="h5" gutterBottom className="conditions-info-title">
                About This Glossary
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                This glossary contains comprehensive information about vision conditions and visual impairments. 
                Each condition includes detailed descriptions of symptoms, causes, and effects on daily life.
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                Conditions marked with "Featured in:" are associated with famous individuals in our simulator. 
                Click the eye icon next to any condition to experience it in our vision simulator.
              </Typography>
              <Typography variant="body1" className="conditions-info-text">
                This resource is designed to help users understand the various ways vision can be affected, 
                whether through genetic conditions, injury, disease, or other factors.
              </Typography>
            </Box>
          </>
        )}

        {/* FAQ Tab Content */}
        {activeTab === 1 && (
          <>
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
                For more detailed information about specific vision conditions, visit our <strong>Glossary</strong> tab above.
              </Typography>
            </Paper>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ConditionsPage;
