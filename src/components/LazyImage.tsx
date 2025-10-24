import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  borderRadius?: number | string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  objectPosition = 'center',
  borderRadius = 0,
  onError,
  style,
  className,
  placeholder
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius,
        backgroundColor: '#f5f5f5',
        ...style
      }}
      className={className}
    >
      {/* Loading Skeleton */}
      {!loaded && !error && inView && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
      )}

      {/* Placeholder for not in view */}
      {!inView && !loaded && !error && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '0.875rem'
          }}
        >
          {placeholder || 'Loading...'}
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '0.875rem',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={{ fontSize: '2rem' }}>📷</Box>
          <Box>Image not available</Box>
        </Box>
      )}

      {/* Actual Image */}
      {inView && !error && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      )}
    </Box>
  );
};

export default LazyImage;
