import { EffectProcessor } from '../utils/performance/EffectProcessor';
import { VisualEffect } from '../types/visualEffects';

const makeEffect = (id: string, enabled = false, intensity = 0.5): VisualEffect => ({
  id: id as any,
  name: `Effect ${id}`,
  enabled,
  intensity,
  description: `Description for ${id}`,
});

describe('EffectProcessor', () => {
  let processor: EffectProcessor;

  beforeEach(() => {
    processor = new EffectProcessor();
  });

  describe('updateEffects', () => {
    test('reports changed=true on first call', () => {
      const effects = [makeEffect('protanopia'), makeEffect('deuteranopia')];
      const result = processor.updateEffects(effects);
      expect(result.changed).toBe(true);
    });

    test('reports changed=false when called with identical effects', () => {
      const effects = [makeEffect('protanopia'), makeEffect('deuteranopia')];
      processor.updateEffects(effects);
      const result = processor.updateEffects(effects);
      expect(result.changed).toBe(false);
    });

    test('reports changed=true when an effect is toggled', () => {
      const effects = [makeEffect('protanopia', false)];
      processor.updateEffects(effects);

      const updated = [makeEffect('protanopia', true)];
      const result = processor.updateEffects(updated);
      expect(result.changed).toBe(true);
    });

    test('reports changed=true when intensity changes', () => {
      const effects = [makeEffect('protanopia', true, 0.5)];
      processor.updateEffects(effects);

      const updated = [makeEffect('protanopia', true, 0.75)];
      const result = processor.updateEffects(updated);
      expect(result.changed).toBe(true);
    });

    test('filters to only enabled effects', () => {
      const effects = [
        makeEffect('protanopia', true),
        makeEffect('deuteranopia', false),
        makeEffect('tritanopia', true),
      ];
      const result = processor.updateEffects(effects);
      expect(result.enabledEffects.length).toBe(2);
      expect(result.enabledEffects.map(e => e.id)).toEqual(['protanopia', 'tritanopia']);
    });

    test('builds an effectMap with all effects', () => {
      const effects = [makeEffect('protanopia'), makeEffect('deuteranopia')];
      const result = processor.updateEffects(effects);
      expect(result.effectMap.size).toBe(2);
      expect(result.effectMap.get('protanopia')).toBeDefined();
    });
  });

  describe('getEffect', () => {
    test('returns effect by ID after update', () => {
      const effects = [makeEffect('protanopia', true, 0.75)];
      processor.updateEffects(effects);
      const effect = processor.getEffect('protanopia');
      expect(effect).toBeDefined();
      expect(effect!.intensity).toBe(0.75);
    });

    test('returns undefined for unknown ID', () => {
      processor.updateEffects([makeEffect('protanopia')]);
      expect(processor.getEffect('nonexistent')).toBeUndefined();
    });

    test('returns undefined before any update', () => {
      expect(processor.getEffect('protanopia')).toBeUndefined();
    });
  });

  describe('getEffects', () => {
    test('returns array of effects for given IDs', () => {
      const effects = [makeEffect('a'), makeEffect('b'), makeEffect('c')];
      processor.updateEffects(effects);
      const result = processor.getEffects(['a', 'c']);
      expect(result.length).toBe(2);
      expect(result[0]!.id).toBe('a');
      expect(result[1]!.id).toBe('c');
    });

    test('returns undefined for missing IDs', () => {
      processor.updateEffects([makeEffect('a')]);
      const result = processor.getEffects(['a', 'missing']);
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeUndefined();
    });
  });

  describe('getEnabledEffects', () => {
    test('returns cached enabled effects', () => {
      const effects = [makeEffect('a', true), makeEffect('b', false)];
      processor.updateEffects(effects);
      const enabled = processor.getEnabledEffects();
      expect(enabled.length).toBe(1);
      expect(enabled[0].id).toBe('a');
    });

    test('returns empty array before any update', () => {
      expect(processor.getEnabledEffects()).toEqual([]);
    });
  });

  describe('hasEnabledEffect', () => {
    test('returns true when a matching enabled effect exists', () => {
      const effects = [makeEffect('protanopia', true, 0.75)];
      processor.updateEffects(effects);
      expect(processor.hasEnabledEffect(e => e.id === ('protanopia' as any))).toBe(true);
    });

    test('returns false for disabled effects', () => {
      const effects = [makeEffect('protanopia', false)];
      processor.updateEffects(effects);
      expect(processor.hasEnabledEffect(e => e.id === ('protanopia' as any))).toBe(false);
    });

    test('returns false when no effects match', () => {
      const effects = [makeEffect('protanopia', true)];
      processor.updateEffects(effects);
      expect(processor.hasEnabledEffect(e => e.id === ('nonexistent' as any))).toBe(false);
    });
  });
});
