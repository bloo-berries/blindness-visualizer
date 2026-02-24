import React, { useEffect, useRef, useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Snackbar
} from '@mui/material';
import { Close as CloseIcon, ArrowBack, ArrowForward, OpenInNew as OpenInNewIcon, FiberManualRecord, Share as ShareIcon } from '@mui/icons-material';
import { PersonData } from '../../data/famousPeople';
import { getPersonImagePath } from '../../utils/imagePaths';
import { parseDescriptionWithLinks } from '../../utils/famousPeopleUtils';
import { EmbeddedVisualization } from './EmbeddedVisualization';

/**
 * Formats description text by separating bullet points into a list
 * Returns { mainText: string, bulletPoints: string[] }
 */
const formatDescription = (description: string): { mainText: string; bulletPoints: string[] } => {
  // Try splitting by newlines + bullet first (common format in data)
  if (description.includes('\n\n•') || description.includes('\n•')) {
    // Split by newline + bullet patterns
    const parts = description.split(/\n+•\s*/);

    if (parts.length > 1) {
      const mainText = parts[0].trim();
      const bulletPoints = parts.slice(1).map(point => point.trim()).filter(point => point.length > 0);
      return { mainText, bulletPoints };
    }
  }

  // Fallback: split by inline bullet pattern " • "
  const parts = description.split(' • ');

  if (parts.length <= 1) {
    // No bullet points found, return as-is
    return { mainText: description, bulletPoints: [] };
  }

  // First part is the main text
  const mainText = parts[0].trim();

  // Rest are bullet points
  const bulletPoints = parts.slice(1).map(point => point.trim()).filter(point => point.length > 0);

  return { mainText, bulletPoints };
};

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
  // Ref for scrolling dialog content to top
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // State for share notification
  const [shareNotification, setShareNotification] = useState<string | null>(null);

  // Generate shareable URL for this person
  const getShareableUrl = (): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?person=${personId}`;
  };

  // Handle share button click
  const handleShare = async () => {
    const shareUrl = getShareableUrl();

    // Try native share API first (mobile devices)
    if (navigator.share && person) {
      try {
        await navigator.share({
          title: `${person.name} - Vision Condition`,
          text: `Learn about ${person.name}'s vision condition: ${person.condition}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        if ((err as Error).name === 'AbortError') {
          return; // User cancelled, don't fall back to clipboard
        }
      }
    }

    // Fall back to clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareNotification('Link copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareNotification('Link copied to clipboard!');
    }
  };

  // Get current index in filtered list
  const currentIndex = personId ? filteredPeople.indexOf(personId) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredPeople.length - 1;

  // Scroll to top when person changes
  useEffect(() => {
    if (personId && dialogContentRef.current) {
      dialogContentRef.current.scrollTop = 0;
    }
  }, [personId]);

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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Share this profile">
              <IconButton onClick={handleShare} aria-label="Share profile">
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} aria-label="Close dialog">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent ref={dialogContentRef}>
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
            {person.achievement && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                {person.achievement}
              </Typography>
            )}
            <Typography variant="h6" gutterBottom>
              {person.condition}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Onset:</strong> {person.onset}
            </Typography>
            {person.wikiUrl && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a
                  href={person.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Learn more on Wikipedia
                  <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                </a>
              </Typography>
            )}
            {(() => {
              const { mainText, bulletPoints } = formatDescription(person.description);
              return (
                <>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {parseDescriptionWithLinks(mainText, personId)}
                  </Typography>
                  {bulletPoints.length > 0 && (
                    <List dense sx={{ mt: 1, pl: 0 }}>
                      {bulletPoints.map((point, index) => (
                        <ListItem key={index} sx={{ py: 0.25, pl: 0, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 24, mt: 0.75 }}>
                            <FiberManualRecord sx={{ fontSize: 8, color: 'text.secondary' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={parseDescriptionWithLinks(point, personId)}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              );
            })()}
            
            {/* Embedded visualization preview */}
            <EmbeddedVisualization
              personId={personId}
              simulation={person.simulation}
              personName={person.name}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {hasPrevious && (
            <IconButton
              onClick={() => onNavigate(filteredPeople[currentIndex - 1])}
              aria-label="Previous person"
              sx={{
                mr: 'auto',
                bgcolor: 'primary.main',
                color: 'white',
                width: 44,
                height: 44,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          {hasNext && (
            <IconButton
              onClick={() => onNavigate(filteredPeople[currentIndex + 1])}
              aria-label="Next person"
              sx={{
                ml: hasPrevious ? 0 : 'auto',
                bgcolor: 'primary.main',
                color: 'white',
                width: 44,
                height: 44,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={onExperienceSimulation}
        >
          Experience Simulation
        </Button>
      </DialogActions>

      {/* Share notification */}
      <Snackbar
        open={!!shareNotification}
        autoHideDuration={3000}
        onClose={() => setShareNotification(null)}
        message={shareNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};

