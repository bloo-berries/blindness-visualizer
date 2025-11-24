import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button
} from '@mui/material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { personData, categories } from '../data/famousPeopleData';
import { getSimulationConditions } from '../utils/famousPeopleUtils';
import { PersonCard } from './FamousBlindPeople/PersonCard';
import { PersonDialog } from './FamousBlindPeople/PersonDialog';

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Categorize conditions into groups
  const conditionCategories = useMemo(() => {
    const categorizeCondition = (condition: string): string => {
      const lower = condition.toLowerCase();
      
      // Ocular Issues - direct eye problems
      if (
        lower.includes('glaucoma') ||
        lower.includes('cataract') ||
        lower.includes('retinal detachment') ||
        lower.includes('retinopathy') ||
        lower.includes('retinoschisis') ||
        lower.includes('macular degeneration') ||
        lower.includes('macular') ||
        lower.includes('amd') ||
        lower.includes('keratoconus') ||
        lower.includes('aniridia') ||
        lower.includes('nystagmus') ||
        lower.includes('retinoblastoma') ||
        lower.includes('stargardt') ||
        lower.includes('cone-rod') ||
        lower.includes('diabetic retinopathy') ||
        lower.includes('ophthalmia') ||
        lower.includes('iritis') ||
        lower.includes('eye infection') ||
        lower.includes('eye disease') ||
        lower.includes('sight disease') ||
        lower.includes('color blindness') ||
        lower.includes('color deficiency') ||
        lower.includes('achromatopsia') ||
        lower.includes('deuteranopia') ||
        lower.includes('deuteranomaly') ||
        lower.includes('nearsighted')
      ) {
        return 'Ocular Issues';
      }
      
      // Neurologic Issues - brain/nervous system related
      if (
        lower.includes('neuromyelitis') ||
        lower.includes('stroke') ||
        lower.includes('brain injury') ||
        lower.includes('traumatic brain') ||
        lower.includes('meningitis') ||
        lower.includes('neurologic') ||
        lower.includes('neurological')
      ) {
        return 'Neurologic Issues';
      }
      
      // Accident/Injury - trauma related
      if (
        lower.includes('accident') ||
        lower.includes('injury') ||
        lower.includes('trauma') ||
        lower.includes('gunshot') ||
        lower.includes('car accident') ||
        lower.includes('chemical burn') ||
        lower.includes('explosion') ||
        lower.includes('shooting') ||
        lower.includes('broken glass') ||
        lower.includes('eye injury')
      ) {
        return 'Accident/Injury';
      }
      
      // Congenital Defects - present from birth
      if (
        lower.includes('congenital') ||
        lower.includes('from birth') ||
        lower.includes('born blind') ||
        lower.includes('birth defect')
      ) {
        return 'Congenital Defects';
      }
      
      // Degenerative Eye Diseases - progressive conditions
      if (
        lower.includes('degenerative') ||
        lower.includes('progressive') ||
        lower.includes('retinitis pigmentosa') ||
        lower.includes('dystrophy')
      ) {
        return 'Degenerative Eye Diseases';
      }
      
      // Illness - disease/infection related
      if (
        lower.includes('illness') ||
        lower.includes('disease') ||
        lower.includes('fever') ||
        lower.includes('smallpox') ||
        lower.includes('diphtheria') ||
        lower.includes('kawasaki') ||
        lower.includes('epilepsy') ||
        lower.includes('terry syndrome') ||
        lower.includes('oxygen toxicity') ||
        lower.includes('scarlet fever') ||
        lower.includes('complications')
      ) {
        return 'Illness';
      }
      
      // Default category for unmatched conditions
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

    return filtered;
  }, [searchTerm, categoryFilter, conditionFilter, conditionCategories]);

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
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const selectedPersonData = selectedPerson ? personData[selectedPerson] : null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth={false} sx={{ maxWidth: '1000px', pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Famous Blind & Visually Impaired People
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
          Explore the lives and visual experiences of famous blind and visually impaired individuals throughout history.
        </Typography>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by name or condition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  label="Condition"
                >
                  <MenuItem value="">All Conditions</MenuItem>
                  {conditionCategories.map(({ category, conditions }) => (
                    <MenuItem key={category} value={category}>
                      {category} ({conditions.length})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredPeople.length} of {Object.keys(personData).length} people
            </Typography>
            <Button onClick={clearFilters} variant="outlined" size="small">
              Clear Filters
            </Button>
          </Box>
        </Box>

        {/* People Cards */}
        {categories.map(category => {
          const categoryPeople = filteredPeople.filter(personId => 
            category.people.includes(personId)
          );
          
          if (categoryPeople.length === 0) return null;

          return (
            <Box key={category.name} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
                {category.name}
              </Typography>
              <Grid container spacing={2}>
                {categoryPeople.map(personId => {
                  const person = personData[personId];
                  return (
                    <PersonCard
                      key={personId}
                      personId={personId}
                      person={person}
                      onClick={() => handlePersonClick(personId)}
                    />
                  );
                })}
              </Grid>
            </Box>
          );
        })}

        {filteredPeople.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No people found matching your search criteria.
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Box>
        )}
      </Container>

      {/* Person Detail Dialog */}
      <PersonDialog
        open={!!selectedPerson}
        personId={selectedPerson}
        person={selectedPersonData}
        onClose={handleCloseDialog}
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
