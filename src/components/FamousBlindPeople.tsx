import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { personData, categories } from '../data/famousPeople';
import { getSimulationConditions } from '../utils/famousPeopleUtils';
import { PersonCard } from './FamousBlindPeople/PersonCard';
import { PersonDialog } from './FamousBlindPeople/PersonDialog';
import { getPersonImagePath } from '../utils/imagePaths';

// Helper to convert category name to translation key
const getCategoryKey = (category: string): string => {
  const keyMap: Record<string, string> = {
    'Ocular Issues': 'ocularIssues',
    'Neurologic Issues': 'neurologicIssues',
    'Accident/Injury': 'accidentInjury',
    'Congenital Defects': 'congenitalDefects',
    'Degenerative Eye Diseases': 'degenerativeEyeDiseases',
    'Illness': 'illness',
    'Other': 'other'
  };
  return keyMap[category] || 'other';
};

// Keyword-to-category lookup map for condition categorization
const CONDITION_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Ocular Issues': [
    'glaucoma', 'cataract', 'retinal detachment', 'retinopathy', 'retinoschisis',
    'macular degeneration', 'macular', 'amd', 'keratoconus', 'aniridia', 'nystagmus',
    'retinoblastoma', 'stargardt', 'cone-rod', 'diabetic retinopathy', 'ophthalmia',
    'iritis', 'eye infection', 'eye disease', 'sight disease', 'color blindness',
    'color deficiency', 'achromatopsia', 'deuteranopia', 'deuteranomaly', 'nearsighted'
  ],
  'Neurologic Issues': [
    'neuromyelitis', 'stroke', 'brain injury', 'traumatic brain', 'meningitis',
    'neurologic', 'neurological'
  ],
  'Accident/Injury': [
    'accident', 'injury', 'trauma', 'gunshot', 'car accident', 'chemical burn',
    'explosion', 'shooting', 'broken glass', 'eye injury'
  ],
  'Congenital Defects': [
    'congenital', 'from birth', 'born blind', 'birth defect'
  ],
  'Degenerative Eye Diseases': [
    'degenerative', 'progressive', 'retinitis pigmentosa', 'dystrophy'
  ],
  'Illness': [
    'illness', 'disease', 'fever', 'smallpox', 'diphtheria', 'kawasaki',
    'epilepsy', 'terry syndrome', 'oxygen toxicity', 'scarlet fever', 'complications'
  ]
};

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [hideCompleteBlindness, setHideCompleteBlindness] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Categorize conditions into groups
  const conditionCategories = useMemo(() => {
    const categorizeCondition = (condition: string): string => {
      const lower = condition.toLowerCase();

      for (const [category, keywords] of Object.entries(CONDITION_CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => lower.includes(keyword))) {
          return category;
        }
      }

      return 'Other';
    };

    // Get all unique conditions and categorize them
    const conditionsMap = new Map<string, string[]>();
    Object.values(personData).forEach(person => {
      const category = categorizeCondition(person.condition);
      if (!conditionsMap.has(category)) {
        conditionsMap.set(category, []);
      }
      const categoryConditions = conditionsMap.get(category)!;
      if (!categoryConditions.includes(person.condition)) {
        categoryConditions.push(person.condition);
      }
    });

    // Sort conditions within each category
    conditionsMap.forEach((conditions) => {
      conditions.sort((a, b) => a.localeCompare(b));
    });

    // Define category order
    const categoryOrder = [
      'Ocular Issues',
      'Neurologic Issues',
      'Accident/Injury',
      'Congenital Defects',
      'Degenerative Eye Diseases',
      'Illness',
      'Other'
    ];

    // Build categorized structure
    const categorized: Array<{ category: string; conditions: string[] }> = [];
    categoryOrder.forEach(category => {
      if (conditionsMap.has(category)) {
        categorized.push({
          category,
          conditions: conditionsMap.get(category)!
        });
      }
    });

    return categorized;
  }, []);

  // Get unique countries with flags, sorted alphabetically
  const countries = useMemo(() => {
    const countryMap = new Map<string, string>(); // country -> flag
    Object.values(personData).forEach(person => {
      if (person.nationality) {
        countryMap.set(person.nationality.country, person.nationality.flag);
      }
    });
    return Array.from(countryMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([country, flag]) => ({ country, flag }));
  }, []);

  // Helper function to check if a person has only complete blindness visualization
  const isCompleteBlindnessOnly = (personId: string): boolean => {
    const person = personData[personId];
    const conditions = getSimulationConditions(person.simulation);
    // Check if the only condition is 'completeBlindness'
    return conditions.length === 1 && conditions[0] === 'completeBlindness';
  };

  // Use useMemo to optimize filtering - only recalculate when filters change
  const filteredPeople = useMemo(() => {
    let filtered = Object.keys(personData);

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(personId => {
        const person = personData[personId];
        return person.name.toLowerCase().includes(searchLower) ||
               person.condition.toLowerCase().includes(searchLower);
      });
    }

    // Filter by category
    if (categoryFilter) {
      const category = categories.find(cat => cat.name === categoryFilter);
      if (category) {
        filtered = filtered.filter(personId => category.people.includes(personId));
      }
    }

    // Filter by condition category
    if (conditionFilter) {
      const selectedCategory = conditionCategories.find(cat => cat.category === conditionFilter);
      if (selectedCategory) {
        const categoryConditions = new Set(selectedCategory.conditions);
        filtered = filtered.filter(personId => {
          const person = personData[personId];
          return categoryConditions.has(person.condition);
        });
      }
    }

    // Filter by country
    if (countryFilter) {
      filtered = filtered.filter(personId => {
        const person = personData[personId];
        return person.nationality?.country === countryFilter;
      });
    }

    // Filter out complete blindness if toggle is enabled
    if (hideCompleteBlindness) {
      filtered = filtered.filter(personId => !isCompleteBlindnessOnly(personId));
    }

    return filtered;
  }, [searchTerm, categoryFilter, conditionFilter, countryFilter, conditionCategories, hideCompleteBlindness]);

  // Get display order that matches how people are actually rendered on the page
  const displayOrder = useMemo(() => {
    const filteredSet = new Set(filteredPeople);
    const ordered: string[] = [];

    // Iterate through categories in order
    categories.forEach(category => {
      // For each category, get people that are both in the category and filtered
      category.people.forEach(personId => {
        if (filteredSet.has(personId)) {
          ordered.push(personId);
        }
      });
    });

    return ordered;
  }, [filteredPeople]);

  const handlePersonClick = (personId: string) => {
    setSelectedPerson(personId);
  };

  const handleCloseDialog = () => {
    setSelectedPerson(null);
  };

  const handleExperienceSimulation = (personId: string) => {
    const person = personData[personId];
    const conditions = getSimulationConditions(person.simulation);
    
    // Navigate to simulator with pre-configured conditions
    navigate('/simulator', { 
      state: { 
        preconfiguredConditions: conditions,
        personName: person.name,
        personCondition: person.condition
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setConditionFilter('');
    setCountryFilter('');
    setHideCompleteBlindness(false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const selectedPersonData = selectedPerson ? personData[selectedPerson] : null;

  // Preload first batch of images for better initial load performance
  useEffect(() => {
    const preloadImages = () => {
      // Preload first 12 images (first visible row + buffer)
      const firstBatch = filteredPeople.slice(0, 12);
      firstBatch.forEach((personId) => {
        const img = new Image();
        img.src = getPersonImagePath(personId);
      });
    };

    // Small delay to not block initial render
    const timeoutId = setTimeout(preloadImages, 100);
    return () => clearTimeout(timeoutId);
  }, [filteredPeople]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth={false} sx={{ maxWidth: '1000px', pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          {t('famousPeople.title')}
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
          {t('famousPeople.subtitle')}
        </Typography>

        {/* Search and Filter Section */}
        <Box className="famous-people-filter-section" sx={{ mb: 4 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('famousPeople.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t('famousPeople.categoryLabel')}</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label={t('famousPeople.categoryLabel')}
                >
                  <MenuItem value="">{t('famousPeople.allCategories')}</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.name} value={category.name}>
                      {t(`famousPeople.categories.${category.id}`, category.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t('famousPeople.conditionLabel')}</InputLabel>
                <Select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  label={t('famousPeople.conditionLabel')}
                >
                  <MenuItem value="">{t('famousPeople.allConditions')}</MenuItem>
                  {conditionCategories.map(({ category, conditions }) => (
                    <MenuItem key={category} value={category}>
                      {t(`famousPeople.conditionCategories.${getCategoryKey(category)}`, category)} ({conditions.length})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t('famousPeople.countryLabel', 'Country')}</InputLabel>
                <Select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  label={t('famousPeople.countryLabel', 'Country')}
                >
                  <MenuItem value="">{t('famousPeople.allCountries', 'All Countries')}</MenuItem>
                  {countries.map(({ country, flag }) => (
                    <MenuItem key={country} value={country}>
                      {flag} {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('famousPeople.showingResults', { count: filteredPeople.length, total: Object.keys(personData).length })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hideCompleteBlindness}
                    onChange={(e) => setHideCompleteBlindness(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {t('famousPeople.hideTotalDarkness')}
                  </Typography>
                }
              />
              <Button onClick={clearFilters} variant="outlined" size="small">
                {t('buttons.clearFilters')}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* People Cards */}
        {(() => {
          let globalIndex = 0;
          return categories.map(category => {
            const categoryPeople = filteredPeople.filter(personId => 
              category.people.includes(personId)
            );
            
            if (categoryPeople.length === 0) return null;

            const categoryStartIndex = globalIndex;
            const categoryCards = categoryPeople.map((personId, categoryIndex) => {
              const person = personData[personId];
              const currentGlobalIndex = categoryStartIndex + categoryIndex;
              // Mark first 6 images as priority (above the fold)
              const isPriority = currentGlobalIndex < 6;
              
              return (
                <PersonCard
                  key={personId}
                  personId={personId}
                  person={person}
                  onClick={() => handlePersonClick(personId)}
                  priority={isPriority}
                  index={currentGlobalIndex}
                />
              );
            });
            
            globalIndex += categoryPeople.length;

            return (
              <Box key={category.name} sx={{ mb: 4 }}>
                <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2 }}>
                  {t(`famousPeople.categories.${category.id}`, category.name)}
                </Typography>
                <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                  {categoryCards}
                </Grid>
              </Box>
            );
          });
        })()}

        {filteredPeople.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('famousPeople.noResults')}
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              {t('famousPeople.clearAllFilters')}
            </Button>
          </Box>
        )}
      </Container>

      {/* Person Detail Dialog */}
      <PersonDialog
        open={!!selectedPerson}
        personId={selectedPerson}
        person={selectedPersonData}
        filteredPeople={displayOrder}
        onClose={handleCloseDialog}
        onNavigate={(personId) => setSelectedPerson(personId)}
        onExperienceSimulation={() => {
          if (selectedPerson) {
            handleExperienceSimulation(selectedPerson);
            handleCloseDialog();
          }
        }}
      />

      <Footer />
    </Box>
  );
};

export default FamousBlindPeople;
