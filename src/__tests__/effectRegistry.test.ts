import { VISUAL_EFFECTS, createDefaultEffects } from '../data/visualEffects';
import { allEffects } from '../data/effects';

describe('Effect Registry', () => {
  test('VISUAL_EFFECTS contains all aggregated effects', () => {
    expect(VISUAL_EFFECTS).toBe(allEffects);
    expect(VISUAL_EFFECTS.length).toBeGreaterThan(0);
  });

  test('every effect has required fields', () => {
    for (const effect of VISUAL_EFFECTS) {
      expect(effect).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
        })
      );
      expect(effect.id.length).toBeGreaterThan(0);
      expect(effect.name.length).toBeGreaterThan(0);
    }
  });

  test('no duplicate effect IDs', () => {
    const ids = VISUAL_EFFECTS.map(e => e.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  test('createDefaultEffects returns all effects disabled at zero intensity', () => {
    const defaults = createDefaultEffects();
    expect(defaults.length).toBe(VISUAL_EFFECTS.length);
    for (const effect of defaults) {
      expect(effect.enabled).toBe(false);
      expect(effect.intensity).toBe(0.0);
    }
  });

  test('createDefaultEffects preserves effect metadata', () => {
    const defaults = createDefaultEffects();
    for (let i = 0; i < defaults.length; i++) {
      expect(defaults[i].id).toBe(VISUAL_EFFECTS[i].id);
      expect(defaults[i].name).toBe(VISUAL_EFFECTS[i].name);
      expect(defaults[i].description).toBe(VISUAL_EFFECTS[i].description);
    }
  });

  test('createDefaultEffects returns a new array each call', () => {
    const a = createDefaultEffects();
    const b = createDefaultEffects();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
