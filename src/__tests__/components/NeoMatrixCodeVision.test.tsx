/**
 * Tests for NeoMatrixCodeVision component
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock requestAnimationFrame/cancelAnimationFrame
let rafCallbacks: ((time: number) => void)[] = [];
const mockRAF = jest.fn().mockImplementation((cb: (time: number) => void) => {
  rafCallbacks.push(cb);
  return rafCallbacks.length;
});
const mockCAF = jest.fn();

beforeEach(() => {
  rafCallbacks = [];
  window.requestAnimationFrame = mockRAF;
  window.cancelAnimationFrame = mockCAF;
});

import NeoMatrixCodeVision from '../../components/Visualizer/hooks/animatedOverlays/neoMatrixCodeVision';

describe('NeoMatrixCodeVision', () => {
  test('renders canvas element', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={1.0} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('canvas has aria-hidden attribute', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={1.0} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders dark background div', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={1.0} />);
    const divs = container.querySelectorAll('div[aria-hidden="true"]');
    expect(divs.length).toBeGreaterThanOrEqual(1);
  });

  test('background div has aria-hidden attribute', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={0.5} />);
    const bgDiv = container.querySelector('div[aria-hidden="true"]');
    expect(bgDiv).toBeInTheDocument();
  });

  test('handles zero intensity', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={0} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('canvas uses absolute positioning for overlay', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={1.0} />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.style.position).toBe('absolute');
  });

  test('canvas has pointer-events none', () => {
    const { container } = render(<NeoMatrixCodeVision intensity={1.0} />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.style.pointerEvents).toBe('none');
  });

  test('starts animation on mount', () => {
    render(<NeoMatrixCodeVision intensity={1.0} />);
    expect(mockRAF).toHaveBeenCalled();
  });

  test('cancels animation on unmount', () => {
    const { unmount } = render(<NeoMatrixCodeVision intensity={1.0} />);
    unmount();
    expect(mockCAF).toHaveBeenCalled();
  });
});
