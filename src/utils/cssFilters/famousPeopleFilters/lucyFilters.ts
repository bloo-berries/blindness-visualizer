import { VisualEffect } from '../../../types/visualEffects';

/**
 * Generates CSS filters for Lucy Edwards' incontinentia pigmenti effects
 */
export const generateLucyFilters = (effects: VisualEffect[]): string => {
  const lucyEffects = effects.filter(e =>
    e.id.startsWith('lucy') && e.enabled
  );

  if (lucyEffects.length === 0) return '';

  const filters: string[] = [];

  const completeVision = effects.find(e => e.id === 'lucyCompleteVision' && e.enabled);
  const frostedGlass = effects.find(e => e.id === 'lucyFrostedGlass' && e.enabled);
  const heavyBlur = effects.find(e => e.id === 'lucyHeavyBlur' && e.enabled);
  const desaturation = effects.find(e => e.id === 'lucyDesaturation' && e.enabled);
  const lightDiffusion = effects.find(e => e.id === 'lucyLightDiffusion' && e.enabled);
  const textureOverlay = effects.find(e => e.id === 'lucyTextureOverlay' && e.enabled);

  if (completeVision) {
    filters.push(`blur(${completeVision.intensity * 60}px)`);
    filters.push(`brightness(${100 - completeVision.intensity * 70}%) contrast(${100 - completeVision.intensity * 80}%)`);
    filters.push(`saturate(${100 - completeVision.intensity * 60}%) sepia(${completeVision.intensity * 50}%)`);
    filters.push(`hue-rotate(${completeVision.intensity * 20}deg)`);
  }

  if (frostedGlass) {
    filters.push(`blur(${frostedGlass.intensity * 50}px)`);
    filters.push(`brightness(${100 - frostedGlass.intensity * 60}%) contrast(${100 - frostedGlass.intensity * 75}%)`);
    filters.push(`saturate(${100 - frostedGlass.intensity * 50}%) sepia(${frostedGlass.intensity * 40}%)`);
  }

  if (heavyBlur) {
    filters.push(`blur(${heavyBlur.intensity * 55}px)`);
    filters.push(`brightness(${100 - heavyBlur.intensity * 50}%) contrast(${100 - heavyBlur.intensity * 70}%)`);
  }

  if (desaturation) {
    filters.push(`saturate(${100 - desaturation.intensity * 70}%)`);
    filters.push(`sepia(${desaturation.intensity * 45}%) hue-rotate(${desaturation.intensity * 15}deg)`);
    filters.push(`brightness(${100 - desaturation.intensity * 30}%)`);
  }

  if (lightDiffusion) {
    filters.push(`brightness(${100 - lightDiffusion.intensity * 40}%)`);
    filters.push(`contrast(${100 - lightDiffusion.intensity * 60}%)`);
    filters.push(`saturate(${100 - lightDiffusion.intensity * 50}%) sepia(${lightDiffusion.intensity * 30}%)`);
  }

  if (textureOverlay) {
    filters.push(`blur(${textureOverlay.intensity * 30}px)`);
    filters.push(`brightness(${100 - textureOverlay.intensity * 50}%) contrast(${100 - textureOverlay.intensity * 70}%)`);
    filters.push(`saturate(${100 - textureOverlay.intensity * 60}%) sepia(${textureOverlay.intensity * 35}%)`);
  }

  return filters.join(' ');
};
