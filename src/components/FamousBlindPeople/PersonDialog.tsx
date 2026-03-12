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
  Snackbar,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close as CloseIcon, ArrowBack, ArrowForward, OpenInNew as OpenInNewIcon, FiberManualRecord, Share as ShareIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { PersonData } from '../../data/famousPeople';
import { getPersonImagePath, getPersonSecondaryImages, getPeopleImagePath } from '../../utils/imagePaths';
import { parseDescriptionWithLinks, getWebsiteUrl } from '../../utils/famousPeopleUtils';
import { EmbeddedVisualization } from './EmbeddedVisualization';

/**
 * Formats description text by separating bullet points into a list
 * Returns { mainText: string, bulletPoints: string[] }
 */
const formatDescription = (description: string): { mainText: string; bulletPoints: string[]; linkBullets: string[] } => {
  let mainText = '';
  let allBullets: string[] = [];

  // Try splitting by newlines + bullet first (common format in data)
  if (description.includes('\n\n•') || description.includes('\n•')) {
    const parts = description.split(/\n+•\s*/);
    if (parts.length > 1) {
      mainText = parts[0].trim();
      allBullets = parts.slice(1).map(point => point.trim()).filter(point => point.length > 0);
    }
  }

  if (!mainText) {
    // Fallback: split by inline bullet pattern " • "
    const parts = description.split(' • ');
    if (parts.length <= 1) {
      return { mainText: description, bulletPoints: [], linkBullets: [] };
    }
    mainText = parts[0].trim();
    allBullets = parts.slice(1).map(point => point.trim()).filter(point => point.length > 0);
  }

  // Separate bullet points that contain links (domains) from plain ones
  const domainPattern = /\b\w+\.(com|org|net|co\.uk|io)\b/i;
  const linkBullets = allBullets.filter(bp => domainPattern.test(bp));
  const bulletPoints = allBullets.filter(bp => !domainPattern.test(bp));

  return { mainText, bulletPoints, linkBullets };
};

interface PersonDialogProps {
  open: boolean;
  personId: string | null;
  person: PersonData | null;
  filteredPeople: string[];
  onClose: () => void;
  onNavigate: (personId: string) => void;
}

export const PersonDialog: React.FC<PersonDialogProps> = ({
  open,
  personId,
  person,
  filteredPeople,
  onClose,
  onNavigate
}) => {
  // Ref for scrolling dialog content to top
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Mobile detection for collapsible secondary images
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [secondaryImagesOpen, setSecondaryImagesOpen] = useState(false);

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

  // Scroll to top and reset toggle when person changes
  useEffect(() => {
    if (personId && dialogContentRef.current) {
      dialogContentRef.current.scrollTop = 0;
    }
    setSecondaryImagesOpen(false);
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
            {(() => {
              const secondaryImages = getPersonSecondaryImages(personId);
              if (secondaryImages.length === 0) return null;

              const imageElements = secondaryImages.map((entry, idx) => {
                const imgEl = (
                  <img
                    key={idx}
                    src={getPeopleImagePath(entry.filename)}
                    alt={entry.caption || `${person.name} - additional`}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      display: 'block',
                      ...(entry.maxHeight ? { maxHeight: entry.maxHeight, objectFit: 'contain' as const } : {}),
                      ...(entry.link ? { cursor: 'pointer' } : {})
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                );
                return (
                  <Box key={idx} sx={{ mt: 1.5 }}>
                    {entry.link ? (
                      <a href={entry.link} target="_blank" rel="noopener noreferrer">
                        {imgEl}
                      </a>
                    ) : imgEl}
                    {entry.caption && (
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', color: 'text.secondary' }}
                      >
                        {entry.caption}
                      </Typography>
                    )}
                  </Box>
                );
              });

              if (isMobile) {
                return (
                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      size="small"
                      onClick={() => setSecondaryImagesOpen(!secondaryImagesOpen)}
                      endIcon={secondaryImagesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{ textTransform: 'none', color: 'text.secondary', pl: 0 }}
                    >
                      {secondaryImagesOpen ? 'Hide photos' : 'More photos'}
                    </Button>
                    <Collapse in={secondaryImagesOpen}>
                      {imageElements}
                    </Collapse>
                  </Box>
                );
              }

              return <>{imageElements}</>;
            })()}
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
            <Typography variant="h6" component="div" gutterBottom>
              {person.condition}
              {person.onset && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  <strong>Onset:</strong> {person.onset}
                </Typography>
              )}
            </Typography>
            {(() => {
              const { mainText, bulletPoints, linkBullets } = formatDescription(person.description);
              // Extract domains from link bullets
              const domainPattern = /\b(\w[\w-]*\.(?:com|org|net|co\.uk|io))\b/gi;
              const extractedDomains = linkBullets.flatMap(bp => {
                const matches = bp.match(domainPattern);
                return matches || [];
              });

              return (
                <>
                  {/* Inline links row: Wikipedia + extracted domains */}
                  {(person.wikiUrl || extractedDomains.length > 0) && (
                    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                      {person.wikiUrl && (
                        <a
                          href={person.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#60A5FA',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.875rem'
                          }}
                        >
                          Wikipedia
                          <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                        </a>
                      )}
                      {extractedDomains.map((domain, index) => {
                        const url = getWebsiteUrl(domain, personId);
                        return url ? (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#60A5FA',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.875rem'
                            }}
                          >
                            {domain}
                            <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                          </a>
                        ) : null;
                      })}
                    </Box>
                  )}
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

