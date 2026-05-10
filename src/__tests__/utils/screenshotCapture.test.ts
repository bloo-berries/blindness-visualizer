import { VisualEffect } from '../../types/visualEffects';

const mockToDataURL = jest.fn(() => 'data:image/png;base64,mockdata');
const mockHtml2Canvas = jest.fn();

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: mockHtml2Canvas,
}));

import { saveVisionSimulation } from '../../utils/screenshotCapture';

const createMockEffect = (
  id: string,
  name: string,
  enabled: boolean,
  intensity: number = 0.5
): VisualEffect => ({
  id: id as any,
  name,
  enabled,
  intensity,
  description: `${name} test`,
});

describe('screenshotCapture', () => {
  let container: HTMLElement;
  let clickedLinks: Array<{ href: string; download: string }>;
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;
  let origCreateElement: typeof document.createElement;

  beforeEach(() => {
    clickedLinks = [];

    // Set up html2canvas mock
    mockHtml2Canvas.mockReset();
    mockToDataURL.mockClear();
    mockHtml2Canvas.mockResolvedValue({ toDataURL: mockToDataURL });

    container = document.createElement('div');
    container.className = 'visualizer-container';
    Object.defineProperty(container, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 600, configurable: true });
    document.body.appendChild(container);

    // Mock URL APIs
    mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
    mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    origCreateElement = document.createElement.bind(document);

    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = origCreateElement('a');
        link.click = jest.fn(() => {
          clickedLinks.push({ href: link.href, download: link.download });
        });
        return link;
      }
      if (tagName === 'canvas') {
        const canvas = origCreateElement('canvas');
        canvas.getContext = jest.fn(() => ({
          drawImage: jest.fn(),
          fillStyle: '',
          fillRect: jest.fn(),
          fillText: jest.fn(),
          font: '',
          textAlign: '',
        })) as any;
        canvas.toBlob = jest.fn((cb: BlobCallback) => {
          cb(new Blob(['mock-png'], { type: 'image/png' }));
        }) as any;
        return canvas;
      }
      return origCreateElement(tagName);
    });

    // Mock Image constructor — trigger onload synchronously when src is set
    // Using a microtask (Promise.resolve) ensures it fires after the onload handler is attached
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).__origImage = global.Image;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Image = class MockImage {
      width = 800;
      height = 600;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = '';
      get src() { return this._src; }
      set src(val: string) {
        this._src = val;
        // Use a microtask so onload fires after it's been assigned
        Promise.resolve().then(() => { if (this.onload) this.onload(); });
      }
    };
  });

  afterEach(() => {
    if (container.parentElement) document.body.removeChild(container);
    jest.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((global as any).__origImage) {
      global.Image = (global as any).__origImage;
      delete (global as any).__origImage;
    }
  });

  const runSave = (
    effects: VisualEffect[],
    inputSource = 'image',
    dipSep?: number,
    dipDir?: number
  ) => saveVisionSimulation(container, effects, inputSource, dipSep, dipDir);

  test('calls html2canvas with the container element', async () => {
    await runSave([]);
    expect(mockHtml2Canvas).toHaveBeenCalledTimes(1);
    expect(mockHtml2Canvas.mock.calls[0][0]).toBe(container);
  });

  test('triggers a download click', async () => {
    await runSave([createMockEffect('glaucoma', 'Glaucoma', true)]);
    expect(clickedLinks.length).toBe(1);
  });

  test('download filename has vision-simulation prefix and .png extension', async () => {
    await runSave([createMockEffect('cataracts', 'Cataracts', true)]);
    expect(clickedLinks[0].download).toMatch(/^vision-simulation_.*\.png$/);
  });

  test('filename includes enabled effect ids', async () => {
    const effects = [
      createMockEffect('glaucoma', 'Glaucoma', true),
      createMockEffect('cataracts', 'Cataracts', true),
    ];
    await runSave(effects);
    expect(clickedLinks[0].download).toContain('glaucoma');
    expect(clickedLinks[0].download).toContain('cataracts');
  });

  test('filename uses no-effects suffix when no effects enabled', async () => {
    await runSave([createMockEffect('glaucoma', 'Glaucoma', false)]);
    expect(clickedLinks[0].download).toContain('no-effects');
  });

  test('creates and revokes blob URL for cleanup', async () => {
    await runSave([]);
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  test('completes successfully with empty effects', async () => {
    await expect(runSave([])).resolves.toBeUndefined();
  });

  test('completes with custom diplopia parameters', async () => {
    await expect(runSave([], 'image', 2.0, 45.0)).resolves.toBeUndefined();
  });

  test('html2canvas receives correct render options', async () => {
    await runSave([]);
    const opts = mockHtml2Canvas.mock.calls[0][1];
    expect(opts.backgroundColor).toBeNull();
    expect(opts.useCORS).toBe(true);
    expect(opts.allowTaint).toBe(true);
    expect(opts.logging).toBe(false);
    expect(opts.foreignObjectRendering).toBe(true);
  });

  test('ignoreElements filters out UI chrome elements', async () => {
    await runSave([]);
    const { ignoreElements } = mockHtml2Canvas.mock.calls[0][1];

    const shouldIgnore = ['control-panel', 'navigation-bar', 'footer', 'stepper', 'save-button'];
    shouldIgnore.forEach(cls => {
      const el = origCreateElement('div');
      el.classList.add(cls);
      expect(ignoreElements(el)).toBe(true);
    });

    const keep = origCreateElement('div');
    keep.classList.add('some-content');
    expect(ignoreElements(keep)).toBe(false);
  });

  test('onclone makes overlay elements visible in cloned document', async () => {
    await runSave([]);
    const { onclone } = mockHtml2Canvas.mock.calls[0][1];

    const clonedDoc = document.implementation.createHTMLDocument();
    const overlay = clonedDoc.createElement('div');
    overlay.id = 'visual-field-overlay-test';
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
    clonedDoc.body.appendChild(overlay);

    onclone(clonedDoc);

    expect(overlay.style.display).toBe('block');
    expect(overlay.style.visibility).toBe('visible');
  });

  test('wraps html2canvas errors with user-friendly message', async () => {
    mockHtml2Canvas.mockRejectedValueOnce(new Error('WebGL error'));
    await expect(runSave([])).rejects.toThrow('Failed to capture screenshot');
  });

  test('filename includes current date in YYYY-MM-DD format', async () => {
    const today = new Date().toISOString().split('T')[0];
    await runSave([]);
    expect(clickedLinks[0].download).toContain(today);
  });

  test('passes container dimensions to html2canvas', async () => {
    await runSave([]);
    const opts = mockHtml2Canvas.mock.calls[0][1];
    expect(opts.width).toBe(800);
    expect(opts.height).toBe(600);
  });
});
