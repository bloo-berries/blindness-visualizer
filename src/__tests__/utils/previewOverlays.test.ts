/**
 * Tests for preview overlay generators
 * (src/components/ControlPanel/previewOverlays/)
 */

// Mock the CBS hallucinations module used by visualDisturbancePreview
// Note: The hallucinations preview depends on the CBS hallucinations module
// which uses a complex barrel re-export pattern that is difficult to mock.
// The hallucinations test is skipped here; CBS hallucinations are covered
// by their own dedicated test suite in src/__tests__/overlays/.

import { generatePreviewOverlayStyle } from '../../components/ControlPanel/previewOverlays/generatePreviewOverlayStyle';
import { generateVisualFieldLossPreviewStyle } from '../../components/ControlPanel/previewOverlays/visualFieldLossPreview';
import { generateVisualDisturbancePreviewStyle } from '../../components/ControlPanel/previewOverlays/visualDisturbancePreview';
import { generateRetinalDiseasePreviewStyle } from '../../components/ControlPanel/previewOverlays/retinalDiseasePreview';
import { generateFamousPeoplePreviewStyle } from '../../components/ControlPanel/previewOverlays/famousPeoplePreview';
import { generateSymptomPreviewStyle } from '../../components/ControlPanel/previewOverlays/symptomPreview';
import { VisualEffect, ConditionType } from '../../types/visualEffects';

const createEffect = (id: string, intensity: number = 0.5): VisualEffect => ({
  id: id as ConditionType,
  name: id,
  enabled: true,
  intensity,
  description: `${id} effect`,
});

describe('generateVisualFieldLossPreviewStyle', () => {
  test('blindnessLeftEye returns a left-to-right gradient', () => {
    const result = generateVisualFieldLossPreviewStyle('blindnessLeftEye' as ConditionType, 0.8, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to right');
  });

  test('blindnessRightEye returns a right-to-left gradient', () => {
    const result = generateVisualFieldLossPreviewStyle('blindnessRightEye' as ConditionType, 0.8, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to left');
  });

  test('tunnelVision returns a radial gradient', () => {
    const result = generateVisualFieldLossPreviewStyle('tunnelVision' as ConditionType, 0.6, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
  });

  test('hemianopiaLeft returns a left-half gradient', () => {
    const result = generateVisualFieldLossPreviewStyle('hemianopiaLeft' as ConditionType, 1.0, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to right');
  });

  test('hemianopiaRight returns a right-half gradient', () => {
    const result = generateVisualFieldLossPreviewStyle('hemianopiaRight' as ConditionType, 1.0, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to left');
  });

  test('bitemporalHemianopia returns gradient with both sides', () => {
    const result = generateVisualFieldLossPreviewStyle('bitemporalHemianopia' as ConditionType, 0.7, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to right');
  });

  test('scotoma includes puckering waves at higher intensity', () => {
    const result = generateVisualFieldLossPreviewStyle('scotoma' as ConditionType, 0.8, Date.now());
    expect(result).not.toBeNull();
    // At intensity 0.8 (>0.2), puckering waves should be generated
    expect(result!.background).toContain('radial-gradient');
  });

  test('returns null for unknown condition', () => {
    const result = generateVisualFieldLossPreviewStyle('protanopia' as ConditionType, 0.5, Date.now());
    expect(result).toBeNull();
  });

  test('quadrantanopia conditions return radial gradients', () => {
    for (const condition of ['quadrantanopiaRight', 'quadrantanopiaInferior', 'quadrantanopiaSuperior'] as ConditionType[]) {
      const result = generateVisualFieldLossPreviewStyle(condition, 0.7, Date.now());
      expect(result).not.toBeNull();
      expect(result!.background).toContain('radial-gradient');
    }
  });
});

describe('generateVisualDisturbancePreviewStyle', () => {
  test('visualFloaters returns a gradient with floater shapes (fallback)', () => {
    const result = generateVisualDisturbancePreviewStyle('visualFloaters' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('visualSnow returns a dot pattern with overlay blend', () => {
    const result = generateVisualDisturbancePreviewStyle('visualSnow' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toBeTruthy();
    expect(result!.mixBlendMode).toBe('overlay');
  });

  // Hallucinations test skipped — requires complex CBS module mock.
  // Covered by src/__tests__/overlays/cbsHallucinations.test.ts.

  test('blueFieldPhenomena returns styles with bright white dots', () => {
    const result = generateVisualDisturbancePreviewStyle('blueFieldPhenomena' as ConditionType, 0.6, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('rgba(255,255,255');
  });

  test('visualAura returns a style with blur filter', () => {
    const result = generateVisualDisturbancePreviewStyle('visualAura' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.filter).toContain('blur');
  });

  test('starbursting returns a style with screen blend mode', () => {
    const result = generateVisualDisturbancePreviewStyle('starbursting' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
  });

  test('palinopsia returns a style with screen blend mode', () => {
    const result = generateVisualDisturbancePreviewStyle('palinopsia' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
  });

  test('visualAuraLeft returns a style with blur filter', () => {
    const result = generateVisualDisturbancePreviewStyle('visualAuraLeft' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.filter).toContain('blur');
  });

  test('visualAuraRight returns a style with blur filter', () => {
    const result = generateVisualDisturbancePreviewStyle('visualAuraRight' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.filter).toContain('blur');
  });

  test('persistentPositiveVisualPhenomenon returns a style', () => {
    const result = generateVisualDisturbancePreviewStyle('persistentPositiveVisualPhenomenon' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
  });

  test('returns null for unknown condition', () => {
    const result = generateVisualDisturbancePreviewStyle('cataracts' as ConditionType, 0.5, Date.now());
    expect(result).toBeNull();
  });
});

describe('generateRetinalDiseasePreviewStyle', () => {
  test('glaucoma returns a radial gradient with filter', () => {
    const result = generateRetinalDiseasePreviewStyle('glaucoma' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.filter).toContain('blur');
    expect(result!.filter).toContain('contrast');
  });

  test('amd returns a central scotoma gradient', () => {
    const result = generateRetinalDiseasePreviewStyle('amd' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('diabeticRetinopathy returns microaneurysm and cotton wool spot gradients', () => {
    const result = generateRetinalDiseasePreviewStyle('diabeticRetinopathy' as ConditionType, 0.5, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.filter).toContain('sepia');
  });

  test('retinitisPigmentosa returns tunnel vision effect', () => {
    const result = generateRetinalDiseasePreviewStyle('retinitisPigmentosa' as ConditionType, 0.8, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('stargardt returns central scotoma with puckering', () => {
    const result = generateRetinalDiseasePreviewStyle('stargardt' as ConditionType, 0.7, Date.now());
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('retinalDetachment returns top-to-bottom gradient', () => {
    const result = generateRetinalDiseasePreviewStyle('retinalDetachment' as ConditionType, 0.6, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('linear-gradient(to bottom');
    expect(result!.filter).toContain('hue-rotate');
  });

  test('returns null for unknown condition', () => {
    const result = generateRetinalDiseasePreviewStyle('protanopia' as ConditionType, 0.5, Date.now());
    expect(result).toBeNull();
  });
});

describe('generateFamousPeoplePreviewStyle', () => {
  test('returns null (famous people handled by main overlay system)', () => {
    const result = generateFamousPeoplePreviewStyle('completeBlindness' as ConditionType, 0.5, Date.now());
    expect(result).toBeNull();
  });
});

describe('generateSymptomPreviewStyle', () => {
  test('vitreousHemorrhage returns red-tinted overlay', () => {
    const result = generateSymptomPreviewStyle('vitreousHemorrhage' as ConditionType, 0.7, Date.now());
    expect(result).not.toBeNull();
    expect(result!.background).toContain('rgba(180,20,20');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('keratoconus returns ghost image effect with screen blend', () => {
    const result = generateSymptomPreviewStyle('keratoconus' as ConditionType, 0.6, Date.now());
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
    expect(result!.background).toContain('radial-gradient');
  });

  test('CSS-filter-only conditions return null', () => {
    const cssFilterConditions = [
      'dryEye', 'presbyopia', 'glare', 'blurryVision',
      'nightBlindness', 'halos', 'lossOfContrast',
    ];
    for (const condition of cssFilterConditions) {
      const result = generateSymptomPreviewStyle(condition as ConditionType, 0.5, Date.now());
      expect(result).toBeNull();
    }
  });

  test('returns null for unknown condition', () => {
    const result = generateSymptomPreviewStyle('protanopia' as ConditionType, 0.5, Date.now());
    expect(result).toBeNull();
  });
});

describe('generatePreviewOverlayStyle (combined)', () => {
  test('returns non-null for visualFloaters with background gradients', () => {
    const effect = createEffect('visualFloaters', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.opacity).toBe(1);
  });

  test('returns non-null for visualSnow with dot patterns', () => {
    const effect = createEffect('visualSnow', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
  });

  test('falls back to default overlay for unhandled conditions', () => {
    const effect = createEffect('someRandomCondition', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('rgba(0,0,0,');
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('base style has correct positioning properties', () => {
    const effect = createEffect('visualFloaters', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result!.position).toBe('absolute');
    expect(result!.top).toBe(0);
    expect(result!.left).toBe(0);
    expect(result!.width).toBe('100%');
    expect(result!.height).toBe('100%');
    expect(result!.pointerEvents).toBe('none');
  });

  test('visualSnowFlashing returns flashing dot pattern', () => {
    const effect = createEffect('visualSnowFlashing', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.opacity).toBe(1);
  });

  test('visualSnowColored returns colored dot pattern', () => {
    const effect = createEffect('visualSnowColored', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.opacity).toBe(1);
  });

  test('visualSnowTransparent returns transparent dot pattern', () => {
    const effect = createEffect('visualSnowTransparent', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.opacity).toBe(1);
  });

  test('visualSnowDense returns dense dot pattern', () => {
    const effect = createEffect('visualSnowDense', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
    expect(result!.opacity).toBe(1);
  });

  test('visual field loss condition gets VISUAL_FIELD_LOSS z-index', () => {
    const effect = createEffect('tunnelVision', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.zIndex).toBe(9000); // Z_INDEX.VISUAL_FIELD_LOSS
  });

  test('retinal disease condition delegates correctly', () => {
    const effect = createEffect('glaucoma', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
  });

  test('symptom condition delegates correctly', () => {
    const effect = createEffect('keratoconus', 0.6);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
  });

  test('visual disturbance condition delegates through combined function', () => {
    const effect = createEffect('blueFieldPhenomena', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('rgba(255,255,255');
  });

  test('starbursting delegates through combined function', () => {
    const effect = createEffect('starbursting', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
  });

  test('palinopsia delegates through combined function', () => {
    const effect = createEffect('palinopsia', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('screen');
  });

  test('amd delegates through retinal disease path', () => {
    const effect = createEffect('amd', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.mixBlendMode).toBe('multiply');
  });

  test('diabeticRetinopathy delegates through retinal path', () => {
    const effect = createEffect('diabeticRetinopathy', 0.5);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
  });

  test('scotoma delegates through visual field loss path', () => {
    const effect = createEffect('scotoma', 0.7);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
    expect(result!.background).toContain('radial-gradient');
  });

  test('hemianopiaLeft delegates through visual field loss path', () => {
    const effect = createEffect('hemianopiaLeft', 0.8);
    const result = generatePreviewOverlayStyle(effect, [effect]);
    expect(result).not.toBeNull();
  });
});
