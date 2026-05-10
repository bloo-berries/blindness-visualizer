/**
 * Tests for PreviewOverlayGenerator (src/components/ControlPanel/PreviewOverlayGenerator.ts)
 */

import { generatePreviewOverlayStyle } from '../../components/ControlPanel/PreviewOverlayGenerator';
import { VisualEffect } from '../../types/visualEffects';

const createEffect = (id: string, intensity: number = 0.5): VisualEffect => ({
  id: id as any,
  name: id,
  enabled: true,
  intensity,
  description: `${id} effect`,
});

describe('generatePreviewOverlayStyle (legacy)', () => {
  test('returns a non-null CSSProperties object for blindnessLeftEye', () => {
    const effect = createEffect('blindnessLeftEye', 0.8);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.position).toBe('absolute');
  });

  test('blindnessLeftEye has gradient going to right', () => {
    const effect = createEffect('blindnessLeftEye', 0.8);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.background).toContain('linear-gradient(to right');
  });

  test('blindnessRightEye has gradient going to left', () => {
    const effect = createEffect('blindnessRightEye', 0.8);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.background).toContain('linear-gradient(to left');
  });

  test('tunnelVision creates a radial gradient', () => {
    const effect = createEffect('tunnelVision', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.background).toContain('radial-gradient');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('scotoma creates a moving radial gradient', () => {
    const effect = createEffect('scotoma', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.background).toContain('radial-gradient');
  });

  test('blindnessLeftEye at full intensity uses normal blend mode', () => {
    const effect = createEffect('blindnessLeftEye', 1.0);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.mixBlendMode).toBe('normal');
    expect(result!.opacity).toBe('1');
  });

  test('blindnessLeftEye at partial intensity uses multiply blend mode', () => {
    const effect = createEffect('blindnessLeftEye', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('unknown condition type uses default darkening overlay', () => {
    const effect = createEffect('someUnknownCondition', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('rgba(0,0,0,');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('all results include base positioning styles', () => {
    const effects = ['blindnessLeftEye', 'tunnelVision', 'scotoma', 'unknown'];
    for (const id of effects) {
      const effect = createEffect(id, 0.5);
      const result = generatePreviewOverlayStyle(effect, [effect]);
      expect(result).not.toBeNull();
      expect(result!.position).toBe('absolute');
      expect(result!.width).toBe('100%');
      expect(result!.height).toBe('100%');
      expect(result!.pointerEvents).toBe('none');
    }
  });

  test('intensity of 0 produces minimal overlay', () => {
    const effect = createEffect('tunnelVision', 0);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    // At 0 intensity, opacity should be 0
    expect(result!.opacity).toBe(0);
  });
});
