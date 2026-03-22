import {
  isVisualFieldLossCondition,
  isVisualDisturbanceCondition,
  getOverlayZIndex,
  Z_INDEX,
  OVERLAY_BASE_STYLES,
} from '../utils/overlayConstants';
import { VISUAL_EFFECTS } from '../data/visualEffects';

const validEffectIds = new Set(VISUAL_EFFECTS.map(e => e.id));

// Known field loss and disturbance conditions for validation
const KNOWN_FIELD_LOSS = [
  'blindnessLeftEye', 'blindnessRightEye', 'hemianopiaLeft', 'hemianopiaRight',
  'bitemporalHemianopia', 'quadrantanopiaRight', 'quadrantanopiaInferior',
  'quadrantanopiaSuperior', 'scotoma', 'tunnelVision', 'retinitisPigmentosa',
];

const KNOWN_DISTURBANCE = [
  'visualAura', 'visualFloaters', 'visualSnow', 'visualSnowFlashing',
  'visualSnowColored', 'visualSnowTransparent', 'visualSnowDense', 'hallucinations',
  'visualAuraLeft', 'visualAuraRight', 'blueFieldPhenomena',
];

describe('Overlay Mapping', () => {
  describe('condition classification', () => {
    test('all known field loss conditions are recognized', () => {
      for (const id of KNOWN_FIELD_LOSS) {
        expect(isVisualFieldLossCondition(id)).toBe(true);
      }
    });

    test('all known disturbance conditions are recognized', () => {
      for (const id of KNOWN_DISTURBANCE) {
        expect(isVisualDisturbanceCondition(id)).toBe(true);
      }
    });

    test('field loss and disturbance conditions do not overlap', () => {
      const overlap = KNOWN_FIELD_LOSS.filter(id =>
        isVisualDisturbanceCondition(id)
      );
      expect(overlap).toEqual([]);
    });

    test('disturbance conditions are not classified as field loss', () => {
      const wronglyClassified = KNOWN_DISTURBANCE.filter(id =>
        isVisualFieldLossCondition(id)
      );
      expect(wronglyClassified).toEqual([]);
    });

    test('unrelated condition is not classified as either', () => {
      expect(isVisualFieldLossCondition('protanopia')).toBe(false);
      expect(isVisualDisturbanceCondition('protanopia')).toBe(false);
      expect(isVisualFieldLossCondition('cataracts')).toBe(false);
      expect(isVisualDisturbanceCondition('cataracts')).toBe(false);
    });
  });

  describe('z-index ordering', () => {
    test('Z_INDEX constants maintain correct stacking order', () => {
      expect(Z_INDEX.BASE).toBeLessThan(Z_INDEX.DIPLOPIA);
      expect(Z_INDEX.DIPLOPIA).toBeLessThan(Z_INDEX.VISUAL_FIELD_LOSS);
      expect(Z_INDEX.VISUAL_FIELD_LOSS).toBeLessThan(Z_INDEX.VISUAL_DISTURBANCE);
    });

    test('animated z-indices are relative (lower than absolute)', () => {
      expect(Z_INDEX.ANIMATED).toBeLessThan(Z_INDEX.BASE);
      expect(Z_INDEX.ANIMATED_VISUAL_FIELD_LOSS).toBeLessThan(Z_INDEX.BASE);
    });

    test('getOverlayZIndex returns higher z-index for disturbances than field loss', () => {
      const disturbanceZ = parseInt(getOverlayZIndex('visualAura'));
      const fieldLossZ = parseInt(getOverlayZIndex('hemianopiaLeft'));
      const baseZ = parseInt(getOverlayZIndex('protanopia'));

      expect(disturbanceZ).toBeGreaterThan(fieldLossZ);
      expect(fieldLossZ).toBeGreaterThan(baseZ);
    });

    test('getOverlayZIndex respects custom base z-index', () => {
      const z = parseInt(getOverlayZIndex('visualAura', 2000));
      expect(z).toBe(2200); // 2000 + 200 for disturbance
    });

    test('getOverlayZIndex returns base z-index for unrecognized conditions', () => {
      const z = parseInt(getOverlayZIndex('someUnknownCondition', 5000));
      expect(z).toBe(5000);
    });
  });

  describe('OVERLAY_BASE_STYLES', () => {
    test('has position absolute', () => {
      expect(OVERLAY_BASE_STYLES.position).toBe('absolute');
    });

    test('has pointer-events none', () => {
      expect(OVERLAY_BASE_STYLES.pointerEvents).toBe('none');
    });

    test('covers full container', () => {
      expect(OVERLAY_BASE_STYLES.width).toBe('100%');
      expect(OVERLAY_BASE_STYLES.height).toBe('100%');
      expect(OVERLAY_BASE_STYLES.top).toBe('0');
      expect(OVERLAY_BASE_STYLES.left).toBe('0');
    });
  });
});
