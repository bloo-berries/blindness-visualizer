import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { FlagWithName } from '../utils/flagUtils';

// ============================================
// STATIC DATA - Moved outside component
// ============================================

// Pre-computed person keys and count (never changes)
const PERSON_IDS = Object.keys(personData);
const PERSON_COUNT = PERSON_IDS.length;

// Pre-computed category people as Sets for O(1) lookup
const CATEGORY_PEOPLE_SETS: Map<string, Set<string>> = new Map(
  categories.map(cat => [cat.name, new Set(cat.people)])
);

// Helper to convert category name to translation key
const CATEGORY_KEY_MAP: Record<string, string> = {
  'Ocular Issues': 'ocularIssues',
  'Neurologic Issues': 'neurologicIssues',
  'Accident/Injury': 'accidentInjury',
  'Congenital Defects': 'congenitalDefects',
  'Degenerative Eye Diseases': 'degenerativeEyeDiseases',
  'Illness': 'illness',
  'Other': 'other'
};

const getCategoryKey = (category: string): string => {
  return CATEGORY_KEY_MAP[category] || 'other';
};

// Keyword-to-category lookup map for condition categorization
const CONDITION_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Ocular Issues': [
    'glaucoma', 'cataract', 'retinal detachment', 'retinopathy', 'retinoschisis',
    'macular degeneration', 'macular', 'amd', 'keratoconus', 'aniridia', 'nystagmus',
    'retinoblastoma', 'stargardt', 'cone-rod', 'diabetic retinopathy', 'ophthalmia',
    'iritis', 'eye infection', 'eye disease', 'sight disease', 'color blindness',
    'color deficiency', 'achromatopsia', 'deuteranopia', 'deuteranomaly', 'nearsighted',
    'myasthenia'
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

// Category order for display
const CATEGORY_ORDER = [
  'Ocular Issues',
  'Neurologic Issues',
  'Accident/Injury',
  'Congenital Defects',
  'Degenerative Eye Diseases',
  'Illness',
  'Other'
];

// Pre-compute condition categories (static data, never changes)
const PRECOMPUTED_CONDITION_CATEGORIES = (() => {
  const categorizeCondition = (condition: string): string => {
    const lower = condition.toLowerCase();
    for (const [category, keywords] of Object.entries(CONDITION_CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  };

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

  conditionsMap.forEach((conditions) => {
    conditions.sort((a, b) => a.localeCompare(b));
  });

  const categorized: Array<{ category: string; conditions: string[]; conditionSet: Set<string> }> = [];
  CATEGORY_ORDER.forEach(category => {
    if (conditionsMap.has(category)) {
      const conditions = conditionsMap.get(category)!;
      categorized.push({
        category,
        conditions,
        conditionSet: new Set(conditions) // Pre-compute Set for O(1) lookup
      });
    }
  });

  return categorized;
})();

// Pre-compute countries (static data, never changes)
const PRECOMPUTED_COUNTRIES = (() => {
  const countryMap = new Map<string, string>();
  Object.values(personData).forEach(person => {
    if (person.nationality) {
      countryMap.set(person.nationality.country, person.nationality.flag);
    }
  });
  return Array.from(countryMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([country, flag]) => ({ country, flag }));
})();

// ============================================
// CUSTOM HOOKS
// ============================================

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// MAIN COMPONENT
// ============================================

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [hideCompleteBlindness, setHideCompleteBlindness] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Debounced search term (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Track if initial preload has been done
  const hasPreloaded = useRef(false);

  // Handle URL parameter for direct person linking
  useEffect(() => {
    const personParam = searchParams.get('person');
    if (personParam && personData[personParam] && !selectedPerson) {
      setSelectedPerson(personParam);
    }
  }, [searchParams, selectedPerson]);

  // Update URL when person is selected/deselected
  const updateSelectedPerson = useCallback((personId: string | null) => {
    setSelectedPerson(personId);
    if (personId) {
      setSearchParams({ person: personId }, { replace: true });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('person');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Helper function to check if a person has only complete blindness visualization
  const isCompleteBlindnessOnly = useCallback((personId: string): boolean => {
    const person = personData[personId];
    const conditions = getSimulationConditions(person.simulation);
    return conditions.length === 1 && conditions[0] === 'completeBlindness';
  }, []);

  // Optimized filtering with debounced search and Set lookups
  const filteredPeople = useMemo(() => {
    let filtered = PERSON_IDS;

    // Filter by debounced search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(personId => {
        const person = personData[personId];
        return person.name.toLowerCase().includes(searchLower) ||
               person.condition.toLowerCase().includes(searchLower);
      });
    }

    // Filter by category using pre-computed Set (O(1) lookup)
    if (categoryFilter) {
      const categorySet = CATEGORY_PEOPLE_SETS.get(categoryFilter);
      if (categorySet) {
        filtered = filtered.filter(personId => categorySet.has(personId));
      }
    }

    // Filter by condition category using pre-computed Set (O(1) lookup)
    if (conditionFilter) {
      const selectedCategory = PRECOMPUTED_CONDITION_CATEGORIES.find(
        cat => cat.category === conditionFilter
      );
      if (selectedCategory) {
        filtered = filtered.filter(personId => {
          const person = personData[personId];
          return selectedCategory.conditionSet.has(person.condition);
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
  }, [debouncedSearchTerm, categoryFilter, conditionFilter, countryFilter, hideCompleteBlindness, isCompleteBlindnessOnly]);

  // Convert filtered people to Set for O(1) lookup
  const filteredPeopleSet = useMemo(() => new Set(filteredPeople), [filteredPeople]);

  // Pre-compute category cards data to avoid IIFE in render
  const categoryCardsData = useMemo(() => {
    let globalIndex = 0;

    return categories.map(category => {
      const categorySet = CATEGORY_PEOPLE_SETS.get(category.name);
      if (!categorySet) return null;

      // Filter people in this category that are also in filtered results
      const categoryPeople = category.people.filter(personId =>
        filteredPeopleSet.has(personId)
      );

      if (categoryPeople.length === 0) return null;

      const startIndex = globalIndex;
      globalIndex += categoryPeople.length;

      return {
        category,
        categoryPeople,
        startIndex
      };
    }).filter(Boolean) as Array<{
      category: typeof categories[0];
      categoryPeople: string[];
      startIndex: number;
    }>;
  }, [filteredPeopleSet]);

  // Get display order for dialog navigation
  const displayOrder = useMemo(() => {
    const ordered: string[] = [];
    categories.forEach(category => {
      category.people.forEach(personId => {
        if (filteredPeopleSet.has(personId)) {
          ordered.push(personId);
        }
      });
    });
    return ordered;
  }, [filteredPeopleSet]);

  // Handlers
  const handlePersonClick = useCallback((personId: string) => {
    updateSelectedPerson(personId);
  }, [updateSelectedPerson]);

  const handleCloseDialog = useCallback(() => {
    updateSelectedPerson(null);
  }, [updateSelectedPerson]);

  const handleExperienceSimulation = useCallback((personId: string) => {
    const person = personData[personId];
    const conditions = getSimulationConditions(person.simulation);

    navigate('/simulator', {
      state: {
        preconfiguredConditions: conditions,
        personName: person.name,
        personCondition: person.condition
      }
    });
  }, [navigate]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('');
    setConditionFilter('');
    setCountryFilter('');
    setHideCompleteBlindness(false);
  }, []);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const selectedPersonData = selectedPerson ? personData[selectedPerson] : null;

  // Preload first batch of images only once on initial mount
  useEffect(() => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    const preloadImages = () => {
      const firstBatch = PERSON_IDS.slice(0, 12);
      firstBatch.forEach((personId) => {
        const img = new Image();
        img.src = getPersonImagePath(personId);
      });
    };

    const timeoutId = setTimeout(preloadImages, 100);
    return () => clearTimeout(timeoutId);
  }, []);

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
                  {PRECOMPUTED_CONDITION_CATEGORIES.map(({ category, conditions }) => (
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
                  {PRECOMPUTED_COUNTRIES.map(({ country, flag }) => (
                    <MenuItem key={country} value={country}>
                      <FlagWithName flag={flag} countryName={country} size={18} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('famousPeople.showingResults', { count: filteredPeople.length, total: PERSON_COUNT })}
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

        {/* People Cards - Using pre-computed data */}
        {categoryCardsData.map(({ category, categoryPeople, startIndex }) => (
          <Box key={category.name} sx={{ mb: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2 }}>
              {t(`famousPeople.categories.${category.id}`, category.name)}
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              {categoryPeople.map((personId, categoryIndex) => {
                const person = personData[personId];
                const globalIndex = startIndex + categoryIndex;
                const isPriority = globalIndex < 6;

                return (
                  <Grid item xs={4} sm={2} md={2} lg={2} xl={2} key={personId} sx={{ display: 'flex' }}>
                    <PersonCard
                      personId={personId}
                      person={person}
                      onClick={() => handlePersonClick(personId)}
                      priority={isPriority}
                      index={globalIndex}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}

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
        onNavigate={(personId) => updateSelectedPerson(personId)}
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
