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
  Divider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  MedicalServices as MedicalServicesIcon,
  Psychology as PsychologyIcon,
  ColorLens as ColorLensIcon,
  RemoveRedEye as RemoveRedEyeIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
// Note: VISUAL_EFFECTS import removed as it's not currently used
import '../styles/Conditions.css';

interface ConditionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  conditions: Array<{
    id: string;
    name: string;
    description: string;
    relatedPeople?: string[];
  }>;
}

const ConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  // Organize conditions into categories
  const conditionCategories: ConditionCategory[] = [
    {
      id: 'visual-field',
      name: 'Visual Field Loss',
      icon: <RemoveRedEyeIcon />,
      description: 'Conditions affecting specific areas of the visual field',
      conditions: [
        {
          id: 'hemianopiaLeft',
          name: 'Homonymous Hemianopia (Left-field)',
          description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.',
          relatedPeople: ['John Milton']
        },
        {
          id: 'hemianopiaRight',
          name: 'Homonymous Hemianopia (Right-field)',
          description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.'
        },
        {
          id: 'quadrantanopia',
          name: 'Quadrantanopia',
          description: 'Loss of vision in one quarter (quadrant) of the visual field. Often caused by damage to specific parts of the brain that process vision. Affects spatial awareness and navigation.'
        },
        {
          id: 'bitemporalHemianopia',
          name: 'Bitemporal Hemianopia',
          description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.'
        },
        {
          id: 'scotoma',
          name: 'Central Scotoma',
          description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.',
          relatedPeople: ['Marla Runyan', 'Dr. Mona Minkara']
        },
        {
          id: 'tunnelVision',
          name: 'Tunnel Vision',
          description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.',
          relatedPeople: ['Erik Weihenmayer']
        }
      ]
    },
    {
      id: 'color-vision',
      name: 'Color Vision Deficiencies',
      icon: <ColorLensIcon />,
      description: 'Conditions affecting color perception and discrimination',
      conditions: [
        {
          id: 'protanopia',
          name: 'Protanopia (Red-Blind)',
          description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.'
        },
        {
          id: 'deuteranopia',
          name: 'Deuteranopia (Green-Blind)',
          description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.'
        },
        {
          id: 'tritanopia',
          name: 'Tritanopia (Blue-Blind)',
          description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.'
        },
        {
          id: 'protanomaly',
          name: 'Protanomaly (Red-Weak)',
          description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.'
        },
        {
          id: 'deuteranomaly',
          name: 'Deuteranomaly (Green-Weak)',
          description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.'
        },
        {
          id: 'tritanomaly',
          name: 'Tritanomaly (Blue-Weak)',
          description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.'
        },
        {
          id: 'monochromacy',
          name: 'Monochromacy (Complete Color Blindness)',
          description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.'
        }
      ]
    },
    {
      id: 'eye-conditions',
      name: 'Eye Conditions',
      icon: <MedicalServicesIcon />,
      description: 'Physical conditions affecting the eye structure and function',
      conditions: [
        {
          id: 'glaucoma',
          name: 'Glaucoma',
          description: 'A group of eye diseases that damage the optic nerve, typically due to elevated intraocular pressure. Known as the "silent thief of sight" because vision loss occurs gradually and peripherally first. Early stages show small paracentral scotomas, progressing to arc-shaped defects, then tunnel vision, and finally severe constriction. Central vision remains sharp until late stages. Includes blue-yellow color deficits and reduced contrast sensitivity.',
          relatedPeople: ['John Milton', 'Galileo Galilei', 'Ray Charles', 'Andrea Bocelli', 'David Paterson']
        },
        {
          id: 'cataracts',
          name: 'Cataracts',
          description: 'Clouding of the eye\'s natural lens. Causes blurry vision, difficulty seeing in bright light, and faded colors. Common with aging but can occur at any age.'
        },
        {
          id: 'amd',
          name: 'Age-Related Macular Degeneration (AMD)',
          description: 'Deterioration of the macula, the central part of the retina. Causes loss of central vision while peripheral vision remains. Leading cause of vision loss in older adults.',
          relatedPeople: ['Dr. Mona Minkara']
        },
        {
          id: 'diabeticRetinopathy',
          name: 'Diabetic Retinopathy',
          description: 'Damage to the blood vessels in the retina caused by diabetes. Can cause blurry vision, dark spots, and eventually blindness if untreated.'
        },
        {
          id: 'astigmatism',
          name: 'Astigmatism',
          description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts.'
        },
        {
          id: 'nearSighted',
          name: 'Myopia (Near-Sightedness)',
          description: 'Difficulty seeing distant objects clearly while near objects appear normal. Caused by the eye being too long or the cornea being too curved.'
        },
        {
          id: 'farSighted',
          name: 'Hyperopia (Far-Sightedness)',
          description: 'Difficulty seeing near objects clearly while distant objects appear normal. Caused by the eye being too short or the cornea being too flat.'
        }
      ]
    },
    {
      id: 'retinal-disorders',
      name: 'Retinal Disorders',
      icon: <VisibilityIcon />,
      description: 'Conditions affecting the retina and its specialized cells',
      conditions: [
        {
          id: 'retinitisPigmentosa',
          name: 'Retinitis Pigmentosa',
          description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.',
          relatedPeople: ['Erik Weihenmayer']
        },
        {
          id: 'stargardt',
          name: 'Stargardt Disease',
          description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.',
          relatedPeople: ['Marla Runyan']
        },
        {
          id: 'retinalDetachment',
          name: 'Retinal Detachment',
          description: 'Separation of the retina from the underlying tissue. Can cause sudden flashes of light, floaters, and a curtain-like shadow over the visual field. Requires immediate medical attention.',
          relatedPeople: ['John Milton']
        }
      ]
    },
    {
      id: 'neurological',
      name: 'Neurological Conditions',
      icon: <PsychologyIcon />,
      description: 'Conditions affecting the brain and nervous system that impact vision',
      conditions: [
        {
          id: 'visualAura',
          name: 'Visual Aura',
          description: 'Temporary visual disturbances that can precede migraines. May include flashing lights, zigzag patterns, or blind spots. Usually lasts 20-60 minutes before the headache begins.'
        },
        {
          id: 'visualSnow',
          name: 'Visual Snow',
          description: 'A persistent visual disturbance where people see tiny, flickering dots across their entire visual field. Similar to the static noise on an old television. Can be constant or intermittent.'
        },
        {
          id: 'visualFloaters',
          name: 'Visual Floaters (Myodesopsia)',
          description: 'Shadows cast on the retina by debris floating in the vitreous humor. Includes cobweb/string floaters, dots/spots, ring floaters (Weiss Ring), and cloud/sheet floaters. Move with eye movement but lag behind, following fluid dynamics. Most visible against bright backgrounds, can interfere with reading and detailed tasks.'
        },
        {
          id: 'hallucinations',
          name: 'Visual Hallucinations',
          description: 'Seeing things that are not actually present. Can be simple (lights, shapes) or complex (people, animals). Associated with various neurological conditions and medications.'
        },
        {
          id: 'diplopia',
          name: 'Diplopia (Double Vision)',
          description: 'Seeing two images of a single object. Can be monocular (affecting one eye) or binocular (affecting both eyes). Usually caused by misalignment of the eyes or problems within the eye itself.'
        }
      ]
    },
    {
      id: 'trauma-infections',
      name: 'Trauma & Infections',
      icon: <MedicalServicesIcon />,
      description: 'Conditions caused by injury, infection, or other external factors',
      conditions: [
        {
          id: 'sympatheticOphthalmia',
          name: 'Sympathetic Ophthalmia',
          description: 'An autoimmune response that can occur after injury to one eye, causing inflammation in both eyes. Can lead to complete blindness if not treated promptly.',
          relatedPeople: ['Louis Braille']
        },
        {
          id: 'meningitis',
          name: 'Meningitis',
          description: 'Inflammation of the membranes surrounding the brain and spinal cord. Can cause vision loss, hearing loss, and other neurological complications.',
          relatedPeople: ['Helen Keller', 'Ved Mehta']
        },
        {
          id: 'chemicalBurns',
          name: 'Chemical Burns',
          description: 'Severe damage to the eyes caused by exposure to chemicals. Can result in complete blindness and requires immediate medical attention.',
          relatedPeople: ['Joshua Miele']
        },
        {
          id: 'retinopathyPrematurity',
          name: 'Retinopathy of Prematurity (ROP)',
          description: 'Abnormal blood vessel development in the retina of premature infants. Can cause retinal detachment and blindness if not treated.',
          relatedPeople: ['Stevie Wonder']
        },
        {
          id: 'neuromyelitisOptica',
          name: 'Neuromyelitis Optica (NMO)',
          description: 'Autoimmune disorder that attacks the optic nerves and spinal cord. Can cause severe vision loss and other neurological symptoms.',
          relatedPeople: ['Christine Ha']
        },
        {
          id: 'juvenileRetinoschisis',
          name: 'Juvenile Retinoschisis',
          description: 'Genetic condition causing splitting of retinal layers, leading to progressive vision loss. Usually begins in childhood.',
          relatedPeople: ['Erik Weihenmayer']
        },
        {
          id: 'incontinentiaPigmenti',
          name: 'Incontinentia Pigmenti',
          description: 'Rare genetic condition that can affect multiple body systems, including the eyes. Can cause vision loss from birth.',
          relatedPeople: ['Lucy Edwards']
        }
      ]
    }
  ];

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

  const handleCategoryChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleHomeClick = () => {
    navigate('/');
  };


  return (
    <Box className="conditions-glossary">
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Vision Conditions Glossary
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
          Comprehensive definitions and explanations of vision conditions, visual impairments, and related medical terms. 
          Learn about the conditions that affect the famous individuals featured in our simulator.
        </Typography>

        {/* Search and Filter Section */}
        <Box className="conditions-search-section">
          <Grid container spacing={2} sx={{ mb: 2 }}>
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
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
                    <ListItem className="condition-item">
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
      </Container>

      <Footer />
    </Box>
  );
};

export default ConditionsPage;
