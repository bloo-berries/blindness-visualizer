/**
 * Factory for creating animated overlay CSS properties.
 * Eliminates the duplicated 9-property return object across all overlay generators.
 */
export function createOverlayStyle(
  background: string,
  options?: {
    opacity?: number;
    mixBlendMode?: 'normal' | 'screen' | 'multiply' | 'hard-light';
    filter?: string;
    zIndex?: number;
  }
): React.CSSProperties {
  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background,
    mixBlendMode: (options?.mixBlendMode ?? 'normal') as React.CSSProperties['mixBlendMode'],
    opacity: options?.opacity ?? 1,
    pointerEvents: 'none' as const,
    ...(options?.filter ? { filter: options.filter } : {}),
    zIndex: options?.zIndex ?? 9999,
  };
}
