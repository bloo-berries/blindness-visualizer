import { createShaderUniforms } from '../utils/shaders/shaderUniforms';
import { VISUAL_EFFECTS } from '../data/visualEffects';

/**
 * Parse the effectId->uniformName mappings from updateShaderUniforms at runtime.
 *
 * We can't easily introspect the function body, so instead we exercise it
 * with every effect enabled and check which uniforms were written.
 * This catches drift between shaderUniforms.ts declarations and
 * uniformUpdater.ts update calls.
 */

// Build a mock material whose uniforms record writes
function createTrackingMaterial() {
  const uniforms = createShaderUniforms();
  const written = new Set<string>();

  const tracked: Record<string, { value: unknown }> = {};
  for (const [key, uniform] of Object.entries(uniforms)) {
    tracked[key] = new Proxy(uniform, {
      set(_target, prop, value) {
        if (prop === 'value') {
          written.add(key);
          _target.value = value;
        }
        return true;
      },
    });
  }

  return { uniforms: tracked, written };
}

describe('Shader Uniform Sync', () => {
  // Dynamically import to avoid issues with THREE in test env
  let updateShaderUniforms: typeof import('../utils/shaders/uniformUpdater').updateShaderUniforms;

  beforeAll(async () => {
    const mod = await import('../utils/shaders/uniformUpdater');
    updateShaderUniforms = mod.updateShaderUniforms;
  });

  test('every uniform declared in shaderUniforms has a matching updater call (except meta uniforms)', () => {
    const declaredUniforms = Object.keys(createShaderUniforms());

    // Meta uniforms that are not driven by effects
    const metaUniforms = new Set([
      'tDiffuse',
      'time',
      'diplopiaSeparation',
      'diplopiaDirection',
    ]);

    // Enable all effects at full intensity
    const allEnabled = VISUAL_EFFECTS.map(e => ({
      ...e,
      enabled: true,
      intensity: 1.0,
    }));

    const { uniforms, written } = createTrackingMaterial();
    const material = { uniforms } as any;

    updateShaderUniforms(material, allEnabled, 1.0, 0.0);

    const effectUniforms = declaredUniforms.filter(u => !metaUniforms.has(u));
    const notWritten = effectUniforms.filter(u => !written.has(u));

    expect(notWritten).toEqual([]);
  });

  test('meta uniforms (time, diplopia params) are always updated', () => {
    const allDisabled = VISUAL_EFFECTS.map(e => ({
      ...e,
      enabled: false,
      intensity: 0,
    }));

    const { uniforms, written } = createTrackingMaterial();
    const material = { uniforms } as any;

    updateShaderUniforms(material, allDisabled, 1.0, 0.0);

    expect(written.has('time')).toBe(true);
    expect(written.has('diplopiaSeparation')).toBe(true);
    expect(written.has('diplopiaDirection')).toBe(true);
  });

  test('disabled effects produce zero-value uniforms', () => {
    const allDisabled = VISUAL_EFFECTS.map(e => ({
      ...e,
      enabled: false,
      intensity: 0.5, // intensity set but disabled
    }));

    const declaredUniforms = createShaderUniforms();
    const material = { uniforms: { ...declaredUniforms } } as any;

    updateShaderUniforms(material, allDisabled, 1.0, 0.0);

    const metaUniforms = new Set(['tDiffuse', 'time', 'diplopiaSeparation', 'diplopiaDirection']);
    for (const [name, uniform] of Object.entries(material.uniforms)) {
      if (metaUniforms.has(name)) continue;
      expect((uniform as any).value).toBe(0);
    }
  });
});
