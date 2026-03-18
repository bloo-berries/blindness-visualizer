import { OverlayConfig } from './overlayConfig';

/**
 * Lucy Edwards - Incontinentia Pigmenti
 */
export const lucyEdwardsOverlays: OverlayConfig[] = [
  {
    effectId: 'lucyFrostedGlass',
    background: i => `rgba(80,60,40,${i * 0.6})`,
    blendMode: 'multiply',
  },
  {
    effectId: 'lucyHeavyBlur',
    background: i => `rgba(60,40,30,${i * 0.7})`,
    blendMode: 'multiply',
  },
  {
    effectId: 'lucyDesaturation',
    background: i => `linear-gradient(45deg, rgba(120,80,60,${i * 0.5}) 0%, rgba(100,70,50,${i * 0.4}) 50%, rgba(140,90,70,${i * 0.5}) 100%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'lucyLightDiffusion',
    background: i => `radial-gradient(circle at 25% 25%, rgba(160,100,80,${i * 0.4}) 0%, transparent 20%), radial-gradient(circle at 75% 75%, rgba(140,90,70,${i * 0.3}) 0%, transparent 15%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'lucyTextureOverlay',
    background: i => `radial-gradient(ellipse at 30% 20%, rgba(100,70,50,${i * 0.6}) 0%, transparent 25%), radial-gradient(ellipse at 70% 80%, rgba(80,60,40,${i * 0.5}) 0%, transparent 20%), radial-gradient(ellipse at 50% 50%, rgba(120,80,60,${i * 0.4}) 0%, transparent 30%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'lucyCompleteVision',
    background: i => `rgba(90,60,40,${i * 0.8})`,
    blendMode: 'multiply',
  },
];
