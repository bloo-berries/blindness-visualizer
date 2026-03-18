import { OverlayConfig } from './overlayConfig';

/**
 * Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy
 */
export const minkaraOverlays: OverlayConfig[] = [
  // End Stage Complete (4 overlays)
  {
    effectId: 'minkaraEndStageComplete',
    overlayId: 'visual-field-overlay-minkaraEndStageComplete-central',
    background: i => `radial-gradient(circle at 50% 50%, rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i * 0.95}) 15%, rgba(0,0,0,${i * 0.9}) 25%, rgba(0,0,0,${i * 0.8}) 35%, transparent 40%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraEndStageComplete',
    overlayId: 'visual-field-overlay-minkaraEndStageComplete-ring',
    background: i => `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${i * 0.7}) 40%, rgba(0,0,0,${i * 0.5}) 45%, rgba(0,0,0,${i * 0.3}) 50%, transparent 55%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraEndStageComplete',
    overlayId: 'visual-field-overlay-minkaraEndStageComplete-peripheral',
    background: i => `radial-gradient(circle at 10% 10%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 10%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 5%, transparent 8%), radial-gradient(circle at 10% 90%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 5%, transparent 8%), radial-gradient(circle at 90% 90%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 5%, transparent 8%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraEndStageComplete',
    overlayId: 'visual-field-overlay-minkaraEndStageComplete-photophobia',
    background: i => `radial-gradient(circle at 50% 50%, rgba(255,255,255,${i * 0.9}) 0%, rgba(255,255,255,${i * 0.7}) 20%, rgba(255,255,255,${i * 0.4}) 40%, transparent 60%)`,
    blendMode: 'screen',
  },
  // Individual Effects
  {
    effectId: 'minkaraCentralScotoma',
    background: i => {
      const scotomaSize = Math.max(35, 30 + i * 20);
      return `radial-gradient(circle at 50% 50%, rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i * 0.95}) ${scotomaSize - 10}%, rgba(0,0,0,${i * 0.9}) ${scotomaSize - 5}%, rgba(0,0,0,${i * 0.8}) ${scotomaSize}%, rgba(0,0,0,${i * 0.5}) ${scotomaSize + 5}%, transparent ${scotomaSize + 10}%)`;
    },
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraRingScotoma',
    background: i => `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${i * 0.7}) 40%, rgba(0,0,0,${i * 0.5}) 45%, rgba(0,0,0,${i * 0.3}) 50%, transparent 55%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraPeripheralIslands',
    background: i => `radial-gradient(circle at 15% 15%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 15%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 3%, transparent 6%), radial-gradient(circle at 15% 85%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 3%, transparent 6%), radial-gradient(circle at 85% 85%, rgba(0,0,0,${i * 0.8}) 0%, rgba(0,0,0,${i * 0.6}) 3%, transparent 6%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraPhotophobia',
    background: i => `radial-gradient(circle at 50% 50%, rgba(255,255,255,${i * 0.9}) 0%, rgba(255,255,255,${i * 0.7}) 20%, rgba(255,255,255,${i * 0.4}) 40%, transparent 60%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'minkaraAchromatopsia',
    background: i => `linear-gradient(45deg, rgba(128,128,128,${i * 0.3}) 0%, rgba(128,128,128,${i * 0.2}) 50%, rgba(128,128,128,${i * 0.3}) 100%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraNightBlindness',
    background: i => `linear-gradient(45deg, rgba(0,0,0,${i * 0.6}) 0%, rgba(0,0,0,${i * 0.4}) 50%, rgba(0,0,0,${i * 0.6}) 100%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'minkaraChemistryMode',
    background: i => `radial-gradient(circle at 20% 20%, rgba(0,255,255,${i * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 20%, rgba(0,255,255,${i * 0.3}) 0%, transparent 8%), radial-gradient(circle at 20% 80%, rgba(0,255,255,${i * 0.3}) 0%, transparent 8%), radial-gradient(circle at 80% 80%, rgba(0,255,255,${i * 0.3}) 0%, transparent 8%)`,
    blendMode: 'screen',
  },
];
