import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Box, Skeleton } from '@mui/material';
import { PersonData } from '../../data/famousPeople';
import { getPersonImagePath } from '../../utils/imagePaths';

interface PersonCardProps {
  personId: string;
  person: PersonData;
  onClick: () => void;
  priority?: boolean; // For above-the-fold images
  index?: number; // For preloading strategy
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
    'jonnyGreenwood': 'center 20%',
    'amadou': 'center 15%',
    'srikanth': 'center top',
    'henry': 'center 20%',
    'jamesJoyce': 'center 25%',
    'aldousHuxley': 'center 20%',
    'jeanPaulSartre': 'center 55%',
    'tahaHussein': 'center 20%',
    'nanaMouskouri': 'center 20%',
    'esrefArmagan': 'center 40%',
    'moondog': 'center 30%',
    'zeeshanAbbasi': 'center 40%',
    'chenGuangcheng': 'center 25%',
    'surdas': 'center 15%',
    'ravindraJain': 'center 55%',
    'kimioEto': 'center 25%',
    'dianaGurtskaya': 'center top',
    'asikVeysel': 'center 20%'
  };

  return positionMap[personId] || 'center center';
};

export const PersonCard: React.FC<PersonCardProps> = ({ personId, person, onClick, priority = false, index = 0 }) => {
  // Force load for specific people that have had issues
  const forceLoad = personId === 'johnKay' || personId === 'jonnyGreenwood';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || index < 12 || forceLoad); // Load first 12 immediately, or force load
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (shouldLoad || !cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  // Check if image is already loaded (for cached images)
  useEffect(() => {
    if (shouldLoad && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
        setImageLoaded(true);
      }
    }
  }, [shouldLoad]);

  // Fallback: Make image visible after timeout even if onLoad doesn't fire
  useEffect(() => {
    if (shouldLoad && !imageLoaded && !imageError) {
      const timeout = setTimeout(() => {
        setImageLoaded(true);
      }, 1000); // Show image after 1 second even if onLoad hasn't fired
      return () => clearTimeout(timeout);
    }
  }, [shouldLoad, imageLoaded, imageError]);

  const imageSrc = getPersonImagePath(personId);
  const placeholderSrc = `https://via.placeholder.com/300x400/cccccc/666666?text=${encodeURIComponent(person.name)}`;

  return (
    <Grid item xs={4} sm={2} md={2} lg={2} xl={2}>
      <Card
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View details about ${person.name}, ${person.condition || 'vision condition'}`}
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          },
          '&:focus-visible': {
            outline: '3px solid #1976d2',
            outlineOffset: '2px'
          }
        }}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          {!imageLoaded && !imageError && shouldLoad && (
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
          )}
          {shouldLoad ? (
            <Box
              component="img"
              src={imageError ? placeholderSrc : imageSrc}
              alt={person.name}
              loading={priority || forceLoad ? 'eager' : 'lazy'}
              decoding="async"
              ref={imgRef}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.complete && img.naturalHeight !== 0) {
                  setImageLoaded(true);
                }
              }}
              onError={(e) => {
                if (!imageError) {
                  setImageError(true);
                  // Try to load placeholder
                  const img = e.currentTarget;
                  if (img.src !== placeholderSrc) {
                    img.src = placeholderSrc;
                    // Reset error state to try loading placeholder
                    setImageError(false);
                    setImageLoaded(false);
                  } else {
                    // Placeholder also failed, just show it anyway
                    setImageLoaded(true);
                  }
                }
              }}
              sx={{
                objectPosition: getObjectPosition(personId),
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                display: 'block',
                objectFit: 'cover'
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                zIndex: 1
              }}
            />
          )}
        </Box>
        <CardContent sx={{ p: 0.75, pt: 0.5, pb: 0.5, minWidth: 0, flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            component="h4" 
            sx={{ 
              fontSize: '0.75rem', 
              lineHeight: 1.1, 
              mb: 0.25,
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              whiteSpace: 'normal',
              hyphens: 'auto'
            }}
          >
            {person.name}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.65rem', 
              lineHeight: 1.1, 
              display: 'block',
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              whiteSpace: 'normal',
              hyphens: 'auto'
            }}
          >
            {person.condition}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

