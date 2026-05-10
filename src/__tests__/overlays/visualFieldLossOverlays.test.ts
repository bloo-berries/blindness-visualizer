import { VisualEffect } from '../../types/visualEffects';
import { createVisualFieldLossOverlays } from '../../utils/overlays/visualFieldLossOverlays';

/** Helper to create a minimal enabled VisualEffect */
function makeEffect(id: string, intensity: number): VisualEffect {
  return {
    id,
    name: id,
    enabled: true,
    intensity,
    category: 'visualField' as VisualEffect['category'],
    description: '',
  };
}

function effectsMap(...entries: VisualEffect[]): Map<string, VisualEffect> {
  const map = new Map<string, VisualEffect>();
  for (const e of entries) map.set(e.id, e);
  return map;
}

describe('createVisualFieldLossOverlays', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // --- Tunnel Vision ---
  describe('tunnelVision', () => {
    it('creates an overlay element in the DOM', () => {
      const effects = effectsMap(makeEffect('tunnelVision', 0.7));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-tunnelVision');
      expect(overlay).not.toBeNull();
    });

    it('uses multiply blend mode', () => {
      const effects = effectsMap(makeEffect('tunnelVision', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-tunnelVision');
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('caps opacity at 0.95', () => {
      const effects = effectsMap(makeEffect('tunnelVision', 1.0));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-tunnelVision');
      expect(parseFloat(overlay!.style.opacity)).toBeLessThanOrEqual(0.95);
    });

    it('sets pointer-events to none', () => {
      const effects = effectsMap(makeEffect('tunnelVision', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-tunnelVision');
      expect(overlay!.style.pointerEvents).toBe('none');
    });

    it('does not create overlay when effect is not in map', () => {
      const effects = effectsMap();
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-tunnelVision');
      expect(overlay).toBeNull();
    });
  });

  // --- Hemianopia Left ---
  describe('hemianopiaLeft', () => {
    it('creates an overlay element', () => {
      const effects = effectsMap(makeEffect('hemianopiaLeft', 0.8));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-hemianopiaLeft');
      expect(overlay).not.toBeNull();
    });

    it('uses normal blend mode at full intensity', () => {
      const effects = effectsMap(makeEffect('hemianopiaLeft', 1.0));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-hemianopiaLeft');
      expect(overlay!.style.mixBlendMode).toBe('normal');
    });

    it('uses multiply blend mode at partial intensity', () => {
      const effects = effectsMap(makeEffect('hemianopiaLeft', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-hemianopiaLeft');
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('sets position to absolute', () => {
      const effects = effectsMap(makeEffect('hemianopiaLeft', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-hemianopiaLeft');
      expect(overlay!.style.position).toBe('absolute');
    });
  });

  // --- Hemianopia Right ---
  describe('hemianopiaRight', () => {
    it('creates an overlay element', () => {
      const effects = effectsMap(makeEffect('hemianopiaRight', 0.6));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-hemianopiaRight');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.pointerEvents).toBe('none');
    });
  });

  // --- Quadrantanopia variants ---
  describe('quadrantanopiaLeft', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaLeft', 0.7));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaLeft');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.position).toBe('absolute');
    });
  });

  describe('quadrantanopiaRight', () => {
    it('creates overlay element with correct blend mode and opacity', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaRight', 0.8));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaRight');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('normal');
      expect(overlay!.style.opacity).toBe('1');
    });
  });

  describe('quadrantanopiaInferiorLeft', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaInferiorLeft', 0.6));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaInferiorLeft');
      expect(overlay).not.toBeNull();
    });

    it('switches to normal blend mode at full intensity', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaInferiorLeft', 1.0));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaInferiorLeft');
      expect(overlay!.style.mixBlendMode).toBe('normal');
      expect(overlay!.style.opacity).toBe('1');
    });
  });

  describe('quadrantanopiaInferiorRight', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaInferiorRight', 0.7));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaInferiorRight');
      expect(overlay).not.toBeNull();
    });
  });

  describe('quadrantanopiaSuperiorLeft', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaSuperiorLeft', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaSuperiorLeft');
      expect(overlay).not.toBeNull();
    });
  });

  describe('quadrantanopiaSuperiorRight', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('quadrantanopiaSuperiorRight', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-quadrantanopiaSuperiorRight');
      expect(overlay).not.toBeNull();
    });
  });

  // --- Blindness ---
  describe('blindnessLeftEye', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('blindnessLeftEye', 0.8));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-blindnessLeftEye');
      expect(overlay).not.toBeNull();
    });

    it('sets opacity to 1 at full intensity', () => {
      const effects = effectsMap(makeEffect('blindnessLeftEye', 1.0));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-blindnessLeftEye');
      expect(overlay!.style.opacity).toBe('1');
    });
  });

  describe('blindnessRightEye', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('blindnessRightEye', 0.6));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-blindnessRightEye');
      expect(overlay).not.toBeNull();
    });
  });

  // --- Bitemporal Hemianopia ---
  describe('bitemporalHemianopia', () => {
    it('creates overlay element', () => {
      const effects = effectsMap(makeEffect('bitemporalHemianopia', 0.7));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-bitemporalHemianopia');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.position).toBe('absolute');
    });
  });

  // --- Scotoma ---
  describe('scotoma', () => {
    it('creates scotoma overlay element', () => {
      const effects = effectsMap(makeEffect('scotoma', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-scotoma');
      expect(overlay).not.toBeNull();
    });

    it('overlay has multiply blend mode', () => {
      const effects = effectsMap(makeEffect('scotoma', 0.5));
      createVisualFieldLossOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-scotoma');
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('opacity changes with different intensity values', () => {
      const effectsLow = effectsMap(makeEffect('scotoma', 0.2));
      createVisualFieldLossOverlays(effectsLow);
      const overlayLow = document.getElementById('visual-field-overlay-scotoma');
      const opacityLow = overlayLow!.style.opacity;

      document.body.innerHTML = '';

      const effectsHigh = effectsMap(makeEffect('scotoma', 0.9));
      createVisualFieldLossOverlays(effectsHigh);
      const overlayHigh = document.getElementById('visual-field-overlay-scotoma');
      const opacityHigh = overlayHigh!.style.opacity;

      // Different intensities should produce different opacities
      expect(opacityLow).not.toBe(opacityHigh);
    });
  });

  // --- Multiple effects at once ---
  it('can create multiple overlays simultaneously', () => {
    const effects = effectsMap(
      makeEffect('tunnelVision', 0.5),
      makeEffect('hemianopiaLeft', 0.7),
      makeEffect('scotoma', 0.3)
    );
    createVisualFieldLossOverlays(effects);

    expect(document.getElementById('visual-field-overlay-tunnelVision')).not.toBeNull();
    expect(document.getElementById('visual-field-overlay-hemianopiaLeft')).not.toBeNull();
    expect(document.getElementById('visual-field-overlay-scotoma')).not.toBeNull();
  });

  it('does not create overlays when effects map is empty', () => {
    createVisualFieldLossOverlays(new Map());
    expect(document.body.children.length).toBe(0);
  });
});
