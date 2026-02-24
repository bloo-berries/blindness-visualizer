import React from 'react';

/**
 * Converts a flag emoji to its ISO 3166-1 alpha-2 country code
 * Flag emojis are made of Regional Indicator Symbols (U+1F1E6 to U+1F1FF)
 * Each letter is offset from U+1F1E6 by the position of the letter in the alphabet
 */
export const flagEmojiToCountryCode = (flagEmoji: string): string => {
  // Handle edge cases
  if (!flagEmoji || flagEmoji.length < 2) {
    return '';
  }

  // Regional Indicator Symbol Letter A is at U+1F1E6
  const REGIONAL_A = 0x1F1E6;
  const ASCII_A = 65;

  try {
    // Get the code points from the emoji
    const codePoints = Array.from(flagEmoji).map(char => char.codePointAt(0) || 0);

    // Filter to only regional indicator symbols (between U+1F1E6 and U+1F1FF)
    const regionalIndicators = codePoints.filter(
      cp => cp >= REGIONAL_A && cp <= 0x1F1FF
    );

    if (regionalIndicators.length !== 2) {
      return '';
    }

    // Convert regional indicators to ASCII letters
    const countryCode = regionalIndicators
      .map(cp => String.fromCharCode(cp - REGIONAL_A + ASCII_A))
      .join('')
      .toLowerCase();

    return countryCode;
  } catch {
    return '';
  }
};

/**
 * Props for the FlagImage component
 */
interface FlagImageProps {
  /** The flag emoji (e.g., "🇺🇸") or country code (e.g., "us") */
  flag: string;
  /** Country name for alt text */
  countryName?: string;
  /** Size in pixels (default: 20) */
  size?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

/**
 * Renders a flag as an image that works on all platforms (including Windows)
 * Uses flagcdn.com for SVG flags
 */
export const FlagImage: React.FC<FlagImageProps> = ({
  flag,
  countryName = '',
  size = 20,
  style = {}
}) => {
  // Determine if input is already a country code or an emoji
  let countryCode: string;

  if (flag.length === 2 && /^[a-zA-Z]{2}$/.test(flag)) {
    // Already a country code
    countryCode = flag.toLowerCase();
  } else {
    // Convert emoji to country code
    countryCode = flagEmojiToCountryCode(flag);
  }

  if (!countryCode) {
    // Fallback: render the original emoji
    return <span style={style}>{flag}</span>;
  }

  // Use flagcdn.com for flag images (free, no API key required)
  // Format: https://flagcdn.com/w40/{countryCode}.png
  // Available widths: 20, 40, 80, 160, 320
  const width = size <= 20 ? 20 : size <= 40 ? 40 : size <= 80 ? 80 : 160;
  const flagUrl = `https://flagcdn.com/w${width}/${countryCode}.png`;

  // Also prepare a 2x version for retina displays
  const flagUrl2x = `https://flagcdn.com/w${Math.min(width * 2, 320)}/${countryCode}.png`;

  return (
    <img
      src={flagUrl}
      srcSet={`${flagUrl2x} 2x`}
      alt={countryName ? `${countryName} flag` : `Flag of ${countryCode.toUpperCase()}`}
      width={size}
      height={Math.round(size * 0.75)} // Flags are typically 4:3 aspect ratio
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        ...style
      }}
      loading="lazy"
      // Fallback to emoji if image fails to load
      onError={(e) => {
        const target = e.currentTarget;
        const parent = target.parentElement;
        if (parent) {
          const span = document.createElement('span');
          span.textContent = flag;
          parent.replaceChild(span, target);
        }
      }}
    />
  );
};

/**
 * Renders a flag with country name
 */
interface FlagWithNameProps {
  flag: string;
  countryName: string;
  size?: number;
}

export const FlagWithName: React.FC<FlagWithNameProps> = ({
  flag,
  countryName,
  size = 20
}) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <FlagImage flag={flag} countryName={countryName} size={size} />
      <span>{countryName}</span>
    </span>
  );
};
