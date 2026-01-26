import { VisualEffect } from '../../../types/visualEffects';
import { createOverlay } from '../overlayHelpers';

/**
 * Creates overlays for Ved Mehta-specific conditions
 */
export const createVedMehtaOverlays = (
  effects: Map<string, VisualEffect>
): void => {
  const getEffect = (id: string) => effects.get(id);

  const vedCompleteBlindness = getEffect('vedCompleteBlindness');
  const vedSpatialAwareness = getEffect('vedSpatialAwareness');
  const vedEchoLocation = getEffect('vedEchoLocation');
  const vedAirFlowSensors = getEffect('vedAirFlowSensors');
  const vedProximityRadar = getEffect('vedProximityRadar');
  const vedTemperatureMapping = getEffect('vedTemperatureMapping');

  // Ved Mehta - Complete Blindness
  if (vedCompleteBlindness?.enabled) {
    const intensity = vedCompleteBlindness.intensity;

    createOverlay(
      'visual-field-overlay-vedCompleteBlindness',
      `rgba(0,0,0,${intensity})`,
      'multiply',
      intensity.toString(),
      undefined,
      undefined,
      'vedCompleteBlindness'
    );
  }

  // Ved Mehta - Spatial Awareness
  if (vedSpatialAwareness?.enabled) {
    const intensity = vedSpatialAwareness.intensity;

    createOverlay(
      'visual-field-overlay-vedSpatialAwareness',
      `radial-gradient(circle at 50% 50%, transparent 0%, rgba(80,80,80,${intensity * 0.2}) 20%, rgba(60,60,60,${intensity * 0.3}) 40%, rgba(40,40,40,${intensity * 0.4}) 60%, rgba(20,20,20,${intensity * 0.5}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedSpatialAwareness'
    );
  }

  // Ved Mehta - Echo Location
  if (vedEchoLocation?.enabled) {
    const intensity = vedEchoLocation.intensity;

    createOverlay(
      'visual-field-overlay-vedEchoLocation',
      `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(100,120,100,${intensity * 0.15}) 45deg, transparent 90deg, rgba(100,120,100,${intensity * 0.15}) 135deg, transparent 180deg, rgba(100,120,100,${intensity * 0.15}) 225deg, transparent 270deg, rgba(100,120,100,${intensity * 0.15}) 315deg, transparent 360deg)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedEchoLocation'
    );
  }

  // Ved Mehta - Air Flow Sensors
  if (vedAirFlowSensors?.enabled) {
    const intensity = vedAirFlowSensors.intensity;

    createOverlay(
      'visual-field-overlay-vedAirFlowSensors',
      `linear-gradient(45deg, transparent 0%, rgba(120,130,140,${intensity * 0.2}) 25%, transparent 50%, rgba(120,130,140,${intensity * 0.2}) 75%, transparent 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedAirFlowSensors'
    );
  }

  // Ved Mehta - Proximity Radar
  if (vedProximityRadar?.enabled) {
    const intensity = vedProximityRadar.intensity;

    createOverlay(
      'visual-field-overlay-vedProximityRadar',
      `radial-gradient(circle at 20% 20%, rgba(140,120,100,${intensity * 0.25}) 0%, transparent 10%), radial-gradient(circle at 80% 30%, rgba(140,120,100,${intensity * 0.2}) 0%, transparent 8%), radial-gradient(circle at 30% 80%, rgba(140,120,100,${intensity * 0.3}) 0%, transparent 12%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedProximityRadar'
    );
  }

  // Ved Mehta - Temperature Mapping
  if (vedTemperatureMapping?.enabled) {
    const intensity = vedTemperatureMapping.intensity;

    createOverlay(
      'visual-field-overlay-vedTemperatureMapping',
      `linear-gradient(135deg, rgba(120,100,100,${intensity * 0.15}) 0%, rgba(130,120,100,${intensity * 0.2}) 25%, rgba(140,140,120,${intensity * 0.15}) 50%, rgba(100,130,130,${intensity * 0.2}) 75%, rgba(100,100,120,${intensity * 0.15}) 100%)`,
      'screen',
      intensity.toString(),
      undefined,
      undefined,
      'vedTemperatureMapping'
    );
  }
};
