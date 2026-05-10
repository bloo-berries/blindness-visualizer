import { OverlayManager } from '../../utils/performance/OverlayManager';
import { VisualEffect } from '../../types/visualEffects';

// Mock the overlayManager module
jest.mock('../../utils/overlayManager', () => ({
  createVisualFieldOverlays: jest.fn()
}));

import { createVisualFieldOverlays } from '../../utils/overlayManager';

const mockCreateVisualFieldOverlays = createVisualFieldOverlays as jest.MockedFunction<typeof createVisualFieldOverlays>;

const createMockEffect = (
  id: string,
  enabled: boolean,
  intensity: number = 0.5
): VisualEffect => ({
  id: id as any,
  name: id,
  enabled,
  intensity,
  description: `${id} description`
});

describe('OverlayManager', () => {
  let manager: OverlayManager;
  let container: HTMLElement;

  beforeEach(() => {
    manager = new OverlayManager();
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    mockCreateVisualFieldOverlays.mockClear();

    // Clean up any leftover overlays
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(el => el.remove());
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(el => el.remove());
  });

  test('updateOverlays delegates to createVisualFieldOverlays', () => {
    const effects = [createMockEffect('glaucoma', true, 0.7)];

    manager.updateOverlays(effects, container);

    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledWith(effects, container);
  });

  test('updateOverlays skips update when state has not changed', () => {
    const effects = [createMockEffect('glaucoma', true, 0.7)];

    manager.updateOverlays(effects, container);
    manager.updateOverlays(effects, container);

    // Should only have been called once
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(1);
  });

  test('updateOverlays re-runs when effect intensity changes', () => {
    const effects1 = [createMockEffect('glaucoma', true, 0.5)];
    const effects2 = [createMockEffect('glaucoma', true, 0.8)];

    manager.updateOverlays(effects1, container);
    manager.updateOverlays(effects2, container);

    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(2);
  });

  test('updateOverlays re-runs when enabled state changes', () => {
    const effects1 = [createMockEffect('glaucoma', true, 0.5)];
    const effects2 = [createMockEffect('glaucoma', false, 0.5)];

    manager.updateOverlays(effects1, container);
    manager.updateOverlays(effects2, container);

    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(2);
  });

  test('updateOverlays re-runs when comparison mode changes', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    manager.updateOverlays(effects, container, false);
    manager.updateOverlays(effects, container, true);

    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(2);
  });

  test('updateOverlays generates deterministic state hash regardless of effect order', () => {
    const effectsA = [
      createMockEffect('glaucoma', true, 0.5),
      createMockEffect('cataracts', true, 0.3)
    ];
    const effectsB = [
      createMockEffect('cataracts', true, 0.3),
      createMockEffect('glaucoma', true, 0.5)
    ];

    manager.updateOverlays(effectsA, container);
    manager.updateOverlays(effectsB, container);

    // The sorted hash should be the same, so second call should be skipped
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(1);
  });

  test('updateOverlays ignores disabled effects in state hash', () => {
    const effects1 = [
      createMockEffect('glaucoma', true, 0.5),
      createMockEffect('cataracts', false, 0.3)
    ];
    const effects2 = [
      createMockEffect('glaucoma', true, 0.5),
      createMockEffect('cataracts', false, 0.9) // different intensity but disabled
    ];

    manager.updateOverlays(effects1, container);
    manager.updateOverlays(effects2, container);

    // Disabled effects are filtered out, so hash should match
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(1);
  });

  test('clearOverlays removes all visual-field-overlay elements from DOM', () => {
    // Add some fake overlays to the DOM
    for (let i = 0; i < 3; i++) {
      const overlay = document.createElement('div');
      overlay.id = `visual-field-overlay-test-${i}`;
      document.body.appendChild(overlay);
    }

    expect(document.querySelectorAll('[id^="visual-field-overlay-"]').length).toBe(3);

    manager.clearOverlays();

    expect(document.querySelectorAll('[id^="visual-field-overlay-"]').length).toBe(0);
  });

  test('clearOverlays resets the state hash so next updateOverlays runs', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    manager.updateOverlays(effects, container);
    manager.clearOverlays();
    manager.updateOverlays(effects, container);

    // Should have been called twice because clearOverlays reset state
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(2);
  });

  test('updateAnimatedOverlays does nothing when no vitreousHemorrhage effect', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    // Should not throw
    expect(() => manager.updateAnimatedOverlays(effects)).not.toThrow();
  });

  test('updateAnimatedOverlays does nothing when vitreousHemorrhage is disabled', () => {
    const effects = [createMockEffect('vitreousHemorrhage', false, 0.5)];

    expect(() => manager.updateAnimatedOverlays(effects)).not.toThrow();
  });

  test('updateAnimatedOverlays processes vitreousHemorrhage when enabled and overlay exists', () => {
    const overlay = document.createElement('div');
    overlay.id = 'visual-field-overlay-vitreousHemorrhage';
    overlay.setAttribute('data-intensity', '0.8');
    overlay.setAttribute('data-floaters', JSON.stringify([
      { type: 'dot', x: 50, y: 30, size: 5, opacity: 0.6 }
    ]));
    document.body.appendChild(overlay);

    const effects = [createMockEffect('vitreousHemorrhage', true, 0.8)];

    // Spy on style.background setter to verify it was set
    const bgSpy = jest.spyOn(overlay.style, 'background', 'set');

    manager.updateAnimatedOverlays(effects);

    // The method should have attempted to set the background style
    expect(bgSpy).toHaveBeenCalled();
    // And opacity
    expect(overlay.style.opacity).not.toBe('');

    document.body.removeChild(overlay);
    bgSpy.mockRestore();
  });

  test('updateOverlays handles empty effects array', () => {
    manager.updateOverlays([], container);
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledWith([], container);
  });

  test('updateOverlays uses container identifier in state hash', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    const container2 = document.createElement('div');
    container2.id = 'different-container';
    document.body.appendChild(container2);

    manager.updateOverlays(effects, container);
    manager.updateOverlays(effects, container2);

    // Different containers should produce different hashes
    expect(mockCreateVisualFieldOverlays).toHaveBeenCalledTimes(2);

    document.body.removeChild(container2);
  });
});
