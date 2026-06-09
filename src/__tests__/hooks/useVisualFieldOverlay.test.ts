/**
 * Tests for useVisualFieldOverlay hook.
 *
 * The hook generates overlay CSS styles for visual field effects.
 * It returns an array of CSSProperties -- one per enabled visual field effect.
 * It supports single-ID generators and multi-ID generator groups.
 */

import { renderHook } from '@testing-library/react';
import { useVisualFieldOverlay } from '../../components/Visualizer/hooks/visualFieldOverlays/useVisualFieldOverlay';
import { VisualEffect } from '../../types/visualEffects';

function makeEffect(
  id: string,
  enabled: boolean,
  intensity: number
): VisualEffect {
  return {
    id: id as VisualEffect['id'],
    name: id,
    enabled,
    intensity,
    description: `Test ${id}`,
  };
}

// Shared overlay base expectations
const OVERLAY_BASE_KEYS = ['position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'pointerEvents', 'zIndex'];

describe('useVisualFieldOverlay', () => {
  describe('empty and disabled effects', () => {
    test('returns empty array for empty effects list', () => {
      const { result } = renderHook(() => useVisualFieldOverlay([]));
      expect(result.current).toEqual([]);
    });

    test('returns empty array when all effects are disabled', () => {
      const effects: VisualEffect[] = [
        makeEffect('retinitisPigmentosa', false, 0.7),
        makeEffect('glaucoma', false, 0.5),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toEqual([]);
    });

    test('returns empty array for effects not in generator maps', () => {
      const effects: VisualEffect[] = [
        makeEffect('protanopia', true, 0.7), // color vision, not a field overlay
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toEqual([]);
    });
  });

  describe('single-ID generators', () => {
    const singleIdEffects = [
      'retinitisPigmentosa',
      'stargardt',
      'amd',
      'judiAMDComplete',
      'diabeticRetinopathy',
      'glaucoma',
      'tunnelVision',
      'hemianopiaLeft',
      'hemianopiaRight',
      'bitemporalHemianopia',
      'scotoma',
      'blindnessLeftEye',
      'blindnessRightEye',
      'joseCidMonocularVision',
      'retinalDetachment',
      'astigmatism',
      'quadrantanopiaLeft',
      'quadrantanopiaRight',
      'quadrantanopiaInferiorLeft',
      'quadrantanopiaInferiorRight',
      'quadrantanopiaSuperiorLeft',
      'quadrantanopiaSuperiorRight',
    ];

    test.each(singleIdEffects)(
      'produces one overlay for enabled %s effect',
      (effectId) => {
        const effects = [makeEffect(effectId, true, 0.7)];
        const { result } = renderHook(() => useVisualFieldOverlay(effects));

        expect(result.current).toHaveLength(1);
        const overlay = result.current[0];
        expect(overlay.position).toBe('absolute');
        expect(overlay.pointerEvents).toBe('none');
        expect(overlay.width).toBe('100%');
        expect(overlay.height).toBe('100%');
      }
    );

    test.each(singleIdEffects)(
      '%s overlay has a background string',
      (effectId) => {
        const effects = [makeEffect(effectId, true, 0.7)];
        const { result } = renderHook(() => useVisualFieldOverlay(effects));

        expect(typeof result.current[0].background).toBe('string');
        expect((result.current[0].background as string).length).toBeGreaterThan(0);
      }
    );
  });

  describe('multiple effects simultaneously', () => {
    test('returns multiple overlays for multiple enabled effects', () => {
      const effects: VisualEffect[] = [
        makeEffect('retinitisPigmentosa', true, 0.7),
        makeEffect('glaucoma', true, 0.5),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(2);
    });

    test('only returns overlays for enabled effects', () => {
      const effects: VisualEffect[] = [
        makeEffect('retinitisPigmentosa', true, 0.7),
        makeEffect('glaucoma', false, 0.5),
        makeEffect('tunnelVision', true, 0.9),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(2);
    });
  });

  describe('multi-ID generator groups', () => {
    test('produces overlay for Plateau solar retinopathy effect', () => {
      const effects = [makeEffect('plateauComplete', true, 0.8)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(1);
      expect(result.current[0].position).toBe('absolute');
    });

    test('produces overlay for Euler asymmetric vision effect', () => {
      const effects = [makeEffect('eulerRightEyeBlind', true, 0.8)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(1);
    });

    test('produces overlay for Nemeth dual attack effect', () => {
      const effects = [makeEffect('nemethComplete', true, 0.8)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(1);
    });

    test('only generates one overlay per multi-ID group even with multiple matching IDs', () => {
      const effects: VisualEffect[] = [
        makeEffect('plateauComplete', true, 0.8),
        makeEffect('plateauCentralScotoma', true, 0.6),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // Only one overlay should be generated per group
      expect(result.current).toHaveLength(1);
    });

    test('generates separate overlays for different multi-ID groups', () => {
      const effects: VisualEffect[] = [
        makeEffect('plateauComplete', true, 0.8),
        makeEffect('eulerComplete', true, 0.6),
        makeEffect('nemethComplete', true, 0.7),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(3);
    });
  });

  describe('intensity edge cases', () => {
    test('handles intensity=0', () => {
      const effects = [makeEffect('retinitisPigmentosa', true, 0)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(1);
      const overlay = result.current[0];
      expect(overlay).toBeDefined();
    });

    test('handles intensity=1', () => {
      const effects = [makeEffect('retinitisPigmentosa', true, 1)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toHaveLength(1);
    });

    test('opacity is capped appropriately', () => {
      const effects = [makeEffect('retinitisPigmentosa', true, 1)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      const overlay = result.current[0];
      expect(overlay.opacity).toBeLessThanOrEqual(1);
      expect(overlay.opacity).toBeGreaterThanOrEqual(0);
    });
  });

  describe('memoization', () => {
    test('returns same reference when effects do not change', () => {
      const effects = [makeEffect('glaucoma', true, 0.5)];
      const { result, rerender } = renderHook(() => useVisualFieldOverlay(effects));

      const firstResult = result.current;
      rerender();
      expect(result.current).toBe(firstResult);
    });

    test('returns new reference when effects change', () => {
      const { result, rerender } = renderHook(
        ({ effects }) => useVisualFieldOverlay(effects),
        { initialProps: { effects: [makeEffect('glaucoma', true, 0.5)] } }
      );

      const firstResult = result.current;
      rerender({ effects: [makeEffect('glaucoma', true, 0.9)] });
      expect(result.current).not.toBe(firstResult);
    });
  });

  describe('specific overlay characteristics', () => {
    test('retinitisPigmentosa uses normal blend mode', () => {
      const effects = [makeEffect('retinitisPigmentosa', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].mixBlendMode).toBe('normal');
    });

    test('hemianopiaLeft background is a left-to-right gradient', () => {
      const effects = [makeEffect('hemianopiaLeft', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].background).toContain('to right');
    });

    test('hemianopiaRight background is a right-to-left gradient', () => {
      const effects = [makeEffect('hemianopiaRight', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].background).toContain('to left');
    });

    test('blindnessLeftEye at full intensity uses normal blend mode', () => {
      const effects = [makeEffect('blindnessLeftEye', true, 1)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].mixBlendMode).toBe('normal');
    });

    test('blindnessLeftEye at partial intensity uses normal blend mode', () => {
      const effects = [makeEffect('blindnessLeftEye', true, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].mixBlendMode).toBe('normal');
    });

    test('diabeticRetinopathy has filter property', () => {
      const effects = [makeEffect('diabeticRetinopathy', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].filter).toBeDefined();
      expect(result.current[0].filter).toContain('blur');
    });
  });

  describe('multi-layer generators (visual floaters)', () => {
    test('visualFloaters returns two overlay layers', () => {
      const effects = [makeEffect('visualFloaters', true, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current.length).toBe(2);
      for (const overlay of result.current) {
        for (const key of OVERLAY_BASE_KEYS) {
          expect(overlay).toHaveProperty(key);
        }
        expect(overlay.pointerEvents).toBe('none');
      }
    });

    test('visualFloaters layers include drift animation', () => {
      const effects = [makeEffect('visualFloaters', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current[0].animation).toContain('floaterDrift');
      expect(result.current[1].animation).toContain('floaterDrift');
    });

    test('disabled visualFloaters returns no overlays', () => {
      const effects = [makeEffect('visualFloaters', false, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toEqual([]);
    });
  });

  describe('multi-layer generators (visual snow)', () => {
    test('visualSnow returns multiple overlay layers', () => {
      const effects = [makeEffect('visualSnow', true, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // Visual snow produces 4 layers: dots1, dots2, blue field+photopsia, contrast
      expect(result.current.length).toBe(4);
      for (const overlay of result.current) {
        for (const key of OVERLAY_BASE_KEYS) {
          expect(overlay).toHaveProperty(key);
        }
        expect(overlay.pointerEvents).toBe('none');
      }
    });

    test('visualSnow layers include animation', () => {
      const effects = [makeEffect('visualSnow', true, 0.7)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // First layer should have drift animation
      expect(result.current[0].animation).toContain('visualSnowDrift');
    });

    test('visualSnowDense returns multiple overlay layers', () => {
      const effects = [makeEffect('visualSnowDense', true, 0.6)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // Dense produces 4 layers: 3 dot layers + contrast
      expect(result.current.length).toBe(4);
    });

    test('visualSnowFlashing returns overlay layer', () => {
      const effects = [makeEffect('visualSnowFlashing', true, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current.length).toBe(1);
    });

    test('visualSnow combined with regular overlay effects', () => {
      const effects = [
        makeEffect('retinitisPigmentosa', true, 0.6),
        makeEffect('visualSnow', true, 0.5),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // 1 RP overlay + 4 visual snow layers = 5
      expect(result.current.length).toBe(5);
    });

    test('disabled visual snow returns no overlays', () => {
      const effects = [makeEffect('visualSnow', false, 0.5)];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current).toEqual([]);
    });
  });

  describe('z-index layering', () => {
    test('refractive errors render behind visual field loss', () => {
      // Astigmatism toggled on AFTER hemianopia — should still sort behind it
      const effects = [
        makeEffect('hemianopiaLeft', true, 0.7),
        makeEffect('astigmatism', true, 0.5),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      expect(result.current.length).toBe(2);
      // Astigmatism (refractive) should come first (lower z), hemianopia second (higher z)
      const astigmatismZ = result.current[0].zIndex as number;
      const hemianopiaZ = result.current[1].zIndex as number;
      expect(astigmatismZ).toBeLessThan(hemianopiaZ);
    });

    test('visual disturbances render on top of visual field loss', () => {
      const effects = [
        makeEffect('visualSnow', true, 0.5),
        makeEffect('tunnelVision', true, 0.6),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      // Tunnel vision (field loss) should come before visual snow (disturbance)
      const fieldLossOverlays = result.current.filter(o => (o.zIndex as number) < 9800);
      const disturbanceOverlays = result.current.filter(o => (o.zIndex as number) >= 9800);
      expect(fieldLossOverlays.length).toBeGreaterThan(0);
      expect(disturbanceOverlays.length).toBeGreaterThan(0);
    });

    test('refractive + field loss + disturbance all layer correctly', () => {
      const effects = [
        makeEffect('visualFloaters', true, 0.5),
        makeEffect('astigmatism', true, 0.5),
        makeEffect('scotoma', true, 0.6),
      ];
      const { result } = renderHook(() => useVisualFieldOverlay(effects));
      const zValues = result.current.map(o => o.zIndex as number);
      // Should be sorted: refractive < field loss < disturbance
      for (let i = 1; i < zValues.length; i++) {
        expect(zValues[i]).toBeGreaterThanOrEqual(zValues[i - 1]);
      }
    });
  });
});
