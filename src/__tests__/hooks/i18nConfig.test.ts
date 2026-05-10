import { loadLanguage, supportedLanguages, SupportedLanguage } from '../../i18n';
import i18n from '../../i18n';

describe('i18n configuration', () => {
  beforeEach(() => {
    // Reset document direction and lang
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  });

  test('supportedLanguages contains English', () => {
    expect(supportedLanguages.en).toBeDefined();
    expect(supportedLanguages.en.name).toBe('English');
  });

  test('supportedLanguages has 26 languages', () => {
    expect(Object.keys(supportedLanguages).length).toBe(26);
  });

  test('Arabic is marked as RTL', () => {
    expect(supportedLanguages.ar.dir).toBe('rtl');
  });

  test('loadLanguage returns immediately for English', async () => {
    // Should not throw or do anything
    await loadLanguage('en');
  });

  test('loadLanguage returns immediately for already-loaded language', async () => {
    // English is always loaded, calling again should be no-op
    await loadLanguage('en');
  });

  test('loadLanguage returns for unknown language', async () => {
    // Should not throw for an unsupported language code
    await loadLanguage('xx');
  });

  test('loadLanguage loads non-English language', async () => {
    const hasBundle = i18n.hasResourceBundle('fr', 'translation');
    if (!hasBundle) {
      await loadLanguage('fr');
      expect(i18n.hasResourceBundle('fr', 'translation')).toBe(true);
    }
  });

  test('language change event sets document dir for RTL language', () => {
    // Simulate language change to Arabic
    i18n.emit('languageChanged', 'ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  test('language change event sets document lang attribute', () => {
    i18n.emit('languageChanged', 'fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  test('language change to LTR language sets dir to ltr', () => {
    // First set to RTL
    document.documentElement.dir = 'rtl';
    i18n.emit('languageChanged', 'es');
    expect(document.documentElement.dir).toBe('ltr');
  });

  test('all non-English languages have LTR dir except Arabic', () => {
    const rtlLanguages = Object.entries(supportedLanguages)
      .filter(([, config]) => config.dir === 'rtl')
      .map(([code]) => code);
    expect(rtlLanguages).toEqual(['ar']);
  });

  test('each supported language has name and nativeName', () => {
    Object.entries(supportedLanguages).forEach(([code, config]) => {
      expect(config.name).toBeTruthy();
      expect(config.nativeName).toBeTruthy();
    });
  });

  test('i18n defaults to English', () => {
    expect(i18n.language).toBe('en');
  });

  test('i18n fallback language is English', () => {
    const fallback = i18n.options.fallbackLng;
    // fallback can be string or array
    if (Array.isArray(fallback)) {
      expect(fallback).toContain('en');
    } else {
      expect(fallback).toBe('en');
    }
  });
});
