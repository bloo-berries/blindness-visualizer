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
    'mila': 'center 20%',
    'georgia': 'center 20%',
    'bocelli': 'center 60%',
    'moon': 'center 25%',
    'borges': 'center 20%',
    'art': 'center 20%',
    'doc': 'center 30%',
    'lex': 'center 20%',
    'fanny': 'center 20%',
    'saunderson': 'center 30%',
    'holman': 'center 20%',
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
    'wallyKarew': 'center 60%',
    'mohammad': 'center 20%',
    'chirrutImwe': 'center 20%',
    'maryIngalls': 'center 30%',
    'francisCampbell': 'center 30%',
    'anthonyClarke': 'center 30%',
    'amyBower': 'center 30%',
    'crazzySteve': 'center 30%',
    'floydMorris': 'center 30%',
    'belaTheBlind': 'center 30%',
    'blindLemonJefferson': 'center 20%',
    'charlottaSeuerling': 'center 30%',
    'levPontryagin': 'center 30%',
    'garyODonoghue': 'center 30%',
    'francescoLandini': 'center 30%',
    'garretBarry': 'center 30%',
    'gurrumulYunupingu': 'center 30%',
    'geraldineLawhorn': 'center 30%',
    'fujitora': 'center top',
    'murphyMason': 'center 20%',
    'davidBrown': 'center 20%',
    'lucy': 'center 20%',
    'ross': 'center 20%',
    'marilee': 'center 20%',
    'trischa': 'center 20%',
    'gustafDalen': 'center 20%',
    'euler': 'center 20%',
    'ray': 'center 20%',
    'monet': 'center 20%',
    'jeff': 'center 20%',
    'ronnie': 'center 20%',
    'rahsaan': 'center 20%',
    'johnBramblitt': 'center 20%',
    'joaquinRodrigo': 'center 20%',
    'thurber': 'center 20%',
    'henryFawcett': 'center 20%',
    'wanda': 'center 20%',
    'fredRogers': 'center 20%',
    'billGates': 'center 20%',
    'johnKay': 'center 20%',
    'jonnyGreenwood': 'center 20%'
  };
  
  return positionMap[personId] || 'center center';
};

export const PersonCard: React.FC<PersonCardProps> = ({ personId, person, onClick }) => {
  return (
    <Grid item xs={3} sm={2} md={2} lg={2} xl={2}>
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
          height="100"
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
        <CardContent sx={{ p: 0.75, pt: 0.5, pb: 0.5 }}>
          <Typography variant="subtitle2" component="h4" sx={{ fontSize: '0.75rem', lineHeight: 1.1, mb: 0.25 }}>
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1.1, display: 'block' }}>
            {person.condition}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

