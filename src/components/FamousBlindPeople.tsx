import React, { useState, useEffect, useCallback } from 'react';
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
    description: "Milton experienced progressive vision loss with temporal field defects, photophobia, and 'rainbow halos' around lights - classic symptoms of glaucoma with corneal edema. His condition progressed from partial to complete blindness over 7 years. Learn more at en.wikipedia.org."
  },
  braille: {
    name: "Louis Braille",
    condition: "Sympathetic Ophthalmia",
    years: "1809-1852",
    onset: "Injury at age 3, blind by 5",
    simulation: "complete-blindness",
    description: "After injuring his right eye with an awl in his father's workshop, young Louis developed sympathetic ophthalmia - an autoimmune response that attacked both eyes, leading to complete bilateral blindness with no light perception. Learn more at en.wikipedia.org."
  },
  galileo: {
    name: "Galileo Galilei",
    condition: "Acute Angle-Closure Glaucoma",
    years: "1564-1642",
    onset: "Age 68, complete blindness by 72",
    simulation: "acute-glaucoma-attacks",
    description: "Galileo suffered from acute angle-closure glaucoma attacks with sudden onset symptoms including intense rainbow halos, severe blurring, red eye effects, and extreme photophobia. Each attack caused cumulative damage leading to sectoral defects, arcuate scotomas, and eventual complete blindness. Learn more at en.wikipedia.org."
  },
  ray: {
    name: "Ray Charles",
    condition: "Childhood Glaucoma",
    years: "1930-2004",
    onset: "Ages 4-5, blind by 7",
    simulation: "complete-blindness",
    description: "Ray Charles experienced progressive vision loss from glaucoma starting at age 4. The increased eye pressure gradually destroyed his optic nerves, leading to complete blindness by age 7. His right eye was later removed due to pain. He had no light perception in his remaining eye. Visit raycharles.com for more information."
  },
  stevie: {
    name: "Stevie Wonder",
    condition: "Retinopathy of Prematurity (ROP)",
    years: "Born 1950",
    onset: "From birth (6 weeks premature)",
    simulation: "complete-blindness",
    description: "Born premature, Stevie received excess oxygen in his incubator which caused abnormal blood vessel growth in his retinas. This led to retinal detachment and complete blindness from infancy. Visit steviewonder.net for more information."
  },
  helen: {
    name: "Helen Keller",
    condition: "Bacterial Meningitis Complications",
    years: "1880-1968",
    onset: "19 months old",
    simulation: "complete-blindness",
    description: "A severe fever at 19 months, likely from bacterial meningitis, left Helen both blind and deaf. She had no light perception or visual input, relying entirely on touch and eventually learning to communicate through finger spelling. Learn more at womenshistory.org."
  },
  bocelli: {
    name: "Andrea Bocelli",
    condition: "Congenital Glaucoma + Trauma",
    years: "Born 1958",
    onset: "Congenital, complete at 12",
    simulation: "complete-blindness",
    description: "Born with congenital glaucoma, Bocelli retained about 10% vision until a football accident at age 12 caused a brain hemorrhage, resulting in complete blindness with no light perception. Visit andreabocelli.com for more information."
  },
  monet: {
    name: "Claude Monet",
    condition: "Cataracts",
    years: "1840-1926",
    onset: "Age 60s, legally blind by 82",
    simulation: "cataracts color-distortion",
    description: "Monet developed cataracts in his 60s, diagnosed in 1912. The cataracts clouded his vision and dramatically altered his color perception, making cool colors like blue and purple difficult to distinguish while accentuating warm tones. He described seeing 'through a fog' and by 1922 was legally blind in his right eye with only 10% vision in his left. Learn more at en.wikipedia.org."
  },
  christine: {
    name: "Christine Ha",
    condition: "Neuromyelitis Optica (NMO)",
    years: "Born 1979",
    onset: "Age 20, progressive",
    simulation: "christine-nmo-complete",
    description: "NMO causes autoimmune attacks on the optic nerves. Christine describes her vision as looking through a 'steamy mirror after a hot shower' - severely blurred with only close-range object recognition within 10-12 inches. Vision is approximately 20/1000+ with extreme blur, light scatter, and fluctuating effects. She won MasterChef season 3 and runs The Blind Cook (theblindcook.com)."
  },
  ved: {
    name: "Ved Mehta",
    condition: "Cerebrospinal Meningitis",
    years: "1934-2021",
    onset: "Age 3 years, 10 months",
    simulation: "ved-spatial-awareness",
    description: "Meningitis at age 3 resulted in complete bilateral blindness. Ved developed exceptional 'facial vision' using echolocation and air current perception for navigation. Read more at newyorker.com."
  },
  erik: {
    name: "Erik Weihenmayer",
    condition: "Juvenile Retinoschisis",
    years: "Born 1968",
    onset: "Diagnosed at 4, blind by 13",
    simulation: "erik-retinoschisis-islands",
    description: "Retinoschisis causes splitting of retinal layers. Erik's vision deteriorated progressively, with isolated 'islands' of vision gradually disappearing until complete blindness at 13. He became the first blind person to summit Mount Everest. Discover more at erikweihenmayer.com."
  },
  marla: {
    name: "Marla Runyan",
    condition: "Stargardt Disease",
    years: "Born 1969",
    onset: "Age 9, progressive",
    simulation: "marla-stargardt-complete",
    description: "Stargardt disease causes progressive macular degeneration. Marla has a large central blind spot with preserved peripheral vision, making it difficult to see faces or read but allowing navigation using side vision. First legally blind athlete in Olympics. Learn more at teamusa.com."
  },
  mona: {
    name: "Dr. Mona Minkara",
    condition: "Macular Degeneration + Cone-Rod Dystrophy",
    years: "Born 1984",
    onset: "Early childhood, progressive",
    simulation: "minkara-end-stage-complete",
    description: "Blind chemist and computational biologist with combined macular degeneration and cone-rod dystrophy. Near-total vision loss affects both central and peripheral vision. Uses sonification and tactile models to conduct groundbreaking molecular dynamics research. Learn more at monaminkara.com."
  },
  joshua: {
    name: "Joshua Miele",
    condition: "Chemical Burn Trauma",
    years: "Born 1972",
    onset: "Age 4, complete blindness",
    simulation: "joshua-complete-blindness",
    description: "Complete bilateral blindness from acid attack at age 4. No light perception due to severe corneal scarring and tissue destruction. Now a researcher developing tactile maps, accessible graphics, and sonification tools for blind users. Read his inspiring story at nytimes.com."
  },
  lucy: {
    name: "Lucy Edwards",
    condition: "Incontinentia Pigmenti",
    years: "Born 1995",
    onset: "From birth",
    simulation: "lucy-complete-vision",
    description: "Born with incontinentia pigmenti, Lucy has been blind from birth. Her vision is like looking through thick frosted glass with severe blur, desaturation, and light diffusion. She became a BBC presenter and advocate for disability representation in media. Visit her website at lucyedwards.com."
  },
  paterson: {
    name: "David Paterson",
    condition: "Optic Nerve Damage & Glaucoma",
    years: "Born 1954",
    onset: "Age 3 months, progressive",
    simulation: "david-hemispheric-vision",
    description: "An ear infection at 3 months old spread to his optic nerve, causing blindness in his left eye. Glaucoma later affected his right eye, creating a unique hemispheric vision loss. He became the 55th Governor of New York and continues his advocacy work. Learn more at governordavidpaterson.com."
  },
  paul: {
    name: "Paul Castle",
    condition: "Retinitis Pigmentosa",
    years: "Born 1980",
    onset: "Age 12, progressive",
    simulation: "paul-retinitis-pigmentosa",
    description: "Paul Castle has lost over 95% of his vision to the untreatable eye disease, Retinitis Pigmentosa. Despite this challenge, he uses adaptive tools to create his art and runs Paul Castle Studio (paulcastlestudio.com), where he creates children's books, art prints, and plushies featuring his beloved characters like Pringle & Finn. His work promotes love, inclusion, and overcoming obstacles."
  },
  harriet: {
    name: "Harriet Tubman",
    condition: "Traumatic Brain Injury",
    years: "1822-1913",
    onset: "Age 12, from head trauma",
    simulation: "harriet-tunnel-vision",
    description: "Harriet Tubman suffered a severe head injury at age 12 when an overseer threw a heavy metal weight at another slave, hitting her instead. This caused a traumatic brain injury that resulted in narcolepsy and vision problems including tunnel vision and episodes of unconsciousness. Despite these challenges, she became a legendary conductor of the Underground Railroad, leading hundreds of enslaved people to freedom. Learn more at en.wikipedia.org."
  },
  casey: {
    name: "Casey Harris",
    condition: "Retinitis Pigmentosa",
    years: "Born 1989",
    onset: "Age 5, progressive",
    simulation: "casey-retinitis-pigmentosa",
    description: "Casey Harris is the keyboardist for the band X Ambassadors and has been living with retinitis pigmentosa since childhood. Despite his visual impairment, he has become a successful musician and advocate for disability representation in the music industry. His story inspires many to pursue their dreams regardless of physical limitations. Learn more at disabilitytalent.org."
  },
  haben: {
    name: "Haben Girma",
    condition: "Deafblind",
    years: "Born 1988",
    onset: "From birth",
    simulation: "haben-deafblind",
    description: "Haben Girma is a disability rights advocate, lawyer, and the first deafblind person to graduate from Harvard Law School. She uses tactile sign language and assistive technology to communicate and has dedicated her life to advocating for equal access and inclusion for people with disabilities. Visit her website at habengirma.com."
  },
  molly: {
    name: "Molly Burke",
    condition: "Retinitis Pigmentosa",
    years: "Born 1994",
    onset: "Age 4, complete blindness by 14",
    simulation: "molly-retinitis-pigmentosa",
    description: "Molly Burke is a motivational speaker, YouTuber, and disability advocate who lost her vision to retinitis pigmentosa. She uses her platform to educate others about blindness and advocate for accessibility and inclusion. Her positive message and advocacy work have inspired millions around the world. Visit her website at mollyburkeofficial.com."
  },
  tilly: {
    name: "Tilly Aston",
    condition: "Congenital Blindness",
    years: "1873-1947",
    onset: "From birth",
    simulation: "tilly-complete-blindness",
    description: "Tilly Aston was an Australian writer, teacher, and advocate for the blind. She was the first blind person in Australia to attend university and became a prominent advocate for education and employment opportunities for people with visual impairments. Her work helped establish services for the blind in Australia. Learn more at en.wikipedia.org."
  },
  sabriye: {
    name: "Sabriye Tenberken",
    condition: "Retinitis Pigmentosa",
    years: "Born 1970",
    onset: "Childhood, complete blindness by 12",
    simulation: "sabriye-complete-blindness",
    description: "Sabriye Tenberken is a German tibetologist and co-founder of Braille Without Borders. She developed Tibetan Braille and established schools for blind children in Tibet. Despite losing her sight to retinitis pigmentosa, she has dedicated her life to education and empowerment of people with disabilities worldwide. Learn more at en.wikipedia.org."
  },
  anastasia: {
    name: "Anastasia Pagonis",
    condition: "Stargardt Disease",
    years: "Born 2004",
    onset: "Age 11, progressive",
    simulation: "anastasia-stargardt",
    description: "Anastasia Pagonis is a Paralympic swimmer who has Stargardt disease, a form of juvenile macular degeneration. Despite her visual impairment, she has become a world-class athlete, winning multiple Paralympic medals and setting world records. She is an inspiration to young athletes with disabilities. Learn more at teamusa.com."
  }
};

const categories = [
  { name: "Historical Figures", people: ["milton", "braille", "galileo", "harriet"] },
  { name: "Athletes & Scientists", people: ["erik", "marla", "mona", "joshua", "anastasia"] },
  { name: "Contemporary Figures", people: ["christine", "lucy", "paterson", "paul", "casey", "haben", "molly"] },
  { name: "Musicians & Artists", people: ["monet", "ray", "stevie", "bocelli"] },
  { name: "Writers & Activists", people: ["helen", "ved", "tilly", "sabriye"] }
];

const FamousBlindPeople: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<string[]>([]);

  const filterPeople = useCallback(() => {
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
  }, [searchTerm, categoryFilter, conditionFilter]);

  useEffect(() => {
    filterPeople();
  }, [filterPeople]);

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
      'glaucoma-halos progressive-loss': ['johnMiltonBlindness', 'miltonGlaucomaHalos'],
      'complete-blindness': ['helenKellerBlindness', 'louisBrailleBlindness', 'rayCharlesBlindness', 'stevieWonderROP', 'andreaBocelliBlindness'],
      'acute-glaucoma-attacks': ['galileoAcuteAttackMode', 'galileoChronicProgression'],
      'tunnel-vision glaucoma-halos': ['glaucoma', 'cataracts'],
      'progressive-loss tunnel-vision': ['glaucoma', 'monochromatic'],
      'nmo-blur': ['cataracts', 'astigmatism'],
      'peripheral-islands progressive-loss': ['retinitisPigmentosa', 'monochromatic'],
      'central-scotoma metamorphopsia': ['stargardt', 'amd'],
      'central-scotoma progressive-loss': ['stargardt', 'amd'],
      'cataracts color-distortion': ['monetCataractsProgression'],
      'ved-spatial-awareness': ['vedMehtaBlindness'],
      'christine-nmo-complete': ['christineNMOComplete'],
      'lucy-complete-vision': ['lucyCompleteVision'],
      'david-hemispheric-vision': ['davidPatersonBlindness'],
      'erik-retinoschisis-islands': ['erikWeihenmayerRetinoschisis'],
      'marla-stargardt-complete': ['marlaRunyanStargardt'],
      'minkara-end-stage-complete': ['minkaraEndStageComplete'],
      'joshua-complete-blindness': ['joshuaMieleBlindness'],
      'paul-retinitis-pigmentosa': ['retinitisPigmentosa']
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
    // Map person IDs to actual image files (using process.env.PUBLIC_URL for proper path resolution)
    const baseUrl = process.env.PUBLIC_URL || '';
    const imageMap: Record<string, string> = {
      milton: `${baseUrl}/images/people/john-milton.jpg`,
      braille: `${baseUrl}/images/people/louis-Braille.jpg`,
      galileo: `${baseUrl}/images/people/Galileo-Galilei.jpg`,
      ray: `${baseUrl}/images/people/ray-charles.jpg`,
      stevie: `${baseUrl}/images/people/stevie-wonder.jpg`,
      helen: `${baseUrl}/images/people/hellen-keller.jpg`,
      bocelli: `${baseUrl}/images/people/Andrea-Bocelli.jpg`,
      monet: `${baseUrl}/images/people/claude-monet.jpg`,
      christine: `${baseUrl}/images/people/christine-ha.webp`,
      ved: `${baseUrl}/images/people/Ved-Mehta.png`,
      erik: `${baseUrl}/images/people/Erik-Weihenmayer.webp`,
      marla: `${baseUrl}/images/people/Marla-Runyan.webp`,
      mona: `${baseUrl}/images/people/Mona-Minkara.webp`,
      joshua: `${baseUrl}/images/people/Joshua-Miele.webp`,
      lucy: `${baseUrl}/images/people/Lucy-Edwards.webp`,
      paterson: `${baseUrl}/images/people/David-Paterson.webp`,
      paul: `${baseUrl}/images/people/paul-castle.png`,
      harriet: `${baseUrl}/images/people/harriet-tubman.png`,
      casey: `${baseUrl}/images/people/casey-harris.png`,
      haben: `${baseUrl}/images/people/haben-girma.png`,
      molly: `${baseUrl}/images/people/molly-burke.png`,
      tilly: `${baseUrl}/images/people/tilly-aston.png`,
      sabriye: `${baseUrl}/images/people/Sabriye-Tenberken.png`,
      anastasia: `${baseUrl}/images/people/Anastasia-Pagonis.png`
    };
    
    const imagePath = imageMap[personId] || `https://via.placeholder.com/300x400/cccccc/666666?text=${personData[personId]?.name || 'Image'}`;
    console.log(`Loading image for ${personId}: ${imagePath} (baseUrl: ${baseUrl})`);
    return imagePath;
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
                          sx={{
                            objectPosition: personId === 'harriet' ? 'center top' :
                                          personId === 'tilly' ? 'center top' :
                                          personId === 'helen' ? 'center top' :
                                          personId === 'stevie' ? 'center top' :
                                          personId === 'paterson' ? 'center top' :
                                          personId === 'galileo' ? 'center top' :
                                          personId === 'ved' ? 'center top' :
                                          'center center'
                          }}
                          onError={(e) => {
                            console.error(`Failed to load image for ${person.name}:`, e);
                            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=${person.name}`;
                          }}
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
                    onError={(e) => {
                      console.error(`Failed to load dialog image for ${personData[selectedPerson].name}:`, e);
                      e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=${personData[selectedPerson].name}`;
                    }}
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
                    {(() => {
                      const description = personData[selectedPerson].description;
                      const websiteMap: Record<string, string> = {
                        'paulcastlestudio.com': 'https://paulcastlestudio.com',
                        'theblindcook.com': 'https://www.theblindcook.com/',
                        'lucyedwards.com': 'https://www.lucyedwards.com/',
                        'governordavidpaterson.com': 'https://governordavidpaterson.com/',
                        'nytimes.com': 'https://www.nytimes.com/2013/03/03/nyregion/40-years-after-an-acid-attack-a-life-well-lived.html',
                        'monaminkara.com': 'https://monaminkara.com/',
                        'erikweihenmayer.com': 'https://erikweihenmayer.com/',
                        'teamusa.com': selectedPerson === 'marla' ? 'https://www.teamusa.com/profiles/marla-runyan' :
                                     selectedPerson === 'anastasia' ? 'https://www.teamusa.com/profiles/anastasia-pagonis-1136100' :
                                     'https://www.teamusa.com/profiles/marla-runyan',
                        'womenshistory.org': 'https://www.womenshistory.org/education-resources/biographies/helen-keller',
                        'andreabocelli.com': 'https://www.andreabocelli.com/',
                        'en.wikipedia.org': selectedPerson === 'monet' ? 'https://en.wikipedia.org/wiki/Claude_Monet' : 
                                          selectedPerson === 'braille' ? 'https://en.wikipedia.org/wiki/Louis_Braille' :
                                          selectedPerson === 'milton' ? 'https://en.wikipedia.org/wiki/John_Milton' :
                                          selectedPerson === 'galileo' ? 'https://en.wikipedia.org/wiki/Galileo_Galilei' :
                                          selectedPerson === 'tilly' ? 'https://en.wikipedia.org/wiki/Tilly_Aston' :
                                          selectedPerson === 'sabriye' ? 'https://en.wikipedia.org/wiki/Sabriye_Tenberken' :
                                          selectedPerson === 'harriet' ? 'https://en.wikipedia.org/wiki/Harriet_Tubman' :
                                          'https://en.wikipedia.org/wiki/Claude_Monet',
                        'steviewonder.net': 'https://www.steviewonder.net/',
                        'raycharles.com': 'https://raycharles.com/',
                        'newyorker.com': 'https://www.newyorker.com/culture/postscript/ved-mehta-1934-2021',
                        'disabilitytalent.org': 'https://www.disabilitytalent.org/single-post/2018/10/01/a-vision-for-the-future-an-interview-with-casey-harris-of-x-ambassadors',
                        'habengirma.com': 'https://habengirma.com/',
                        'mollyburkeofficial.com': 'https://www.mollyburkeofficial.com/'
                      };
                      
                      // Create a regex pattern to match domains in the text
                      const domainPattern = Object.keys(websiteMap)
                        .map(domain => domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                        .join('|');
                      
                      const regex = new RegExp(`\\b(${domainPattern})\\b`, 'g');
                      
                      return description.split(regex).map((part, index) => {
                        if (websiteMap[part]) {
                          return (
                            <a 
                              key={index}
                              href={websiteMap[part]} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#1976d2', textDecoration: 'underline' }}
                            >
                              {part}
                            </a>
                          );
                        }
                        return part;
                      });
                    })()}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom className="simulation-type-label">
                      Simulation Type
                    </Typography>
                    <Chip 
                      label={personData[selectedPerson].simulation} 
                      variant="outlined" 
                      color="primary"
                      className="simulation-type-chip"
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