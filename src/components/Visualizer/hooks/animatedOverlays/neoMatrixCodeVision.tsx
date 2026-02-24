/**
 * Neo's Matrix Code Vision - Canvas-based digital rain overlay
 *
 * After Neo is blinded by Agent Smith in The Matrix Revolutions, he gains
 * the ability to perceive the underlying code of the Matrix itself.
 *
 * Visual Style:
 * - Falling columns of green phosphor characters (katakana, Latin, numerals)
 * - Bright "head" characters at the leading edge of each stream
 * - Fading trails with phosphor persistence (afterglow)
 * - Dark green-black background
 * - Occasional glitch effects (chromatic aberration, scan lines)
 *
 * Technical Implementation:
 * - Canvas-based rendering for character animation
 * - Multiple columns with varying speeds and trail lengths
 * - Phosphor fade using semi-transparent dark overlay
 * - Character set: Katakana + Latin + numerals + symbols
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  trailLength: number;
  brightness: number;
}

// Character set for Matrix rain (katakana, Latin, numerals, symbols)
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMERALS = '0123456789';
const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const ALL_CHARS = KATAKANA + LATIN + NUMERALS + SYMBOLS;

const randomChar = (): string => {
  return ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
};

interface NeoMatrixCodeVisionProps {
  intensity: number;
}

const NeoMatrixCodeVision: React.FC<NeoMatrixCodeVisionProps> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const glitchRef = useRef<{ active: boolean; endTime: number }>({ active: false, endTime: 0 });

  // Initialize columns
  const initColumns = useCallback((width: number, height: number) => {
    const fontSize = 14; // Slightly smaller for more columns
    const columnCount = Math.floor(width / fontSize);
    const columns: MatrixColumn[] = [];

    for (let i = 0; i < columnCount; i++) {
      columns.push({
        x: i * fontSize,
        y: Math.random() * height - height, // Start above screen
        speed: 3 + Math.random() * 5, // Faster fall speeds
        chars: Array.from({ length: 25 + Math.floor(Math.random() * 20) }, () => randomChar()),
        trailLength: 20 + Math.floor(Math.random() * 15), // Longer trails
        brightness: 0.75 + Math.random() * 0.25 // Brighter overall
      });
    }

    columnsRef.current = columns;
  }, []);

  // Update character in column (characters change randomly)
  const mutateColumn = useCallback((column: MatrixColumn) => {
    // Randomly change 1-2 characters per frame
    const mutationCount = Math.random() < 0.3 ? 1 : 0;
    for (let i = 0; i < mutationCount; i++) {
      const idx = Math.floor(Math.random() * column.chars.length);
      column.chars[idx] = randomChar();
    }
  }, []);

  // Main render loop
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const width = canvas.width;
    const height = canvas.height;
    const fontSize = 14;

    // Phosphor persistence: semi-transparent dark overlay creates trailing effect
    // Using rgba(0, 5, 0) for green tint in the fade - higher opacity for longer trails
    ctx.fillStyle = `rgba(0, 5, 0, ${0.08 + (1 - intensity) * 0.02})`;
    ctx.fillRect(0, 0, width, height);

    // Check for glitch trigger (random probability)
    const now = timestamp;
    if (!glitchRef.current.active && Math.random() < 0.001) {
      glitchRef.current = { active: true, endTime: now + 100 + Math.random() * 150 };
    }
    if (glitchRef.current.active && now > glitchRef.current.endTime) {
      glitchRef.current.active = false;
    }

    // Apply glitch effect (chromatic aberration / slice displacement)
    if (glitchRef.current.active) {
      // Slice displacement: copy random horizontal slices and offset them
      const sliceCount = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < sliceCount; i++) {
        const sliceY = Math.floor(Math.random() * height);
        const sliceHeight = 5 + Math.floor(Math.random() * 20);
        const offset = Math.floor((Math.random() - 0.5) * 30);
        try {
          const imageData = ctx.getImageData(0, sliceY, width, sliceHeight);
          ctx.putImageData(imageData, offset, sliceY);
        } catch {
          // Ignore cross-origin errors
        }
      }
    }

    ctx.font = `${fontSize}px "MS Gothic", "Courier New", monospace`;
    ctx.textAlign = 'center';

    // Render each column
    columnsRef.current.forEach((column) => {
      // Mutate characters occasionally
      mutateColumn(column);

      // Draw trail characters (from oldest to newest)
      for (let i = 0; i < column.trailLength; i++) {
        const charIndex = i;
        if (charIndex >= column.chars.length) continue;

        const charY = column.y - i * fontSize;
        if (charY < -fontSize || charY > height + fontSize) continue;

        // Calculate brightness: head is brightest, trail fades
        const fadeRatio = 1 - (i / column.trailLength);
        const alpha = fadeRatio * column.brightness * intensity;

        if (i === 0) {
          // Head character: bright white-green with strong glow
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#00ff00';
          ctx.fillStyle = `rgba(220, 255, 220, ${Math.min(1, alpha * 1.8)})`;
        } else if (i < 4) {
          // Near-head characters: bright saturated green
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00ff00';
          ctx.fillStyle = `rgba(0, 255, 50, ${Math.min(1, alpha * 1.3)})`;
        } else {
          // Trail characters: medium green with slight glow
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#00aa00';
          const greenValue = Math.floor(180 + fadeRatio * 75);
          ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${alpha})`;
        }

        ctx.fillText(column.chars[charIndex], column.x + fontSize / 2, charY);
      }

      // Reset shadow for next column
      ctx.shadowBlur = 0;

      // Move column down
      column.y += column.speed * (deltaTime / 16.67); // Normalize to ~60fps

      // Recycle column when it goes off screen
      if (column.y - column.trailLength * fontSize > height) {
        column.y = -column.trailLength * fontSize - Math.random() * 100;
        column.speed = 2 + Math.random() * 4;
        column.brightness = 0.6 + Math.random() * 0.4;
        // Regenerate some characters
        column.chars = column.chars.map(() => randomChar());
      }
    });

    // Add scan line effect
    ctx.fillStyle = `rgba(0, 0, 0, ${0.03 * intensity})`;
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }

    // Add vignette effect for depth
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * intensity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    animationRef.current = requestAnimationFrame(render);
  }, [intensity, mutateColumn]);

  // Setup and resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        // Clear and reinitialize
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      initColumns(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initColumns, render]);

  return (
    <>
      {/* Dark background layer to cover underlying video */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: `rgba(0, 5, 0, ${0.85 * intensity})`,
          pointerEvents: 'none',
          zIndex: 9998
        }}
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default NeoMatrixCodeVision;
