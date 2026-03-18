import { OverlayConfig } from './overlayConfig';

/**
 * Marla Runyan - Stargardt Disease
 */
export const marlaRunyanOverlays: OverlayConfig[] = [
  {
    effectId: 'marlaCentralScotoma',
    background: i => {
      const scotomaSize = Math.max(20, 15 + i * 25);
      return `radial-gradient(circle at 50% 50%, rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${i * 0.6}) ${scotomaSize}%, rgba(0,0,0,${i * 0.3}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`;
    },
    blendMode: 'multiply',
  },
  {
    effectId: 'marlaPeripheralVision',
    background: i => `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,${i * -0.1}) 60%, rgba(0,0,0,${i * -0.05}) 100%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'marlaEccentricViewing',
    background: i => `radial-gradient(circle at 30% 30%, rgba(255,255,0,${i * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 30%, rgba(255,255,0,${i * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 70%, rgba(255,255,0,${i * 0.2}) 0%, transparent 8%), radial-gradient(circle at 70% 70%, rgba(255,255,0,${i * 0.2}) 0%, transparent 8%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'marlaFillingIn',
    background: i => `radial-gradient(circle at 50% 50%, rgba(200,200,200,${i * 0.3}) 0%, rgba(200,200,200,${i * 0.15}) 30%, transparent 40%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'marlaCrowdingEffect',
    background: i => `radial-gradient(circle at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,${i * 0.1}) 45%, rgba(0,0,0,${i * 0.05}) 55%, transparent 65%)`,
    blendMode: 'multiply',
  },
  // Complete Stargardt (4 overlays)
  {
    effectId: 'marlaStargardtComplete',
    overlayId: 'visual-field-overlay-marlaStargardtComplete-scotoma',
    background: i => `radial-gradient(circle at 50% 50%, rgba(30,30,30,${i}) 0%, rgba(30,30,30,${i * 0.95}) 15%, rgba(30,30,30,${i * 0.8}) 25%, rgba(30,30,30,${i * 0.6}) 35%, rgba(30,30,30,${i * 0.4}) 45%, rgba(30,30,30,${i * 0.2}) 55%, transparent 65%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'marlaStargardtComplete',
    overlayId: 'visual-field-overlay-marlaStargardtComplete-scotoma-deep',
    background: i => `radial-gradient(circle at 50% 50%, rgba(20,20,20,${i}) 0%, rgba(20,20,20,${i * 0.95}) 15%, rgba(20,20,20,${i * 0.8}) 25%, rgba(20,20,20,${i * 0.6}) 35%, rgba(20,20,20,${i * 0.4}) 45%, rgba(20,20,20,${i * 0.2}) 55%, transparent 65%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'marlaStargardtComplete',
    overlayId: 'visual-field-overlay-marlaStargardtComplete-filling',
    background: i => `radial-gradient(circle at 50% 50%, rgba(200,200,200,${i * 0.2}) 0%, rgba(200,200,200,${i * 0.1}) 25%, rgba(200,200,200,${i * 0.05}) 35%, rgba(200,200,200,${i * 0.02}) 45%, transparent 55%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'marlaStargardtComplete',
    overlayId: 'visual-field-overlay-marlaStargardtComplete-eccentric',
    background: i => `radial-gradient(circle at 20% 20%, rgba(255,255,0,${i * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 20%, rgba(255,255,0,${i * 0.4}) 0%, transparent 12%), radial-gradient(circle at 20% 80%, rgba(255,255,0,${i * 0.4}) 0%, transparent 12%), radial-gradient(circle at 80% 80%, rgba(255,255,0,${i * 0.4}) 0%, transparent 12%)`,
    blendMode: 'screen',
  },
];
