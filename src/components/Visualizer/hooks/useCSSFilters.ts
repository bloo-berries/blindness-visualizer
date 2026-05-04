import { useCallback } from 'react';
import { VisualEffect, InputSource } from '../../../types/visualEffects';
import { generateCSSFilters } from '../../../utils/cssFilters';
import { getColorVisionFilter, getColorVisionFilterData } from '../../../utils/colorVisionFilters';
import { EffectProcessor } from '../../../utils/performance';

const COLOR_VISION_IDS = [
  'protanopia', 'deuteranopia', 'tritanopia',
  'protanomaly', 'deuteranomaly', 'tritanomaly',
  'monochromacy'
];

/**
 * Hook that computes CSS filter strings and combined effect styles
 * from active visual effects.
 *
 * - `computeFilterString` builds the CSS `filter` value by combining
 *   color-vision filters with other effect CSS filters.
 * - `getEffectStyles` returns a full CSSProperties object suitable for
 *   positioning media content and applying the computed filter.
 *
 * All platforms: Uses inline SVG feColorMatrix via url("#id") for accurate
 * Machado 2009 simulation. The companion <ColorVisionFilterSVG> component
 * renders the <filter> definition in the same subtree, which resolves
 * correctly on both desktop and mobile browsers (placing the SVG inline
 * avoids the pushState fragment resolution bug on mobile WebKit).
 */
export function useCSSFilters(
  effects: VisualEffect[],
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  effectProcessor: React.MutableRefObject<EffectProcessor>,
): { computeFilterString: () => string | null; getEffectStyles: () => React.CSSProperties } {

  const computeFilterString = useCallback((): string | null => {
    const { enabledEffects } = effectProcessor.current.updateEffects(effects);

    const colorVisionEffect = enabledEffects.find(e =>
      COLOR_VISION_IDS.includes(e.id)
    );

    const nonDiplopiaEffects = enabledEffects.filter(e =>
      e.id !== 'diplopiaMonocular' && e.id !== 'diplopiaBinocular'
    );

    const otherEffects = nonDiplopiaEffects.filter(e =>
      !COLOR_VISION_IDS.includes(e.id)
    );

    const filters: string[] = [];

    if (colorVisionEffect) {
      // Use inline SVG feColorMatrix for accurate simulation on ALL platforms.
      // The companion <ColorVisionFilterSVG> component renders an inline <filter>
      // definition in the same subtree, which resolves correctly on both desktop
      // and mobile browsers (avoids the pushState fragment resolution bug).
      const filterData = getColorVisionFilterData(colorVisionEffect.id, colorVisionEffect.intensity);
      if (filterData) {
        filters.push(`url("#${filterData.filterId}")`);
      } else {
        // Monochromacy or zero intensity — pure CSS filter string
        const cssFilter = getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
        if (cssFilter) filters.push(cssFilter);
      }
    }

    if (otherEffects.length > 0) {
      const otherFilters = generateCSSFilters(otherEffects, diplopiaSeparation, diplopiaDirection);
      if (otherFilters) filters.push(otherFilters);
    }

    return filters.length > 0 ? filters.join(' ') : null;
  }, [effects, diplopiaSeparation, diplopiaDirection, effectProcessor]);

  const getEffectStyles = useCallback((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain'
    };

    if (inputSource.type === 'youtube' || inputSource.type === 'image') {
      const filterStr = computeFilterString();
      return filterStr ? { ...baseStyle, filter: filterStr } : baseStyle;
    }

    return baseStyle;
  }, [inputSource.type, computeFilterString]);

  return { computeFilterString, getEffectStyles };
}
