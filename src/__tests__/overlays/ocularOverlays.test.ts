import { VisualEffect } from '../../types/visualEffects';
import { createOcularOverlays } from '../../utils/overlays/ocularOverlays';

function makeEffect(id: string, intensity: number): VisualEffect {
  return {
    id,
    name: id,
    enabled: true,
    intensity,
    category: 'ocular' as VisualEffect['category'],
    description: '',
  };
}

function effectsMap(...entries: VisualEffect[]): Map<string, VisualEffect> {
  const map = new Map<string, VisualEffect>();
  for (const e of entries) map.set(e.id, e);
  return map;
}

describe('createOcularOverlays', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // --- Nuclear Cataract ---
  describe('nuclear cataract (cataracts)', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('cataracts', 0.6));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-nuclearCataract');
      expect(overlay).not.toBeNull();
    });

    it('uses overlay blend mode', () => {
      const effects = effectsMap(makeEffect('cataracts', 0.5));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-nuclearCataract');
      expect(overlay!.style.mixBlendMode).toBe('overlay');
    });

    it('caps opacity at 0.7', () => {
      const effects = effectsMap(makeEffect('cataracts', 1.0));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-nuclearCataract');
      expect(parseFloat(overlay!.style.opacity)).toBeLessThanOrEqual(0.7);
    });

    it('sets pointer-events to none', () => {
      const effects = effectsMap(makeEffect('cataracts', 0.5));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-nuclearCataract');
      expect(overlay!.style.pointerEvents).toBe('none');
    });

    it('does not create overlay when effect is disabled', () => {
      const effect: VisualEffect = {
        id: 'cataracts',
        name: 'cataracts',
        enabled: false,
        intensity: 0.5,
        category: 'ocular' as VisualEffect['category'],
        description: '',
      };
      const effects = new Map<string, VisualEffect>();
      effects.set('cataracts', effect);
      createOcularOverlays(effects);

      expect(document.getElementById('visual-field-overlay-nuclearCataract')).toBeNull();
    });
  });

  // --- Posterior Subcapsular Cataract ---
  describe('posteriorSubcapsularCataract', () => {
    it('creates main overlay and child elements', () => {
      const effects = effectsMap(makeEffect('posteriorSubcapsularCataract', 0.7));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-posteriorSubcapsular');
      expect(overlay).not.toBeNull();

      const cloudyPatch = document.getElementById('psc-cloudy-patch');
      expect(cloudyPatch).not.toBeNull();
      expect(cloudyPatch!.style.mixBlendMode).toBe('screen');

      const glareRays = document.getElementById('psc-glare-rays');
      expect(glareRays).not.toBeNull();
      expect(glareRays!.style.filter).toContain('blur');
    });

    it('cloudy patch has screen blend mode', () => {
      const effects = effectsMap(makeEffect('posteriorSubcapsularCataract', 0.5));
      createOcularOverlays(effects);

      const cloudyPatch = document.getElementById('psc-cloudy-patch');
      expect(cloudyPatch!.style.mixBlendMode).toBe('screen');
    });

    it('cloudy patch opacity scales with intensity', () => {
      const effects = effectsMap(makeEffect('posteriorSubcapsularCataract', 0.3));
      createOcularOverlays(effects);

      const cloudyPatch = document.getElementById('psc-cloudy-patch');
      const opacity = parseFloat(cloudyPatch!.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThanOrEqual(0.85);
    });

    it('updates existing elements on re-call', () => {
      const effects = effectsMap(makeEffect('posteriorSubcapsularCataract', 0.3));
      createOcularOverlays(effects);

      // Call again with different intensity
      const effects2 = effectsMap(makeEffect('posteriorSubcapsularCataract', 0.9));
      createOcularOverlays(effects2);

      // Should still have only one of each element
      const overlays = document.querySelectorAll('#visual-field-overlay-posteriorSubcapsular');
      expect(overlays.length).toBe(1);

      const cloudyPatches = document.querySelectorAll('#psc-cloudy-patch');
      expect(cloudyPatches.length).toBe(1);
    });
  });

  // --- Cortical Cataract ---
  describe('corticalCataract', () => {
    it('creates overlay with spoke and haze layers', () => {
      const effects = effectsMap(makeEffect('corticalCataract', 0.6));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-corticalCataract');
      expect(overlay).not.toBeNull();

      const spokeLayer = document.getElementById('cortical-spoke-layer');
      expect(spokeLayer).not.toBeNull();
      expect(spokeLayer!.style.mixBlendMode).toBe('screen');

      const hazeLayer = document.getElementById('cortical-haze-layer');
      expect(hazeLayer).not.toBeNull();
      expect(hazeLayer!.style.mixBlendMode).toBe('screen');
    });

    it('haze layer opacity scales with intensity', () => {
      const effects = effectsMap(makeEffect('corticalCataract', 0.5));
      createOcularOverlays(effects);

      const hazeLayer = document.getElementById('cortical-haze-layer');
      const opacity = parseFloat(hazeLayer!.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThanOrEqual(0.7);
    });

    it('spoke layer has absolute positioning', () => {
      const effects = effectsMap(makeEffect('corticalCataract', 0.5));
      createOcularOverlays(effects);

      const spokeLayer = document.getElementById('cortical-spoke-layer');
      expect(spokeLayer!.style.position).toBe('absolute');
    });
  });

  // --- Keratoconus ---
  describe('keratoconus', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('keratoconus', 0.6));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-keratoconus');
      expect(overlay).not.toBeNull();
    });

    it('uses screen blend mode', () => {
      const effects = effectsMap(makeEffect('keratoconus', 0.5));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-keratoconus');
      expect(overlay!.style.mixBlendMode).toBe('screen');
    });

    it('applies blur filter that scales with intensity', () => {
      const effects = effectsMap(makeEffect('keratoconus', 0.8));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-keratoconus');
      expect(overlay!.style.filter).toContain('blur');
    });

    it('has valid opacity value', () => {
      const effects = effectsMap(makeEffect('keratoconus', 0.5));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-keratoconus');
      const opacity = parseFloat(overlay!.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThanOrEqual(1.0);
    });

    it('overlay has pointer-events none', () => {
      const effects = effectsMap(makeEffect('keratoconus', 0.5));
      createOcularOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-keratoconus');
      expect(overlay!.style.pointerEvents).toBe('none');
    });
  });

  // --- Empty effects ---
  it('does not create any overlays when effects map is empty', () => {
    createOcularOverlays(new Map());
    expect(document.body.children.length).toBe(0);
  });

  // --- Multiple effects ---
  it('can create multiple ocular overlays simultaneously', () => {
    const effects = effectsMap(
      makeEffect('cataracts', 0.5),
      makeEffect('keratoconus', 0.6)
    );
    createOcularOverlays(effects);

    expect(document.getElementById('visual-field-overlay-nuclearCataract')).not.toBeNull();
    expect(document.getElementById('visual-field-overlay-keratoconus')).not.toBeNull();
  });
});
