import { useState, useEffect, useCallback } from 'react';
// Note: Animation helpers are available for future use but not currently implemented
// import { 
//   generateAnimatedPosition, 
//   generateMultiplePositions, 
//   generateGravityMovement,
//   generateNeuroadaptation,
//   generateLightingFactor,
//   generateTransformString,
//   generateRadialGradient,
//   getSeverityConfig,
//   type PositionResult 
// } from '../utils/animationHelpers';

interface FloaterPosition {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}

interface UseAnimatedFloatersProps {
  intensity: number;
  enabled: boolean;
  animationSpeed?: number;
}

export const useAnimatedFloaters = ({ 
  intensity, 
  enabled, 
  animationSpeed = 1.0 
}: UseAnimatedFloatersProps) => {
  const [floaterPositions, setFloaterPositions] = useState<FloaterPosition[]>([]);
  const [animationTime, setAnimationTime] = useState(0);

  // Generate floater positions based on severity
  const generateFloaterPositions = useCallback((time: number, intensity: number): FloaterPosition[] => {
    const severity = intensity < 0.3 ? 'mild' : intensity < 0.7 ? 'moderate' : 'severe';
    const positions: FloaterPosition[] = [];

    if (severity === 'mild') {
      // 1-2 small floaters
      positions.push({
        x: 35 + Math.sin(time * 0.1) * 15 + Math.sin(time * 0.05) * 8,
        y: 35 + Math.cos(time * 0.08) * 12,
        size: 20,
        opacity: 0.7 * intensity,
        rotation: Math.sin(time * 0.03) * 5
      });
    } else if (severity === 'moderate') {
      // Multiple floaters of various types
      positions.push(
        {
          x: 30 + Math.sin(time * 0.12) * 20 + Math.sin(time * 0.06) * 10,
          y: 35 + Math.cos(time * 0.1) * 15,
          size: 25,
          opacity: 0.8 * intensity,
          rotation: Math.sin(time * 0.04) * 3
        },
        {
          x: 60 + Math.sin(time * 0.15 + 1.5) * 18,
          y: 50 + Math.cos(time * 0.12 + 2) * 20,
          size: 15,
          opacity: 0.9 * intensity,
          rotation: Math.cos(time * 0.05) * 4
        },
        {
          x: 50 + Math.sin(time * 0.08 + 3) * 12,
          y: 25 + Math.cos(time * 0.1 + 1) * 8,
          size: 18,
          opacity: 0.6 * intensity,
          rotation: Math.sin(time * 0.06) * 2
        }
      );
    } else {
      // Severe: Numerous large floaters
      positions.push(
        {
          x: 25 + Math.sin(time * 0.1) * 22 + Math.sin(time * 0.05) * 12,
          y: 30 + Math.cos(time * 0.08) * 18,
          size: 30,
          opacity: 0.85 * intensity,
          rotation: Math.sin(time * 0.03) * 6
        },
        {
          x: 70 + Math.sin(time * 0.12 + 2) * 20,
          y: 35 + Math.cos(time * 0.1 + 1.5) * 15,
          size: 25,
          opacity: 0.8 * intensity,
          rotation: Math.cos(time * 0.04) * 5
        },
        {
          x: 45 + Math.sin(time * 0.15 + 1) * 25,
          y: 50 + Math.cos(time * 0.12 + 2.5) * 20,
          size: 20,
          opacity: 0.9 * intensity,
          rotation: Math.sin(time * 0.05) * 4
        },
        {
          x: 80 + Math.sin(time * 0.18 + 3) * 15,
          y: 70 + Math.cos(time * 0.14 + 1.8) * 12,
          size: 12,
          opacity: 0.95 * intensity,
          rotation: Math.cos(time * 0.06) * 3
        },
        {
          x: 50 + Math.sin(time * 0.08 + 4) * 15,
          y: 25 + Math.cos(time * 0.1 + 2.2) * 10,
          size: 22,
          opacity: 0.7 * intensity,
          rotation: Math.sin(time * 0.04) * 4
        },
        {
          x: 40 + Math.sin(time * 0.06 + 1.2) * 18,
          y: 60 + Math.cos(time * 0.08 + 2.8) * 12,
          size: 35,
          opacity: 0.4 * intensity,
          rotation: Math.cos(time * 0.03) * 2
        }
      );
    }

    return positions;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!enabled) {
      setFloaterPositions([]);
      return;
    }

    let animationId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) * animationSpeed * 0.001;
      setAnimationTime(elapsed);
      
      const positions = generateFloaterPositions(elapsed, intensity);
      setFloaterPositions(positions);
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled, intensity, animationSpeed, generateFloaterPositions]);

  // Generate CSS background pattern from positions
  const generateFloaterPattern = useCallback((): string => {
    if (floaterPositions.length === 0) return '';

    return floaterPositions.map((floater, index) => {
      const { x, y, size, opacity } = floater;
      const ellipseSize = size * 0.4; // Make floaters more elliptical
      
      return `
        radial-gradient(ellipse ${size}% ${ellipseSize}% at ${x}% ${y}%, 
          rgba(0,0,0,${opacity}) 0%, 
          rgba(0,0,0,${opacity * 0.8}) 25%,
          rgba(0,0,0,${opacity * 0.6}) 50%,
          rgba(0,0,0,${opacity * 0.3}) 75%,
          rgba(0,0,0,0) 100%
        )
      `;
    }).join(', ');
  }, [floaterPositions]);

  return {
    floaterPattern: generateFloaterPattern(),
    floaterPositions,
    animationTime
  };
};
