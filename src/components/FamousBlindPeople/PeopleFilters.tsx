import React from 'react';
import { useTranslation } from 'react-i18next';
import {
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
  Chip,
  Typography
} from '@mui/material';
import { Shuffle as ShuffleIcon } from '@mui/icons-material';
import { categories } from '../../data/famousPeople';
import {
  PERSON_COUNT,
  getCategoryKey,
  PRECOMPUTED_CONDITION_CATEGORIES,
  PRECOMPUTED_COUNTRIES
} from '../../data/famousPeople/constants';
import { FlagWithName } from '../../utils/flagUtils';

interface PeopleFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  conditionFilter: string;
  countryFilter: string;
  hideCompleteBlindness: boolean;
  filteredCount: number;
  highContrast: boolean;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
  onCountryChange: (country: string) => void;
  onHideCompleteBlindnessChange: (checked: boolean) => void;
  onRandomPerson: () => void;
  onClearFilters: () => void;
}

const PeopleFilters: React.FC<PeopleFiltersProps> = ({
  searchTerm,
  categoryFilter,
  conditionFilter,
  countryFilter,
  hideCompleteBlindness,
  filteredCount,
  highContrast,
  onSearchChange,
  onCategoryChange,
  onConditionChange,
  onCountryChange,
  onHideCompleteBlindnessChange,
  onRandomPerson,
  onClearFilters
}) => {
  const { t } = useTranslation();
  const textColor = highContrast ? '#000000' : 'var(--color-text-primary)';

  return (
    <Box className="famous-people-filter-section" sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('famousPeople.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>{t('famousPeople.categoryLabel')}</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
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
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>{t('famousPeople.conditionLabel')}</InputLabel>
            <Select
              value={conditionFilter}
              onChange={(e) => onConditionChange(e.target.value)}
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
              onChange={(e) => onCountryChange(e.target.value)}
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" className="famous-people-filter-text" sx={{ color: textColor }}>
            {t('famousPeople.showingResults', { count: filteredCount, total: PERSON_COUNT })}
          </Typography>
          {categoryFilter && (
            <Chip label={categoryFilter} size="small" onDelete={() => onCategoryChange('')} color="primary" variant="outlined" />
          )}
          {conditionFilter && (
            <Chip label={conditionFilter} size="small" onDelete={() => onConditionChange('')} color="primary" variant="outlined" />
          )}
          {countryFilter && (
            <Chip label={countryFilter} size="small" onDelete={() => onCountryChange('')} color="primary" variant="outlined" />
          )}
          {hideCompleteBlindness && (
            <Chip label={t('famousPeople.hideTotalDarkness')} size="small" onDelete={() => onHideCompleteBlindnessChange(false)} color="primary" variant="outlined" />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={hideCompleteBlindness}
                onChange={(e) => onHideCompleteBlindnessChange(e.target.checked)}
                size="small"
                sx={highContrast ? {
                  '& .MuiSwitch-thumb': { backgroundColor: '#000000' },
                  '& .MuiSwitch-track': { backgroundColor: '#000000 !important', opacity: '0.5 !important' }
                } : {}}
              />
            }
            label={
              <Typography variant="body2" className="famous-people-filter-text" sx={{ color: textColor }}>
                {t('famousPeople.hideTotalDarkness')}
              </Typography>
            }
          />
          <Button onClick={onRandomPerson} variant="outlined" size="small" startIcon={<ShuffleIcon />}>
            {t('famousPeople.randomPerson', 'Random Person')}
          </Button>
          <Button onClick={onClearFilters} variant="outlined" size="small">
            {t('buttons.clearFilters')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PeopleFilters;
