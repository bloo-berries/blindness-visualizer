import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PersonData } from '../../data/famousPeopleData';
import { getPersonImagePath } from '../../utils/imagePaths';
import { parseDescriptionWithLinks } from '../../utils/famousPeopleUtils';

interface PersonDialogProps {
  open: boolean;
  personId: string | null;
  person: PersonData | null;
  onClose: () => void;
  onExperienceSimulation: () => void;
}

export const PersonDialog: React.FC<PersonDialogProps> = ({
  open,
  personId,
  person,
  onClose,
  onExperienceSimulation
}) => {
  if (!person || !personId) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{person.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img 
              src={getPersonImagePath(personId)} 
              alt={person.name}
              style={{ width: '100%', borderRadius: '8px' }}
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/300x400/cccccc/666666?text=${person.name}`;
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {person.condition}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Years:</strong> {person.years}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Onset:</strong> {person.onset}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {parseDescriptionWithLinks(person.description, personId)}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom className="simulation-type-label">
                Simulation Type
              </Typography>
              <Chip 
                label={person.simulation} 
                variant="outlined" 
                color="primary"
                className="simulation-type-chip"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={onExperienceSimulation}
        >
          Experience Simulation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

