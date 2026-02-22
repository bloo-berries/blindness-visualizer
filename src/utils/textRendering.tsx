import React from 'react';
import { Link, SxProps, Theme } from '@mui/material';

interface RenderLinksOptions {
  linkSx?: SxProps<Theme>;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Renders text with clickable links for URLs
 * URLs are converted to "Learn more" links that open in new tabs
 */
export const renderDescriptionWithLinks = (
  text: string,
  options?: RenderLinksOptions
): React.ReactNode => {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // Check if this part is a URL
    const isUrl = part.match(/^https?:\/\/[^\s]+$/);
    if (isUrl) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ wordBreak: 'break-word', ...options?.linkSx }}
          onClick={options?.onClick}
        >
          Learn more
        </Link>
      );
    }
    return part;
  });
};
