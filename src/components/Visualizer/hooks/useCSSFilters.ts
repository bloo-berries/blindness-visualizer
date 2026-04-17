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
 *   color-vision SVG filters with other effect CSS filters.
 * - `getEffectStyles` returns a full CSSProperties object suitable for
 *   positioning media content and applying the computed filter.
 *
 * For color vision conditions that use SVG feColorMatrix (everything except
 * monochromacy), the companion <ColorVisionFilterSVG> component must be
 * rendered in the same container to provide the inline SVG filter definition.
 * This is required because mobile WebKit cannot resolve url("#id") references
 * to SVG filters injected into document.body.
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
      // For monochromacy, getColorVisionFilter returns pure CSS (saturate/contrast).
      // For SVG-based conditions, getColorVisionFilterData gives us the filter ID
      // and the inline <ColorVisionFilterSVG> component provides the <filter> def.
      // We also call getColorVisionFilter to maintain the body-injected fallback.
      const filterData = getColorVisionFilterData(colorVisionEffect.id, colorVisionEffect.intensity);
      if (filterData) {
        // SVG-based filter — use bare url("#id") which resolves to the inline SVG
        filters.push(`url("#${filterData.filterId}")`);
        // Also inject into body as desktop fallback (harmless duplicate)
        getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
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
