/**
 * Types for Charles Bonnet Syndrome (CBS) Hallucination Patterns
 */

export interface EpisodeConfig {
  simplePatterns: SimplePatternType[];
  complexPatterns: ComplexPatternType[];
  patternColors: Map<string, boolean>; // true = colored, false = grayscale
}

export type SimplePatternType = 'honeycomb' | 'spiral' | 'tessellation' | 'concentricCircles' | 'zigzag' | 'grid' | 'photopsia' | 'sparkles';
export type ComplexPatternType = 'humanSilhouette' | 'face' | 'flower' | 'cat' | 'building' | 'bird' | 'shadowBlob';

export const ALL_SIMPLE_PATTERNS: SimplePatternType[] = ['honeycomb', 'spiral', 'tessellation', 'concentricCircles', 'zigzag', 'grid', 'photopsia', 'sparkles'];
export const ALL_COMPLEX_PATTERNS: ComplexPatternType[] = ['humanSilhouette', 'face', 'flower', 'cat', 'building', 'bird', 'shadowBlob'];
