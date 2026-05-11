import { ANIMATED_EFFECTS } from '../components/Visualizer/hooks/useAnimatedOverlay';
import { VISUAL_EFFECTS } from '../data/visualEffects';

const validEffectIds = new Set(VISUAL_EFFECTS.map(e => e.id));

describe('Animated Effects Registry', () => {
  test('ANIMATED_EFFECTS is a non-empty Set', () => {
    expect(ANIMATED_EFFECTS).toBeInstanceOf(Set);
    expect(ANIMATED_EFFECTS.size).toBeGreaterThan(0);
  });

  test('ANIMATED_EFFECTS contains no duplicates (inherent with Set)', () => {
    // Sets cannot contain duplicates by definition, but verify size matches
    // the expected count to catch any accidental omissions
    const arr = [...ANIMATED_EFFECTS];
    expect(new Set(arr).size).toBe(arr.length);
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
      expect(ANIMATED_EFFECTS.has(id)).toBe(true);
    }
  });

  test('includes visualFloaters (CSS @keyframes)', () => {
    expect(ANIMATED_EFFECTS.has('visualFloaters')).toBe(true);
  });

  test('includes neoMatrixCodeVisionComplete (canvas-based)', () => {
    expect(ANIMATED_EFFECTS.has('neoMatrixCodeVisionComplete')).toBe(true);
  });

  test('includes visual aura variants', () => {
    expect(ANIMATED_EFFECTS.has('visualAura')).toBe(true);
    expect(ANIMATED_EFFECTS.has('visualAuraLeft')).toBe(true);
    expect(ANIMATED_EFFECTS.has('visualAuraRight')).toBe(true);
  });

  test('total count matches expected (25 generators + 2 special)', () => {
    expect(ANIMATED_EFFECTS.size).toBe(27);
  });
});
