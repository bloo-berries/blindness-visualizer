import { useCallback } from 'react';
import { VisualEffect, InputSource } from '../../../types/visualEffects';
import { generateCSSFilters } from '../../../utils/cssFilters';
import { getColorVisionFilter, getMobileCSSFilter, COLOR_VISION_IDS } from '../../../utils/colorVisionFilters';
import { EffectProcessor } from '../../../utils/performance';

/**
 * Hook that computes CSS filter strings and combined effect styles
 * from active visual effects.
 *
 * - `computeFilterString` builds the CSS `filter` value by combining
 *   color-vision filters with other effect CSS filters.
 * - `getEffectStyles` returns a full CSSProperties object suitable for
 *   positioning media content and applying the computed filter.
 *
 * Color vision filtering uses two strategies:
 * - **Images**: SVG feColorMatrix via DOM-injected url() — pixel-accurate
 *   Machado 2009 simulation (works on <img> elements).
 * - **YouTube**: Pure CSS filter approximations (saturate, sepia, hue-rotate)
 *   because SVG url() filter references do not penetrate cross-origin
 *   iframe compositing layers in Chromium/WebKit.
 */
export function useCSSFilters(
  effects: VisualEffect[],
  inputSource: InputSource,
  diplopiaSeparation: number,
  diplopiaDirection: number,
  effectProcessor: React.MutableRefObject<EffectProcessor>,
): { computeFilterString: (cssOnly?: boolean) => string | null; getEffectStyles: () => React.CSSProperties } {

  const computeFilterString = useCallback((cssOnly = false): string | null => {
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
      if (cssOnly) {
        // CSS-only mode: use pure CSS filter approximations.
        // Required for cross-origin iframes (YouTube) where SVG url()
        // filter references don't work due to independent layer compositing.
        const cssFilter = getMobileCSSFilter(colorVisionEffect.id, colorVisionEffect.intensity)
          // Fall back to getColorVisionFilter for monochromacy (already pure CSS)
          || getColorVisionFilter(colorVisionEffect.id, colorVisionEffect.intensity);
        if (cssFilter) filters.push(cssFilter);
      } else {
        // SVG mode: DOM-injected feColorMatrix for pixel-accurate simulation.
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

    if (inputSource.type === 'image') {
      // SVG filters on parent divs work fine for <img> elements
      const filterStr = computeFilterString();
      return filterStr ? { ...baseStyle, filter: filterStr } : baseStyle;
    }

    // For YouTube, the filter must be applied directly to the <iframe> element
    // (not a parent div) because cross-origin iframes have independent
    // compositing layers that bypass parent CSS filters in Chromium/WebKit.
    return baseStyle;
  }, [inputSource.type, computeFilterString]);

  return { computeFilterString, getEffectStyles };
}
