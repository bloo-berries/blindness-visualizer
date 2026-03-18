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
  Switch,
  useTheme,
  useMediaQuery
} from '@mui/material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta, { BASE_URL } from './PageMeta';
import { personData, categories } from '../data/famousPeople';
import {
  PERSON_IDS,
  PERSON_COUNT,
  CATEGORY_PEOPLE_SETS,
  getCategoryKey,
  PRECOMPUTED_CONDITION_CATEGORIES,
  PRECOMPUTED_COUNTRIES
} from '../data/famousPeople/constants';
import { getSimulationConditions } from '../utils/famousPeopleUtils';
import { PersonCard } from './FamousBlindPeople/PersonCard';
import { PersonDialog } from './FamousBlindPeople/PersonDialog';
import { getPersonImagePath } from '../utils/imagePaths';
import { FlagWithName } from '../utils/flagUtils';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useDebounce } from '../hooks';

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { preferences } = useAccessibility();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Handle URL parameter for direct person linking (initial load only)
  const hasInitializedFromUrl = useRef(false);
  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    const personParam = searchParams.get('person');
    if (personParam && personData[personParam]) {
      setSelectedPerson(personParam);
      hasInitializedFromUrl.current = true;
    }
  }, [searchParams]);

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

  const famousPeopleJsonLd = useMemo(() => {
    let position = 0;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Famous People with Vision Conditions',
      description: `Profiles of ${PERSON_COUNT}+ historical and contemporary figures who lived with vision conditions.`,
      numberOfItems: PERSON_COUNT,
      itemListElement: categories.flatMap(cat =>
        cat.people.map(key => {
          const p = personData[key];
          if (!p) return null;
          position++;
          return {
            '@type': 'ListItem',
            position,
            item: {
              '@type': 'Person',
              name: p.name,
              description: `${p.condition}${p.achievement ? `. ${p.achievement}` : ''}`,
              ...(p.wikiUrl ? { sameAs: p.wikiUrl } : {}),
            },
          };
        }).filter(Boolean)
      ),
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <PageMeta
        title={selectedPersonData ? `${selectedPersonData.name} — ${selectedPersonData.condition}` : "Famous People with Vision Conditions"}
        description={selectedPersonData
          ? `Learn about ${selectedPersonData.name}'s vision condition: ${selectedPersonData.condition}. ${selectedPersonData.achievement || ''}`
          : "Explore famous historical and contemporary figures who lived with vision conditions. Experience their visual impairments through interactive simulations."}
        path={selectedPerson ? `/famous-people?person=${selectedPerson}` : "/famous-people"}
        ogImage={selectedPerson ? `${BASE_URL}/og/${selectedPerson}.png` : undefined}
        jsonLd={famousPeopleJsonLd}
      />
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
            <Typography variant="body2" className="famous-people-filter-text" sx={{ color: preferences.highContrast ? '#000000' : 'var(--color-text-primary)' }}>
              {t('famousPeople.showingResults', { count: filteredPeople.length, total: PERSON_COUNT })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hideCompleteBlindness}
                    onChange={(e) => setHideCompleteBlindness(e.target.checked)}
                    size="small"
                    sx={preferences.highContrast ? {
                      '& .MuiSwitch-thumb': { backgroundColor: '#000000' },
                      '& .MuiSwitch-track': { backgroundColor: '#000000 !important', opacity: '0.5 !important' }
                    } : {}}
                  />
                }
                label={
                  <Typography variant="body2" className="famous-people-filter-text" sx={{ color: preferences.highContrast ? '#000000' : 'var(--color-text-primary)' }}>
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
            {isMobile ? (
              /* Mobile: horizontal swipeable carousel */
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  gap: 1.5,
                  pb: 1,
                  mx: -2,
                  px: 2,
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {categoryPeople.map((personId, categoryIndex) => {
                  const person = personData[personId];
                  const globalIndex = startIndex + categoryIndex;
                  const isPriority = globalIndex < 6;

                  return (
                    <Box
                      key={personId}
                      sx={{
                        flex: '0 0 140px',
                        scrollSnapAlign: 'start',
                        display: 'flex',
                      }}
                    >
                      <PersonCard
                        personId={personId}
                        person={person}
                        onClick={() => handlePersonClick(personId)}
                        priority={isPriority}
                        index={globalIndex}
                      />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              /* Desktop/Tablet: standard grid */
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
            )}
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
      />

      <Footer />
    </Box>
  );
};

export default FamousBlindPeople;
