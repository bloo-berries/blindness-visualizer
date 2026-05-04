import React, { useMemo } from 'react';
import { VisualEffect } from '../../types/visualEffects';
import { getColorVisionFilterData } from '../../utils/colorVisionFilters';

const COLOR_VISION_IDS = [
  'protanopia', 'deuteranopia', 'tritanopia',
  'protanomaly', 'deuteranomaly', 'tritanomaly',
];

/**
 * Renders an inline SVG with the active color vision filter definition.
 *
 * Mobile WebKit cannot resolve SVG filter url("#id") references when the
 * <filter> element is injected into document.body (the browser's fragment
 * resolution fails after pushState navigation). Placing the <svg> inline
 * in the same subtree as the filtered element fixes this.
 */
const ColorVisionFilterSVG: React.FC<{ effects: VisualEffect[] }> = ({ effects }) => {
  const filterData = useMemo(() => {
    const colorEffect = effects.find(
      e => e.enabled && COLOR_VISION_IDS.includes(e.id)
    );
    if (!colorEffect) return null;
    return getColorVisionFilterData(colorEffect.id, colorEffect.intensity);
  }, [effects]);

  if (!filterData) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable={false}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
        pointerEvents: 'none'
      }}
    >
      <defs>
        <filter id={filterData.filterId} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={filterData.matrixValues} />
        </filter>
      </defs>
    </svg>
  );
};

export default ColorVisionFilterSVG;
