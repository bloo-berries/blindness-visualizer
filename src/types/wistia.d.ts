// TypeScript declarations for Wistia custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'wistia-player': {
      'media-id': string;
      aspect?: string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
}

