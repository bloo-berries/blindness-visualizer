import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { PersonData } from '../../data/famousPeople';
import { getPersonImagePath } from '../../utils/imagePaths';

interface PersonCardProps {
  personId: string;
  person: PersonData;
  onClick: () => void;
  priority?: boolean;
  index?: number;
  style?: React.CSSProperties;
}

// Static position map - moved outside component to prevent recreation on each render
// Only stores non-default positions (default is 'center center')
const CUSTOM_POSITIONS: Record<string, string> = {
  'tilly': 'center top',
  'helen': 'center top',
  'stevie': 'center top',
  'paterson': 'center top',
  'galileo': 'center top',
  'ved': 'center top',
  'bocelli': 'center 60%',
  'moon': 'center 25%',
  'doc': 'center 30%',
  'saunderson': 'center 30%',
  'diane': 'center 30%',
  'wallyKarew': 'center 60%',
  'maryIngalls': 'center 30%',
  'francisCampbell': 'center 30%',
  'anthonyClarke': 'center 30%',
  'amyBower': 'center 30%',
  'crazzySteve': 'center 30%',
  'floydMorris': 'center 30%',
  'belaTheBlind': 'center 30%',
  'charlottaSeuerling': 'center 30%',
  'levPontryagin': 'center 30%',
  'garyODonoghue': 'center 30%',
  'francescoLandini': 'center 30%',
  'garretBarry': 'center 30%',
  'gurrumulYunupingu': 'center 30%',
  'geraldineLawhorn': 'center 30%',
  'fujitora': 'center top',
  'jamesJoyce': 'center 25%',
  'jeanPaulSartre': 'center 55%',
  'esrefArmagan': 'center 40%',
  'moondog': 'center 30%',
  'zeeshanAbbasi': 'center 40%',
  'chenGuangcheng': 'center 25%',
  'surdas': 'center 15%',
  'ravindraJain': 'center 55%',
  'kimioEto': 'center 25%',
  'dianaGurtskaya': 'center top',
  'amadou': 'center 15%',
  'srikanth': 'center top'
};

// Default position for most images
const DEFAULT_POSITION = 'center 20%';

// Force load set for specific people that have had loading issues
const FORCE_LOAD_IDS = new Set(['johnKay', 'jonnyGreenwood']);

// Local SVG placeholder (avoids external dependency)
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect fill='%23cccccc' width='300' height='400'/%3E%3Ctext fill='%23666666' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Not Found%3C/text%3E%3C/svg%3E`;

const getObjectPosition = (personId: string): string => {
  return CUSTOM_POSITIONS[personId] || DEFAULT_POSITION;
};

// Card styles extracted to prevent recreation
const cardStyles = {
  flex: 1,
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 3
  },
  '&:focus-visible': {
    outline: '3px solid #1976d2',
    outlineOffset: '2px'
  }
};

const imageContainerStyles = {
  position: 'relative' as const,
  width: '100%',
  height: '100px',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5'
};

const PersonCardComponent: React.FC<PersonCardProps> = ({
  personId,
  person,
  onClick,
  priority = false,
  index = 0,
  style
}) => {
  const forceLoad = FORCE_LOAD_IDS.has(personId);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || index < 12 || forceLoad);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Memoize image source to prevent recalculation
  const imageSrc = useMemo(() => getPersonImagePath(personId), [personId]);

  // Memoize object position
  const objectPosition = useMemo(() => getObjectPosition(personId), [personId]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (shouldLoad || !cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.01 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // Check if image is already cached
  useEffect(() => {
    if (shouldLoad && imgRef.current?.complete && imgRef.current.naturalHeight !== 0) {
      setImageLoaded(true);
    }
  }, [shouldLoad]);

  // Fallback timeout for image visibility
  useEffect(() => {
    if (!shouldLoad || imageLoaded || imageError) return;

    const timeout = setTimeout(() => setImageLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, [shouldLoad, imageLoaded, imageError]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.complete && img.naturalHeight !== 0) {
      setImageLoaded(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imageError) {
      setImageError(true);
      e.currentTarget.src = PLACEHOLDER_SVG;
      setImageLoaded(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div style={{ display: 'flex', ...style }}>
      <Card
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View details about ${person.name}, ${person.condition || 'vision condition'}`}
        sx={cardStyles}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <Box sx={imageContainerStyles}>
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
              src={imageError ? PLACEHOLDER_SVG : imageSrc}
              alt={person.name}
              loading={priority || forceLoad ? 'eager' : 'lazy'}
              decoding="async"
              ref={imgRef}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                objectPosition,
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
        <CardContent sx={{ p: 0.75, pt: 0.5, pb: 0.5, minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="subtitle2"
              component="h4"
              sx={{
                fontSize: '0.85rem',
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 0.25,
                overflowWrap: 'break-word',
                wordBreak: 'normal',
                whiteSpace: 'normal',
                hyphens: 'auto'
              }}
            >
              {person.name}
            </Typography>
            {person.achievement && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6rem',
                  lineHeight: 1.1,
                  display: 'block',
                  color: 'primary.main',
                  fontWeight: 500,
                  overflowWrap: 'break-word',
                  wordBreak: 'normal',
                  whiteSpace: 'normal',
                  hyphens: 'auto'
                }}
              >
                {person.achievement}
              </Typography>
            )}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.65rem',
              lineHeight: 1.1,
              display: 'block',
              pt: 1.5,
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
    </div>
  );
};

// Wrap in React.memo to prevent unnecessary re-renders
// Only re-renders when personId, person data, or onClick changes
export const PersonCard = memo(PersonCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.personId === nextProps.personId &&
    prevProps.person === nextProps.person &&
    prevProps.priority === nextProps.priority &&
    prevProps.index === nextProps.index
    // onClick is intentionally not compared as it's often a new function reference
  );
});
