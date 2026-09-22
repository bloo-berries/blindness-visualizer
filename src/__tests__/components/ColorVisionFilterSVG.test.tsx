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
  SVG_COLOR_VISION_IDS: [
    'protanopia', 'deuteranopia', 'tritanopia',
    'protanomaly', 'deuteranomaly', 'tritanomaly',
  ],
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

  test('returns null for monochromacy (uses pure CSS, not SVG)', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('monochromacy', true, 1.0)]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('returns null for monochromatic (uses pure CSS, not SVG)', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('monochromatic', true, 1.0)]} />
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  test('filter element has colorInterpolationFilters="linearRGB"', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', true, 1.0)]} />
    );
    const filter = container.querySelector('filter');
    expect(filter).not.toBeNull();
    // React renders SVG attributes in lowercase in the DOM
    const ciFilters = filter!.getAttribute('colorInterpolationFilters')
      || filter!.getAttribute('color-interpolation-filters');
    expect(ciFilters).toBe('linearRGB');
  });

  test('SVG is visually hidden but present in DOM', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', true)]} />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.style.position).toBe('absolute');
    expect(svg!.style.pointerEvents).toBe('none');
  });

  test('feColorMatrix has non-empty values attribute', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('protanopia', true, 0.8)]} />
    );
    const feColorMatrix = container.querySelector('feColorMatrix');
    expect(feColorMatrix).not.toBeNull();
    const values = feColorMatrix!.getAttribute('values');
    expect(values).toBeTruthy();
    expect(values!.split(' ').length).toBe(20);
  });

  test('renders correct filter for deuteranopia', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[makeEffect('deuteranopia', true, 0.7)]} />
    );
    const filter = container.querySelector('filter');
    expect(filter).not.toBeNull();
    expect(filter!.getAttribute('id')).toBe('cvd-deuteranopia');
  });

  test('only renders one filter even with multiple color vision effects', () => {
    const { container } = render(
      <ColorVisionFilterSVG effects={[
        makeEffect('protanopia', true, 0.5),
        makeEffect('deuteranopia', true, 0.5),
      ]} />
    );
    const filters = container.querySelectorAll('filter');
    expect(filters).toHaveLength(1);
  });
});
