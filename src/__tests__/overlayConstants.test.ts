import {
  Z_INDEX,
  isVisualFieldLossCondition,
  isVisualDisturbanceCondition,
  getOverlayZIndex,
} from '../utils/overlayConstants';

describe('Z_INDEX constants', () => {
  test('VISUAL_DISTURBANCE is greater than VISUAL_FIELD_LOSS', () => {
    expect(Z_INDEX.VISUAL_DISTURBANCE).toBeGreaterThan(Z_INDEX.VISUAL_FIELD_LOSS);
  });

  test('VISUAL_FIELD_LOSS is greater than BASE', () => {
    expect(Z_INDEX.VISUAL_FIELD_LOSS).toBeGreaterThan(Z_INDEX.BASE);
  });

  test('DIPLOPIA is greater than BASE', () => {
    expect(Z_INDEX.DIPLOPIA).toBeGreaterThan(Z_INDEX.BASE);
  });

  test('full stacking order: BASE < DIPLOPIA < VISUAL_FIELD_LOSS < VISUAL_DISTURBANCE', () => {
    expect(Z_INDEX.BASE).toBeLessThan(Z_INDEX.DIPLOPIA);
    expect(Z_INDEX.DIPLOPIA).toBeLessThan(Z_INDEX.VISUAL_FIELD_LOSS);
    expect(Z_INDEX.VISUAL_FIELD_LOSS).toBeLessThan(Z_INDEX.VISUAL_DISTURBANCE);
  });
});

describe('isVisualFieldLossCondition', () => {
  test('returns true for known field loss conditions', () => {
    expect(isVisualFieldLossCondition('hemianopiaLeft')).toBe(true);
    expect(isVisualFieldLossCondition('hemianopiaRight')).toBe(true);
    expect(isVisualFieldLossCondition('tunnelVision')).toBe(true);
    expect(isVisualFieldLossCondition('scotoma')).toBe(true);
    expect(isVisualFieldLossCondition('retinitisPigmentosa')).toBe(true);
  });

  test('returns false for non-field-loss conditions', () => {
    expect(isVisualFieldLossCondition('protanopia')).toBe(false);
    expect(isVisualFieldLossCondition('visualAura')).toBe(false);
    expect(isVisualFieldLossCondition('unknown')).toBe(false);
  });
});

describe('isVisualDisturbanceCondition', () => {
  test('returns true for known disturbance conditions', () => {
    expect(isVisualDisturbanceCondition('visualAura')).toBe(true);
    expect(isVisualDisturbanceCondition('visualFloaters')).toBe(true);
    expect(isVisualDisturbanceCondition('visualSnow')).toBe(true);
    expect(isVisualDisturbanceCondition('hallucinations')).toBe(true);
  });

  test('returns false for non-disturbance conditions', () => {
    expect(isVisualDisturbanceCondition('protanopia')).toBe(false);
    expect(isVisualDisturbanceCondition('hemianopiaLeft')).toBe(false);
  });
});

describe('getOverlayZIndex', () => {
  test('returns higher z-index for disturbance than field loss', () => {
    const disturbanceZ = parseInt(getOverlayZIndex('visualAura'));
    const fieldLossZ = parseInt(getOverlayZIndex('hemianopiaLeft'));
    expect(disturbanceZ).toBeGreaterThan(fieldLossZ);
  });

  test('returns higher z-index for field loss than base conditions', () => {
    const fieldLossZ = parseInt(getOverlayZIndex('hemianopiaLeft'));
    const baseZ = parseInt(getOverlayZIndex('protanopia'));
    expect(fieldLossZ).toBeGreaterThan(baseZ);
  });

  test('respects custom base z-index', () => {
    const z = parseInt(getOverlayZIndex('protanopia', 2000));
    expect(z).toBe(2000);
  });
});
