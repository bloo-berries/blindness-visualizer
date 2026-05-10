import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualEffect } from '../../types/visualEffects';

// Mock the colorVisionFilters module
jest.mock('../../utils/colorVisionFilters', () => ({
  getColorVisionFilterData: (type: string, intensity: number) => {
    if (type === 'protanopia') {
      return { filterId: 'cvd-protanopia', matrixValues: '0.56 0.44 0 0 0 0.56 0.44 0 0 0 0 0.24 0.76 0 0 0 0 0 1 0' };
    }
    if (type === 'deuteranopia') {
      return { filterId: 'cvd-deuteranopia', matrixValues: '0.63 0.37 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0' };
    }
    return null;
  },
}));

import ColorVisionFilterSVG from '../../components/Visualizer/ColorVisionFilterSVG';

function makeEffect(id: string, enabled: boolean, intensity = 0.5): VisualEffect {
  return {
    id,
    name: id,
    enabled,
    intensity,
    category: 'colorVision' as VisualEffect['category'],
    description: '',
  };
}

describe('ColorVisionFilterSVG', () => {
  test('returns null when no color vision effects are enabled', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('cataracts', true)]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('returns null for empty effects array', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('renders SVG with correct filter id for protanopia', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', true, 0.8)]} />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const filter = svg!.querySelector('filter');
    expect(filter).not.toBeNull();
    expect(filter!.getAttribute('id')).toBe('cvd-protanopia');
  });

  test('SVG has aria-hidden="true"', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', true)]} />
    );
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });

  test('filter contains feColorMatrix with type="matrix"', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('deuteranopia', true)]} />
    );
    const feColorMatrix = container.querySelector('feColorMatrix');
    expect(feColorMatrix).not.toBeNull();
    expect(feColorMatrix!.getAttribute('type')).toBe('matrix');
  });

  test('returns null for non-color-vision effects', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[
        makeEffect('glaucoma', true),
        makeEffect('cataracts', true),
      ]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('returns null when color vision effect is disabled', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', false)]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('renders filter for first matching color vision effect', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[
        makeEffect('cataracts', true),
        makeEffect('protanopia', true),
      ]} />
    );
    const filter = container.querySelector('filter');
    expect(filter!.getAttribute('id')).toBe('cvd-protanopia');
  });
});
