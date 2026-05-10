import { VisualEffect } from '../../types/visualEffects';
import { createRetinalDiseaseOverlays } from '../../utils/overlays/retinalDiseaseOverlays';
import { createGlaucomaOverlay } from '../../utils/overlays/retinalDiseaseOverlays/glaucomaOverlay';
import { createAmdOverlay } from '../../utils/overlays/retinalDiseaseOverlays/amdOverlay';
import { createStargardtOverlay } from '../../utils/overlays/retinalDiseaseOverlays/stargardtOverlay';
import { createDiabeticRetinopathyOverlay } from '../../utils/overlays/retinalDiseaseOverlays/diabeticRetinopathyOverlay';
import { createRetinalDetachmentOverlay } from '../../utils/overlays/retinalDiseaseOverlays/retinalDetachmentOverlay';
import { createRetinitisPigmentosaOverlay } from '../../utils/overlays/retinalDiseaseOverlays/retinitisPigmentosaOverlay';
import { createVitreousHemorrhageOverlay } from '../../utils/overlays/retinalDiseaseOverlays/vitreousHemorrhageOverlay';

function makeEffect(intensity: number): VisualEffect {
  return {
    id: 'test',
    name: 'test',
    enabled: true,
    intensity,
    category: 'retinal' as VisualEffect['category'],
    description: '',
  };
}

function makeDisabledEffect(): VisualEffect {
  return {
    id: 'test',
    name: 'test',
    enabled: false,
    intensity: 0.5,
    category: 'retinal' as VisualEffect['category'],
    description: '',
  };
}

describe('Retinal Disease Overlays', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // --- Glaucoma ---
  describe('createGlaucomaOverlay', () => {
    it('creates an overlay element', () => {
      createGlaucomaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay).not.toBeNull();
    });

    it('uses normal blend mode', () => {
      createGlaucomaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay!.style.mixBlendMode).toBe('normal');
    });

    it('applies blur and contrast filters', () => {
      createGlaucomaOverlay(makeEffect(0.7));

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay!.style.filter).toContain('blur');
      expect(overlay!.style.filter).toContain('contrast');
      expect(overlay!.style.filter).toContain('brightness');
    });

    it('does not create overlay when effect is disabled', () => {
      createGlaucomaOverlay(makeDisabledEffect());
      expect(document.getElementById('visual-field-overlay-glaucoma')).toBeNull();
    });

    it('does not create overlay when effect is undefined', () => {
      createGlaucomaOverlay(undefined);
      expect(document.getElementById('visual-field-overlay-glaucoma')).toBeNull();
    });

    it('sets position to absolute', () => {
      createGlaucomaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay!.style.position).toBe('absolute');
    });

    it('sets pointer-events to none', () => {
      createGlaucomaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay!.style.pointerEvents).toBe('none');
    });

    it('accepts optional container parameter', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      createGlaucomaOverlay(makeEffect(0.5), container);

      const overlay = document.getElementById('visual-field-overlay-glaucoma');
      expect(overlay).not.toBeNull();
    });
  });

  // --- AMD ---
  describe('createAmdOverlay', () => {
    it('creates an overlay element', () => {
      createAmdOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-amd');
      expect(overlay).not.toBeNull();
    });

    it('applies contrast and saturation filters', () => {
      createAmdOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-amd');
      expect(overlay!.style.filter).toContain('contrast');
      expect(overlay!.style.filter).toContain('saturate');
    });

    it('caps opacity at 0.95', () => {
      createAmdOverlay(makeEffect(1.0));

      const overlay = document.getElementById('visual-field-overlay-amd');
      expect(parseFloat(overlay!.style.opacity)).toBeLessThanOrEqual(0.95);
    });

    it('does not create when effect is undefined', () => {
      createAmdOverlay(undefined);
      expect(document.getElementById('visual-field-overlay-amd')).toBeNull();
    });

    it('sets position to absolute', () => {
      createAmdOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-amd');
      expect(overlay!.style.position).toBe('absolute');
    });
  });

  // --- Stargardt ---
  describe('createStargardtOverlay', () => {
    it('creates an overlay element', () => {
      createStargardtOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-stargardt');
      expect(overlay).not.toBeNull();
    });

    it('applies sepia, saturate, and contrast filters', () => {
      createStargardtOverlay(makeEffect(0.7));

      const overlay = document.getElementById('visual-field-overlay-stargardt');
      expect(overlay!.style.filter).toContain('saturate');
      expect(overlay!.style.filter).toContain('sepia');
      expect(overlay!.style.filter).toContain('contrast');
    });

    it('does not create when disabled', () => {
      createStargardtOverlay(makeDisabledEffect());
      expect(document.getElementById('visual-field-overlay-stargardt')).toBeNull();
    });

    it('uses normal blend mode', () => {
      createStargardtOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-stargardt');
      expect(overlay!.style.mixBlendMode).toBe('normal');
    });
  });

  // --- Diabetic Retinopathy ---
  describe('createDiabeticRetinopathyOverlay', () => {
    it('creates an overlay element', () => {
      createDiabeticRetinopathyOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-diabeticRetinopathy');
      expect(overlay).not.toBeNull();
    });

    it('caps opacity at 0.9', () => {
      createDiabeticRetinopathyOverlay(makeEffect(1.0));

      const overlay = document.getElementById('visual-field-overlay-diabeticRetinopathy');
      expect(parseFloat(overlay!.style.opacity)).toBeLessThanOrEqual(0.9);
    });

    it('applies multiple filters', () => {
      createDiabeticRetinopathyOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-diabeticRetinopathy');
      expect(overlay!.style.filter).toContain('blur');
      expect(overlay!.style.filter).toContain('brightness');
      expect(overlay!.style.filter).toContain('sepia');
    });

    it('uses normal blend mode', () => {
      createDiabeticRetinopathyOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-diabeticRetinopathy');
      expect(overlay!.style.mixBlendMode).toBe('normal');
    });
  });

  // --- Retinal Detachment ---
  describe('createRetinalDetachmentOverlay', () => {
    it('creates an overlay element', () => {
      createRetinalDetachmentOverlay(makeEffect(0.7));

      const overlay = document.getElementById('visual-field-overlay-retinalDetachment');
      expect(overlay).not.toBeNull();
    });

    it('uses multiply blend mode', () => {
      createRetinalDetachmentOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-retinalDetachment');
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('applies blur and hue-rotate filters', () => {
      createRetinalDetachmentOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-retinalDetachment');
      expect(overlay!.style.filter).toContain('blur');
      expect(overlay!.style.filter).toContain('hue-rotate');
    });

    it('caps opacity at 0.8', () => {
      createRetinalDetachmentOverlay(makeEffect(1.0));

      const overlay = document.getElementById('visual-field-overlay-retinalDetachment');
      expect(parseFloat(overlay!.style.opacity)).toBeLessThanOrEqual(0.8);
    });
  });

  // --- Retinitis Pigmentosa ---
  describe('createRetinitisPigmentosaOverlay', () => {
    it('creates overlay element', () => {
      createRetinitisPigmentosaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-retinitisPigmentosa');
      expect(overlay).not.toBeNull();
    });

    it('uses normal blend mode', () => {
      createRetinitisPigmentosaOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-retinitisPigmentosa');
      expect(overlay!.style.mixBlendMode).toBe('normal');
    });

    it('applies desaturation and contrast filters', () => {
      createRetinitisPigmentosaOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-retinitisPigmentosa');
      expect(overlay!.style.filter).toContain('saturate');
      expect(overlay!.style.filter).toContain('contrast');
      expect(overlay!.style.filter).toContain('brightness');
    });

    it('does not create when effect is undefined', () => {
      createRetinitisPigmentosaOverlay(undefined);
      expect(document.getElementById('visual-field-overlay-retinitisPigmentosa')).toBeNull();
    });
  });

  // --- Vitreous Hemorrhage ---
  describe('createVitreousHemorrhageOverlay', () => {
    it('creates an overlay element', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      expect(overlay).not.toBeNull();
    });

    it('uses multiply blend mode', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('stores floater data as data attribute', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.6));

      const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      const floatersData = overlay!.getAttribute('data-floaters');
      expect(floatersData).not.toBeNull();

      const parsed = JSON.parse(floatersData!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });

    it('stores intensity as data attribute', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.7));

      const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      expect(overlay!.getAttribute('data-intensity')).toBe('0.7');
    });

    it('adds animated class', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.5));

      const overlay = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      expect(overlay!.classList.contains('vitreous-hemorrhage-animated')).toBe(true);
    });

    it('floater count increases with intensity', () => {
      createVitreousHemorrhageOverlay(makeEffect(0.2));
      const overlayLow = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      const dataLow = JSON.parse(overlayLow!.getAttribute('data-floaters')!);

      document.body.innerHTML = '';

      createVitreousHemorrhageOverlay(makeEffect(0.9));
      const overlayHigh = document.getElementById('visual-field-overlay-vitreousHemorrhage');
      const dataHigh = JSON.parse(overlayHigh!.getAttribute('data-floaters')!);

      expect(dataHigh.length).toBeGreaterThanOrEqual(dataLow.length);
    });
  });

  // --- Aggregate function ---
  describe('createRetinalDiseaseOverlays', () => {
    it('creates overlays for all enabled retinal effects', () => {
      const effects = new Map<string, VisualEffect>();
      effects.set('glaucoma', { ...makeEffect(0.5), id: 'glaucoma' });
      effects.set('amd', { ...makeEffect(0.6), id: 'amd' });
      effects.set('diabeticRetinopathy', { ...makeEffect(0.4), id: 'diabeticRetinopathy' });

      createRetinalDiseaseOverlays(effects);

      expect(document.getElementById('visual-field-overlay-glaucoma')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-amd')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-diabeticRetinopathy')).not.toBeNull();
    });

    it('does not create overlays for missing effects', () => {
      createRetinalDiseaseOverlays(new Map());

      expect(document.getElementById('visual-field-overlay-glaucoma')).toBeNull();
      expect(document.getElementById('visual-field-overlay-amd')).toBeNull();
    });

    it('creates overlays for stargardt and retinitisPigmentosa', () => {
      const effects = new Map<string, VisualEffect>();
      effects.set('stargardt', { ...makeEffect(0.5), id: 'stargardt' });
      effects.set('retinitisPigmentosa', { ...makeEffect(0.6), id: 'retinitisPigmentosa' });

      createRetinalDiseaseOverlays(effects);

      expect(document.getElementById('visual-field-overlay-stargardt')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-retinitisPigmentosa')).not.toBeNull();
    });
  });
});
