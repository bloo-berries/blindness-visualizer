import { VisualEffect } from '../../types/visualEffects';
import { createVisualDisturbanceOverlays } from '../../utils/overlays/visualDisturbanceOverlays';
import { createFloaterOverlay } from '../../utils/overlays/visualDisturbanceOverlays/floaterOverlays';
import {
  createVisualSnowOverlay,
  createVisualSnowFlashingOverlay,
  createVisualSnowColoredOverlay,
  createVisualSnowTransparentOverlay,
  createVisualSnowDenseOverlay,
} from '../../utils/overlays/visualDisturbanceOverlays/visualSnowOverlays';
import {
  createVisualAuraOverlay,
  createVisualAuraLeftOverlay,
  createVisualAuraRightOverlay,
} from '../../utils/overlays/visualDisturbanceOverlays/auraOverlays';
import { createBlueFieldOverlay } from '../../utils/overlays/visualDisturbanceOverlays/blueFieldOverlays';
import { ContainerFinder } from '../../utils/overlays/visualDisturbanceOverlays/types';

function makeEffect(intensity: number): VisualEffect {
  return {
    id: 'test',
    name: 'test',
    enabled: true,
    intensity,
    category: 'visualDisturbance' as VisualEffect['category'],
    description: '',
  };
}

/** A simple container finder that returns a test container */
function makeContainerFinder(): { finder: ContainerFinder; container: HTMLElement } {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const finder: ContainerFinder = () => container;
  return { finder, container };
}

describe('Visual Disturbance Overlays', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    // Clean up any style elements injected into head
    document.querySelectorAll('style[id]').forEach(el => el.remove());
  });

  // --- Floater Overlay ---
  describe('createFloaterOverlay', () => {
    it('creates floater overlay with main and depth layers', () => {
      const { finder } = makeContainerFinder();
      createFloaterOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualFloaters');
      expect(overlay).not.toBeNull();

      const mainLayer = document.getElementById('visual-floaters-main-layer');
      expect(mainLayer).not.toBeNull();

      const depthLayer = document.getElementById('visual-floaters-depth-layer');
      expect(depthLayer).not.toBeNull();
    });

    it('injects CSS animation styles', () => {
      const { finder } = makeContainerFinder();
      createFloaterOverlay(makeEffect(0.5), finder);

      const style = document.getElementById('floater-animations');
      expect(style).not.toBeNull();
      expect(style!.textContent).toContain('floaterDrift');
    });

    it('main layer has absolute positioning', () => {
      const { finder } = makeContainerFinder();
      createFloaterOverlay(makeEffect(0.5), finder);

      const mainLayer = document.getElementById('visual-floaters-main-layer');
      expect(mainLayer!.style.position).toBe('absolute');
    });

    it('does not create overlay when effect is disabled', () => {
      const { finder } = makeContainerFinder();
      const effect = makeEffect(0.5);
      effect.enabled = false;
      createFloaterOverlay(effect, finder);

      expect(document.getElementById('visual-field-overlay-visualFloaters')).toBeNull();
    });

    it('does not create overlay when effect is undefined', () => {
      const { finder } = makeContainerFinder();
      createFloaterOverlay(undefined, finder);

      expect(document.getElementById('visual-field-overlay-visualFloaters')).toBeNull();
    });
  });

  // --- Visual Snow ---
  describe('createVisualSnowOverlay', () => {
    it('creates overlay with static dots layers', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnow');
      expect(overlay).not.toBeNull();

      expect(document.getElementById('visual-snow-static-dots')).not.toBeNull();
      expect(document.getElementById('visual-snow-static-dots-2')).not.toBeNull();
    });

    it('creates blue field and photopsia layers', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowOverlay(makeEffect(0.7), finder);

      expect(document.getElementById('visual-snow-blue-field')).not.toBeNull();
      expect(document.getElementById('visual-snow-photopsia')).not.toBeNull();
    });

    it('creates contrast reduction layer with overlay blend mode', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowOverlay(makeEffect(0.5), finder);

      const contrastLayer = document.getElementById('visual-snow-contrast');
      expect(contrastLayer).not.toBeNull();
      expect(contrastLayer!.style.mixBlendMode).toBe('overlay');
    });

    it('injects animation styles', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowOverlay(makeEffect(0.5), finder);

      const style = document.getElementById('visual-snow-animations');
      expect(style).not.toBeNull();
      expect(style!.textContent).toContain('blueFieldShoot');
      expect(style!.textContent).toContain('photopsiaFlash');
    });
  });

  describe('createVisualSnowFlashingOverlay', () => {
    it('creates overlay with flashing dots', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowFlashingOverlay(makeEffect(0.6), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowFlashing');
      expect(overlay).not.toBeNull();

      const dotsLayer = document.getElementById('visual-snow-flashing-dots');
      expect(dotsLayer).not.toBeNull();
      expect(dotsLayer!.style.animation).toContain('visualSnowFlicker');
    });

    it('sets pointer-events to none on main overlay', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowFlashingOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowFlashing');
      expect(overlay!.style.pointerEvents).toBe('none');
    });
  });

  describe('createVisualSnowColoredOverlay', () => {
    it('creates overlay with colored dots layer', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowColoredOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowColored');
      expect(overlay).not.toBeNull();

      const dotsLayer = document.getElementById('visual-snow-colored-dots');
      expect(dotsLayer).not.toBeNull();
      expect(dotsLayer!.style.position).toBe('absolute');
    });

    it('overlay has pointer-events none', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowColoredOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowColored');
      expect(overlay!.style.pointerEvents).toBe('none');
    });
  });

  describe('createVisualSnowTransparentOverlay', () => {
    it('creates overlay with transparent dots and glass layer', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowTransparentOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowTransparent');
      expect(overlay).not.toBeNull();

      expect(document.getElementById('visual-snow-transparent-dots')).not.toBeNull();

      const glass = document.getElementById('visual-snow-transparent-glass');
      expect(glass).not.toBeNull();
      expect(glass!.style.mixBlendMode).toBe('overlay');
    });
  });

  describe('createVisualSnowDenseOverlay', () => {
    it('creates overlay with three dense dot layers and contrast layer', () => {
      const { finder } = makeContainerFinder();
      createVisualSnowDenseOverlay(makeEffect(0.6), finder);

      const overlay = document.getElementById('visual-field-overlay-visualSnowDense');
      expect(overlay).not.toBeNull();

      expect(document.getElementById('visual-snow-dense-dots-1')).not.toBeNull();
      expect(document.getElementById('visual-snow-dense-dots-2')).not.toBeNull();
      expect(document.getElementById('visual-snow-dense-dots-3')).not.toBeNull();

      const contrastLayer = document.getElementById('visual-snow-dense-contrast');
      expect(contrastLayer).not.toBeNull();
      expect(contrastLayer!.style.mixBlendMode).toBe('overlay');
    });
  });

  // --- Visual Aura ---
  describe('createVisualAuraOverlay', () => {
    it('creates overlay with scotoma, zigzag, and bright edge layers', () => {
      const { finder } = makeContainerFinder();
      createVisualAuraOverlay(makeEffect(0.7), finder);

      const overlay = document.getElementById('visual-field-overlay-visualAura');
      expect(overlay).not.toBeNull();

      expect(document.getElementById('aura-scotoma-layer')).not.toBeNull();
      expect(document.getElementById('aura-zigzag-layer')).not.toBeNull();
      expect(document.getElementById('aura-bright-edge-layer')).not.toBeNull();
    });

    it('scotoma layer uses multiply blend mode', () => {
      const { finder } = makeContainerFinder();
      createVisualAuraOverlay(makeEffect(0.5), finder);

      const scotomaLayer = document.getElementById('aura-scotoma-layer');
      expect(scotomaLayer!.style.mixBlendMode).toBe('multiply');
    });

    it('zigzag layer uses screen blend mode', () => {
      const { finder } = makeContainerFinder();
      createVisualAuraOverlay(makeEffect(0.6), finder);

      const zigzagLayer = document.getElementById('aura-zigzag-layer');
      expect(zigzagLayer!.style.mixBlendMode).toBe('screen');
      expect(zigzagLayer!.style.animation).toContain('auraScintillate');
    });

    it('bright edge layer uses screen blend mode', () => {
      const { finder } = makeContainerFinder();
      createVisualAuraOverlay(makeEffect(0.6), finder);

      const brightEdge = document.getElementById('aura-bright-edge-layer');
      expect(brightEdge!.style.mixBlendMode).toBe('screen');
      expect(brightEdge!.style.animation).toContain('auraFlicker');
    });

    it('injects aura-specific animation styles', () => {
      const { finder } = makeContainerFinder();
      createVisualAuraOverlay(makeEffect(0.5), finder);

      const style = document.getElementById('aura-animations');
      expect(style).not.toBeNull();
      expect(style!.textContent).toContain('auraScintillate');
      expect(style!.textContent).toContain('auraFlicker');
    });

    it('does not create overlay when disabled', () => {
      const { finder } = makeContainerFinder();
      const disabled = makeEffect(0.5);
      disabled.enabled = false;
      createVisualAuraOverlay(disabled, finder);

      expect(document.getElementById('visual-field-overlay-visualAura')).toBeNull();
    });
  });

  describe('createVisualAuraLeftOverlay', () => {
    it('creates overlay element', () => {
      createVisualAuraLeftOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-visualAuraLeft');
      expect(overlay).not.toBeNull();
    });

    it('uses screen blend mode', () => {
      createVisualAuraLeftOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-visualAuraLeft');
      expect(overlay!.style.mixBlendMode).toBe('screen');
    });

    it('does not create when disabled', () => {
      const disabled = makeEffect(0.5);
      disabled.enabled = false;
      createVisualAuraLeftOverlay(disabled);

      expect(document.getElementById('visual-field-overlay-visualAuraLeft')).toBeNull();
    });
  });

  describe('createVisualAuraRightOverlay', () => {
    it('creates overlay element', () => {
      createVisualAuraRightOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-visualAuraRight');
      expect(overlay).not.toBeNull();
    });

    it('uses screen blend mode', () => {
      createVisualAuraRightOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-visualAuraRight');
      expect(overlay!.style.mixBlendMode).toBe('screen');
    });
  });

  // --- Blue Field ---
  describe('createBlueFieldOverlay', () => {
    it('creates overlay with sprite elements', () => {
      const { finder } = makeContainerFinder();
      createBlueFieldOverlay(makeEffect(0.5), finder);

      const overlay = document.getElementById('visual-field-overlay-blueField');
      expect(overlay).not.toBeNull();

      // Should have created sprite elements
      const sprites = overlay!.querySelectorAll('.blue-field-sprite');
      expect(sprites.length).toBeGreaterThan(0);
    });

    it('sprite count scales with intensity', () => {
      const { finder: finderLow } = makeContainerFinder();
      createBlueFieldOverlay(makeEffect(0.2), finderLow);
      const overlayLow = document.getElementById('visual-field-overlay-blueField');
      const spritesLow = overlayLow!.querySelectorAll('.blue-field-sprite').length;

      document.body.innerHTML = '';
      document.querySelectorAll('style[id]').forEach(el => el.remove());

      const { finder: finderHigh } = makeContainerFinder();
      createBlueFieldOverlay(makeEffect(1.0), finderHigh);
      const overlayHigh = document.getElementById('visual-field-overlay-blueField');
      const spritesHigh = overlayHigh!.querySelectorAll('.blue-field-sprite').length;

      expect(spritesHigh).toBeGreaterThan(spritesLow);
    });

    it('injects blue field animation styles', () => {
      const { finder } = makeContainerFinder();
      createBlueFieldOverlay(makeEffect(0.5), finder);

      const style = document.getElementById('blue-field-animations');
      expect(style).not.toBeNull();
      expect(style!.textContent).toContain('blueFieldSprite');
    });

    it('sprites have border-radius 50%', () => {
      const { finder } = makeContainerFinder();
      createBlueFieldOverlay(makeEffect(0.5), finder);

      const sprite = document.getElementById('blue-field-sprite-0');
      expect(sprite).not.toBeNull();
      expect(sprite!.style.borderRadius).toBe('50%');
    });

    it('does not create when effect is disabled', () => {
      const { finder } = makeContainerFinder();
      const disabled = makeEffect(0.5);
      disabled.enabled = false;
      createBlueFieldOverlay(disabled, finder);

      expect(document.getElementById('visual-field-overlay-blueField')).toBeNull();
    });
  });

  // --- Aggregate function ---
  describe('createVisualDisturbanceOverlays', () => {
    it('creates overlays for all enabled disturbance effects', () => {
      const effects = new Map<string, VisualEffect>();
      effects.set('visualFloaters', { ...makeEffect(0.5), id: 'visualFloaters' });
      effects.set('visualSnow', { ...makeEffect(0.4), id: 'visualSnow' });

      createVisualDisturbanceOverlays(effects);

      expect(document.getElementById('visual-field-overlay-visualFloaters')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-visualSnow')).not.toBeNull();
    });

    it('does not create overlays for missing effects', () => {
      createVisualDisturbanceOverlays(new Map());

      expect(document.getElementById('visual-field-overlay-visualFloaters')).toBeNull();
      expect(document.getElementById('visual-field-overlay-visualSnow')).toBeNull();
    });
  });
});
