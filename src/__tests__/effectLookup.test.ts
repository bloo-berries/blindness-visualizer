import { createEffectMap, getEffectById, getFirstEnabledEffect } from '../utils/effectLookup';
import { VisualEffect } from '../types/visualEffects';

const mockEffects: VisualEffect[] = [
  { id: 'protanopia' as any, name: 'Protanopia', enabled: false, intensity: 0.75, description: 'Red-blind' },
  { id: 'deuteranopia' as any, name: 'Deuteranopia', enabled: true, intensity: 0.5, description: 'Green-blind' },
  { id: 'tritanopia' as any, name: 'Tritanopia', enabled: true, intensity: 1.0, description: 'Blue-blind' },
];

describe('effectLookup', () => {
  describe('createEffectMap', () => {
    test('creates a Map from effects array', () => {
      const map = createEffectMap(mockEffects);
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBe(mockEffects.length);
    });

    test('maps effect IDs to effect objects', () => {
      const map = createEffectMap(mockEffects);
      expect(map.get('protanopia')).toBe(mockEffects[0]);
      expect(map.get('deuteranopia')).toBe(mockEffects[1]);
    });

    test('returns empty Map for empty array', () => {
      const map = createEffectMap([]);
      expect(map.size).toBe(0);
    });
  });

  describe('getEffectById', () => {
    const map = createEffectMap(mockEffects);

    test('returns effect for valid ID', () => {
      const effect = getEffectById(map, 'protanopia');
      expect(effect).toBe(mockEffects[0]);
    });

    test('returns undefined for invalid ID', () => {
      const effect = getEffectById(map, 'nonexistent');
      expect(effect).toBeUndefined();
    });
  });

  describe('getFirstEnabledEffect', () => {
    test('returns first enabled effect matching predicate', () => {
      const result = getFirstEnabledEffect(mockEffects, e => e.intensity >= 0.5);
      expect(result).toBe(mockEffects[1]); // deuteranopia is first enabled with intensity >= 0.5
    });

    test('skips disabled effects even if predicate matches', () => {
      const result = getFirstEnabledEffect(mockEffects, e => e.id === ('protanopia' as any));
      expect(result).toBeUndefined(); // protanopia is disabled
    });

    test('returns undefined when no enabled effect matches', () => {
      const result = getFirstEnabledEffect(mockEffects, e => e.intensity > 1.5);
      expect(result).toBeUndefined();
    });

    test('returns undefined for empty array', () => {
      const result = getFirstEnabledEffect([], () => true);
      expect(result).toBeUndefined();
    });
  });
});
