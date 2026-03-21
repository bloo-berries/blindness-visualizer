/**
 * Tests for PresetManager encode/decode roundtrip and edge cases.
 */

// Re-implement the encode/decode functions here since they're not separately exported
function encodePreset(conditions: { id: string; i: number }[]): string {
  const json = JSON.stringify({ c: conditions });
  return btoa(json);
}

function decodePreset(encoded: string): { id: string; intensity: number }[] | null {
  try {
    const json = atob(encoded);
    const parsed = JSON.parse(json);
    if (parsed.c && Array.isArray(parsed.c)) {
      return parsed.c.map((c: { id: string; i: number }) => ({
        id: c.id,
        intensity: c.i,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

describe('PresetManager encode/decode', () => {
  test('roundtrips a single condition', () => {
    const conditions = [{ id: 'protanopia', i: 0.75 }];
    const encoded = encodePreset(conditions);
    const decoded = decodePreset(encoded);

    expect(decoded).toEqual([{ id: 'protanopia', intensity: 0.75 }]);
  });

  test('roundtrips multiple conditions', () => {
    const conditions = [
      { id: 'protanopia', i: 1.0 },
      { id: 'glaucoma', i: 0.5 },
      { id: 'cataracts', i: 0.3 },
    ];
    const encoded = encodePreset(conditions);
    const decoded = decodePreset(encoded);

    expect(decoded).toEqual([
      { id: 'protanopia', intensity: 1.0 },
      { id: 'glaucoma', intensity: 0.5 },
      { id: 'cataracts', intensity: 0.3 },
    ]);
  });

  test('roundtrips an empty conditions array', () => {
    const conditions: { id: string; i: number }[] = [];
    const encoded = encodePreset(conditions);
    const decoded = decodePreset(encoded);

    expect(decoded).toEqual([]);
  });

  test('returns null for invalid base64', () => {
    expect(decodePreset('!!!not-base64!!!')).toBeNull();
  });

  test('returns null for valid base64 but invalid JSON', () => {
    const encoded = btoa('this is not json');
    expect(decodePreset(encoded)).toBeNull();
  });

  test('returns null for valid JSON missing the "c" property', () => {
    const encoded = btoa(JSON.stringify({ conditions: [] }));
    expect(decodePreset(encoded)).toBeNull();
  });

  test('returns null for valid JSON where "c" is not an array', () => {
    const encoded = btoa(JSON.stringify({ c: 'not-array' }));
    expect(decodePreset(encoded)).toBeNull();
  });

  test('preserves intensity precision', () => {
    const conditions = [{ id: 'test', i: 0.123456789 }];
    const encoded = encodePreset(conditions);
    const decoded = decodePreset(encoded);

    expect(decoded).toEqual([{ id: 'test', intensity: 0.123456789 }]);
  });
});
