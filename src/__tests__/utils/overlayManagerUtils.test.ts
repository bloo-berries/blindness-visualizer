import { VisualEffect } from '../../types/visualEffects';

// Mock the category-specific overlay generators
jest.mock('../../utils/overlays/visualFieldLossOverlays', () => ({
  createVisualFieldLossOverlays: jest.fn()
}));
jest.mock('../../utils/overlays/visualDisturbanceOverlays', () => ({
  createVisualDisturbanceOverlays: jest.fn()
}));
jest.mock('../../utils/overlays/retinalDiseaseOverlays', () => ({
  createRetinalDiseaseOverlays: jest.fn()
}));
jest.mock('../../utils/overlays/famousPeopleOverlays', () => ({
  createFamousPeopleOverlays: jest.fn()
}));
jest.mock('../../utils/overlays/ocularOverlays', () => ({
  createOcularOverlays: jest.fn()
}));

import { createVisualFieldOverlays } from '../../utils/overlayManager';
import { createVisualFieldLossOverlays } from '../../utils/overlays/visualFieldLossOverlays';
import { createVisualDisturbanceOverlays } from '../../utils/overlays/visualDisturbanceOverlays';
import { createRetinalDiseaseOverlays } from '../../utils/overlays/retinalDiseaseOverlays';
import { createFamousPeopleOverlays } from '../../utils/overlays/famousPeopleOverlays';
import { createOcularOverlays } from '../../utils/overlays/ocularOverlays';

const createMockEffect = (
  id: string,
  enabled: boolean,
  intensity: number = 0.5
): VisualEffect => ({
  id: id as any,
  name: id,
  enabled,
  intensity,
  description: `${id} test description`
});

describe('overlayManager - createVisualFieldOverlays', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'overlay-container';
    document.body.appendChild(container);

    jest.clearAllMocks();

    // Clean up any leftover overlays
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(el => el.remove());
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.querySelectorAll('[id^="visual-field-overlay-"]').forEach(el => el.remove());
  });

  test('removes existing visual-field-overlay elements before creating new ones', () => {
    // Pre-populate with existing overlays
    const existing1 = document.createElement('div');
    existing1.id = 'visual-field-overlay-old1';
    document.body.appendChild(existing1);

    const existing2 = document.createElement('div');
    existing2.id = 'visual-field-overlay-old2';
    document.body.appendChild(existing2);

    const effects: VisualEffect[] = [];
    createVisualFieldOverlays(effects, container);

    expect(document.getElementById('visual-field-overlay-old1')).toBeNull();
    expect(document.getElementById('visual-field-overlay-old2')).toBeNull();
  });

  test('calls all category-specific overlay generators', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    createVisualFieldOverlays(effects, container);

    expect(createVisualFieldLossOverlays).toHaveBeenCalled();
    expect(createVisualDisturbanceOverlays).toHaveBeenCalled();
    expect(createRetinalDiseaseOverlays).toHaveBeenCalled();
    expect(createFamousPeopleOverlays).toHaveBeenCalled();
    expect(createOcularOverlays).toHaveBeenCalled();
  });

  test('passes effect map to all overlay generators', () => {
    const effects = [
      createMockEffect('glaucoma', true, 0.5),
      createMockEffect('cataracts', true, 0.3)
    ];

    createVisualFieldOverlays(effects, container);

    // The first argument to each generator should be a Map
    const fieldLossArgs = (createVisualFieldLossOverlays as jest.Mock).mock.calls[0];
    expect(fieldLossArgs[0]).toBeInstanceOf(Map);
    expect(fieldLossArgs[0].size).toBe(2);
    expect(fieldLossArgs[0].get('glaucoma')).toEqual(effects[0]);
    expect(fieldLossArgs[0].get('cataracts')).toEqual(effects[1]);
  });

  test('passes container to overlay generators that accept it', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    createVisualFieldOverlays(effects, container);

    expect((createVisualFieldLossOverlays as jest.Mock).mock.calls[0][1]).toBe(container);
    expect((createVisualDisturbanceOverlays as jest.Mock).mock.calls[0][1]).toBe(container);
    expect((createRetinalDiseaseOverlays as jest.Mock).mock.calls[0][1]).toBe(container);
    expect((createFamousPeopleOverlays as jest.Mock).mock.calls[0][1]).toBe(container);
  });

  test('ocularOverlays receives only the effect map (no container)', () => {
    const effects = [createMockEffect('glaucoma', true, 0.5)];

    createVisualFieldOverlays(effects, container);

    const ocularArgs = (createOcularOverlays as jest.Mock).mock.calls[0];
    expect(ocularArgs.length).toBe(1);
    expect(ocularArgs[0]).toBeInstanceOf(Map);
  });

  test('works with empty effects array', () => {
    createVisualFieldOverlays([], container);

    // Should still call all generators with an empty map
    const fieldLossArgs = (createVisualFieldLossOverlays as jest.Mock).mock.calls[0];
    expect(fieldLossArgs[0]).toBeInstanceOf(Map);
    expect(fieldLossArgs[0].size).toBe(0);
  });

  test('works without a container argument', () => {
    const effects = [createMockEffect('glaucoma', true)];

    // Should not throw when container is undefined
    expect(() => createVisualFieldOverlays(effects)).not.toThrow();

    expect((createVisualFieldLossOverlays as jest.Mock).mock.calls[0][1]).toBeUndefined();
  });

  test('effect map contains correct effect data', () => {
    const effects = [
      createMockEffect('tunnelVision', true, 0.9),
      createMockEffect('scotoma', false, 0.4)
    ];

    createVisualFieldOverlays(effects, container);

    const effectMap = (createVisualFieldLossOverlays as jest.Mock).mock.calls[0][0] as Map<string, VisualEffect>;

    const tunnelVision = effectMap.get('tunnelVision');
    expect(tunnelVision).toBeDefined();
    expect(tunnelVision!.enabled).toBe(true);
    expect(tunnelVision!.intensity).toBe(0.9);

    const scotoma = effectMap.get('scotoma');
    expect(scotoma).toBeDefined();
    expect(scotoma!.enabled).toBe(false);
    expect(scotoma!.intensity).toBe(0.4);
  });

  test('overlay cleanup only targets elements with visual-field-overlay prefix', () => {
    const unrelated = document.createElement('div');
    unrelated.id = 'some-other-overlay';
    document.body.appendChild(unrelated);

    const targeted = document.createElement('div');
    targeted.id = 'visual-field-overlay-test';
    document.body.appendChild(targeted);

    createVisualFieldOverlays([], container);

    // Unrelated element should still exist
    expect(document.getElementById('some-other-overlay')).not.toBeNull();
    // Targeted element should have been removed
    expect(document.getElementById('visual-field-overlay-test')).toBeNull();

    document.body.removeChild(unrelated);
  });

  test('multiple calls remove previous overlays each time', () => {
    // First call — generators might create overlays
    createVisualFieldOverlays([createMockEffect('amd', true)], container);

    // Manually add an overlay to simulate what generators create
    const overlay = document.createElement('div');
    overlay.id = 'visual-field-overlay-amd';
    document.body.appendChild(overlay);

    // Second call should remove the overlay from first call
    createVisualFieldOverlays([createMockEffect('glaucoma', true)], container);

    expect(document.getElementById('visual-field-overlay-amd')).toBeNull();
  });
});
