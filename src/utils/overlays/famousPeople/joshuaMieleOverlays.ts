import { OverlayConfig } from './overlayConfig';

/**
 * Joshua Miele - Chemical Burn Blindness
 */
export const joshuaMieleOverlays: OverlayConfig[] = [
  {
    effectId: 'joshuaCompleteBlindness',
    background: i => `linear-gradient(45deg, rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 100%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'joshuaEcholocation',
    background: i => `radial-gradient(circle at 50% 50%, rgba(0,255,0,${i * 0.3}) 0%, rgba(0,255,0,${i * 0.2}) 20%, rgba(0,255,0,${i * 0.1}) 40%, transparent 60%), radial-gradient(circle at 30% 30%, rgba(0,255,0,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(0,255,0,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(0,255,0,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(0,255,0,${i * 0.4}) 0%, transparent 8%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'joshuaTactileMaps',
    background: i => `linear-gradient(0deg, rgba(255,255,255,${i * 0.4}) 0%, rgba(255,255,255,${i * 0.2}) 50%, rgba(255,255,255,${i * 0.4}) 100%), linear-gradient(90deg, rgba(255,255,255,${i * 0.3}) 0%, rgba(255,255,255,${i * 0.1}) 50%, rgba(255,255,255,${i * 0.3}) 100%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'joshuaAudioLandscape',
    background: i => `radial-gradient(circle at 20% 20%, rgba(0,0,255,${i * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 20%, rgba(0,0,255,${i * 0.3}) 0%, transparent 6%), radial-gradient(circle at 20% 80%, rgba(0,0,255,${i * 0.3}) 0%, transparent 6%), radial-gradient(circle at 80% 80%, rgba(0,0,255,${i * 0.3}) 0%, transparent 6%), radial-gradient(circle at 50% 50%, rgba(0,0,255,${i * 0.2}) 0%, transparent 4%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'joshuaAccessibilityMode',
    background: i => `linear-gradient(0deg, rgba(255,255,0,${i * 0.3}) 0%, rgba(255,255,0,${i * 0.1}) 50%, rgba(255,255,0,${i * 0.3}) 100%), linear-gradient(90deg, rgba(255,255,0,${i * 0.2}) 0%, rgba(255,255,0,${i * 0.05}) 50%, rgba(255,255,0,${i * 0.2}) 100%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'joshuaSonification',
    background: i => `radial-gradient(circle at 25% 25%, rgba(255,0,255,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 25%, rgba(255,0,255,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 25% 75%, rgba(255,0,255,${i * 0.4}) 0%, transparent 8%), radial-gradient(circle at 75% 75%, rgba(255,0,255,${i * 0.4}) 0%, transparent 8%)`,
    blendMode: 'screen',
  },
];
