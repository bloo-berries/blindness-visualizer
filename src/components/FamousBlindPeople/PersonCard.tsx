import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { PersonData } from '../../data/famousPeopleData';
import { getPersonImagePath } from '../../utils/imagePaths';

interface PersonCardProps {
  personId: string;
  person: PersonData;
  onClick: () => void;
}

const getObjectPosition = (personId: string): string => {
  const positionMap: Record<string, string> = {
    'harriet': 'center 20%',
    'tilly': 'center top',
    'helen': 'center top',
    'stevie': 'center top',
    'paterson': 'center top',
    'galileo': 'center top',
    'ved': 'center top',
    'mila': 'center 30%',
    'georgia': 'center 30%',
    'bocelli': 'center 60%',
    'moon': 'center 25%',
    'borges': 'center 30%',
    'art': 'center 30%',
    'doc': 'center 30%',
    'lex': 'center 30%',
    'fanny': 'center 30%',
    'saunderson': 'center 30%',
    'holman': 'center 30%',
    'diane': 'center 30%',
    'geordi': 'center 20%',
    'odin': 'center 20%',
    'daredevil': 'center 20%',
    'blindspot': 'center 20%',
    'kenshi': 'center 20%',
    'neo': 'center 20%',
    'eli': 'center 20%',
    'blinkin': 'center 20%',
    'juliaCarpenter': 'center 20%',
    'mrMagoo': 'center 20%',
    'doctorMidNite': 'center 20%',
    'wallyKarew': 'center 50%',
    'mohammad': 'center 20%',
    'chirrutImwe': 'center 20%',
    'maryIngalls': 'center 30%',
    'francisCampbell': 'center 30%',
    'anthonyClarke': 'center 30%',
    'amyBower': 'center 30%',
    'crazzySteve': 'center 30%',
    'floydMorris': 'center 30%',
    'belaTheBlind': 'center 30%',
    'blindLemonJefferson': 'center 30%',
    'charlottaSeuerling': 'center 30%',
    'levPontryagin': 'center 30%',
    'garyODonoghue': 'center 30%',
    'francescoLandini': 'center 30%',
    'garretBarry': 'center 30%',
    'gurrumulYunupingu': 'center 30%',
    'geraldineLawhorn': 'center 30%',
    'fujitora': 'center top',
    'murphyMason': 'center center'
  };
  
  return positionMap[personId] || 'center center';
};

export const PersonCard: React.FC<PersonCardProps> = ({ personId, person, onClick }) => {
  return (
    <Grid item xs={6} sm={4} md={3} lg={2} xl={2}>
      <Card 
        sx={{ 
          height: '100%', 
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
        onClick={onClick}
      >
        <CardMedia
          component="img"
          height="140"
          image={getPersonImagePath(personId)}
          alt={person.name}
          loading="lazy"
          decoding="async"
          sx={{
            objectPosition: getObjectPosition(personId)
          }}
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=${person.name}`;
          }}
        />
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" component="h4" gutterBottom sx={{ fontSize: '0.9rem', lineHeight: 1.2 }}>
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2, display: 'block', mb: 0.5 }}>
            {person.condition}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

