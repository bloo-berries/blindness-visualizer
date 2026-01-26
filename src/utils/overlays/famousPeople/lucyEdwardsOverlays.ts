import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Lucy Edwards-specific conditions (Incontinentia Pigmenti)
 */
export const createLucyEdwardsOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const lucyFrostedGlass = getEffect('lucyFrostedGlass');
  const lucyHeavyBlur = getEffect('lucyHeavyBlur');
  const lucyDesaturation = getEffect('lucyDesaturation');
  const lucyLightDiffusion = getEffect('lucyLightDiffusion');
  const lucyTextureOverlay = getEffect('lucyTextureOverlay');
  const lucyCompleteVision = getEffect('lucyCompleteVision');

  // Lucy Edwards - Frosted Glass
  if (lucyFrostedGlass?.enabled) {
    const intensity = lucyFrostedGlass.intensity;

    createOverlay(
      'visual-field-overlay-lucyFrostedGlass',
      `rgba(80,60,40,${intensity * 0.6})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyFrostedGlass'
    );
  }

  // Lucy Edwards - Heavy Blur
  if (lucyHeavyBlur?.enabled) {
    const intensity = lucyHeavyBlur.intensity;

    createOverlay(
      'visual-field-overlay-lucyHeavyBlur',
      `rgba(60,40,30,${intensity * 0.7})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyHeavyBlur'
    );
  }

  // Lucy Edwards - Desaturation
  if (lucyDesaturation?.enabled) {
    const intensity = lucyDesaturation.intensity;

    createOverlay(
      'visual-field-overlay-lucyDesaturation',
      `linear-gradient(45deg, rgba(120,80,60,${intensity * 0.5}) 0%, rgba(100,70,50,${intensity * 0.4}) 50%, rgba(140,90,70,${intensity * 0.5}) 100%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyDesaturation'
    );
  }

  // Lucy Edwards - Light Diffusion
  if (lucyLightDiffusion?.enabled) {
    const intensity = lucyLightDiffusion.intensity;

    createOverlay(
      'visual-field-overlay-lucyLightDiffusion',
      `radial-gradient(circle at 25% 25%, rgba(160,100,80,${intensity * 0.4}) 0%, transparent 20%), radial-gradient(circle at 75% 75%, rgba(140,90,70,${intensity * 0.3}) 0%, transparent 15%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyLightDiffusion'
    );
  }

  // Lucy Edwards - Texture Overlay
  if (lucyTextureOverlay?.enabled) {
    const intensity = lucyTextureOverlay.intensity;

    createOverlay(
      'visual-field-overlay-lucyTextureOverlay',
      `radial-gradient(ellipse at 30% 20%, rgba(100,70,50,${intensity * 0.6}) 0%, transparent 25%), radial-gradient(ellipse at 70% 80%, rgba(80,60,40,${intensity * 0.5}) 0%, transparent 20%), radial-gradient(ellipse at 50% 50%, rgba(120,80,60,${intensity * 0.4}) 0%, transparent 30%)`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyTextureOverlay'
    );
  }

  // Lucy Edwards - Complete Vision
  if (lucyCompleteVision?.enabled) {
    const intensity = lucyCompleteVision.intensity;

    createOverlay(
      'visual-field-overlay-lucyCompleteVision',
      `rgba(90,60,40,${intensity * 0.8})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'lucyCompleteVision'
    );
  }
};
