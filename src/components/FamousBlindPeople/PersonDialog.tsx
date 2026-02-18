import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, ArrowBack, ArrowForward } from '@mui/icons-material';
import { PersonData } from '../../data/famousPeople';
import { getPersonImagePath } from '../../utils/imagePaths';
import { parseDescriptionWithLinks } from '../../utils/famousPeopleUtils';
import { EmbeddedVisualization } from './EmbeddedVisualization';

interface PersonDialogProps {
  open: boolean;
  personId: string | null;
  person: PersonData | null;
  filteredPeople: string[];
  onClose: () => void;
  onExperienceSimulation: () => void;
  onNavigate: (personId: string) => void;
}

export const PersonDialog: React.FC<PersonDialogProps> = ({
  open,
  personId,
  person,
  filteredPeople,
  onClose,
  onExperienceSimulation,
  onNavigate
}) => {
  // Get current index in filtered list
  const currentIndex = personId ? filteredPeople.indexOf(personId) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredPeople.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    if (!open || !personId || currentIndex === -1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrevious) {
        event.preventDefault();
        const previousPersonId = filteredPeople[currentIndex - 1];
        onNavigate(previousPersonId);
      } else if (event.key === 'ArrowRight' && hasNext) {
        event.preventDefault();
        const nextPersonId = filteredPeople[currentIndex + 1];
        onNavigate(nextPersonId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentIndex, filteredPeople, hasPrevious, hasNext, onNavigate, personId]);

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
              <strong>Onset:</strong> {person.onset}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {parseDescriptionWithLinks(person.description, personId)}
            </Typography>
            
            {/* Embedded visualization preview */}
            <EmbeddedVisualization
              personId={personId}
              simulation={person.simulation}
              personName={person.name}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {hasPrevious && (
            <IconButton
              onClick={() => onNavigate(filteredPeople[currentIndex - 1])}
              aria-label="Previous person"
              sx={{ mr: 'auto' }}
            >
              <ArrowBack />
            </IconButton>
          )}
          {hasNext && (
            <IconButton
              onClick={() => onNavigate(filteredPeople[currentIndex + 1])}
              aria-label="Next person"
              sx={{ ml: hasPrevious ? 0 : 'auto' }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>Close</Button>
          <Button 
            variant="contained" 
            onClick={onExperienceSimulation}
          >
            Experience Simulation
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

