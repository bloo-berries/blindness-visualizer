import { OverlayConfig } from './overlayConfig';

/** Galileo Galilei - Acute Angle-Closure Glaucoma */
export const galileoOverlays: OverlayConfig[] = [
  {
    effectId: 'galileoSectoralDefects',
    background: i => `conic-gradient(from 45deg at 30% 20%,
      rgba(0,0,0,${0.9 * i}) 0deg, rgba(0,0,0,${0.9 * i}) 90deg,
      rgba(0,0,0,0) 90deg, rgba(0,0,0,0) 360deg)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'galileoArcuateScotomas',
    background: i => `radial-gradient(ellipse 200px 50px at 50% 50%,
      rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.8 * i}) 45%,
      rgba(0,0,0,${0.8 * i}) 55%, rgba(0,0,0,0) 60%, rgba(0,0,0,0) 100%)`,
    blendMode: 'multiply',
  },
  {
    effectId: 'galileoSwissCheeseVision',
    background: i => [
      `radial-gradient(circle at 20% 30%, rgba(0,0,0,${0.9 * i}) 0%, rgba(0,0,0,${0.9 * i}) 3%, transparent 3%)`,
      `radial-gradient(circle at 60% 20%, rgba(0,0,0,${0.9 * i}) 0%, rgba(0,0,0,${0.9 * i}) 4%, transparent 4%)`,
      `radial-gradient(circle at 80% 60%, rgba(0,0,0,${0.9 * i}) 0%, rgba(0,0,0,${0.9 * i}) 3%, transparent 3%)`,
      `radial-gradient(circle at 30% 70%, rgba(0,0,0,${0.9 * i}) 0%, rgba(0,0,0,${0.9 * i}) 2%, transparent 2%)`,
      `radial-gradient(circle at 70% 80%, rgba(0,0,0,${0.9 * i}) 0%, rgba(0,0,0,${0.9 * i}) 3%, transparent 3%)`,
    ].join(', '),
    blendMode: 'multiply',
  },
  {
    effectId: 'galileoChronicProgression',
    background: i => {
      const r = Math.max(10, 50 - i * 40);
      return `radial-gradient(circle at 50% 50%,
        rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${r - 5}%,
        rgba(0,0,0,${0.95 * i}) ${r}%, rgba(0,0,0,${0.95 * i}) 100%)`;
    },
    blendMode: 'multiply',
    opacity: i => Math.min(0.95, i).toString(),
  },
];
