import { OverlayConfig } from './overlayConfig';

/**
 * Ved Mehta - Complete Blindness with sensory compensation
 */
export const vedMehtaOverlays: OverlayConfig[] = [
  {
    effectId: 'vedCompleteBlindness',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
  },
  {
    effectId: 'vedSpatialAwareness',
    background: i => `radial-gradient(circle at 50% 50%, transparent 0%, rgba(80,80,80,${i * 0.2}) 20%, rgba(60,60,60,${i * 0.3}) 40%, rgba(40,40,40,${i * 0.4}) 60%, rgba(20,20,20,${i * 0.5}) 100%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'vedEchoLocation',
    background: i => `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(100,120,100,${i * 0.15}) 45deg, transparent 90deg, rgba(100,120,100,${i * 0.15}) 135deg, transparent 180deg, rgba(100,120,100,${i * 0.15}) 225deg, transparent 270deg, rgba(100,120,100,${i * 0.15}) 315deg, transparent 360deg)`,
    blendMode: 'screen',
  },
  {
    effectId: 'vedAirFlowSensors',
    background: i => `linear-gradient(45deg, transparent 0%, rgba(120,130,140,${i * 0.2}) 25%, transparent 50%, rgba(120,130,140,${i * 0.2}) 75%, transparent 100%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'vedProximityRadar',
    background: i => `radial-gradient(circle at 20% 20%, rgba(140,120,100,${i * 0.25}) 0%, transparent 10%), radial-gradient(circle at 80% 30%, rgba(140,120,100,${i * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 80%, rgba(140,120,100,${i * 0.3}) 0%, transparent 12%)`,
    blendMode: 'screen',
  },
  {
    effectId: 'vedTemperatureMapping',
    background: i => `linear-gradient(135deg, rgba(120,100,100,${i * 0.15}) 0%, rgba(130,120,100,${i * 0.2}) 25%, rgba(140,140,120,${i * 0.15}) 50%, rgba(100,130,130,${i * 0.2}) 75%, rgba(100,100,120,${i * 0.15}) 100%)`,
    blendMode: 'screen',
  },
];
