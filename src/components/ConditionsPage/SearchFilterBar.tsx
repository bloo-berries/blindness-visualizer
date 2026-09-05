import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
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

interface SearchFilterBarProps {
  searchTerm: string;
  categoryFilter: string;
  compareMode: boolean;
  filteredCount: number;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onCompareModeToggle: () => void;
  onClearFilters: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  categoryFilter,
  compareMode,
  filteredCount,
  onSearchChange,
  onCategoryChange,
  onCompareModeToggle,
  onClearFilters
}) => {
  const { t } = useTranslation();

  return (
    <Box className="conditions-search-section">
      <Grid container spacing={1.5} sx={{ mb: 1 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label={t('glossaryPage.searchConditions')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            className="conditions-search-input"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth className="conditions-filter-select">
            <InputLabel id="category-filter-label">{t('glossaryPage.category')}</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
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
          {t('glossaryPage.conditionsFound', { count: filteredCount })}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={onCompareModeToggle}
            variant={compareMode ? 'contained' : 'outlined'}
            size="small"
            startIcon={<CompareArrowsIcon />}
          >
            Compare
          </Button>
          <Button onClick={onClearFilters} variant="outlined" size="small" startIcon={<FilterListIcon />} className="conditions-clear-button">
            {t('glossaryPage.clearFilters')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFilterBar;
