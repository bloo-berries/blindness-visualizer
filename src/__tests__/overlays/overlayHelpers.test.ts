import { createOverlay, createOverlayWithContainer } from '../../utils/overlays/overlayHelpers';
import { OVERLAY_BASE_STYLES, Z_INDEX } from '../../utils/overlayConstants';

describe('createOverlay', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates a new div element with the given id', () => {
    createOverlay('test-overlay', 'red', 'multiply', '0.5');

    const overlay = document.getElementById('test-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay!.tagName).toBe('DIV');
  });

  it('appends the overlay to document.body when no container is found', () => {
    createOverlay('test-overlay', 'blue', 'normal', '1');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.parentElement).toBe(document.body);
  });

  it('sets blendMode and opacity on the overlay', () => {
    createOverlay('test-overlay', 'rgba(0,0,0,0.5)', 'screen', '0.7');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.mixBlendMode).toBe('screen');
    expect(overlay!.style.opacity).toBe('0.7');
  });

  it('sets simple background values correctly', () => {
    createOverlay('test-overlay', 'rgba(0,0,0,0.5)', 'screen', '0.7');

    const overlay = document.getElementById('test-overlay');
    // jsdom supports simple color values for background
    expect(overlay!.style.background).toContain('rgba');
  });

  it('applies OVERLAY_BASE_STYLES (position, width, height, pointerEvents)', () => {
    createOverlay('test-overlay', 'red', 'normal', '1');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.position).toBe(OVERLAY_BASE_STYLES.position);
    // jsdom normalizes "0" to "0px" for CSS positional properties
    expect(overlay!.style.top).toBe('0px');
    expect(overlay!.style.left).toBe('0px');
    expect(overlay!.style.width).toBe(OVERLAY_BASE_STYLES.width);
    expect(overlay!.style.height).toBe(OVERLAY_BASE_STYLES.height);
    expect(overlay!.style.pointerEvents).toBe(OVERLAY_BASE_STYLES.pointerEvents);
  });

  it('applies filter when provided', () => {
    createOverlay('test-overlay', 'red', 'normal', '1', 'blur(5px)');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.filter).toBe('blur(5px)');
  });

  it('applies clipPath when provided', () => {
    createOverlay('test-overlay', 'red', 'normal', '1', undefined, 'circle(50%)');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.clipPath).toBe('circle(50%)');
  });

  it('does not set filter when not provided', () => {
    createOverlay('test-overlay', 'red', 'normal', '1');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.filter).toBe('');
  });

  it('reuses existing overlay element on subsequent calls', () => {
    createOverlay('test-overlay', 'red', 'normal', '1');
    createOverlay('test-overlay', 'blue', 'screen', '0.5');

    // Should still be one element
    const overlays = document.querySelectorAll('#test-overlay');
    expect(overlays.length).toBe(1);

    // Should have updated blend mode and opacity
    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.mixBlendMode).toBe('screen');
    expect(overlay!.style.opacity).toBe('0.5');
  });

  it('sets appropriate z-index based on conditionId for disturbance', () => {
    createOverlay('test-overlay', 'red', 'normal', '1', undefined, undefined, 'visualAura');

    const overlay = document.getElementById('test-overlay');
    const zIndex = parseInt(overlay!.style.zIndex);
    // visualAura is a disturbance condition, gets higher z-index
    expect(zIndex).toBeGreaterThan(Z_INDEX.BASE);
  });

  it('sets base z-index for non-special conditions', () => {
    createOverlay('test-overlay', 'red', 'normal', '1', undefined, undefined, 'cataracts');

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.zIndex).toBe(Z_INDEX.BASE.toString());
  });

  it('sets field loss z-index for field loss conditions', () => {
    createOverlay('test-overlay', 'red', 'normal', '1', undefined, undefined, 'hemianopiaLeft');

    const overlay = document.getElementById('test-overlay');
    const zIndex = parseInt(overlay!.style.zIndex);
    expect(zIndex).toBeGreaterThan(Z_INDEX.BASE);
  });
});

describe('createOverlayWithContainer', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates an overlay and appends to provided container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    createOverlayWithContainer(
      'test-overlay', 'red', 'normal', '1',
      undefined, undefined, 'test', container
    );

    const overlay = document.getElementById('test-overlay');
    expect(overlay).not.toBeNull();
  });

  it('applies blend mode and opacity', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    createOverlayWithContainer(
      'test-overlay', 'rgba(255,0,0,0.5)', 'screen', '0.8',
      undefined, undefined, 'test', container
    );

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.mixBlendMode).toBe('screen');
    expect(overlay!.style.opacity).toBe('0.8');
  });

  it('applies filter and clipPath when provided', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    createOverlayWithContainer(
      'test-overlay', 'red', 'normal', '1',
      'blur(3px)', 'circle(50%)', 'test', container
    );

    const overlay = document.getElementById('test-overlay');
    expect(overlay!.style.filter).toBe('blur(3px)');
    expect(overlay!.style.clipPath).toBe('circle(50%)');
  });

  it('falls back to body when no container provided and no container found', () => {
    createOverlayWithContainer(
      'test-overlay', 'red', 'normal', '1',
      undefined, undefined, 'test'
    );

    const overlay = document.getElementById('test-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay!.parentElement).toBe(document.body);
  });

  it('gives retinitisPigmentosa high z-index', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    createOverlayWithContainer(
      'test-overlay', 'red', 'normal', '1',
      undefined, undefined, 'retinitisPigmentosa', container
    );

    const overlay = document.getElementById('test-overlay');
    const zIndex = parseInt(overlay!.style.zIndex);
    expect(zIndex).toBeGreaterThanOrEqual(Z_INDEX.VISUAL_FIELD_LOSS);
  });
});
