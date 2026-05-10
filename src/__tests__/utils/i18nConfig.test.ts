/**
 * Tests for i18n configuration (src/i18n/index.ts)
 */

// Must mock i18next and related modules before importing
jest.mock('i18next', () => {
  const instance = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    on: jest.fn(),
    language: 'en',
    hasResourceBundle: jest.fn().mockReturnValue(false),
    addResourceBundle: jest.fn(),
    changeLanguage: jest.fn(),
  };
  return {
    __esModule: true,
    default: instance,
  };
});

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('i18next-browser-languagedetector', () => {
  return jest.fn().mockImplementation(() => ({
    type: 'languageDetector',
    init: jest.fn(),
    detect: jest.fn().mockReturnValue('en'),
    cacheUserLanguage: jest.fn(),
  }));
});

// Mock all locale imports
jest.mock('../../locales/en.json', () => ({ welcome: 'Welcome' }), { virtual: true });

describe('i18n configuration', () => {
  let supportedLanguages: Record<string, { name: string; nativeName: string; dir: string }>;
  let loadLanguage: (lng: string) => Promise<void>;

  beforeEach(() => {
    jest.resetModules();
  });

  test('supportedLanguages contains 26 languages', () => {
    // Re-import to get fresh module
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    expect(Object.keys(supportedLanguages)).toHaveLength(26);
  });

  test('supportedLanguages includes English', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    expect(supportedLanguages.en).toBeDefined();
    expect(supportedLanguages.en.name).toBe('English');
    expect(supportedLanguages.en.nativeName).toBe('English');
    expect(supportedLanguages.en.dir).toBe('ltr');
  });

  test('Arabic has RTL direction', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    expect(supportedLanguages.ar).toBeDefined();
    expect(supportedLanguages.ar.dir).toBe('rtl');
    expect(supportedLanguages.ar.name).toBe('Arabic');
  });

  test('all non-Arabic languages have LTR direction', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    const nonArabicKeys = Object.keys(supportedLanguages).filter(k => k !== 'ar');
    for (const key of nonArabicKeys) {
      expect(supportedLanguages[key].dir).toBe('ltr');
    }
  });

  test('every language entry has name, nativeName, and dir', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    for (const [code, lang] of Object.entries(supportedLanguages)) {
      expect(lang.name).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(['ltr', 'rtl']).toContain(lang.dir);
    }
  });

  test('expected language codes are present', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    const expectedCodes = [
      'ar', 'bn', 'ca', 'zh', 'nl', 'en', 'fi', 'fr', 'de', 'el',
      'hi', 'is', 'ga', 'it', 'ja', 'ko', 'no', 'pl', 'pt', 'ru',
      'es', 'sw', 'sv', 'tr', 'uk', 'vi'
    ];
    for (const code of expectedCodes) {
      expect(supportedLanguages[code]).toBeDefined();
    }
  });

  test('loadLanguage function is exported', () => {
    const i18nModule = require('../../i18n/index');
    loadLanguage = i18nModule.loadLanguage;
    expect(typeof loadLanguage).toBe('function');
  });

  test('loadLanguage returns immediately for English', async () => {
    const i18nModule = require('../../i18n/index');
    loadLanguage = i18nModule.loadLanguage;
    // Should not throw and should return immediately
    await expect(loadLanguage('en')).resolves.toBeUndefined();
  });

  test('default export is the i18n instance', () => {
    const i18nModule = require('../../i18n/index');
    expect(i18nModule.default).toBeDefined();
    expect(i18nModule.default.use).toBeDefined();
    expect(i18nModule.default.init).toBeDefined();
  });

  test('SupportedLanguage type maps to valid keys', () => {
    const i18nModule = require('../../i18n/index');
    supportedLanguages = i18nModule.supportedLanguages;
    // Verify that language codes are valid ISO 639-1 codes (2-letter)
    for (const code of Object.keys(supportedLanguages)) {
      expect(code).toMatch(/^[a-z]{2}$/);
    }
  });
});
