import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

interface PersonData {
  name: string;
  condition: string;
  years: string;
  onset: string;
  simulation: string;
  description: string;
}

const personData: Record<string, PersonData> = {
  milton: {
    name: "John Milton",
    condition: "Bilateral Retinal Detachment & Secondary Glaucoma",
    years: "1608-1674",
    onset: "Age 36, complete blindness by 43",
    simulation: "glaucoma-halos progressive-loss",
    description: "Milton experienced progressive vision loss with temporal field defects, photophobia, and 'rainbow halos' around lights - classic symptoms of glaucoma with corneal edema. His condition progressed from partial to complete blindness over 7 years."
  },
  braille: {
    name: "Louis Braille",
    condition: "Sympathetic Ophthalmia",
    years: "1809-1852",
    onset: "Injury at age 3, blind by 5",
    simulation: "complete-blindness",
    description: "After injuring his right eye with an awl in his father's workshop, young Louis developed sympathetic ophthalmia - an autoimmune response that attacked both eyes, leading to complete bilateral blindness with no light perception."
  },
  galileo: {
    name: "Galileo Galilei",
    condition: "Acute Angle-Closure Glaucoma",
    years: "1564-1642",
    onset: "Age 68, complete blindness by 72",
    simulation: "acute-glaucoma-attacks",
    description: "Galileo suffered from acute angle-closure glaucoma attacks with sudden onset symptoms including intense rainbow halos, severe blurring, red eye effects, and extreme photophobia. Each attack caused cumulative damage leading to sectoral defects, arcuate scotomas, and eventual complete blindness."
  },
  ray: {
    name: "Ray Charles",
    condition: "Childhood Glaucoma",
    years: "1930-2004",
    onset: "Ages 4-5, blind by 7",
    simulation: "complete-blindness",
    description: "Ray Charles experienced progressive vision loss from glaucoma starting at age 4. The increased eye pressure gradually destroyed his optic nerves, leading to complete blindness by age 7. His right eye was later removed due to pain. He had no light perception in his remaining eye."
  },
  stevie: {
    name: "Stevie Wonder",
    condition: "Retinopathy of Prematurity (ROP)",
    years: "Born 1950",
    onset: "From birth (6 weeks premature)",
    simulation: "complete-blindness",
    description: "Born premature, Stevie received excess oxygen in his incubator which caused abnormal blood vessel growth in his retinas. This led to retinal detachment and complete blindness from infancy."
  },
  helen: {
    name: "Helen Keller",
    condition: "Bacterial Meningitis Complications",
    years: "1880-1968",
    onset: "19 months old",
    simulation: "complete-blindness",
    description: "A severe fever at 19 months, likely from bacterial meningitis, left Helen both blind and deaf. She had no light perception or visual input, relying entirely on touch and eventually learning to communicate through finger spelling."
  },
  bocelli: {
    name: "Andrea Bocelli",
    condition: "Congenital Glaucoma + Trauma",
    years: "Born 1958",
    onset: "Congenital, complete at 12",
    simulation: "complete-blindness",
    description: "Born with congenital glaucoma, Bocelli retained about 10% vision until a football accident at age 12 caused a brain hemorrhage, resulting in complete blindness with no light perception."
  },
  monet: {
    name: "Claude Monet",
    condition: "Cataracts",
    years: "1840-1926",
    onset: "Age 60s, legally blind by 82",
    simulation: "cataracts color-distortion",
    description: "Monet developed cataracts in his 60s, diagnosed in 1912. The cataracts clouded his vision and dramatically altered his color perception, making cool colors like blue and purple difficult to distinguish while accentuating warm tones. He described seeing 'through a fog' and by 1922 was legally blind in his right eye with only 10% vision in his left."
  },
  christine: {
    name: "Christine Ha",
    condition: "Neuromyelitis Optica (NMO)",
    years: "Born 1979",
    onset: "Age 20, progressive",
    simulation: "christine-nmo-complete",
    description: "NMO causes autoimmune attacks on the optic nerves. Christine describes her vision as looking through a 'steamy mirror after a hot shower' - severely blurred with only close-range object recognition within 10-12 inches. Vision is approximately 20/1000+ with extreme blur, light scatter, and fluctuating effects."
  },
  ved: {
    name: "Ved Mehta",
    condition: "Cerebrospinal Meningitis",
    years: "1934-2021",
    onset: "Age 3 years, 10 months",
    simulation: "ved-spatial-awareness",
    description: "Meningitis at age 3 resulted in complete bilateral blindness. Ved developed exceptional 'facial vision' using echolocation and air current perception for navigation."
  },
  erik: {
    name: "Erik Weihenmayer",
    condition: "Juvenile Retinoschisis",
    years: "Born 1968",
    onset: "Diagnosed at 4, blind by 13",
    simulation: "erik-retinoschisis-islands",
    description: "Retinoschisis causes splitting of retinal layers. Erik's vision deteriorated progressively, with isolated 'islands' of vision gradually disappearing until complete blindness at 13. He became the first blind person to summit Mount Everest."
  },
  marla: {
    name: "Marla Runyan",
    condition: "Stargardt Disease",
    years: "Born 1969",
    onset: "Age 9, progressive",
    simulation: "marla-stargardt-complete",
    description: "Stargardt disease causes progressive macular degeneration. Marla has a large central blind spot with preserved peripheral vision, making it difficult to see faces or read but allowing navigation using side vision. First legally blind athlete in Olympics."
  },
  mona: {
    name: "Dr. Mona Minkara",
    condition: "Macular Degeneration + Cone-Rod Dystrophy",
    years: "Born 1984",
    onset: "Early childhood, progressive",
    simulation: "minkara-end-stage-complete",
    description: "Blind chemist and computational biologist with combined macular degeneration and cone-rod dystrophy. Near-total vision loss affects both central and peripheral vision. Uses sonification and tactile models to conduct groundbreaking molecular dynamics research."
  },
  joshua: {
    name: "Joshua Miele",
    condition: "Chemical Burn Trauma",
    years: "Born 1972",
    onset: "Age 4, complete blindness",
    simulation: "joshua-complete-blindness",
    description: "Complete bilateral blindness from acid attack at age 4. No light perception due to severe corneal scarring and tissue destruction. Now a researcher developing tactile maps, accessible graphics, and sonification tools for blind users."
  },
  lucy: {
    name: "Lucy Edwards",
    condition: "Incontinentia Pigmenti",
    years: "Born 1995",
    onset: "From birth",
    simulation: "lucy-complete-vision",
    description: "Born with incontinentia pigmenti, Lucy has been blind from birth. Her vision is like looking through thick frosted glass with severe blur, desaturation, and light diffusion. She became a BBC presenter and advocate for disability representation in media."
  },
  paterson: {
    name: "David Paterson",
    condition: "Optic Nerve Damage & Glaucoma",
    years: "Born 1954",
    onset: "Age 3 months, progressive",
    simulation: "david-hemispheric-vision",
    description: "An ear infection at 3 months old spread to his optic nerve, causing blindness in his left eye. Glaucoma later affected his right eye, creating a unique hemispheric vision loss."
  }
};

const categories = [
  { name: "Historical Figures", people: ["milton", "braille", "galileo"] },
  { name: "Athletes & Scientists", people: ["erik", "marla", "mona", "joshua"] },
  { name: "Contemporary Figures", people: ["christine", "lucy", "paterson"] },
  { name: "Musicians & Artists", people: ["monet", "ray", "stevie", "bocelli"] },
  { name: "Writers & Activists", people: ["helen", "ved"] }
];

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<string[]>([]);

  useEffect(() => {
    filterPeople();
  }, [searchTerm, categoryFilter, conditionFilter]);

  const filterPeople = () => {
    let filtered = Object.keys(personData);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(personId => {
        const person = personData[personId];
        return person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               person.condition.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by category
    if (categoryFilter) {
      const category = categories.find(cat => cat.name === categoryFilter);
      if (category) {
        filtered = filtered.filter(personId => category.people.includes(personId));
      }
    }

    // Filter by condition
    if (conditionFilter) {
      filtered = filtered.filter(personId => {
        const person = personData[personId];
        return person.condition.toLowerCase().includes(conditionFilter.toLowerCase());
      });
    }

    setFilteredPeople(filtered);
  };

  const handlePersonClick = (personId: string) => {
    setSelectedPerson(personId);
  };

  const handleCloseDialog = () => {
    setSelectedPerson(null);
  };

  const handleExperienceSimulation = (personId: string) => {
    const person = personData[personId];
    // Map simulation types to actual condition IDs
    const simulationMap: Record<string, string[]> = {
      'glaucoma-halos progressive-loss': ['miltonGlaucomaHalos', 'miltonProgressiveVignetting', 'miltonScotomas', 'miltonRetinalDetachment', 'miltonPhotophobia', 'miltonTemporalFieldLoss'],
      'complete-blindness': ['completeBlindness'],
      'acute-glaucoma-attacks': ['galileoAcuteAttackMode', 'galileoChronicProgression'],
      'tunnel-vision glaucoma-halos': ['glaucoma', 'cataracts'],
      'progressive-loss tunnel-vision': ['glaucoma', 'monochromatic'],
      'nmo-blur': ['cataracts', 'astigmatism'],
      'peripheral-islands progressive-loss': ['retinitisPigmentosa', 'monochromatic'],
      'central-scotoma metamorphopsia': ['stargardt', 'amd'],
      'central-scotoma progressive-loss': ['stargardt', 'amd'],
      'cataracts color-distortion': ['monetCataractsProgression'],
      'ved-spatial-awareness': ['vedCompleteBlindness', 'vedSpatialAwareness', 'vedEchoLocation', 'vedAirFlowSensors', 'vedProximityRadar', 'vedTemperatureMapping'],
      'christine-nmo-complete': ['christineNMOComplete'],
      'lucy-complete-vision': ['lucyCompleteVision'],
      'david-hemispheric-vision': ['davidCompleteVision'],
      'erik-retinoschisis-islands': ['erikRetinoschisisIslands', 'erikIslandFragmentation', 'erikProgressiveLoss', 'erikScanningBehavior', 'erikCognitiveLoad'],
      'marla-stargardt-complete': ['marlaStargardtComplete'],
      'minkara-end-stage-complete': ['minkaraEndStageComplete', 'minkaraCentralScotoma', 'minkaraRingScotoma', 'minkaraPeripheralIslands', 'minkaraPhotophobia', 'minkaraAchromatopsia', 'minkaraNightBlindness'],
      'joshua-complete-blindness': ['joshuaCompleteBlindness', 'joshuaEcholocation', 'joshuaTactileMaps', 'joshuaAudioLandscape', 'joshuaAccessibilityMode', 'joshuaSonification']
    };
    
    const conditions = simulationMap[person.simulation] || ['glaucoma'];
    
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

  const getPersonImage = (personId: string) => {
    // Map person IDs to actual image files
    const imageMap: Record<string, string> = {
      milton: '/images/people/john-milton.jpg',
      braille: '/images/people/louis-Braille.jpg',
      galileo: '/images/people/Galileo-Galilei.jpg',
      ray: '/images/people/ray-charles.jpg',
      stevie: '/images/people/stevie-wonder.jpg',
      helen: '/images/people/hellen-keller.jpg',
      bocelli: '/images/people/Andrea-Bocelli.jpg',
      monet: '/images/people/claude-monet.jpg',
      christine: '/images/people/christine-ha.webp',
      ved: '/images/people/Ved-Mehta.png',
      erik: '/images/people/Erik-Weihenmayer.webp',
      marla: '/images/people/Marla-Runyan.webp',
      mona: '/images/people/Mona-Minkara.webp',
      joshua: '/images/people/Joshua-Miele.webp',
      lucy: '/images/people/Lucy-Edwards.webp',
      paterson: '/images/people/David-Paterson.webp'
    };
    
    return imageMap[personId] || `https://via.placeholder.com/300x400/cccccc/666666?text=${personData[personId]?.name || 'Image'}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Visual Impairment Simulator
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3, color: 'text.secondary' }}>
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
          Explore the lives and visual experiences of famous blind and visually impaired individuals throughout history, from historical figures to contemporary icons.
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
                  <MenuItem value="Glaucoma">Glaucoma</MenuItem>
                  <MenuItem value="Complete Blindness">Complete Blindness</MenuItem>
                  <MenuItem value="Macular">Macular</MenuItem>
                  <MenuItem value="Trauma">Trauma</MenuItem>
                  <MenuItem value="Meningitis">Meningitis</MenuItem>
                  <MenuItem value="Prematurity">Prematurity</MenuItem>
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
              <Grid container spacing={3}>
                {categoryPeople.map(personId => {
                  const person = personData[personId];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={personId}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}
                        onClick={() => handlePersonClick(personId)}
                      >
                        <CardMedia
                          component="img"
                          height="300"
                          image={getPersonImage(personId)}
                          alt={person.name}
                        />
                        <CardContent>
                          <Typography variant="h6" component="h4" gutterBottom>
                            {person.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {person.condition}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {person.years}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
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
      <Dialog 
        open={!!selectedPerson} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPerson && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{personData[selectedPerson].name}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <img 
                    src={getPersonImage(selectedPerson)} 
                    alt={personData[selectedPerson].name}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    {personData[selectedPerson].condition}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Years:</strong> {personData[selectedPerson].years}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Onset:</strong> {personData[selectedPerson].onset}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {personData[selectedPerson].description}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Simulation Type
                    </Typography>
                    <Chip 
                      label={personData[selectedPerson].simulation} 
                      variant="outlined" 
                      color="primary"
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleExperienceSimulation(selectedPerson);
                  handleCloseDialog();
                }}
              >
                Experience Simulation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </Box>
  );
};

export default FamousBlindPeople; 