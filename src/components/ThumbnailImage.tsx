import React, { useState, useEffect } from 'react';

interface ThumbnailImageProps {
  conditionName: string;
  imagePath?: string;
}

/**
 * Component to handle thumbnail image with fallback (.webp -> .png)
 */
const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ conditionName, imagePath }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (imagePath) {
      setImageSrc(imagePath);
    } else {
      // Try .webp first, then .png
      const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
      setImageSrc(`${basePath}.webp`);
    }
    setHasError(false);
  }, [conditionName, imagePath]);

  const handleError = () => {
    if (imageSrc?.endsWith('.webp')) {
      // Try .png as fallback
      const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
      setImageSrc(`${basePath}.png`);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={`${conditionName} preview`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
      onError={handleError}
    />
  );
};

export default ThumbnailImage;
