import { ANIMATED_EFFECTS } from '../components/Visualizer/hooks/useAnimatedOverlay';
import { VISUAL_EFFECTS } from '../data/visualEffects';

const validEffectIds = new Set(VISUAL_EFFECTS.map(e => e.id));

describe('Animated Effects Registry', () => {
  test('ANIMATED_EFFECTS is a non-empty array', () => {
    expect(Array.isArray(ANIMATED_EFFECTS)).toBe(true);
    expect(ANIMATED_EFFECTS.length).toBeGreaterThan(0);
  });

  test('ANIMATED_EFFECTS contains no duplicates', () => {
    const duplicates = ANIMATED_EFFECTS.filter(
      (id, i) => ANIMATED_EFFECTS.indexOf(id) !== i
    );
    expect(duplicates).toEqual([]);
  });

  test('every animated effect ID is a valid ConditionType in VISUAL_EFFECTS', () => {
    const invalid: string[] = [];
    for (const id of ANIMATED_EFFECTS) {
      if (!validEffectIds.has(id as any)) {
        invalid.push(id);
      }
    }
    expect(invalid).toEqual([]);
  });

  test('includes standard animated effects', () => {
    const standardEffects = [
      'visualAura',
      'hallucinations',
      'blueFieldPhenomena',
      'persistentPositiveVisualPhenomenon',
      'palinopsia',
      'starbursting',
    ];
    for (const id of standardEffects) {
      expect(ANIMATED_EFFECTS).toContain(id);
    }
  });

  test('includes visualFloaters (CSS @keyframes)', () => {
    expect(ANIMATED_EFFECTS).toContain('visualFloaters');
  });

  test('includes neoMatrixCodeVisionComplete (canvas-based)', () => {
    expect(ANIMATED_EFFECTS).toContain('neoMatrixCodeVisionComplete');
  });

  test('includes visual aura variants', () => {
    expect(ANIMATED_EFFECTS).toContain('visualAura');
    expect(ANIMATED_EFFECTS).toContain('visualAuraLeft');
    expect(ANIMATED_EFFECTS).toContain('visualAuraRight');
  });

  test('total count matches expected (25 generators + 2 special)', () => {
    expect(ANIMATED_EFFECTS.length).toBe(27);
  });
});
